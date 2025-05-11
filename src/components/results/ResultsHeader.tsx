
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Share2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";

interface ResultsHeaderProps {
  title: string;
}

export function ResultsHeader({ title }: ResultsHeaderProps) {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/dashboard");
  };

  const handleDownloadReport = () => {
    toast.info("Download functionality would be implemented here");
  };

  const handleShareResults = () => {
    toast.info("Share functionality would be implemented here");
  };

  return (
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
        <h1 className="text-3xl font-bold text-resume-dark">{title}</h1>
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
  );
}
