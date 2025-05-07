
import { useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import { ResumeDropZone } from "./ResumeDropZone";
import { ResumeUploadProgress } from "./ResumeUploadProgress";
import { UploadedResumeSummary } from "./UploadedResumeSummary";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";

interface FileUploadProps {
  onFileUploaded: (file: File, analysisId: string) => void;
}

const JOB_FIELDS = [
  "Software Development",
  "Data Science",
  "Product Management",
  "Marketing",
  "Sales",
  "Finance",
  "Human Resources",
  "Design",
  "Customer Support",
  "Other"
];

export function ResumeUpload({ onFileUploaded }: FileUploadProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [showJobFieldForm, setShowJobFieldForm] = useState(false);
  const [jobField, setJobField] = useState<string>("");

  const form = useForm({
    defaultValues: {
      jobField: ""
    }
  });

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
      const selectedFile = e.dataTransfer.files[0];
      validateAndSetFile(selectedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      validateAndSetFile(selectedFile);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    const fileType = selectedFile.type;
    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];
    
    if (!validTypes.includes(fileType)) {
      setError("Please upload a PDF, Word document, or text file.");
      return;
    }

    if (!user) {
      setError("You must be logged in to upload a resume");
      return;
    }

    setError(null);
    setFile(selectedFile);
    setShowJobFieldForm(true);
  };

  const handleRetry = () => {
    if (file) {
      setRetryCount(retryCount + 1);
      setError(null);
      setShowJobFieldForm(true);
    } else {
      setError("No file selected. Please upload a resume first.");
    }
  };
  
  const handleJobFieldSubmit = (data: { jobField: string }) => {
    if (file) {
      setJobField(data.jobField);
      handleFile(file, data.jobField);
    }
  };

  const handleFile = async (file: File, selectedJobField: string) => {
    if (!user) {
      setError("You must be logged in to upload a resume");
      return;
    }

    setError(null);
    setIsUploading(true);
    setUploadProgress(0);
    setShowJobFieldForm(false);

    try {
      console.log(`Starting upload for file: ${file.name}, size: ${file.size} bytes for job field: ${selectedJobField}`);
      
      // Create a record in the resumes table
      const filePath = `${user.id}/${Date.now()}-${file.name}`;
      
      const { data: resumeData, error: resumeError } = await supabase
        .from('resumes')
        .insert({
          user_id: user.id,
          file_name: file.name,
          file_type: file.type,
          file_path: filePath,
          analysis_status: 'uploading',
          job_field: selectedJobField
        })
        .select()
        .single();

      if (resumeError) {
        console.error('Error creating resume record:', resumeError);
        throw new Error(`Database error: ${resumeError.message}`);
      }

      console.log('Resume record created:', resumeData.id);

      // Upload file to storage
      setUploadProgress(20);
      
      const { error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        throw new Error(`Storage error: ${uploadError.message}`);
      }

      console.log('File uploaded successfully to storage');
      setUploadProgress(70);

      // Read file to send to analyze function
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const text = e.target?.result as string;
          console.log(`File read complete. Text length: ${text.length}`);
          setUploadProgress(80);
          
          // Now processing with OpenAI
          setIsUploading(false);
          setIsProcessing(true);
          
          console.log(`Invoking analyze-resume function with resumeId: ${resumeData.id}`);
          const { data: analysisResponse, error: analysisError } = await supabase.functions
            .invoke('analyze-resume', {
              body: { resumeId: resumeData.id, text, jobField: selectedJobField }
            });

          if (analysisError) {
            console.error('Analysis function error:', analysisError);
            throw new Error(`Analysis error: ${analysisError.message}`);
          }

          // Check if the response has a userMessage property, which indicates an error
          if (analysisResponse && analysisResponse.userMessage) {
            throw new Error(analysisResponse.userMessage);
          }

          console.log('Analysis function call successful:', analysisResponse);

          // Wait for analysis to complete before showing results
          let attempts = 0;
          const maxAttempts = 30; // Increased from 20 to 30 attempts (30 seconds)
          
          const checkStatus = setInterval(async () => {
            try {
              const { data: resume, error: statusError } = await supabase
                .from('resumes')
                .select('analysis_status')
                .eq('id', resumeData.id)
                .single();
              
              if (statusError) {
                console.error('Status check error:', statusError);
                throw statusError;
              }
              
              console.log(`Analysis status check (${attempts}): ${resume?.analysis_status}`);
              
              if (resume?.analysis_status === 'completed') {
                clearInterval(checkStatus);
                setIsProcessing(false);
                
                // Get the analysis data
                const { data: analysis, error: analysisDataError } = await supabase
                  .from('resume_analyses')
                  .select('*')
                  .eq('resume_id', resumeData.id)
                  .single();
                  
                if (analysisDataError) {
                  console.error('Analysis data fetch error:', analysisDataError);
                  throw analysisDataError;
                }
                
                if (analysis) {
                  onFileUploaded(file, resumeData.id);
                  toast({
                    title: "Resume analyzed successfully",
                    description: "Your resume analysis is now available.",
                  });
                }
              } else if (resume?.analysis_status === 'failed') {
                clearInterval(checkStatus);
                setIsProcessing(false);
                throw new Error("Analysis failed. Please try again.");
              }
              
              attempts++;
              if (attempts >= maxAttempts) {
                clearInterval(checkStatus);
                setIsProcessing(false);
                throw new Error("Analysis timed out. Please try again.");
              }
            } catch (statusCheckError) {
              clearInterval(checkStatus);
              setIsProcessing(false);
              console.error('Error during status check:', statusCheckError);
              throw statusCheckError;
            }
          }, 1000);
          
        } catch (error) {
          console.error("Error during analysis:", error);
          setIsProcessing(false);
          setError(error.message || "Failed to analyze resume. Please try again.");
          
          // Update the resume status to failed
          await supabase
            .from('resumes')
            .update({ analysis_status: 'failed' })
            .eq('id', resumeData.id);
        }
      };

      reader.onerror = (readerError) => {
        console.error('File reader error:', readerError);
        setIsProcessing(false);
        setError("Failed to read file. Please try again.");
      };

      console.log('Starting to read file as text');
      reader.readAsText(file);
      
    } catch (error) {
      console.error('Upload error:', error);
      setError(error.message || 'An error occurred while uploading your resume.');
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
        {showJobFieldForm && file ? (
          <div className="space-y-4">
            <h3 className="font-medium">Select Job Field</h3>
            <p className="text-sm text-muted-foreground">We'll tailor your resume analysis to this job field</p>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleJobFieldSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="jobField"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Field</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a job field" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {JOB_FIELDS.map(jobField => (
                            <SelectItem key={jobField} value={jobField}>{jobField}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <div className="flex justify-between">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setShowJobFieldForm(false);
                      setFile(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Continue</Button>
                </div>
              </form>
            </Form>
          </div>
        ) : !file ? (
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
          <div className="space-y-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <div className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => setFile(null)}
                className="mr-2"
              >
                Change File
              </Button>
              <Button 
                variant="default"
                onClick={handleRetry}
              >
                Retry Upload
              </Button>
            </div>
          </div>
        ) : (
          <UploadedResumeSummary file={file} onChange={() => setFile(null)} />
        )}
      </CardContent>
    </Card>
  );
}
