
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FileText, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ResumeWithAnalysis {
  id: string;
  file_name: string;
  uploaded_at: string;
  analysis_status: string;
  job_field: string | null;
  resume_analyses: {
    score: number;
    created_at: string;
  } | null;
}

export function PreviousAnalyses() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: previousAnalyses, isLoading } = useQuery({
    queryKey: ['previous-analyses', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('resumes')
        .select(`
          id,
          file_name,
          uploaded_at,
          analysis_status,
          job_field,
          resume_analyses (
            score,
            created_at
          )
        `)
        .eq('user_id', user?.id)
        .order('uploaded_at', { ascending: false });

      if (error) {
        console.error('Error fetching previous analyses:', error);
        throw error;
      }

      // Transform the data to match our expected type
      return data.map(item => {
        // If resume_analyses is an array with one item, extract it
        const analysisData = Array.isArray(item.resume_analyses) && item.resume_analyses.length > 0
          ? item.resume_analyses[0] 
          : null;
          
        return {
          ...item,
          resume_analyses: analysisData
        };
      }) as ResumeWithAnalysis[];
    },
    enabled: !!user
  });

  const viewAnalysis = (resumeId: string) => {
    navigate('/results', { state: { resumeId } });
  };

  if (isLoading) {
    return <div className="text-gray-800">Loading previous analyses...</div>;
  }

  if (!previousAnalyses?.length) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg border">
        <FileText className="mx-auto h-12 w-12 text-gray-600" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900">No analyses yet</h3>
        <p className="mt-1 text-sm text-gray-700">Upload your resume to get started.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-gray-900 font-semibold">File Name</TableHead>
            <TableHead className="text-gray-900 font-semibold">Job Field</TableHead>
            <TableHead className="text-gray-900 font-semibold">Upload Date</TableHead>
            <TableHead className="text-gray-900 font-semibold">Status</TableHead>
            <TableHead className="text-gray-900 font-semibold">Score</TableHead>
            <TableHead className="text-gray-900 font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {previousAnalyses.map((analysis) => (
            <TableRow key={analysis.id}>
              <TableCell className="font-medium text-gray-800">{analysis.file_name}</TableCell>
              <TableCell className="text-gray-800">{analysis.job_field || "Not specified"}</TableCell>
              <TableCell className="text-gray-800">{format(new Date(analysis.uploaded_at), 'PPp')}</TableCell>
              <TableCell>
                <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                  analysis.analysis_status === 'completed' 
                    ? 'bg-green-100 text-green-800' 
                    : analysis.analysis_status === 'failed'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {analysis.analysis_status.charAt(0).toUpperCase() + analysis.analysis_status.slice(1)}
                </span>
              </TableCell>
              <TableCell className="text-gray-800 font-semibold">
                {analysis.resume_analyses?.score ?? 'N/A'}
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => viewAnalysis(analysis.id)}
                  disabled={analysis.analysis_status !== 'completed'}
                  className="flex items-center gap-2 text-gray-700 hover:text-resume-primary"
                >
                  <Eye className="h-4 w-4" />
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
