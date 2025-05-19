
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useResume } from '@/contexts/ResumeContext';
import { DownloadCloud, FileImage, FileText, FileType2 } from 'lucide-react';
import { downloadAsWord, downloadAsPDF, downloadAsPNG } from '@/lib/download-utils';
import { toast } from '@/components/ui/use-toast';
import { DownloadFormat } from '@/types';

export const DownloadOptions = () => {
  const { formValues } = useResume();
  const [isDownloading, setIsDownloading] = useState<Record<DownloadFormat, boolean>>({
    png: false,
    pdf: false,
    word: false
  });

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
      toast({
        title: "Download Failed",
        description: `Failed to download as ${format.toUpperCase()}. Please try again.`,
        variant: "destructive"
      });
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
