
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  FileText,
  LogOut,
  User
} from "lucide-react";

export function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();

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
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground hidden md:inline">
                {user?.name}
              </span>
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full"
                asChild
              >
                <Link to="/profile">
                  <User className="h-5 w-5" />
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
