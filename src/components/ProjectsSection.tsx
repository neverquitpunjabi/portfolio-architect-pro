
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Mock data (in a real implementation, this would come from PHP/MySQL)
const projectsData = [
  {
    id: 1,
    title: "E-commerce Platform",
    description: "A full-featured e-commerce platform with product management, cart functionality, payment processing, and order tracking.",
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    technologies: ["PHP", "MySQL", "JavaScript", "Bootstrap", "Stripe API"],
    liveDemo: "https://example.com/demo",
    githubLink: "https://github.com/yourusername/ecommerce"
  },
  {
    id: 2,
    title: "Task Management System",
    description: "A comprehensive task management application with user authentication, task assignments, progress tracking, and notifications.",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
    technologies: ["PHP", "MySQL", "React", "Tailwind CSS", "RESTful API"],
    liveDemo: "https://example.com/demo2",
    githubLink: "https://github.com/yourusername/taskmanager"
  },
  {
    id: 3,
    title: "Community Blog Platform",
    description: "A multi-user blog platform with content management, commenting system, user profiles, and social sharing features.",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    technologies: ["PHP", "MySQL", "jQuery", "AJAX", "Redis"],
    liveDemo: "https://example.com/demo3",
    githubLink: "https://github.com/yourusername/blogplatform"
  },
  {
    id: 4,
    title: "Inventory Management System",
    description: "An inventory tracking application for small businesses with reporting, barcode scanning, and supplier management.",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
    technologies: ["PHP", "MySQL", "Chart.js", "Bootstrap", "PDF Generation"],
    liveDemo: "https://example.com/demo4",
    githubLink: "https://github.com/yourusername/inventory"
  }
];

const ProjectsSection = () => {
  const [filter, setFilter] = useState('all');
  
  // This would be a PHP function that filters projects in a real implementation
  const filteredProjects = filter === 'all' 
    ? projectsData 
    : projectsData.filter(project => 
        project.technologies.some(tech => 
          tech.toLowerCase().includes(filter.toLowerCase())
        )
      );

  return (
    <section id="projects" className="py-20 bg-slate-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">My Projects</h2>
          <p className="text-slate-300 max-w-2xl mx-auto">
            Here are some of my recent development projects. Each includes live demos and GitHub repositories.
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <Button 
            variant={filter === 'all' ? "default" : "outline"} 
            onClick={() => setFilter('all')}
            className={filter === 'all' ? "bg-purple-600 hover:bg-purple-700" : ""}
          >
            All Projects
          </Button>
          <Button 
            variant={filter === 'php' ? "default" : "outline"} 
            onClick={() => setFilter('php')}
            className={filter === 'php' ? "bg-purple-600 hover:bg-purple-700" : ""}
          >
            PHP
          </Button>
          <Button 
            variant={filter === 'react' ? "default" : "outline"} 
            onClick={() => setFilter('react')}
            className={filter === 'react' ? "bg-purple-600 hover:bg-purple-700" : ""}
          >
            React
          </Button>
          <Button 
            variant={filter === 'mysql' ? "default" : "outline"} 
            onClick={() => setFilter('mysql')}
            className={filter === 'mysql' ? "bg-purple-600 hover:bg-purple-700" : ""}
          >
            MySQL
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="overflow-hidden border border-slate-700 bg-slate-900 text-white hover:shadow-purple-500/10 hover:shadow-lg transition-all duration-300">
              <div className="h-48 overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-110"
                />
              </div>
              <CardHeader>
                <CardTitle className="text-2xl">{project.title}</CardTitle>
                <CardDescription className="text-slate-300">{project.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mt-3">
                  {project.technologies.map((tech, i) => (
                    <Badge key={i} className="bg-purple-600/20 text-purple-400 hover:bg-purple-600/30">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button asChild variant="outline" className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white">
                  <a href={project.liveDemo} target="_blank" rel="noopener noreferrer">
                    Live Demo
                  </a>
                </Button>
                <Button asChild variant="outline">
                  <a href={project.githubLink} target="_blank" rel="noopener noreferrer">
                    <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                    </svg>
                    GitHub
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
