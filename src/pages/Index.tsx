
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Link } from 'react-router-dom';

// Components
import Header from '../components/Header';
import Hero from '../components/Hero';
import ProjectsSection from '../components/ProjectsSection';
import SkillsSection from '../components/SkillsSection';
import ContactForm from '../components/ContactForm';
import Footer from '../components/Footer';

const Index = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulating data loading (since we can't use actual PHP/MySQL in this React project)
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    // This would normally be a PHP session check
    console.log("Portfolio website loaded - PHP session would start here");
  }, []);

  // In a real PHP implementation, this would be a server-side function
  const handleContactSubmit = (formData: any) => {
    // Simulate PHP form processing
    console.log("Form data that would be sent to PHP backend:", formData);
    
    // Show success message
    toast({
      title: "Message sent!",
      description: "Thank you for your message. I'll get back to you soon.",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      <Header />
      <Hero />
      <ProjectsSection />
      <SkillsSection />
      <ContactForm onSubmit={handleContactSubmit} />
      
      {/* New Blog CTA Section */}
      <section className="py-16 bg-slate-900/50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Check Out My Blog</h2>
            <p className="text-slate-300 mb-6">
              Read articles about web development, design trends, and programming tips.
            </p>
            <Link to="/blog">
              <Button size="lg" className="animate-pulse">
                Visit The Blog
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
