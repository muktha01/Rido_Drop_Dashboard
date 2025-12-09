import axios from 'axios';

const API_BASE_URL = 'https://ridodrop-backend-24-10-2025.onrender.com/api/v1';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Get all tickets with pagination and filters
export const getAllTickets = async (params = {}) => {
  try {
    const response = await api.get('/tickets', { params });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch tickets');
  }
};

// Get ticket by ID
export const getTicketById = async (id) => {
  try {
    const response = await api.get(`/tickets/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch ticket');
  }
};

// Create new ticket
export const createTicket = async (ticketData) => {
  try {
    const response = await api.post('/tickets', ticketData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create ticket');
  }
};

// Update ticket
export const updateTicket = async (id, ticketData) => {
  try {
    const response = await api.put(`/tickets/${id}`, ticketData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update ticket');
  }
};

// Delete ticket
export const deleteTicket = async (id) => {
  try {
    const response = await api.delete(`/tickets/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete ticket');
  }
};

// Add comment to ticket
export const addComment = async (id, commentData) => {
  try {
    const response = await api.post(`/tickets/${id}/comments`, commentData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to add comment');
  }
};

// Get ticket statistics
export const getTicketStats = async () => {
  try {
    const response = await api.get('/tickets/stats');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch ticket statistics');
  }
};

export default {
  getAllTickets,
  getTicketById,
  createTicket,
  updateTicket,
  deleteTicket,
  addComment,
  getTicketStats
};
