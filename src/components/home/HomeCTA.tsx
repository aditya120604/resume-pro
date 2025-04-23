
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function HomeCTA() {
  return (
    <section className="bg-resume-primary py-16 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to Land More Interviews?</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
          Join thousands of job seekers who have improved their resume with ResumePro's ATS optimization tools.
        </p>
        <Link to="/register">
          <Button size="lg" className="bg-white text-resume-primary hover:bg-gray-100">
            Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
