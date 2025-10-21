import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Github, Smartphone, Globe, Zap } from "lucide-react";

const Portfolio = () => {
  const projects = [
    {
      title: "News Application",
      description: "A responsive news platform built with React and Tailwind CSS featuring category-based filtering and live API integration for real-time news updates.",
      technologies: ["React.js", "Tailwind CSS", "News API", "JavaScript"],
      features: ["Responsive Design", "Category Filtering", "Live API Integration", "Modern UI"],
      icon: <Globe className="w-6 h-6" />,
      demoUrl: "#",
      githubUrl: "#"
    },
    {
      title: "ID Card Generation System",
      description: "MERN-stack application for East Coast Railway enabling employee I-card applications with file uploads, role-based access, and REST API-based status tracking.",
      technologies: ["MongoDB", "Express.js", "React.js", "Node.js", "Multer"],
      features: ["Role-based Access", "File Upload", "Status Tracking", "RESTful APIs"],
      icon: <Smartphone className="w-6 h-6" />,
      demoUrl: "#",
      githubUrl: "#"
    },
    {
      title: "AI Text-to-Image Web App",
      description: "Full-stack application that converts text prompts to images using ClipDrop API. Built with React frontend, Node.js backend, and MongoDB for user management.",
      technologies: ["React.js", "Node.js", "Express.js", "MongoDB", "ClipDrop API"],
      features: ["AI Integration", "User Management", "Image Generation", "Full-stack Architecture"],
      icon: <Zap className="w-6 h-6" />,
      demoUrl: "#",
      githubUrl: "#"
    }
  ];

  return (
    <section id="portfolio" className="py-20 bg-gradient-accent">
      <div className="section-container">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A showcase of my development work, demonstrating expertise in modern web technologies
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <Card key={index} className="card-hover group overflow-hidden">
              <div className="relative overflow-hidden">
                <div className="w-full h-48 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <div className="text-4xl text-primary/40">{project.icon}</div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 right-4 flex space-x-2">
                    <Button size="sm" className="btn-gradient flex-1">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Live Demo
                    </Button>
                    <Button size="sm" variant="secondary" className="flex-1">
                      <Github className="w-4 h-4 mr-2" />
                      Code
                    </Button>
                  </div>
                </div>
              </div>
              
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 bg-gradient-primary rounded-lg text-primary-foreground">
                    {project.icon}
                  </div>
                  <h3 className="text-xl font-semibold">{project.title}</h3>
                </div>
                
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {project.description}
                </p>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Key Features:</h4>
                    <div className="flex flex-wrap gap-1">
                      {project.features.map((feature) => (
                        <Badge key={feature} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Technologies:</h4>
                    <div className="flex flex-wrap gap-1">
                      {project.technologies.map((tech) => (
                        <Badge key={tech} variant="secondary" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button size="lg" variant="outline" className="hover:bg-primary hover:text-primary-foreground transition-all duration-300">
            <Github className="w-5 h-5 mr-2" />
            View More on GitHub
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;