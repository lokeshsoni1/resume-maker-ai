
import { useResume } from '@/contexts/ResumeContext';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
          <SelectItem value="USD">$ (USD)</SelectItem>
          <SelectItem value="EUR">€ (EUR)</SelectItem>
          <SelectItem value="INR">₹ (INR)</SelectItem>
        </SelectContent>
      </Select>
      
      <p className="text-xs text-muted-foreground mt-1">
        Select the currency for your salary expectation
      </p>
    </div>
  );
}
