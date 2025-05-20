
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
        
        <div className="resume-container bg-white shadow-lg rounded-lg overflow-hidden mb-8" style={{ backgroundColor: '#FFFFFF' }}>
          <div className={`resume-content ${getThemeClass()}`} id="resume-content">
            <header className="resume-header">
              <div className="profile-image">
                {formValues.profileImageUrl && (
                  <img src={formValues.profileImageUrl} alt="Profile" />
                )}
              </div>
              <div className="header-content">
                <h1>{formValues.fullName}</h1>
                <p className="bio">{formValues.personalDetails.bio}</p>
                <ul className="contact-info">
                  <li>Email: {formValues.contactInformation.email}</li>
                  <li>Phone: {formValues.contactInformation.phone}</li>
                  <li>Address: {formValues.personalDetails.address}</li>
                </ul>
              </div>
            </header>
            
            <section className="experience-section">
              <h2>Experience</h2>
              {formValues.experience.map((exp) => (
                <div key={exp.id} className="experience-item">
                  <h3>{exp.jobTitle} at {exp.company}</h3>
                  <p className="dates">
                    {getFormattedDate(exp.startDate)} - {exp.current ? 'Present' : getFormattedDate(exp.endDate)}
                  </p>
                  <p className="location">{exp.location}</p>
                  <p className="description">{exp.description}</p>
                </div>
              ))}
            </section>
            
            <section className="education-section">
              <h2>Education</h2>
              {formValues.education.map((edu) => (
                <div key={edu.id} className="education-item">
                  <h3>{edu.degree} at {edu.institution}</h3>
                  <p className="dates">
                    {getFormattedDate(edu.startDate)} - {edu.current ? 'Present' : getFormattedDate(edu.endDate)}
                  </p>
                  <p className="location">{edu.location}</p>
                  <p className="gpa">GPA: {edu.gpa}</p>
                </div>
              ))}
            </section>
            
            <section className="projects-section">
              <h2>Projects</h2>
              {formValues.projects.map((project) => (
                <div key={project.id} className="project-item">
                  <h3>{project.title}</h3>
                  <p className="description">{project.description}</p>
                  <p className="technologies">Technologies: {project.technologies}</p>
                  <a href={project.link} target="_blank" rel="noopener noreferrer">
                    View Project
                  </a>
                </div>
              ))}
            </section>
            
            <section className="skills-section">
              <h2>Skills</h2>
              <div className="skills-list">
                {formValues.skills.map((skill, index) => (
                  <Badge key={index} className="skill-badge">{skill}</Badge>
                ))}
              </div>
            </section>
            
            <section className="certifications-section">
              <h2>Certifications</h2>
              {formValues.certifications.map((cert) => (
                <div key={cert.id} className="certification-item">
                  <h3>{cert.name}</h3>
                  <p className="issuer">Issuer: {cert.issuer}</p>
                  <p className="date">Date: {getFormattedDate(cert.date)}</p>
                  <a href={cert.link} target="_blank" rel="noopener noreferrer">
                    View Certification
                  </a>
                </div>
              ))}
            </section>
            
            <section className="preferences-section">
              <h2>Work Preferences</h2>
              <p>Job Type: {formValues.workPreferences.jobType}</p>
              <p>Work Mode: {formValues.workPreferences.workMode}</p>
              <p>Industry: {formValues.workPreferences.industry}</p>
              <p>
                Salary Expectation: {formatSalary(formValues.workPreferences.salaryExpectation, formValues.workPreferences.salaryCurrency)}
              </p>
            </section>
          </div>
        </div>
        
        <DownloadOptions />
      </div>
    </section>
  );
};
