import API_CONFIG, { buildApiUrl, getApiHeaders } from './config';

// Price API Service
class PriceApiService {
  constructor() {
    this.baseURL = import.meta.env.VITE_API_BASE_URL || 'https://ridodrop-backend-24-10-2025.onrender.com';
  }

  // Generic API request handler
  async apiRequest(url, options = {}) {
    try {
      console.log('🔥 Making Price API request to:', url);
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
        console.log('✅ Price API response received:', data);
        return data;
      }

      return await response.text();
    } catch (error) {
      console.error('Price API Request Error:', error);
      throw error;
    }
  }

  // Get all prices with filters
  async getAllPrices(filters = {}) {
    try {
      const queryParams = new URLSearchParams();

      // Add filter parameters
      Object.keys(filters).forEach((key) => {
        if (filters[key] !== undefined && filters[key] !== '') {
          queryParams.append(key, filters[key]);
        }
      });

      const queryString = queryParams.toString();
      const url = buildApiUrl('/prices/all') + (queryString ? `?${queryString}` : '');

      console.log('🔥 Fetching prices from:', url);
      const response = await this.apiRequest(url, { method: 'GET' });

      return {
        prices: response.prices || [],
        pagination: response.pagination
      };
    } catch (error) {
      console.error('❌ Error fetching prices from API:', error);

      // Return empty result on error to prevent UI breaking
      return {
        prices: [],
        pagination: { page: 1, limit: 50, total: 0, pages: 0 }
      };
    }
  }

  // Get price by ID
  async getPriceById(priceId) {
    const url = buildApiUrl(`/prices/${priceId}`);

    return this.apiRequest(url, {
      method: 'GET'
    });
  }

  // Create new price
  async createPrice(priceData) {
    const url = buildApiUrl('/prices/create');

    return this.apiRequest(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(priceData)
    });
  }

  // Update price
  async updatePrice(priceId, updateData) {
    const url = buildApiUrl(`/prices/${priceId}`);

    return this.apiRequest(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updateData)
    });
  }

  // Delete price
  async deletePrice(priceId) {
    const url = buildApiUrl(`/prices/${priceId}`);

    return this.apiRequest(url, {
      method: 'DELETE'
    });
  }

  // Bulk create prices
  async bulkCreatePrices(prices) {
    const url = buildApiUrl('/prices/bulk');

    return this.apiRequest(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prices })
    });
  }
}

// Create singleton instance
const priceApi = new PriceApiService();

// Export methods as named exports
export const getAllPrices = priceApi.getAllPrices.bind(priceApi);
export const getPriceById = priceApi.getPriceById.bind(priceApi);
export const createPrice = priceApi.createPrice.bind(priceApi);
export const updatePrice = priceApi.updatePrice.bind(priceApi);
export const deletePrice = priceApi.deletePrice.bind(priceApi);
export const bulkCreatePrices = priceApi.bulkCreatePrices.bind(priceApi);

// Export default instance
export default priceApi;
