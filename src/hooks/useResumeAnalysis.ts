
import { supabase } from "@/integrations/supabase/client";
import { ResumeAnalysis } from "@/components/AnalysisResults";
import { useQuery } from "@tanstack/react-query";
import { toast } from "@/components/ui/sonner";

interface UseResumeAnalysisOptions {
  resumeId: string | null;
  redirectOnError?: boolean;
}

export function useResumeAnalysis({ resumeId, redirectOnError = false }: UseResumeAnalysisOptions) {
  return useQuery({
    queryKey: ['analysis', resumeId],
    queryFn: async () => {
      // Handle the case where resumeId is not provided
      if (!resumeId) {
        console.error('No resumeId provided');
        throw new Error('No resume ID was provided');
      }

      console.log(`Fetching analysis for resumeId: ${resumeId}`);
      
      // First check if the resume record exists
      const { data: resumeData, error: resumeError } = await supabase
        .from('resumes')
        .select('analysis_status, file_name')
        .eq('id', resumeId)
        .maybeSingle();
        
      if (resumeError) {
        console.error('Error fetching resume:', resumeError);
        throw new Error('Error fetching resume information');
      }

      if (!resumeData) {
        console.error('No resume found with ID:', resumeId);
        throw new Error('Resume not found');
      }
      
      // Check analysis status
      if (resumeData.analysis_status !== 'completed') {
        console.log('Analysis not completed yet, status:', resumeData.analysis_status);
        
        // If the analysis failed, throw a specific error
        if (resumeData.analysis_status === 'failed') {
          throw new Error('Analysis failed. Please try uploading your resume again.');
        }
        
        // If it's still processing, throw a different error
        throw new Error(`Analysis is still ${resumeData.analysis_status}`);
      }

      // Get the analysis results
      const { data, error } = await supabase
        .from('resume_analyses')
        .select('*')
        .eq('resume_id', resumeId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching analysis:', error);
        throw error;
      }

      if (!data) {
        console.error('No analysis found for the given resumeId:', resumeId);
        throw new Error('No analysis results found');
      }

      console.log('Analysis data retrieved:', data);

      // Transform the data to match our ResumeAnalysis type
      const transformedData: ResumeAnalysis = {
        score: data.score,
        keywordMatches: {
          matched: data.keywords_matched || [],
          missing: data.keywords_missing || []
        },
        sectionScores: data.section_scores as {
          format: number;
          content: number;
          keywords: number;
          impact: number;
        },
        suggestions: data.suggestions || [],
        strengths: data.strengths || []
      };

      return transformedData;
    },
    enabled: !!resumeId,
    retry: 3,
    retryDelay: 1000,
    meta: {
      onSuccess: () => {
        console.log('Analysis loaded successfully');
      },
      onError: (err: Error) => {
        console.error('Query error:', err);
        toast.error(err.message || "An error occurred while loading your analysis");
      }
    }
  });
}
