
/**
 * Formats a date string into a more readable format
 * @param dateString - ISO date string
 * @returns Formatted date (e.g., "Jan 2023")
 */
export const getFormattedDate = (dateString: string): string => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString; // Return original string if parsing fails
  }
};

/**
 * Formats a salary value with a currency symbol
 * @param salary - Salary value as string or number
 * @param currency - Currency code (INR, USD, EUR)
 * @returns Formatted salary string with symbol
 */
export const formatSalary = (salary: string | number, currency: string = 'USD'): string => {
  if (!salary) return '';
  
  const symbols: Record<string, string> = {
    INR: '₹',
    USD: '$',
    EUR: '€'
  };
  
  const symbol = symbols[currency] || '$';
  
  // Try to parse and format the number
  try {
    const numericValue = typeof salary === 'string' ? parseFloat(salary) : salary;
    
    if (isNaN(numericValue)) return `${symbol}${salary}`;
    
    // Format with commas
    return `${symbol}${numericValue.toLocaleString('en-US')}`;
  } catch (error) {
    // If something goes wrong, just concatenate the symbol
    return `${symbol}${salary}`;
  }
};
