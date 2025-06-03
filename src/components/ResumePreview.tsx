
import { useResume } from '@/contexts/ResumeContext';
import { useTheme } from '@/contexts/ThemeContext'; 
import { getFormattedDate, formatSalary } from '@/lib/date-utils';
import { Badge } from '@/components/ui/badge';
import { Download, Wand } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import html2canvas from 'html2canvas';

// Import our download options component
import { DownloadOptions } from '@/components/DownloadOptions';

export const ResumePreview = () => {
  const { formValues, selectedTemplate, generateAiTemplate, setSelectedTemplate } = useResume();
  const { themes, currentTheme } = useTheme();
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Enhanced template styles based on the 6 predefined templates
  const getTemplateClass = () => {
    const theme = themes.find(t => t.id === currentTheme);
    return theme ? theme.className : 'default-theme';
  };

  // Template styling configurations for the six predefined templates
  const getTemplateStyles = () => {
    const templateConfigs = {
      'modern': {
        headerColor: '#1a202c',
        accentColor: '#4a5568',
        font: 'Roboto, sans-serif',
        layout: 'single-column' as const,
        borderStyle: 'border-b-2 border-gray-300',
        sectionSpacing: 'mb-6',
        headerLayout: 'flex-row',
        profilePosition: 'left'
      },
      'professional': {
        headerColor: '#2d3748',
        accentColor: '#718096',
        font: 'Times New Roman, serif',
        layout: 'two-column' as const,
        borderStyle: 'border-l-4 border-blue-600',
        sectionSpacing: 'mb-8',
        headerLayout: 'flex-col',
        profilePosition: 'center'
      },
      'creative': {
        headerColor: '#e53e3e',
        accentColor: '#fc8181',
        font: 'Montserrat, sans-serif',
        layout: 'hybrid' as const,
        borderStyle: 'border-t-4 border-orange-500',
        sectionSpacing: 'mb-5',
        headerLayout: 'grid',
        profilePosition: 'right'
      },
      'minimalist': {
        headerColor: '#000000',
        accentColor: '#4a4a4a',
        font: 'Arial, sans-serif',
        layout: 'single-column' as const,
        borderStyle: 'border-none',
        sectionSpacing: 'mb-4',
        headerLayout: 'flex-row',
        profilePosition: 'left'
      },
      'executive': {
        headerColor: '#2b6cb0',
        accentColor: '#90cdf4',
        font: 'Garamond, serif',
        layout: 'two-column' as const,
        borderStyle: 'border-b-2 border-blue-800',
        sectionSpacing: 'mb-7',
        headerLayout: 'flex-col',
        profilePosition: 'center'
      },
      'tech': {
        headerColor: '#1a5276',
        accentColor: '#5dade2',
        font: 'Montserrat, sans-serif',
        layout: 'hybrid' as const,
        borderStyle: 'border-l-2 border-cyan-600',
        sectionSpacing: 'mb-6',
        headerLayout: 'grid',
        profilePosition: 'right'
      }
    };

    // Use selected template or fall back to modern
    const templateKey = selectedTemplate.id as keyof typeof templateConfigs;
    return templateConfigs[templateKey] || templateConfigs['modern'];
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
      
      // Apply the new template
      setSelectedTemplate(newTemplate);
      
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

  const templateStyles = getTemplateStyles();
  
  // Render different layouts based on template type
  const renderSingleColumnLayout = () => (
    <div className="space-y-4">
      {/* Header Section */}
      <header className={`resume-header ${templateStyles.borderStyle} pb-4 mb-4`}>
        <div className={`flex items-start gap-4 ${templateStyles.headerLayout === 'flex-col' ? 'flex-col items-center text-center' : 'flex-row'}`}>
          {templateStyles.profilePosition === 'left' && formValues.profileImageUrl && (
            <div className="profile-image flex-shrink-0">
              <img 
                src={formValues.profileImageUrl} 
                alt="Profile" 
                className="w-20 h-20 rounded-full object-cover border-2 shadow-md"
                style={{ borderColor: templateStyles.headerColor }}
              />
            </div>
          )}
          
          <div className="header-content flex-1">
            <h1 
              className="text-2xl font-bold mb-2" 
              style={{ 
                color: templateStyles.headerColor,
                fontFamily: templateStyles.font
              }}
            >
              {formValues.fullName || 'Your Name'}
            </h1>
            <p 
              className="text-sm mb-3" 
              style={{ color: templateStyles.accentColor }}
            >
              {formValues.personalDetails.bio || 'Professional Title'}
            </p>
            <div className="contact-info grid grid-cols-1 md:grid-cols-2 gap-1 text-xs">
              <div>
                <span className="font-semibold">Email:</span> {formValues.contactInformation.email || 'email@example.com'}
              </div>
              <div>
                <span className="font-semibold">Phone:</span> {formValues.contactInformation.phone || '(123) 456-7890'}
              </div>
              <div className="md:col-span-2">
                <span className="font-semibold">Address:</span> {formValues.personalDetails.address || '123 Street, City, State'}
              </div>
            </div>
          </div>

          {templateStyles.profilePosition === 'right' && formValues.profileImageUrl && (
            <div className="profile-image flex-shrink-0">
              <img 
                src={formValues.profileImageUrl} 
                alt="Profile" 
                className="w-20 h-20 rounded-full object-cover border-2 shadow-md"
                style={{ borderColor: templateStyles.headerColor }}
              />
            </div>
          )}
        </div>
      </header>

      {/* Online Profiles */}
      {(formValues.contactInformation.linkedin || formValues.contactInformation.github || formValues.contactInformation.portfolio) && (
        <section className={`online-profiles ${templateStyles.sectionSpacing}`}>
          <h2 
            className={`text-lg font-bold mb-2 uppercase tracking-wide ${templateStyles.borderStyle} pb-1`}
            style={{ color: templateStyles.headerColor }}
          >
            Online Profiles
          </h2>
          <div className="grid grid-cols-1 gap-1 text-xs">
            {formValues.contactInformation.linkedin && (
              <div>
                <span className="font-semibold">LinkedIn:</span> {formValues.contactInformation.linkedin}
              </div>
            )}
            {formValues.contactInformation.github && (
              <div>
                <span className="font-semibold">GitHub:</span> {formValues.contactInformation.github}
              </div>
            )}
            {formValues.contactInformation.portfolio && (
              <div>
                <span className="font-semibold">Portfolio:</span> {formValues.contactInformation.portfolio}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Skills Section */}
      {formValues.skills.length > 0 && (
        <section className={`skills-section ${templateStyles.sectionSpacing}`}>
          <h2 
            className={`text-lg font-bold mb-2 uppercase tracking-wide ${templateStyles.borderStyle} pb-1`}
            style={{ color: templateStyles.headerColor }}
          >
            Skills
          </h2>
          <div className="skills-list flex flex-wrap gap-1">
            {formValues.skills.slice(0, 12).map((skill, index) => (
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
      )}

      {/* Experience Section */}
      {formValues.experience.length > 0 && formValues.experience[0].jobTitle && (
        <section className={`experience-section ${templateStyles.sectionSpacing}`}>
          <h2 
            className={`text-lg font-bold mb-2 uppercase tracking-wide ${templateStyles.borderStyle} pb-1`}
            style={{ color: templateStyles.headerColor }}
          >
            Professional Experience
          </h2>
          {formValues.experience.slice(0, 4).map((exp) => (
            <div key={exp.id} className="experience-item mb-3">
              <div className="flex justify-between items-start mb-1">
                <h3 
                  className="font-bold text-sm" 
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
              <p className="text-xs leading-relaxed">{exp.description?.substring(0, 150)}...</p>
            </div>
          ))}
        </section>
      )}

      {/* Education Section */}
      {formValues.education.length > 0 && formValues.education[0].degree && (
        <section className={`education-section ${templateStyles.sectionSpacing}`}>
          <h2 
            className={`text-lg font-bold mb-2 uppercase tracking-wide ${templateStyles.borderStyle} pb-1`}
            style={{ color: templateStyles.headerColor }}
          >
            Education
          </h2>
          {formValues.education.slice(0, 3).map((edu) => (
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
              {edu.gpa && <p className="text-xs">GPA: {edu.gpa}</p>}
            </div>
          ))}
        </section>
      )}

      {/* Projects Section */}
      {formValues.projects.length > 0 && formValues.projects[0].title && (
        <section className={`projects-section ${templateStyles.sectionSpacing}`}>
          <h2 
            className={`text-lg font-bold mb-2 uppercase tracking-wide ${templateStyles.borderStyle} pb-1`}
            style={{ color: templateStyles.headerColor }}
          >
            Projects
          </h2>
          {formValues.projects.slice(0, 3).map((project) => (
            <div key={project.id} className="project-item mb-3">
              <h3 
                className="font-bold text-sm mb-1" 
                style={{ color: templateStyles.headerColor }}
              >
                {project.title}
              </h3>
              <p className="text-xs mb-1 leading-relaxed">{project.description?.substring(0, 120)}...</p>
              <p className="text-xs mb-1">
                <span className="font-semibold">Technologies:</span> {project.technologies}
              </p>
              {project.link && (
                <p className="text-xs">
                  <span className="font-semibold">Link:</span> {project.link}
                </p>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Certifications Section */}
      {formValues.certifications.length > 0 && formValues.certifications[0].name && (
        <section className={`certifications-section ${templateStyles.sectionSpacing}`}>
          <h2 
            className={`text-lg font-bold mb-2 uppercase tracking-wide ${templateStyles.borderStyle} pb-1`}
            style={{ color: templateStyles.headerColor }}
          >
            Certifications
          </h2>
          {formValues.certifications.slice(0, 3).map((cert) => (
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
              {cert.link && (
                <p className="text-xs">
                  <span className="font-semibold">Link:</span> {cert.link}
                </p>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Additional Information */}
      <section className={`additional-info ${templateStyles.sectionSpacing}`}>
        <h2 
          className={`text-lg font-bold mb-2 uppercase tracking-wide ${templateStyles.borderStyle} pb-1`}
          style={{ color: templateStyles.headerColor }}
        >
          Additional Information
        </h2>
        <div className="grid grid-cols-2 gap-2">
          <p className="text-xs">
            <span className="font-semibold">Date of Birth:</span> {formValues.personalDetails.dateOfBirth || 'Not specified'}
          </p>
          <p className="text-xs">
            <span className="font-semibold">Nationality:</span> {formValues.personalDetails.nationality || 'Not specified'}
          </p>
          <p className="text-xs">
            <span className="font-semibold">Job Type:</span> {formValues.workPreferences.jobType}
          </p>
          <p className="text-xs">
            <span className="font-semibold">Work Mode:</span> {formValues.workPreferences.workMode}
          </p>
          <p className="text-xs">
            <span className="font-semibold">Industry:</span> {formValues.workPreferences.industry || 'Not specified'}
          </p>
          <p className="text-xs">
            <span className="font-semibold">Salary:</span> {formatSalary(formValues.workPreferences.salaryExpectation, formValues.workPreferences.salaryCurrency)}
          </p>
        </div>
      </section>
    </div>
  );

  const renderTwoColumnLayout = () => (
    <div className="grid grid-cols-3 gap-4">
      {/* Left Sidebar */}
      <div className="col-span-1 space-y-4">
        {/* Profile Image */}
        {formValues.profileImageUrl && (
          <div className="profile-section text-center">
            <img 
              src={formValues.profileImageUrl} 
              alt="Profile" 
              className="w-24 h-24 rounded-full object-cover border-2 shadow-md mx-auto mb-2"
              style={{ borderColor: templateStyles.headerColor }}
            />
          </div>
        )}

        {/* Contact Information */}
        <section className={`contact-section ${templateStyles.sectionSpacing}`}>
          <h2 
            className={`text-sm font-bold mb-2 uppercase tracking-wide ${templateStyles.borderStyle} pb-1`}
            style={{ color: templateStyles.headerColor }}
          >
            Contact
          </h2>
          <div className="space-y-1 text-xs">
            <div>{formValues.contactInformation.email || 'email@example.com'}</div>
            <div>{formValues.contactInformation.phone || '(123) 456-7890'}</div>
            <div>{formValues.personalDetails.address || '123 Street, City, State'}</div>
          </div>
        </section>

        {/* Online Profiles */}
        {(formValues.contactInformation.linkedin || formValues.contactInformation.github || formValues.contactInformation.portfolio) && (
          <section className={`online-profiles ${templateStyles.sectionSpacing}`}>
            <h2 
              className={`text-sm font-bold mb-2 uppercase tracking-wide ${templateStyles.borderStyle} pb-1`}
              style={{ color: templateStyles.headerColor }}
            >
              Online Profiles
            </h2>
            <div className="space-y-1 text-xs">
              {formValues.contactInformation.linkedin && <div>LinkedIn: {formValues.contactInformation.linkedin}</div>}
              {formValues.contactInformation.github && <div>GitHub: {formValues.contactInformation.github}</div>}
              {formValues.contactInformation.portfolio && <div>Portfolio: {formValues.contactInformation.portfolio}</div>}
            </div>
          </section>
        )}

        {/* Skills */}
        {formValues.skills.length > 0 && (
          <section className={`skills-section ${templateStyles.sectionSpacing}`}>
            <h2 
              className={`text-sm font-bold mb-2 uppercase tracking-wide ${templateStyles.borderStyle} pb-1`}
              style={{ color: templateStyles.headerColor }}
            >
              Skills
            </h2>
            <div className="space-y-1">
              {formValues.skills.slice(0, 10).map((skill, index) => (
                <div key={index} className="text-xs">{skill}</div>
              ))}
            </div>
          </section>
        )}

        {/* Additional Information */}
        <section className={`additional-info ${templateStyles.sectionSpacing}`}>
          <h2 
            className={`text-sm font-bold mb-2 uppercase tracking-wide ${templateStyles.borderStyle} pb-1`}
            style={{ color: templateStyles.headerColor }}
          >
            Additional Info
          </h2>
          <div className="space-y-1 text-xs">
            <div>DOB: {formValues.personalDetails.dateOfBirth || 'Not specified'}</div>
            <div>Nationality: {formValues.personalDetails.nationality || 'Not specified'}</div>
            <div>Job Type: {formValues.workPreferences.jobType}</div>
            <div>Work Mode: {formValues.workPreferences.workMode}</div>
            <div>Industry: {formValues.workPreferences.industry || 'Not specified'}</div>
            <div>Salary: {formatSalary(formValues.workPreferences.salaryExpectation, formValues.workPreferences.salaryCurrency)}</div>
          </div>
        </section>
      </div>

      {/* Right Main Content */}
      <div className="col-span-2 space-y-4">
        {/* Header */}
        <header className={`resume-header ${templateStyles.borderStyle} pb-4 mb-4`}>
          <h1 
            className="text-2xl font-bold mb-2" 
            style={{ 
              color: templateStyles.headerColor,
              fontFamily: templateStyles.font
            }}
          >
            {formValues.fullName || 'Your Name'}
          </h1>
          <p 
            className="text-sm mb-3" 
            style={{ color: templateStyles.accentColor }}
          >
            {formValues.personalDetails.bio || 'Professional Title'}
          </p>
        </header>

        {/* Experience */}
        {formValues.experience.length > 0 && formValues.experience[0].jobTitle && (
          <section className={`experience-section ${templateStyles.sectionSpacing}`}>
            <h2 
              className={`text-lg font-bold mb-2 uppercase tracking-wide ${templateStyles.borderStyle} pb-1`}
              style={{ color: templateStyles.headerColor }}
            >
              Experience
            </h2>
            {formValues.experience.slice(0, 4).map((exp) => (
              <div key={exp.id} className="experience-item mb-3">
                <div className="flex justify-between items-start mb-1">
                  <h3 
                    className="font-bold text-sm" 
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
                <p className="text-xs leading-relaxed">{exp.description?.substring(0, 180)}...</p>
              </div>
            ))}
          </section>
        )}

        {/* Education */}
        {formValues.education.length > 0 && formValues.education[0].degree && (
          <section className={`education-section ${templateStyles.sectionSpacing}`}>
            <h2 
              className={`text-lg font-bold mb-2 uppercase tracking-wide ${templateStyles.borderStyle} pb-1`}
              style={{ color: templateStyles.headerColor }}
            >
              Education
            </h2>
            {formValues.education.slice(0, 3).map((edu) => (
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
                {edu.gpa && <p className="text-xs">GPA: {edu.gpa}</p>}
              </div>
            ))}
          </section>
        )}

        {/* Projects */}
        {formValues.projects.length > 0 && formValues.projects[0].title && (
          <section className={`projects-section ${templateStyles.sectionSpacing}`}>
            <h2 
              className={`text-lg font-bold mb-2 uppercase tracking-wide ${templateStyles.borderStyle} pb-1`}
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
                <p className="text-xs mb-1 leading-relaxed">{project.description?.substring(0, 120)}...</p>
                <p className="text-xs mb-1">
                  <span className="font-semibold">Technologies:</span> {project.technologies}
                </p>
                {project.link && (
                  <p className="text-xs">
                    <span className="font-semibold">Link:</span> {project.link}
                  </p>
                )}
              </div>
            ))}
          </section>
        )}

        {/* Certifications */}
        {formValues.certifications.length > 0 && formValues.certifications[0].name && (
          <section className={`certifications-section ${templateStyles.sectionSpacing}`}>
            <h2 
              className={`text-lg font-bold mb-2 uppercase tracking-wide ${templateStyles.borderStyle} pb-1`}
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
                {cert.link && (
                  <p className="text-xs">
                    <span className="font-semibold">Link:</span> {cert.link}
                  </p>
                )}
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  );

  const renderHybridLayout = () => (
    <div className="space-y-4">
      {/* Creative Header */}
      <header className={`resume-header ${templateStyles.borderStyle} pb-4 mb-4`}>
        <div className="grid grid-cols-4 gap-4 items-center">
          {formValues.profileImageUrl && (
            <div className="col-span-1">
              <img 
                src={formValues.profileImageUrl} 
                alt="Profile" 
                className="w-24 h-24 rounded-full object-cover border-2 shadow-md"
                style={{ borderColor: templateStyles.headerColor }}
              />
            </div>
          )}
          
          <div className={`${formValues.profileImageUrl ? 'col-span-3' : 'col-span-4'} text-center`}>
            <h1 
              className="text-3xl font-bold mb-2" 
              style={{ 
                color: templateStyles.headerColor,
                fontFamily: templateStyles.font
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
            <div className="flex justify-center space-x-4 text-xs">
              <span>{formValues.contactInformation.email || 'email@example.com'}</span>
              <span>{formValues.contactInformation.phone || '(123) 456-7890'}</span>
              <span>{formValues.personalDetails.address || '123 Street, City, State'}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Skills Highlight */}
      {formValues.skills.length > 0 && (
        <section className={`skills-highlight ${templateStyles.sectionSpacing} text-center`}>
          <h2 
            className={`text-lg font-bold mb-3 uppercase tracking-wide ${templateStyles.borderStyle} pb-1`}
            style={{ color: templateStyles.headerColor }}
          >
            Core Competencies
          </h2>
          <div className="flex flex-wrap justify-center gap-2">
            {formValues.skills.slice(0, 8).map((skill, index) => (
              <Badge 
                key={index} 
                className="skill-badge text-white text-xs py-1 px-3" 
                style={{ backgroundColor: templateStyles.accentColor }}
              >
                {skill}
              </Badge>
            ))}
          </div>
        </section>
      )}

      {/* Two Column Content */}
      <div className="grid grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-4">
          {/* Experience */}
          {formValues.experience.length > 0 && formValues.experience[0].jobTitle && (
            <section className={`experience-section ${templateStyles.sectionSpacing}`}>
              <h2 
                className={`text-lg font-bold mb-2 uppercase tracking-wide ${templateStyles.borderStyle} pb-1`}
                style={{ color: templateStyles.headerColor }}
              >
                Experience
              </h2>
              {formValues.experience.slice(0, 3).map((exp) => (
                <div key={exp.id} className="experience-item mb-3">
                  <div className="flex justify-between items-start mb-1">
                    <h3 
                      className="font-bold text-sm" 
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
                  <p className="text-xs leading-relaxed">{exp.description?.substring(0, 140)}...</p>
                </div>
              ))}
            </section>
          )}

          {/* Projects */}
          {formValues.projects.length > 0 && formValues.projects[0].title && (
            <section className={`projects-section ${templateStyles.sectionSpacing}`}>
              <h2 
                className={`text-lg font-bold mb-2 uppercase tracking-wide ${templateStyles.borderStyle} pb-1`}
                style={{ color: templateStyles.headerColor }}
              >
                Key Projects
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
                    <span className="font-semibold">Tech:</span> {project.technologies}
                  </p>
                </div>
              ))}
            </section>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Education */}
          {formValues.education.length > 0 && formValues.education[0].degree && (
            <section className={`education-section ${templateStyles.sectionSpacing}`}>
              <h2 
                className={`text-lg font-bold mb-2 uppercase tracking-wide ${templateStyles.borderStyle} pb-1`}
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
                  {edu.gpa && <p className="text-xs">GPA: {edu.gpa}</p>}
                </div>
              ))}
            </section>
          )}

          {/* Certifications */}
          {formValues.certifications.length > 0 && formValues.certifications[0].name && (
            <section className={`certifications-section ${templateStyles.sectionSpacing}`}>
              <h2 
                className={`text-lg font-bold mb-2 uppercase tracking-wide ${templateStyles.borderStyle} pb-1`}
                style={{ color: templateStyles.headerColor }}
              >
                Certifications
              </h2>
              {formValues.certifications.slice(0, 3).map((cert) => (
                <div key={cert.id} className="certification-item mb-2">
                  <h3 
                    className="font-bold text-sm mb-1" 
                    style={{ color: templateStyles.headerColor }}
                  >
                    {cert.name}
                  </h3>
                  <p className="text-xs mb-1">
                    <span className="font-semibold">Issuer:</span> {cert.issuer}
                  </p>
                  <p className="text-xs">
                    <span className="font-semibold">Date:</span> {getFormattedDate(cert.date)}
                  </p>
                </div>
              ))}
            </section>
          )}

          {/* Contact & Preferences */}
          <section className={`contact-preferences ${templateStyles.sectionSpacing}`}>
            <h2 
              className={`text-lg font-bold mb-2 uppercase tracking-wide ${templateStyles.borderStyle} pb-1`}
              style={{ color: templateStyles.headerColor }}
            >
              Preferences
            </h2>
            <div className="space-y-1 text-xs">
              <div><span className="font-semibold">Job Type:</span> {formValues.workPreferences.jobType}</div>
              <div><span className="font-semibold">Work Mode:</span> {formValues.workPreferences.workMode}</div>
              <div><span className="font-semibold">Industry:</span> {formValues.workPreferences.industry || 'Not specified'}</div>
              <div><span className="font-semibold">Salary:</span> {formatSalary(formValues.workPreferences.salaryExpectation, formValues.workPreferences.salaryCurrency)}</div>
            </div>
          </section>

          {/* Online Profiles */}
          {(formValues.contactInformation.linkedin || formValues.contactInformation.github || formValues.contactInformation.portfolio) && (
            <section className={`online-profiles ${templateStyles.sectionSpacing}`}>
              <h2 
                className={`text-lg font-bold mb-2 uppercase tracking-wide ${templateStyles.borderStyle} pb-1`}
                style={{ color: templateStyles.headerColor }}
              >
                Online Presence
              </h2>
              <div className="space-y-1 text-xs">
                {formValues.contactInformation.linkedin && <div>LinkedIn: {formValues.contactInformation.linkedin}</div>}
                {formValues.contactInformation.github && <div>GitHub: {formValues.contactInformation.github}</div>}
                {formValues.contactInformation.portfolio && <div>Portfolio: {formValues.contactInformation.portfolio}</div>}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );

  const renderResumeContent = () => {
    switch (templateStyles.layout) {
      case 'two-column':
        return renderTwoColumnLayout();
      case 'hybrid':
        return renderHybridLayout();
      default:
        return renderSingleColumnLayout();
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
                <Wand className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Wand className="h-4 w-4" />
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
        <div className="resume-container mx-auto mb-8 shadow-2xl rounded-lg overflow-hidden border border-gray-200 bg-white">
          <div 
            className={`resume-content ${getTemplateClass()}`} 
            id="resume-content" 
            style={{ 
              backgroundColor: '#FFFFFF',
              width: '210mm', // Exact A4 width
              minHeight: '297mm', // Exact A4 height
              maxHeight: '297mm', // Prevent overflow
              margin: '0 auto',
              padding: '20mm', // Standard A4 margins
              boxSizing: 'border-box',
              fontFamily: templateStyles.font,
              fontSize: '12px',
              lineHeight: '1.4',
              color: '#000000',
              overflow: 'hidden', // Prevent content overflow
              position: 'relative'
            }}
          >
            {renderResumeContent()}
          </div>
        </div>
        
        <DownloadOptions />
      </div>
    </section>
  );
};
