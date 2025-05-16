
import React, { useState } from 'react';
import { useResume } from '@/contexts/ResumeContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { User, Calendar, Globe, MapPin, Upload, Sparkles, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export const PersonalForm = () => {
  const { formValues, setFormValues, incrementAiSuggestions } = useResume();
  const [dragActive, setDragActive] = useState(false);
  const [imageError, setImageError] = useState('');
  
  // Handle profile image upload
  const handleProfileImageUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    // Validate file type
    if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
      setImageError('Please upload a PNG or JPG image.');
      return;
    }
    
    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setImageError('Image size should be less than 5MB.');
      return;
    }
    
    setImageError('');
    
    // Create URL for preview
    const imageUrl = URL.createObjectURL(file);
    
    setFormValues({
      ...formValues,
      profileImage: file,
      profileImageUrl: imageUrl
    });
  };
  
  // Handle drag events
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };
  
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    handleProfileImageUpload(e.dataTransfer.files);
  };
  
  // Generate AI suggestion for bio
  const generateBioSuggestion = () => {
    incrementAiSuggestions();
    
    // Simulate AI generating a bio
    const profession = formValues.workPreferences.industry || 'technology';
    const bioSuggestions = {
      'technology': 'Detail-oriented software professional with a passion for creating efficient, user-friendly solutions. Skilled in full-stack development with a focus on scalable architecture and intuitive user interfaces.',
      'marketing': 'Creative marketing professional with a data-driven approach to campaign development. Experienced in digital marketing strategies that drive engagement and conversion across multiple channels.',
      'design': 'Innovative design professional combining aesthetic excellence with functional user experiences. Passionate about creating visual solutions that communicate effectively and inspire audiences.',
      'finance': 'Strategic finance professional with strong analytical skills and attention to detail. Focused on driving business growth through sound financial planning and insightful data analysis.',
      'healthcare': 'Dedicated healthcare professional committed to providing exceptional patient care. Combines medical expertise with empathy and strong communication skills to support optimal health outcomes.',
      'education': 'Passionate educator focused on creating engaging learning experiences. Skilled in developing curriculum that fosters critical thinking and meets diverse student needs.',
      'default': 'Results-driven professional with a track record of success in fast-paced environments. Combines strong technical capabilities with excellent communication skills to deliver high-quality outcomes.'
    };
    
    const suggestedBio = bioSuggestions[profession as keyof typeof bioSuggestions] || bioSuggestions.default;
    
    setFormValues({
      ...formValues,
      personalDetails: {
        ...formValues.personalDetails,
        bio: suggestedBio
      }
    });
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold mb-2">Personal Details</h2>
        <p className="text-muted-foreground mb-6">
          Let's start with your basic information that will appear at the top of your resume.
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <div>
          <Label htmlFor="fullName" className="flex items-center mb-2">
            <User className="h-4 w-4 mr-2 text-muted-foreground" />
            Full Name <span className="text-destructive ml-1">*</span>
          </Label>
          <Input
            id="fullName"
            placeholder="John Doe"
            value={formValues.fullName}
            onChange={(e) => setFormValues({
              ...formValues,
              fullName: e.target.value
            })}
            required
            className="w-full"
          />
        </div>
        
        <div>
          <Label className="flex items-center mb-2">
            <Upload className="h-4 w-4 mr-2 text-muted-foreground" />
            Profile Image
          </Label>
          
          <div 
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
              dragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById('profileImage')?.click()}
          >
            <input
              type="file"
              id="profileImage"
              accept="image/png, image/jpeg, image/jpg"
              className="hidden"
              onChange={(e) => handleProfileImageUpload(e.target.files)}
            />
            
            {formValues.profileImageUrl ? (
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
                  <img 
                    src={formValues.profileImageUrl} 
                    alt="Profile Preview" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Click or drag to change image
                </p>
              </div>
            ) : (
              <div className="py-4">
                <Upload className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                <p className="mb-1">Click to upload or drag and drop</p>
                <p className="text-sm text-muted-foreground">
                  PNG or JPG (max. 5MB)
                </p>
              </div>
            )}
          </div>
          
          {imageError && (
            <div className="flex items-center text-destructive text-sm mt-2">
              <AlertCircle className="h-4 w-4 mr-1" />
              {imageError}
            </div>
          )}
        </div>
        
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <Label htmlFor="bio" className="flex items-center">
              Professional Summary
            </Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={generateBioSuggestion}
                    className="flex items-center gap-1"
                  >
                    <Sparkles className="h-3 w-3" />
                    AI Suggestion
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Generate a professional bio using AI</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Textarea
            id="bio"
            placeholder="Write a short professional summary (recommended: 2-4 sentences)"
            value={formValues.personalDetails.bio}
            onChange={(e) => setFormValues({
              ...formValues,
              personalDetails: {
                ...formValues.personalDetails,
                bio: e.target.value
              }
            })}
            className="resize-none min-h-[120px]"
          />
          <div className="text-right mt-1">
            <span className="text-xs text-muted-foreground">
              {formValues.personalDetails.bio.length}/500 characters
            </span>
          </div>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="dateOfBirth" className="flex items-center mb-2">
              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
              Date of Birth
            </Label>
            <Input
              id="dateOfBirth"
              type="date"
              value={formValues.personalDetails.dateOfBirth}
              onChange={(e) => setFormValues({
                ...formValues,
                personalDetails: {
                  ...formValues.personalDetails,
                  dateOfBirth: e.target.value
                }
              })}
            />
          </div>
          <div>
            <Label htmlFor="nationality" className="flex items-center mb-2">
              <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
              Nationality
            </Label>
            <Input
              id="nationality"
              placeholder="e.g., American, Canadian, etc."
              value={formValues.personalDetails.nationality}
              onChange={(e) => setFormValues({
                ...formValues,
                personalDetails: {
                  ...formValues.personalDetails,
                  nationality: e.target.value
                }
              })}
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="address" className="flex items-center mb-2">
            <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
            Address
          </Label>
          <Input
            id="address"
            placeholder="City, State/Province, Country"
            value={formValues.personalDetails.address}
            onChange={(e) => setFormValues({
              ...formValues,
              personalDetails: {
                ...formValues.personalDetails,
                address: e.target.value
              }
            })}
          />
          <p className="text-xs text-muted-foreground mt-1">
            For privacy reasons, consider including only city and country
          </p>
        </div>
      </div>
    </div>
  );
};
