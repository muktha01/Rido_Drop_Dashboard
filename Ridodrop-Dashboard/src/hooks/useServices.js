import { useState, useEffect, useCallback } from 'react';
import serviceApi from '../api/serviceApi';

// Custom hook for service management
export const useServices = (initialFilters = {}) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    pages: 0
  });

  // Fetch services with filters
  const fetchServices = useCallback(
    async (filters = {}) => {
      setLoading(true);
      setError(null);
      try {
        console.log('🔄 Fetching services with filters:', { ...initialFilters, ...filters });

        const response = await serviceApi.getAllServices({
          ...initialFilters,
          ...filters,
          page: filters.page || pagination.page,
          limit: filters.limit || pagination.limit
        });

        console.log('📦 Raw service response:', response);

        setServices(response.services || []);

        if (response.pagination) {
          setPagination(response.pagination);
        }
      } catch (err) {
        const errorMessage = err.message || 'Failed to fetch services';
        setError(errorMessage);
        console.error('❌ Fetch services error:', err);

        // Set empty array on error to prevent UI breaking
        setServices([]);
      } finally {
        setLoading(false);
      }
    },
    [initialFilters, pagination.page, pagination.limit]
  );

  // Get service by ID
  const getServiceById = useCallback(async (serviceId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await serviceApi.getServiceById(serviceId);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to fetch service');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create service
  const createService = useCallback(
    async (serviceData) => {
      setLoading(true);
      setError(null);
      try {
        const response = await serviceApi.createService(serviceData);
        await fetchServices(); // Refresh the list
        return response;
      } catch (err) {
        setError(err.message || 'Failed to create service');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchServices]
  );

  // Update service
  const updateService = useCallback(
    async (serviceId, updateData) => {
      setLoading(true);
      setError(null);
      try {
        const response = await serviceApi.updateService(serviceId, updateData);
        await fetchServices(); // Refresh the list
        return response;
      } catch (err) {
        setError(err.message || 'Failed to update service');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchServices]
  );

  // Delete service
  const deleteService = useCallback(
    async (serviceId) => {
      setLoading(true);
      setError(null);
      try {
        await serviceApi.deleteService(serviceId);
        await fetchServices(); // Refresh the list
      } catch (err) {
        setError(err.message || 'Failed to delete service');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchServices]
  );

  // Toggle service status
  const toggleServiceStatus = useCallback(
    async (serviceId) => {
      setLoading(true);
      setError(null);
      try {
        const response = await serviceApi.toggleServiceStatus(serviceId);
        await fetchServices(); // Refresh the list
        return response;
      } catch (err) {
        setError(err.message || 'Failed to toggle service status');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchServices]
  );

  // Get cities for service
  const getCitiesForService = useCallback(async (vehicleType, subType) => {
    setLoading(true);
    setError(null);
    try {
      const response = await serviceApi.getCitiesForService(vehicleType, subType);
      return response.cities || [];
    } catch (err) {
      setError(err.message || 'Failed to fetch cities');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Bulk create services
  const bulkCreateServices = useCallback(
    async (services) => {
      setLoading(true);
      setError(null);
      try {
        const response = await serviceApi.bulkCreateServices(services);
        await fetchServices(); // Refresh the list
        return response;
      } catch (err) {
        setError(err.message || 'Failed to bulk create services');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchServices]
  );

  // Filter services
  const filterServices = useCallback(
    async (filters) => {
      await fetchServices({ ...filters, page: 1 });
    },
    [fetchServices]
  );

  // Change page
  const changePage = useCallback(
    (newPage) => {
      setPagination((prev) => ({ ...prev, page: newPage }));
      fetchServices({ page: newPage });
    },
    [fetchServices]
  );

  // Refresh services
  const refreshServices = useCallback(() => {
    fetchServices();
  }, [fetchServices]);

  // Initial load
  useEffect(() => {
    fetchServices();
  }, []);

  return {
    services,
    loading,
    error,
    pagination,
    actions: {
      fetchServices,
      getServiceById,
      createService,
      updateService,
      deleteService,
      toggleServiceStatus,
      getCitiesForService,
      bulkCreateServices,
      filterServices,
      changePage,
      refreshServices,
      clearError: () => setError(null)
    }
  };
};

export default useServices;
