
/**
 * Format a date string into a human-readable format (e.g., "Jan 2023")
 * @param date - Date string, Date object, or undefined
 * @returns Formatted date string or "Present" if undefined
 */
export const getFormattedDate = (date: string | Date | undefined): string => {
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

/**
 * Format a salary with the appropriate currency symbol
 * @param amount - Salary amount as string or number
 * @param currency - Currency code (INR, USD, EUR)
 * @returns Formatted salary with currency symbol
 */
export const formatSalary = (amount: string | number, currency: string = 'USD'): string => {
  const symbols: Record<string, string> = { 
    INR: '₹', 
    USD: '$', 
    EUR: '€' 
  };
  
  return `${symbols[currency] || symbols.USD} ${amount}`;
};
