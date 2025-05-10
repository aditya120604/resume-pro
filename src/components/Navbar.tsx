
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  LayoutDashboard,
  FileText,
  LogOut,
  User,
  Shield
} from "lucide-react";

export function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();

  const { data: isAdmin } = useQuery({
    queryKey: ['is-admin', user?.id],
    queryFn: async () => {
      if (!user?.id) return false;
      const { data, error } = await supabase
        .rpc('is_admin', { user_id: user.id });

      if (error) {
        console.error('Error checking admin status:', error);
        return false;
      }

      return data;
    },
    enabled: !!user
  });

  return (
    <nav className="border-b bg-white shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center">
          <FileText className="h-6 w-6 text-resume-primary mr-2" />
          <span className="text-xl font-bold text-resume-dark">ResumePro</span>
        </Link>
        
        {isAuthenticated ? (
          <div className="flex items-center gap-4">
            <Link to="/dashboard">
              <Button variant="outline" size="sm" className="hidden md:flex">
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
            </Link>
            
            {isAdmin && (
              <Link to="/admin">
                <Button variant="outline" size="sm" className="hidden md:flex">
                  <Shield className="h-4 w-4 mr-2" />
                  Admin
                </Button>
              </Link>
            )}
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground hidden md:inline">
                {user?.name}
              </span>
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full bg-gray-100 hover:bg-gray-200"
                asChild
              >
                <Link to="/profile">
                  <User className="h-5 w-5 text-resume-dark" />
                </Link>
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={logout} 
                className="text-muted-foreground hover:text-destructive"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="outline">Log In</Button>
            </Link>
            <Link to="/register">
              <Button className="bg-resume-primary hover:bg-resume-secondary">Sign Up</Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
