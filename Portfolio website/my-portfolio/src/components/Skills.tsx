import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Code, Database, Wrench, Monitor } from "lucide-react";

const Skills = () => {
  const skillCategories = [
    {
      title: "Programming Languages",
      icon: <Code className="w-6 h-6" />,
      skills: [
        { name: "Python", level: 90 },
        { name: "Core Java", level: 85 },
        { name: "JavaScript", level: 88 },
        { name: "C", level: 75 }
      ]
    },
    {
      title: "Web Development",
      icon: <Monitor className="w-6 h-6" />,
      skills: [
        { name: "React.js", level: 90 },
        { name: "Node.js", level: 85 },
        { name: "Express.js", level: 80 },
        { name: "HTML/CSS", level: 95 },
        { name: "Tailwind CSS", level: 90 },
        { name: "Bootstrap", level: 85 },
        { name: "AngularJS", level: 70 }
      ]
    },
    {
      title: "Databases & Tools",
      icon: <Database className="w-6 h-6" />,
      skills: [
        { name: "MongoDB", level: 85 },
        { name: "SQL", level: 80 },
        { name: "Postman", level: 90 }
      ]
    },
    {
      title: "Development Tools",
      icon: <Wrench className="w-6 h-6" />,
      skills: [
        { name: "VS Code", level: 95 },
        { name: "IntelliJ IDEA", level: 85 },
        { name: "Git", level: 85 },
        { name: "Vercel", level: 80 },
        { name: "Render", level: 75 }
      ]
    }
  ];

  const topSkills = ["Full-Stack Development", "MERN Stack", "API Development", "Database Design", "Responsive Design", "Version Control"];

  return (
    <section id="skills" className="py-20 bg-background">
      <div className="section-container">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Technical <span className="gradient-text">Skills</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A comprehensive toolkit for building modern web applications
          </p>
        </div>

        {/* Top Skills Overview */}
        <div className="mb-16">
          <h3 className="text-2xl font-semibold text-center mb-8">Core Competencies</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {topSkills.map((skill) => (
              <Badge key={skill} variant="outline" className="text-base py-2 px-4 hover:bg-primary hover:text-primary-foreground transition-colors duration-300">
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        {/* Detailed Skills */}
        <div className="grid md:grid-cols-2 gap-8">
          {skillCategories.map((category, index) => (
            <Card key={index} className="card-hover">
              <CardContent className="p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-3 bg-gradient-primary rounded-lg text-primary-foreground">
                    {category.icon}
                  </div>
                  <h3 className="text-xl font-semibold">{category.title}</h3>
                </div>
                
                <div className="space-y-6">
                  {category.skills.map((skill, skillIndex) => (
                    <div key={skillIndex} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{skill.name}</span>
                        <span className="text-sm text-muted-foreground">{skill.level}%</span>
                      </div>
                      <Progress 
                        value={skill.level} 
                        className="h-2"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Services Section */}
        <div className="mt-20">
          <h3 className="text-3xl font-bold text-center mb-12">
            <span className="gradient-text">Services</span> I Offer
          </h3>
          
          <Card className="card-hover">
            <CardContent className="p-8 text-center">
              <div className="max-w-3xl mx-auto">
                <h4 className="text-2xl font-semibold mb-4">Full-Stack Development</h4>
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  I offer end-to-end web development solutions, including frontend user interfaces, 
                  backend server development, database management, and complete application deployment. 
                  From concept to production, I can help bring your web application ideas to life.
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {["Frontend Development", "Backend APIs", "Database Design", "Deployment", "Maintenance"].map((service) => (
                    <Badge key={service} className="btn-gradient">
                      {service}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Skills;