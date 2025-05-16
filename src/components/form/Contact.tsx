
import { useResume } from '@/contexts/ResumeContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Mail, Phone, Linkedin, Github, Globe } from 'lucide-react';

export const ContactForm = () => {
  const { formValues, setFormValues } = useResume();
  
  const handleContactChange = (field: string, value: string) => {
    setFormValues({
      ...formValues,
      contactInformation: {
        ...formValues.contactInformation,
        [field]: value
      }
    });
  };
  
  // Simple email validation
  const isEmailValid = (email: string) => {
    if (!email) return true; // Allow empty for non-required
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };
  
  // Simple URL validation
  const isUrlValid = (url: string) => {
    if (!url) return true; // Allow empty for non-required
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold mb-2">Contact Information</h2>
        <p className="text-muted-foreground mb-6">
          Add your contact details so employers can reach you. At minimum, include your email address.
        </p>
      </div>
      
      <Card className="p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label 
              htmlFor="email" 
              className={`flex items-center mb-2 ${!isEmailValid(formValues.contactInformation.email) ? 'text-destructive' : ''}`}
            >
              <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
              Email Address <span className="text-destructive ml-1">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="e.g., yourname@example.com"
              value={formValues.contactInformation.email}
              onChange={(e) => handleContactChange('email', e.target.value)}
              className={!isEmailValid(formValues.contactInformation.email) ? 'border-destructive' : ''}
              required
            />
            {!isEmailValid(formValues.contactInformation.email) && formValues.contactInformation.email && (
              <p className="text-destructive text-sm mt-1">Please enter a valid email address</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="phone" className="flex items-center mb-2">
              <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
              Phone Number
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="e.g., +1 (234) 567-8901"
              value={formValues.contactInformation.phone}
              onChange={(e) => handleContactChange('phone', e.target.value)}
            />
          </div>
          
          <div>
            <Label 
              htmlFor="linkedin" 
              className={`flex items-center mb-2 ${
                formValues.contactInformation.linkedin && !isUrlValid(formValues.contactInformation.linkedin) ? 'text-destructive' : ''
              }`}
            >
              <Linkedin className="h-4 w-4 mr-2 text-muted-foreground" />
              LinkedIn URL
            </Label>
            <Input
              id="linkedin"
              placeholder="e.g., https://linkedin.com/in/yourname"
              value={formValues.contactInformation.linkedin}
              onChange={(e) => handleContactChange('linkedin', e.target.value)}
              className={
                formValues.contactInformation.linkedin && !isUrlValid(formValues.contactInformation.linkedin) 
                  ? 'border-destructive' 
                  : ''
              }
            />
            {formValues.contactInformation.linkedin && !isUrlValid(formValues.contactInformation.linkedin) && (
              <p className="text-destructive text-sm mt-1">Please enter a valid URL</p>
            )}
          </div>
          
          <div>
            <Label 
              htmlFor="github" 
              className={`flex items-center mb-2 ${
                formValues.contactInformation.github && !isUrlValid(formValues.contactInformation.github) ? 'text-destructive' : ''
              }`}
            >
              <Github className="h-4 w-4 mr-2 text-muted-foreground" />
              GitHub URL
            </Label>
            <Input
              id="github"
              placeholder="e.g., https://github.com/yourusername"
              value={formValues.contactInformation.github}
              onChange={(e) => handleContactChange('github', e.target.value)}
              className={
                formValues.contactInformation.github && !isUrlValid(formValues.contactInformation.github) 
                  ? 'border-destructive' 
                  : ''
              }
            />
            {formValues.contactInformation.github && !isUrlValid(formValues.contactInformation.github) && (
              <p className="text-destructive text-sm mt-1">Please enter a valid URL</p>
            )}
          </div>
          
          <div className="md:col-span-2">
            <Label 
              htmlFor="portfolio" 
              className={`flex items-center mb-2 ${
                formValues.contactInformation.portfolio && !isUrlValid(formValues.contactInformation.portfolio) ? 'text-destructive' : ''
              }`}
            >
              <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
              Portfolio Website
            </Label>
            <Input
              id="portfolio"
              placeholder="e.g., https://yourportfolio.com"
              value={formValues.contactInformation.portfolio}
              onChange={(e) => handleContactChange('portfolio', e.target.value)}
              className={
                formValues.contactInformation.portfolio && !isUrlValid(formValues.contactInformation.portfolio) 
                  ? 'border-destructive' 
                  : ''
              }
            />
            {formValues.contactInformation.portfolio && !isUrlValid(formValues.contactInformation.portfolio) && (
              <p className="text-destructive text-sm mt-1">Please enter a valid URL</p>
            )}
          </div>
        </div>
      </Card>
      
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-4">Contact Information Tips:</h3>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>Use a professional email address (preferably not your current work email)</li>
          <li>Make sure your LinkedIn profile is complete and up-to-date if you include it</li>
          <li>Only include your GitHub if it contains professional or educational projects</li>
          <li>Consider creating a simple portfolio website to showcase your work</li>
          <li>For privacy reasons, you may want to exclude your full address</li>
        </ul>
      </div>
    </div>
  );
};
