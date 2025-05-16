
import { useResume } from '@/contexts/ResumeContext';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Briefcase, MapPin, Building, DollarSign } from 'lucide-react';

const industries = [
  "Technology",
  "Software Development",
  "Data Science",
  "Marketing",
  "Finance",
  "Healthcare",
  "Education",
  "Engineering",
  "Sales",
  "Customer Service",
  "Design",
  "Product Management",
  "Consulting",
  "Human Resources",
  "Legal",
  "Operations",
  "Research",
  "Administration",
  "Media",
  "Retail",
];

export const PreferencesForm = () => {
  const { formValues, setFormValues } = useResume();
  
  const handlePreferenceChange = (field: string, value: string) => {
    setFormValues({
      ...formValues,
      workPreferences: {
        ...formValues.workPreferences,
        [field]: value
      }
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold mb-2">Work Preferences</h2>
        <p className="text-muted-foreground mb-6">
          Indicate your job preferences to help tailor your resume. This information helps the AI generate a more targeted resume.
        </p>
      </div>
      
      <Card className="p-5 mb-6">
        <div className="space-y-6">
          <div>
            <Label className="flex items-center mb-4">
              <Briefcase className="h-4 w-4 mr-2 text-muted-foreground" />
              Job Type
            </Label>
            <RadioGroup
              value={formValues.workPreferences.jobType}
              onValueChange={(value) => handlePreferenceChange('jobType', value)}
              className="flex flex-col space-y-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="full-time" id="full-time" />
                <Label htmlFor="full-time" className="font-normal">Full-time</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="part-time" id="part-time" />
                <Label htmlFor="part-time" className="font-normal">Part-time</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="contract" id="contract" />
                <Label htmlFor="contract" className="font-normal">Contract / Freelance</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div>
            <Label className="flex items-center mb-4">
              <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
              Work Mode
            </Label>
            <RadioGroup
              value={formValues.workPreferences.workMode}
              onValueChange={(value) => handlePreferenceChange('workMode', value)}
              className="flex flex-col space-y-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="remote" id="remote" />
                <Label htmlFor="remote" className="font-normal">Remote</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="hybrid" id="hybrid" />
                <Label htmlFor="hybrid" className="font-normal">Hybrid</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="onsite" id="onsite" />
                <Label htmlFor="onsite" className="font-normal">Onsite</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div>
            <Label htmlFor="industry" className="flex items-center mb-2">
              <Building className="h-4 w-4 mr-2 text-muted-foreground" />
              Industry / Field
            </Label>
            <Select 
              value={formValues.workPreferences.industry}
              onValueChange={(value) => handlePreferenceChange('industry', value)}
            >
              <SelectTrigger id="industry">
                <SelectValue placeholder="Select an industry" />
              </SelectTrigger>
              <SelectContent>
                {industries.map((industry) => (
                  <SelectItem key={industry} value={industry.toLowerCase()}>
                    {industry}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="salary" className="flex items-center mb-2">
              <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
              Salary Expectation (Optional)
            </Label>
            <Input
              id="salary"
              placeholder="e.g., $80,000 - $100,000 per year"
              value={formValues.workPreferences.salaryExpectation}
              onChange={(e) => handlePreferenceChange('salaryExpectation', e.target.value)}
            />
            <p className="text-xs text-muted-foreground mt-1">
              This is for resume customization and won't appear on your resume unless specified
            </p>
          </div>
        </div>
      </Card>
      
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-4">Why Work Preferences Matter:</h3>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>Helps our AI tailor your resume to specific job types and industries</li>
          <li>Enables optimized keyword selection for Applicant Tracking Systems (ATS)</li>
          <li>Informs appropriate design choices for your professional field</li>
          <li>Customizes language and emphasis to match industry expectations</li>
        </ul>
      </div>
    </div>
  );
};
