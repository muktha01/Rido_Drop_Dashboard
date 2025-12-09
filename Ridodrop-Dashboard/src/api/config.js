// API Configuration
const API_CONFIG = {
  // Base URL for the backend API
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://ridodrop-backend-24-10-2025.onrender.com',
  API_VERSION: '/api/v1',

  // Request timeout in milliseconds
  TIMEOUT: 10000,

  // Default headers
  HEADERS: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  },

  // API Endpoints
  ENDPOINTS: {
    // Auth endpoints
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      REFRESH: '/auth/refresh-token',
      LOGOUT: '/auth/logout'
    },

    // User/Customer endpoints
    USERS: {
      BASE: '',
      CREATE: '/add',
      GET_ALL: '/dev/all',
      GET_BY_ID: '/dev/:id',
      UPDATE: '/dev/:id',
      DELETE: '/dev/:id',
      PROFILE: '/profile',
      BLOCK: '/dev/:id/block',
      UNBLOCK: '/dev/:id/unblock'
    },

    // Booking endpoints
    BOOKINGS: {
      BASE: '/bookings',
      CREATE: '/create',
      GET_ALL: '/all',
      GET_BY_ID: '/:id',
      UPDATE: '/:id',
      DELETE: '/:id',
      GET_BY_USER: '/user/:userId',
      GET_BY_STATUS: '/status/:status'
    },

    // Wallet endpoints
    WALLET: {
      BASE: '/wallet',
      GET_BALANCE: '/:userId/balance',
      ADD_MONEY: '/:userId/add',
      DEDUCT_MONEY: '/:userId/deduct',
      GET_TRANSACTIONS: '/:userId/transactions'
    }
  }
};

// Helper function to build full URL
export const buildApiUrl = (endpoint, params = {}) => {
  let url = `${API_CONFIG.BASE_URL}${API_CONFIG.API_VERSION}${endpoint}`;

  // Replace URL parameters
  Object.keys(params).forEach((key) => {
    url = url.replace(`:${key}`, params[key]);
  });

  return url;
};

// Helper function to get authorization header
export const getAuthHeader = () => {
  const token = localStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Helper function to get full headers
export const getApiHeaders = (customHeaders = {}) => {
  return {
    ...API_CONFIG.HEADERS,
    ...getAuthHeader(),
    ...customHeaders
  };
};

export { API_CONFIG };
export default API_CONFIG;
