import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { adminApi, tokenManager } from '../api/adminApi';

// Initial state
const initialState = {
  isAuthenticated: false,
  admin: null,
  loading: true,
  error: null
};

// Action types
const AUTH_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGOUT: 'LOGOUT',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  UPDATE_PROFILE: 'UPDATE_PROFILE'
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        admin: action.payload,
        loading: false,
        error: null
      };
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        admin: null,
        loading: false,
        error: null
      };
    case AUTH_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
    case AUTH_ACTIONS.UPDATE_PROFILE:
      return {
        ...state,
        admin: { ...state.admin, ...action.payload }
      };
    default:
      return state;
  }
};

// Create context
const AdminAuthContext = createContext();

// Auth provider component
export const AdminAuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      const result = await adminApi.checkAuth();
      
      if (result.isAuthenticated) {
        dispatch({ 
          type: AUTH_ACTIONS.LOGIN_SUCCESS, 
          payload: result.admin 
        });
      } else {
        dispatch({ type: AUTH_ACTIONS.LOGOUT });
      }
    } catch (error) {
      console.error('Auth check error:', error);
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    } finally {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
    }
  };

  const login = async (credentials) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
      
      const response = await adminApi.login(credentials);
      
      if (response.success) {
        dispatch({ 
          type: AUTH_ACTIONS.LOGIN_SUCCESS, 
          payload: response.admin 
        });
        return { success: true };
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      const errorMessage = error.message.includes('Server did not return JSON') 
        ? 'Backend server is not running or not responding. Please check if the server is running on port 3000.'
        : error.message;
      
      dispatch({ 
        type: AUTH_ACTIONS.SET_ERROR, 
        payload: errorMessage 
      });
      return { success: false, error: errorMessage };
    }
  };

  const register = async (adminData) => {
    try {
      console.log(adminData);
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
      
      const response = await adminApi.register(adminData);
      
      if (response.success) {
        dispatch({ 
          type: AUTH_ACTIONS.LOGIN_SUCCESS, 
          payload: response.admin 
        });
        return { success: true };
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error) {
      dispatch({ 
        type: AUTH_ACTIONS.SET_ERROR, 
        payload: error.message 
      });
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await adminApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    }
  };

  const updateProfile = async (profileData) => {
    try {
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
      
      const response = await adminApi.updateProfile(profileData);
      
      if (response.success) {
        dispatch({ 
          type: AUTH_ACTIONS.UPDATE_PROFILE, 
          payload: response.admin 
        });
        return { success: true };
      } else {
        throw new Error(response.message || 'Profile update failed');
      }
    } catch (error) {
      dispatch({ 
        type: AUTH_ACTIONS.SET_ERROR, 
        payload: error.message 
      });
      return { success: false, error: error.message };
    }
  };

  const changePassword = async (passwordData) => {
    try {
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
      
      const response = await adminApi.changePassword(passwordData);
      
      if (response.success) {
        return { success: true };
      } else {
        throw new Error(response.message || 'Password change failed');
      }
    } catch (error) {
      dispatch({ 
        type: AUTH_ACTIONS.SET_ERROR, 
        payload: error.message 
      });
      return { success: false, error: error.message };
    }
  };

  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    clearError,
    checkAuthStatus
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

export default AdminAuthContext;
