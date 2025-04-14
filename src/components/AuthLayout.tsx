
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
    <div className="flex min-h-screen flex-col bg-background">
      <div className="flex flex-1">
        <div className="flex flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div className="mb-10 flex items-center">
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
        <div className="relative hidden h-full flex-1 items-center justify-center lg:flex">
          <div 
            className="absolute inset-0 bg-gradient-to-br from-resume-primary to-resume-tertiary opacity-90"
            style={{ 
              backgroundImage: "url('https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=2070')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundBlendMode: "overlay"
            }}
          >
          </div>
          <div className="relative z-10 px-8 max-w-2xl text-center text-white">
            <h1 className="text-4xl font-bold mb-4">
              Optimize Your Resume for ATS Success
            </h1>
            <p className="text-xl opacity-90">
              Our advanced AI analysis ensures your resume stands out to both applicant tracking systems and human recruiters.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
