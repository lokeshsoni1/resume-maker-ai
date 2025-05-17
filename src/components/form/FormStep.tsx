
import { useState, useEffect } from 'react';
import { useResume } from '@/contexts/ResumeContext';
import { FormStep as FormStepType } from '@/types';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface FormStepNavigatorProps {
  currentComponent: React.ReactNode;
  validateStep: () => boolean;
}

export const FormStepNavigator = ({
  currentComponent,
  validateStep
}: FormStepNavigatorProps) => {
  const { currentStep, setCurrentStep, formProgress } = useResume();
  const [isValid, setIsValid] = useState(true);

  const stepOrder: FormStepType[] = [
    'personal',
    'experience',
    'education',
    'projects',
    'skills',
    'certifications',
    'contact',
    'preferences'
  ];

  const currentIndex = stepOrder.findIndex(step => step === currentStep);
  
  const handleNext = () => {
    if (validateStep()) {
      if (currentIndex < stepOrder.length - 1) {
        setCurrentStep(stepOrder[currentIndex + 1]);
        // Removed scroll to top
      }
    } else {
      setIsValid(false);
      setTimeout(() => setIsValid(true), 500);
    }
  };
  
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1]);
      // Removed scroll to top
    }
  };
  
  const getProgressBarLabel = () => {
    return `${formProgress}% Complete`;
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-foreground/70">
            {getProgressBarLabel()}
          </span>
          <span className="text-sm font-medium">
            Step {currentIndex + 1} of {stepOrder.length}
          </span>
        </div>
        <Progress value={formProgress} className="h-2" />
      </div>
      
      <div className={`mb-8 ${isValid ? '' : 'animate-shake'}`}>
        {currentComponent}
      </div>
      
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="w-32"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Previous
        </Button>
        
        <Button
          onClick={handleNext}
          className="w-32"
        >
          {currentIndex === stepOrder.length - 1 ? 'Finish' : 'Next'} <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
