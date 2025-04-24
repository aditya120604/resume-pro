
import { useLocation, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { AnalysisResults, ResumeAnalysis } from "@/components/AnalysisResults";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Share2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const resumeId = location.state?.resumeId;

  const { data: analysis, isLoading } = useQuery({
    queryKey: ['analysis', resumeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('resume_analyses')
        .select('*')
        .eq('resume_id', resumeId)
        .single();

      if (error) {
        console.error('Error fetching analysis:', error);
        throw error;
      }

      return data as ResumeAnalysis;
    },
    enabled: !!resumeId
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-1 container py-8">
          <div>Loading analysis results...</div>
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
            <div className="text-center py-12">
              <p>No analysis results found. Please try uploading your resume again.</p>
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
