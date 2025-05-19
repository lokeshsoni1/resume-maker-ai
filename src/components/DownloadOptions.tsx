
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useResume } from '@/contexts/ResumeContext';
import { DownloadCloud, FileImage, FileText, FileType2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { DownloadFormat } from '@/types';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export const DownloadOptions = () => {
  const { formValues } = useResume();
  const [isDownloading, setIsDownloading] = useState<Record<DownloadFormat, boolean>>({
    png: false,
    pdf: false,
    word: false
  });

  const downloadAsPNG = async (elementId: string, fileName: string = 'Resume'): Promise<void> => {
    try {
      const element = document.getElementById(elementId);
      if (!element) {
        throw new Error(`Element with ID "${elementId}" not found`);
      }

      // Save original styles
      const originalPosition = element.style.position;
      const originalOverflow = element.style.overflow;
      
      // Set temporary styles for better rendering
      element.style.position = 'static';
      element.style.overflow = 'visible';
      
      // Scroll to top for consistent capturing
      window.scrollTo(0, 0);
      
      // Capture element as canvas with high resolution
      const canvas = await html2canvas(element, {
        scale: window.devicePixelRatio || 2, // Use device pixel ratio for high resolution
        useCORS: true, // Handle cross-origin images
        allowTaint: true,
        logging: false,
        width: element.scrollWidth,
        height: element.scrollHeight,
        scrollX: 0,
        scrollY: 0,
        backgroundColor: null, // Preserve transparency if applicable
      });
      
      // Restore original styles
      element.style.position = originalPosition;
      element.style.overflow = originalOverflow;
      
      // Convert canvas to data URL and download
      const dataUrl = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      
      // Use the user's name for the filename if available
      link.download = `${fileName.trim() || 'Resume'}-${new Date().toISOString().split('T')[0]}.png`;
      link.href = dataUrl;
      link.click();
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error downloading PNG:', error);
      return Promise.reject(error);
    }
  };

  const downloadAsPDF = async (elementId: string, fileName: string = 'Resume'): Promise<void> => {
    try {
      const element = document.getElementById(elementId);
      if (!element) {
        throw new Error(`Element with ID "${elementId}" not found`);
      }

      // Save original styles
      const originalPosition = element.style.position;
      const originalOverflow = element.style.overflow;
      
      // Set temporary styles for better rendering
      element.style.position = 'static';
      element.style.overflow = 'visible';
      
      // Scroll to top for consistent capturing
      window.scrollTo(0, 0);
      
      // Capture element as canvas
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        width: element.scrollWidth,
        height: element.scrollHeight,
        scrollX: 0,
        scrollY: 0,
      });
      
      // Restore original styles
      element.style.position = originalPosition;
      element.style.overflow = originalOverflow;
      
      // Convert canvas to PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height],
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`${fileName.trim() || 'Resume'}.pdf`);
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error downloading PDF:', error);
      return Promise.reject(error);
    }
  };

  const downloadAsWord = (resumeData: any, fileName: string = 'Resume'): void => {
    try {
      // Create a simple HTML representation of the resume
      let content = `<!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${resumeData.fullName || 'Resume'}</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
          h1 { color: #333; }
          h2 { color: #555; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
          .section { margin-bottom: 20px; }
          .item { margin-bottom: 15px; }
          .item-header { display: flex; justify-content: space-between; }
          .dates { color: #777; }
        </style>
      </head>
      <body>
        <h1>${resumeData.fullName || 'Resume'}</h1>
        <p>${resumeData.personalDetails?.bio || ''}</p>
        <p>Email: ${resumeData.contactInformation?.email || ''}</p>`;
      
      // Add experience section
      if (resumeData.experience && resumeData.experience.length > 0) {
        content += `<div class="section"><h2>Experience</h2>`;
        resumeData.experience.forEach((exp: any) => {
          content += `
          <div class="item">
            <div class="item-header">
              <strong>${exp.jobTitle} at ${exp.company}</strong>
              <span class="dates">${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}</span>
            </div>
            <div>${exp.location}</div>
            <p>${exp.description}</p>
          </div>`;
        });
        content += `</div>`;
      }
      
      // Add education section
      if (resumeData.education && resumeData.education.length > 0) {
        content += `<div class="section"><h2>Education</h2>`;
        resumeData.education.forEach((edu: any) => {
          content += `
          <div class="item">
            <div class="item-header">
              <strong>${edu.degree} at ${edu.institution}</strong>
              <span class="dates">${edu.startDate} - ${edu.current ? 'Present' : edu.endDate}</span>
            </div>
            <div>${edu.location}</div>
          </div>`;
        });
        content += `</div>`;
      }
      
      // Add skills section
      if (resumeData.skills && resumeData.skills.length > 0) {
        content += `<div class="section"><h2>Skills</h2><p>${resumeData.skills.join(', ')}</p></div>`;
      }
      
      content += `</body></html>`;
      
      // Create a Blob from the HTML content
      const blob = new Blob([content], { type: 'application/msword' });
      const url = URL.createObjectURL(blob);
      
      // Create download link
      const link = document.createElement('a');
      link.href = url;
      link.download = `${fileName.trim() || 'Resume'}.doc`;
      link.click();
      
      // Clean up
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading Word document:', error);
    }
  };

  const handleDownload = async (format: DownloadFormat) => {
    try {
      setIsDownloading(prev => ({ ...prev, [format]: true }));
      const fileName = formValues.fullName || 'Resume';
      
      switch (format) {
        case 'png':
          await downloadAsPNG('resume-preview', fileName);
          toast({ title: "Success!", description: "PNG resume downloaded successfully." });
          break;
          
        case 'pdf':
          await downloadAsPDF('resume-preview', fileName);
          toast({ title: "Success!", description: "PDF resume downloaded successfully." });
          break;
          
        case 'word':
          downloadAsWord(formValues, fileName);
          toast({ title: "Success!", description: "Word resume downloaded successfully." });
          break;
      }
    } catch (error) {
      console.error(`Error downloading ${format}:`, error);
      
      // Retry once after a delay
      try {
        if (format !== 'word') {  // Don't retry for Word as it doesn't use async
          toast({ title: "Retrying download...", description: "Please wait a moment." });
          await new Promise(resolve => setTimeout(resolve, 500));
          
          if (format === 'png') {
            await downloadAsPNG('resume-preview', formValues.fullName || 'Resume');
            toast({ title: "Success!", description: "PNG resume downloaded successfully." });
          } else if (format === 'pdf') {
            await downloadAsPDF('resume-preview', formValues.fullName || 'Resume');
            toast({ title: "Success!", description: "PDF resume downloaded successfully." });
          }
        } else {
          throw new Error("Retry failed");
        }
      } catch (retryError) {
        toast({
          title: "Download Failed",
          description: `Failed to download as ${format.toUpperCase()}. Please try again.`,
          variant: "destructive"
        });
      }
    } finally {
      setIsDownloading(prev => ({ ...prev, [format]: false }));
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
      <Button
        variant="outline"
        className="flex items-center gap-2 hover:bg-blue-100 hover:text-blue-700 dark:hover:bg-blue-900 dark:hover:text-blue-300"
        onClick={() => handleDownload('png')}
        disabled={isDownloading.png}
      >
        {isDownloading.png ? (
          <DownloadCloud className="h-4 w-4 animate-spin" />
        ) : (
          <FileImage className="h-4 w-4" />
        )}
        Download as PNG
      </Button>
      
      <Button
        variant="outline"
        className="flex items-center gap-2 hover:bg-red-100 hover:text-red-700 dark:hover:bg-red-900 dark:hover:text-red-300"
        onClick={() => handleDownload('pdf')}
        disabled={isDownloading.pdf}
      >
        {isDownloading.pdf ? (
          <DownloadCloud className="h-4 w-4 animate-spin" />
        ) : (
          <FileText className="h-4 w-4" />
        )}
        Download as PDF
      </Button>
      
      <Button
        variant="outline"
        className="flex items-center gap-2 hover:bg-green-100 hover:text-green-700 dark:hover:bg-green-900 dark:hover:text-green-300"
        onClick={() => handleDownload('word')}
        disabled={isDownloading.word}
      >
        {isDownloading.word ? (
          <DownloadCloud className="h-4 w-4 animate-spin" />
        ) : (
          <FileType2 className="h-4 w-4" />
        )}
        Download as Word
      </Button>
    </div>
  );
};
