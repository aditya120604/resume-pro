
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Navbar } from "@/components/Navbar";
import { ResumeUpload } from "@/components/ResumeUpload";
import { AnalysisResults, ResumeAnalysis } from "@/components/AnalysisResults";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, BarChart3 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function Dashboard() {
  const { user } = useAuth();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<ResumeAnalysis | null>(null);
  const [activeTab, setActiveTab] = useState("upload");
  const [analysisId, setAnalysisId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if we have an analysis ID and fetch the results
    if (analysisId) {
      fetchAnalysisResults(analysisId);
    }
  }, [analysisId]);

  const handleFileUploaded = (file: File, resumeId: string) => {
    setUploadedFile(file);
    setAnalysisId(resumeId);
    setAnalysisComplete(true);
    setActiveTab("results");
  };

  const fetchAnalysisResults = async (resumeId: string) => {
    setIsLoading(true);
    try {
      // Get the analysis data from Supabase
      const { data, error } = await supabase
        .from('resume_analyses')
        .select('*')
        .eq('resume_id', resumeId)
        .single();

      if (error) throw error;

      if (data) {
        // Transform database data to match our component's expected format
        const analysisData: ResumeAnalysis = {
          score: data.score,
          keywordMatches: {
            matched: data.keywords_matched || [],
            missing: data.keywords_missing || [],
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
        
        setAnalysisResults(analysisData);
        setAnalysisComplete(true);
      }
    } catch (error) {
      console.error('Error fetching analysis results:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <main className="flex-1 container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-resume-dark">Welcome, {user?.name || "User"}!</h1>
          <p className="text-muted-foreground">Upload your resume for ATS analysis and optimization.</p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full sm:w-[400px] grid-cols-2">
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Upload Resume
            </TabsTrigger>
            <TabsTrigger 
              value="results" 
              disabled={!analysisComplete}
              className="flex items-center gap-2"
            >
              <BarChart3 className="h-4 w-4" />
              Analysis Results
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <ResumeUpload onFileUploaded={handleFileUploaded} />
              </div>
              
              <div className="bg-white p-6 rounded-lg border shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Optimize for ATS</h3>
                <div className="space-y-4 text-sm">
                  <div>
                    <h4 className="font-medium text-resume-primary">What is an ATS?</h4>
                    <p className="text-muted-foreground">
                      Applicant Tracking Systems are software used by employers to collect, scan, and rank job applications.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-resume-primary">How ResumePro helps</h4>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Identifies missing keywords</li>
                      <li>Analyzes resume format</li>
                      <li>Checks for ATS compatibility</li>
                      <li>Provides improvement suggestions</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-resume-primary">Pro Tips</h4>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Use a clean, simple format</li>
                      <li>Include keywords from the job description</li>
                      <li>Avoid images and complex formatting</li>
                      <li>Use standard section headings</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="results" className="mt-6">
            {isLoading ? (
              <div className="flex justify-center items-center p-12">
                <div className="flex flex-col items-center space-y-4">
                  <div className="rounded-full bg-resume-accent/30 p-3">
                    <BarChart3 className="h-8 w-8 text-resume-primary animate-pulse" />
                  </div>
                  <div className="text-center">
                    <p className="font-medium">Loading analysis results...</p>
                    <p className="text-sm text-muted-foreground">This will only take a moment</p>
                  </div>
                </div>
              </div>
            ) : analysisResults ? (
              <AnalysisResults analysis={analysisResults} />
            ) : (
              <div className="text-center py-12">
                <p>No analysis results available. Please upload a resume first.</p>
                <Button 
                  onClick={() => setActiveTab("upload")}
                  variant="outline"
                  className="mt-4"
                >
                  Go to Upload
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
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
