
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import { ActivityLogTable } from "@/components/admin/ActivityLogTable";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function AdminDashboard() {
  const { user } = useAuth();

  const { data: isAdmin, isLoading } = useQuery({
    queryKey: ['is-admin', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('is_admin', { user_id: user?.id });

      if (error) {
        console.error('Error checking admin status:', error);
        return false;
      }

      return data;
    },
    enabled: !!user
  });

  if (isLoading) {
    return <div>Checking permissions...</div>;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">Activity Logs</h1>
      <ActivityLogTable />
    </div>
  );
}
