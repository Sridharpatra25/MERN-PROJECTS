import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, ExternalLink } from "lucide-react";

const Hero = () => {
  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-accent relative overflow-hidden">
      <div className="section-container py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <Badge variant="secondary" className="w-fit">
              AVAILABLE FOR WORK
            </Badge>
            
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Hi, I'm{" "}
                <span className="gradient-text">
                  A Sridhar Patra
                </span>
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                A final-year Computer Science student at Gandhi Institute of Excellent Technocrats, 
                Bhubaneswar, passionate about Full-Stack Web Development with strong foundations 
                in Java, Python, and OOP.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="btn-gradient shadow-medium hover:shadow-strong transition-all duration-300"
                onClick={() => scrollToSection('portfolio')}
              >
                <ExternalLink className="w-5 h-5 mr-2" />
                View Portfolio
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                onClick={() => scrollToSection('contact')}
              >
                <Mail className="w-5 h-5 mr-2" />
                Contact Me
              </Button>
            </div>

            {/* Quick Skills */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-muted-foreground">KEY SKILLS</p>
              <div className="flex flex-wrap gap-2">
                {['Python', 'Java', 'JavaScript', 'React.js', 'Node.js', 'MongoDB'].map((skill) => (
                  <Badge key={skill} variant="outline" className="text-sm">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Profile Picture */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <div className="w-80 h-80 rounded-3xl overflow-hidden shadow-strong bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                <div className="text-6xl font-bold text-primary/40">AS</div>
              </div>
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-primary rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-gradient-secondary rounded-full opacity-30 animate-pulse delay-300"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;