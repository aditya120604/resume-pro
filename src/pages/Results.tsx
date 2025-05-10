
import { useLocation, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { AnalysisResults, ResumeAnalysis } from "@/components/AnalysisResults";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Share2, AlertCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const resumeId = location.state?.resumeId;

  const { data: analysis, isLoading, error } = useQuery({
    queryKey: ['analysis', resumeId],
    queryFn: async () => {
      // Handle the case where resumeId is not provided
      if (!resumeId) {
        console.error('No resumeId provided');
        throw new Error('No resume ID was provided');
      }

      console.log(`Fetching analysis for resumeId: ${resumeId}`);
      
      const { data, error } = await supabase
        .from('resume_analyses')
        .select('*')
        .eq('resume_id', resumeId)
        .maybeSingle(); // Using maybeSingle instead of single to prevent errors when no records are found

      if (error) {
        console.error('Error fetching analysis:', error);
        throw error;
      }

      if (!data) {
        console.error('No analysis found for the given resumeId');
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
    retry: 3, // Retry up to 3 times if the query fails
    retryDelay: 1000 // Wait 1 second between retries
  });

  const handleGoBack = () => {
    navigate("/dashboard");
  };

  const handleDownloadReport = () => {
    // In a real app, this would generate and download a PDF report
    alert("Download functionality would be implemented here");
  };

  const handleShareResults = () => {
    // In a real app, this would open a sharing dialog
    alert("Share functionality would be implemented here");
  };

  // Check if we're missing the resumeId
  if (!resumeId) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-1 container py-8">
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              No resume ID was provided. Please upload your resume from the dashboard.
            </AlertDescription>
          </Alert>
          <Button onClick={() => navigate("/dashboard")} variant="outline">
            Go to Dashboard
          </Button>
        </main>
      </div>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-1 container py-8">
          <div className="text-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-resume-primary mx-auto mb-4"></div>
            <p className="text-lg font-medium">Loading analysis results...</p>
            <p className="text-sm text-muted-foreground mt-2">This may take a few moments</p>
          </div>
        </main>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-1 container py-8">
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error instanceof Error ? error.message : "An error occurred while loading your analysis results."}
            </AlertDescription>
          </Alert>
          <Button onClick={() => navigate("/dashboard")} variant="outline">
            Go to Dashboard
          </Button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <main className="flex-1 container py-8">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <Button 
              variant="ghost" 
              onClick={handleGoBack}
              className="mb-2 pl-0 hover:bg-transparent hover:text-resume-primary"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
            <h1 className="text-3xl font-bold text-resume-dark">Resume Analysis Results</h1>
          </div>
          
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={handleShareResults}
              className="flex items-center gap-2"
            >
              <Share2 className="h-4 w-4" />
              Share
            </Button>
            <Button 
              onClick={handleDownloadReport}
              className="flex items-center gap-2 bg-resume-primary hover:bg-resume-secondary"
            >
              <Download className="h-4 w-4" />
              Download Report
            </Button>
          </div>
        </div>
        
        <div className="mb-8">
          {analysis ? (
            <AnalysisResults analysis={analysis} />
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm border p-8">
              <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">No Analysis Results Found</h2>
              <p className="text-muted-foreground mb-6">
                We couldn't find any analysis results for this resume. Please try uploading your resume again.
              </p>
              <Button 
                onClick={handleGoBack}
                variant="outline"
                className="mt-4"
              >
                Go to Dashboard
              </Button>
            </div>
          )}
        </div>
      </main>
      
      <footer className="border-t bg-white py-4">
        <div className="container flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">&copy; 2025 ResumePro. All rights reserved.</p>
          <div className="flex gap-4 mt-2 md:mt-0">
            <a href="#" className="text-sm text-muted-foreground hover:text-resume-primary">Privacy Policy</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-resume-primary">Terms of Service</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-resume-primary">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
