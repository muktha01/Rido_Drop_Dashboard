import API_CONFIG, { buildApiUrl, getApiHeaders } from './config';

// Coupon API Service
class CouponApiService {
  constructor() {
    this.baseURL = import.meta.env.VITE_API_BASE_URL || 'https://ridodrop-backend-24-10-2025.onrender.com';
  }

  // Generic API request handler
  async apiRequest(url, options = {}) {
    try {
      console.log('🔥 Making Coupon API request to:', url);
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
        console.log('✅ Coupon API response received:', data);
        return data;
      }

      return await response.text();
    } catch (error) {
      console.error('Coupon API Request Error:', error);
      throw error;
    }
  }

  // Get all coupons with filters
  async getAllCoupons(filters = {}) {
    try {
      const queryParams = new URLSearchParams();

      // Add filter parameters
      Object.keys(filters).forEach((key) => {
        if (filters[key] !== undefined && filters[key] !== '') {
          queryParams.append(key, filters[key]);
        }
      });

      const queryString = queryParams.toString();
      const url = buildApiUrl('/coupons/all') + (queryString ? `?${queryString}` : '');

      console.log('🔥 Fetching coupons from:', url);
      const response = await this.apiRequest(url, { method: 'GET' });

      return {
        coupons: response.coupons || [],
        pagination: response.pagination
      };
    } catch (error) {
      console.error('❌ Error fetching coupons from API:', error);

      // Return empty result on error to prevent UI breaking
      return {
        coupons: [],
        pagination: { page: 1, limit: 50, total: 0, pages: 0 }
      };
    }
  }

  // Get coupon by ID
  async getCouponById(couponId) {
    const url = buildApiUrl(`/coupons/${couponId}`);

    return this.apiRequest(url, {
      method: 'GET'
    });
  }

  // Get coupon by code
  async getCouponByCode(couponCode) {
    const url = buildApiUrl(`/coupons/code/${couponCode}`);

    return this.apiRequest(url, {
      method: 'GET'
    });
  }

  // Create new coupon
  async createCoupon(couponData) {
    const url = buildApiUrl('/coupons/create');

    return this.apiRequest(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(couponData)
    });
  }

  // Update coupon
  async updateCoupon(couponId, updateData) {
    const url = buildApiUrl(`/coupons/${couponId}`);

    return this.apiRequest(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updateData)
    });
  }

  // Delete coupon
  async deleteCoupon(couponId) {
    const url = buildApiUrl(`/coupons/${couponId}`);

    return this.apiRequest(url, {
      method: 'DELETE'
    });
  }

  // Apply coupon
  async applyCoupon(couponCode, applicationData) {
    const url = buildApiUrl(`/coupons/apply/${couponCode}`);

    return this.apiRequest(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(applicationData)
    });
  }

  // Get coupon statistics
  async getCouponStats() {
    const url = buildApiUrl('/coupons/stats');

    return this.apiRequest(url, {
      method: 'GET'
    });
  }
}

// Create singleton instance
const couponApi = new CouponApiService();

// Export methods as named exports
export const getAllCoupons = couponApi.getAllCoupons.bind(couponApi);
export const getCouponById = couponApi.getCouponById.bind(couponApi);
export const getCouponByCode = couponApi.getCouponByCode.bind(couponApi);
export const createCoupon = couponApi.createCoupon.bind(couponApi);
export const updateCoupon = couponApi.updateCoupon.bind(couponApi);
export const deleteCoupon = couponApi.deleteCoupon.bind(couponApi);
export const applyCoupon = couponApi.applyCoupon.bind(couponApi);
export const getCouponStats = couponApi.getCouponStats.bind(couponApi);

// Export default instance
export default couponApi;
