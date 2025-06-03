
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

  // Dynamic template styles with significantly more variation
  const getEnhancedTemplateStyles = () => {
    const theme = themes.find(t => t.id === currentTheme);
    if (!theme) return {};

    // Expanded template variations with more unique combinations
    const templateVariations = {
      'modern': {
        headerColor: '#1a202c',
        accentColor: '#4a5568',
        font: 'Inter, sans-serif',
        layout: 'single-column',
        borderStyle: 'border-b-2',
        sectionSpacing: 'mb-6',
        headerLayout: 'flex-row',
        profilePosition: 'left'
      },
      'professional': {
        headerColor: '#2d3748',
        accentColor: '#718096',
        font: 'Georgia, serif',
        layout: 'two-column',
        borderStyle: 'border-l-4 border-l-blue-600',
        sectionSpacing: 'mb-8',
        headerLayout: 'flex-col',
        profilePosition: 'center'
      },
      'creative': {
        headerColor: '#e53e3e',
        accentColor: '#fc8181',
        font: 'Montserrat, sans-serif',
        layout: 'creative-blocks',
        borderStyle: 'border-t-4 border-t-orange-500',
        sectionSpacing: 'mb-5',
        headerLayout: 'grid',
        profilePosition: 'right'
      },
      'minimalist': {
        headerColor: '#000000',
        accentColor: '#4a4a4a',
        font: 'Arial, sans-serif',
        layout: 'clean-minimal',
        borderStyle: 'border-none',
        sectionSpacing: 'mb-4',
        headerLayout: 'flex-row',
        profilePosition: 'left'
      },
      'executive': {
        headerColor: '#2b6cb0',
        accentColor: '#90cdf4',
        font: 'Times New Roman, serif',
        layout: 'executive-sidebar',
        borderStyle: 'border-b-2 border-b-blue-800',
        sectionSpacing: 'mb-7',
        headerLayout: 'flex-col',
        profilePosition: 'center'
      },
      'tech': {
        headerColor: '#1a5276',
        accentColor: '#5dade2',
        font: 'Roboto Mono, monospace',
        layout: 'tech-grid',
        borderStyle: 'border-l-2 border-l-cyan-600',
        sectionSpacing: 'mb-6',
        headerLayout: 'grid',
        profilePosition: 'right'
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
      
      // Generate new AI template with truly unique variations
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
                <Icons.wand className="h-4 w-4" />
                Auto-Generate New Resume Template with AI
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
        
        {/* Fixed A4 Resume Preview Container */}
        <div className="resume-container mx-auto mb-8 shadow-2xl rounded-lg overflow-hidden border border-gray-200">
          <div 
            className={`resume-content ${getTemplateClass()}`} 
            id="resume-content" 
            style={{ 
              backgroundColor: '#FFFFFF',
              width: '794px', // Exact A4 width at 96 DPI
              height: '1123px', // Exact A4 height at 96 DPI
              margin: '0 auto',
              padding: '40px',
              boxSizing: 'border-box',
              fontFamily: templateStyles.font || 'Inter, sans-serif',
              fontSize: '14px',
              lineHeight: '1.4',
              color: '#000000',
              overflow: 'hidden', // Prevent content overflow
              position: 'relative'
            }}
          >
            {/* Enhanced Header Section with Dynamic Layout */}
            <header className={`resume-header ${templateStyles.borderStyle} mb-4 pb-4`}>
              <div className={`flex items-start gap-4 ${templateStyles.headerLayout === 'flex-col' ? 'flex-col items-center text-center' : templateStyles.headerLayout === 'grid' ? 'grid grid-cols-3 gap-4' : 'flex-row'}`}>
                {templateStyles.profilePosition === 'left' && formValues.profileImageUrl && (
                  <div className="profile-image flex-shrink-0">
                    <img 
                      src={formValues.profileImageUrl} 
                      alt="Profile" 
                      className="w-24 h-24 rounded-full object-cover border-2 shadow-md"
                      style={{ borderColor: templateStyles.headerColor }}
                    />
                  </div>
                )}
                
                <div className="header-content flex-1">
                  <h1 
                    className="text-3xl font-bold mb-2" 
                    style={{ 
                      color: templateStyles.headerColor,
                      fontFamily: templateStyles.font,
                      fontSize: templateStyles.headerLayout === 'grid' ? '2.5rem' : '3rem'
                    }}
                  >
                    {formValues.fullName || 'Your Name'}
                  </h1>
                  <p 
                    className="text-base mb-3" 
                    style={{ color: templateStyles.accentColor }}
                  >
                    {formValues.personalDetails.bio || 'Professional Title'}
                  </p>
                  <div className="contact-info grid grid-cols-1 md:grid-cols-2 gap-1 text-sm">
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

                {templateStyles.profilePosition === 'right' && formValues.profileImageUrl && (
                  <div className="profile-image flex-shrink-0">
                    <img 
                      src={formValues.profileImageUrl} 
                      alt="Profile" 
                      className="w-24 h-24 rounded-full object-cover border-2 shadow-md"
                      style={{ borderColor: templateStyles.headerColor }}
                    />
                  </div>
                )}

                {templateStyles.profilePosition === 'center' && formValues.profileImageUrl && (
                  <div className="profile-image mx-auto">
                    <img 
                      src={formValues.profileImageUrl} 
                      alt="Profile" 
                      className="w-28 h-28 rounded-full object-cover border-2 shadow-md"
                      style={{ borderColor: templateStyles.headerColor }}
                    />
                  </div>
                )}
              </div>
            </header>
            
            {/* Experience Section */}
            <section className={`experience-section ${templateStyles.sectionSpacing} pb-4 border-b border-gray-200`}>
              <h2 
                className={`text-xl font-bold mb-3 uppercase tracking-wide ${templateStyles.borderStyle} pb-1`}
                style={{ color: templateStyles.headerColor }}
              >
                Professional Experience
              </h2>
              {formValues.experience.slice(0, 3).map((exp) => (
                <div key={exp.id} className="experience-item mb-4">
                  <div className="flex justify-between items-start mb-1">
                    <h3 
                      className="font-bold text-base" 
                      style={{ color: templateStyles.headerColor }}
                    >
                      {exp.jobTitle}
                    </h3>
                    <span 
                      className="text-xs font-medium" 
                      style={{ color: templateStyles.accentColor }}
                    >
                      {getFormattedDate(exp.startDate)} - {exp.current ? 'Present' : getFormattedDate(exp.endDate)}
                    </span>
                  </div>
                  <p 
                    className="font-semibold text-sm mb-1" 
                    style={{ color: templateStyles.accentColor }}
                  >
                    {exp.company}
                  </p>
                  <p className="text-xs mb-1 italic">{exp.location}</p>
                  <p className="text-xs leading-relaxed">{exp.description?.substring(0, 120)}...</p>
                </div>
              ))}
            </section>
            
            {/* Education Section */}
            <section className={`education-section ${templateStyles.sectionSpacing} py-4 border-b border-gray-200`}>
              <h2 
                className={`text-xl font-bold mb-3 uppercase tracking-wide ${templateStyles.borderStyle} pb-1`}
                style={{ color: templateStyles.headerColor }}
              >
                Education
              </h2>
              {formValues.education.slice(0, 2).map((edu) => (
                <div key={edu.id} className="education-item mb-3">
                  <div className="flex justify-between items-start mb-1">
                    <h3 
                      className="font-bold text-sm" 
                      style={{ color: templateStyles.headerColor }}
                    >
                      {edu.degree}
                    </h3>
                    <span 
                      className="text-xs font-medium" 
                      style={{ color: templateStyles.accentColor }}
                    >
                      {getFormattedDate(edu.startDate)} - {edu.current ? 'Present' : getFormattedDate(edu.endDate)}
                    </span>
                  </div>
                  <p 
                    className="font-semibold text-sm mb-1" 
                    style={{ color: templateStyles.accentColor }}
                  >
                    {edu.institution}
                  </p>
                  <p className="text-xs mb-1">{edu.location}</p>
                  <p className="text-xs">GPA: {edu.gpa}</p>
                </div>
              ))}
            </section>
            
            {/* Projects Section */}
            <section className={`projects-section ${templateStyles.sectionSpacing} py-4 border-b border-gray-200`}>
              <h2 
                className={`text-xl font-bold mb-3 uppercase tracking-wide ${templateStyles.borderStyle} pb-1`}
                style={{ color: templateStyles.headerColor }}
              >
                Projects
              </h2>
              {formValues.projects.slice(0, 2).map((project) => (
                <div key={project.id} className="project-item mb-3">
                  <h3 
                    className="font-bold text-sm mb-1" 
                    style={{ color: templateStyles.headerColor }}
                  >
                    {project.title}
                  </h3>
                  <p className="text-xs mb-1 leading-relaxed">{project.description?.substring(0, 100)}...</p>
                  <p className="text-xs mb-1">
                    <span className="font-semibold">Technologies:</span> {project.technologies}
                  </p>
                </div>
              ))}
            </section>
            
            {/* Skills Section */}
            <section className={`skills-section ${templateStyles.sectionSpacing} py-4 border-b border-gray-200`}>
              <h2 
                className={`text-xl font-bold mb-3 uppercase tracking-wide ${templateStyles.borderStyle} pb-1`}
                style={{ color: templateStyles.headerColor }}
              >
                Skills
              </h2>
              <div className="skills-list flex flex-wrap gap-1">
                {formValues.skills.slice(0, 8).map((skill, index) => (
                  <Badge 
                    key={index} 
                    className="skill-badge text-white text-xs py-1 px-2" 
                    style={{ backgroundColor: templateStyles.accentColor }}
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </section>
            
            {/* Certifications Section */}
            <section className={`certifications-section ${templateStyles.sectionSpacing} py-4 border-b border-gray-200`}>
              <h2 
                className={`text-xl font-bold mb-3 uppercase tracking-wide ${templateStyles.borderStyle} pb-1`}
                style={{ color: templateStyles.headerColor }}
              >
                Certifications
              </h2>
              {formValues.certifications.slice(0, 2).map((cert) => (
                <div key={cert.id} className="certification-item mb-3">
                  <h3 
                    className="font-bold text-sm mb-1" 
                    style={{ color: templateStyles.headerColor }}
                  >
                    {cert.name}
                  </h3>
                  <p className="text-xs mb-1">
                    <span className="font-semibold">Issuer:</span> {cert.issuer}
                  </p>
                  <p className="text-xs mb-1">
                    <span className="font-semibold">Date:</span> {getFormattedDate(cert.date)}
                  </p>
                </div>
              ))}
            </section>
            
            {/* Work Preferences Section */}
            <section className={`preferences-section ${templateStyles.sectionSpacing} py-4`}>
              <h2 
                className={`text-xl font-bold mb-3 uppercase tracking-wide ${templateStyles.borderStyle} pb-1`}
                style={{ color: templateStyles.headerColor }}
              >
                Work Preferences
              </h2>
              <div className="grid grid-cols-2 gap-2">
                <p className="text-xs">
                  <span className="font-semibold">Job Type:</span> {formValues.workPreferences.jobType}
                </p>
                <p className="text-xs">
                  <span className="font-semibold">Work Mode:</span> {formValues.workPreferences.workMode}
                </p>
                <p className="text-xs">
                  <span className="font-semibold">Industry:</span> {formValues.workPreferences.industry}
                </p>
                <p className="text-xs">
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
