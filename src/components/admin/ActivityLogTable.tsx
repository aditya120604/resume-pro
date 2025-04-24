
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

interface ActivityLog {
  id: string;
  user_id: string;
  action_type: string;
  details: any;
  created_at: string;
}

export function ActivityLogTable() {
  const { session } = useAuth();

  const { data: logs, isLoading } = useQuery({
    queryKey: ['activity-logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('activity_logs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching activity logs:', error);
        throw error;
      }

      return data as ActivityLog[];
    },
    enabled: !!session
  });

  if (isLoading) {
    return <div>Loading activity logs...</div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Time</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>User ID</TableHead>
            <TableHead>Details</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs?.map((log) => (
            <TableRow key={log.id}>
              <TableCell>{format(new Date(log.created_at), 'PPpp')}</TableCell>
              <TableCell>{log.action_type}</TableCell>
              <TableCell className="font-mono text-xs">{log.user_id}</TableCell>
              <TableCell>{JSON.stringify(log.details)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
