import API_CONFIG, { buildApiUrl, getApiHeaders } from './config';

// Service API Service
class ServiceApiService {
  constructor() {
    this.baseURL = import.meta.env.VITE_API_BASE_URL || 'https://ridodrop-backend-24-10-2025.onrender.com';
  }

  // Generic API request handler
  async apiRequest(url, options = {}) {
    try {
      console.log('🔥 Making Service API request to:', url);
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
        console.log('✅ Service API response received:', data);
        return data;
      }

      return await response.text();
    } catch (error) {
      console.error('Service API Request Error:', error);
      throw error;
    }
  }

  // Get all services with filters
  async getAllServices(filters = {}) {
    try {
      const queryParams = new URLSearchParams();

      // Add filter parameters
      Object.keys(filters).forEach((key) => {
        if (filters[key] !== undefined && filters[key] !== '') {
          queryParams.append(key, filters[key]);
        }
      });

      const queryString = queryParams.toString();
      const url = buildApiUrl('/services/all') + (queryString ? `?${queryString}` : '');

      console.log('🔥 Fetching services from:', url);
      const response = await this.apiRequest(url, { method: 'GET' });

      return {
        services: response.services || [],
        pagination: response.pagination
      };
    } catch (error) {
      console.error('❌ Error fetching services from API:', error);

      // Return empty result on error to prevent UI breaking
      return {
        services: [],
        pagination: { page: 1, limit: 50, total: 0, pages: 0 }
      };
    }
  }

  // Get service by ID
  async getServiceById(serviceId) {
    const url = buildApiUrl(`/services/${serviceId}`);

    return this.apiRequest(url, {
      method: 'GET'
    });
  }

  // Create new service
  async createService(serviceData) {
    const url = buildApiUrl('/services/create');

    return this.apiRequest(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(serviceData)
    });
  }

  // Update service
  async updateService(serviceId, updateData) {
    const url = buildApiUrl(`/services/${serviceId}`);

    return this.apiRequest(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updateData)
    });
  }

  // Delete service
  async deleteService(serviceId) {
    const url = buildApiUrl(`/services/${serviceId}`);

    return this.apiRequest(url, {
      method: 'DELETE'
    });
  }

  // Toggle service status
  async toggleServiceStatus(serviceId) {
    const url = buildApiUrl(`/services/${serviceId}/toggle`);

    return this.apiRequest(url, {
      method: 'PATCH'
    });
  }

  // Get cities for a service type
  async getCitiesForService(vehicleType, subType) {
    const queryParams = new URLSearchParams();
    if (vehicleType) queryParams.append('vehicleType', vehicleType);
    if (subType) queryParams.append('subType', subType);

    const queryString = queryParams.toString();
    const url = buildApiUrl('/services/cities') + (queryString ? `?${queryString}` : '');

    return this.apiRequest(url, {
      method: 'GET'
    });
  }

  // Bulk create services
  async bulkCreateServices(services) {
    const url = buildApiUrl('/services/bulk');

    return this.apiRequest(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ services })
    });
  }
}

// Create singleton instance
const serviceApi = new ServiceApiService();

// Export methods as named exports
export const getAllServices = serviceApi.getAllServices.bind(serviceApi);
export const getServiceById = serviceApi.getServiceById.bind(serviceApi);
export const createService = serviceApi.createService.bind(serviceApi);
export const updateService = serviceApi.updateService.bind(serviceApi);
export const deleteService = serviceApi.deleteService.bind(serviceApi);
export const toggleServiceStatus = serviceApi.toggleServiceStatus.bind(serviceApi);
export const getCitiesForService = serviceApi.getCitiesForService.bind(serviceApi);
export const bulkCreateServices = serviceApi.bulkCreateServices.bind(serviceApi);

// Export default instance
export default serviceApi;
