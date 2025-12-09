import { useState, useEffect, useCallback } from 'react';
import customerApi from '../api/customerApi';

// Custom hook for customer management
export const useCustomers = (initialFilters = {}) => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  });

  // Fetch customers with filters
  const fetchCustomers = useCallback(
    async (filters = {}) => {
      setLoading(true);
      setError(null);
      try {
        const response = await customerApi.getAllCustomers({
          ...initialFilters,
          ...filters,
          page: filters.page || pagination.page,
          limit: filters.limit || pagination.limit
        });

        setCustomers(response.users || []);
        if (response.pagination) {
          setPagination(response.pagination);
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch customers');
        console.error('Fetch customers error:', err);
      } finally {
        setLoading(false);
      }
    },
    [initialFilters, pagination.page, pagination.limit]
  );

  // Create customer
  const createCustomer = useCallback(
    async (customerData) => {
      setLoading(true);
      setError(null);
      try {
        const response = await customerApi.createCustomer(customerData);
        await fetchCustomers(); // Refresh the list
        return response;
      } catch (err) {
        setError(err.message || 'Failed to create customer');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchCustomers]
  );

  // Update customer
  const updateCustomer = useCallback(
    async (customerId, updateData) => {
      setLoading(true);
      setError(null);
      try {
        const response = await customerApi.updateCustomer(customerId, updateData);
        await fetchCustomers(); // Refresh the list
        return response;
      } catch (err) {
        setError(err.message || 'Failed to update customer');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchCustomers]
  );

  // Delete customer
  const deleteCustomer = useCallback(
    async (customerId) => {
      setLoading(true);
      setError(null);
      try {
        await customerApi.deleteCustomer(customerId);
        await fetchCustomers(); // Refresh the list
      } catch (err) {
        setError(err.message || 'Failed to delete customer');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchCustomers]
  );

  // Block customer
  const blockCustomer = useCallback(
    async (customerId) => {
      setLoading(true);
      setError(null);
      try {
        await customerApi.blockCustomer(customerId);
        await fetchCustomers(); // Refresh the list
      } catch (err) {
        setError(err.message || 'Failed to block customer');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchCustomers]
  );

  // Unblock customer
  const unblockCustomer = useCallback(
    async (customerId) => {
      setLoading(true);
      setError(null);
      try {
        await customerApi.unblockCustomer(customerId);
        await fetchCustomers(); // Refresh the list
      } catch (err) {
        setError(err.message || 'Failed to unblock customer');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchCustomers]
  );

  // Search customers
  const searchCustomers = useCallback(
    async (searchTerm) => {
      await fetchCustomers({ search: searchTerm, page: 1 });
    },
    [fetchCustomers]
  );

  // Filter customers
  const filterCustomers = useCallback(
    async (filters) => {
      await fetchCustomers({ ...filters, page: 1 });
    },
    [fetchCustomers]
  );

  // Change page
  const changePage = useCallback(
    (newPage) => {
      setPagination((prev) => ({ ...prev, page: newPage }));
      fetchCustomers({ page: newPage });
    },
    [fetchCustomers]
  );

  // Initial load
  useEffect(() => {
    fetchCustomers();
  }, []);

  return {
    customers,
    loading,
    error,
    pagination,
    actions: {
      fetchCustomers,
      createCustomer,
      updateCustomer,
      deleteCustomer,
      blockCustomer,
      unblockCustomer,
      searchCustomers,
      filterCustomers,
      changePage,
      clearError: () => setError(null)
    }
  };
};
