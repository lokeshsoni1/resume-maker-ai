
export interface FormValues {
  fullName: string;
  profileImage: File | null;
  profileImageUrl: string;
  personalDetails: {
    bio: string;
    dateOfBirth: string;
    nationality: string;
    address: string;
  };
  experience: ExperienceItem[];
  education: EducationItem[];
  projects: ProjectItem[];
  skills: string[];
  certifications: CertificationItem[];
  contactInformation: {
    email: string;
    phone: string;
    linkedin: string;
    github: string;
    portfolio: string;
  };
  workPreferences: {
    jobType: 'full-time' | 'part-time' | 'contract';
    workMode: 'remote' | 'hybrid' | 'onsite';
    industry: string;
    salaryExpectation: string;
  };
}

export interface ExperienceItem {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  gpa: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  technologies: string;
  link: string;
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  date: string;
  link: string;
}

export interface Theme {
  id: string;
  name: string;
  className: string;
  icon: JSX.Element;
  description: string;
}

export interface ResumeTemplate {
  id: string;
  name: string;
  color: string;
  imageUrl?: string;
  layout: 'single-column' | 'two-column' | 'hybrid';
}

export interface ResumeTemplateProps {
  formValues: FormValues;
  template: ResumeTemplate;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: JSX.Element;
  unlocked: boolean;
}

export type FormStep = 
  | 'personal'
  | 'experience'
  | 'education'
  | 'projects'
  | 'skills'
  | 'certifications'
  | 'contact'
  | 'preferences';
