
import { Button } from '@/components/ui/button';
import { ArrowDown } from 'lucide-react';
import { ParticleBackground } from '@/components/ParticleBackground';

export const Hero = () => {
  const handleScrollToBuild = () => {
    const buildSection = document.getElementById('build');
    if (buildSection) {
      buildSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden py-20">
      <ParticleBackground />
      
      <div className="container mx-auto px-4 z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-gradient">Craft the Perfect Resume</span>
              <br />
              <span className="text-foreground">with AI — in Seconds</span>
            </h1>
            
            <p className="text-lg md:text-xl text-foreground/80 mb-8">
              Create highly personalized, professional resumes that stand out with our
              AI-powered resume builder. Get hired faster with resumes optimized for ATS systems.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                onClick={handleScrollToBuild}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-6 text-lg hover-scale glow"
              >
                Start Building Now
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="border-primary text-foreground hover:bg-primary/10"
              >
                Explore Features
              </Button>
            </div>
            
            <div className="mt-16 animate-bounce">
              <Button 
                variant="ghost" 
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                size="icon"
                className="rounded-full"
              >
                <ArrowDown className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
