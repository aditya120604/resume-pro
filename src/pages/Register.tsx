import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "@/components/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "@/components/ui/sonner";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!name || !email || !password || !confirmPassword) {
      setErrorMsg("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match");
      return;
    }

    if (!agreeTerms) {
      setErrorMsg("Please agree to the terms and conditions");
      return;
    }

    try {
      const { success, message } = await register(name, email, password);

      if (success) {
        if (message.includes("check your email")) {
          setErrorMsg("");
          toast.success("Registration successful! Please check your email to confirm your account before logging in.");
          setTimeout(() => {
            setErrorMsg("Please check your email inbox and click the confirmation link before logging in. If you don't see the email, check your spam folder or try registering again.");
          }, 100);
        } else {
          toast.success(message);
          navigate("/dashboard");
        }
      } else {
        setErrorMsg(message);
      }
    } catch (error: any) {
      const errorMessage = error?.message || "An error occurred during registration";
      setErrorMsg(errorMessage);
      console.error("Registration error:", error);
    }
  };

  return (
    <AuthLayout
      title="Create an account"
      subtitle="Get started with ResumePro"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {errorMsg && (
          <div className="bg-destructive/15 border border-destructive text-destructive px-4 py-2 rounded-lg text-sm">
            {errorMsg}
          </div>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium">Full name</Label>
          <div className="relative">
            <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              required
              className="pl-10 bg-secondary/50 border-secondary"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">Email address</Label>
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
              className="pl-10 bg-secondary/50 border-secondary"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              required
              className="pl-10 pr-10 bg-secondary/50 border-secondary"
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

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              required
              className="pl-10 pr-10 bg-secondary/50 border-secondary"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox 
            id="terms" 
            checked={agreeTerms} 
            onCheckedChange={() => setAgreeTerms(!agreeTerms)} 
            className="data-[state=checked]:bg-resume-primary data-[state=checked]:border-resume-primary"
          />
          <Label
            htmlFor="terms"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            I agree to the{" "}
            <Link
              to="/terms"
              className="text-resume-tertiary hover:text-resume-secondary hover:underline"
            >
              terms of service
            </Link>{" "}
            and{" "}
            <Link
              to="/privacy"
              className="text-resume-tertiary hover:text-resume-secondary hover:underline"
            >
              privacy policy
            </Link>
          </Label>
        </div>

        <Button 
          type="submit" 
          className="w-full bg-resume-tertiary hover:bg-resume-secondary font-semibold"
          disabled={isLoading || !agreeTerms}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            "Create account"
          )}
        </Button>

        <div className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-resume-tertiary hover:text-resume-secondary"
          >
            Log in
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
