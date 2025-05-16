
import React, { createContext, useContext, useState, useEffect } from 'react';
import { FormValues, FormStep, ResumeTemplate, Badge } from '@/types';
import { 
  CheckCircle, 
  Star, 
  Award, 
  Sparkles, 
  Download, 
  Palette
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';

// Default form values
const defaultFormValues: FormValues = {
  fullName: '',
  profileImage: null,
  profileImageUrl: '',
  personalDetails: {
    bio: '',
    dateOfBirth: '',
    nationality: '',
    address: '',
  },
  experience: [
    {
      id: uuidv4(),
      jobTitle: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
    },
  ],
  education: [
    {
      id: uuidv4(),
      degree: '',
      institution: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      gpa: '',
    },
  ],
  projects: [
    {
      id: uuidv4(),
      title: '',
      description: '',
      technologies: '',
      link: '',
    },
  ],
  skills: [],
  certifications: [
    {
      id: uuidv4(),
      name: '',
      issuer: '',
      date: '',
      link: '',
    },
  ],
  contactInformation: {
    email: '',
    phone: '',
    linkedin: '',
    github: '',
    portfolio: '',
  },
  workPreferences: {
    jobType: 'full-time',
    workMode: 'remote',
    industry: '',
    salaryExpectation: '',
  },
};

// Resume templates
const resumeTemplates: ResumeTemplate[] = [
  {
    id: 'modern',
    name: 'Modern',
    color: '#3b82f6',
    layout: 'single-column',
  },
  {
    id: 'professional',
    name: 'Professional',
    color: '#10b981',
    layout: 'two-column',
  },
  {
    id: 'creative',
    name: 'Creative',
    color: '#8b5cf6',
    layout: 'hybrid',
  },
  {
    id: 'minimalist',
    name: 'Minimalist',
    color: '#6b7280',
    layout: 'single-column',
  },
  {
    id: 'executive',
    name: 'Executive',
    color: '#1e40af',
    layout: 'two-column',
  },
  {
    id: 'tech',
    name: 'Tech',
    color: '#06b6d4',
    layout: 'hybrid',
  }
];

// Badges for gamification
const defaultBadges: Badge[] = [
  {
    id: 'first-resume',
    name: 'First Resume',
    description: 'Created your first resume',
    icon: <CheckCircle />,
    unlocked: false
  },
  {
    id: 'theme-explorer',
    name: 'Theme Explorer',
    description: 'Tried 3 different themes',
    icon: <Palette />,
    unlocked: false
  },
  {
    id: 'download-master',
    name: 'Download Master',
    description: 'Downloaded 5 resumes',
    icon: <Download />,
    unlocked: false
  },
  {
    id: 'skills-guru',
    name: 'Skills Guru',
    description: 'Added more than 10 skills',
    icon: <Star />,
    unlocked: false
  },
  {
    id: 'complete-profile',
    name: 'Complete Profile',
    description: 'Filled out all sections of the form',
    icon: <Award />,
    unlocked: false
  },
  {
    id: 'ai-enthusiast',
    name: 'AI Enthusiast',
    description: 'Used AI suggestions 3 times',
    icon: <Sparkles />,
    unlocked: false
  }
];

interface ResumeContextType {
  formValues: FormValues;
  setFormValues: (values: FormValues) => void;
  resetForm: () => void;
  currentStep: FormStep;
  setCurrentStep: (step: FormStep) => void;
  resumeGenerated: boolean;
  setResumeGenerated: (generated: boolean) => void;
  formProgress: number;
  generateResume: () => void;
  isGenerating: boolean;
  selectedTemplate: ResumeTemplate;
  setSelectedTemplate: (template: ResumeTemplate) => void;
  availableTemplates: ResumeTemplate[];
  badges: Badge[];
  unlockBadge: (badgeId: string) => void;
  downloadCount: number;
  incrementDownloadCount: () => void;
  themesExplored: string[];
  addExploredTheme: (themeId: string) => void;
  aiSuggestionsUsed: number;
  incrementAiSuggestions: () => void;
}

const ResumeContext = createContext<ResumeContextType>({
  formValues: defaultFormValues,
  setFormValues: () => {},
  resetForm: () => {},
  currentStep: 'personal',
  setCurrentStep: () => {},
  resumeGenerated: false,
  setResumeGenerated: () => {},
  formProgress: 0,
  generateResume: () => {},
  isGenerating: false,
  selectedTemplate: resumeTemplates[0],
  setSelectedTemplate: () => {},
  availableTemplates: resumeTemplates,
  badges: defaultBadges,
  unlockBadge: () => {},
  downloadCount: 0,
  incrementDownloadCount: () => {},
  themesExplored: [],
  addExploredTheme: () => {},
  aiSuggestionsUsed: 0,
  incrementAiSuggestions: () => {},
});

export const useResume = () => useContext(ResumeContext);

export const ResumeProvider = ({ children }: { children: React.ReactNode }) => {
  // Get saved data from localStorage
  const getSavedFormData = () => {
    const savedData = typeof window !== 'undefined' ? localStorage.getItem('resume-form-data') : null;
    return savedData ? JSON.parse(savedData) : defaultFormValues;
  };

  // Initialize state with saved data or defaults
  const [formValues, setFormValues] = useState<FormValues>(getSavedFormData);
  const [currentStep, setCurrentStep] = useState<FormStep>('personal');
  const [resumeGenerated, setResumeGenerated] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ResumeTemplate>(resumeTemplates[0]);
  const [badges, setBadges] = useState<Badge[]>(defaultBadges);
  const [downloadCount, setDownloadCount] = useState(0);
  const [themesExplored, setThemesExplored] = useState<string[]>([]);
  const [aiSuggestionsUsed, setAiSuggestionsUsed] = useState(0);

  // Save form data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('resume-form-data', JSON.stringify(formValues));
  }, [formValues]);
  
  // Also load badges, download count, etc. from local storage
  useEffect(() => {
    const loadUserData = () => {
      const savedBadges = localStorage.getItem('resume-badges');
      if (savedBadges) setBadges(JSON.parse(savedBadges));
      
      const savedDownloadCount = localStorage.getItem('resume-download-count');
      if (savedDownloadCount) setDownloadCount(parseInt(savedDownloadCount));
      
      const savedThemesExplored = localStorage.getItem('resume-themes-explored');
      if (savedThemesExplored) setThemesExplored(JSON.parse(savedThemesExplored));
      
      const savedAiSuggestions = localStorage.getItem('resume-ai-suggestions');
      if (savedAiSuggestions) setAiSuggestionsUsed(parseInt(savedAiSuggestions));
    };
    
    loadUserData();
  }, []);

  // Reset the form to default values
  const resetForm = () => {
    setFormValues(defaultFormValues);
    setCurrentStep('personal');
    setResumeGenerated(false);
    toast({
      title: "Form Reset",
      description: "All form data has been cleared.",
    });
  };

  // Calculate form completion progress
  const calculateProgress = (): number => {
    let fieldsTotal = 0;
    let fieldsCompleted = 0;
    
    // Personal details
    fieldsTotal += 5; // name + 4 personal details
    if (formValues.fullName) fieldsCompleted++;
    if (formValues.personalDetails.bio) fieldsCompleted++;
    if (formValues.personalDetails.dateOfBirth) fieldsCompleted++;
    if (formValues.personalDetails.nationality) fieldsCompleted++;
    if (formValues.personalDetails.address) fieldsCompleted++;
    
    // Experience (only count first experience as required)
    if (formValues.experience.length > 0) {
      fieldsTotal += 5; // title, company, location, dates, description
      const exp = formValues.experience[0];
      if (exp.jobTitle) fieldsCompleted++;
      if (exp.company) fieldsCompleted++;
      if (exp.location) fieldsCompleted++;
      if (exp.startDate) fieldsCompleted++;
      if (exp.description) fieldsCompleted++;
    }
    
    // Education (only count first education as required)
    if (formValues.education.length > 0) {
      fieldsTotal += 4; // degree, institution, location, dates
      const edu = formValues.education[0];
      if (edu.degree) fieldsCompleted++;
      if (edu.institution) fieldsCompleted++;
      if (edu.location) fieldsCompleted++;
      if (edu.startDate) fieldsCompleted++;
    }
    
    // Skills (at least one skill)
    fieldsTotal += 1;
    if (formValues.skills.length > 0) fieldsCompleted++;
    
    // Contact info (email is required)
    fieldsTotal += 1;
    if (formValues.contactInformation.email) fieldsCompleted++;
    
    // Work preferences (at least job type)
    fieldsTotal += 2;
    if (formValues.workPreferences.jobType) fieldsCompleted++;
    if (formValues.workPreferences.workMode) fieldsCompleted++;
    
    return Math.floor((fieldsCompleted / fieldsTotal) * 100);
  };

  const formProgress = calculateProgress();
  
  // Generate resume function
  const generateResume = () => {
    // Minimum requirements check
    if (!formValues.fullName) {
      toast({
        title: "Missing Information",
        description: "Please enter your full name to generate a resume.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulate AI processing
    setTimeout(() => {
      // Randomly select a template if not already selected
      const randomTemplate = resumeTemplates[Math.floor(Math.random() * resumeTemplates.length)];
      setSelectedTemplate(randomTemplate);
      
      setResumeGenerated(true);
      setIsGenerating(false);
      
      // Unlock "First Resume" badge if it's the first time
      unlockBadge('first-resume');
      
      toast({
        title: "Resume Generated!",
        description: `Your resume has been created using the ${randomTemplate.name} template.`,
      });
      
      // Scroll to the resume section
      setTimeout(() => {
        const resumeSection = document.getElementById('resume-preview');
        if (resumeSection) {
          resumeSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500);
    }, 2500); // Simulate 2.5s of "AI processing"
  };
  
  // Badge management
  const unlockBadge = (badgeId: string) => {
    const newBadges = badges.map(badge => {
      if (badge.id === badgeId && !badge.unlocked) {
        toast({
          title: "🎉 Badge Unlocked!",
          description: `${badge.name}: ${badge.description}`,
        });
        return { ...badge, unlocked: true };
      }
      return badge;
    });
    
    setBadges(newBadges);
    localStorage.setItem('resume-badges', JSON.stringify(newBadges));
  };
  
  // Download count tracking
  const incrementDownloadCount = () => {
    const newCount = downloadCount + 1;
    setDownloadCount(newCount);
    localStorage.setItem('resume-download-count', newCount.toString());
    
    // Unlock badge if reached 5 downloads
    if (newCount >= 5) {
      unlockBadge('download-master');
    }
  };
  
  // Theme exploration tracking
  const addExploredTheme = (themeId: string) => {
    if (!themesExplored.includes(themeId)) {
      const newThemes = [...themesExplored, themeId];
      setThemesExplored(newThemes);
      localStorage.setItem('resume-themes-explored', JSON.stringify(newThemes));
      
      // Unlock badge if explored 3+ themes
      if (newThemes.length >= 3) {
        unlockBadge('theme-explorer');
      }
    }
  };
  
  // AI suggestion tracking
  const incrementAiSuggestions = () => {
    const newCount = aiSuggestionsUsed + 1;
    setAiSuggestionsUsed(newCount);
    localStorage.setItem('resume-ai-suggestions', newCount.toString());
    
    // Unlock badge if used AI 3+ times
    if (newCount >= 3) {
      unlockBadge('ai-enthusiast');
    }
  };

  return (
    <ResumeContext.Provider value={{
      formValues,
      setFormValues,
      resetForm,
      currentStep,
      setCurrentStep,
      resumeGenerated,
      setResumeGenerated,
      formProgress,
      generateResume,
      isGenerating,
      selectedTemplate,
      setSelectedTemplate,
      availableTemplates: resumeTemplates,
      badges,
      unlockBadge,
      downloadCount,
      incrementDownloadCount,
      themesExplored,
      addExploredTheme,
      aiSuggestionsUsed,
      incrementAiSuggestions
    }}>
      {children}
    </ResumeContext.Provider>
  );
};
