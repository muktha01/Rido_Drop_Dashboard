import axios from 'axios';

class ReferralApi {
  constructor() {
    this.baseURL = import.meta.env.VITE_API_BASE_URL || 'https://ridodrop-backend-24-10-2025.onrender.com';
    this.apiPath = '/api/v1/referrals';
  }

  /**
   * Get all referrals (Admin)
   * @param {Object} params - Query parameters { page, limit, status, vehicleType }
   * @returns {Promise} - Referral data
   */
  async getAllReferrals(params = {}) {
    try {
      const response = await axios.get(`${this.baseURL}${this.apiPath}/all`, {
        params: {
          page: params.page || 1,
          limit: params.limit || 100,
          status: params.status,
          vehicleType: params.vehicleType
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching all referrals:', error);
      throw error;
    }
  }

  /**
   * Get referral statistics for a specific user by phone
   * @param {string} phone - User's phone number
   * @returns {Promise} - Referral statistics
   */
  async getReferralStatsByPhone(phone) {
    try {
      const response = await axios.get(`${this.baseURL}${this.apiPath}/stats`, {
        params: { phone }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching referral stats:', error);
      throw error;
    }
  }

  /**
   * Get referral campaigns information
   * @param {Object} params - Query parameters { isActive }
   * @returns {Promise} - Campaign data
   */
  async getReferralCampaigns(params = {}) {
    try {
      const response = await axios.get(`${this.baseURL}${this.apiPath}/campaigns`, {
        params: {
          isActive: params.isActive
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      throw error;
    }
  }

  /**
   * Get single campaign by ID
   * @param {string} id - Campaign ID
   * @returns {Promise} - Campaign data
   */
  async getCampaignById(id) {
    try {
      const response = await axios.get(`${this.baseURL}${this.apiPath}/campaigns/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching campaign:', error);
      throw error;
    }
  }

  /**
   * Create a new referral campaign (Admin)
   * @param {Object} data - { name, vehicleType, rewardAmount, icon, description, terms, isActive, startDate, endDate, priority }
   * @returns {Promise} - Created campaign
   */
  async createCampaign(data) {
    try {
      const response = await axios.post(`${this.baseURL}${this.apiPath}/campaigns`, data);
      return response.data;
    } catch (error) {
      console.error('Error creating campaign:', error);
      throw error;
    }
  }

  /**
   * Update a referral campaign (Admin)
   * @param {string} id - Campaign ID
   * @param {Object} data - { name, vehicleType, rewardAmount, icon, description, terms, isActive, startDate, endDate, priority }
   * @returns {Promise} - Updated campaign
   */
  async updateCampaign(id, data) {
    try {
      const response = await axios.put(`${this.baseURL}${this.apiPath}/campaigns/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating campaign:', error);
      throw error;
    }
  }

  /**
   * Delete a referral campaign (Admin)
   * @param {string} id - Campaign ID
   * @returns {Promise} - Deletion confirmation
   */
  async deleteCampaign(id) {
    try {
      const response = await axios.delete(`${this.baseURL}${this.apiPath}/campaigns/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting campaign:', error);
      throw error;
    }
  }

  /**
   * Create a new referral
   * @param {Object} data - { referralCode, referredUserPhone, vehicleType }
   * @returns {Promise} - Created referral
   */
  async createReferral(data) {
    try {
      const response = await axios.post(`${this.baseURL}${this.apiPath}/create`, data);
      return response.data;
    } catch (error) {
      console.error('Error creating referral:', error);
      throw error;
    }
  }

  /**
   * Update referral status (Admin can mark as paid/completed)
   * @param {string} id - Referral ID
   * @param {Object} data - { status, transactionId, rewardAmount }
   * @returns {Promise} - Updated referral
   */
  async updateReferralStatus(id, data) {
    try {
      const response = await axios.patch(`${this.baseURL}${this.apiPath}/${id}/status`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating referral status:', error);
      throw error;
    }
  }
}

export default new ReferralApi();
