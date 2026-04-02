import { tourService } from "@/services/tour-service";
import type { TourFilters, TourPackage } from "@/types/tour";
import { useCallback, useEffect, useState } from "react";

interface UseToursOptions {
  autoFetch?: boolean;
  filters?: TourFilters;
  page?: number;
  limit?: number;
}

export const useTours = (options: UseToursOptions = {}) => {
  const { autoFetch = true, filters, page = 1, limit = 20 } = options;

  const [tours, setTours] = useState<TourPackage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchTours = useCallback(
    async (pageNum: number = page) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await tourService.getTours(filters, {
          page: pageNum,
          limit,
        });

        setTours((prev) =>
          pageNum === 1 ? response.data : [...prev, ...response.data],
        );

        setHasMore(response.pagination.page < response.pagination.totalPages);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch tours");
      } finally {
        setIsLoading(false);
      }
    },
    [filters, page, limit],
  );

  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      const nextPage = Math.floor(tours.length / limit) + 1;
      fetchTours(nextPage);
    }
  }, [tours.length, isLoading, hasMore, limit, fetchTours]);

  const refresh = useCallback(() => {
    fetchTours(1);
  }, [fetchTours]);

  useEffect(() => {
    if (autoFetch) {
      fetchTours();
    }
  }, [autoFetch, fetchTours]);

  return {
    tours,
    isLoading,
    error,
    hasMore,
    refresh,
    loadMore,
  };
};

export const useTour = (id: string | null) => {
  const [tour, setTour] = useState<TourPackage | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTour = useCallback(async () => {
    if (!id) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await tourService.getTourById(id);
      setTour(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch tour");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTour();
  }, [fetchTour]);

  return {
    tour,
    isLoading,
    error,
    refresh: fetchTour,
  };
};
