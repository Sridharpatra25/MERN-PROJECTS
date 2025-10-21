import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, MapPin, Calendar } from "lucide-react";

const About = () => {
  const education = [
    {
      degree: "B.Tech in Computer Science & Engineering",
      institution: "Gandhi Institute of Excellent Technocrats, Bhubaneswar",
      year: "4th Year",
      score: "CGPA: 7.8",
      status: "Current"
    },
    {
      degree: "Higher Secondary Education",
      institution: "Nalanda +2 Science College",
      year: "2021",
      score: "77%",
      status: "Completed"
    },
    {
      degree: "10th Standard",
      institution: "Regional High School",
      year: "2019",
      score: "68%",
      status: "Completed"
    }
  ];

  return (
    <section id="about" className="py-20 bg-background">
      <div className="section-container">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            About <span className="gradient-text">Me</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Passionate about creating innovative solutions and building impactful web applications
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Personal Bio */}
          <div className="space-y-6">
            <Card className="card-hover">
              <CardContent className="p-8">
                <h3 className="text-2xl font-semibold mb-6 flex items-center">
                  <GraduationCap className="w-6 h-6 mr-3 text-primary" />
                  My Journey
                </h3>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    I'm A Sridhar Patra, a dedicated Computer Science student in my final year at 
                    Gandhi Institute of Excellent Technocrats, Bhubaneswar. My passion for technology 
                    and problem-solving has driven me to specialize in Full-Stack Web Development.
                  </p>
                  <p>
                    With strong foundations in Java, Python, and Object-Oriented Programming, 
                    I've developed a comprehensive understanding of software development principles. 
                    My journey includes hands-on experience with modern web technologies and frameworks, 
                    allowing me to build end-to-end solutions.
                  </p>
                  <p>
                    I believe in continuous learning and staying updated with the latest industry trends. 
                    My goal is to contribute to innovative projects that make a positive impact on users' lives.
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="flex items-center space-x-4 text-muted-foreground">
              <MapPin className="w-5 h-5 text-primary" />
              <span>Based in Bhubaneswar, Odisha, India</span>
            </div>
          </div>

          {/* Education Timeline */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold mb-6">Educational Background</h3>
            <div className="space-y-4">
              {education.map((edu, index) => (
                <Card key={index} className="card-hover">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg">{edu.degree}</h4>
                        <p className="text-primary font-medium">{edu.institution}</p>
                      </div>
                      <Badge 
                        variant={edu.status === "Current" ? "default" : "secondary"}
                        className={edu.status === "Current" ? "btn-gradient" : ""}
                      >
                        {edu.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {edu.year}
                        </span>
                        <span className="font-medium text-foreground">{edu.score}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;