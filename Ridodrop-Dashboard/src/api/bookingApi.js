import API_CONFIG, { buildApiUrl, getApiHeaders } from './config';

// Booking API Service
class BookingApiService {
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
        console.log('✅ API response received:', data);
        return data;
      }

      return await response.text();
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  // Get all orders/bookings with filters
  async getAllOrders(filters = {}) {
    const queryParams = new URLSearchParams();

    // Add filter parameters
    Object.keys(filters).forEach((key) => {
      if (filters[key] !== undefined && filters[key] !== '') {
        queryParams.append(key, filters[key]);
      }
    });

    const queryString = queryParams.toString();
    const url = buildApiUrl('/all') + (queryString ? `?${queryString}` : '');

    return this.apiRequest(url, {
      method: 'GET'
    });
  }

  // Get orders by customer ID
  async getOrdersByCustomer(customerId, filters = {}) {
    const queryParams = new URLSearchParams();

    // Add filter parameters
    Object.keys(filters).forEach((key) => {
      if (filters[key] !== undefined && filters[key] !== '') {
        queryParams.append(key, filters[key]);
      }
    });

    const queryString = queryParams.toString();
    const url = buildApiUrl(`/bookings/customer/${customerId}`) + (queryString ? `?${queryString}` : '');

    return this.apiRequest(url, {
      method: 'GET'
    });
  }

  // Get single order by ID
  async getOrderById(orderId) {
    const url = buildApiUrl(`/bookings/booking/${orderId}`);

    return this.apiRequest(url, {
      method: 'GET'
    });
  }

  // Get order statistics
  async getOrderStats() {
    const url = buildApiUrl('/stats');

    return this.apiRequest(url, {
      method: 'GET'
    });
  }

  // Create new order
  async createOrder(orderData) {
    const url = buildApiUrl('/create');

    // Handle FormData for file uploads
    let body = orderData;
    let headers = {};

    if (!(orderData instanceof FormData)) {
      body = JSON.stringify(orderData);
      headers['Content-Type'] = 'application/json';
    }

    return this.apiRequest(url, {
      method: 'POST',
      headers,
      body
    });
  }

  // Update order
  async updateOrder(orderId, updateData) {
    const url = buildApiUrl(`/bookings/${orderId}`);

    return this.apiRequest(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updateData)
    });
  }

  // Assign driver/rider to order (manual assignment)
  async assignDriver(orderId, driverId, extra = {}) {
    const url = buildApiUrl('/assign-order');

    const payload = {
      bookingId: orderId,
      driverId: driverId,
      status: 'accepted', // Mark as accepted when manually assigned
      ...extra
    };

    console.log('📋 Assigning driver to order:', payload);
    console.log('🔗 Assignment URL:', url);

    try {
      const response = await this.apiRequest(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      console.log('✅ Assignment successful:', response);
      return response;
    } catch (error) {
      console.error('❌ Assignment failed:', error);
      throw error;
    }
  }

  // Cancel order
  async cancelOrder(orderId, cancelData) {
    const url = buildApiUrl(`/bookings/${orderId}/cancel`);

    return this.apiRequest(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(cancelData)
    });
  }

  // Helper function to safely extract name from user object
  extractName(user) {
    if (!user) return 'Unknown User';

    // If it's already a string, return it
    if (typeof user === 'string') return user;

    // If it's an object, try to extract name properties
    if (typeof user === 'object') {
      // Handle null object
      if (user === null) return 'Unknown User';

      // Log the user object for debugging
      console.log('🔍 Extracting name from user object:', user);

      const firstName = typeof user.name === 'string' ? user.name : typeof user.firstName === 'string' ? user.firstName : '';
      const lastName = typeof user.lname === 'string' ? user.lname : typeof user.lastName === 'string' ? user.lastName : '';

      // If both first and last name exist and are different, combine them
      if (firstName && lastName && firstName !== lastName) {
        const fullName = `${firstName} ${lastName}`.trim();
        console.log('✅ Extracted full name:', fullName);
        return fullName;
      }

      // Return whichever name is available
      const extractedName = firstName || lastName || 'Unknown User';
      console.log('✅ Extracted name:', extractedName);
      return extractedName;
    }

    // Handle any other data type
    console.warn('⚠️ Unexpected user data type:', typeof user, user);
    return 'Unknown User';
  }

  // Transform booking data to match frontend expectations
  transformBookingData(booking, index = 1) {
    console.log('🔄 Transforming booking data:', booking);

    // Handle both customer and userId fields (legacy data compatibility)
    const customer = booking.customer || booking.userId;
    console.log('👤 Customer data:', customer);

    // Extract customer ID - handle ObjectId conversion
    let customerId = 'N/A';
    if (customer) {
      if (customer.customerId) {
        // Handle both string and ObjectId
        customerId = typeof customer.customerId === 'string' ? customer.customerId : customer.customerId.toString();
      } else if (customer._id) {
        // Fallback to _id if customerId doesn't exist
        customerId = typeof customer._id === 'string' ? customer._id : customer._id.toString();
      }
    }
    console.log('👤 Extracted Customer ID:', customerId);

    // Safely extract customer name
    const customerName = this.extractName(customer);
    console.log('📝 Customer name extracted:', customerName);

    // Check rider/driver data
    console.log('🚗 Raw rider data:', booking.rider);

    // Extract driver ID - handle ObjectId conversion and riderId field
    let driverId = 'Not Assigned';
    if (booking.rider) {
      // Try riderId field first (formatted ID like RDR001)
      if (booking.rider.riderId) {
        driverId = booking.rider.riderId;
      }
      // Then try _id
      else if (booking.rider._id) {
        driverId = typeof booking.rider._id === 'string' ? booking.rider._id : booking.rider._id.toString();
      } else if (typeof booking.rider === 'string') {
        driverId = booking.rider;
      }
    }
    console.log('🚗 Extracted Driver ID:', driverId);

    // Safely extract driver name
    const driverName = this.extractName(booking.rider);
    console.log('🚗 Driver name extracted:', driverName);

    const transformedData = {
      id: booking._id,
      serialNo: index,
      customerId: customerId,
      customerName: customerName,
      customerMobile: customer?.phone || customer?.mobile || 'N/A',
      customerEmail: customer?.email || 'N/A',
      driverId: driverId,
      driverName: driverName,
      driverMobile: booking.rider?.phone || booking.rider?.mobile || 'N/A',
      orderDate: booking.createdAt ? new Date(booking.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      orderTime: booking.createdAt ? new Date(booking.createdAt).toLocaleTimeString() : 'N/A',
      vehicleType: this.transformVehicleType(booking.vehicleType),
      pickupLocation: booking.fromAddress?.address || 'N/A',
      dropLocation: booking.dropLocation?.[0]?.Address || booking.dropLocation?.[0]?.address || 'N/A',
      amount: parseFloat(booking.price || booking.amountPay || 0),
      status: this.transformStatus(booking.status || booking.bookingStatus),
      paymentMethod: this.getPaymentMethod(booking.payFrom),
      orderType: this.getOrderType(booking.vehicleType),
      priority: this.getPriority(booking.status),
      assignedAt: booking.riderAcceptTime ? new Date(booking.riderAcceptTime).toLocaleString() : null,
      completedAt: booking.riderEndTime ? new Date(booking.riderEndTime).toLocaleString() : null,
      cancellationReason: booking.status === 'cancelled' ? 'Order was cancelled' : null,
      // Raw data for debugging
      _raw: booking
    };

    console.log('✅ Transformed booking data:', transformedData);
    console.log('✅ Customer ID in transformed data:', transformedData.customerId);
    console.log('✅ Driver ID in transformed data:', transformedData.driverId);
    return transformedData;
  }

  // Transform status to match frontend expectations
  transformStatus(status) {
    const statusMap = {
      pending: 'Pending',
      accepted: 'Accepted',
      in_progress: 'In Progress',
      completed: 'Completed',
      cancelled: 'Cancelled'
    };
    return statusMap[status] || status;
  }

  // Transform vehicle type to match frontend expectations
  transformVehicleType(vehicleType) {
    const typeMap = {
      '2wheeler': '2W',
      '3wheeler': '3W',
      bike: '2W',
      auto: '3W',
      truck: 'Truck',
      pickup: 'Truck'
    };
    return typeMap[vehicleType] || vehicleType || '2W';
  }

  // Get payment method from payFrom field
  getPaymentMethod(payFrom) {
    const methodMap = {
      wallet: 'Wallet',
      cash: 'Cash',
      card: 'Card',
      drop: 'Cash on Delivery'
    };
    return methodMap[payFrom] || 'Cash';
  }

  // Get order type based on vehicle type
  getOrderType(vehicleType) {
    const typeMap = {
      '2wheeler': 'Express',
      bike: 'Express',
      '3wheeler': 'Standard',
      auto: 'Standard',
      truck: 'Heavy',
      pickup: 'Heavy'
    };
    return typeMap[vehicleType] || 'Standard';
  }

  // Get priority based on status
  getPriority(status) {
    const priorityMap = {
      pending: 'High',
      accepted: 'Medium',
      in_progress: 'High',
      completed: 'Low',
      cancelled: 'Low'
    };
    return priorityMap[status] || 'Medium';
  }

  // Export Order Details to Excel
  async exportOrderDetailsToExcel(filters = {}) {
    try {
      const queryParams = new URLSearchParams();

      // Add filter parameters
      Object.keys(filters).forEach((key) => {
        if (filters[key] !== undefined && filters[key] !== '') {
          queryParams.append(key, filters[key]);
        }
      });

      const queryString = queryParams.toString();
      const url = `${this.baseURL}/api/v1/bookings/export/order-details${queryString ? `?${queryString}` : ''}`;

      console.log('Exporting order details to Excel from:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: getApiHeaders()
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Export order details error response:', errorText);
        throw new Error(`Failed to export order details: ${response.status}`);
      }

      // Get the blob from response
      const blob = await response.blob();

      // Create download link
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `order_details_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up
      window.URL.revokeObjectURL(downloadUrl);

      console.log('✅ Order details Excel exported successfully');
    } catch (error) {
      console.error('Error exporting order details to Excel:', error);
      throw error;
    }
  }

  // Export Cancel Details to Excel
  async exportCancelDetailsToExcel(filters = {}) {
    try {
      const queryParams = new URLSearchParams();

      // Add filter parameters
      Object.keys(filters).forEach((key) => {
        if (filters[key] !== undefined && filters[key] !== '') {
          queryParams.append(key, filters[key]);
        }
      });

      const queryString = queryParams.toString();
      const url = `${this.baseURL}/api/v1/bookings/export/cancel-details${queryString ? `?${queryString}` : ''}`;

      console.log('Exporting cancel details to Excel from:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: getApiHeaders()
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Export cancel details error response:', errorText);
        throw new Error(`Failed to export cancel details: ${response.status}`);
      }

      // Get the blob from response
      const blob = await response.blob();

      // Create download link
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `cancel_details_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up
      window.URL.revokeObjectURL(downloadUrl);

      console.log('✅ Cancel details Excel exported successfully');
    } catch (error) {
      console.error('Error exporting cancel details to Excel:', error);
      throw error;
    }
  }
}

// Create singleton instance
const bookingApi = new BookingApiService();

// Export methods as named exports
export const getAllOrders = bookingApi.getAllOrders.bind(bookingApi);
export const getOrdersByCustomer = bookingApi.getOrdersByCustomer.bind(bookingApi);
export const getOrderById = bookingApi.getOrderById.bind(bookingApi);
export const getOrderStats = bookingApi.getOrderStats.bind(bookingApi);
export const createOrder = bookingApi.createOrder.bind(bookingApi);
export const updateOrder = bookingApi.updateOrder.bind(bookingApi);
export const cancelOrder = bookingApi.cancelOrder.bind(bookingApi);
export const assignDriver = bookingApi.assignDriver.bind(bookingApi);
export const exportOrderDetailsToExcel = bookingApi.exportOrderDetailsToExcel.bind(bookingApi);
export const exportCancelDetailsToExcel = bookingApi.exportCancelDetailsToExcel.bind(bookingApi);

// Export transform functions
export const transformBookingData = bookingApi.transformBookingData.bind(bookingApi);

// Export default instance
export default bookingApi;
