
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import { ResumeDropZone } from "./ResumeDropZone";
import { ResumeUploadProgress } from "./ResumeUploadProgress";
import { UploadedResumeSummary } from "./UploadedResumeSummary";

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

      // Upload file to storage (onProgress not supported, so we'll skip progress for now)
      const { error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      setUploadProgress(100); // Instantly set to 100% since no progress

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
      setIsUploading(false);
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
          <ResumeDropZone
            isDragging={isDragging}
            error={error}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onFileChange={handleFileChange}
          />
        ) : isUploading ? (
          <ResumeUploadProgress file={file} uploadProgress={uploadProgress} />
        ) : (
          <UploadedResumeSummary file={file} onChange={() => setFile(null)} />
        )}
      </CardContent>
    </Card>
  );
}
