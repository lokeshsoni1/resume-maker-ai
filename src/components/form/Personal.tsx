
import { useState } from 'react';
import { useResume } from '@/contexts/ResumeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { RefreshCw, Upload, Sparkles } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

export const PersonalForm = () => {
  const { formValues, setFormValues, incrementAiSuggestions, generateAiBioSuggestion } = useResume();
  const [bioSuggestions, setBioSuggestions] = useState<string[]>([]);
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);
  
  const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({
      ...formValues,
      fullName: e.target.value
    });
  };
  
  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormValues({
      ...formValues,
      personalDetails: {
        ...formValues.personalDetails,
        bio: e.target.value
      }
    });
  };
  
  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Profile image must be less than 5MB.",
        variant: "destructive"
      });
      return;
    }
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (JPEG, PNG, etc).",
        variant: "destructive"
      });
      return;
    }
    
    // Create URL for preview
    const imageUrl = URL.createObjectURL(file);
    
    setFormValues({
      ...formValues,
      profileImage: file,
      profileImageUrl: imageUrl
    });
    
    toast({
      title: "Image uploaded",
      description: "Your profile image has been uploaded successfully."
    });
  };
  
  const handleDateOfBirthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({
      ...formValues,
      personalDetails: {
        ...formValues.personalDetails,
        dateOfBirth: e.target.value
      }
    });
  };
  
  const handleNationalityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({
      ...formValues,
      personalDetails: {
        ...formValues.personalDetails,
        nationality: e.target.value
      }
    });
  };
  
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({
      ...formValues,
      personalDetails: {
        ...formValues.personalDetails,
        address: e.target.value
      }
    });
  };
  
  const handleGenerateBioSuggestions = () => {
    setIsGeneratingSuggestions(true);
    
    // Get job title to contextualize suggestions (if available)
    const jobTitle = formValues.experience[0]?.jobTitle || '';
    
    try {
      // Generate multiple unique suggestions
      const suggestions = [
        generateAiBioSuggestion(jobTitle),
        generateAiBioSuggestion(jobTitle),
        generateAiBioSuggestion(jobTitle)
      ];
      
      setBioSuggestions(suggestions);
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
  
  const handleUseSuggestion = (suggestion: string) => {
    setFormValues({
      ...formValues,
      personalDetails: {
        ...formValues.personalDetails,
        bio: suggestion
      }
    });
    
    toast({
      title: "Bio Updated",
      description: "The AI-generated bio has been applied to your resume.",
    });
  };
  
  const handleRegenerateSuggestion = (index: number) => {
    const jobTitle = formValues.experience[0]?.jobTitle || '';
    const newSuggestion = generateAiBioSuggestion(jobTitle);
    
    const updatedSuggestions = [...bioSuggestions];
    updatedSuggestions[index] = newSuggestion;
    setBioSuggestions(updatedSuggestions);
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Personal Information</h2>
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="fullName" className="mb-2 block">
              Full Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="fullName"
              type="text"
              placeholder="John Doe"
              value={formValues.fullName}
              onChange={handleFullNameChange}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="profileImage" className="mb-2 block">
              Profile Image
            </Label>
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                {formValues.profileImageUrl ? (
                  <div className="w-16 h-16 rounded-full overflow-hidden border">
                    <img
                      src={formValues.profileImageUrl}
                      alt={formValues.fullName || "Profile"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                    <Upload className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className="flex-grow">
                <Input
                  id="profileImage"
                  type="file"
                  accept="image/*"
                  onChange={handleProfileImageChange}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Recommended: Square image, max 5MB
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-2">
            <Label htmlFor="bio" className="block">
              Professional Summary
            </Label>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={handleGenerateBioSuggestions}
              disabled={isGeneratingSuggestions}
              className="flex items-center gap-2"
            >
              <Sparkles className="h-4 w-4" />
              {isGeneratingSuggestions ? "Generating..." : "Get AI Suggestions"}
            </Button>
          </div>
          <Textarea
            id="bio"
            placeholder="Write a brief summary about yourself and your professional background..."
            value={formValues.personalDetails.bio}
            onChange={handleBioChange}
            className="min-h-[120px]"
          />
          
          {bioSuggestions.length > 0 && (
            <div className="mt-4 space-y-3">
              <h3 className="text-sm font-medium">AI-Generated Suggestions:</h3>
              <div className="grid gap-3">
                {bioSuggestions.map((suggestion, index) => (
                  <Card key={index} className="p-3 hover:shadow-md transition-shadow">
                    <div className="text-sm">{suggestion}</div>
                    <div className="flex justify-end gap-2 mt-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleRegenerateSuggestion(index)}
                        aria-label="Generate a new suggestion"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleUseSuggestion(suggestion)}
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="dateOfBirth" className="mb-2 block">
              Date of Birth
            </Label>
            <Input
              id="dateOfBirth"
              type="date"
              value={formValues.personalDetails.dateOfBirth}
              onChange={handleDateOfBirthChange}
            />
          </div>
          
          <div>
            <Label htmlFor="nationality" className="mb-2 block">
              Nationality
            </Label>
            <Input
              id="nationality"
              type="text"
              placeholder="e.g. American, Canadian, etc."
              value={formValues.personalDetails.nationality}
              onChange={handleNationalityChange}
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="address" className="mb-2 block">
            Location/Address
          </Label>
          <Input
            id="address"
            type="text"
            placeholder="City, State, Country"
            value={formValues.personalDetails.address}
            onChange={handleAddressChange}
          />
          <p className="text-xs text-muted-foreground mt-1">
            You don't need to include your full address, just city and country is fine
          </p>
        </div>
      </div>
    </div>
  );
};
