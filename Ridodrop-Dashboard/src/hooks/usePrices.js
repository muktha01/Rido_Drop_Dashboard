import { useState, useEffect, useCallback } from 'react';
import priceApi from '../api/priceApi';

// Custom hook for price management
export const usePrices = (initialFilters = {}) => {
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    pages: 0
  });

  // Fetch prices with filters
  const fetchPrices = useCallback(
    async (filters = {}) => {
      setLoading(true);
      setError(null);
      try {
        console.log('🔄 Fetching prices with filters:', { ...initialFilters, ...filters });

        const response = await priceApi.getAllPrices({
          ...initialFilters,
          ...filters,
          page: filters.page || pagination.page,
          limit: filters.limit || pagination.limit
        });

        console.log('📦 Raw price response:', response);

        setPrices(response.prices || []);

        if (response.pagination) {
          setPagination(response.pagination);
        }
      } catch (err) {
        const errorMessage = err.message || 'Failed to fetch prices';
        setError(errorMessage);
        console.error('❌ Fetch prices error:', err);

        // Set empty array on error to prevent UI breaking
        setPrices([]);
      } finally {
        setLoading(false);
      }
    },
    [initialFilters, pagination.page, pagination.limit]
  );

  // Get price by ID
  const getPriceById = useCallback(async (priceId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await priceApi.getPriceById(priceId);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to fetch price');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create price
  const createPrice = useCallback(
    async (priceData) => {
      setLoading(true);
      setError(null);
      try {
        const response = await priceApi.createPrice(priceData);
        await fetchPrices(); // Refresh the list
        return response;
      } catch (err) {
        setError(err.message || 'Failed to create price');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchPrices]
  );

  // Update price
  const updatePrice = useCallback(
    async (priceId, updateData) => {
      setLoading(true);
      setError(null);
      try {
        const response = await priceApi.updatePrice(priceId, updateData);
        await fetchPrices(); // Refresh the list
        return response;
      } catch (err) {
        setError(err.message || 'Failed to update price');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchPrices]
  );

  // Delete price
  const deletePrice = useCallback(
    async (priceId) => {
      setLoading(true);
      setError(null);
      try {
        await priceApi.deletePrice(priceId);
        await fetchPrices(); // Refresh the list
      } catch (err) {
        setError(err.message || 'Failed to delete price');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchPrices]
  );

  // Bulk create prices
  const bulkCreatePrices = useCallback(
    async (prices) => {
      setLoading(true);
      setError(null);
      try {
        const response = await priceApi.bulkCreatePrices(prices);
        await fetchPrices(); // Refresh the list
        return response;
      } catch (err) {
        setError(err.message || 'Failed to bulk create prices');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchPrices]
  );

  // Filter prices
  const filterPrices = useCallback(
    async (filters) => {
      await fetchPrices({ ...filters, page: 1 });
    },
    [fetchPrices]
  );

  // Change page
  const changePage = useCallback(
    (newPage) => {
      setPagination((prev) => ({ ...prev, page: newPage }));
      fetchPrices({ page: newPage });
    },
    [fetchPrices]
  );

  // Refresh prices
  const refreshPrices = useCallback(() => {
    fetchPrices();
  }, [fetchPrices]);

  // Initial load
  useEffect(() => {
    fetchPrices();
  }, []);

  return {
    prices,
    loading,
    error,
    pagination,
    actions: {
      fetchPrices,
      getPriceById,
      createPrice,
      updatePrice,
      deletePrice,
      bulkCreatePrices,
      filterPrices,
      changePage,
      refreshPrices,
      clearError: () => setError(null)
    }
  };
};

export default usePrices;
