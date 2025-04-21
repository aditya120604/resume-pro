
import { FileText } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface ResumeUploadProgressProps {
  file: File;
  uploadProgress: number;
}

export function ResumeUploadProgress({ file, uploadProgress }: ResumeUploadProgressProps) {
  return (
    <div className="space-y-4 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <FileText className="h-8 w-8 text-resume-primary" />
          <div>
            <p className="text-sm font-medium">{file.name}</p>
            <p className="text-xs text-muted-foreground">
              {(file.size / 1024).toFixed(1)} KB
            </p>
          </div>
        </div>
        <span className="text-sm text-muted-foreground">{uploadProgress}%</span>
      </div>
      <Progress value={uploadProgress} className="h-2" />
    </div>
  );
}
