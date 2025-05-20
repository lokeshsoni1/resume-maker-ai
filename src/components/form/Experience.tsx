
import { useState } from 'react';
import { useResume } from '@/contexts/ResumeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash, RefreshCw, Sparkles } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { Experience } from '@/types';

export const ExperienceForm = () => {
  const { formValues, setFormValues, generateAiExperienceSuggestion } = useResume();
  const [descriptionSuggestions, setDescriptionSuggestions] = useState<{index: number, suggestions: string[]}>({
    index: -1,
    suggestions: []
  });
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);
  const [jobType, setJobType] = useState('');
  
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
          description: ''
        }
      ]
    });
    
    // Scroll to the newly added experience
    setTimeout(() => {
      const experiences = document.querySelectorAll('.experience-item');
      const lastExperience = experiences[experiences.length - 1];
      lastExperience?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };
  
  const handleRemoveExperience = (id: string) => {
    if (formValues.experience.length === 1) {
      // Reset the form if it's the last experience item
      setFormValues({
        ...formValues,
        experience: [
          {
            id: uuidv4(),
            jobTitle: '',
            company: '',
            location: '',
            startDate: '',
            endDate: '',
            current: false,
            description: ''
          }
        ]
      });
      return;
    }
    
    setFormValues({
      ...formValues,
      experience: formValues.experience.filter((exp) => exp.id !== id)
    });
    
    // Clear suggestions if they were for this item
    if (descriptionSuggestions.index >= 0) {
      setDescriptionSuggestions({ index: -1, suggestions: [] });
    }
  };
  
  const handleFieldChange = (id: string, field: keyof Experience, value: string | boolean) => {
    setFormValues({
      ...formValues,
      experience: formValues.experience.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    });
  };
  
  const handleCurrentChange = (id: string, checked: boolean) => {
    setFormValues({
      ...formValues,
      experience: formValues.experience.map((exp) =>
        exp.id === id
          ? {
              ...exp,
              current: checked,
              endDate: checked ? '' : exp.endDate
            }
          : exp
      )
    });
  };
  
  const handleGenerateDescriptionSuggestions = (index: number) => {
    setIsGeneratingSuggestions(true);
    
    try {
      const jobTitle = formValues.experience[index].jobTitle;
      
      if (!jobTitle) {
        toast({
          title: "Job Title Missing",
          description: "Please enter a job title to generate relevant suggestions.",
          variant: "destructive"
        });
        setIsGeneratingSuggestions(false);
        return;
      }
      
      // Generate multiple unique suggestions
      const suggestions = [
        generateAiExperienceSuggestion(jobTitle),
        generateAiExperienceSuggestion(jobTitle),
        generateAiExperienceSuggestion(jobTitle)
      ];
      
      setDescriptionSuggestions({
        index,
        suggestions
      });
      
      // Set the job type based on the current job title
      setJobType(jobTitle);
    } catch (error) {
      console.error('Error generating suggestions:', error);
      toast({
        title: "Suggestion Generation Failed",
        description: "We couldn't create suggestions. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingSuggestions(false);
    }
  };
  
  const handleUseSuggestion = (suggestion: string, index: number) => {
    handleFieldChange(formValues.experience[index].id, 'description', suggestion);
    
    toast({
      title: "Description Updated",
      description: "The AI-generated description has been applied to your experience.",
    });
  };
  
  const handleRegenerateSuggestion = (suggestionIndex: number) => {
    const expIndex = descriptionSuggestions.index;
    if (expIndex === -1) return;
    
    const jobTitle = formValues.experience[expIndex].jobTitle;
    const newSuggestion = generateAiExperienceSuggestion(jobTitle);
    
    const updatedSuggestions = [...descriptionSuggestions.suggestions];
    updatedSuggestions[suggestionIndex] = newSuggestion;
    
    setDescriptionSuggestions({
      index: expIndex,
      suggestions: updatedSuggestions
    });
  };

  // New function to handle job type input change
  const handleJobTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setJobType(e.target.value);
  };

  // New function to generate job description based on type
  const handleGenerateJobDescription = () => {
    if (!jobType || descriptionSuggestions.index === -1) {
      toast({
        title: "Input Error",
        description: "Please enter a job type and select an experience first.",
        variant: "destructive"
      });
      return;
    }
    
    // Generate a unique job description based on the input job type
    const customSuggestion = generateAiExperienceSuggestion(jobType);
    
    // Add this suggestion to the existing ones
    const updatedSuggestions = [...descriptionSuggestions.suggestions];
    updatedSuggestions.push(customSuggestion);
    
    setDescriptionSuggestions({
      ...descriptionSuggestions,
      suggestions: updatedSuggestions
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Work Experience</h2>
        <Button
          type="button"
          variant="outline"
          onClick={handleAddExperience}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" /> Add Experience
        </Button>
      </div>
      
      <div className="space-y-8">
        {formValues.experience.map((experience, index) => (
          <Card key={experience.id} className="p-6 relative experience-item">
            <div className="absolute top-4 right-4">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveExperience(experience.id)}
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <Label htmlFor={`jobTitle-${experience.id}`} className="mb-2 block">
                  Job Title
                </Label>
                <Input
                  id={`jobTitle-${experience.id}`}
                  type="text"
                  placeholder="e.g. Software Engineer"
                  value={experience.jobTitle}
                  onChange={(e) => handleFieldChange(experience.id, 'jobTitle', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor={`company-${experience.id}`} className="mb-2 block">
                  Company
                </Label>
                <Input
                  id={`company-${experience.id}`}
                  type="text"
                  placeholder="e.g. Google"
                  value={experience.company}
                  onChange={(e) => handleFieldChange(experience.id, 'company', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor={`location-${experience.id}`} className="mb-2 block">
                  Location
                </Label>
                <Input
                  id={`location-${experience.id}`}
                  type="text"
                  placeholder="e.g. San Francisco, CA"
                  value={experience.location}
                  onChange={(e) => handleFieldChange(experience.id, 'location', e.target.value)}
                />
              </div>
              
              <div className="flex flex-col">
                <div className="flex items-center h-10 mb-2">
                  <Checkbox
                    id={`current-${experience.id}`}
                    checked={experience.current}
                    onCheckedChange={(checked) =>
                      handleCurrentChange(experience.id, checked === true)
                    }
                  />
                  <Label htmlFor={`current-${experience.id}`} className="ml-2">
                    I currently work here
                  </Label>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`startDate-${experience.id}`} className="mb-2 block text-xs">
                      Start Date
                    </Label>
                    <Input
                      id={`startDate-${experience.id}`}
                      type="date"
                      value={experience.startDate}
                      onChange={(e) => handleFieldChange(experience.id, 'startDate', e.target.value)}
                    />
                  </div>
                  
                  {!experience.current && (
                    <div>
                      <Label htmlFor={`endDate-${experience.id}`} className="mb-2 block text-xs">
                        End Date
                      </Label>
                      <Input
                        id={`endDate-${experience.id}`}
                        type="date"
                        value={experience.endDate}
                        onChange={(e) => handleFieldChange(experience.id, 'endDate', e.target.value)}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label htmlFor={`description-${experience.id}`} className="block">
                  Description
                </Label>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleGenerateDescriptionSuggestions(index)}
                  disabled={isGeneratingSuggestions}
                  className="flex items-center gap-2"
                >
                  <Sparkles className="h-4 w-4" />
                  {isGeneratingSuggestions && descriptionSuggestions.index === index ? "Generating..." : "Get AI Suggestions"}
                </Button>
              </div>
              <Textarea
                id={`description-${experience.id}`}
                placeholder="Describe your responsibilities and achievements in this role..."
                value={experience.description}
                onChange={(e) => handleFieldChange(experience.id, 'description', e.target.value)}
                className="min-h-[120px]"
              />
              
              {descriptionSuggestions.index === index && descriptionSuggestions.suggestions.length > 0 && (
                <div className="mt-4 space-y-3">
                  <h3 className="text-sm font-medium">AI-Generated Suggestions:</h3>
                  
                  {/* Job type input field and generate button */}
                  <Card className="p-3">
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label htmlFor="job-type-input" className="text-sm font-medium">
                          Enter Job Type for More Suggestions
                        </Label>
                        <div className="flex gap-2">
                          <Input
                            id="job-type-input"
                            value={jobType}
                            onChange={handleJobTypeChange}
                            placeholder="e.g., Software Engineer, Project Manager"
                            className="flex-1"
                          />
                          <Button 
                            type="button"
                            onClick={handleGenerateJobDescription}
                            disabled={!jobType}
                            className="flex items-center gap-2"
                          >
                            <Sparkles className="h-4 w-4" />
                            Generate
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                  
                  <div className="grid gap-3">
                    {descriptionSuggestions.suggestions.map((suggestion, i) => (
                      <Card key={i} className="p-3 hover:shadow-md transition-shadow">
                        <div className="text-sm">{suggestion}</div>
                        <div className="flex justify-end gap-2 mt-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleRegenerateSuggestion(i)}
                            aria-label="Generate a new suggestion"
                          >
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleUseSuggestion(suggestion, index)}
                          >
                            Use This
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
