
import { FileText, CheckCircle, LineChart, Award } from "lucide-react";

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

export function HomeFeatures() {
  return (
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
  );
}
