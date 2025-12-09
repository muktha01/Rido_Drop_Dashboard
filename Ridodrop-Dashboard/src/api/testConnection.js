// API Connection Test
// This file helps test the API connection and diagnose issues

import { API_CONFIG } from './config';

export const testApiConnection = async () => {
  console.log('Testing API connection...');
  console.log('API Base URL:', API_CONFIG.BASE_URL);
  
  try {
    // Test health endpoint
    const healthUrl = `${API_CONFIG.BASE_URL}${API_CONFIG.API_VERSION}/health`;
    console.log('Testing health endpoint:', healthUrl);
    
    const response = await fetch(healthUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Health check successful:', data);
    return { success: true, data };
    
  } catch (error) {
    console.error('API connection test failed:', error);
    
    // Provide detailed error information
    if (error.message.includes('fetch')) {
      console.error('Fetch error - possible causes:');
      console.error('1. Backend server not running');
      console.error('2. Wrong URL or port');
      console.error('3. CORS issues');
      console.error('4. Network/firewall blocking connection');
    }
    
    return { success: false, error: error.message };
  }
};

// Test customer API endpoint
export const testCustomerApi = async () => {
  console.log('Testing customer API...');
  
  try {
    const url = `${API_CONFIG.BASE_URL}${API_CONFIG.API_VERSION}/users/dev/all`;
    console.log('Testing customer endpoint:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    
    const data = await response.json();
    console.log('Customer API test result:', data);
    
    return { success: response.ok, data, status: response.status };
    
  } catch (error) {
    console.error('Customer API test failed:', error);
    return { success: false, error: error.message };
  }
};

// Comprehensive connection test
export const runFullConnectionTest = async () => {
  console.log('=== Running Full API Connection Test ===');
  
  const results = {
    health: await testApiConnection(),
    customer: await testCustomerApi(),
  };
  
  console.log('=== Test Results Summary ===');
  console.log('Health endpoint:', results.health.success ? '✅ SUCCESS' : '❌ FAILED');
  console.log('Customer endpoint:', results.customer.success ? '✅ SUCCESS' : '❌ FAILED');
  
  if (!results.health.success) {
    console.log('🔧 Troubleshooting steps:');
    console.log('1. Check if backend server is running on port 5000');
    console.log('2. Verify MongoDB connection');
    console.log('3. Check firewall settings');
    console.log('4. Ensure CORS is properly configured');
  }
  
  return results;
};
