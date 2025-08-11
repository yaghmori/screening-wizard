'use client';

import React, { useContext, useState, useMemo } from 'react';
import { Check, ChevronsUpDown, Trash2 } from 'lucide-react';
import { 
  Button, 
  Input, 
  Label, 
  Textarea, 
  RadioGroup, 
  RadioGroupItem, 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue, 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
  cn
} from '@/components/ui';
import { I18nContext } from '../contexts/I18nContext';

// ===== Helper Components =====
export function Section({ title, children, description }: { title: string; children: React.ReactNode; description?: string }) {
  const { t } = useContext(I18nContext);
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t(title)}</CardTitle>
        {description && <CardDescription>{t(description)}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">{children}</div>
      </CardContent>
    </Card>
  );
}

export function Row({ label, children, hint, error }: { label: string; children: React.ReactNode; hint?: string; error?: boolean }) {
  const { t } = useContext(I18nContext);
  return (
    <div className="grid gap-2">
      <Label className={cn(error && "text-destructive")}>{t(label)}</Label>
      {children}
      {hint && <p className="text-sm text-muted-foreground">{t(hint)}</p>}
    </div>
  );
}

export function YesNo({ value, onChange, name, disabled }: { value: boolean | null; onChange: (v: boolean) => void; name: string; disabled?: boolean }) {
  const { t } = useContext(I18nContext);
  return (
    <RadioGroup 
      value={value === null ? '' : value.toString()} 
      onValueChange={(v) => onChange(v === 'true')}
      disabled={disabled}
    >
      <div className="flex gap-6">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="true" id={`${name}-yes`} />
          <Label htmlFor={`${name}-yes`}>{t('Yes')}</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="false" id={`${name}-no`} />
          <Label htmlFor={`${name}-no`}>{t('No')}</Label>
        </div>
      </div>
    </RadioGroup>
  );
}

export function EnumSelect({ enumType, value, onChange, placeholder, disabled }: { 
  enumType: string; 
  value: string | null; 
  onChange: (v: string | null) => void; 
  placeholder?: string; 
  disabled?: boolean 
}) {
  const { enums, t } = useContext(I18nContext);
  const options = useMemo(() => {
    const map = enums[enumType] || {};
    return Object.keys(map).map(k => ({ value: k, label: map[k] }));
  }, [enumType, enums]);

  return (
    <Select value={value ?? ''} onValueChange={(v) => onChange(v || null)} disabled={disabled}>
      <SelectTrigger>
        <SelectValue placeholder={t(placeholder ?? 'Select')} />
      </SelectTrigger>
      <SelectContent>
        {options.map(o => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

// ===== Custom MultiSelect Component =====
interface MultiSelectProps {
  enumType: string;
  values: (string | null)[];
  onChange: (values: (string | null)[]) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function MultiSelect({ enumType, values, onChange, placeholder, disabled }: MultiSelectProps) {
  const { enums, t } = useContext(I18nContext);
  const [open, setOpen] = useState(false);
  const options = useMemo(() => {
    const map = enums[enumType] || {};
    return Object.keys(map).map(k => ({ value: k, label: map[k] }));
  }, [enumType, enums]);

  const selectedValues = values.filter(Boolean) as string[];

  const handleSelect = (value: string) => {
    const newValues = selectedValues.includes(value)
      ? selectedValues.filter(v => v !== value)
      : [...selectedValues, value];
    onChange(newValues);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled}
        >
          <span className="truncate">
            {selectedValues.length > 0
              ? t('{count} selected', { count: selectedValues.length })
              : t(placeholder || 'Select items...')}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder={t('Search...')} />
          <CommandEmpty>{t('No results found')}</CommandEmpty>
          <CommandGroup className="max-h-64 overflow-auto">
            {options.map((option) => (
              <CommandItem
                key={option.value}
                onSelect={() => handleSelect(option.value)}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedValues.includes(option.value) ? "opacity-100" : "opacity-0"
                  )}
                />
                {option.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
