import { useState, useEffect, useCallback } from 'react';
import * as ticketApi from '../api/ticketApi';

export const useTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    priority: '',
    issueType: '',
    assignedTo: ''
  });
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
    closed: 0,
    urgent: 0,
    highPriority: 0
  });

  // Fetch tickets
  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters
      };

      const response = await ticketApi.getAllTickets(params);

      if (response.success) {
        setTickets(response.data);
        setPagination((prev) => ({
          ...prev,
          total: response.pagination.total,
          totalPages: response.pagination.totalPages
        }));
        return response.data;
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching tickets:', err);
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.page, pagination.limit]);

  // Fetch statistics
  const fetchStats = useCallback(async () => {
    try {
      const response = await ticketApi.getTicketStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (err) {
      console.error('Error fetching ticket stats:', err);
    }
  }, []);

  // Create ticket
  const createTicket = async (ticketData) => {
    try {
      const response = await ticketApi.createTicket(ticketData);
      if (response.success) {
        await fetchTickets();
        await fetchStats();
        return response;
      }
    } catch (err) {
      throw err;
    }
  };

  // Update ticket
  const updateTicket = async (id, ticketData) => {
    try {
      const response = await ticketApi.updateTicket(id, ticketData);
      if (response.success) {
        await fetchTickets();
        await fetchStats();
        return response;
      }
    } catch (err) {
      throw err;
    }
  };

  // Delete ticket
  const deleteTicket = async (id) => {
    try {
      const response = await ticketApi.deleteTicket(id);
      if (response.success) {
        await fetchTickets();
        await fetchStats();
        return response;
      }
    } catch (err) {
      throw err;
    }
  };

  // Add comment
  const addComment = async (id, commentData) => {
    try {
      const response = await ticketApi.addComment(id, commentData);
      if (response.success) {
        const updatedTickets = await fetchTickets();
        return updatedTickets;
      }
    } catch (err) {
      throw err;
    }
  };

  // Update filters
  const updateFilters = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  // Update pagination
  const updatePagination = (newPagination) => {
    setPagination((prev) => ({ ...prev, ...newPagination }));
  };

  // Initial fetch
  useEffect(() => {
    fetchTickets();
  }, [pagination.page, pagination.limit, filters]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    tickets,
    loading,
    error,
    pagination,
    filters,
    stats,
    actions: {
      createTicket,
      updateTicket,
      deleteTicket,
      addComment,
      updateFilters,
      updatePagination,
      refresh: fetchTickets
    }
  };
};
