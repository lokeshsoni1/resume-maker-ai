
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

/**
 * Captures a DOM element as a high-quality PNG image
 * @param elementId - ID of the DOM element to capture
 * @param fileName - Name for the downloaded file
 */
export const downloadAsPNG = async (elementId: string, fileName: string = 'Resume'): Promise<void> => {
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
    link.download = `${fileName.trim() || 'Resume'}.png`;
    link.href = dataUrl;
    link.click();
    
    return Promise.resolve();
  } catch (error) {
    console.error('Error downloading PNG:', error);
    return Promise.reject(error);
  }
};

/**
 * Captures a DOM element and converts it to PDF
 * @param elementId - ID of the DOM element to capture
 * @param fileName - Name for the downloaded file
 */
export const downloadAsPDF = async (elementId: string, fileName: string = 'Resume'): Promise<void> => {
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

/**
 * Creates a simple Word document from resume data
 * @param resumeData - The resume data object
 * @param fileName - Name for the downloaded file
 */
export const downloadAsWord = (resumeData: any, fileName: string = 'Resume'): void => {
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
      <p>Email: clipsspreader001@gmail.com</p>`;
    
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
