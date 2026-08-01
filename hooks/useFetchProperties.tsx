import { useCallback, useEffect, useRef, useState } from 'react';

import { apiService, ApiError } from '@/services/apiService';
import type { Property } from '@/types/property';
import { useNetworkStatus } from './useNetworkStatus';

const DEFAULT_PAGE_SIZE = 20;
/** Screens that need the whole pool at once (map pins, "similar properties") request pages this large. */
const BULK_PAGE_SIZE = 100;

interface UseFetchPropertiesOptions {
  /** true (default): load one page at a time via loadMore(). false: fetch the whole pool in a single request. */
  paginate?: boolean;
  pageSize?: number;
}

export const useFetchProperties = (options: UseFetchPropertiesOptions = {}) => {
  const { paginate = true } = options;
  const pageSize = options.pageSize ?? (paginate ? DEFAULT_PAGE_SIZE : BULK_PAGE_SIZE);
  const { isOnline } = useNetworkStatus();

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const requestId = useRef(0);

  const fetchPage = useCallback(
    async (targetPage: number, append: boolean) => {
      const thisRequest = ++requestId.current;
      if (append) setLoadingMore(true);
      else setLoading(true);
      setError(null);

      try {
        if (!isOnline) throw new ApiError('No internet connection.', 0, 'OFFLINE');
        const result = await apiService.listProperties(targetPage, pageSize);
        if (thisRequest !== requestId.current) return; // superseded by a newer request

        setProperties(prev => (append ? [...prev, ...result.data] : result.data));
        setTotalPages(result.totalPages);
        setPage(targetPage);
      } catch (err) {
        if (thisRequest !== requestId.current) return;
        setError(err instanceof ApiError ? err.message : 'Failed to load properties.');
      } finally {
        if (thisRequest === requestId.current) {
          setLoading(false);
          setLoadingMore(false);
        }
      }
    },
    [isOnline, pageSize]
  );

  // paginate:false callers expect the ENTIRE pool back, not just one page's
  // worth. That used to be a single request sized to BULK_PAGE_SIZE, which
  // silently truncated results once real user-posted listings (Task 10)
  // pushed the total past the mock pool's fixed 100 — so this loops pages
  // until totalPages says there's nothing left, however many that takes.
  const fetchAll = useCallback(async () => {
    const thisRequest = ++requestId.current;
    setLoading(true);
    setError(null);

    try {
      if (!isOnline) throw new ApiError('No internet connection.', 0, 'OFFLINE');

      let all: Property[] = [];
      let currentPage = 1;
      let pages = 1;

      do {
        const result = await apiService.listProperties(currentPage, pageSize);
        if (thisRequest !== requestId.current) return;
        all = currentPage === 1 ? result.data : [...all, ...result.data];
        pages = result.totalPages;
        currentPage += 1;
      } while (currentPage <= pages);

      if (thisRequest !== requestId.current) return;
      setProperties(all);
      setTotalPages(pages);
      setPage(pages);
    } catch (err) {
      if (thisRequest !== requestId.current) return;
      setError(err instanceof ApiError ? err.message : 'Failed to load properties.');
    } finally {
      if (thisRequest === requestId.current) setLoading(false);
    }
  }, [isOnline, pageSize]);

  useEffect(() => {
    if (paginate) fetchPage(1, false);
    else fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginate, fetchPage, fetchAll]);

  const loadMore = useCallback(() => {
    if (paginate && !loading && !loadingMore && page < totalPages) {
      fetchPage(page + 1, true);
    }
  }, [paginate, loading, loadingMore, page, totalPages, fetchPage]);

  const refetch = useCallback(() => (paginate ? fetchPage(1, false) : fetchAll()), [paginate, fetchPage, fetchAll]);

  return {
    properties,
    loading,
    loadingMore,
    error,
    refetch,
    loadMore,
    hasMore: paginate && page < totalPages,
    isOfflineData: !isOnline,
  };
};

export const useFetchProperty = (id: number) => {
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProperty = useCallback(async () => {
    if (Number.isNaN(id)) {
      setProperty(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await apiService.getProperty(id);
      setProperty(result);
    } catch (err) {
      setProperty(null);
      setError(err instanceof ApiError ? err.message : 'Failed to load property.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProperty();
  }, [fetchProperty]);

  return { property, loading, error, refetch: fetchProperty };
};

/** Fetches specific properties by id (e.g. favorites) rather than relying on paginated browsing to have loaded them. */
export const useFetchPropertiesByIds = (ids: number[]) => {
  const idsKey = ids.join(',');
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (ids.length === 0) {
      setProperties([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    Promise.all(ids.map(id => apiService.getProperty(id).catch(() => null)))
      .then(results => {
        if (!cancelled) setProperties(results.filter((p): p is Property => p !== null));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- idsKey is the stable, comparable form of ids
  }, [idsKey]);

  return { properties, loading };
};
