import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

interface FilterControlsProps {
  minPrice: number | undefined;
  maxPrice: number | undefined;
  search: string;
  sortBy: string;
  sortOrder: string;
  onMinPriceChange: (value: number | undefined) => void;
  onMaxPriceChange: (value: number | undefined) => void;
  onSearchChange: (value: string) => void;
  onSortChange: (sortBy: string, sortOrder: string) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export default function FilterControls({
  minPrice,
  maxPrice,
  search,
  sortBy,
  sortOrder,
  onMinPriceChange,
  onMaxPriceChange,
  onSearchChange,
  onSortChange,
  onClearFilters,
  hasActiveFilters,
}: FilterControlsProps) {
  const { language } = useLanguage();

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '') {
      onMinPriceChange(undefined);
    } else {
      const parsed = parseFloat(value);
      onMinPriceChange(isFinite(parsed) ? parsed : undefined);
    }
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '') {
      onMaxPriceChange(undefined);
    } else {
      const parsed = parseFloat(value);
      onMaxPriceChange(isFinite(parsed) ? parsed : undefined);
    }
  };

  const sortOptions = [
    { value: 'createdAt-desc', labelME: 'Najnovije prvo', labelEN: 'Newest first' },
    { value: 'price-asc', labelME: 'Cena: Najniža', labelEN: 'Price: Low to High' },
    { value: 'price-desc', labelME: 'Cena: Najviša', labelEN: 'Price: High to Low' },
    { value: 'name-asc', labelME: 'Ime: A-Z', labelEN: 'Name: A-Z' },
    { value: 'name-desc', labelME: 'Ime: Z-A', labelEN: 'Name: Z-A' },
  ];

  return (
    <div className="bg-card border border-border/40 rounded-lg p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-lg">
            {language === 'me' ? 'Filteri i Sortiranje' : 'Filters & Sorting'}
          </h3>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-xs"
            data-testid="button-clear-filters"
          >
            <X className="w-3 h-3 mr-1" />
            {language === 'me' ? 'Očisti' : 'Clear'}
          </Button>
        )}
      </div>

      {/* Search */}
      <div className="space-y-2">
        <Label htmlFor="search" className="text-sm font-medium">
          {language === 'me' ? 'Pretraži pakete' : 'Search packages'}
        </Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            id="search"
            type="text"
            placeholder={language === 'me' ? 'Unesite naziv paketa...' : 'Enter package name...'}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
            data-testid="input-search"
          />
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">
          {language === 'me' ? 'Cena (€)' : 'Price (€)'}
        </Label>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label htmlFor="min-price" className="text-xs text-muted-foreground">
              {language === 'me' ? 'Min' : 'Min'}
            </Label>
            <Input
              id="min-price"
              type="number"
              min="0"
              placeholder="0"
              value={minPrice ?? ''}
              onChange={handleMinPriceChange}
              data-testid="input-min-price"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="max-price" className="text-xs text-muted-foreground">
              {language === 'me' ? 'Max' : 'Max'}
            </Label>
            <Input
              id="max-price"
              type="number"
              min="0"
              placeholder="500"
              value={maxPrice ?? ''}
              onChange={handleMaxPriceChange}
              data-testid="input-max-price"
            />
          </div>
        </div>
      </div>

      {/* Sort */}
      <div className="space-y-2">
        <Label htmlFor="sort" className="text-sm font-medium">
          {language === 'me' ? 'Sortiraj po' : 'Sort by'}
        </Label>
        <Select
          value={`${sortBy}-${sortOrder}`}
          onValueChange={(value) => {
            const [newSortBy, newSortOrder] = value.split('-');
            onSortChange(newSortBy, newSortOrder);
          }}
        >
          <SelectTrigger id="sort" data-testid="select-sort">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value} data-testid={`option-sort-${option.value}`}>
                {language === 'me' ? option.labelME : option.labelEN}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
