
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

// Import our download options component
import { DownloadOptions } from '@/components/DownloadOptions';

export const ResumePreview = () => {
  const { formValues, generateAiTemplate } = useResume();
  const { themes, currentTheme } = useTheme();
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Enhanced template styles based on the 7 uploaded resume designs
  const getTemplateClass = () => {
    const theme = themes.find(t => t.id === currentTheme);
    return theme ? theme.className : 'default-theme';
  };

  // Dynamic template styles inspired by the uploaded images
  const getEnhancedTemplateStyles = () => {
    const theme = themes.find(t => t.id === currentTheme);
    if (!theme) return {};

    // Template style variations inspired by the 7 uploaded images
    const templateVariations = {
      'modern': {
        headerColor: '#1a202c',
        accentColor: '#4a5568',
        font: 'Inter',
        layout: 'single-column',
        borderStyle: 'border-b-2',
        sectionSpacing: 'mb-6'
      },
      'professional': {
        headerColor: '#2d3748',
        accentColor: '#718096',
        font: 'Times New Roman',
        layout: 'two-column',
        borderStyle: 'border-l-4 border-l-blue-600',
        sectionSpacing: 'mb-8'
      },
      'creative': {
        headerColor: '#e53e3e',
        accentColor: '#fc8181',
        font: 'Montserrat',
        layout: 'creative-blocks',
        borderStyle: 'border-t-4 border-t-orange-500',
        sectionSpacing: 'mb-5'
      },
      'minimalist': {
        headerColor: '#000000',
        accentColor: '#4a4a4a',
        font: 'Arial',
        layout: 'clean-minimal',
        borderStyle: 'border-none',
        sectionSpacing: 'mb-4'
      },
      'executive': {
        headerColor: '#2b6cb0',
        accentColor: '#90cdf4',
        font: 'Garamond',
        layout: 'executive-sidebar',
        borderStyle: 'border-b-2 border-b-blue-800',
        sectionSpacing: 'mb-7'
      },
      'tech': {
        headerColor: '#1a5276',
        accentColor: '#5dade2',
        font: 'Fira Code',
        layout: 'tech-grid',
        borderStyle: 'border-l-2 border-l-cyan-600',
        sectionSpacing: 'mb-6'
      }
    };

    return templateVariations[theme.id] || templateVariations['modern'];
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

  const templateStyles = getEnhancedTemplateStyles();
  
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
        
        {/* Enhanced A4 Resume Preview Container */}
        <div className="resume-container mx-auto mb-8 max-w-4xl shadow-2xl rounded-lg overflow-hidden border border-gray-200">
          <div 
            className={`resume-content ${getTemplateClass()}`} 
            id="resume-content" 
            style={{ 
              backgroundColor: '#FFFFFF',
              width: '794px', // A4 width at 96 DPI
              minHeight: '1123px', // A4 height at 96 DPI
              margin: '0 auto',
              padding: '48px',
              boxSizing: 'border-box',
              fontFamily: templateStyles.font || 'Inter',
              fontSize: '14px',
              lineHeight: '1.5',
              color: '#000000'
            }}
          >
            {/* Enhanced Header Section */}
            <header className={`resume-header ${templateStyles.borderStyle} mb-6 pb-6`}>
              <div className="flex items-start gap-6">
                <div className="profile-image">
                  {formValues.profileImageUrl && (
                    <img 
                      src={formValues.profileImageUrl} 
                      alt="Profile" 
                      className="w-32 h-32 rounded-full object-cover border-4 shadow-lg"
                      style={{ borderColor: templateStyles.headerColor }}
                    />
                  )}
                </div>
                <div className="header-content flex-1">
                  <h1 
                    className="text-4xl font-bold mb-3" 
                    style={{ 
                      color: templateStyles.headerColor,
                      fontFamily: templateStyles.font 
                    }}
                  >
                    {formValues.fullName || 'Your Name'}
                  </h1>
                  <p 
                    className="text-lg mb-4" 
                    style={{ color: templateStyles.accentColor }}
                  >
                    {formValues.personalDetails.bio || 'Professional Title'}
                  </p>
                  <div className="contact-info grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">Email:</span> 
                      <span>{formValues.contactInformation.email || 'email@example.com'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">Phone:</span> 
                      <span>{formValues.contactInformation.phone || '(123) 456-7890'}</span>
                    </div>
                    <div className="flex items-center gap-2 md:col-span-2">
                      <span className="font-semibold">Address:</span> 
                      <span>{formValues.personalDetails.address || '123 Street, City, State'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </header>
            
            {/* Experience Section */}
            <section className={`experience-section ${templateStyles.sectionSpacing} pb-6 border-b border-gray-200`}>
              <h2 
                className={`text-2xl font-bold mb-4 uppercase tracking-wide ${templateStyles.borderStyle} pb-2`}
                style={{ color: templateStyles.headerColor }}
              >
                Professional Experience
              </h2>
              {formValues.experience.map((exp) => (
                <div key={exp.id} className="experience-item mb-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 
                      className="font-bold text-xl" 
                      style={{ color: templateStyles.headerColor }}
                    >
                      {exp.jobTitle}
                    </h3>
                    <span 
                      className="text-sm font-medium" 
                      style={{ color: templateStyles.accentColor }}
                    >
                      {getFormattedDate(exp.startDate)} - {exp.current ? 'Present' : getFormattedDate(exp.endDate)}
                    </span>
                  </div>
                  <p 
                    className="font-semibold text-lg mb-1" 
                    style={{ color: templateStyles.accentColor }}
                  >
                    {exp.company}
                  </p>
                  <p className="text-sm mb-2 italic">{exp.location}</p>
                  <p className="text-sm leading-relaxed">{exp.description}</p>
                </div>
              ))}
            </section>
            
            {/* Education Section */}
            <section className={`education-section ${templateStyles.sectionSpacing} py-6 border-b border-gray-200`}>
              <h2 
                className={`text-2xl font-bold mb-4 uppercase tracking-wide ${templateStyles.borderStyle} pb-2`}
                style={{ color: templateStyles.headerColor }}
              >
                Education
              </h2>
              {formValues.education.map((edu) => (
                <div key={edu.id} className="education-item mb-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 
                      className="font-bold text-lg" 
                      style={{ color: templateStyles.headerColor }}
                    >
                      {edu.degree}
                    </h3>
                    <span 
                      className="text-sm font-medium" 
                      style={{ color: templateStyles.accentColor }}
                    >
                      {getFormattedDate(edu.startDate)} - {edu.current ? 'Present' : getFormattedDate(edu.endDate)}
                    </span>
                  </div>
                  <p 
                    className="font-semibold mb-1" 
                    style={{ color: templateStyles.accentColor }}
                  >
                    {edu.institution}
                  </p>
                  <p className="text-sm mb-1">{edu.location}</p>
                  <p className="text-sm">GPA: {edu.gpa}</p>
                </div>
              ))}
            </section>
            
            {/* Projects Section */}
            <section className={`projects-section ${templateStyles.sectionSpacing} py-6 border-b border-gray-200`}>
              <h2 
                className={`text-2xl font-bold mb-4 uppercase tracking-wide ${templateStyles.borderStyle} pb-2`}
                style={{ color: templateStyles.headerColor }}
              >
                Projects
              </h2>
              {formValues.projects.map((project) => (
                <div key={project.id} className="project-item mb-5">
                  <h3 
                    className="font-bold text-lg mb-2" 
                    style={{ color: templateStyles.headerColor }}
                  >
                    {project.title}
                  </h3>
                  <p className="text-sm mb-2 leading-relaxed">{project.description}</p>
                  <p className="text-sm mb-2">
                    <span className="font-semibold">Technologies:</span> {project.technologies}
                  </p>
                  <a 
                    href={project.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-sm hover:underline"
                    style={{ color: templateStyles.headerColor }}
                  >
                    View Project
                  </a>
                </div>
              ))}
            </section>
            
            {/* Skills Section */}
            <section className={`skills-section ${templateStyles.sectionSpacing} py-6 border-b border-gray-200`}>
              <h2 
                className={`text-2xl font-bold mb-4 uppercase tracking-wide ${templateStyles.borderStyle} pb-2`}
                style={{ color: templateStyles.headerColor }}
              >
                Skills
              </h2>
              <div className="skills-list flex flex-wrap gap-2">
                {formValues.skills.map((skill, index) => (
                  <Badge 
                    key={index} 
                    className="skill-badge text-white" 
                    style={{ backgroundColor: templateStyles.accentColor }}
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </section>
            
            {/* Certifications Section */}
            <section className={`certifications-section ${templateStyles.sectionSpacing} py-6 border-b border-gray-200`}>
              <h2 
                className={`text-2xl font-bold mb-4 uppercase tracking-wide ${templateStyles.borderStyle} pb-2`}
                style={{ color: templateStyles.headerColor }}
              >
                Certifications
              </h2>
              {formValues.certifications.map((cert) => (
                <div key={cert.id} className="certification-item mb-5">
                  <h3 
                    className="font-bold text-lg mb-1" 
                    style={{ color: templateStyles.headerColor }}
                  >
                    {cert.name}
                  </h3>
                  <p className="text-sm mb-1">
                    <span className="font-semibold">Issuer:</span> {cert.issuer}
                  </p>
                  <p className="text-sm mb-2">
                    <span className="font-semibold">Date:</span> {getFormattedDate(cert.date)}
                  </p>
                  <a 
                    href={cert.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm hover:underline" 
                    style={{ color: templateStyles.headerColor }}
                  >
                    View Certification
                  </a>
                </div>
              ))}
            </section>
            
            {/* Work Preferences Section */}
            <section className={`preferences-section ${templateStyles.sectionSpacing} py-6`}>
              <h2 
                className={`text-2xl font-bold mb-4 uppercase tracking-wide ${templateStyles.borderStyle} pb-2`}
                style={{ color: templateStyles.headerColor }}
              >
                Work Preferences
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <p className="text-sm">
                  <span className="font-semibold">Job Type:</span> {formValues.workPreferences.jobType}
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Work Mode:</span> {formValues.workPreferences.workMode}
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Industry:</span> {formValues.workPreferences.industry}
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Salary:</span> {formatSalary(formValues.workPreferences.salaryExpectation, formValues.workPreferences.salaryCurrency)}
                </p>
              </div>
            </section>
          </div>
        </div>
        
        <DownloadOptions />
      </div>
    </section>
  );
};
