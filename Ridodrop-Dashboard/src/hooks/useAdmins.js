import { useState, useEffect, useCallback } from 'react';
import { adminApi } from '../api/adminApi';

// Custom hook for admin management
export const useAdmins = (initialFilters = {}) => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  });

  // Fetch admins with filters
  const fetchAdmins = useCallback(
    async (filters = {}) => {
      setLoading(true);
      setError(null);
      try {
        console.log('🔄 Fetching admins with filters:', { ...initialFilters, ...filters });

        const response = await adminApi.getAllAdmins({
          ...initialFilters,
          ...filters,
          page: filters.page || pagination.page,
          limit: filters.limit || pagination.limit
        });

        console.log('📦 Raw admin response:', response);

        setAdmins(response.admins || []);

        if (response.pagination) {
          setPagination(response.pagination);
        }
      } catch (err) {
        const errorMessage = err.message || 'Failed to fetch admins';
        setError(errorMessage);
        console.error('❌ Fetch admins error:', err);

        // Set empty array on error to prevent UI breaking
        setAdmins([]);
      } finally {
        setLoading(false);
      }
    },
    [initialFilters, pagination.page, pagination.limit]
  );

  // Get admin by ID
  const getAdminById = useCallback(async (adminId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminApi.getAdminById(adminId);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to fetch admin');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create admin
  const createAdmin = useCallback(
    async (adminData) => {
      setLoading(true);
      setError(null);
      try {
        const response = await adminApi.createAdmin(adminData);
        await fetchAdmins(); // Refresh the list
        return response;
      } catch (err) {
        setError(err.message || 'Failed to create admin');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchAdmins]
  );

  // Update admin
  const updateAdmin = useCallback(
    async (adminId, updateData) => {
      setLoading(true);
      setError(null);
      try {
        const response = await adminApi.updateAdmin(adminId, updateData);
        await fetchAdmins(); // Refresh the list
        return response;
      } catch (err) {
        setError(err.message || 'Failed to update admin');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchAdmins]
  );

  // Delete admin
  const deleteAdmin = useCallback(
    async (adminId) => {
      setLoading(true);
      setError(null);
      try {
        await adminApi.deleteAdmin(adminId);
        await fetchAdmins(); // Refresh the list
      } catch (err) {
        setError(err.message || 'Failed to delete admin');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchAdmins]
  );

  // Filter admins
  const filterAdmins = useCallback(
    async (filters) => {
      await fetchAdmins({ ...filters, page: 1 });
    },
    [fetchAdmins]
  );

  // Change page
  const changePage = useCallback(
    (newPage) => {
      setPagination((prev) => ({ ...prev, page: newPage }));
      fetchAdmins({ page: newPage });
    },
    [fetchAdmins]
  );

  // Refresh admins
  const refreshAdmins = useCallback(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  // Get admin statistics
  const getAdminStats = useCallback(() => {
    if (!admins.length) {
      return {
        total: 0,
        active: 0,
        suspended: 0,
        pending: 0,
        super_admin: 0,
        admin: 0,
        moderator: 0
      };
    }

    return {
      total: admins.length,
      active: admins.filter((admin) => admin.status === 'Active').length,
      suspended: admins.filter((admin) => admin.status === 'Suspended').length,
      pending: admins.filter((admin) => admin.status === 'Pending').length,
      super_admin: admins.filter((admin) => admin.role === 'super_admin').length,
      admin: admins.filter((admin) => admin.role === 'admin').length,
      moderator: admins.filter((admin) => admin.role === 'moderator').length
    };
  }, [admins]);

  // Initial load
  useEffect(() => {
    fetchAdmins();
  }, []);

  return {
    admins,
    loading,
    error,
    pagination,
    stats: getAdminStats(),
    actions: {
      fetchAdmins,
      getAdminById,
      createAdmin,
      updateAdmin,
      deleteAdmin,
      filterAdmins,
      changePage,
      refreshAdmins,
      clearError: () => setError(null)
    }
  };
};

export default useAdmins;
