import { Card } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

export function Testimonials() {
  const testimonials = [
    {
      name: "Sarah M.",
      sign: "Scorpio",
      rating: 5,
      text: "The soul mate analysis was incredibly accurate! It helped me understand my relationship patterns and find my perfect match.",
      location: "New York"
    },
    {
      name: "Emma L.",
      sign: "Pisces",
      rating: 5,
      text: "I've been using the daily horoscopes for months. They're always spot-on and have guided me through some amazing romantic experiences.",
      location: "California"
    },
    {
      name: "Jessica R.",
      sign: "Leo",
      rating: 5,
      text: "The compatibility readings saved my relationship! We learned so much about each other and how to communicate better.",
      location: "Texas"
    }
  ];

  return (
    <section id="testimonials" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground">
            Love Stories Written in the Stars
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover how our cosmic guidance has transformed thousands of love lives
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="cosmic-card p-6 space-y-4 floating-animation">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 bg-gradient-cosmic rounded-full flex items-center justify-center text-primary-foreground font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">{testimonial.name}</div>
                    <div className="text-sm text-accent">{testimonial.sign}</div>
                  </div>
                </div>
                <Quote className="h-6 w-6 text-secondary" />
              </div>

              <div className="flex space-x-1">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-secondary fill-current" />
                ))}
              </div>

              <p className="text-muted-foreground italic leading-relaxed">
                "{testimonial.text}"
              </p>

              <div className="text-sm text-muted-foreground">
                — {testimonial.location}
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="cosmic-card inline-block px-8 py-4">
            <div className="flex items-center space-x-4 text-muted-foreground">
              <div className="text-3xl font-display font-bold text-primary">10,000+</div>
              <div>
                <div className="font-semibold">Happy Customers</div>
                <div className="text-sm">Finding love through the stars</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}