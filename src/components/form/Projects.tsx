
import { useResume } from '@/contexts/ResumeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Project, ProjectItem } from '@/types';
import { Plus, Trash2, FolderKanban, Code, Link } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

export const ProjectsForm = () => {
  const { formValues, setFormValues } = useResume();
  
  const handleAddProject = () => {
    setFormValues({
      ...formValues,
      projects: [
        ...formValues.projects,
        {
          id: uuidv4(),
          title: '',
          description: '',
          technologies: '',
          link: '',
        },
      ],
    });
  };
  
  const handleRemoveProject = (id: string) => {
    setFormValues({
      ...formValues,
      projects: formValues.projects.filter(project => project.id !== id),
    });
  };
  
  const handleProjectChange = (id: string, field: keyof ProjectItem, value: string) => {
    setFormValues({
      ...formValues,
      projects: formValues.projects.map(project => {
        if (project.id === id) {
          return { ...project, [field]: value };
        }
        return project;
      }),
    });
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold mb-2">Projects</h2>
        <p className="text-muted-foreground mb-6">
          Add notable projects that demonstrate your skills and experiences. 
          These could be work-related, academic, or personal projects.
        </p>
      </div>
      
      {formValues.projects.map((project, index) => (
        <Card key={project.id} className="p-5 mb-6 relative">
          {formValues.projects.length > 1 && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2"
              onClick={() => handleRemoveProject(project.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
          
          <h3 className="font-medium text-lg mb-4">
            Project {index + 1}
          </h3>
          
          <div className="mb-4">
            <Label htmlFor={`projectTitle-${project.id}`} className="flex items-center mb-2">
              <FolderKanban className="h-4 w-4 mr-2 text-muted-foreground" />
              Project Title
            </Label>
            <Input
              id={`projectTitle-${project.id}`}
              value={project.title}
              onChange={(e) => handleProjectChange(project.id, 'title', e.target.value)}
              placeholder="e.g., E-commerce Website Redesign"
            />
          </div>
          
          <div className="mb-4">
            <Label htmlFor={`projectDescription-${project.id}`}>
              Project Description
            </Label>
            <Textarea
              id={`projectDescription-${project.id}`}
              value={project.description}
              onChange={(e) => handleProjectChange(project.id, 'description', e.target.value)}
              placeholder="Describe the project, your role, and significant outcomes."
              className="min-h-[100px]"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor={`technologies-${project.id}`} className="flex items-center mb-2">
                <Code className="h-4 w-4 mr-2 text-muted-foreground" />
                Technologies Used
              </Label>
              <Input
                id={`technologies-${project.id}`}
                value={project.technologies}
                onChange={(e) => handleProjectChange(project.id, 'technologies', e.target.value)}
                placeholder="e.g., React, Node.js, MongoDB"
              />
            </div>
            
            <div>
              <Label htmlFor={`projectLink-${project.id}`} className="flex items-center mb-2">
                <Link className="h-4 w-4 mr-2 text-muted-foreground" />
                Project Link (Optional)
              </Label>
              <Input
                id={`projectLink-${project.id}`}
                value={project.link}
                onChange={(e) => handleProjectChange(project.id, 'link', e.target.value)}
                placeholder="e.g., https://github.com/yourusername/project"
              />
            </div>
          </div>
        </Card>
      ))}
      
      <Button 
        variant="outline" 
        onClick={handleAddProject}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" /> Add Another Project
      </Button>
    </div>
  );
};
