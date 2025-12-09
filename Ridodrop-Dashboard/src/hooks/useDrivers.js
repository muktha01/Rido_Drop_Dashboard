import { useState, useEffect, useCallback } from 'react';
import driverApi from '../api/driverApi';

// Custom hook for driver management
export const useDrivers = (initialFilters = {}) => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    pages: 0
  });

  // Fetch drivers with filters
  const fetchDrivers = useCallback(
    async (filters = {}) => {
      setLoading(true);
      setError(null);
      try {
        console.log('🔄 Fetching drivers with filters:', { ...initialFilters, ...filters });

        const response = await driverApi.getAllDrivers({
          ...initialFilters,
          ...filters,
          page: filters.page || pagination.page,
          limit: filters.limit || pagination.limit
        });

        console.log('📦 Raw driver response:', response);

        // Transform the driver data
        const transformedDrivers = response.users?.map((driver, index) => driverApi.transformDriverData(driver, index + 1)) || [];

        console.log('✨ Transformed drivers:', transformedDrivers);

        setDrivers(transformedDrivers);

        if (response.pagination) {
          setPagination(response.pagination);
        }
      } catch (err) {
        const errorMessage = err.message || 'Failed to fetch drivers';
        setError(errorMessage);
        console.error('❌ Fetch drivers error:', err);

        // Set empty array on error to prevent UI breaking
        setDrivers([]);
      } finally {
        setLoading(false);
      }
    },
    [initialFilters, pagination.page, pagination.limit]
  );

  // Get driver by ID
  const getDriverById = useCallback(async (driverId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await driverApi.getDriverById(driverId);
      const transformedDriver = driverApi.transformDriverData(response);
      return transformedDriver;
    } catch (err) {
      setError(err.message || 'Failed to fetch driver');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get driver by phone
  const getDriverByPhone = useCallback(async (phone) => {
    setLoading(true);
    setError(null);
    try {
      const response = await driverApi.getDriverByPhone(phone);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to fetch driver by phone');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create driver
  const createDriver = useCallback(
    async (driverData) => {
      setLoading(true);
      setError(null);
      try {
        const response = await driverApi.createDriver(driverData);
        await fetchDrivers(); // Refresh the list
        return response;
      } catch (err) {
        setError(err.message || 'Failed to create driver');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchDrivers]
  );

  // Update driver
  const updateDriver = useCallback(
    async (driverId, updateData) => {
      setLoading(true);
      setError(null);
      try {
        const response = await driverApi.updateDriver(driverId, updateData);
        await fetchDrivers(); // Refresh the list
        return response;
      } catch (err) {
        setError(err.message || 'Failed to update driver');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchDrivers]
  );

  // Delete driver
  const deleteDriver = useCallback(
    async (driverId) => {
      setLoading(true);
      setError(null);
      try {
        await driverApi.deleteDriver(driverId);
        await fetchDrivers(); // Refresh the list
      } catch (err) {
        setError(err.message || 'Failed to delete driver');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchDrivers]
  );

  // Block driver
  const blockDriver = useCallback(
    async (driverId, reason = '') => {
      setLoading(true);
      setError(null);
      try {
        await driverApi.blockDriver(driverId, reason);
        await fetchDrivers(); // Refresh the list
      } catch (err) {
        setError(err.message || 'Failed to block driver');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchDrivers]
  );

  // Unblock driver
  const unblockDriver = useCallback(
    async (driverId) => {
      setLoading(true);
      setError(null);
      try {
        await driverApi.unblockDriver(driverId);
        await fetchDrivers(); // Refresh the list
      } catch (err) {
        setError(err.message || 'Failed to unblock driver');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchDrivers]
  );

  // Get driver orders
  const getDriverOrders = useCallback(async (driverId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await driverApi.getDriverOrders(driverId);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to fetch driver orders');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Search drivers
  const searchDrivers = useCallback(
    async (searchTerm) => {
      await fetchDrivers({ search: searchTerm, page: 1 });
    },
    [fetchDrivers]
  );

  // Filter drivers
  const filterDrivers = useCallback(
    async (filters) => {
      await fetchDrivers({ ...filters, page: 1 });
    },
    [fetchDrivers]
  );

  // Change page
  const changePage = useCallback(
    (newPage) => {
      setPagination((prev) => ({ ...prev, page: newPage }));
      fetchDrivers({ page: newPage });
    },
    [fetchDrivers]
  );

  // Refresh drivers
  const refreshDrivers = useCallback(() => {
    fetchDrivers();
  }, [fetchDrivers]);

  // Get driver statistics
  const getDriverStats = useCallback(() => {
    if (!drivers.length) {
      return {
        total: 0,
        active: 0,
        pending: 0,
        approved: 0,
        blocked: 0,
        online: 0
      };
    }

    return {
      total: drivers.length,
      active: drivers.filter((driver) => driver.status === 'Active').length,
      pending: drivers.filter((driver) => driver.status === 'Pending').length,
      approved: drivers.filter((driver) => driver.status === 'Approved').length,
      blocked: drivers.filter((driver) => driver.status === 'Blocked').length,
      online: drivers.filter((driver) => driver.online === true).length
    };
  }, [drivers]);

  // Initial load
  useEffect(() => {
    fetchDrivers();
  }, []);

  return {
    drivers,
    loading,
    error,
    pagination,
    stats: getDriverStats(),
    actions: {
      fetchDrivers,
      getDriverById,
      getDriverByPhone,
      getDriverOrders,
      createDriver,
      updateDriver,
      deleteDriver,
      blockDriver,
      unblockDriver,
      searchDrivers,
      filterDrivers,
      changePage,
      refreshDrivers,
      clearError: () => setError(null)
    }
  };
};

export default useDrivers;
