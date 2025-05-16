
import { useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useResume } from '@/contexts/ResumeContext';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { Features } from '@/components/Features';
import { Templates } from '@/components/Templates';
import { BuildResume } from '@/components/BuildResume';
import { Footer } from '@/components/Footer';
import { BadgeDisplay } from '@/components/BadgeDisplay';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { ResumeProvider } from '@/contexts/ResumeContext';

// Main Index component with providers
const Index = () => {
  return (
    <ThemeProvider>
      <ResumeProvider>
        <ResumeBuilderApp />
      </ResumeProvider>
    </ThemeProvider>
  );
};

// Owner profile component
const OwnerProfile = () => {
  return (
    <div className="flex items-center justify-center py-4 animate-fade-in">
      <div className="flex items-center bg-muted/30 p-2 rounded-full">
        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary animate-pulse">
          <img 
            src="/lovable-uploads/c3d5bc84-7680-4dfd-a430-392528ad498c.png" 
            alt="Lokesh Soni" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="ml-3">
          <p className="font-medium text-sm">Lokesh Soni</p>
          <p className="text-xs text-muted-foreground">Owner</p>
        </div>
      </div>
    </div>
  );
};

// Inner component that can use the context
const ResumeBuilderApp = () => {
  const { addExploredTheme } = useResume();
  const { currentTheme: activeTheme } = useTheme();
  
  // Track theme exploration for badges
  useEffect(() => {
    addExploredTheme(activeTheme);
  }, [activeTheme, addExploredTheme]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <OwnerProfile />
      <main className="flex-grow">
        <Hero />
        <Features />
        <Templates />
        <BuildResume />
      </main>
      <Footer />
      <BadgeDisplay />
    </div>
  );
};

export default Index;
