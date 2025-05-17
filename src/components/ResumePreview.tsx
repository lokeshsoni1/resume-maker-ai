
import { useRef, useState } from 'react';
import { useResume } from '@/contexts/ResumeContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Copy,
  Edit,
  RefreshCw,
  ZoomIn,
  ZoomOut,
  Search,
  Sparkles,
  Share2,
  Download,
  Wand
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import html2canvas from 'html2canvas';
import { getFormattedDate } from '@/lib/date-utils';

export const ResumePreview = () => {
  const { formValues, incrementDownloadCount, selectedTemplate, setSelectedTemplate, generateAiTemplate } = useResume();
  const resumeRef = useRef<HTMLDivElement>(null);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isGeneratingTemplate, setIsGeneratingTemplate] = useState(false);
  
  const handleDownloadAsPng = async () => {
    if (!resumeRef.current) return;
    
    try {
      setIsDownloading(true);
      incrementDownloadCount();
      
      toast({
        title: "Generating Image",
        description: "Please wait while we prepare your high-quality resume image...",
      });

      // Store original styles and scroll position
      const originalStyles = {
        position: resumeRef.current.style.position,
        overflow: resumeRef.current.style.overflow,
        transform: resumeRef.current.style.transform,
        width: resumeRef.current.style.width,
        height: resumeRef.current.style.height
      };
      
      // Reset zoom for download and modify styles for full capture
      const originalZoom = zoomLevel;
      setZoomLevel(100);
      
      // Wait for re-render
      await new Promise(resolve => setTimeout(resolve, 150));
      
      // Temporarily modify styles for better capture
      resumeRef.current.style.position = 'relative';
      resumeRef.current.style.overflow = 'visible';
      resumeRef.current.style.transform = 'none';
      
      // Get actual dimensions
      const { width, height } = resumeRef.current.getBoundingClientRect();
      
      // Scroll to top
      window.scrollTo(0, 0);
      
      // Capture resume as canvas
      const canvas = await html2canvas(resumeRef.current, {
        scale: window.devicePixelRatio || 2, // Use device pixel ratio for better quality
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: Math.ceil(width),
        height: Math.ceil(height),
        scrollX: 0,
        scrollY: 0,
        windowWidth: document.documentElement.offsetWidth,
        windowHeight: document.documentElement.offsetHeight,
        onclone: (clonedDoc) => {
          // Make sure all content is visible in the clone
          const clonedResume = clonedDoc.getElementById(resumeRef.current?.id || '');
          if (clonedResume) {
            clonedResume.style.transform = 'none';
            clonedResume.style.position = 'relative';
            clonedResume.style.overflow = 'visible';
          }
        }
      });
      
      // Convert to PNG with high quality
      const imgData = canvas.toDataURL('image/png', 1.0);
      
      // Create download link
      const link = document.createElement('a');
      link.href = imgData;
      link.download = `${formValues.fullName.replace(/\s+/g, '-')}-Resume.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Reset zoom back and restore original styles
      setZoomLevel(originalZoom);
      if (resumeRef.current) {
        resumeRef.current.style.position = originalStyles.position as string;
        resumeRef.current.style.overflow = originalStyles.overflow as string;
        resumeRef.current.style.transform = originalStyles.transform as string;
        resumeRef.current.style.width = originalStyles.width as string;
        resumeRef.current.style.height = originalStyles.height as string;
      }
      
      toast({
        title: "Download Complete",
        description: "Your high-quality resume has been downloaded as a PNG image.",
      });
    } catch (error) {
      console.error('Error downloading as PNG:', error);
      toast({
        title: "Download Failed",
        description: "There was an error creating your resume image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };
  
  const handleCopyText = () => {
    if (resumeRef.current) {
      const text = resumeRef.current.innerText;
      navigator.clipboard.writeText(text)
        .then(() => {
          toast({
            title: "Copied to Clipboard",
            description: "Resume text has been copied to your clipboard.",
          });
        })
        .catch(() => {
          toast({
            title: "Copy Failed",
            description: "Could not copy resume text. Please try again.",
            variant: "destructive",
          });
        });
    }
  };
  
  const handleShare = () => {
    // Generate a shareable link (mock functionality)
    const dummyShareLink = `https://resumebuilder.app/share/${Math.random().toString(36).substring(2, 10)}`;
    
    // In a real app, this would save the resume to a database and get a real link
    navigator.clipboard.writeText(dummyShareLink)
      .then(() => {
        toast({
          title: "Share Link Generated",
          description: "Link copied to clipboard. Your resume will be accessible for 7 days.",
        });
      });
  };
  
  const handleZoomIn = () => {
    if (zoomLevel < 200) {
      setZoomLevel(zoomLevel + 10);
    }
  };
  
  const handleZoomOut = () => {
    if (zoomLevel > 50) {
      setZoomLevel(zoomLevel - 10);
    }
  };
  
  const handleResetZoom = () => {
    setZoomLevel(100);
  };

  const handleGenerateAiTemplate = async () => {
    try {
      setIsGeneratingTemplate(true);
      
      toast({
        title: "Generating Template",
        description: "AI is creating a unique template just for you...",
      });
      
      // Generate a new AI template
      const newTemplate = await generateAiTemplate();
      
      toast({
        title: "Template Created!",
        description: "Your AI-generated template is ready to view.",
      });
    } catch (error) {
      console.error('Error generating AI template:', error);
      toast({
        title: "Generation Failed",
        description: "We couldn't create a new template. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingTemplate(false);
    }
  };

  return (
    <div id="resume-preview" className="w-full max-w-5xl mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold text-center mb-8">
        Your Resume Preview
      </h2>
      
      <div className="flex flex-wrap gap-4 justify-center mb-6">
        <Button 
          variant="outline" 
          onClick={handleDownloadAsPng} 
          className="flex items-center transition-all duration-300 hover:shadow-[0_0_12px_rgba(139,92,246,0.5)] bg-gradient-to-r from-[#9b87f5] to-[#7E69AB] text-white border-none" 
          disabled={isDownloading}
          aria-label="Download resume as PNG image"
        >
          <Download className="h-4 w-4 mr-2" />
          {isDownloading ? "Generating..." : "Download as PNG"}
        </Button>
        
        <Button variant="outline" onClick={handleCopyText} className="flex items-center">
          <Copy className="h-4 w-4 mr-2" />
          Copy Text
        </Button>
        
        <Button variant="outline" onClick={handleShare} className="flex items-center">
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
        
        <div className="flex items-center border rounded-md">
          <Button variant="ghost" size="icon" onClick={handleZoomOut}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="px-2 text-sm">{zoomLevel}%</span>
          <Button variant="ghost" size="icon" onClick={handleZoomIn}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleResetZoom}>
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="preview">
        <TabsList className="w-full mb-6">
          <TabsTrigger value="preview" className="flex-1">Preview</TabsTrigger>
          <TabsTrigger value="critique" className="flex-1">AI Critique</TabsTrigger>
        </TabsList>
        
        <TabsContent value="preview">
          <Card 
            className="border shadow-lg max-w-4xl mx-auto overflow-hidden print:shadow-none"
            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
          >
            <div 
              id="resume-capture-container"
              ref={resumeRef}
              className={`resume-container bg-white text-black p-8 ${
                selectedTemplate.layout === 'two-column' 
                  ? 'grid grid-cols-3 gap-6' 
                  : selectedTemplate.layout === 'hybrid'
                  ? 'relative' 
                  : 'flex flex-col'
              }`}
              style={{ 
                fontFamily: selectedTemplate.id === 'creative' || selectedTemplate.id === 'tech' ? '"Montserrat", sans-serif' : '"Roboto", sans-serif',
                minHeight: '297mm', // A4 height
                width: '210mm', // A4 width
              }}
            >
              {selectedTemplate.layout === 'two-column' ? (
                <>
                  <div className="col-span-1 flex flex-col" style={{ backgroundColor: selectedTemplate.secondaryColor + '20' }}>
                    {formValues.profileImageUrl && (
                      <div className="mx-auto mb-4 overflow-hidden rounded-full w-32 h-32 border-4" style={{ borderColor: selectedTemplate.color }}>
                        <img 
                          src={formValues.profileImageUrl} 
                          alt={formValues.fullName} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    
                    <div className="p-4">
                      <div className="mb-6">
                        <h3 className="text-sm font-bold uppercase mb-2 pb-1 border-b-2" style={{ borderColor: selectedTemplate.color }}>
                          Contact Information
                        </h3>
                        <ul className="space-y-2 text-sm">
                          {formValues.contactInformation.email && (
                            <li>
                              <span className="font-semibold">Email:</span> {formValues.contactInformation.email}
                            </li>
                          )}
                          {formValues.contactInformation.phone && (
                            <li>
                              <span className="font-semibold">Phone:</span> {formValues.contactInformation.phone}
                            </li>
                          )}
                          {formValues.personalDetails.address && (
                            <li>
                              <span className="font-semibold">Location:</span> {formValues.personalDetails.address}
                            </li>
                          )}
                        </ul>
                      </div>
                      
                      {(formValues.contactInformation.linkedin || formValues.contactInformation.github) && (
                        <div className="mb-6">
                          <h3 className="text-sm font-bold uppercase mb-2 pb-1 border-b-2" style={{ borderColor: selectedTemplate.color }}>
                            Online Profiles
                          </h3>
                          <ul className="space-y-2 text-sm">
                            {formValues.contactInformation.linkedin && (
                              <li>
                                <span className="font-semibold">LinkedIn:</span> {formValues.contactInformation.linkedin}
                              </li>
                            )}
                            {formValues.contactInformation.github && (
                              <li>
                                <span className="font-semibold">GitHub:</span> {formValues.contactInformation.github}
                              </li>
                            )}
                          </ul>
                        </div>
                      )}
                      
                      {formValues.skills.length > 0 && (
                        <div className="mb-6">
                          <h3 className="text-sm font-bold uppercase mb-2 pb-1 border-b-2" style={{ borderColor: selectedTemplate.color }}>
                            Skills
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {formValues.skills.map((skill) => (
                              <span 
                                key={skill} 
                                className="inline-block text-xs py-1 px-2 rounded"
                                style={{ backgroundColor: selectedTemplate.color + '20' }}
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {formValues.certifications.length > 0 && formValues.certifications[0].name && (
                        <div className="mb-6">
                          <h3 className="text-sm font-bold uppercase mb-2 pb-1 border-b-2" style={{ borderColor: selectedTemplate.color }}>
                            Certifications
                          </h3>
                          <ul className="space-y-3 text-sm">
                            {formValues.certifications.map((cert) => (
                              cert.name && (
                                <li key={cert.id}>
                                  <div className="font-medium">{cert.name}</div>
                                  <div className="text-xs">{cert.issuer}</div>
                                  {cert.date && (
                                    <div className="text-xs">{getFormattedDate(cert.date)}</div>
                                  )}
                                </li>
                              )
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {formValues.personalDetails.nationality && (
                        <div>
                          <h3 className="text-sm font-bold uppercase mb-2 pb-1 border-b-2" style={{ borderColor: selectedTemplate.color }}>
                            Additional Info
                          </h3>
                          <ul className="space-y-2 text-sm">
                            {formValues.personalDetails.nationality && (
                              <li>
                                <span className="font-semibold">Nationality:</span> {formValues.personalDetails.nationality}
                              </li>
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="col-span-2 p-4">
                    <div className="mb-6">
                      <h1 className="text-2xl font-bold mb-1" style={{ color: selectedTemplate.color }}>
                        {formValues.fullName}
                      </h1>
                      {formValues.personalDetails.bio && (
                        <p className="text-sm mb-4">
                          {formValues.personalDetails.bio}
                        </p>
                      )}
                    </div>
                    
                    {formValues.experience.length > 0 && formValues.experience[0].jobTitle && (
                      <div className="mb-6 resume-section">
                        <h2 className="text-lg font-bold mb-3 pb-1 border-b-2" style={{ borderColor: selectedTemplate.color }}>
                          Professional Experience
                        </h2>
                        {formValues.experience.map((exp) => (
                          exp.jobTitle && (
                            <div key={exp.id} className="mb-4">
                              <div className="font-bold">{exp.jobTitle}</div>
                              <div className="flex justify-between items-center mb-1">
                                <div className="font-medium">{exp.company}{exp.location ? `, ${exp.location}` : ''}</div>
                                <div className="text-sm">
                                  {getFormattedDate(exp.startDate)} - {exp.current ? 'Present' : getFormattedDate(exp.endDate)}
                                </div>
                              </div>
                              <p className="text-sm whitespace-pre-line">{exp.description}</p>
                            </div>
                          )
                        ))}
                      </div>
                    )}
                    
                    {formValues.education.length > 0 && formValues.education[0].degree && (
                      <div className="mb-6 resume-section">
                        <h2 className="text-lg font-bold mb-3 pb-1 border-b-2" style={{ borderColor: selectedTemplate.color }}>
                          Education
                        </h2>
                        {formValues.education.map((edu) => (
                          edu.degree && (
                            <div key={edu.id} className="mb-4">
                              <div className="font-bold">{edu.degree}</div>
                              <div className="flex justify-between items-center mb-1">
                                <div className="font-medium">{edu.institution}{edu.location ? `, ${edu.location}` : ''}</div>
                                <div className="text-sm">
                                  {getFormattedDate(edu.startDate)} - {edu.current ? 'Present' : getFormattedDate(edu.endDate)}
                                </div>
                              </div>
                              {edu.gpa && <div className="text-sm">GPA: {edu.gpa}</div>}
                            </div>
                          )
                        ))}
                      </div>
                    )}
                    
                    {formValues.projects.length > 0 && formValues.projects[0].title && (
                      <div className="resume-section">
                        <h2 className="text-lg font-bold mb-3 pb-1 border-b-2" style={{ borderColor: selectedTemplate.color }}>
                          Projects
                        </h2>
                        {formValues.projects.map((project) => (
                          project.title && (
                            <div key={project.id} className="mb-4">
                              <div className="flex justify-between items-center">
                                <div className="font-bold">{project.title}</div>
                                {project.link && (
                                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-sm underline" style={{ color: selectedTemplate.color }}>
                                    View Project
                                  </a>
                                )}
                              </div>
                              {project.technologies && (
                                <div className="text-sm font-medium mb-1">{project.technologies}</div>
                              )}
                              <p className="text-sm whitespace-pre-line">{project.description}</p>
                            </div>
                          )
                        ))}
                      </div>
                    )}
                  </div>
                </>
              ) : selectedTemplate.layout === 'hybrid' ? (
                <>
                  <div style={{ backgroundColor: selectedTemplate.color }} className="p-6 text-white mb-6">
                    <div className="flex items-center">
                      {formValues.profileImageUrl && (
                        <div className="mr-4 w-24 h-24 rounded-full overflow-hidden border-2 border-white flex-shrink-0">
                          <img 
                            src={formValues.profileImageUrl} 
                            alt={formValues.fullName} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <h1 className="text-2xl font-bold">{formValues.fullName}</h1>
                        {formValues.experience.length > 0 && formValues.experience[0].jobTitle && (
                          <p className="font-medium mt-1 opacity-90">{formValues.experience[0].jobTitle}</p>
                        )}
                        {formValues.personalDetails.bio && (
                          <p className="text-sm mt-2 leading-relaxed">{formValues.personalDetails.bio}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-1">
                      <div className="mb-6 resume-section">
                        <h3 className="text-sm font-bold uppercase mb-3 pb-1 border-b" style={{ borderColor: selectedTemplate.color }}>
                          Contact Information
                        </h3>
                        <ul className="space-y-2 text-sm">
                          {formValues.contactInformation.email && (
                            <li className="flex items-center">
                              <div className="w-5 h-5 mr-2 rounded-full flex items-center justify-center" style={{ backgroundColor: selectedTemplate.color + '20' }}>
                                <span style={{ color: selectedTemplate.color }}>✉</span>
                              </div>
                              {formValues.contactInformation.email}
                            </li>
                          )}
                          {formValues.contactInformation.phone && (
                            <li className="flex items-center">
                              <div className="w-5 h-5 mr-2 rounded-full flex items-center justify-center" style={{ backgroundColor: selectedTemplate.color + '20' }}>
                                <span style={{ color: selectedTemplate.color }}>☏</span>
                              </div>
                              {formValues.contactInformation.phone}
                            </li>
                          )}
                          {formValues.personalDetails.address && (
                            <li className="flex items-center">
                              <div className="w-5 h-5 mr-2 rounded-full flex items-center justify-center" style={{ backgroundColor: selectedTemplate.color + '20' }}>
                                <span style={{ color: selectedTemplate.color }}>⌂</span>
                              </div>
                              {formValues.personalDetails.address}
                            </li>
                          )}
                        </ul>
                      </div>
                      
                      {(formValues.contactInformation.linkedin || formValues.contactInformation.github) && (
                        <div className="mb-6 resume-section">
                          <h3 className="text-sm font-bold uppercase mb-3 pb-1 border-b" style={{ borderColor: selectedTemplate.color }}>
                            Online Profiles
                          </h3>
                          <ul className="space-y-2 text-sm">
                            {formValues.contactInformation.linkedin && (
                              <li>LinkedIn: {formValues.contactInformation.linkedin}</li>
                            )}
                            {formValues.contactInformation.github && (
                              <li>GitHub: {formValues.contactInformation.github}</li>
                            )}
                          </ul>
                        </div>
                      )}
                      
                      {formValues.skills.length > 0 && (
                        <div className="mb-6 resume-section">
                          <h3 className="text-sm font-bold uppercase mb-3 pb-1 border-b" style={{ borderColor: selectedTemplate.color }}>
                            Skills
                          </h3>
                          <div className="flex flex-wrap gap-1">
                            {formValues.skills.map((skill) => (
                              <span 
                                key={skill} 
                                className="inline-block text-xs py-1 px-2 rounded-full"
                                style={{ backgroundColor: selectedTemplate.color + '15', color: selectedTemplate.color }}
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {formValues.certifications.length > 0 && formValues.certifications[0].name && (
                        <div className="resume-section">
                          <h3 className="text-sm font-bold uppercase mb-3 pb-1 border-b" style={{ borderColor: selectedTemplate.color }}>
                            Certifications
                          </h3>
                          <ul className="space-y-3 text-sm">
                            {formValues.certifications.map((cert) => (
                              cert.name && (
                                <li key={cert.id}>
                                  <div className="font-medium">{cert.name}</div>
                                  <div className="text-xs">{cert.issuer}</div>
                                  {cert.date && (
                                    <div className="text-xs">{getFormattedDate(cert.date)}</div>
                                  )}
                                </li>
                              )
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    
                    <div className="col-span-2">
                      {formValues.experience.length > 0 && formValues.experience[0].jobTitle && (
                        <div className="mb-6 resume-section">
                          <h2 className="text-lg font-bold mb-4 pb-1" style={{ color: selectedTemplate.color, borderBottom: `2px solid ${selectedTemplate.color}` }}>
                            Professional Experience
                          </h2>
                          {formValues.experience.map((exp) => (
                            exp.jobTitle && (
                              <div key={exp.id} className="mb-5">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <div className="font-bold">{exp.jobTitle}</div>
                                    <div className="text-sm font-medium">{exp.company}{exp.location ? `, ${exp.location}` : ''}</div>
                                  </div>
                                  <div className="text-xs px-2 py-1 rounded" style={{ backgroundColor: selectedTemplate.color + '15' }}>
                                    {getFormattedDate(exp.startDate)} - {exp.current ? 'Present' : getFormattedDate(exp.endDate)}
                                  </div>
                                </div>
                                <p className="text-sm mt-2 whitespace-pre-line">{exp.description}</p>
                              </div>
                            )
                          ))}
                        </div>
                      )}
                      
                      {formValues.education.length > 0 && formValues.education[0].degree && (
                        <div className="mb-6 resume-section">
                          <h2 className="text-lg font-bold mb-4 pb-1" style={{ color: selectedTemplate.color, borderBottom: `2px solid ${selectedTemplate.color}` }}>
                            Education
                          </h2>
                          {formValues.education.map((edu) => (
                            edu.degree && (
                              <div key={edu.id} className="mb-4">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <div className="font-bold">{edu.degree}</div>
                                    <div className="text-sm font-medium">{edu.institution}{edu.location ? `, ${edu.location}` : ''}</div>
                                  </div>
                                  <div className="text-xs px-2 py-1 rounded" style={{ backgroundColor: selectedTemplate.color + '15' }}>
                                    {getFormattedDate(edu.startDate)} - {edu.current ? 'Present' : getFormattedDate(edu.endDate)}
                                  </div>
                                </div>
                                {edu.gpa && <div className="text-sm mt-1">GPA: {edu.gpa}</div>}
                              </div>
                            )
                          ))}
                        </div>
                      )}
                      
                      {formValues.projects.length > 0 && formValues.projects[0].title && (
                        <div className="resume-section">
                          <h2 className="text-lg font-bold mb-4 pb-1" style={{ color: selectedTemplate.color, borderBottom: `2px solid ${selectedTemplate.color}` }}>
                            Projects
                          </h2>
                          {formValues.projects.map((project) => (
                            project.title && (
                              <div key={project.id} className="mb-4">
                                <div className="flex justify-between items-center">
                                  <div className="font-bold">{project.title}</div>
                                  {project.link && (
                                    <a 
                                      href={project.link} 
                                      target="_blank" 
                                      rel="noopener noreferrer" 
                                      className="text-sm underline" 
                                      style={{ color: selectedTemplate.color }}
                                    >
                                      View Project
                                    </a>
                                  )}
                                </div>
                                {project.technologies && (
                                  <div className="text-sm font-medium mt-1">{project.technologies}</div>
                                )}
                                <p className="text-sm mt-1 whitespace-pre-line">{project.description}</p>
                              </div>
                            )
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="mb-6 border-b-2 pb-4 text-center" style={{ borderColor: selectedTemplate.color }}>
                    <h1 className="text-3xl font-bold mb-2">{formValues.fullName}</h1>
                    
                    <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm">
                      {formValues.contactInformation.email && (
                        <div>{formValues.contactInformation.email}</div>
                      )}
                      {formValues.contactInformation.phone && (
                        <div>{formValues.contactInformation.phone}</div>
                      )}
                      {formValues.personalDetails.address && (
                        <div>{formValues.personalDetails.address}</div>
                      )}
                      {formValues.contactInformation.linkedin && (
                        <div>{formValues.contactInformation.linkedin}</div>
                      )}
                    </div>
                    
                    {formValues.personalDetails.bio && (
                      <p className="mt-4 text-sm max-w-2xl mx-auto">
                        {formValues.personalDetails.bio}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-6">
                    {formValues.skills.length > 0 && (
                      <div className="mb-6 resume-section">
                        <h2 className="text-lg font-bold mb-3" style={{ color: selectedTemplate.color }}>
                          Skills
                        </h2>
                        <div className="flex flex-wrap gap-2">
                          {formValues.skills.map((skill) => (
                            <span 
                              key={skill} 
                              className="inline-block text-sm py-1 px-3 rounded-lg border"
                              style={{ borderColor: selectedTemplate.color + '50' }}
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {formValues.experience.length > 0 && formValues.experience[0].jobTitle && (
                      <div className="mb-6 resume-section">
                        <h2 className="text-lg font-bold mb-3" style={{ color: selectedTemplate.color }}>
                          Professional Experience
                        </h2>
                        {formValues.experience.map((exp) => (
                          exp.jobTitle && (
                            <div key={exp.id} className="mb-5">
                              <div className="flex justify-between items-start flex-wrap">
                                <div className="mb-1">
                                  <div className="font-bold text-lg">{exp.jobTitle}</div>
                                  <div>{exp.company}{exp.location ? `, ${exp.location}` : ''}</div>
                                </div>
                                <div className="text-sm">
                                  {getFormattedDate(exp.startDate)} - {exp.current ? 'Present' : getFormattedDate(exp.endDate)}
                                </div>
                              </div>
                              <p className="text-sm mt-2 whitespace-pre-line">{exp.description}</p>
                            </div>
                          )
                        ))}
                      </div>
                    )}
                    
                    {formValues.education.length > 0 && formValues.education[0].degree && (
                      <div className="mb-6 resume-section">
                        <h2 className="text-lg font-bold mb-3" style={{ color: selectedTemplate.color }}>
                          Education
                        </h2>
                        {formValues.education.map((edu) => (
                          edu.degree && (
                            <div key={edu.id} className="mb-4">
                              <div className="flex justify-between items-start flex-wrap">
                                <div className="mb-1">
                                  <div className="font-bold">{edu.degree}</div>
                                  <div>{edu.institution}{edu.location ? `, ${edu.location}` : ''}</div>
                                </div>
                                <div className="text-sm">
                                  {getFormattedDate(edu.startDate)} - {edu.current ? 'Present' : getFormattedDate(edu.endDate)}
                                </div>
                              </div>
                              {edu.gpa && <div className="text-sm">{edu.gpa}</div>}
                            </div>
                          )
                        ))}
                      </div>
                    )}
                    
                    {formValues.projects.length > 0 && formValues.projects[0].title && (
                      <div className="mb-6 resume-section">
                        <h2 className="text-lg font-bold mb-3" style={{ color: selectedTemplate.color }}>
                          Projects
                        </h2>
                        {formValues.projects.map((project) => (
                          project.title && (
                            <div key={project.id} className="mb-4">
                              <div className="flex justify-between items-center flex-wrap">
                                <div className="font-bold">{project.title}</div>
                                {project.link && (
                                  <a 
                                    href={project.link} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="text-sm underline" 
                                    style={{ color: selectedTemplate.color }}
                                  >
                                    View Project
                                  </a>
                                )}
                              </div>
                              {project.technologies && (
                                <div className="text-sm italic">{project.technologies}</div>
                              )}
                              <p className="text-sm mt-1 whitespace-pre-line">{project.description}</p>
                            </div>
                          )
                        ))}
                      </div>
                    )}
                    
                    {formValues.certifications.length > 0 && formValues.certifications[0].name && (
                      <div className="resume-section">
                        <h2 className="text-lg font-bold mb-3" style={{ color: selectedTemplate.color }}>
                          Certifications
                        </h2>
                        {formValues.certifications.map((cert) => (
                          cert.name && (
                            <div key={cert.id} className="mb-3">
                              <div className="flex justify-between items-start flex-wrap">
                                <div className="mb-1">
                                  <div className="font-medium">{cert.name}</div>
                                  <div className="text-sm">{cert.issuer}</div>
                                </div>
                                {cert.date && (
                                  <div className="text-sm">{getFormattedDate(cert.date)}</div>
                                )}
                              </div>
                              {cert.link && (
                                <a 
                                  href={cert.link} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="text-xs underline" 
                                  style={{ color: selectedTemplate.color }}
                                >
                                  View Certificate
                                </a>
                              )}
                            </div>
                          )
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="critique">
          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">AI Resume Critique</h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Overall Strength</h4>
                    <div className="h-2 rounded bg-muted overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: '75%' }}></div>
                    </div>
                    <div className="flex justify-between text-xs mt-1">
                      <span>Needs Work</span>
                      <span>Excellent</span>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">ATS Compatibility</h4>
                    <div className="flex items-center gap-2">
                      <div className="text-lg font-bold">85%</div>
                      <Badge className="bg-green-500">Good</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Your resume is well-structured for most ATS systems.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Suggested Improvements</h4>
                    <ul className="list-disc list-inside space-y-2 text-sm">
                      <li>Add more quantifiable achievements to your experience section</li>
                      <li>Consider adding more industry-specific keywords to improve ATS matching</li>
                      <li>Your professional summary could be more focused on your career goals</li>
                      {formValues.skills.length < 5 && (
                        <li>Add more relevant skills to strengthen your profile</li>
                      )}
                    </ul>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-2">Keyword Analysis</h4>
                    <div className="flex flex-wrap gap-2">
                      {formValues.skills.map(skill => (
                        <Badge key={skill} variant="outline" className="bg-primary/5">
                          {skill}
                        </Badge>
                      ))}
                      <Badge variant="outline" className="bg-muted/30 text-muted-foreground border-dashed">
                        leadership
                      </Badge>
                      <Badge variant="outline" className="bg-muted/30 text-muted-foreground border-dashed">
                        analytics
                      </Badge>
                      <Badge variant="outline" className="bg-muted/30 text-muted-foreground border-dashed">
                        strategy
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="flex flex-col sm:flex-row justify-center gap-3 mt-8">
        <Button 
          variant="outline" 
          onClick={() => {
            document.getElementById('build')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="flex items-center"
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit Resume
        </Button>
        
        <Button 
          variant="outline"
          onClick={handleGenerateAiTemplate}
          className="flex items-center hover:bg-primary/10 hover:scale-105 transition-all duration-300"
          disabled={isGeneratingTemplate}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isGeneratingTemplate ? 'animate-spin' : ''}`} />
          {isGeneratingTemplate ? "Generating..." : "Try Different Template"}
        </Button>
      </div>
      
      <div className="mt-8 text-center">
        <Button
          onClick={handleGenerateAiTemplate}
          className="px-6 py-2 bg-gradient-to-r from-[#9b87f5] to-[#7E69AB] text-white hover:shadow-lg hover:scale-105 transition-all duration-300 hover:shadow-[0_0_12px_rgba(139,92,246,0.5)]"
          disabled={isGeneratingTemplate}
          aria-label="Generate a new unique resume template with AI"
        >
          <Wand className={`h-5 w-5 mr-2 ${isGeneratingTemplate ? 'animate-spin' : ''}`} />
          {isGeneratingTemplate ? "Generating..." : "Auto-Generate New Resume Template with AI"}
        </Button>
      </div>
    </div>
  );
};
