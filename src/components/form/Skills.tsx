
import { useState } from 'react';
import { useResume } from '@/contexts/ResumeContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { X, Plus, Sparkles, Brain } from 'lucide-react';
import { CommandDialog, CommandEmpty, CommandInput, CommandItem, CommandList } from '@/components/ui/command';

export const SkillsForm = () => {
  const { formValues, setFormValues, incrementAiSuggestions } = useResume();
  const [inputValue, setInputValue] = useState('');
  const [open, setOpen] = useState(false);
  
  // Skill suggestions based on industry
  const getSkillSuggestions = () => {
    const industry = formValues.workPreferences.industry.toLowerCase();
    
    const skillsByIndustry: Record<string, string[]> = {
      'tech': [
        'JavaScript', 'Python', 'React', 'Node.js', 'AWS', 'Docker', 'Kubernetes',
        'TypeScript', 'GraphQL', 'REST API', 'CI/CD', 'Git', 'DevOps',
        'Agile', 'Scrum', 'MongoDB', 'PostgreSQL', 'System Design'
      ],
      'software': [
        'JavaScript', 'Python', 'Java', 'C#', 'React', 'Angular', 'Vue.js',
        'Node.js', 'Express', 'Spring Boot', '.NET Core', 'REST API',
        'GraphQL', 'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes'
      ],
      'data': [
        'Python', 'R', 'SQL', 'Power BI', 'Tableau', 'Machine Learning',
        'Data Visualization', 'Statistical Analysis', 'Excel', 'Big Data',
        'ETL', 'Data Modeling', 'Pandas', 'NumPy', 'TensorFlow', 'PyTorch'
      ],
      'design': [
        'UI Design', 'UX Design', 'Adobe Creative Suite', 'Figma', 'Sketch',
        'Wireframing', 'Prototyping', 'User Research', 'Design Systems',
        'Typography', 'Responsive Design', 'Color Theory', 'Accessibility'
      ],
      'marketing': [
        'Digital Marketing', 'Content Marketing', 'SEO', 'SEM', 'Social Media Marketing',
        'Email Marketing', 'Google Analytics', 'Google Ads', 'Facebook Ads',
        'Content Strategy', 'Marketing Automation', 'CRM', 'Lead Generation'
      ],
      'finance': [
        'Financial Analysis', 'Financial Modeling', 'Excel', 'QuickBooks',
        'Budgeting', 'Forecasting', 'Risk Management', 'Investment Analysis',
        'Accounting', 'SAP', 'Bloomberg Terminal', 'Financial Reporting'
      ],
      'healthcare': [
        'Patient Care', 'Electronic Health Records (EHR)', 'HIPAA Compliance',
        'Clinical Documentation', 'Medical Terminology', 'CPR', 'Case Management',
        'Healthcare Informatics', 'Epic', 'Cerner', 'Patient Advocacy'
      ],
      'education': [
        'Curriculum Development', 'Instructional Design', 'Classroom Management',
        'Learning Management Systems (LMS)', 'Student Assessment', 'Google Classroom',
        'Distance Learning', 'Educational Technology', 'Differentiated Instruction'
      ],
      'business': [
        'Project Management', 'Team Leadership', 'Strategic Planning',
        'Business Analysis', 'Negotiation', 'Presentation Skills',
        'Microsoft Office', 'CRM', 'Customer Relationship Management',
        'Process Improvement', 'Six Sigma', 'Lean Management'
      ]
    };
    
    // Default skills if no industry match
    let suggestions = [
      'Communication', 'Problem Solving', 'Time Management', 'Teamwork',
      'Leadership', 'Organization', 'Critical Thinking', 'Microsoft Office',
      'Project Management', 'Customer Service', 'Adaptability'
    ];
    
    // Check for industry matches
    for (const key in skillsByIndustry) {
      if (industry.includes(key)) {
        suggestions = skillsByIndustry[key];
        break;
      }
    }
    
    // Filter out skills already in the resume
    return suggestions.filter(skill => !formValues.skills.includes(skill));
  };
  
  const handleAddSkill = () => {
    if (inputValue.trim() && !formValues.skills.includes(inputValue.trim())) {
      setFormValues({
        ...formValues,
        skills: [...formValues.skills, inputValue.trim()],
      });
      setInputValue('');
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };
  
  const handleRemoveSkill = (skill: string) => {
    setFormValues({
      ...formValues,
      skills: formValues.skills.filter(s => s !== skill),
    });
  };
  
  const handleAddSuggestion = (skill: string) => {
    if (!formValues.skills.includes(skill)) {
      setFormValues({
        ...formValues,
        skills: [...formValues.skills, skill],
      });
    }
    setOpen(false);
  };
  
  const generateAISuggestions = () => {
    incrementAiSuggestions();
    
    // Get suggestions based on industry
    const suggestions = getSkillSuggestions();
    
    // Randomly select 5 skills from suggestions
    const randomSkills = [...suggestions]
      .sort(() => 0.5 - Math.random())
      .slice(0, 5);
    
    // Add skills that aren't already in the form
    const newSkills = [...formValues.skills];
    randomSkills.forEach(skill => {
      if (!newSkills.includes(skill)) {
        newSkills.push(skill);
      }
    });
    
    setFormValues({
      ...formValues,
      skills: newSkills,
    });
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold mb-2">Skills</h2>
        <p className="text-muted-foreground mb-6">
          Add skills that are relevant to your target role. Be specific and prioritize technical skills.
        </p>
      </div>
      
      <Card className="p-5 mb-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2 min-h-20">
            {formValues.skills.length > 0 ? (
              formValues.skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="px-2 py-1 text-sm">
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="ml-2 text-foreground/70 hover:text-foreground"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))
            ) : (
              <p className="text-muted-foreground p-2">
                No skills added yet. Start typing to add some.
              </p>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <div className="md:col-span-2">
              <Label htmlFor="skill-input" className="sr-only">Add Skill</Label>
              <div className="relative">
                <Input
                  id="skill-input"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a skill and press Enter"
                  className="pr-24"
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={handleAddSkill}
                  className="absolute right-1 top-1 h-8"
                  disabled={!inputValue.trim()}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(true)}
                className="flex-1"
              >
                <Brain className="h-4 w-4 mr-2" />
                Suggestions
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={generateAISuggestions}
                className="flex-1"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                AI Skills
              </Button>
            </div>
          </div>
        </div>
      </Card>
      
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search skills..." />
        <CommandList>
          <CommandEmpty>No skills found.</CommandEmpty>
          {getSkillSuggestions().map((skill) => (
            <CommandItem
              key={skill}
              onSelect={() => handleAddSuggestion(skill)}
            >
              {skill}
            </CommandItem>
          ))}
        </CommandList>
      </CommandDialog>
      
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-4">Tips for Adding Skills:</h3>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>Include a mix of technical (hard) and interpersonal (soft) skills</li>
          <li>Be specific about technical skills (e.g., "React.js" instead of just "JavaScript")</li>
          <li>Add skills that are mentioned in job descriptions you're targeting</li>
          <li>Only include skills you're comfortable discussing in an interview</li>
          <li>For technical roles, prioritize programming languages, frameworks, and tools</li>
        </ul>
      </div>
    </div>
  );
};
