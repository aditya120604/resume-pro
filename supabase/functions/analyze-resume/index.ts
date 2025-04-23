
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { resumeId, text } = await req.json();
    
    console.log(`Request received with resumeId: ${resumeId}`);
    console.log(`Text length: ${text ? text.length : 'undefined'}`);

    if (!resumeId || !text) {
      return new Response(JSON.stringify({ 
        error: 'Missing resumeId or text in request body' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    
    if (!openAIApiKey) {
      console.error("OpenAI API key not found");
      return new Response(JSON.stringify({ 
        error: 'OpenAI API key not configured' 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Processing resume ${resumeId} with text length: ${text.length}`);

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || 'https://pogdrjzralwigkrbjgwh.supabase.co';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseServiceKey) {
      console.error("Supabase service key not found");
      return new Response(JSON.stringify({ 
        error: 'Supabase service key not configured' 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseClient = createClient(
      supabaseUrl,
      supabaseServiceKey
    );

    // Check if the resume exists
    const { data: resumeData, error: resumeCheckError } = await supabaseClient
      .from('resumes')
      .select('*')
      .eq('id', resumeId)
      .single();

    if (resumeCheckError) {
      console.error(`Resume check error: ${JSON.stringify(resumeCheckError)}`);
      return new Response(JSON.stringify({ 
        error: `Resume not found: ${resumeCheckError.message}` 
      }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Update resume status to processing
    const { error: updateError } = await supabaseClient
      .from('resumes')
      .update({ analysis_status: 'processing' })
      .eq('id', resumeId);

    if (updateError) {
      console.error(`Error updating resume status: ${JSON.stringify(updateError)}`);
    } else {
      console.log("Resume status updated to processing");
    }

    // Analyze resume using OpenAI
    console.log("Calling OpenAI API...");
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an expert ATS (Applicant Tracking System) analyzer. Analyze resumes and provide detailed feedback in the following JSON format:
              {
                "score": <0-100 integer>,
                "keywordsMatched": [<strings>],
                "keywordsMissing": [<strings>],
                "sectionScores": {
                  "format": <0-100>,
                  "content": <0-100>,
                  "keywords": <0-100>,
                  "impact": <0-100>
                },
                "suggestions": [<strings>],
                "strengths": [<strings>]
              }`
          },
          {
            role: 'user',
            content: `Analyze this resume:\n${text}`
          }
        ],
        temperature: 0.7
      }),
    });

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text();
      console.error("OpenAI API error:", errorText);
      
      // Update resume status to failed
      await supabaseClient
        .from('resumes')
        .update({ analysis_status: 'failed' })
        .eq('id', resumeId);
        
      return new Response(JSON.stringify({ 
        error: `OpenAI API error: ${openaiResponse.status} - ${errorText}` 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const aiResult = await openaiResponse.json();
    console.log("OpenAI response received");
    
    let analysis;
    try {
      analysis = JSON.parse(aiResult.choices[0].message.content);
    } catch (parseError) {
      console.error("Failed to parse OpenAI response:", parseError);
      console.log("Raw content:", aiResult.choices[0].message.content);
      
      // Update resume status to failed
      await supabaseClient
        .from('resumes')
        .update({ analysis_status: 'failed' })
        .eq('id', resumeId);
        
      return new Response(JSON.stringify({ 
        error: 'Failed to parse analysis results' 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Store analysis results
    console.log("Storing analysis results in database");
    const { data, error } = await supabaseClient
      .from('resume_analyses')
      .insert({
        resume_id: resumeId,
        score: analysis.score,
        keywords_matched: analysis.keywordsMatched,
        keywords_missing: analysis.keywordsMissing,
        section_scores: analysis.sectionScores,
        suggestions: analysis.suggestions,
        strengths: analysis.strengths
      })
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      // Update resume status to failed
      await supabaseClient
        .from('resumes')
        .update({ analysis_status: 'failed' })
        .eq('id', resumeId);
        
      return new Response(JSON.stringify({ 
        error: `Database error: ${error.message}` 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log("Analysis complete, updating resume status");
    // Update resume status
    await supabaseClient
      .from('resumes')
      .update({ analysis_status: 'completed' })
      .eq('id', resumeId);

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
