
import { FileUp, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ResumeDropZoneProps {
  isDragging: boolean;
  error: string | null;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ResumeDropZone({
  isDragging,
  error,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileChange
}: ResumeDropZoneProps) {
  return (
    <div
      className={`border-2 border-dashed rounded-lg p-10 text-center ${
        isDragging ? "border-resume-primary bg-resume-accent/20" : "border-muted"
      }`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="rounded-full bg-resume-accent/30 p-3">
          <FileUp className="h-8 w-8 text-resume-primary" />
        </div>
        <div>
          <p className="text-lg font-medium">Drag your resume here</p>
          <p className="text-sm text-muted-foreground">
            Supports PDF, DOC, and DOCX files
          </p>
        </div>
        <div>
          <input
            type="file"
            id="resume-upload"
            className="hidden"
            accept=".pdf,.doc,.docx"
            onChange={onFileChange}
          />
          <Button
            onClick={() => document.getElementById("resume-upload")?.click()}
            variant="outline"
            className="text-resume-primary bg-white hover:bg-gray-100"
          >
            Browse Files
          </Button>
        </div>
        {error && (
          <div className="flex items-center text-destructive gap-2">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}
      </div>
    </div>
  );
}
