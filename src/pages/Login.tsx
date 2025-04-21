
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "@/components/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "@/components/ui/sonner";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email || !password) {
      setErrorMsg("Please fill in all fields");
      return;
    }

    try {
      const success = await login(email, password);
      if (success) {
        toast.success("Logged in successfully");
        navigate("/dashboard");
      } else {
        // Show a more helpful toast for common issues
        setErrorMsg("Invalid email or password. Please check your credentials or verify your email before logging in.");

        toast.error(
          <>
            <span>
              If you just registered, please check your email and click the confirmation link.
              <br />
              If you see "invalid or expired link", try registering again or ask for a new link from the login page.
            </span>
          </>,
          { duration: 7000 }
        );
      }
    } catch (error: any) {
      const errorMessage = error?.message || "An error occurred during login";
      // Extra detection for known auth issues
      if (
        errorMessage.match(/(not\s*confirmed|confirm\s*your\s*email|email\s*not\s*verified|Email not confirmed|Email link is invalid|expired)/i)
      ) {
        setErrorMsg("Your email has not been verified or the confirmation link expired. Please check your inbox for a valid confirmation link or try registering again.");
      } else {
        setErrorMsg(errorMessage);
      }
      console.error("Login error:", error);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to your ResumePro account"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-md text-sm">
            {errorMsg}
          </div>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link
              to="/forgot-password"
              className="text-sm font-medium text-resume-primary hover:text-resume-secondary"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              className="pl-10 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full bg-resume-primary hover:bg-resume-secondary"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Logging in...
            </>
          ) : (
            "Log in"
          )}
        </Button>

        <div className="text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-resume-primary hover:text-resume-secondary"
          >
            Sign up
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
