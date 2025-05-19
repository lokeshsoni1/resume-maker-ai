
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
