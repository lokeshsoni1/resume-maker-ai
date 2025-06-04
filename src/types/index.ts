
// Form Types
export type FormStep =
  | 'personal'
  | 'experience'
  | 'education'
  | 'projects'
  | 'skills'
  | 'certifications'
  | 'contact'
  | 'preferences';

export interface PersonalDetails {
  bio: string;
  dateOfBirth: string;
  nationality: string;
  address: string;
}

export interface ContactInformation {
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  portfolio: string;
}

export interface Experience {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export type ExperienceItem = Experience;

export interface Education {
  id: string;
  degree: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  gpa: string;
}

export type EducationItem = Education;

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string;
  link: string;
}

export type ProjectItem = Project;

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  link: string;
}

export type CertificationItem = Certification;

export interface WorkPreferences {
  jobType: string;
  workMode: string;
  industry: string;
  salaryExpectation: string;
  salaryCurrency?: string; // Added for currency selection
}

export interface FormValues {
  fullName: string;
  profileImage: File | null;
  profileImageUrl: string;
  personalDetails: PersonalDetails;
  experience: Experience[];
  education: Education[];
  projects: Project[];
  skills: string[];
  certifications: Certification[];
  contactInformation: ContactInformation;
  workPreferences: WorkPreferences;
}

// Theme Types
export interface Theme {
  id: string;
  name: string;
  className: string;
  icon: React.ReactNode;
  description: string;
}

// Resume Template Types
export interface ResumeTemplate {
  id: string;
  name: string;
  color: string;
  layout: 'single-column' | 'two-column' | 'hybrid';
  secondaryColor?: string;
  font?: string;
  isAiGenerated?: boolean;
  accentColor?: string;
  headerColor?: string;
  borderStyle?: string;
  headerLayout?: string;
  profilePosition?: string;
  sectionSpacing?: string;
  className?: string;
}

export interface AITemplate extends ResumeTemplate {
  isAiGenerated: true;
  fontFamily: string;
  sectionAlignment: 'left' | 'center' | 'justified';
  borderStyle?: string;
  iconSet?: string;
}

// Badge Types
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
}

// AI Suggestion Types
export interface AISuggestion {
  id: string;
  text: string;
  type: 'bio' | 'experience' | 'project';
  context?: string; // e.g., job title, industry, etc.
}

// Download Format Types
export type DownloadFormat = 'png' | 'pdf' | 'word';

// Currency Types
export type CurrencyCode = 'INR' | 'USD' | 'EUR';
export interface CurrencyOption {
  code: CurrencyCode;
  symbol: string;
  label: string;
}
