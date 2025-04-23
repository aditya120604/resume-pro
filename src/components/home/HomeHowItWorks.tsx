
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function HomeHowItWorks() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-resume-dark mb-4">How ResumePro Works</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Optimize your resume in three simple steps to increase your chances of landing interviews
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-resume-accent rounded-full flex items-center justify-center mb-4">
              <span className="text-white font-bold">1</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">Upload Your Resume</h3>
            <p className="text-gray-600">
              Upload your current resume in PDF, DOC, or DOCX format to our secure platform.
            </p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-resume-accent rounded-full flex items-center justify-center mb-4">
              <span className="text-white font-bold">2</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">Get AI Analysis</h3>
            <p className="text-gray-600">
              Our AI analyzes your resume against ATS algorithms and industry standards.
            </p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-resume-accent rounded-full flex items-center justify-center mb-4">
              <span className="text-white font-bold">3</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">Improve & Apply</h3>
            <p className="text-gray-600">
              Follow our suggestions to optimize your resume and increase your interview chances.
            </p>
          </div>
        </div>
        <div className="mt-12 text-center">
          <Link to="/register">
            <Button className="bg-resume-primary hover:bg-resume-secondary">
              Try It Now <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
