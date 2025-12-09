import API_CONFIG, { buildApiUrl, getApiHeaders } from './config';

// Customer API Service
class CustomerApiService {
  constructor() {
    this.baseURL = import.meta.env.VITE_API_BASE_URL || 'https://ridodrop-backend-24-10-2025.onrender.com';
    this.useMockData = false;
    this.backendChecked = false;
  }

  // Check if backend is available
  async checkBackendConnection() {
    if (this.backendChecked) return;

    try {
      const url = buildApiUrl('/health');
      console.log('Checking backend connection to:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Backend health check response:', response.status);

      if (response.ok) {
        console.log('✅ Backend is available and healthy');
        this.useMockData = false;
      } else {
        console.warn('⚠️ Backend returned error status:', response.status);
        this.useMockData = true;
      }
    } catch (error) {
      console.warn('❌ Backend not available:', error.message);
      this.useMockData = true;
    }

    this.backendChecked = true;
    console.log('Backend check completed. Using mock data:', this.useMockData);
  }

  // Generic API request handler
  async apiRequest(url, options = {}) {
    await this.checkBackendConnection();

    try {
      console.log('🔥 Making API request to:', url);
      const response = await fetch(url, {
        ...options,
        headers: {
          ...getApiHeaders(),
          ...options.headers
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        console.log('✅ Customer API response received:', data);
        // Log first customer data structure for debugging
        if (data.users && data.users.length > 0) {
          console.log('📋 First customer data structure:', data.users[0]);
        }
        return data;
      }

      return await response.text();
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  // Get all customers with filters
  async getAllCustomers(filters = {}) {
    const queryParams = new URLSearchParams();

    // Add filter parameters
    Object.keys(filters).forEach((key) => {
      if (filters[key] !== undefined && filters[key] !== '') {
        queryParams.append(key, filters[key]);
      }
    });

    const queryString = queryParams.toString();
    const url = buildApiUrl('/dev/all') + (queryString ? `?${queryString}` : '');

    return this.apiRequest(url, {
      method: 'GET'
    });
  }

  // Get customer by ID
  async getCustomerById(customerId) {
    const url = buildApiUrl(`/dev/${customerId}`);

    return this.apiRequest(url, {
      method: 'GET'
    });
  }

  // Update customer
  async updateCustomer(customerId, updateData) {
    const url = buildApiUrl(`/dev/${customerId}`);

    // Handle FormData for file uploads
    let body = updateData;
    let headers = {};

    if (!(updateData instanceof FormData)) {
      body = JSON.stringify(updateData);
      headers['Content-Type'] = 'application/json';
    }

    return this.apiRequest(url, {
      method: 'PUT',
      headers,
      body
    });
  }

  // Delete customer
  async deleteCustomer(customerId) {
    const url = buildApiUrl(`/dev/${customerId}`);

    return this.apiRequest(url, {
      method: 'DELETE'
    });
  }

  // Block customer
  async blockCustomer(customerId) {
    const url = buildApiUrl(`/dev/${customerId}/block`);

    return this.apiRequest(url, {
      method: 'PATCH'
    });
  }

  // Unblock customer
  async unblockCustomer(customerId) {
    const url = buildApiUrl(`/dev/${customerId}/unblock`);

    return this.apiRequest(url, {
      method: 'PATCH'
    });
  }

  // Get customer orders by vehicle type
  async getCustomerOrders(customerId) {
    const url = buildApiUrl(`/dev/${customerId}/orders`);

    return this.apiRequest(url, {
      method: 'GET'
    });
  }

  // Get customer cancel details
  async getCustomerCancelDetails(customerId) {
    const url = buildApiUrl(`/dev/${customerId}/cancels`);

    return this.apiRequest(url, {
      method: 'GET'
    });
  }

  // Get customer wallet details
  async getCustomerWalletDetails(customerId) {
    const url = buildApiUrl(`/dev/${customerId}/wallet`);

    return this.apiRequest(url, {
      method: 'GET'
    });
  }

  // Get customer referral details
  async getCustomerReferralDetails(customerId) {
    const url = buildApiUrl(`/dev/${customerId}/referrals`);

    return this.apiRequest(url, {
      method: 'GET'
    });
  }

  // Create customer
  async createCustomer(customerData) {
    const url = buildApiUrl('/add');

    // Handle FormData for file uploads
    let body = customerData;
    let headers = {};

    if (!(customerData instanceof FormData)) {
      body = JSON.stringify(customerData);
      headers['Content-Type'] = 'application/json';
    }

    return this.apiRequest(url, {
      method: 'POST',
      headers,
      body
    });
  }

  /**
   * Export customers data to Excel format
   */
  async exportCustomersToExcel(filters = {}) {
    try {
      console.log('📊 Exporting customers to Excel with filters:', filters);

      const queryParams = new URLSearchParams();
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.role) queryParams.append('role', filters.role);
      if (filters.status) queryParams.append('status', filters.status);

      const response = await fetch(`${this.baseURL}/api/v1/dev/export/excel?${queryParams}`, {
        method: 'GET'
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Export failed:', response.status, errorText);
        throw new Error(`Failed to export customers: ${response.statusText}`);
      }

      // Get the blob from response
      const blob = await response.blob();

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `customers_data_${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      console.log('✅ Customers Excel file downloaded successfully');
      return { success: true, message: 'File downloaded successfully' };
    } catch (error) {
      console.error('❌ Error exporting customers to Excel:', error);
      throw error;
    }
  }

  /**
   * Export customers detailed data
   */
  async exportCustomersDocuments(filters = {}) {
    try {
      console.log('📄 Exporting customers documents with filters:', filters);

      const queryParams = new URLSearchParams();
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.role) queryParams.append('role', filters.role);
      if (filters.status) queryParams.append('status', filters.status);

      const response = await fetch(`${this.baseURL}/api/v1/dev/export/documents?${queryParams}`, {
        method: 'GET'
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Export failed:', response.status, errorText);
        throw new Error(`Failed to export documents: ${response.statusText}`);
      }

      // Get the blob from response
      const blob = await response.blob();

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `customers_documents_${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      console.log('✅ Documents Excel file downloaded successfully');
      return { success: true, message: 'File downloaded successfully' };
    } catch (error) {
      console.error('❌ Error exporting customers documents:', error);
      throw error;
    }
  }
}

// Create singleton instance
const customerApi = new CustomerApiService();

// Export methods as named exports
export const getAllCustomers = customerApi.getAllCustomers.bind(customerApi);
export const getCustomerById = customerApi.getCustomerById.bind(customerApi);
export const getCustomerOrders = customerApi.getCustomerOrders.bind(customerApi);
export const getCustomerCancelDetails = customerApi.getCustomerCancelDetails.bind(customerApi);
export const getCustomerWalletDetails = customerApi.getCustomerWalletDetails.bind(customerApi);
export const getCustomerReferralDetails = customerApi.getCustomerReferralDetails.bind(customerApi);
export const updateCustomer = customerApi.updateCustomer.bind(customerApi);
export const deleteCustomer = customerApi.deleteCustomer.bind(customerApi);
export const blockCustomer = customerApi.blockCustomer.bind(customerApi);
export const unblockCustomer = customerApi.unblockCustomer.bind(customerApi);
export const createCustomer = customerApi.createCustomer.bind(customerApi);
export const exportCustomersToExcel = customerApi.exportCustomersToExcel.bind(customerApi);
export const exportCustomersDocuments = customerApi.exportCustomersDocuments.bind(customerApi);

// Export default instance
export default customerApi;
