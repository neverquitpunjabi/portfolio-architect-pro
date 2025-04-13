
import { Progress } from "@/components/ui/progress";

// Mock data (in a real implementation, this would come from PHP/MySQL)
const skills = [
  {
    category: "Backend",
    items: [
      { name: "PHP", level: 95 },
      { name: "Node.js", level: 80 },
      { name: "Python", level: 75 }
    ]
  },
  {
    category: "Database",
    items: [
      { name: "MySQL", level: 90 },
      { name: "MongoDB", level: 75 },
      { name: "PostgreSQL", level: 70 }
    ]
  },
  {
    category: "Frontend",
    items: [
      { name: "HTML/CSS", level: 95 },
      { name: "JavaScript", level: 90 },
      { name: "React", level: 85 }
    ]
  },
  {
    category: "Tools & Others",
    items: [
      { name: "Git", level: 85 },
      { name: "Docker", level: 70 },
      { name: "AWS", level: 65 }
    ]
  }
];

const SkillsSection = () => {
  return (
    <section id="skills" className="py-20 bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">My Skills</h2>
          <p className="text-slate-300 max-w-2xl mx-auto">
            I've developed expertise in various technologies, specializing in PHP and MySQL development.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {skills.map((skillCategory, index) => (
            <div key={index} className="bg-slate-800 p-6 rounded-lg border border-slate-700 shadow-lg hover:shadow-purple-500/10 transition-all duration-300">
              <h3 className="text-xl font-bold text-purple-400 mb-6">{skillCategory.category}</h3>
              
              <div className="space-y-6">
                {skillCategory.items.map((skill, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">{skill.name}</span>
                      <span className="text-sm text-slate-400">{skill.level}%</span>
                    </div>
                    <Progress 
                      value={skill.level} 
                      className="h-2 bg-slate-700 [&>div]:bg-purple-500" 
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
