
import { useResume } from '@/contexts/ResumeContext';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CurrencySelectProps {
  label?: string;
  className?: string;
}

export function CurrencySelect({ label = "Currency", className = "" }: CurrencySelectProps) {
  const { formValues, setFormValues } = useResume();
  
  const handleCurrencyChange = (value: string) => {
    setFormValues({
      ...formValues,
      workPreferences: {
        ...formValues.workPreferences,
        salaryCurrency: value
      }
    });
  };

  return (
    <div className={className}>
      {label && <Label htmlFor="currency-select" className="block mb-2">{label}</Label>}
      
      <Select
        value={formValues.workPreferences.salaryCurrency || 'USD'}
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
