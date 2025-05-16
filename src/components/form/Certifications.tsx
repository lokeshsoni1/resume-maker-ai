
import { useResume } from '@/contexts/ResumeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { CertificationItem } from '@/types';
import { Plus, Trash2, Award, Building, Calendar, Link } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

export const CertificationsForm = () => {
  const { formValues, setFormValues } = useResume();
  
  const handleAddCertification = () => {
    setFormValues({
      ...formValues,
      certifications: [
        ...formValues.certifications,
        {
          id: uuidv4(),
          name: '',
          issuer: '',
          date: '',
          link: '',
        },
      ],
    });
  };
  
  const handleRemoveCertification = (id: string) => {
    setFormValues({
      ...formValues,
      certifications: formValues.certifications.filter(cert => cert.id !== id),
    });
  };
  
  const handleCertificationChange = (id: string, field: keyof CertificationItem, value: string) => {
    setFormValues({
      ...formValues,
      certifications: formValues.certifications.map(cert => {
        if (cert.id === id) {
          return { ...cert, [field]: value };
        }
        return cert;
      }),
    });
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold mb-2">Certifications & Licenses</h2>
        <p className="text-muted-foreground mb-6">
          Add professional certifications or licenses that enhance your qualifications.
          This section is optional but can significantly strengthen your resume.
        </p>
      </div>
      
      {formValues.certifications.length === 0 ? (
        <Card className="p-6 text-center">
          <Award className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
          <h3 className="text-lg font-medium mb-2">No Certifications Added</h3>
          <p className="text-muted-foreground mb-4">
            Professional certifications can boost your resume and demonstrate your expertise.
          </p>
          <Button onClick={handleAddCertification}>
            <Plus className="h-4 w-4 mr-2" /> Add Certification
          </Button>
        </Card>
      ) : (
        <>
          {formValues.certifications.map((cert, index) => (
            <Card key={cert.id} className="p-5 mb-6 relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2"
                onClick={() => handleRemoveCertification(cert.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              
              <h3 className="font-medium text-lg mb-4">
                Certification {index + 1}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor={`certName-${cert.id}`} className="flex items-center mb-2">
                    <Award className="h-4 w-4 mr-2 text-muted-foreground" />
                    Certification Name
                  </Label>
                  <Input
                    id={`certName-${cert.id}`}
                    value={cert.name}
                    onChange={(e) => handleCertificationChange(cert.id, 'name', e.target.value)}
                    placeholder="e.g., AWS Certified Solutions Architect"
                  />
                </div>
                
                <div>
                  <Label htmlFor={`issuer-${cert.id}`} className="flex items-center mb-2">
                    <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                    Issuing Organization
                  </Label>
                  <Input
                    id={`issuer-${cert.id}`}
                    value={cert.issuer}
                    onChange={(e) => handleCertificationChange(cert.id, 'issuer', e.target.value)}
                    placeholder="e.g., Amazon Web Services"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`date-${cert.id}`} className="flex items-center mb-2">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    Date Acquired
                  </Label>
                  <Input
                    id={`date-${cert.id}`}
                    type="month"
                    value={cert.date}
                    onChange={(e) => handleCertificationChange(cert.id, 'date', e.target.value)}
                    placeholder="Date Acquired"
                  />
                </div>
                
                <div>
                  <Label htmlFor={`link-${cert.id}`} className="flex items-center mb-2">
                    <Link className="h-4 w-4 mr-2 text-muted-foreground" />
                    Verification Link (Optional)
                  </Label>
                  <Input
                    id={`link-${cert.id}`}
                    value={cert.link}
                    onChange={(e) => handleCertificationChange(cert.id, 'link', e.target.value)}
                    placeholder="e.g., https://www.credential.net/12345678"
                  />
                </div>
              </div>
            </Card>
          ))}
          
          <Button 
            variant="outline" 
            onClick={handleAddCertification}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" /> Add Another Certification
          </Button>
        </>
      )}
      
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-4">Why Certifications Matter:</h3>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>They validate your skills and knowledge to potential employers</li>
          <li>Many certifications are recognized industry-wide and boost credibility</li>
          <li>They demonstrate your commitment to professional development</li>
          <li>Some roles require or strongly prefer specific certifications</li>
        </ul>
      </div>
    </div>
  );
};
