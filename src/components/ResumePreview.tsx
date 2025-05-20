
import { useResume } from '@/contexts/ResumeContext';
import { useTheme } from '@/contexts/ThemeContext'; 
import { getFormattedDate, formatSalary } from '@/lib/date-utils';
import { Badge } from '@/components/ui/badge';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { Icons } from '@/components/ui/icons';
import html2canvas from 'html2canvas';

// Import our download options component at the top of the file
import { DownloadOptions } from '@/components/DownloadOptions';

export const ResumePreview = () => {
  const { formValues, generateAiTemplate } = useResume();
  const { themes, currentTheme } = useTheme(); // Get theme from ThemeContext
  const [isGenerating, setIsGenerating] = useState(false);
  
  const getThemeClass = () => {
    const theme = themes.find(t => t.id === currentTheme);
    return theme ? theme.className : 'default-theme';
  };
  
  const handleGenerateAiTemplate = async () => {
    try {
      setIsGenerating(true);
      
      toast({
        title: "Generating Template",
        description: "AI is creating a unique template just for you...",
      });
      
      // Generate new AI template
      const newTemplate = await generateAiTemplate();
      
      toast({
        title: "Template Created!",
        description: `Your AI-generated "${newTemplate.name}" template is ready to use.`,
      });
    } catch (error) {
      console.error('Error generating template:', error);
      toast({
        title: "Generation Failed",
        description: "We couldn't create a new template. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <section id="resume-preview" className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">
          Resume Preview
        </h2>
        
        <div className="mb-6 flex flex-wrap justify-center gap-3">
          <Button 
            onClick={handleGenerateAiTemplate} 
            variant="outline"
            disabled={isGenerating}
            className="flex items-center gap-2"
          >
            {isGenerating ? (
              <>
                <Icons.loader2 className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Icons.refreshCw className="h-4 w-4" />
                Auto-Generate Resume Template with AI
              </>
            )}
          </Button>
          
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => {
              const element = document.getElementById('build');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            Edit Resume
          </Button>
        </div>
        
        <div className="resume-container bg-white shadow-lg rounded-lg overflow-hidden mb-8 max-w-4xl mx-auto border">
          <div 
            className={`resume-content ${getThemeClass()}`} 
            id="resume-content" 
            style={{ backgroundColor: '#FFFFFF' }}
          >
            <header className="resume-header p-6 border-b">
              <div className="profile-image">
                {formValues.profileImageUrl && (
                  <img 
                    src={formValues.profileImageUrl} 
                    alt="Profile" 
                    className="w-24 h-24 rounded-full object-cover border-2 border-primary"
                  />
                )}
              </div>
              <div className="header-content">
                <h1 className="text-3xl font-bold text-primary mb-2">{formValues.fullName}</h1>
                <p className="bio text-muted-foreground mb-4">{formValues.personalDetails.bio}</p>
                <ul className="contact-info grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="font-semibold">Email:</span> {formValues.contactInformation.email}
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="font-semibold">Phone:</span> {formValues.contactInformation.phone}
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="font-semibold">Address:</span> {formValues.personalDetails.address}
                  </li>
                </ul>
              </div>
            </header>
            
            <section className="experience-section p-6 border-b">
              <h2 className="text-xl font-semibold text-primary mb-4 uppercase tracking-wide">Experience</h2>
              {formValues.experience.map((exp) => (
                <div key={exp.id} className="experience-item mb-5">
                  <h3 className="font-medium text-lg">{exp.jobTitle} at {exp.company}</h3>
                  <p className="dates text-sm text-muted-foreground mb-1">
                    {getFormattedDate(exp.startDate)} - {exp.current ? 'Present' : getFormattedDate(exp.endDate)}
                  </p>
                  <p className="location text-sm mb-2">{exp.location}</p>
                  <p className="description text-sm leading-relaxed">{exp.description}</p>
                </div>
              ))}
            </section>
            
            <section className="education-section p-6 border-b">
              <h2 className="text-xl font-semibold text-primary mb-4 uppercase tracking-wide">Education</h2>
              {formValues.education.map((edu) => (
                <div key={edu.id} className="education-item mb-5">
                  <h3 className="font-medium text-lg">{edu.degree} at {edu.institution}</h3>
                  <p className="dates text-sm text-muted-foreground mb-1">
                    {getFormattedDate(edu.startDate)} - {edu.current ? 'Present' : getFormattedDate(edu.endDate)}
                  </p>
                  <p className="location text-sm mb-1">{edu.location}</p>
                  <p className="gpa text-sm">GPA: {edu.gpa}</p>
                </div>
              ))}
            </section>
            
            <section className="projects-section p-6 border-b">
              <h2 className="text-xl font-semibold text-primary mb-4 uppercase tracking-wide">Projects</h2>
              {formValues.projects.map((project) => (
                <div key={project.id} className="project-item mb-5">
                  <h3 className="font-medium text-lg">{project.title}</h3>
                  <p className="description text-sm mb-2">{project.description}</p>
                  <p className="technologies text-sm mb-2">
                    <span className="font-semibold">Technologies:</span> {project.technologies}
                  </p>
                  <a 
                    href={project.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-sm text-primary hover:underline"
                  >
                    View Project
                  </a>
                </div>
              ))}
            </section>
            
            <section className="skills-section p-6 border-b">
              <h2 className="text-xl font-semibold text-primary mb-4 uppercase tracking-wide">Skills</h2>
              <div className="skills-list flex flex-wrap gap-2">
                {formValues.skills.map((skill, index) => (
                  <Badge key={index} className="skill-badge">{skill}</Badge>
                ))}
              </div>
            </section>
            
            <section className="certifications-section p-6 border-b">
              <h2 className="text-xl font-semibold text-primary mb-4 uppercase tracking-wide">Certifications</h2>
              {formValues.certifications.map((cert) => (
                <div key={cert.id} className="certification-item mb-5">
                  <h3 className="font-medium text-lg">{cert.name}</h3>
                  <p className="issuer text-sm mb-1"><span className="font-semibold">Issuer:</span> {cert.issuer}</p>
                  <p className="date text-sm mb-2"><span className="font-semibold">Date:</span> {getFormattedDate(cert.date)}</p>
                  <a 
                    href={cert.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline" 
                  >
                    View Certification
                  </a>
                </div>
              ))}
            </section>
            
            <section className="preferences-section p-6">
              <h2 className="text-xl font-semibold text-primary mb-4 uppercase tracking-wide">Work Preferences</h2>
              <p className="text-sm mb-2"><span className="font-semibold">Job Type:</span> {formValues.workPreferences.jobType}</p>
              <p className="text-sm mb-2"><span className="font-semibold">Work Mode:</span> {formValues.workPreferences.workMode}</p>
              <p className="text-sm mb-2"><span className="font-semibold">Industry:</span> {formValues.workPreferences.industry}</p>
              <p className="text-sm">
                <span className="font-semibold">Salary Expectation:</span> {formatSalary(formValues.workPreferences.salaryExpectation, formValues.workPreferences.salaryCurrency)}
              </p>
            </section>
          </div>
        </div>
        
        <DownloadOptions />
      </div>
    </section>
  );
};
