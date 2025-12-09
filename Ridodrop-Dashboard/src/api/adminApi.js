import { API_CONFIG, buildApiUrl } from './config';

const API_BASE_URL = API_CONFIG.BASE_URL;

// Token management
const TOKEN_STORAGE_KEY = 'admin_access_token';
const REFRESH_TOKEN_STORAGE_KEY = 'admin_refresh_token';

const tokenManager = {
  setTokens: (accessToken, refreshToken) => {
    localStorage.setItem(TOKEN_STORAGE_KEY, accessToken);
    if (refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, refreshToken);
    }
  },

  getAccessToken: () => {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  },

  getRefreshToken: () => {
    return localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
  },

  clearTokens: () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
  },

  getAuthHeaders: () => {
    const token = tokenManager.getAccessToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
};

// Admin authentication API service
export const adminApi = {
  // Register new admin
  register: async (adminData) => {
    try {
      const response = await fetch(buildApiUrl('/auth/admin/register'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include', // Include cookies
        body: JSON.stringify(adminData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Store tokens if provided
      if (data.tokens) {
        tokenManager.setTokens(data.tokens.accessToken, data.tokens.refreshToken);
      }

      return data;
    } catch (error) {
      console.error('Admin registration error:', error);
      throw error;
    }
  },

  // Login admin
  login: async (credentials) => {
    try {
      const response = await fetch(buildApiUrl('/auth/admin/login'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include', // Include cookies
        body: JSON.stringify(credentials)
      });

      // Check if response has content
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error('Server did not return JSON response. Check if backend is running.');
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store tokens if provided
      if (data.tokens) {
        tokenManager.setTokens(data.tokens.accessToken, data.tokens.refreshToken);
      }

      return data;
    } catch (error) {
      console.error('Admin login error:', error);
      throw error;
    }
  },

  // Logout admin
  logout: async () => {
    try {
      const response = await fetch(buildApiUrl('/auth/admin/logout'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...tokenManager.getAuthHeaders() // Include Authorization header
        },
        credentials: 'include' // Include cookies
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Logout failed');
      }

      // Clear stored tokens
      tokenManager.clearTokens();

      return data;
    } catch (error) {
      console.error('Admin logout error:', error);
      // Clear tokens even if logout request fails
      tokenManager.clearTokens();
      throw error;
    }
  },

  // Refresh access token
  refreshToken: async () => {
    try {
      const response = await fetch(buildApiUrl('/auth/admin/refresh-token'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...tokenManager.getAuthHeaders() // Include Authorization header
        },
        credentials: 'include' // Include cookies
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Token refresh failed');
      }

      return data;
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error;
    }
  },

  // Get admin profile
  getProfile: async () => {
    try {
      const response = await fetch(buildApiUrl('/auth/admin/profile'), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...tokenManager.getAuthHeaders() // Include Authorization header
        },
        credentials: 'include' // Include cookies
      });

      const data = await response.json();

      if (!response.ok) {
        // If token expired, try to refresh
        if (data.expired) {
          const refreshResult = await adminApi.refreshToken();
          if (refreshResult.success) {
            // Retry the original request
            return adminApi.getProfile();
          }
        }
        throw new Error(data.message || 'Failed to get profile');
      }

      return data;
    } catch (error) {
      console.error('Get admin profile error:', error);
      throw error;
    }
  },

  // Update admin profile
  updateProfile: async (profileData) => {
    try {
      const response = await fetch(buildApiUrl('/auth/admin/profile'), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...tokenManager.getAuthHeaders() // Include Authorization header
        },
        credentials: 'include', // Include cookies
        body: JSON.stringify(profileData)
      });

      const data = await response.json();

      if (!response.ok) {
        // If token expired, try to refresh
        if (data.expired) {
          const refreshResult = await adminApi.refreshToken();
          if (refreshResult.success) {
            // Retry the original request
            return adminApi.updateProfile(profileData);
          }
        }
        throw new Error(data.message || 'Failed to update profile');
      }

      return data;
    } catch (error) {
      console.error('Update admin profile error:', error);
      throw error;
    }
  },

  // Change password
  changePassword: async (passwordData) => {
    try {
      const response = await fetch(buildApiUrl('/auth/admin/change-password'), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...tokenManager.getAuthHeaders() // Include Authorization header
        },
        credentials: 'include', // Include cookies
        body: JSON.stringify(passwordData)
      });

      const data = await response.json();

      if (!response.ok) {
        // If token expired, try to refresh
        if (data.expired) {
          const refreshResult = await adminApi.refreshToken();
          if (refreshResult.success) {
            // Retry the original request
            return adminApi.changePassword(passwordData);
          }
        }
        throw new Error(data.message || 'Failed to change password');
      }

      return data;
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  },

  // Check if admin is authenticated
  checkAuth: async () => {
    try {
      const response = await adminApi.getProfile();
      return { isAuthenticated: true, admin: response.admin };
    } catch (error) {
      return { isAuthenticated: false, admin: null };
    }
  },

  // Get all admins with filters
  getAllAdmins: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams();

      // Add filter parameters
      Object.keys(filters).forEach((key) => {
        if (filters[key] !== undefined && filters[key] !== '') {
          queryParams.append(key, filters[key]);
        }
      });

      const queryString = queryParams.toString();
      const url = buildApiUrl('/auth/admin/all') + (queryString ? `?${queryString}` : '');

      console.log('🔥 Fetching admins from:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...tokenManager.getAuthHeaders()
        },
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        // If token expired, try to refresh
        if (data.expired) {
          const refreshResult = await adminApi.refreshToken();
          if (refreshResult.success) {
            // Retry the original request
            return adminApi.getAllAdmins(filters);
          }
        }
        throw new Error(data.message || data.error || 'Failed to fetch admins');
      }

      return {
        admins: data.admins || [],
        pagination: data.pagination
      };
    } catch (error) {
      console.error('❌ Error fetching admins from API:', error);

      // Return empty result on error to prevent UI breaking
      return {
        admins: [],
        pagination: { page: 1, limit: 20, total: 0, pages: 0 }
      };
    }
  },

  // Create new admin
  createAdmin: async (adminData) => {
    try {
      const response = await fetch(buildApiUrl('/auth/admin/register'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...tokenManager.getAuthHeaders()
        },
        credentials: 'include',
        body: JSON.stringify(adminData)
      });

      const data = await response.json();

      if (!response.ok) {
        // If token expired, try to refresh
        if (data.expired) {
          const refreshResult = await adminApi.refreshToken();
          if (refreshResult.success) {
            // Retry the original request
            return adminApi.createAdmin(adminData);
          }
        }
        throw new Error(data.message || data.error || 'Failed to create admin');
      }

      return data;
    } catch (error) {
      console.error('Create admin error:', error);
      throw error;
    }
  },

  // Update admin
  updateAdmin: async (adminId, updateData) => {
    try {
      const response = await fetch(buildApiUrl(`/auth/admin/${adminId}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...tokenManager.getAuthHeaders()
        },
        credentials: 'include',
        body: JSON.stringify(updateData)
      });

      const data = await response.json();

      if (!response.ok) {
        // If token expired, try to refresh
        if (data.expired) {
          const refreshResult = await adminApi.refreshToken();
          if (refreshResult.success) {
            // Retry the original request
            return adminApi.updateAdmin(adminId, updateData);
          }
        }
        throw new Error(data.message || data.error || 'Failed to update admin');
      }

      return data;
    } catch (error) {
      console.error('Update admin error:', error);
      throw error;
    }
  },

  // Delete admin
  deleteAdmin: async (adminId) => {
    try {
      const response = await fetch(buildApiUrl(`/auth/admin/${adminId}`), {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...tokenManager.getAuthHeaders()
        },
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        // If token expired, try to refresh
        if (data.expired) {
          const refreshResult = await adminApi.refreshToken();
          if (refreshResult.success) {
            // Retry the original request
            return adminApi.deleteAdmin(adminId);
          }
        }
        throw new Error(data.message || data.error || 'Failed to delete admin');
      }

      return data;
    } catch (error) {
      console.error('Delete admin error:', error);
      throw error;
    }
  }
};

export { tokenManager };
