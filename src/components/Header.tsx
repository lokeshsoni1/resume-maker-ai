
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { Github, Linkedin, Menu, X } from 'lucide-react';

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle scroll behavior for header styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled 
          ? 'bg-background/80 backdrop-blur-md shadow-sm' 
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="text-primary font-bold text-2xl animate-pulse">RB</span>
          <h1 className="text-foreground font-bold text-xl hidden md:block">Resume Builder</h1>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <a href="#features" className="text-foreground/80 hover:text-primary transition-colors">
            Features
          </a>
          <a href="#templates" className="text-foreground/80 hover:text-primary transition-colors">
            Templates
          </a>
          <a href="#build" className="text-foreground/80 hover:text-primary transition-colors">
            Start Building
          </a>
          <a href="#contact" className="text-foreground/80 hover:text-primary transition-colors">
            Contact
          </a>
        </nav>
        
        {/* Theme Switcher and Mobile Menu Button */}
        <div className="flex items-center gap-2">
          <ThemeSwitcher />
          
          {/* Mobile Menu Toggle */}
          <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden">
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-lg pb-4">
          <nav className="flex flex-col items-center gap-4 px-4 pt-2 animate-fade-in">
            <a 
              href="#features" 
              className="w-full text-center py-2 text-foreground/80 hover:text-primary transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Features
            </a>
            <a 
              href="#templates" 
              className="w-full text-center py-2 text-foreground/80 hover:text-primary transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Templates
            </a>
            <a 
              href="#build" 
              className="w-full text-center py-2 text-foreground/80 hover:text-primary transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Start Building
            </a>
            <a 
              href="#contact" 
              className="w-full text-center py-2 text-foreground/80 hover:text-primary transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </a>
            
            <div className="flex items-center gap-4 pt-2">
              <a href="https://github.com/lokeshhsoni" target="_blank" rel="noopener noreferrer" className="text-foreground/80 hover:text-primary transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="https://www.linkedin.com/in/lokesh-soni-2b3b7034a/" target="_blank" rel="noopener noreferrer" className="text-foreground/80 hover:text-primary transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
