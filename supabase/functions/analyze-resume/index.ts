
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
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

    // Analyze resume using OpenAI
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

    const aiResult = await openaiResponse.json();
    const analysis = JSON.parse(aiResult.choices[0].message.content);

    // Create Supabase client
    const supabaseClient = createClient(
      'https://pogdrjzralwigkrbjgwh.supabase.co',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Store analysis results
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

    if (error) throw error;

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
