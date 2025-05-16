
import { useState } from 'react';
import { useResume } from '@/contexts/ResumeContext';
import { FormStepNavigator } from '@/components/form/FormStep';
import { PersonalForm } from '@/components/form/Personal';
import { ExperienceForm } from '@/components/form/Experience';
import { EducationForm } from '@/components/form/Education';
import { ProjectsForm } from '@/components/form/Projects';
import { SkillsForm } from '@/components/form/Skills';
import { CertificationsForm } from '@/components/form/Certifications';
import { ContactForm } from '@/components/form/Contact';
import { PreferencesForm } from '@/components/form/Preferences';
import { Button } from '@/components/ui/button';
import { RefreshCw, Save, AlertTriangle, DownloadCloud } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from '@/components/ui/use-toast';

export const FormBuilder = () => {
  const { currentStep, resetForm, formValues, generateResume, isGenerating } = useResume();
  const [resetDialogOpen, setResetDialogOpen] = useState(false);

  // Validation for each step
  const validateStep = () => {
    switch (currentStep) {
      case 'personal':
        if (!formValues.fullName) {
          toast({
            title: "Missing Information",
            description: "Please enter your full name to continue.",
            variant: "destructive"
          });
          return false;
        }
        return true;

      case 'experience':
        if (formValues.experience.length > 0 && !formValues.experience[0].jobTitle) {
          toast({
            title: "Missing Information",
            description: "Please enter at least a job title for your experience.",
            variant: "destructive"
          });
          return false;
        }
        return true;

      case 'education':
        if (formValues.education.length > 0 && !formValues.education[0].degree) {
          toast({
            title: "Missing Information",
            description: "Please enter at least your degree information.",
            variant: "destructive"
          });
          return false;
        }
        return true;

      case 'contact':
        if (!formValues.contactInformation.email) {
          toast({
            title: "Missing Information",
            description: "Please enter your email address to continue.",
            variant: "destructive"
          });
          return false;
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (formValues.contactInformation.email && !emailRegex.test(formValues.contactInformation.email)) {
          toast({
            title: "Invalid Email",
            description: "Please enter a valid email address.",
            variant: "destructive"
          });
          return false;
        }
        
        return true;

      default:
        return true;
    }
  };

  // Render the current step component
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'personal':
        return <PersonalForm />;
      case 'experience':
        return <ExperienceForm />;
      case 'education':
        return <EducationForm />;
      case 'projects':
        return <ProjectsForm />;
      case 'skills':
        return <SkillsForm />;
      case 'certifications':
        return <CertificationsForm />;
      case 'contact':
        return <ContactForm />;
      case 'preferences':
        return <PreferencesForm />;
      default:
        return <PersonalForm />;
    }
  };
  
  const handleGenerateResume = () => {
    if (validateStep()) {
      generateResume();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <div className="mb-6 flex justify-end gap-2">
        <Button 
          variant="outline" 
          onClick={() => setResetDialogOpen(true)}
          className="flex items-center"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Clear Form
        </Button>
        
        <Button 
          variant="outline" 
          onClick={() => toast({
            title: "Progress Saved",
            description: "Your progress has been saved to your browser."
          })}
          className="flex items-center"
        >
          <Save className="h-4 w-4 mr-2" />
          Save Draft
        </Button>
      </div>
      
      <FormStepNavigator 
        currentComponent={renderCurrentStep()} 
        validateStep={validateStep} 
      />
      
      <div className="mt-12 text-center">
        <h3 className="text-xl font-semibold mb-4">Ready to Generate Your Resume?</h3>
        <p className="text-muted-foreground mb-6">
          You can generate your resume at any time, even if you haven't completed all sections.
        </p>
        
        <Button 
          onClick={handleGenerateResume} 
          className="min-w-[200px] py-6 text-lg hover-scale glow"
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <DownloadCloud className="h-5 w-5 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              Generate Resume
            </>
          )}
        </Button>
      </div>
      
      <AlertDialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Clear Form Data?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will reset all the information you've entered. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                resetForm();
                setResetDialogOpen(false);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Clear All Data
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
