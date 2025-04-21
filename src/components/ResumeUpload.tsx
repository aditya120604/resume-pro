
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import { ResumeDropZone } from "./ResumeDropZone";
import { ResumeUploadProgress } from "./ResumeUploadProgress";
import { UploadedResumeSummary } from "./UploadedResumeSummary";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";

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
  const [isProcessing, setIsProcessing] = useState(false);

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
        });

      // Simulate progress since we can't track it
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(Math.min(progress, 90));
        if (progress >= 90) clearInterval(interval);
      }, 300);

      if (uploadError) {
        clearInterval(interval);
        throw uploadError;
      }

      // Set to 100% after upload completes
      clearInterval(interval);
      setUploadProgress(100);

      // Now processing with OpenAI
      setIsUploading(false);
      setIsProcessing(true);
      
      // Read file to send to analyze function
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const text = e.target?.result as string;
          
          const { error: analysisError } = await supabase.functions
            .invoke('analyze-resume', {
              body: { resumeId: resumeData.id, text }
            });

          if (analysisError) throw analysisError;

          // Wait for analysis to complete before showing results
          let analysisStatus = 'processing';
          let attempts = 0;
          const checkStatus = setInterval(async () => {
            const { data: resume } = await supabase
              .from('resumes')
              .select('analysis_status')
              .eq('id', resumeData.id)
              .single();
            
            if (resume?.analysis_status === 'completed') {
              clearInterval(checkStatus);
              setIsProcessing(false);
              
              // Get the analysis data
              const { data: analysis } = await supabase
                .from('resume_analyses')
                .select('*')
                .eq('resume_id', resumeData.id)
                .single();
                
              if (analysis) {
                onFileUploaded(file, resumeData.id);
                toast({
                  title: "Resume analyzed successfully",
                  description: "Your resume analysis is now available.",
                });
              }
            }
            
            attempts++;
            if (attempts > 20) {  // Timeout after ~20 seconds
              clearInterval(checkStatus);
              setIsProcessing(false);
              throw new Error("Analysis timed out. Please try again.");
            }
          }, 1000);
          
        } catch (error) {
          console.error("Error during analysis:", error);
          setIsProcessing(false);
          setError("Failed to analyze resume. Please try again.");
        }
      };

      reader.onerror = () => {
        setIsProcessing(false);
        setError("Failed to read file. Please try again.");
      };

      reader.readAsText(file);
      
    } catch (error) {
      console.error('Upload error:', error);
      setError('An error occurred while uploading your resume.');
      setIsUploading(false);
      setIsProcessing(false);
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
        ) : isProcessing ? (
          <div className="flex flex-col items-center justify-center py-6 space-y-4">
            <Loader2 className="h-8 w-8 text-resume-primary animate-spin" />
            <div className="text-center">
              <p className="font-medium">Analyzing your resume...</p>
              <p className="text-sm text-muted-foreground">This may take a few moments</p>
            </div>
          </div>
        ) : error ? (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : (
          <UploadedResumeSummary file={file} onChange={() => setFile(null)} />
        )}
      </CardContent>
    </Card>
  );
}
