
import React from 'react';
import { 
  ClipboardCheck, 
  FileText, 
  Sparkles, 
  PenTool, 
  Download,
  Palette,
  Share2,
  Award,
  Check
} from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  animationDelay: number;
}

const FeatureCard = ({ icon, title, description, animationDelay }: FeatureCardProps) => {
  return (
    <div 
      className="flex flex-col p-6 rounded-xl glass-card hover-scale"
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <div className="h-12 w-12 rounded-full flex items-center justify-center bg-primary/10 text-primary mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-foreground/70">{description}</p>
    </div>
  );
};

export const Features = () => {
  const features = [
    {
      icon: <ClipboardCheck className="h-6 w-6" />,
      title: "Smart Form Builder",
      description: "Intuitive multi-step form with real-time validation, progress tracking, and auto-save functionality."
    },
    {
      icon: <Sparkles className="h-6 w-6" />,
      title: "AI-Powered Templates",
      description: "Unique resume templates generated based on your profile and industry, optimized for ATS systems."
    },
    {
      icon: <PenTool className="h-6 w-6" />,
      title: "Content Enhancement",
      description: "AI suggestions to improve your resume content with professional language and industry-specific keywords."
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Multiple Templates",
      description: "Choose from professional templates tailored for different industries and career stages."
    },
    {
      icon: <Download className="h-6 w-6" />,
      title: "Export Options",
      description: "Download your resume as PDF, plain text, or share a link with potential employers."
    },
    {
      icon: <Palette className="h-6 w-6" />,
      title: "Custom Theming",
      description: "Personalize your experience with 10 stunning themes from professional to creative."
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: "Achievement System",
      description: "Earn badges as you create and customize your resumes, making the process more engaging."
    },
    {
      icon: <Share2 className="h-6 w-6" />,
      title: "Collaboration Tools",
      description: "Share your resume drafts with others for feedback before finalizing."
    },
  ];

  return (
    <section id="features" className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Powerful Features to Build Your <span className="text-gradient">Dream Resume</span>
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Our AI-powered resume builder combines intuitive design with powerful features to help you create a standout resume that gets noticed.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              animationDelay={index * 100}
            />
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-semibold mb-6">Why Choose Our AI Resume Builder?</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="flex flex-col items-center p-4">
              <div className="h-12 w-12 rounded-full flex items-center justify-center bg-primary/10 text-primary mb-4">
                <Check className="h-6 w-6" />
              </div>
              <h4 className="text-xl font-medium mb-2">ATS Optimized</h4>
              <p className="text-foreground/70 text-center">Resumes designed to pass through Applicant Tracking Systems</p>
            </div>
            
            <div className="flex flex-col items-center p-4">
              <div className="h-12 w-12 rounded-full flex items-center justify-center bg-primary/10 text-primary mb-4">
                <Check className="h-6 w-6" />
              </div>
              <h4 className="text-xl font-medium mb-2">Industry-Specific</h4>
              <p className="text-foreground/70 text-center">Templates and keywords tailored to your specific industry</p>
            </div>
            
            <div className="flex flex-col items-center p-4">
              <div className="h-12 w-12 rounded-full flex items-center justify-center bg-primary/10 text-primary mb-4">
                <Check className="h-6 w-6" />
              </div>
              <h4 className="text-xl font-medium mb-2">Time-Saving</h4>
              <p className="text-foreground/70 text-center">Create a professional resume in minutes, not hours</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
