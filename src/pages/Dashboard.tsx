
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Navbar } from "@/components/Navbar";
import { ResumeUpload } from "@/components/ResumeUpload";
import { AnalysisResults, ResumeAnalysis } from "@/components/AnalysisResults";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, FileText, BarChart3 } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<ResumeAnalysis | null>(null);
  const [activeTab, setActiveTab] = useState("upload");

  useEffect(() => {
    if (uploadedFile && !analysisResults) {
      handleAnalyzeResume();
    }
  }, [uploadedFile]);

  const handleFileUploaded = (file: File) => {
    setUploadedFile(file);
  };

  const handleAnalyzeResume = () => {
    if (!uploadedFile) return;
    
    setIsAnalyzing(true);
    
    // Simulate API call for resume analysis
    setTimeout(() => {
      // Mock analysis results
      const mockAnalysis: ResumeAnalysis = {
        score: Math.floor(Math.random() * 30) + 55, // Score between 55-85
        keywordMatches: {
          matched: ["leadership", "project management", "teamwork", "communication", "JavaScript", "React"],
          missing: ["TypeScript", "agile methodology", "problem-solving"],
        },
        sectionScores: {
          format: Math.floor(Math.random() * 20) + 70, // Score between 70-90
          content: Math.floor(Math.random() * 30) + 60, // Score between 60-90
          keywords: Math.floor(Math.random() * 40) + 50, // Score between 50-90
          impact: Math.floor(Math.random() * 30) + 60, // Score between 60-90
        },
        suggestions: [
          "Add more action verbs to your experience descriptions.",
          "Include specific metrics and achievements to quantify your impact.",
          "Add missing keywords like 'TypeScript' and 'problem-solving' to improve ATS match.",
          "Use a more ATS-friendly resume format with clear section headings.",
          "Keep your resume to one page if you have less than 10 years of experience."
        ],
        strengths: [
          "Strong emphasis on collaborative teamwork.",
          "Good use of technical skills section.",
          "Clear chronological work history.",
          "Effective use of industry-relevant keywords.",
          "Well-structured education section."
        ]
      };
      
      setAnalysisResults(mockAnalysis);
      setIsAnalyzing(false);
      setAnalysisComplete(true);
      setActiveTab("results");
    }, 3000);
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
                
                {uploadedFile && (
                  <div className="mt-6 flex justify-center">
                    <Button 
                      onClick={handleAnalyzeResume}
                      disabled={isAnalyzing}
                      size="lg"
                      className="bg-resume-primary hover:bg-resume-secondary"
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Analyzing your resume...
                        </>
                      ) : (
                        "Analyze Resume"
                      )}
                    </Button>
                  </div>
                )}
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
            {analysisResults && (
              <AnalysisResults analysis={analysisResults} />
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
