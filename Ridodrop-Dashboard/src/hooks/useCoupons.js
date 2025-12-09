import { useState, useEffect, useCallback } from 'react';
import couponApi from '../api/couponApi';

// Custom hook for coupon management
export const useCoupons = (initialFilters = {}) => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    pages: 0
  });
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    expired: 0,
    inactive: 0
  });

  // Fetch coupons with filters
  const fetchCoupons = useCallback(
    async (filters = {}) => {
      setLoading(true);
      setError(null);
      try {
        console.log('🔄 Fetching coupons with filters:', { ...initialFilters, ...filters });

        const response = await couponApi.getAllCoupons({
          ...initialFilters,
          ...filters
        });

        console.log('📦 Raw coupon response:', response);

        setCoupons(response.coupons || []);

        if (response.pagination) {
          setPagination(response.pagination);
        }
      } catch (err) {
        const errorMessage = err.message || 'Failed to fetch coupons';
        setError(errorMessage);
        console.error('❌ Fetch coupons error:', err);

        // Set empty array on error to prevent UI breaking
        setCoupons([]);
      } finally {
        setLoading(false);
      }
    },
    [initialFilters]
  );

  // Fetch coupon statistics
  const fetchStats = useCallback(async () => {
    try {
      const statsData = await couponApi.getCouponStats();
      setStats(statsData);
    } catch (err) {
      console.error('❌ Fetch coupon stats error:', err);
    }
  }, []);

  // Get coupon by ID
  const getCouponById = useCallback(async (couponId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await couponApi.getCouponById(couponId);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to fetch coupon');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get coupon by code
  const getCouponByCode = useCallback(async (couponCode) => {
    setLoading(true);
    setError(null);
    try {
      const response = await couponApi.getCouponByCode(couponCode);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to fetch coupon');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create coupon
  const createCoupon = useCallback(
    async (couponData) => {
      setLoading(true);
      setError(null);
      try {
        const response = await couponApi.createCoupon(couponData);
        await fetchCoupons(); // Refresh the list
        await fetchStats(); // Refresh stats
        return response;
      } catch (err) {
        setError(err.message || 'Failed to create coupon');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchCoupons, fetchStats]
  );

  // Update coupon
  const updateCoupon = useCallback(
    async (couponId, updateData) => {
      setLoading(true);
      setError(null);
      try {
        const response = await couponApi.updateCoupon(couponId, updateData);
        await fetchCoupons(); // Refresh the list
        await fetchStats(); // Refresh stats
        return response;
      } catch (err) {
        setError(err.message || 'Failed to update coupon');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchCoupons, fetchStats]
  );

  // Delete coupon
  const deleteCoupon = useCallback(
    async (couponId) => {
      setLoading(true);
      setError(null);
      try {
        await couponApi.deleteCoupon(couponId);
        await fetchCoupons(); // Refresh the list
        await fetchStats(); // Refresh stats
      } catch (err) {
        setError(err.message || 'Failed to delete coupon');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchCoupons, fetchStats]
  );

  // Apply coupon
  const applyCoupon = useCallback(
    async (couponCode, applicationData) => {
      setLoading(true);
      setError(null);
      try {
        const response = await couponApi.applyCoupon(couponCode, applicationData);
        await fetchCoupons(); // Refresh the list to update usage count
        return response;
      } catch (err) {
        setError(err.message || 'Failed to apply coupon');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchCoupons]
  );

  // Filter coupons
  const filterCoupons = useCallback(
    async (filters) => {
      await fetchCoupons({ ...filters, page: 1 });
    },
    [fetchCoupons]
  );

  // Search coupons
  const searchCoupons = useCallback(
    async (searchTerm) => {
      await fetchCoupons({ search: searchTerm, page: 1 });
    },
    [fetchCoupons]
  );

  // Change page
  const changePage = useCallback(
    (newPage) => {
      fetchCoupons({ page: newPage });
    },
    [fetchCoupons]
  );

  // Refresh coupons
  const refreshCoupons = useCallback(() => {
    fetchCoupons();
    // Temporarily disabled to check performance
    // fetchStats();
  }, [fetchCoupons]);

  // Initial load
  useEffect(() => {
    fetchCoupons();
    // Temporarily disabled to check performance
    // fetchStats();
  }, []);

  return {
    coupons,
    loading,
    error,
    pagination,
    stats,
    actions: {
      fetchCoupons,
      fetchStats,
      getCouponById,
      getCouponByCode,
      createCoupon,
      updateCoupon,
      deleteCoupon,
      applyCoupon,
      filterCoupons,
      searchCoupons,
      changePage,
      refreshCoupons,
      clearError: () => setError(null)
    }
  };
};

export default useCoupons;
