
import { useLocation } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { AnalysisResults } from "@/components/AnalysisResults";
import { ErrorState } from "@/components/results/ErrorState";
import { LoadingState } from "@/components/results/LoadingState";
import { ResultsHeader } from "@/components/results/ResultsHeader";
import { useResumeAnalysis } from "@/hooks/useResumeAnalysis";
import { useEffect } from "react";

export default function Results() {
  const location = useLocation();
  const resumeId = location.state?.resumeId;
  
  // If there's no resumeId in location state, check URL parameters
  // This fixes the issue where the page is blank after direct navigation
  const urlParams = new URLSearchParams(location.search);
  const urlResumeId = urlParams.get('id');
  
  // Use resumeId from location state or URL parameter
  const effectiveResumeId = resumeId || urlResumeId;
  
  const { data: analysis, isLoading, error } = useResumeAnalysis({
    resumeId: effectiveResumeId
  });

  // Log what's happening to debug the blank page issue
  useEffect(() => {
    console.log('Results page loaded with:', {
      locationStateResumeId: resumeId,
      urlParamResumeId: urlResumeId,
      effectiveResumeId,
      hasAnalysis: !!analysis,
      isLoading,
      hasError: !!error
    });
  }, [resumeId, urlResumeId, effectiveResumeId, analysis, isLoading, error]);

  // Check if we're missing the resumeId
  if (!effectiveResumeId) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-1 container py-8">
          <ErrorState 
            title="No Resume Selected" 
            description="No resume ID was provided. Please upload your resume from the dashboard." 
          />
        </main>
      </div>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-1 container py-8 flex flex-col items-center justify-center">
          <LoadingState />
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
          <ErrorState 
            title="Error" 
            description={error instanceof Error ? error.message : "An error occurred while loading your analysis results."}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <main className="flex-1 container py-8">
        <ResultsHeader title="Resume Analysis Results" />
        
        <div className="mb-8">
          {analysis ? (
            <AnalysisResults analysis={analysis} />
          ) : (
            <ErrorState 
              title="No Results Found" 
              description="We couldn't find any analysis results for this resume. Please try uploading your resume again." 
            />
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
