
/**
 * Format a date string into a human-readable format (e.g., "Jan 2023")
 * @param date - Date string, Date object, or undefined
 * @returns Formatted date string or "Present" if undefined
 */
export const getFormattedDate = (date: string | undefined): string => {
  if (!date) return 'Present';
  
  try {
    const d = new Date(date);
    
    // Check if date is valid
    if (isNaN(d.getTime())) {
      return 'Invalid Date';
    }
    
    return d.toLocaleDateString('en-US', { 
      month: 'short', 
      year: 'numeric' 
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
};
