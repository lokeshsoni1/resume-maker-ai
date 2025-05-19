
import { useResume } from '@/contexts/ResumeContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';

export const ContactForm = () => {
  const { formValues, setFormValues } = useResume();
  
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({
      ...formValues,
      contactInformation: {
        ...formValues.contactInformation,
        email: e.target.value
      }
    });
  };
  
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({
      ...formValues,
      contactInformation: {
        ...formValues.contactInformation,
        phone: e.target.value
      }
    });
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
    return emailRegex.test(email);
  };

  const handleBlur = () => {
    if (formValues.contactInformation.email && !validateEmail(formValues.contactInformation.email)) {
      toast({
        title: "Invalid Email Format",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold mb-2">Contact Information</h2>
        <p className="text-muted-foreground mb-6">
          Add your contact details so employers can reach out to you.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="email" className="block mb-2">
            Email Address <span className="text-destructive">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            value={formValues.contactInformation.email}
            onChange={handleEmailChange}
            onBlur={handleBlur}
            placeholder="youremail@example.com"
            required
            aria-label="Enter your contact email"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Enter a valid email address. This will be shown on your resume.
          </p>
        </div>
        
        <div>
          <Label htmlFor="phone" className="block mb-2">
            Phone Number
          </Label>
          <Input
            id="phone"
            type="tel"
            value={formValues.contactInformation.phone}
            onChange={handlePhoneChange}
            placeholder="e.g. +1 234 567 8900"
          />
        </div>
      </div>
      
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-4">Contact Information Tips:</h3>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>Use a professional email address</li>
          <li>Include your country code with phone numbers</li>
          <li>Make sure your contact information is up to date</li>
          <li>Consider privacy - this information will be on your resume</li>
        </ul>
      </div>
    </div>
  );
};
