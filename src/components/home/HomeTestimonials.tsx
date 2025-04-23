
const testimonials = [
  {
    quote: "ResumePro helped me create a professional resume that stands out in college placements. The AI insights are game-changing!",
    author: "Harsh Prajapati",
    role: "CE student"
  },
  {
    quote: "As an IT student, I was struggling with my resume format. ResumePro's detailed analysis helped me highlight my skills perfectly.",
    author: "Rina Joshi",
    role: "IT student"
  },
  {
    quote: "The ATS optimization feature is incredible. It gave me confidence in my resume before campus interviews.",
    author: "Tirth Patel",
    role: "CE student"
  }
];

export function HomeTestimonials() {
  return (
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
                <p className="font-semibold text-black">{testimonial.author}</p>
                <p className="text-sm text-gray-500">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
