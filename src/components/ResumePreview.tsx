import { useResume } from '@/contexts/ResumeContext';
import { useTheme } from '@/contexts/ThemeContext'; // Import ThemeContext
import { getFormattedDate, formatSalary } from '@/lib/date-utils';
import { Badge } from '@/components/ui/badge';
import { Download, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Import our download options component at the top of the file
import { DownloadOptions } from '@/components/DownloadOptions';

export const ResumePreview = () => {
  const { formValues } = useResume();
  const { themes, currentTheme } = useTheme(); // Get theme from ThemeContext
  
  const handlePrint = () => {
    window.print();
  };
  
  const getThemeClass = () => {
    const theme = themes.find(t => t.id === currentTheme);
    return theme ? theme.className : 'default-theme';
  };
  
  return (
    <section id="resume-preview" className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">
          Resume Preview
        </h2>
        
        <div className={`resume-container ${getThemeClass()}`}>
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
        
        <div className="flex justify-center mt-6">
          <Button variant="outline" onClick={handlePrint} className="flex items-center gap-2">
            <Printer className="h-4 w-4" />
            Print Resume
          </Button>
        </div>
        
        <DownloadOptions />
      </div>
    </section>
  );
};
