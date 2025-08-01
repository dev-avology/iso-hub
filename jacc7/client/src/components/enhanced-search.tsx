import { useState, useEffect, useRef } from 'react';
import { Search, FileText, Clock, Star } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface SearchResult {
  id: string;
  score: number;
  documentId: string;
  content: string;
  highlightedContent: string;
  metadata: {
    documentName: string;
    relevanceScore: number;
    semanticMatch: boolean;
    keywordMatches: string[];
    contextualInfo: string;
    chunkIndex: number;
    mimeType: string;
  };
}

interface EnhancedSearchProps {
  onResultSelect?: (result: SearchResult) => void;
  placeholder?: string;
  showSuggestions?: boolean;
}

export function EnhancedSearch({ 
  onResultSelect, 
  placeholder = "Search documents...",
  showSuggestions = true 
}: EnhancedSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchTimeout = useRef<NodeJS.Timeout>();
  const searchRef = useRef<HTMLDivElement>(null);

  // Auto-search with debouncing
  useEffect(() => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    if (query.length > 2) {
      searchTimeout.current = setTimeout(() => {
        performSearch(query);
      }, 300);
    } else {
      setResults([]);
      setShowResults(false);
    }

    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, [query]);

  // Load suggestions when user types
  useEffect(() => {
    if (showSuggestions && query.length > 1) {
      loadSuggestions(query);
    }
  }, [query, showSuggestions]);

  // Click outside to close results
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const response = await fetch('/api/enhanced-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery })
      });

      if (response.ok) {
        const data = await response.json();
        setResults(data.results || []);
        setShowResults(true);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const loadSuggestions = async (searchQuery: string) => {
    try {
      const response = await fetch('/api/search-suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery })
      });

      if (response.ok) {
        const data = await response.json();
        setSuggestions(data.suggestions || []);
      }
    } catch (error) {
      console.error('Suggestions error:', error);
    }
  };

  const handleResultClick = (result: SearchResult) => {
    if (onResultSelect) {
      onResultSelect(result);
    }
    setShowResults(false);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    performSearch(suggestion);
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 pr-4"
        />
        {isSearching && (
          <div className="absolute right-3 top-3">
            <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full" />
          </div>
        )}
      </div>

      {/* Suggestions */}
      {showSuggestions && suggestions.length > 0 && query.length > 1 && !showResults && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-50 max-h-48 overflow-y-auto">
          <CardContent className="p-2">
            {suggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="ghost"
                className="w-full justify-start text-left h-auto p-2"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <Search className="h-3 w-3 mr-2 text-muted-foreground flex-shrink-0" />
                <span className="truncate">{suggestion}</span>
              </Button>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Search Results */}
      {showResults && results.length > 0 && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-50 max-h-96 overflow-y-auto">
          <CardContent className="p-2">
            <div className="text-sm text-muted-foreground mb-2 px-2">
              Found {results.length} result{results.length !== 1 ? 's' : ''}
            </div>
            {results.map((result) => (
              <div
                key={result.id}
                className="p-3 hover:bg-muted/50 rounded-lg cursor-pointer border-b border-border/50 last:border-b-0"
                onClick={() => handleResultClick(result)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-blue-600 flex-shrink-0" />
                    <span className="font-medium text-sm truncate">
                      {result.metadata.documentName}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-3 w-3 text-yellow-500" />
                    <span className="text-xs text-muted-foreground">
                      {Math.round(result.metadata.relevanceScore)}%
                    </span>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground mb-2">
                  {result.metadata.contextualInfo}
                </div>

                {result.metadata.keywordMatches.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {result.metadata.keywordMatches.slice(0, 3).map((match, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {match}
                      </Badge>
                    ))}
                    {result.metadata.keywordMatches.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{result.metadata.keywordMatches.length - 3} more
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* No Results */}
      {showResults && results.length === 0 && !isSearching && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-50">
          <CardContent className="p-4 text-center">
            <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              No documents found for "{query}"
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Try different keywords or check your spelling
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}