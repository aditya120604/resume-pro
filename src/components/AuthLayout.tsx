
import { ReactNode } from "react";
import { FileText } from "lucide-react";
import { Link } from "react-router-dom";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md px-6 py-8">
        <div className="mb-8 flex items-center">
          <Link to="/" className="flex items-center">
            <FileText className="h-8 w-8 text-resume-tertiary mr-2" />
            <span className="text-2xl font-bold text-foreground">ResumePro</span>
          </Link>
        </div>
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground">{title}</h2>
          <p className="mt-2 text-base text-muted-foreground">
            {subtitle}
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
