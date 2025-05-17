import React, { createContext, useContext, useState, useEffect } from 'react';
import { FormValues, FormStep, ResumeTemplate, Badge, AITemplate } from '@/types';
import { 
  CheckCircle, 
  Star, 
  Award, 
  Sparkles, 
  Download, 
  Palette,
  Wand
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

// AI template generation options
const layoutOptions = ['single-column', 'two-column', 'hybrid'];
const fontOptions = [
  { name: 'Roboto', family: '"Roboto", sans-serif' },
  { name: 'Montserrat', family: '"Montserrat", sans-serif' },
  { name: 'Lora', family: '"Lora", serif' },
  { name: 'Poppins', family: '"Poppins", sans-serif' },
  { name: 'Open Sans', family: '"Open Sans", sans-serif' }
];

// Color palettes for AI templates
const colorPalettes = [
  // Vibrant
  { primary: '#6366f1', secondary: '#a5b4fc', name: 'Indigo Flow' },
  { primary: '#ec4899', secondary: '#f9a8d4', name: 'Pink Passion' },
  { primary: '#14b8a6', secondary: '#5eead4', name: 'Teal Breeze' },
  { primary: '#8b5cf6', secondary: '#c4b5fd', name: 'Purple Haze' },
  { primary: '#f59e0b', secondary: '#fcd34d', name: 'Amber Glow' },
  
  // Professional
  { primary: '#1f2937', secondary: '#9ca3af', name: 'Charcoal Professional' },
  { primary: '#0369a1', secondary: '#7dd3fc', name: 'Blue Corporate' },
  { primary: '#0f766e', secondary: '#5eead4', name: 'Teal Executive' },
  { primary: '#4338ca', secondary: '#a5b4fc', name: 'Deep Indigo' },
  { primary: '#334155', secondary: '#cbd5e1', name: 'Slate Business' },
  
  // Muted
  { primary: '#64748b', secondary: '#cbd5e1', name: 'Slate Muted' },
  { primary: '#5b21b6', secondary: '#ddd6fe', name: 'Violet Soft' },
  { primary: '#0f766e', secondary: '#ccfbf1', name: 'Teal Pastel' },
  { primary: '#9f1239', secondary: '#fecdd3', name: 'Ruby Gentle' },
  { primary: '#3730a3', secondary: '#e0e7ff', name: 'Indigo Calm' }
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

// AI suggestion examples for bio sections
const bioSuggestions = [
  "Dedicated {role} with {years} years of experience driving results through {skill} and {skill}.",
  "Strategic {role} who excels at {skill} and delivering {outcome} for organizations.",
  "Creative {role} with a passion for {interest} and proven success in {achievement}.",
  "Results-oriented {role} with expertise in {skill}, delivering {metric} improvement in {area}.",
  "Innovative {role} with a track record of {achievement} through {approach} thinking.",
  "Detail-oriented {role} specializing in {specialty} with a focus on {value}.",
  "Versatile {role} combining {skill} with {skill} to achieve exceptional {outcome}.",
  "Forward-thinking {role} who leverages {skill} to drive {metric} improvements.",
  "Analytical {role} with expertise in {skill} and a talent for {specialty}.",
  "Collaborative {role} known for {trait} and the ability to {achievement}."
];

// AI suggestion examples for work experience descriptions
const experienceSuggestions = [
  "Led a team of {teamSize} professionals to deliver {project} on time and under budget.",
  "Increased {metric} by {percentage}% through implementation of {strategy}.",
  "Managed {budget} budget while overseeing {project} from concept to completion.",
  "Developed and executed {strategy} strategy resulting in {outcome}.",
  "Streamlined {process} processes, reducing {metric} by {percentage}%.",
  "Collaborated with cross-functional teams to deliver {project} that {achievement}.",
  "Initiated and led {project} that generated {amount} in additional revenue.",
  "Redesigned {system}, improving efficiency by {percentage}% and reducing costs by {amount}.",
  "Spearheaded the transition to {technology}, resulting in {outcome}.",
  "Created and implemented {program} that enhanced {metric} by {percentage}%."
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
  generateAiTemplate: () => Promise<ResumeTemplate>;
  generateAiBioSuggestion: (role?: string) => string;
  generateAiExperienceSuggestion: (jobTitle?: string) => string;
  isGenerating: boolean;
  selectedTemplate: ResumeTemplate;
  setSelectedTemplate: (template: ResumeTemplate) => void;
  availableTemplates: ResumeTemplate[];
  generatedTemplates: ResumeTemplate[];
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
  generateAiTemplate: async () => ({ id: '', name: '', color: '', layout: 'single-column' }),
  generateAiBioSuggestion: () => '',
  generateAiExperienceSuggestion: () => '',
  isGenerating: false,
  selectedTemplate: resumeTemplates[0],
  setSelectedTemplate: () => {},
  availableTemplates: resumeTemplates,
  generatedTemplates: [],
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
  const [generatedTemplates, setGeneratedTemplates] = useState<ResumeTemplate[]>([]);

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
      
      const savedGeneratedTemplates = localStorage.getItem('resume-generated-templates');
      if (savedGeneratedTemplates) setGeneratedTemplates(JSON.parse(savedGeneratedTemplates));
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

  // Generate a new AI template
  const generateAiTemplate = async (): Promise<ResumeTemplate> => {
    incrementAiSuggestions(); // Count as AI usage
    
    return new Promise((resolve) => {
      // Simulate AI processing
      setTimeout(() => {
        // Generate a unique template ID
        const templateId = `ai-template-${Date.now()}`;
        
        // Select random layout
        const layout = layoutOptions[Math.floor(Math.random() * layoutOptions.length)];
        
        // Select random color palette
        const colorPalette = colorPalettes[Math.floor(Math.random() * colorPalettes.length)];
        
        // Select random font
        const font = fontOptions[Math.floor(Math.random() * fontOptions.length)];
        
        // Create new template
        const newTemplate: ResumeTemplate = {
          id: templateId,
          name: `AI ${colorPalette.name}`,
          color: colorPalette.primary,
          layout: layout as 'single-column' | 'two-column' | 'hybrid',
          secondaryColor: colorPalette.secondary,
          font: font.family,
        };
        
        // Update state
        setSelectedTemplate(newTemplate);
        
        // Save to generated templates list
        const updatedTemplates = [...generatedTemplates, newTemplate];
        setGeneratedTemplates(updatedTemplates);
        localStorage.setItem('resume-generated-templates', JSON.stringify(updatedTemplates));
        
        // Unlock badge if applicable (create 3 templates)
        if (updatedTemplates.length >= 3) {
          unlockBadge('ai-template-creator');
        }
        
        // Return the new template
        resolve(newTemplate);
      }, 1500); // Simulate 1.5s of "AI processing"
    });
  };

  // Generate an AI suggestion for bio
  const generateAiBioSuggestion = (role?: string): string => {
    incrementAiSuggestions();
    
    // Use the role provided or extract from the form values
    const userRole = role || 
                  formValues.experience[0]?.jobTitle || 
                  'professional';
    
    // Get random suggestion template
    const suggestionTemplate = bioSuggestions[Math.floor(Math.random() * bioSuggestions.length)];
    
    // Generate random skills and traits based on the role
    const skills = [
      'strategic planning', 'leadership', 'team collaboration', 'project management', 
      'data analysis', 'problem-solving', 'communication', 'innovation',
      'technical expertise', 'customer focus', 'process optimization', 'creative thinking'
    ];
    
    const outcomes = [
      'measurable results', 'business growth', 'operational efficiency',
      'cost savings', 'revenue increase', 'customer satisfaction',
      'quality improvements', 'technological advancement'
    ];
    
    const metrics = [
      'productivity', 'performance', 'revenue', 'customer satisfaction',
      'operational efficiency', 'team output', 'quality scores', 'growth'
    ];
    
    const years = Math.floor(Math.random() * 10) + 3; // 3-12 years
    
    // Replace placeholders with values
    let suggestion = suggestionTemplate
      .replace('{role}', userRole)
      .replace('{years}', years.toString())
      .replace('{skill}', getRandomItem(skills))
      .replace('{skill}', getRandomItem(skills, true))
      .replace('{outcome}', getRandomItem(outcomes))
      .replace('{metric}', getRandomItem(metrics))
      .replace('{interest}', 'delivering exceptional results')
      .replace('{achievement}', 'driving organizational success')
      .replace('{area}', 'key business areas')
      .replace('{approach}', 'innovative')
      .replace('{specialty}', userRole.toLowerCase())
      .replace('{value}', 'delivering exceptional results')
      .replace('{trait}', 'exceptional communication skills');
    
    return suggestion;
  };
  
  // Generate an AI suggestion for work experience
  const generateAiExperienceSuggestion = (jobTitle?: string): string => {
    incrementAiSuggestions();
    
    // Use the job title provided or extract from the form values
    const userJobTitle = jobTitle || 
                      formValues.experience[0]?.jobTitle || 
                      'professional';
    
    // Get random suggestion template
    const suggestionTemplate = experienceSuggestions[Math.floor(Math.random() * experienceSuggestions.length)];
    
    // Generate random values based on the job title
    const metrics = [
      'productivity', 'sales', 'efficiency', 'customer satisfaction',
      'performance', 'conversion rates', 'user engagement', 'quality scores'
    ];
    
    const strategies = [
      'new methodologies', 'innovative approaches', 'automated workflows',
      'strategic partnerships', 'team restructuring', 'targeted marketing campaigns',
      'data-driven decision making', 'customer-focused initiatives'
    ];
    
    const processes = [
      'operational', 'manufacturing', 'customer service', 'procurement',
      'onboarding', 'quality assurance', 'sales', 'marketing'
    ];
    
    const technologies = [
      'cloud-based solutions', 'automation tools', 'AI-powered systems',
      'data analytics platforms', 'CRM software', 'digital transformation initiatives',
      'agile methodologies', 'integrated communications systems'
    ];
    
    const projects = [
      'rebranding initiative', 'system migration', 'product launch',
      'digital transformation', 'market expansion', 'process optimization',
      'customer experience enhancement', 'operational efficiency program'
    ];
    
    const teamSize = Math.floor(Math.random() * 20) + 2; // 2-21 people
    const percentage = Math.floor(Math.random() * 50) + 10; // 10-59%
    const amount = `$${(Math.floor(Math.random() * 900) + 100)}K`; // $100K-$999K
    const budget = `$${(Math.floor(Math.random() * 900) + 100)}K`; // $100K-$999K
    
    // Replace placeholders with values
    let suggestion = suggestionTemplate
      .replace('{teamSize}', teamSize.toString())
      .replace('{project}', getRandomItem(projects))
      .replace('{metric}', getRandomItem(metrics))
      .replace('{percentage}', percentage.toString())
      .replace('{strategy}', getRandomItem(strategies))
      .replace('{budget}', budget)
      .replace('{outcome}', `${percentage}% improvement in ${getRandomItem(metrics)}`)
      .replace('{process}', getRandomItem(processes))
      .replace('{amount}', amount)
      .replace('{system}', `the ${getRandomItem(processes)} system`)
      .replace('{technology}', getRandomItem(technologies))
      .replace('{program}', `a new ${getRandomItem(processes)} program`);
    
    return suggestion;
  };
  
  // Helper function to get a random item from an array
  const getRandomItem = (arr: string[], excludePrevious = false): string => {
    if (excludePrevious) {
      // Get a different item than was previously used
      const previousIndex = Math.floor(Math.random() * arr.length);
      let newIndex = previousIndex;
      
      // Make sure we get a different index
      while (newIndex === previousIndex) {
        newIndex = Math.floor(Math.random() * arr.length);
      }
      
      return arr[newIndex];
    }
    
    return arr[Math.floor(Math.random() * arr.length)];
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
    
    // Additional badge for extensive AI usage
    if (newCount >= 10) {
      unlockBadge('ai-power-user');
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
      generateAiTemplate,
      generateAiBioSuggestion,
      generateAiExperienceSuggestion,
      isGenerating,
      selectedTemplate,
      setSelectedTemplate,
      availableTemplates: resumeTemplates,
      generatedTemplates,
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
