
import { useResume } from '@/contexts/ResumeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ExperienceItem } from '@/types';
import { Plus, Trash2, Briefcase, Building, MapPin, Calendar, Sparkles } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from '@/components/ui/use-toast';

export const ExperienceForm = () => {
  const { formValues, setFormValues, incrementAiSuggestions } = useResume();
  
  const handleAddExperience = () => {
    setFormValues({
      ...formValues,
      experience: [
        ...formValues.experience,
        {
          id: uuidv4(),
          jobTitle: '',
          company: '',
          location: '',
          startDate: '',
          endDate: '',
          current: false,
          description: '',
        },
      ],
    });
  };
  
  const handleRemoveExperience = (id: string) => {
    if (formValues.experience.length === 1) {
      toast({
        title: "Cannot Remove",
        description: "You need at least one experience entry.",
        variant: "destructive"
      });
      return;
    }
    
    setFormValues({
      ...formValues,
      experience: formValues.experience.filter(exp => exp.id !== id),
    });
  };
  
  const handleExperienceChange = (id: string, field: keyof ExperienceItem, value: string | boolean) => {
    setFormValues({
      ...formValues,
      experience: formValues.experience.map(exp => {
        if (exp.id === id) {
          return { ...exp, [field]: value };
        }
        return exp;
      }),
    });
  };
  
  const generateDescriptionSuggestion = (id: string, jobTitle: string) => {
    incrementAiSuggestions();
    
    // Simulate AI generating description
    const suggestions: Record<string, string[]> = {
      "software engineer": [
        "Developed scalable web applications using React, Node.js, and MongoDB, improving system performance by 30%.",
        "Collaborated with cross-functional teams to implement new features and resolve critical bugs, reducing customer-reported issues by 25%.",
        "Optimized database queries and API endpoints, decreasing average response time from 300ms to 120ms.",
      ],
      "product manager": [
        "Led product development from concept to launch, resulting in 40% revenue growth within the first quarter.",
        "Conducted user research and A/B testing to optimize product features, increasing user engagement by 35%.",
        "Collaborated with engineering and design teams to prioritize product roadmap based on business objectives and user needs.",
      ],
      "marketing specialist": [
        "Executed multi-channel marketing campaigns across social media, email, and content platforms, increasing conversion rates by 28%.",
        "Analyzed campaign performance data to optimize marketing strategies, resulting in 20% lower customer acquisition costs.",
        "Created engaging content that increased organic traffic by 45% and social media engagement by 60%.",
      ],
      "project manager": [
        "Managed cross-functional teams to deliver projects on time and within budget, saving the company $150K annually.",
        "Implemented Agile methodology that improved team productivity by 40% and reduced development cycle times.",
        "Coordinated stakeholder communications and facilitated project meetings to ensure alignment with business goals.",
      ],
      "data scientist": [
        "Developed machine learning models that improved prediction accuracy by 35%, directly impacting business decision-making.",
        "Created data visualization dashboards that provided actionable insights to executive leadership.",
        "Cleaned and processed large datasets to identify trends and patterns, resulting in new business opportunities worth $500K.",
      ],
      "designer": [
        "Redesigned user interfaces that increased user engagement by 40% and reduced bounce rates by 25%.",
        "Created brand guidelines and design systems that ensured consistency across all company products and marketing materials.",
        "Conducted user testing sessions to gather feedback and iterate on designs, improving overall user satisfaction scores.",
      ]
    };
    
    const defaultSuggestions = [
      "Led key initiatives that improved operational efficiency by 25% and reduced costs by $100K annually.",
      "Collaborated with cross-departmental teams to implement new processes that enhanced productivity and workflow optimization.",
      "Managed projects from conception to completion, consistently meeting deadlines and exceeding quality expectations.",
    ];
    
    // Find matching suggestions or use default
    let matchingSuggestions = defaultSuggestions;
    
    for (const key in suggestions) {
      if (jobTitle.toLowerCase().includes(key)) {
        matchingSuggestions = suggestions[key];
        break;
      }
    }
    
    // Pick a random suggestion
    const suggestion = matchingSuggestions[Math.floor(Math.random() * matchingSuggestions.length)];
    
    handleExperienceChange(id, 'description', suggestion);
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold mb-2">Professional Experience</h2>
        <p className="text-muted-foreground mb-6">
          Add your work history, starting with your most recent position.
        </p>
      </div>
      
      {formValues.experience.map((exp, index) => (
        <Card key={exp.id} className="p-5 mb-6 relative">
          {formValues.experience.length > 1 && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2"
              onClick={() => handleRemoveExperience(exp.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
          
          <h3 className="font-medium text-lg mb-4">
            {index === 0 ? 'Current/Most Recent Position' : `Previous Position ${index}`}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor={`jobTitle-${exp.id}`} className="flex items-center mb-2">
                <Briefcase className="h-4 w-4 mr-2 text-muted-foreground" />
                Job Title <span className="text-destructive ml-1">*</span>
              </Label>
              <Input
                id={`jobTitle-${exp.id}`}
                value={exp.jobTitle}
                onChange={(e) => handleExperienceChange(exp.id, 'jobTitle', e.target.value)}
                placeholder="e.g., Software Engineer"
                required
              />
            </div>
            
            <div>
              <Label htmlFor={`company-${exp.id}`} className="flex items-center mb-2">
                <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                Company <span className="text-destructive ml-1">*</span>
              </Label>
              <Input
                id={`company-${exp.id}`}
                value={exp.company}
                onChange={(e) => handleExperienceChange(exp.id, 'company', e.target.value)}
                placeholder="e.g., Google Inc."
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor={`location-${exp.id}`} className="flex items-center mb-2">
                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                Location
              </Label>
              <Input
                id={`location-${exp.id}`}
                value={exp.location}
                onChange={(e) => handleExperienceChange(exp.id, 'location', e.target.value)}
                placeholder="e.g., San Francisco, CA"
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor={`dates-${exp.id}`} className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  Employment Period
                </Label>
                <div className="flex items-center">
                  <Checkbox
                    id={`current-${exp.id}`}
                    checked={exp.current}
                    onCheckedChange={(checked) => {
                      handleExperienceChange(exp.id, 'current', checked === true);
                    }}
                  />
                  <Label htmlFor={`current-${exp.id}`} className="ml-2 text-sm">
                    Current Position
                  </Label>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <Input
                  id={`startDate-${exp.id}`}
                  type="month"
                  value={exp.startDate}
                  onChange={(e) => handleExperienceChange(exp.id, 'startDate', e.target.value)}
                  placeholder="Start Date"
                />
                {!exp.current && (
                  <Input
                    id={`endDate-${exp.id}`}
                    type="month"
                    value={exp.endDate}
                    onChange={(e) => handleExperienceChange(exp.id, 'endDate', e.target.value)}
                    placeholder="End Date"
                  />
                )}
              </div>
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor={`description-${exp.id}`}>
                Description of Responsibilities & Achievements
              </Label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => generateDescriptionSuggestion(exp.id, exp.jobTitle)}
                disabled={!exp.jobTitle}
                className="flex items-center gap-1"
              >
                <Sparkles className="h-3 w-3" />
                AI Suggestion
              </Button>
            </div>
            <Textarea
              id={`description-${exp.id}`}
              value={exp.description}
              onChange={(e) => handleExperienceChange(exp.id, 'description', e.target.value)}
              placeholder="Describe your key responsibilities, achievements, and the technologies/methodologies you used."
              className="min-h-[100px]"
            />
          </div>
        </Card>
      ))}
      
      <Button 
        variant="outline" 
        onClick={handleAddExperience}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" /> Add Another Position
      </Button>
    </div>
  );
};
