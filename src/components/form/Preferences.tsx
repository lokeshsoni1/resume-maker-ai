
import { useResume } from '@/contexts/ResumeContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CurrencySelect } from '@/components/CurrencySelect';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const PreferencesForm = () => {
  const { formValues, setFormValues } = useResume();
  
  const handleJobTypeChange = (value: string) => {
    setFormValues({
      ...formValues,
      workPreferences: {
        ...formValues.workPreferences,
        jobType: value
      }
    });
  };
  
  const handleWorkModeChange = (value: string) => {
    setFormValues({
      ...formValues,
      workPreferences: {
        ...formValues.workPreferences,
        workMode: value
      }
    });
  };
  
  const handleIndustryChange = (value: string) => {
    setFormValues({
      ...formValues,
      workPreferences: {
        ...formValues.workPreferences,
        industry: value
      }
    });
  };
  
  const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({
      ...formValues,
      workPreferences: {
        ...formValues.workPreferences,
        salaryExpectation: e.target.value
      }
    });
  };
  
  const handleCurrencyChange = (value: string) => {
    setFormValues({
      ...formValues,
      workPreferences: {
        ...formValues.workPreferences,
        salaryCurrency: value
      }
    });
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold mb-2">Work Preferences</h2>
        <p className="text-muted-foreground mb-6">
          Let employers know about your work preferences and expectations.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="jobType" className="block mb-2">
            Job Type
          </Label>
          <Select
            value={formValues.workPreferences.jobType}
            onValueChange={handleJobTypeChange}
          >
            <SelectTrigger id="jobType">
              <SelectValue placeholder="Select job type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full-time">Full-Time</SelectItem>
              <SelectItem value="part-time">Part-Time</SelectItem>
              <SelectItem value="contract">Contract</SelectItem>
              <SelectItem value="internship">Internship</SelectItem>
              <SelectItem value="freelance">Freelance</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="workMode" className="block mb-2">
            Work Mode
          </Label>
          <Select
            value={formValues.workPreferences.workMode}
            onValueChange={handleWorkModeChange}
          >
            <SelectTrigger id="workMode">
              <SelectValue placeholder="Select work mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="on-site">On-site</SelectItem>
              <SelectItem value="remote">Remote</SelectItem>
              <SelectItem value="hybrid">Hybrid</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="industry" className="block mb-2">
            Preferred Industry
          </Label>
          <Select
            value={formValues.workPreferences.industry}
            onValueChange={handleIndustryChange}
          >
            <SelectTrigger id="industry">
              <SelectValue placeholder="Select industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tech">Technology</SelectItem>
              <SelectItem value="finance">Finance</SelectItem>
              <SelectItem value="healthcare">Healthcare</SelectItem>
              <SelectItem value="education">Education</SelectItem>
              <SelectItem value="retail">Retail</SelectItem>
              <SelectItem value="manufacturing">Manufacturing</SelectItem>
              <SelectItem value="media">Media & Entertainment</SelectItem>
              <SelectItem value="hospitality">Hospitality & Tourism</SelectItem>
              <SelectItem value="consulting">Consulting</SelectItem>
              <SelectItem value="nonprofit">Nonprofit</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="salary" className="block mb-2">
              Salary Expectation
            </Label>
            <Input
              id="salary"
              type="text"
              placeholder="e.g. 50000"
              value={formValues.workPreferences.salaryExpectation}
              onChange={handleSalaryChange}
              className="w-full"
            />
          </div>
          
          <CurrencySelect
            label="Currency"
            value={formValues.workPreferences.salaryCurrency || "USD"}
            onChange={handleCurrencyChange}
            className="w-full"
          />
        </div>
      </div>
      
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-4">Work Preference Tips:</h3>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>Be honest about your salary expectations</li>
          <li>Consider the industry standards for your role and location</li>
          <li>Specify work mode preferences clearly (remote, on-site, hybrid)</li>
          <li>Include the type of job you're seeking (full-time, contract, etc.)</li>
          <li>Make sure your preferences align with your career goals</li>
        </ul>
      </div>
    </div>
  );
};
