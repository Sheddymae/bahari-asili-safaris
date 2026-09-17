'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Check, ChevronDown, Search } from 'lucide-react';
import { isCountry, searchCountries, type Country } from '@/lib/countries';

interface NationalitySelectProps {
  value: string;
  onChange: (country: Country) => void;
  label?: string;
  required?: boolean;
  error?: boolean;
  errorMessage?: string;
  placeholder?: string;
  helperText?: string;
  id?: string;
  className?: string;
}

export default function NationalitySelect({ value, onChange, label = 'Nationality', required = false, error = false, errorMessage, placeholder = 'Type country name or code (e.g. KE or IT)', helperText = 'Start typing a country name or ISO code, then select your country.', id, className = '' }: NationalitySelectProps) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const listId = `${inputId}-options`;
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const results = useMemo(() => searchCountries(query), [query]);

  useEffect(() => { setQuery(value); }, [value]);
  useEffect(() => {
    if (!open) return;
    const handleOutside = (event: MouseEvent) => { if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [open]);
  useEffect(() => { setHighlightedIndex(0); }, [query]);

  const selectCountry = (country: Country) => { setQuery(country); onChange(country); setOpen(false); };
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') { event.preventDefault(); setOpen(true); setHighlightedIndex((index) => Math.min(index + 1, Math.max(0, results.length - 1))); }
    else if (event.key === 'ArrowUp') { event.preventDefault(); setOpen(true); setHighlightedIndex((index) => Math.max(index - 1, 0)); }
    else if (event.key === 'Enter' && open && results[highlightedIndex]) { event.preventDefault(); selectCountry(results[highlightedIndex].name); }
    else if (event.key === 'Escape') setOpen(false);
  };

  const inputInvalid = error || (!!value && !isCountry(value));
  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      {label && <label htmlFor={inputId} className="block font-inter text-sm font-medium text-foreground">{label} {required && <span className="text-red-600">*</span>}</label>}
      <div className="relative mt-1.5">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input id={inputId} value={query} required={required} autoComplete="off" role="combobox" aria-autocomplete="list" aria-expanded={open} aria-controls={listId} aria-invalid={inputInvalid} onFocus={() => setOpen(true)} onChange={(event) => { setQuery(event.target.value); setOpen(true); }} onKeyDown={handleKeyDown} placeholder={placeholder} className={`w-full rounded-xl border bg-muted py-3 pl-11 pr-11 text-sm outline-none transition focus:ring-2 ${inputInvalid ? 'border-red-300 focus:border-red-500 focus:ring-red-100' : 'border-border focus:border-ocean-600 focus:ring-ocean-100'}`} />
        <ChevronDown className={`pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`} />
      </div>
      {open && <div id={listId} role="listbox" className="absolute left-0 right-0 top-full z-[80] mt-1 max-h-64 overflow-y-auto rounded-xl border border-border bg-white p-1 shadow-2xl">
        {results.length > 0 ? results.map((country, index) => <button key={country.code} type="button" role="option" aria-selected={value === country.name} onMouseDown={(event) => event.preventDefault()} onMouseEnter={() => setHighlightedIndex(index)} onClick={() => selectCountry(country.name)} className={`flex w-full items-center justify-between rounded-lg px-4 py-2.5 text-left font-inter text-sm transition-colors ${highlightedIndex === index ? 'bg-sand-50 text-ocean-700' : 'text-foreground hover:bg-sand-50 hover:text-ocean-700'}`}><span>{country.name}</span><span className="ml-3 flex items-center gap-2 text-xs text-muted-foreground"><span className="font-semibold tracking-wide">{country.code}</span>{value === country.name && <Check className="h-4 w-4 text-ocean-700" />}</span></button>) : <div className="px-4 py-3 font-inter text-sm text-muted-foreground">No country matches “{query}”. Try the country name or two-letter ISO code.</div>}
      </div>}
      {(errorMessage || helperText) && <p className={`mt-1.5 font-inter text-xs ${errorMessage ? 'text-red-700' : 'text-muted-foreground'}`}>{errorMessage || helperText}</p>}
      {value && isCountry(value) && <input type="hidden" name="nationality" value={value} readOnly />}
    </div>
  );
}
