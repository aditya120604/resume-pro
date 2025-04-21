
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UploadedResumeSummaryProps {
  file: File;
  onChange: () => void;
}

export function UploadedResumeSummary({ file, onChange }: UploadedResumeSummaryProps) {
  return (
    <div className="flex items-center justify-between bg-muted/30 p-4 rounded-lg">
      <div className="flex items-center space-x-3">
        <CheckCircle2 className="h-6 w-6 text-green-600" />
        <div>
          <p className="text-sm font-medium">{file.name}</p>
          <p className="text-xs text-muted-foreground">
            {(file.size / 1024).toFixed(1)} KB • Uploaded successfully
          </p>
        </div>
      </div>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={onChange}
      >
        Change
      </Button>
    </div>
  );
}
