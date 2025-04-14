
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { 
  FileText, 
  CheckCircle, 
  LineChart, 
  Award,
  ArrowRight 
} from "lucide-react";

export default function Index() {
  const features = [
    {
      icon: <FileText className="h-8 w-8 text-resume-primary" />,
      title: "ATS Optimization",
      description: "Ensure your resume gets past the automated screening systems used by employers."
    },
    {
      icon: <CheckCircle className="h-8 w-8 text-resume-primary" />,
      title: "Keyword Analysis",
      description: "Match your resume with job descriptions to include the most important keywords."
    },
    {
      icon: <LineChart className="h-8 w-8 text-resume-primary" />,
      title: "Performance Score",
      description: "Get a detailed score of how well your resume will perform in applicant tracking systems."
    },
    {
      icon: <Award className="h-8 w-8 text-resume-primary" />,
      title: "Improvement Tips",
      description: "Receive actionable suggestions to make your resume stand out to both ATS and recruiters."
    }
  ];

  const testimonials = [
    {
      quote: "ResumePro helped me optimize my resume that got me interviews at top tech companies!",
      author: "Michael S.",
      role: "Software Engineer"
    },
    {
      quote: "After using ResumePro, my interview callback rate increased by 70%. Totally worth it!",
      author: "Sarah L.",
      role: "Marketing Manager"
    },
    {
      quote: "The ATS analysis showed me exactly what was missing from my resume. Now I'm employed!",
      author: "James T.",
      role: "Data Analyst"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
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
      
      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-resume-dark mb-4">How ResumePro Works</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Optimize your resume in three simple steps to increase your chances of landing interviews
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-resume-accent rounded-full flex items-center justify-center mb-4">
                <span className="text-resume-primary font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Upload Your Resume</h3>
              <p className="text-gray-600">
                Upload your current resume in PDF, DOC, or DOCX format to our secure platform.
              </p>
            </div>
            
            {/* Step 2 */}
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-resume-accent rounded-full flex items-center justify-center mb-4">
                <span className="text-resume-primary font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Get AI Analysis</h3>
              <p className="text-gray-600">
                Our AI analyzes your resume against ATS algorithms and industry standards.
              </p>
            </div>
            
            {/* Step 3 */}
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-resume-accent rounded-full flex items-center justify-center mb-4">
                <span className="text-resume-primary font-bold">3</span>
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
      
      {/* Features */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-resume-dark mb-4">Why Choose ResumePro</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our comprehensive analysis gives you the edge in the job market
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="p-6">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-resume-dark mb-4">What Our Users Say</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join thousands of job seekers who have improved their resume with ResumePro
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
                <div className="mb-4 text-resume-primary">
                  {Array(5).fill(0).map((_, i) => (
                    <span key={i} className="text-2xl">★</span>
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">"{testimonial.quote}"</p>
                <div>
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA */}
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
      
      {/* Footer */}
      <footer className="bg-resume-dark py-12 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center mb-4">
                <FileText className="h-6 w-6 text-resume-primary mr-2" />
                <span className="text-xl font-bold">ResumePro</span>
              </div>
              <p className="text-gray-400">
                Advanced resume optimization for job seekers to pass ATS systems and land interviews.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Features</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Resources</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Resume Templates</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Data Processing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">&copy; 2025 ResumePro. All rights reserved.</p>
            <div className="mt-4 md:mt-0">
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  Twitter
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  LinkedIn
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  Facebook
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  Instagram
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
