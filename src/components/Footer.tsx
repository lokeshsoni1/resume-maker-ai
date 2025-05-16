
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Github, Linkedin, Mail, ArrowUp } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

export const Footer = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message Sent!",
        description: "Thank you for your feedback. I'll get back to you soon.",
      });
      
      setFormData({
        name: '',
        email: '',
        message: '',
      });
      
      setIsSubmitting(false);
    }, 1500);
  };
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  return (
    <footer id="contact" className="relative pt-16 pb-8 border-t">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Get In Touch</h2>
            <p className="mb-6 text-muted-foreground">
              Have questions about the Resume Builder? Interested in collaborating? 
              Drop me a message and I'll get back to you!
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <Mail className="h-5 w-5 mr-3 text-primary" />
                <a href="mailto:mrlokeshsoni001@gmail.com" className="hover:text-primary transition-colors">
                  mrlokeshsoni001@gmail.com
                </a>
              </div>
              
              <div className="flex items-center">
                <Github className="h-5 w-5 mr-3 text-primary" />
                <a href="https://github.com/lokeshhsoni" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                  github.com/lokeshhsoni
                </a>
              </div>
              
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-3">Connect With Me</h3>
                <div className="flex gap-4">
                  <a 
                    href="https://www.linkedin.com/in/lokesh-soni-2b3b7034a/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <Linkedin className="h-5 w-5" />
                  </a>
                  <a 
                    href="https://github.com/lokeshhsoni" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <Github className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Send a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  required
                  className="w-full"
                />
              </div>
              <div>
                <Input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Your Email"
                  type="email"
                  required
                  className="w-full"
                />
              </div>
              <div>
                <Textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your Message"
                  required
                  className="w-full min-h-[150px] resize-none"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t text-center">
          <div className="flex flex-col items-center">
            <div className="text-2xl font-bold mb-2">Resume Builder</div>
            <p className="text-muted-foreground">Craft the Perfect Resume with AI</p>
          </div>
          
          <div className="mt-6 flex justify-center">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={scrollToTop}
              className="rounded-full animate-bounce"
            >
              <ArrowUp className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="mt-8 text-sm text-muted-foreground">
            <p>© 2025 Made by Lokesh Soni. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};
