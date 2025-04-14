
import { useLocation, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { AnalysisResults, ResumeAnalysis } from "@/components/AnalysisResults";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Share2 } from "lucide-react";

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // In a real app, we would get this from the location state or API
  // For demo, we'll use a mock result
  const mockAnalysis: ResumeAnalysis = {
    score: 78,
    keywordMatches: {
      matched: ["leadership", "project management", "teamwork", "communication", "JavaScript", "React"],
      missing: ["TypeScript", "agile methodology", "problem-solving"],
    },
    sectionScores: {
      format: 85,
      content: 75,
      keywords: 70,
      impact: 82,
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
          <AnalysisResults analysis={mockAnalysis} />
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
