import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { Search, X, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/i18n';
import { cn } from '@/lib/utils';

export default function GlobalSearch() {
  const [, setLocation] = useLocation();
  const { language } = useLanguage();
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut: Cmd/Ctrl + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setLocation(`/search?q=${encodeURIComponent(query.trim())}`);
      setIsFocused(false);
      inputRef.current?.blur();
    }
  };

  const handleClear = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  return (
    <form onSubmit={handleSearch} className="relative">
      <div className={cn(
        "relative transition-all duration-200",
        isFocused ? "w-80" : "w-64"
      )}>
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={language === 'me' ? 'Pretraži pakete... (⌘K)' : 'Search packages... (⌘K)'}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={cn(
            "pl-10 pr-10 transition-all duration-200",
            isFocused && "ring-2 ring-primary/20"
          )}
          data-testid="input-global-search"
        />
        {query && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleClear}
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
            data-testid="button-clear-search"
          >
            <X className="w-3 h-3" />
          </Button>
        )}
      </div>
      
      {/* Hidden submit button for accessibility */}
      <button type="submit" className="sr-only" aria-label="Search" />
    </form>
  );
}
