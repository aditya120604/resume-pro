
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface HomeHeroProps {
  isAuthenticated: boolean;
  userName?: string;
}

export function HomeHero({ isAuthenticated, userName }: HomeHeroProps) {
  if (isAuthenticated) {
    return (
      <section className="bg-gradient-to-br from-resume-primary to-resume-tertiary py-20 text-white">
        <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 mb-10 lg:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Welcome, {userName || "User"}!
            </h1>
            <p className="text-lg md:text-xl mb-8 opacity-90 max-w-lg">
              Jump right into your Dashboard to optimize, analyze, or download your tailored resume.
            </p>
            <div className="flex gap-4">
              <Link to="/dashboard">
                <Button size="lg" className="bg-white text-resume-primary hover:bg-gray-100 hover:text-resume-secondary shadow-md">
                  Go to Dashboard
                </Button>
              </Link>
            </div>
          </div>
          <div className="lg:w-1/2 lg:pl-10">
            <div className="relative">
              <img 
                src="/lovable-uploads/b135ffbc-ad8a-4df3-8f01-db210998c0b8.png"
                alt="Resume dashboard preview" 
                className="relative rounded-lg shadow-xl transform rotate-1 z-10 object-cover max-h-80"
              />
              <div className="absolute -bottom-5 -right-5 bg-white p-4 rounded-lg shadow-lg z-20">
                <div className="flex items-center gap-2">
                  <div className="text-resume-primary font-bold text-xl">97%</div>
                  <div className="text-sm text-gray-600">ATS Approval Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gradient-to-br from-resume-primary to-resume-tertiary py-20 text-white">
      <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center">
        <div className="lg:w-1/2 mb-10 lg:mb-0">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Get Your Resume Past the ATS and Into Human Hands
          </h1>
          <p className="text-lg md:text-xl mb-8 opacity-90 max-w-lg">
            Our AI-powered platform analyzes your resume against ATS algorithms to ensure you get more interviews and land your dream job.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/register">
              <Button size="lg" className="bg-white text-resume-primary hover:bg-gray-100 hover:text-resume-secondary">
                Get Started Free
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Log In
              </Button>
            </Link>
          </div>
        </div>
        <div className="lg:w-1/2 lg:pl-10">
          <div className="relative">
            <div className="absolute inset-0 bg-white/10 blur-xl rounded-lg transform -rotate-3"></div>
            <img 
              src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=1200" 
              alt="Resume Analysis" 
              className="relative rounded-lg shadow-xl transform rotate-1 z-10"
            />
            <div className="absolute -bottom-5 -right-5 bg-white p-4 rounded-lg shadow-lg z-20">
              <div className="flex items-center gap-2">
                <div className="text-resume-primary font-bold text-xl">97%</div>
                <div className="text-sm text-gray-600">ATS Approval Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

