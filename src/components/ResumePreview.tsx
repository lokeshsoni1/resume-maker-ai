import { useResume } from '@/contexts/ResumeContext';
import { useTheme } from '@/contexts/ThemeContext'; 
import { getFormattedDate, formatSalary } from '@/lib/date-utils';
import { Badge } from '@/components/ui/badge';
import { Download, Wand } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import html2canvas from 'html2canvas';
import { ResumeTemplate } from '@/types';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';

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

  // Template styling configurations for dynamic template application
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

    // For AI-generated templates, use their custom properties
    if (selectedTemplate.id.startsWith('ai-generated')) {
      return {
        headerColor: selectedTemplate.headerColor || selectedTemplate.color || '#1a202c',
        accentColor: selectedTemplate.accentColor || selectedTemplate.secondaryColor || '#4a5568',
        font: selectedTemplate.font || 'Roboto, sans-serif',
        layout: selectedTemplate.layout || 'single-column',
        borderStyle: selectedTemplate.borderStyle || 'border-b-2 border-gray-300',
        sectionSpacing: selectedTemplate.sectionSpacing || 'mb-6',
        headerLayout: selectedTemplate.headerLayout || 'flex-row',
        profilePosition: selectedTemplate.profilePosition || 'left'
      };
    }

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
      
      // Enhanced AI template generation with high-contrast, professional colors
      const headerColors = [
        '#1a202c', '#2d3748', '#1a5276', '#2b6cb0', '#4a5568',
        '#9b2c2c', '#2c5530', '#553c9a', '#744210', '#1a365d', 
        '#2d1b69', '#c53030', '#38a169', '#805ad5', '#d69e2e'
      ];
      
      const accentColors = [
        '#4a5568', '#718096', '#fc8181', '#4a4a4a', '#90cdf4', 
        '#5dade2', '#feb2b2', '#68d391', '#b794f6', '#f6ad55', 
        '#63b3ed', '#a78bfa', '#fbb6ce', '#9ae6b4', '#fbd38d'
      ];
      
      const fonts = [
        'Inter, sans-serif', 'Georgia, serif', 'Montserrat, sans-serif',
        'Arial, sans-serif', 'Times New Roman, serif', 'Roboto, sans-serif',
        'Helvetica, sans-serif', 'Palatino, serif', 'Verdana, sans-serif',
        'Garamond, serif', 'Open Sans, sans-serif', 'Lato, sans-serif'
      ];
      
      const layouts: ('single-column' | 'two-column' | 'hybrid')[] = [
        'single-column', 'two-column', 'hybrid'
      ];
      
      const borderStyles = [
        'border-b-2', 'border-l-4 border-l-blue-600', 'border-t-4 border-t-orange-500',
        'border-none', 'border-b-2 border-b-blue-800', 'border-l-2 border-l-cyan-600',
        'border-r-3 border-r-red-500', 'border-t-2 border-t-green-600',
        'border-2 border-gray-300', 'border-b-4 border-b-purple-600'
      ];
      
      const headerLayouts = ['flex-row', 'flex-col', 'grid'];
      const profilePositions = ['left', 'center', 'right'];
      
      // Create truly unique combinations using random selections
      const timestamp = Date.now();
      const randomSeed = Math.floor(Math.random() * 1000000);
      
      // Generate truly random indices
      const headerColorIndex = Math.floor(Math.random() * headerColors.length);
      const accentColorIndex = Math.floor(Math.random() * accentColors.length);
      const fontIndex = Math.floor(Math.random() * fonts.length);
      const layoutIndex = Math.floor(Math.random() * layouts.length);
      const borderIndex = Math.floor(Math.random() * borderStyles.length);
      const headerLayoutIndex = Math.floor(Math.random() * headerLayouts.length);
      const profilePositionIndex = Math.floor(Math.random() * profilePositions.length);
      
      const newTemplate: ResumeTemplate = {
        id: `ai-generated-${timestamp}-${randomSeed}`,
        name: `AI Template ${Math.floor(Math.random() * 9999) + 1}`,
        color: headerColors[headerColorIndex],
        headerColor: headerColors[headerColorIndex],
        accentColor: accentColors[accentColorIndex],
        layout: layouts[layoutIndex],
        font: fonts[fontIndex],
        borderStyle: borderStyles[borderIndex],
        headerLayout: headerLayouts[headerLayoutIndex],
        profilePosition: profilePositions[profilePositionIndex],
        sectionSpacing: `mb-${Math.floor(Math.random() * 4) + 4}`,
        className: `ai-template-${timestamp}-${randomSeed}`,
        isAiGenerated: true
      };
      
      // Apply the new template immediately
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

  // Enhanced DOCX download with proper formatting
  const handleDownloadAsDocx = async () => {
    try {
      const templateStyles = getTemplateStyles();
      
      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            // Header
            new Paragraph({
              children: [
                new TextRun({
                  text: formValues.fullName || 'Your Name',
                  bold: true,
                  size: 32,
                  font: templateStyles.font.split(',')[0]
                })
              ],
              heading: HeadingLevel.HEADING_1,
              alignment: AlignmentType.CENTER
            }),
            
            new Paragraph({
              children: [
                new TextRun({
                  text: formValues.personalDetails.bio || 'Professional Title',
                  size: 24,
                  font: templateStyles.font.split(',')[0]
                })
              ],
              alignment: AlignmentType.CENTER
            }),
            
            // Contact Information
            new Paragraph({
              children: [
                new TextRun({
                  text: `Email: ${formValues.contactInformation.email || 'email@example.com'} | Phone: ${formValues.contactInformation.phone || '(123) 456-7890'}`,
                  size: 20,
                  font: templateStyles.font.split(',')[0]
                })
              ],
              alignment: AlignmentType.CENTER
            }),
            
            new Paragraph({
              children: [
                new TextRun({
                  text: `Address: ${formValues.personalDetails.address || '123 Street, City, State'}`,
                  size: 20,
                  font: templateStyles.font.split(',')[0]
                })
              ],
              alignment: AlignmentType.CENTER
            }),
            
            // Skills Section
            ...(formValues.skills.length > 0 ? [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "SKILLS",
                    bold: true,
                    size: 24,
                    font: templateStyles.font.split(',')[0]
                  })
                ],
                heading: HeadingLevel.HEADING_2
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: formValues.skills.join(', '),
                    size: 20,
                    font: templateStyles.font.split(',')[0]
                  })
                ]
              })
            ] : []),
            
            // Experience Section
            ...(formValues.experience.length > 0 && formValues.experience[0].jobTitle ? [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "PROFESSIONAL EXPERIENCE",
                    bold: true,
                    size: 24,
                    font: templateStyles.font.split(',')[0]
                  })
                ],
                heading: HeadingLevel.HEADING_2
              }),
              ...formValues.experience.slice(0, 4).flatMap((exp) => [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `${exp.jobTitle} at ${exp.company}`,
                      bold: true,
                      size: 22,
                      font: templateStyles.font.split(',')[0]
                    })
                  ]
                }),
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `${getFormattedDate(exp.startDate)} - ${exp.current ? 'Present' : getFormattedDate(exp.endDate)} | ${exp.location}`,
                      size: 20,
                      font: templateStyles.font.split(',')[0]
                    })
                  ]
                }),
                new Paragraph({
                  children: [
                    new TextRun({
                      text: exp.description || '',
                      size: 20,
                      font: templateStyles.font.split(',')[0]
                    })
                  ]
                })
              ])
            ] : []),
            
            // Education Section
            ...(formValues.education.length > 0 && formValues.education[0].degree ? [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "EDUCATION",
                    bold: true,
                    size: 24,
                    font: templateStyles.font.split(',')[0]
                  })
                ],
                heading: HeadingLevel.HEADING_2
              }),
              ...formValues.education.slice(0, 3).flatMap((edu) => [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `${edu.degree} - ${edu.institution}`,
                      bold: true,
                      size: 22,
                      font: templateStyles.font.split(',')[0]
                    })
                  ]
                }),
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `${getFormattedDate(edu.startDate)} - ${edu.current ? 'Present' : getFormattedDate(edu.endDate)} | ${edu.location}`,
                      size: 20,
                      font: templateStyles.font.split(',')[0]
                    })
                  ]
                }),
                ...(edu.gpa ? [new Paragraph({
                  children: [
                    new TextRun({
                      text: `GPA: ${edu.gpa}`,
                      size: 20,
                      font: templateStyles.font.split(',')[0]
                    })
                  ]
                })] : [])
              ])
            ] : []),
            
            // Projects Section
            ...(formValues.projects.length > 0 && formValues.projects[0].title ? [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "PROJECTS",
                    bold: true,
                    size: 24,
                    font: templateStyles.font.split(',')[0]
                  })
                ],
                heading: HeadingLevel.HEADING_2
              }),
              ...formValues.projects.slice(0, 3).flatMap((project) => [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: project.title,
                      bold: true,
                      size: 22,
                      font: templateStyles.font.split(',')[0]
                    })
                  ]
                }),
                new Paragraph({
                  children: [
                    new TextRun({
                      text: project.description || '',
                      size: 20,
                      font: templateStyles.font.split(',')[0]
                    })
                  ]
                }),
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `Technologies: ${project.technologies}`,
                      size: 20,
                      font: templateStyles.font.split(',')[0]
                    })
                  ]
                }),
                ...(project.link ? [new Paragraph({
                  children: [
                    new TextRun({
                      text: `Link: ${project.link}`,
                      size: 20,
                      font: templateStyles.font.split(',')[0]
                    })
                  ]
                })] : [])
              ])
            ] : []),
            
            // Certifications Section
            ...(formValues.certifications.length > 0 && formValues.certifications[0].name ? [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "CERTIFICATIONS",
                    bold: true,
                    size: 24,
                    font: templateStyles.font.split(',')[0]
                  })
                ],
                heading: HeadingLevel.HEADING_2
              }),
              ...formValues.certifications.slice(0, 3).flatMap((cert) => [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: cert.name,
                      bold: true,
                      size: 22,
                      font: templateStyles.font.split(',')[0]
                    })
                  ]
                }),
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `Issuer: ${cert.issuer}`,
                      size: 20,
                      font: templateStyles.font.split(',')[0]
                    })
                  ]
                }),
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `Date: ${getFormattedDate(cert.date)}`,
                      size: 20,
                      font: templateStyles.font.split(',')[0]
                    })
                  ]
                }),
                ...(cert.link ? [new Paragraph({
                  children: [
                    new TextRun({
                      text: `Link: ${cert.link}`,
                      size: 20,
                      font: templateStyles.font.split(',')[0]
                    })
                  ]
                })] : [])
              ])
            ] : []),
            
            // Additional Information
            new Paragraph({
              children: [
                new TextRun({
                  text: "ADDITIONAL INFORMATION",
                  bold: true,
                  size: 24,
                  font: templateStyles.font.split(',')[0]
                })
              ],
              heading: HeadingLevel.HEADING_2
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Date of Birth: ${formValues.personalDetails.dateOfBirth || 'Not specified'}`,
                  size: 20,
                  font: templateStyles.font.split(',')[0]
                })
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Nationality: ${formValues.personalDetails.nationality || 'Not specified'}`,
                  size: 20,
                  font: templateStyles.font.split(',')[0]
                })
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Job Type: ${formValues.workPreferences.jobType}`,
                  size: 20,
                  font: templateStyles.font.split(',')[0]
                })
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Work Mode: ${formValues.workPreferences.workMode}`,
                  size: 20,
                  font: templateStyles.font.split(',')[0]
                })
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Industry: ${formValues.workPreferences.industry || 'Not specified'}`,
                  size: 20,
                  font: templateStyles.font.split(',')[0]
                })
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Salary: ${formatSalary(formValues.workPreferences.salaryExpectation, formValues.workPreferences.salaryCurrency)}`,
                  size: 20,
                  font: templateStyles.font.split(',')[0]
                })
              ]
            }),
          ]
        }]
      });
      
      const blob = await Packer.toBlob(doc);
      const fileName = formValues.fullName 
        ? `${formValues.fullName.replace(/\s+/g, '-')}-Resume.docx` 
        : `Resume-${new Date().toISOString().split('T')[0]}.docx`;
      
      saveAs(blob, fileName);
      
      toast({
        title: "Download Complete",
        description: "Your resume has been downloaded as an editable Word document.",
      });
      
    } catch (error) {
      console.error('Error downloading DOCX:', error);
      toast({
        title: "Download Failed",
        description: "We couldn't generate your Word file. Please try again.",
        variant: "destructive",
      });
    }
  };

  const templateStyles = getTemplateStyles();
  
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
                style={{ borderColor: templateStyles.accentColor }}
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
            <div className="contact-info grid grid-cols-1 md:grid-cols-2 gap-1 text-xs" style={{ color: templateStyles.headerColor }}>
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
                style={{ borderColor: templateStyles.accentColor }}
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
          <div className="grid grid-cols-1 gap-1 text-xs" style={{ color: templateStyles.headerColor }}>
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

      {/* Skills Section with improved alignment */}
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
                className="skill-badge text-xs px-2 py-1 inline-flex items-center justify-center" 
                style={{ 
                  backgroundColor: templateStyles.accentColor + '20', 
                  color: templateStyles.accentColor,
                  border: `1px solid ${templateStyles.accentColor}40`
                }}
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
            <div key={exp.id} className="experience-item mb-3" style={{ color: templateStyles.headerColor }}>
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
            <div key={edu.id} className="education-item mb-3" style={{ color: templateStyles.headerColor }}>
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
              <p className="font-semibold text-sm mb-1" style={{ color: templateStyles.accentColor }}>
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
            <div key={project.id} className="project-item mb-3" style={{ color: templateStyles.headerColor }}>
              <h3 className="font-bold text-sm mb-1" style={{ color: templateStyles.headerColor }}>
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
          <h2 className={`text-lg font-bold mb-2 uppercase tracking-wide ${templateStyles.borderStyle} pb-1`} style={{ color: templateStyles.headerColor }}>
            Certifications
          </h2>
          {formValues.certifications.slice(0, 3).map((cert) => (
            <div key={cert.id} className="certification-item mb-3" style={{ color: templateStyles.headerColor }}>
              <h3 className="font-bold text-sm mb-1" style={{ color: templateStyles.headerColor }}>
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
        <h2 className={`text-lg font-bold mb-2 uppercase tracking-wide ${templateStyles.borderStyle} pb-1`} style={{ color: templateStyles.headerColor }}>
          Additional Information
        </h2>
        <div className="grid grid-cols-2 gap-2" style={{ color: templateStyles.headerColor }}>
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
      <div className="col-span-1 space-y-4" style={{ color: templateStyles.headerColor }}>
        {/* Profile Image */}
        {formValues.profileImageUrl && (
          <div className="profile-section text-center">
            <img 
              src={formValues.profileImageUrl} 
              alt="Profile" 
              className="w-24 h-24 rounded-full object-cover border-2 shadow-md mx-auto mb-2"
              style={{ borderColor: templateStyles.accentColor }}
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
                <div key={index} className="text-xs" style={{ color: templateStyles.accentColor }}>{skill}</div>
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
      <div className="col-span-2 space-y-4" style={{ color: templateStyles.headerColor }}>
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
                <p className="font-semibold text-sm mb-1" style={{ color: templateStyles.accentColor }}>
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
    <div className="space-y-4" style={{ color: templateStyles.headerColor }}>
      {/* Creative Header */}
      <header className={`resume-header ${templateStyles.borderStyle} pb-4 mb-4`}>
        <div className="grid grid-cols-4 gap-4 items-center">
          {formValues.profileImageUrl && (
            <div className="col-span-1">
              <img 
                src={formValues.profileImageUrl} 
                alt="Profile" 
                className="w-24 h-24 rounded-full object-cover border-2 shadow-md"
                style={{ borderColor: templateStyles.accentColor }}
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
            <div className="flex justify-center space-x-4 text-xs" style={{ color: templateStyles.headerColor }}>
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
                className="skill-badge text-white text-xs py-1 px-3 inline-flex items-center justify-center" 
                style={{ backgroundColor: templateStyles.accentColor + '20', color: templateStyles.accentColor, border: `1px solid ${templateStyles.accentColor}40` }}
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
        <div className="space-y-4" style={{ color: templateStyles.headerColor }}>
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
                  <p className="font-semibold text-sm mb-1" style={{ color: templateStyles.accentColor }}>
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
        <div className="space-y-4" style={{ color: templateStyles.headerColor }}>
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
                  <p className="font-semibold text-sm mb-1" style={{ color: templateStyles.accentColor }}>
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
            <div className="space-y-1 text-xs" style={{ color: templateStyles.headerColor }}>
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
              <div className="space-y-1 text-xs" style={{ color: templateStyles.headerColor }}>
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
        
        {/* Fixed A4 Resume Preview Container with proper padding */}
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
              padding: '16mm', // Added consistent padding for proper spacing
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
        
        {/* Enhanced Download Options */}
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <Button
            variant="outline"
            onClick={async () => {
              try {
                const resumeContent = document.getElementById('resume-content');
                if (!resumeContent) return;

                const canvas = await html2canvas(resumeContent, {
                  scale: 2,
                  useCORS: true,
                  allowTaint: true,
                  width: 794, // A4 width at 96 DPI
                  height: 1123, // A4 height at 96 DPI
                  backgroundColor: '#FFFFFF',
                });
                
                const imgData = canvas.toDataURL('image/png', 1.0);
                const link = document.createElement('a');
                const fileName = formValues.fullName 
                  ? `${formValues.fullName.replace(/\s+/g, '-')}-Resume.png` 
                  : `Resume-${new Date().toISOString().split('T')[0]}.png`;
                
                link.href = imgData;
                link.download = fileName;
                link.click();
                
                toast({
                  title: "Download Complete",
                  description: "Your resume has been downloaded as a PNG file.",
                });
              } catch (error) {
                console.error('Error downloading PNG:', error);
                toast({
                  title: "Download Failed",
                  description: "We couldn't generate your PNG file. Please try again.",
                  variant: "destructive",
                });
              }
            }}
            className="flex items-center gap-2 hover-scale glow"
          >
            <Download className="h-4 w-4" />
            Download as PNG
          </Button>
          
          <Button
            variant="outline"
            onClick={async () => {
              try {
                const resumeContent = document.getElementById('resume-content');
                if (!resumeContent) {
                  throw new Error('Resume content not found');
                }
                
                const canvas = await html2canvas(resumeContent, {
                  scale: 2,
                  useCORS: true,
                  allowTaint: true,
                  backgroundColor: '#FFFFFF',
                });
                
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF({
                  orientation: 'portrait',
                  unit: 'px',
                  format: [794, 1123] // A4 dimensions
                });
                
                pdf.addImage(imgData, 'PNG', 0, 0, 794, 1123);
                
                const fileName = formValues.fullName 
                  ? `${formValues.fullName.replace(/\s+/g, '-')}-Resume.pdf` 
                  : `Resume-${new Date().toISOString().split('T')[0]}.pdf`;
                
                pdf.save(fileName);
                
                toast({
                  title: "Download Complete",
                  description: "Your resume has been downloaded as a PDF file.",
                });
                
              } catch (error) {
                console.error('Error downloading PDF:', error);
                toast({
                  title: "Download Failed",
                  description: "We couldn't generate your PDF file. Please try again.",
                  variant: "destructive",
                });
              }
            }}
            className="flex items-center gap-2 hover-scale glow"
          >
            <Download className="h-4 w-4" />
            Download as PDF
          </Button>
          
          <Button
            variant="outline"
            onClick={handleDownloadAsDocx}
            className="flex items-center gap-2 hover-scale glow"
          >
            <Download className="h-4 w-4" />
            Download as Word
          </Button>
        </div>
      </div>
    </section>
  );
};
