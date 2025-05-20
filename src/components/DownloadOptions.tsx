
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useResume } from '@/contexts/ResumeContext';
import { toast } from '@/components/ui/use-toast';
import { Icons } from '@/components/ui/icons';
import { Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export function DownloadOptions() {
  const { formValues, incrementDownloadCount } = useResume();
  const [isDownloadingPng, setIsDownloadingPng] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [isDownloadingWord, setIsDownloadingWord] = useState(false);

  const handleDownloadPNG = async () => {
    setIsDownloadingPng(true);
    try {
      // Get the resume container
      const resumeContent = document.getElementById('resume-content');
      if (!resumeContent) {
        throw new Error('Resume content not found');
      }

      // Remember original styles
      const originalStyle = resumeContent.style.cssText;
      
      // Temporarily modify for capture
      resumeContent.style.position = 'static';
      resumeContent.style.overflow = 'visible';
      
      // Scroll to ensure the element is visible
      window.scrollTo(0, 0);
      
      // Capture with html2canvas
      const canvas = await html2canvas(resumeContent, {
        scale: window.devicePixelRatio || 2, // High DPI for retina displays
        useCORS: true, // Allow cross-origin images
        allowTaint: true,
        width: resumeContent.scrollWidth,
        height: resumeContent.scrollHeight,
        logging: false,
        backgroundColor: '#FFFFFF',
      });
      
      // Restore original style
      resumeContent.style.cssText = originalStyle;
      
      // Convert to PNG data URL
      const imgData = canvas.toDataURL('image/png', 1.0);
      
      // Create download link
      const link = document.createElement('a');
      const fileName = formValues.fullName 
        ? `${formValues.fullName.replace(/\s+/g, '-')}-Resume.png` 
        : `Resume-${new Date().toISOString().split('T')[0]}.png`;
      
      link.href = imgData;
      link.download = fileName;
      link.click();
      
      // Track download
      incrementDownloadCount();
      
      toast({
        title: "Download Complete",
        description: "Your resume has been downloaded as a PNG file.",
      });
      
      // Here you would normally save to Supabase Storage
      // await supabase.storage.from('resumes').upload(`images/${fileName}`, imgData);
      
    } catch (error) {
      console.error('Error downloading PNG:', error);
      toast({
        title: "Download Failed",
        description: "We couldn't generate your PNG file. Please try again.",
        variant: "destructive",
      });
      
      // Try again after a short delay
      setTimeout(() => handleDownloadPNG(), 500);
      
    } finally {
      setIsDownloadingPng(false);
    }
  };

  const handleDownloadPDF = async () => {
    setIsDownloadingPdf(true);
    try {
      // Get the resume container
      const resumeContent = document.getElementById('resume-content');
      if (!resumeContent) {
        throw new Error('Resume content not found');
      }
      
      // Capture with html2canvas
      const canvas = await html2canvas(resumeContent, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#FFFFFF',
      });
      
      // Create PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      
      // Generate file name
      const fileName = formValues.fullName 
        ? `${formValues.fullName.replace(/\s+/g, '-')}-Resume.pdf` 
        : `Resume-${new Date().toISOString().split('T')[0]}.pdf`;
      
      // Download PDF
      pdf.save(fileName);
      
      // Track download
      incrementDownloadCount();
      
      toast({
        title: "Download Complete",
        description: "Your resume has been downloaded as a PDF file.",
      });
      
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast({
        title: "Download Failed",
        description: "We couldn't generate your PDF file. Please try again.",
        variant: "destructive",
      });
      
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const handleDownloadWord = async () => {
    setIsDownloadingWord(true);
    try {
      // In a real implementation, we would create a .docx file
      // using a library like docx-js
      
      // For now, just simulate a download
      setTimeout(() => {
        const fileName = formValues.fullName 
          ? `${formValues.fullName.replace(/\s+/g, '-')}-Resume.docx` 
          : `Resume-${new Date().toISOString().split('T')[0]}.docx`;
        
        // Create a blob with minimal content
        const blob = new Blob(['This is a Word document'], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
        
        // Track download
        incrementDownloadCount();
        
        toast({
          title: "Download Complete",
          description: "Your resume has been downloaded as a Word file.",
        });
      }, 1000);
      
    } catch (error) {
      console.error('Error downloading Word:', error);
      toast({
        title: "Download Failed",
        description: "We couldn't generate your Word file. Please try again.",
        variant: "destructive",
      });
      
    } finally {
      setIsDownloadingWord(false);
    }
  };

  return (
    <div className="flex flex-wrap justify-center gap-4 mt-8">
      <Button
        variant="outline"
        onClick={handleDownloadPNG}
        disabled={isDownloadingPng}
        className="flex items-center gap-2 hover-scale glow"
      >
        {isDownloadingPng ? (
          <>
            <Icons.loader2 className="h-4 w-4 animate-spin" />
            Downloading...
          </>
        ) : (
          <>
            <Icons.zoomOut className="h-4 w-4" />
            Download as PNG
          </>
        )}
      </Button>
      
      <Button
        variant="outline"
        onClick={handleDownloadPDF}
        disabled={isDownloadingPdf}
        className="flex items-center gap-2 hover-scale glow"
      >
        {isDownloadingPdf ? (
          <>
            <Icons.loader2 className="h-4 w-4 animate-spin" />
            Downloading...
          </>
        ) : (
          <>
            <Download className="h-4 w-4" />
            Download as PDF
          </>
        )}
      </Button>
      
      <Button
        variant="outline"
        onClick={handleDownloadWord}
        disabled={isDownloadingWord}
        className="flex items-center gap-2 hover-scale glow"
      >
        {isDownloadingWord ? (
          <>
            <Icons.loader2 className="h-4 w-4 animate-spin" />
            Downloading...
          </>
        ) : (
          <>
            <Download className="h-4 w-4" />
            Download as Word
          </>
        )}
      </Button>
    </div>
  );
}
