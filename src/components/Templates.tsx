
import React from 'react';
import { useResume } from '@/contexts/ResumeContext';
import { Button } from '@/components/ui/button';
import { FileText, ArrowRight } from 'lucide-react';
import { ResumeTemplate } from '@/types';
import { toast } from '@/components/ui/use-toast';
import { Icons } from '@/components/ui/icons';

export const Templates = () => {
  const { 
    availableTemplates, 
    selectedTemplate, 
    setSelectedTemplate,
    generateAiTemplate,
    generatedTemplates
  } = useResume();

  const [isGeneratingTemplate, setIsGeneratingTemplate] = React.useState(false);

  const handleTemplateSelect = (template: ResumeTemplate) => {
    setSelectedTemplate(template);
  };

  const handleScrollToBuild = () => {
    const buildSection = document.getElementById('build');
    if (buildSection) {
      buildSection.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  const handleGenerateAiTemplate = async () => {
    try {
      setIsGeneratingTemplate(true);
      
      toast({
        title: "Generating Template",
        description: "AI is creating a unique template just for you...",
      });
      
      // Enhanced AI template generation with proper type compliance
      const colors = [
        '#1a202c', '#2d3748', '#e53e3e', '#000000', '#2b6cb0', '#1a5276',
        '#9b2c2c', '#2c5530', '#553c9a', '#744210', '#1a365d', '#2d1b69'
      ];
      
      const accentColors = [
        '#4a5568', '#718096', '#fc8181', '#4a4a4a', '#90cdf4', '#5dade2',
        '#feb2b2', '#68d391', '#b794f6', '#f6ad55', '#63b3ed', '#a78bfa'
      ];
      
      const fonts = [
        'Inter, sans-serif', 'Georgia, serif', 'Montserrat, sans-serif',
        'Arial, sans-serif', 'Times New Roman, serif', 'Roboto Mono, monospace',
        'Helvetica, sans-serif', 'Palatino, serif', 'Verdana, sans-serif'
      ];
      
      const layouts: ('single-column' | 'two-column' | 'hybrid')[] = [
        'single-column', 'two-column', 'hybrid'
      ];
      
      const borderStyles = [
        'border-b-2', 'border-l-4 border-l-blue-600', 'border-t-4 border-t-orange-500',
        'border-none', 'border-b-2 border-b-blue-800', 'border-l-2 border-l-cyan-600',
        'border-r-3 border-r-red-500', 'border-t-2 border-t-green-600'
      ];
      
      const headerLayouts = ['flex-row', 'flex-col', 'grid'];
      const profilePositions = ['left', 'center', 'right'];
      
      // Create unique combinations using timestamp and random selections
      const timestamp = Date.now();
      const randomSeed = Math.floor(Math.random() * 1000000);
      
      const colorIndex = (timestamp + randomSeed) % colors.length;
      const accentIndex = (timestamp + randomSeed + 1) % accentColors.length;
      const fontIndex = (timestamp + randomSeed + 2) % fonts.length;
      const layoutIndex = (timestamp + randomSeed + 3) % layouts.length;
      const borderIndex = (timestamp + randomSeed + 4) % borderStyles.length;
      const headerLayoutIndex = (timestamp + randomSeed + 5) % headerLayouts.length;
      const profilePositionIndex = (timestamp + randomSeed + 6) % profilePositions.length;
      
      const newTemplate: ResumeTemplate = {
        id: `ai-generated-${timestamp}-${randomSeed}`,
        name: `AI Template ${timestamp % 1000}`,
        color: colors[colorIndex],
        accentColor: accentColors[accentIndex],
        font: fonts[fontIndex],
        layout: layouts[layoutIndex],
        borderStyle: borderStyles[borderIndex],
        headerLayout: headerLayouts[headerLayoutIndex],
        profilePosition: profilePositions[profilePositionIndex],
        sectionSpacing: `mb-${Math.floor(Math.random() * 4) + 4}`,
        className: `ai-template-${timestamp}-${randomSeed}`,
        isAiGenerated: true
      };
      
      // Generate new AI template
      const generatedTemplate = await generateAiTemplate();
      
      // Override with our enhanced variations
      const enhancedTemplate = {
        ...generatedTemplate,
        ...newTemplate
      };
      
      // Select the new template
      setSelectedTemplate(enhancedTemplate);
      
      toast({
        title: "Template Created!",
        description: `Your AI-generated "${enhancedTemplate.name}" template is ready to use.`,
      });
    } catch (error) {
      console.error('Error generating template:', error);
      toast({
        title: "Generation Failed",
        description: "We couldn't create a new template. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingTemplate(false);
    }
  };

  // Combined templates list (standard + AI-generated)
  const allTemplates = [...availableTemplates, ...generatedTemplates];

  // Define distinct visual styles for each template preview
  const getTemplatePreviewStyle = (template: ResumeTemplate) => {
    switch(template.id) {
      case 'modern':
        return { color: '#1a202c', layout: 'single-column', border: 'none' };
      case 'professional':
        return { color: '#2d3748', layout: 'two-column', border: 'border-l-4 pl-2' };
      case 'creative':
        return { color: '#e53e3e', layout: 'single-column', border: 'border-t-2 pt-2' };
      case 'minimalist':
        return { color: '#000000', layout: 'single-column', border: 'none' };
      case 'executive':
        return { color: '#2b6cb0', layout: 'two-column', border: 'border-b-2 pb-1' };
      case 'tech':
        return { color: '#1a5276', layout: 'hybrid', border: 'border-l-2 pl-3' };
      default:
        // For AI-generated templates
        return { 
          color: template.color || '#9b87f5',
          layout: template.layout || 'single-column',
          border: 'border rounded-md p-1'
        };
    }
  };

  return (
    <section id="templates" className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Professional <span className="text-gradient">Resume Templates</span>
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Choose from our collection of professionally designed templates 
            or let our AI create a unique one for your industry and career level.
          </p>
          
          <div className="mt-8">
            <Button
              onClick={handleGenerateAiTemplate}
              className="px-6 py-2 bg-gradient-to-r from-[#9b87f5] to-[#7E69AB] text-white hover:shadow-lg hover:scale-105 transition-all duration-300 hover:shadow-[0_0_12px_rgba(139,92,246,0.5)]"
              disabled={isGeneratingTemplate}
              aria-label="Generate a new unique resume template with AI"
            >
              <Icons.wand className={`h-5 w-5 mr-2 ${isGeneratingTemplate ? 'animate-spin' : ''}`} />
              {isGeneratingTemplate ? "Generating..." : "Auto-Generate New Resume Template with AI"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {allTemplates.map((template) => {
            const previewStyle = getTemplatePreviewStyle(template);
            
            return (
              <div
                key={template.id}
                className={`rounded-xl overflow-hidden glass-card transition-all duration-300 ${
                  selectedTemplate.id === template.id
                    ? 'ring-2 ring-primary ring-offset-2 ring-offset-background'
                    : ''
                }`}
              >
                <div className="h-52 bg-card flex items-center justify-center overflow-hidden">
                  <div 
                    className="w-32 h-44 border border-border/20 rounded-md shadow-lg flex flex-col"
                    style={{ backgroundColor: '#FFFFFF' }}
                  >
                    <div 
                      className="h-3 w-full"
                      style={{ backgroundColor: template.color }}
                    ></div>
                    <div className="flex-1 p-2">
                      <div className="w-full h-3 bg-foreground/10 rounded mb-1"></div>
                      <div className="w-2/3 h-2 bg-foreground/10 rounded mb-3"></div>
                      
                      <div className="w-full h-px bg-foreground/10 my-2"></div>
                      
                      {previewStyle.layout === 'single-column' ? (
                        <>
                          <div className="w-full h-2 bg-foreground/10 rounded mb-1"></div>
                          <div className="w-full h-2 bg-foreground/10 rounded mb-1"></div>
                          <div className="w-4/5 h-2 bg-foreground/10 rounded mb-2"></div>
                          
                          <div className="w-full h-2 bg-foreground/10 rounded mb-1"></div>
                          <div className="w-full h-2 bg-foreground/10 rounded mb-1"></div>
                          <div className="w-3/5 h-2 bg-foreground/10 rounded"></div>
                        </>
                      ) : previewStyle.layout === 'two-column' ? (
                        <div className="flex gap-1">
                          <div className="w-1/3">
                            <div className="w-full h-2 bg-foreground/10 rounded mb-1"></div>
                            <div className="w-full h-2 bg-foreground/10 rounded mb-1"></div>
                            <div className="w-4/5 h-2 bg-foreground/10 rounded"></div>
                          </div>
                          <div className="w-2/3">
                            <div className="w-full h-2 bg-foreground/10 rounded mb-1"></div>
                            <div className="w-full h-2 bg-foreground/10 rounded mb-1"></div>
                            <div className="w-full h-2 bg-foreground/10 rounded mb-1"></div>
                            <div className="w-4/5 h-2 bg-foreground/10 rounded"></div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex gap-1">
                          <div className="w-1/3">
                            <div className="w-full h-6 bg-foreground/10 rounded mb-1"></div>
                            <div className="w-full h-2 bg-foreground/10 rounded mb-1"></div>
                            <div className="w-full h-2 bg-foreground/10 rounded mb-1"></div>
                          </div>
                          <div className="w-2/3">
                            <div className="w-full h-2 bg-foreground/10 rounded mb-1"></div>
                            <div className="w-full h-2 bg-foreground/10 rounded mb-1"></div>
                            <div className="w-full h-2 bg-foreground/10 rounded"></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-medium">
                      {template.name}
                      {template.id.startsWith('ai-') && (
                        <span className="ml-2 px-1.5 py-0.5 text-xs bg-primary/20 text-primary rounded-full">AI</span>
                      )}
                    </h3>
                    <div 
                      className="h-4 w-4 rounded-full"
                      style={{ backgroundColor: template.color }}
                    ></div>
                  </div>
                  <p className="text-sm text-foreground/70 mb-4">
                    {template.id.startsWith('ai-') 
                      ? 'Custom AI-generated template with unique styling and layout.'
                      : template.layout === 'single-column'
                        ? 'Clean, single-column layout perfect for a focused presentation.'
                        : template.layout === 'two-column'
                        ? 'Two-column format with sidebar for compact, efficient design.'
                        : 'Hybrid layout with creative elements and modern styling.'
                    }
                  </p>
                  <Button
                    variant={selectedTemplate.id === template.id ? "default" : "outline"}
                    size="sm"
                    className="w-full"
                    onClick={() => handleTemplateSelect(template)}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    {selectedTemplate.id === template.id ? "Selected" : "Select Template"}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <p className="mb-8 text-lg">
            Ready to create your professional resume with our AI-powered tools?
          </p>
          <Button 
            size="lg"
            onClick={handleScrollToBuild}
            className="px-8 hover-scale glow"
          >
            Start Building Your Resume <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};
