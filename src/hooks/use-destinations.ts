import { destinationService } from "@/services/destination-service";
import type { Destination } from "@/types/destination";
import { useCallback, useEffect, useState } from "react";

interface UseDestinationsOptions {
  autoFetch?: boolean;
  page?: number;
  limit?: number;
}

export const useDestinations = (options: UseDestinationsOptions = {}) => {
  const { autoFetch = true, page = 1, limit = 20 } = options;

  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchDestinations = useCallback(
    async (pageNum: number = page) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await destinationService.getDestinations(undefined, {
          page: pageNum,
          limit,
        });

        setDestinations((prev) =>
          pageNum === 1 ? response.data : [...prev, ...response.data],
        );

        setHasMore(response.pagination.page < response.pagination.totalPages);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch destinations",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [page, limit],
  );

  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      const nextPage = Math.floor(destinations.length / limit) + 1;
      fetchDestinations(nextPage);
    }
  }, [destinations.length, isLoading, hasMore, limit, fetchDestinations]);

  const refresh = useCallback(() => {
    fetchDestinations(1);
  }, [fetchDestinations]);

  useEffect(() => {
    if (autoFetch) {
      fetchDestinations();
    }
  }, [autoFetch, fetchDestinations]);

  return {
    destinations,
    isLoading,
    error,
    hasMore,
    refresh,
    loadMore,
  };
};

export const useDestination = (id: string | null) => {
  const [destination, setDestination] = useState<Destination | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDestination = useCallback(async () => {
    if (!id) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await destinationService.getDestinationById(id);
      setDestination(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch destination",
      );
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDestination();
  }, [fetchDestination]);

  return {
    destination,
    isLoading,
    error,
    refresh: fetchDestination,
  };
};
