
import { useResume } from '@/contexts/ResumeContext';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Icons } from '@/components/ui/icons';

interface CurrencySelectProps {
  label?: string;
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export function CurrencySelect({ 
  label = "Currency", 
  className = "",
  value,
  onChange
}: CurrencySelectProps) {
  const { formValues, setFormValues } = useResume();
  
  const handleCurrencyChange = (newValue: string) => {
    if (onChange) {
      onChange(newValue);
    } else {
      setFormValues({
        ...formValues,
        workPreferences: {
          ...formValues.workPreferences,
          salaryCurrency: newValue
        }
      });
    }
  };

  const currentValue = value || formValues.workPreferences.salaryCurrency || 'USD';

  // Helper function to get the currency icon
  const getCurrencyIcon = (currency: string) => {
    switch (currency) {
      case 'USD':
        return <Icons.dollarSign className="h-4 w-4" />;
      case 'EUR':
        return <Icons.euro className="h-4 w-4" />;
      case 'INR':
        return <Icons.indianRupee className="h-4 w-4" />;
      default:
        return <Icons.currencyIcon className="h-4 w-4" />;
    }
  };

  return (
    <div className={className}>
      {label && <Label htmlFor="currency-select" className="block mb-2">{label}</Label>}
      
      <Select
        value={currentValue}
        onValueChange={handleCurrencyChange}
      >
        <SelectTrigger id="currency-select" className="w-full">
          <SelectValue placeholder="Select currency" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="USD">
            <div className="flex items-center gap-2">
              <Icons.dollarSign className="h-4 w-4" />
              <span>$ (USD)</span>
            </div>
          </SelectItem>
          <SelectItem value="EUR">
            <div className="flex items-center gap-2">
              <Icons.euro className="h-4 w-4" />
              <span>€ (EUR)</span>
            </div>
          </SelectItem>
          <SelectItem value="INR">
            <div className="flex items-center gap-2">
              <Icons.indianRupee className="h-4 w-4" />
              <span>₹ (INR)</span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
      
      <p className="text-xs text-muted-foreground mt-1">
        Select the currency for your salary expectation
      </p>
    </div>
  );
}
