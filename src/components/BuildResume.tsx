
import { useResume } from '@/contexts/ResumeContext';
import { FormBuilder } from '@/components/FormBuilder';
import { ResumePreview } from '@/components/ResumePreview';

export const BuildResume = () => {
  const { resumeGenerated } = useResume();
  
  return (
    <section id="build" className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          Build Your <span className="text-gradient">Professional Resume</span>
        </h2>
        <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
          Fill out the form below to create your personalized resume. 
          Our AI will help you craft a professional document that stands out to employers.
        </p>
        
        <FormBuilder />
        
        {resumeGenerated && (
          <ResumePreview />
        )}
      </div>
    </section>
  );
};
