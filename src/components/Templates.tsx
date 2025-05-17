
import React from 'react';
import { useResume } from '@/contexts/ResumeContext';
import { Button } from '@/components/ui/button';
import { FileText, ArrowRight, Wand } from 'lucide-react';
import { ResumeTemplate } from '@/types';
import { toast } from '@/components/ui/use-toast';

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
      
      // Generate new AI template
      const newTemplate = await generateAiTemplate();
      
      // Select the new template
      setSelectedTemplate(newTemplate);
      
      toast({
        title: "Template Created!",
        description: `Your AI-generated "${newTemplate.name}" template is ready to use.`,
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

  return (
    <section id="templates" className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Professional <span className="text-gradient">Resume Templates</span>
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Choose from our collection of professionally designed templates 
            or let our AI select the perfect one for your industry and career level.
          </p>
          
          <div className="mt-8">
            <Button
              onClick={handleGenerateAiTemplate}
              className="px-6 py-2 bg-gradient-to-r from-[#9b87f5] to-[#7E69AB] text-white hover:shadow-lg hover:scale-105 transition-all duration-300 hover:shadow-[0_0_12px_rgba(139,92,246,0.5)]"
              disabled={isGeneratingTemplate}
              aria-label="Generate a new unique resume template with AI"
            >
              <Wand className={`h-5 w-5 mr-2 ${isGeneratingTemplate ? 'animate-spin' : ''}`} />
              {isGeneratingTemplate ? "Generating..." : "Auto-Generate New Resume Template with AI"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {allTemplates.map((template) => (
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
                  style={{ backgroundColor: template.color + '20' }}
                >
                  <div 
                    className="h-3 w-full"
                    style={{ backgroundColor: template.color }}
                  ></div>
                  <div className="flex-1 p-2">
                    <div className="w-full h-3 bg-foreground/10 rounded mb-1"></div>
                    <div className="w-2/3 h-2 bg-foreground/10 rounded mb-3"></div>
                    
                    <div className="w-full h-px bg-foreground/10 my-2"></div>
                    
                    {template.layout === 'single-column' ? (
                      <>
                        <div className="w-full h-2 bg-foreground/10 rounded mb-1"></div>
                        <div className="w-full h-2 bg-foreground/10 rounded mb-1"></div>
                        <div className="w-4/5 h-2 bg-foreground/10 rounded mb-2"></div>
                        
                        <div className="w-full h-2 bg-foreground/10 rounded mb-1"></div>
                        <div className="w-full h-2 bg-foreground/10 rounded mb-1"></div>
                        <div className="w-3/5 h-2 bg-foreground/10 rounded"></div>
                      </>
                    ) : template.layout === 'two-column' ? (
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
          ))}
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
