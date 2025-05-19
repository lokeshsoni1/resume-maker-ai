
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CurrencyOption } from "@/types";
import { Label } from "@/components/ui/label";

interface CurrencySelectProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  className?: string;
}

export const CurrencySelect = ({ value, onChange, label, className }: CurrencySelectProps) => {
  const currencies: CurrencyOption[] = [
    { code: "INR", symbol: "₹", label: "₹ (INR)" },
    { code: "USD", symbol: "$", label: "$ (USD)" },
    { code: "EUR", symbol: "€", label: "€ (EUR)" }
  ];

  return (
    <div className={className}>
      {label && <Label htmlFor="currency-select">{label}</Label>}
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id="currency-select" aria-label="Select currency">
          <SelectValue placeholder="Select currency" />
        </SelectTrigger>
        <SelectContent>
          {currencies.map((currency) => (
            <SelectItem key={currency.code} value={currency.code}>
              {currency.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
