import { useResume } from '@/contexts/ResumeContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

export const PersonalForm = () => {
  const { formValues, setFormValues, generateAiBioSuggestion, incrementAiSuggestions } = useResume();
  const [showSuggestionBox, setShowSuggestionBox] = useState(false);
  const [summaryType, setSummaryType] = useState('');
  const [generatedSummary, setGeneratedSummary] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  
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
  
  const handleAddressChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormValues({
      ...formValues,
      personalDetails: {
        ...formValues.personalDetails,
        address: e.target.value
      }
    });
  };
  
  // Function to handle profile image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Create a temp URL to display the image immediately
    const imageUrl = URL.createObjectURL(file);
    setFormValues({
      ...formValues,
      profileImage: file,
      profileImageUrl: imageUrl
    });
    
    // Here you would normally upload to a server/Supabase
    // but for now we're just keeping it in state
  };
  
  // AI suggestion handlers
  const handleGenerateSummary = async () => {
    if (!summaryType.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter a summary type to generate suggestions.",
        variant: "destructive"
      });
      return;
    }
    
    setIsGenerating(true);
    try {
      // Generate a unique, relevant summary - using our existing AI generator
      // but passing the user's specific role request
      const summary = generateAiBioSuggestion(summaryType);
      setGeneratedSummary(summary);
      incrementAiSuggestions(); // Track AI usage
    } catch (error) {
      console.error('Error generating summary:', error);
      toast({
        title: "Generation Failed",
        description: "We couldn't create a summary. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectSummary = () => {
    setFormValues({
      ...formValues,
      personalDetails: {
        ...formValues.personalDetails,
        bio: generatedSummary
      }
    });
    setShowSuggestionBox(false);
    
    toast({
      title: "Summary Applied",
      description: "The generated summary has been added to your resume.",
    });
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold mb-2">Personal Information</h2>
        <p className="text-muted-foreground mb-6">
          Let's start with some basic information about you.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="fullName" className="mb-2 block">
            Full Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="fullName"
            value={formValues.fullName}
            onChange={handleFullNameChange}
            placeholder="e.g. John Doe"
            required
          />
        </div>
        
        <div>
          <Label className="mb-2 block">Profile Image</Label>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              {formValues.profileImageUrl ? (
                <AvatarImage src={formValues.profileImageUrl} alt="Profile picture" />
              ) : (
                <AvatarFallback className="text-lg">
                  {formValues.fullName ? formValues.fullName.charAt(0).toUpperCase() : "?"}
                </AvatarFallback>
              )}
            </Avatar>
            
            <Label 
              htmlFor="profile-image" 
              className="cursor-pointer bg-secondary hover:bg-secondary/80 text-secondary-foreground px-4 py-2 rounded-md text-sm transition-colors"
            >
              Upload Image
              <Input
                id="profile-image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </Label>
          </div>
        </div>
        
        <div className="md:col-span-2">
          <Label htmlFor="bio" className="mb-2 block">
            Professional Summary
          </Label>
          <Textarea
            id="bio"
            value={formValues.personalDetails.bio}
            onChange={handleBioChange}
            placeholder="Write a brief summary about your professional experience and skills..."
            rows={4}
          />
          
          <div className="mt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowSuggestionBox(!showSuggestionBox)}
              className="mt-2 flex items-center gap-1.5"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Get Suggestions with AI
            </Button>
            
            {showSuggestionBox && (
              <div className="mt-4 p-4 border rounded-md bg-card">
                <Label htmlFor="summary-type" className="mb-2 block">
                  Enter Summary Type (e.g., Software Engineer with leadership focus)
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="summary-type"
                    value={summaryType}
                    onChange={(e) => setSummaryType(e.target.value)}
                    placeholder="e.g. Marketing Manager with e-commerce focus"
                  />
                  <Button 
                    onClick={handleGenerateSummary}
                    disabled={isGenerating}
                    variant="secondary"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      'Generate'
                    )}
                  </Button>
                </div>
                
                {generatedSummary && (
                  <div className="mt-4">
                    <Label className="mb-2 block text-sm font-medium">Generated Summary:</Label>
                    <div className="p-3 bg-muted/50 rounded-md text-sm">
                      {generatedSummary}
                    </div>
                    <Button 
                      onClick={handleSelectSummary}
                      size="sm"
                      className="mt-3"
                    >
                      Use This Summary
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
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
            value={formValues.personalDetails.nationality}
            onChange={handleNationalityChange}
            placeholder="e.g. American"
          />
        </div>
        
        <div className="md:col-span-2">
          <Label htmlFor="address" className="mb-2 block">
            Address
          </Label>
          <Textarea
            id="address"
            value={formValues.personalDetails.address}
            onChange={handleAddressChange}
            placeholder="e.g. 123 Main St, City, Country"
            rows={2}
          />
        </div>
      </div>
      
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-4">Personal Information Tips:</h3>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>Use your legal name as it would appear on official documents</li>
          <li>Choose a recent, professional photo with a neutral background</li>
          <li>Keep your professional summary concise and focused on your career highlights</li>
          <li>Date of birth is optional and can be omitted in many countries</li>
          <li>For the address, consider including just the city and state/country for privacy</li>
        </ul>
      </div>
    </div>
  );
};
