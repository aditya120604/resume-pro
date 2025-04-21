
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUp, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";

interface FileUploadProps {
  onFileUploaded: (file: File, analysisId: string) => void;
}

export function ResumeUpload({ onFileUploaded }: FileUploadProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    const fileType = file.type;
    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (!validTypes.includes(fileType)) {
      setError("Please upload a PDF or Word document.");
      return;
    }

    if (!user) {
      setError("You must be logged in to upload a resume");
      return;
    }

    setError(null);
    setFile(file);
    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Create a record in the resumes table
      const filePath = `${user.id}/${file.name}`;
      
      const { data: resumeData, error: resumeError } = await supabase
        .from('resumes')
        .insert({
          user_id: user.id,
          file_name: file.name,
          file_type: fileType,
          file_path: filePath,
          analysis_status: 'uploading'
        })
        .select()
        .single();

      if (resumeError) throw resumeError;

      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
          onProgress: (progress) => {
            const percent = (progress.loaded / progress.total) * 100;
            setUploadProgress(percent);
          }
        });

      if (uploadError) throw uploadError;

      // Call the analyze-resume Edge Function
      const reader = new FileReader();
      reader.onload = async (e) => {
        const text = e.target?.result as string;
        
        const { error: analysisError } = await supabase.functions
          .invoke('analyze-resume', {
            body: { resumeId: resumeData.id, text }
          });

        if (analysisError) throw analysisError;

        setIsUploading(false);
        onFileUploaded(file, resumeData.id);
        
        toast({
          title: "Resume uploaded successfully",
          description: "Your resume is being analyzed. Results will be available shortly.",
        });
      };

      reader.readAsText(file);
    } catch (error) {
      console.error('Upload error:', error);
      setError('An error occurred while uploading your resume.');
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Upload Your Resume</CardTitle>
        <CardDescription>
          Drag and drop your resume file or click to browse
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!file ? (
          <div
            className={`border-2 border-dashed rounded-lg p-10 text-center ${
              isDragging ? "border-resume-primary bg-resume-accent/20" : "border-muted"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
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
                  onChange={handleFileChange}
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
        ) : isUploading ? (
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
        ) : (
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
              onClick={() => setFile(null)}
            >
              Change
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
