import { useCallback, useState } from "react";

interface UseSearchOptions<T> {
  searchFn: (query: string) => Promise<T[]>;
  minQueryLength?: number;
  debounceMs?: number;
}

export const useSearch = <T>({
  searchFn,
  minQueryLength = 2,
  debounceMs = 300,
}: UseSearchOptions<T>) => {
  const [results, setResults] = useState<T[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const search = useCallback(
    async (searchQuery: string) => {
      setQuery(searchQuery);

      // Clear results if query is too short
      if (searchQuery.length < minQueryLength) {
        setResults([]);
        setError(null);
        return;
      }

      setIsSearching(true);
      setError(null);

      try {
        const data = await searchFn(searchQuery);
        setResults(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Search failed");
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    },
    [searchFn, minQueryLength],
  );

  const clearSearch = useCallback(() => {
    setQuery("");
    setResults([]);
    setError(null);
  }, []);

  return {
    query,
    results,
    isSearching,
    error,
    search,
    clearSearch,
  };
};
