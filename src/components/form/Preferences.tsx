
import { useResume } from '@/contexts/ResumeContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CurrencySelect } from '@/components/CurrencySelect';
import { formatSalary } from '@/lib/date-utils';

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
          Let employers know your ideal work arrangement.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="job-type" className="mb-2 block">
            Job Type
          </Label>
          <Select 
            value={formValues.workPreferences.jobType} 
            onValueChange={handleJobTypeChange}
          >
            <SelectTrigger id="job-type">
              <SelectValue placeholder="Select job type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Full-time">Full-time</SelectItem>
              <SelectItem value="Part-time">Part-time</SelectItem>
              <SelectItem value="Contract">Contract</SelectItem>
              <SelectItem value="Internship">Internship</SelectItem>
              <SelectItem value="Freelance">Freelance</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="work-mode" className="mb-2 block">
            Work Mode
          </Label>
          <Select 
            value={formValues.workPreferences.workMode} 
            onValueChange={handleWorkModeChange}
          >
            <SelectTrigger id="work-mode">
              <SelectValue placeholder="Select work mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Remote">Remote</SelectItem>
              <SelectItem value="Hybrid">Hybrid</SelectItem>
              <SelectItem value="On-site">On-site</SelectItem>
              <SelectItem value="Flexible">Flexible</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="industry" className="mb-2 block">
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
              <SelectItem value="Tech">Technology</SelectItem>
              <SelectItem value="Finance">Finance</SelectItem>
              <SelectItem value="Healthcare">Healthcare</SelectItem>
              <SelectItem value="Education">Education</SelectItem>
              <SelectItem value="Marketing">Marketing</SelectItem>
              <SelectItem value="Design">Design</SelectItem>
              <SelectItem value="Engineering">Engineering</SelectItem>
              <SelectItem value="Retail">Retail</SelectItem>
              <SelectItem value="Hospitality">Hospitality</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="salary" className="mb-2 block">
            Salary Expectation
          </Label>
          <div className="flex gap-3">
            <div className="flex-grow">
              <Input
                id="salary"
                type="text"
                placeholder="e.g. 75000"
                value={formValues.workPreferences.salaryExpectation}
                onChange={handleSalaryChange}
              />
            </div>
            <CurrencySelect
              label=""
              className="w-24"
            />
          </div>
          {formValues.workPreferences.salaryExpectation && formValues.workPreferences.salaryCurrency && (
            <p className="text-muted-foreground mt-2">
              Formatted: {formatSalary(formValues.workPreferences.salaryExpectation, formValues.workPreferences.salaryCurrency)}
            </p>
          )}
        </div>
      </div>
      
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-4">Work Preferences Tips:</h3>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>Choose the job type that best suits your availability and career goals</li>
          <li>Be specific about your work mode preference to find compatible employers</li>
          <li>Include salary information if you're comfortable sharing it</li>
          <li>Consider adding ranges rather than specific numbers for flexibility</li>
        </ul>
      </div>
    </div>
  );
};
