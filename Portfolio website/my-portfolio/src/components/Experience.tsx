import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Calendar, MapPin, ExternalLink } from "lucide-react";

const Experience = () => {
  const experiences = [
    {
      title: "Web Development Intern",
      company: "East Coast Railway (ECOR)",
      location: "Bhubaneswar",
      period: "May 2025 – Jul 2025",
      type: "Internship",
      description: "Built a MERN-stack I-Card system with role-based forms, file uploads, API integration, MongoDB management, deployed via Vercel and Render.",
      technologies: ["MongoDB", "Express.js", "React.js", "Node.js", "Vercel", "Render"],
      highlights: [
        "Developed role-based authentication system",
        "Implemented file upload functionality",
        "Created RESTful API endpoints",
        "Managed MongoDB database operations",
        "Successfully deployed full-stack application"
      ]
    },
    {
      title: "Web Developer Intern",
      company: "Web Bocket",
      location: "Bhubaneswar",
      period: "May 2024 – Jul 2024",
      type: "Internship",
      description: "Python/Django internship involving database integration, user authentication, and RESTful APIs for multiple backend projects.",
      technologies: ["Python", "Django", "PostgreSQL", "REST APIs", "Git"],
      highlights: [
        "Developed multiple backend projects using Django",
        "Implemented user authentication systems",
        "Created database integration solutions",
        "Built RESTful API endpoints",
        "Collaborated on team projects"
      ]
    }
  ];

  return (
    <section id="experience" className="py-20 bg-gradient-accent">
      <div className="section-container">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Work <span className="gradient-text">Experience</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Hands-on experience building real-world applications and contributing to meaningful projects
          </p>
        </div>

        <div className="space-y-8">
          {experiences.map((exp, index) => (
            <Card key={index} className="card-hover">
              <CardContent className="p-8">
                <div className="grid lg:grid-cols-3 gap-8">
                  {/* Company Info */}
                  <div className="lg:col-span-1 space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold">{exp.title}</h3>
                      <div className="flex items-center space-x-2 text-primary font-semibold">
                        <Building2 className="w-5 h-5" />
                        <span>{exp.company}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4" />
                        <span>{exp.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>{exp.period}</span>
                      </div>
                    </div>
                    
                    <Badge variant="outline" className="w-fit">
                      {exp.type}
                    </Badge>
                  </div>

                  {/* Description & Highlights */}
                  <div className="lg:col-span-2 space-y-6">
                    <p className="text-muted-foreground leading-relaxed">
                      {exp.description}
                    </p>

                    <div className="space-y-4">
                      <h4 className="font-semibold">Key Achievements:</h4>
                      <ul className="space-y-2">
                        {exp.highlights.map((highlight, idx) => (
                          <li key={idx} className="flex items-start space-x-2 text-muted-foreground">
                            <ExternalLink className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold">Technologies Used:</h4>
                      <div className="flex flex-wrap gap-2">
                        {exp.technologies.map((tech) => (
                          <Badge key={tech} variant="secondary" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;