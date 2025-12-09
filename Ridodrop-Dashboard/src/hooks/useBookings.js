import { useState, useEffect, useCallback } from 'react';
import bookingApi from '../api/bookingApi';

// Custom hook for booking management
export const useBookings = (initialFilters = {}) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  });

  // Fetch bookings with filters
  const fetchBookings = useCallback(
    async (filters = {}) => {
      setLoading(true);
      setError(null);
      try {
        console.log('🔄 Fetching bookings with filters:', { ...initialFilters, ...filters });

        const response = await bookingApi.getAllOrders({
          ...initialFilters,
          ...filters,
          page: filters.page || pagination.page,
          limit: filters.limit || pagination.limit
        });

        console.log('📦 Raw booking response:', response);

        // Transform the booking data
        const transformedBookings = response.bookings?.map((booking, index) => bookingApi.transformBookingData(booking, index + 1)) || [];

        console.log('✨ Transformed bookings:', transformedBookings);

        setBookings(transformedBookings);

        if (response.pagination) {
          setPagination(response.pagination);
        }
      } catch (err) {
        const errorMessage = err.message || 'Failed to fetch bookings';
        setError(errorMessage);
        console.error('❌ Fetch bookings error:', err);

        // Set empty array on error to prevent UI breaking
        setBookings([]);
      } finally {
        setLoading(false);
      }
    },
    [initialFilters, pagination.page, pagination.limit]
  );

  // Get booking by ID
  const getBookingById = useCallback(async (bookingId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await bookingApi.getOrderById(bookingId);
      const transformedBooking = bookingApi.transformBookingData(response);
      return transformedBooking;
    } catch (err) {
      setError(err.message || 'Failed to fetch booking');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update booking status
  const updateBookingStatus = useCallback(
    async (bookingId, status) => {
      setLoading(true);
      setError(null);
      try {
        const response = await bookingApi.updateOrder(bookingId, { status });
        await fetchBookings(); // Refresh the list
        return response;
      } catch (err) {
        setError(err.message || 'Failed to update booking status');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchBookings]
  );

  // Cancel booking
  const cancelBooking = useCallback(
    async (bookingId, reason) => {
      setLoading(true);
      setError(null);
      try {
        const response = await bookingApi.cancelOrder(bookingId, { reason });
        await fetchBookings(); // Refresh the list
        return response;
      } catch (err) {
        setError(err.message || 'Failed to cancel booking');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchBookings]
  );

  // Search bookings
  const searchBookings = useCallback(
    async (searchTerm) => {
      await fetchBookings({ search: searchTerm, page: 1 });
    },
    [fetchBookings]
  );

  // Filter bookings
  const filterBookings = useCallback(
    async (filters) => {
      await fetchBookings({ ...filters, page: 1 });
    },
    [fetchBookings]
  );

  // Change page
  const changePage = useCallback(
    (newPage) => {
      setPagination((prev) => ({ ...prev, page: newPage }));
      fetchBookings({ page: newPage });
    },
    [fetchBookings]
  );

  // Refresh bookings
  const refreshBookings = useCallback(() => {
    fetchBookings();
  }, [fetchBookings]);

  // Get booking statistics
  const getBookingStats = useCallback(() => {
    if (!bookings.length) {
      return {
        total: 0,
        pending: 0,
        inProgress: 0,
        completed: 0,
        cancelled: 0,
        totalAmount: 0
      };
    }

    return {
      total: bookings.length,
      pending: bookings.filter((booking) => booking.status === 'Pending').length,
      inProgress: bookings.filter((booking) => booking.status === 'In Progress').length,
      completed: bookings.filter((booking) => booking.status === 'Completed').length,
      cancelled: bookings.filter((booking) => booking.status === 'Cancelled').length,
      totalAmount: bookings.reduce((sum, booking) => sum + (booking.amount || 0), 0)
    };
  }, [bookings]);

  // Initial load
  useEffect(() => {
    fetchBookings();
  }, []);

  return {
    bookings,
    loading,
    error,
    pagination,
    stats: getBookingStats(),
    actions: {
      fetchBookings,
      getBookingById,
      updateBookingStatus,
      cancelBooking,
      searchBookings,
      filterBookings,
      changePage,
      refreshBookings,
      clearError: () => setError(null)
    }
  };
};

export default useBookings;
