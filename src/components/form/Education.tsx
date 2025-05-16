
import { useResume } from '@/contexts/ResumeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { EducationItem } from '@/types';
import { Plus, Trash2, GraduationCap, Building, MapPin, Calendar } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from '@/components/ui/use-toast';

export const EducationForm = () => {
  const { formValues, setFormValues } = useResume();
  
  const handleAddEducation = () => {
    setFormValues({
      ...formValues,
      education: [
        ...formValues.education,
        {
          id: uuidv4(),
          degree: '',
          institution: '',
          location: '',
          startDate: '',
          endDate: '',
          current: false,
          gpa: '',
        },
      ],
    });
  };
  
  const handleRemoveEducation = (id: string) => {
    if (formValues.education.length === 1) {
      toast({
        title: "Cannot Remove",
        description: "You need at least one education entry.",
        variant: "destructive"
      });
      return;
    }
    
    setFormValues({
      ...formValues,
      education: formValues.education.filter(edu => edu.id !== id),
    });
  };
  
  const handleEducationChange = (id: string, field: keyof EducationItem, value: string | boolean) => {
    setFormValues({
      ...formValues,
      education: formValues.education.map(edu => {
        if (edu.id === id) {
          return { ...edu, [field]: value };
        }
        return edu;
      }),
    });
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold mb-2">Education</h2>
        <p className="text-muted-foreground mb-6">
          Add your educational background, starting with your highest level of education.
        </p>
      </div>
      
      {formValues.education.map((edu, index) => (
        <Card key={edu.id} className="p-5 mb-6 relative">
          {formValues.education.length > 1 && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2"
              onClick={() => handleRemoveEducation(edu.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
          
          <h3 className="font-medium text-lg mb-4">
            {index === 0 ? 'Highest Education' : `Additional Education ${index}`}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor={`degree-${edu.id}`} className="flex items-center mb-2">
                <GraduationCap className="h-4 w-4 mr-2 text-muted-foreground" />
                Degree / Field of Study <span className="text-destructive ml-1">*</span>
              </Label>
              <Input
                id={`degree-${edu.id}`}
                value={edu.degree}
                onChange={(e) => handleEducationChange(edu.id, 'degree', e.target.value)}
                placeholder="e.g., Bachelor of Science in Computer Science"
                required
              />
            </div>
            
            <div>
              <Label htmlFor={`institution-${edu.id}`} className="flex items-center mb-2">
                <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                Institution <span className="text-destructive ml-1">*</span>
              </Label>
              <Input
                id={`institution-${edu.id}`}
                value={edu.institution}
                onChange={(e) => handleEducationChange(edu.id, 'institution', e.target.value)}
                placeholder="e.g., Stanford University"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor={`location-${edu.id}`} className="flex items-center mb-2">
                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                Location
              </Label>
              <Input
                id={`location-${edu.id}`}
                value={edu.location}
                onChange={(e) => handleEducationChange(edu.id, 'location', e.target.value)}
                placeholder="e.g., Stanford, CA"
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor={`dates-${edu.id}`} className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  Study Period
                </Label>
                <div className="flex items-center">
                  <Checkbox
                    id={`current-${edu.id}`}
                    checked={edu.current}
                    onCheckedChange={(checked) => {
                      handleEducationChange(edu.id, 'current', checked === true);
                    }}
                  />
                  <Label htmlFor={`current-${edu.id}`} className="ml-2 text-sm">
                    Currently Studying
                  </Label>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <Input
                  id={`startDate-${edu.id}`}
                  type="month"
                  value={edu.startDate}
                  onChange={(e) => handleEducationChange(edu.id, 'startDate', e.target.value)}
                  placeholder="Start Date"
                />
                {!edu.current && (
                  <Input
                    id={`endDate-${edu.id}`}
                    type="month"
                    value={edu.endDate}
                    onChange={(e) => handleEducationChange(edu.id, 'endDate', e.target.value)}
                    placeholder="End Date"
                  />
                )}
              </div>
            </div>
          </div>
          
          <div>
            <Label htmlFor={`gpa-${edu.id}`}>
              GPA / Honors (Optional)
            </Label>
            <Input
              id={`gpa-${edu.id}`}
              value={edu.gpa}
              onChange={(e) => handleEducationChange(edu.id, 'gpa', e.target.value)}
              placeholder="e.g., 3.8/4.0, Cum Laude, etc."
            />
          </div>
        </Card>
      ))}
      
      <Button 
        variant="outline" 
        onClick={handleAddEducation}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" /> Add Another Education
      </Button>
    </div>
  );
};
