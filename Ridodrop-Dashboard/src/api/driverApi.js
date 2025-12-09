import API_CONFIG, { buildApiUrl, getApiHeaders } from './config';

// Driver/Rider API Service
class DriverApiService {
  constructor() {
    this.baseURL = import.meta.env.VITE_API_BASE_URL || 'https://ridodrop-backend-24-10-2025.onrender.com';
  }

  // Generic API request handler
  async apiRequest(url, options = {}) {
    try {
      console.log('🔥 Making Driver API request to:', url);
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
        console.log('✅ Driver API response received:', data);
        // Log first driver data structure for debugging
        if (data.users && data.users.length > 0) {
          console.log('📋 First driver data structure:', data.users[0]);
        }
        return data;
      }

      return await response.text();
    } catch (error) {
      console.error('Driver API Request Error:', error);
      throw error;
    }
  }

  // Get all drivers/riders with filters
  async getAllDrivers(filters = {}) {
    // Try to get from RiderSchema collection first (main source for rider registration data)
    try {
      const queryParams = new URLSearchParams();

      // Add filter parameters
      Object.keys(filters).forEach((key) => {
        if (filters[key] !== undefined && filters[key] !== '') {
          queryParams.append(key, filters[key]);
        }
      });

      const queryString = queryParams.toString();
      const riderUrl = buildApiUrl('/riders/all/riders') + (queryString ? `?${queryString}` : '');

      console.log('🔥 Fetching riders from:', riderUrl);
      const riderResponse = await this.apiRequest(riderUrl, { method: 'GET' });

      // If we get rider data, use it as primary source
      if (riderResponse.riders && riderResponse.riders.length > 0) {
        console.log('✅ Found riders in RiderSchema:', riderResponse.riders.length);
        console.log('🔍 First rider raw data sample:', riderResponse.riders[0]);
        console.log('🟢 First rider online fields:', {
          isOnline: riderResponse.riders[0]?.isOnline,
          online: riderResponse.riders[0]?.online,
          onlineStatus: riderResponse.riders[0]?.onlineStatus,
          status: riderResponse.riders[0]?.status
        });
        return {
          users: riderResponse.riders,
          pagination: riderResponse.pagination
        };
      }

      // Fallback to User collection with role=rider
      const userQueryParams = new URLSearchParams();
      userQueryParams.append('role', 'rider');

      Object.keys(filters).forEach((key) => {
        if (filters[key] !== undefined && filters[key] !== '') {
          userQueryParams.append(key, filters[key]);
        }
      });

      const userQueryString = userQueryParams.toString();
      const userUrl = buildApiUrl('/dev/all') + (userQueryString ? `?${userQueryString}` : '?role=rider');

      console.log('🔄 Fetching users with role=rider from:', userUrl);
      const userResponse = await this.apiRequest(userUrl, { method: 'GET' });

      return {
        users: userResponse.users || [],
        pagination: userResponse.pagination
      };
    } catch (error) {
      console.error('❌ Error fetching drivers from API:', error);

      // Return empty result on error to prevent UI breaking
      return {
        users: [],
        pagination: { page: 1, limit: 50, total: 0, pages: 0 }
      };
    }
  }

  // Get driver by ID
  async getDriverById(driverId) {
    console.log('🔍 Fetching driver by ID:', driverId);

    // Try Rider endpoint first (primary source for driver data)
    try {
      const riderUrl = buildApiUrl(`/riders/${driverId}`);
      console.log('🔍 Calling rider endpoint:', riderUrl);

      const response = await this.apiRequest(riderUrl, {
        method: 'GET'
      });

      console.log('✅ Driver data received from rider endpoint:', response);
      return response;
    } catch (riderError) {
      console.log('⚠️ Rider endpoint failed, trying user endpoint:', riderError.message);

      // Fallback to User endpoint
      try {
        const userUrl = buildApiUrl(`/dev/${driverId}`);
        console.log('� Calling user endpoint:', userUrl);

        const response = await this.apiRequest(userUrl, {
          method: 'GET'
        });

        console.log('✅ Driver data received from user endpoint:', response);
        return response;
      } catch (userError) {
        console.error('❌ Both endpoints failed:', userError);
        throw new Error('Driver not found in either Rider or User collection');
      }
    }
  }

  // Get driver from RiderSchema by phone
  async getDriverByPhone(phone) {
    const url = buildApiUrl(`/rider/get/rider?number=${phone}`);

    return this.apiRequest(url, {
      method: 'GET'
    });
  }

  // Create new driver
  async createDriver(driverData) {
    const url = buildApiUrl('/add');

    // Handle FormData for file uploads
    let body = driverData;
    let headers = {};

    if (!(driverData instanceof FormData)) {
      body = JSON.stringify({
        ...driverData,
        role: 'rider' // Ensure role is set to rider
      });
      headers['Content-Type'] = 'application/json';
    }

    return this.apiRequest(url, {
      method: 'POST',
      headers,
      body
    });
  }

  // Update driver
  async updateDriver(driverId, updateData) {
    const url = buildApiUrl(`/dev/${driverId}`);

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

  // Delete driver
  async deleteDriver(driverId) {
    console.log('🗑️ Attempting to delete driver:', driverId);

    // Try rider endpoint first
    try {
      const riderUrl = buildApiUrl(`/riders/${driverId}`);
      console.log('🗑️ Trying rider endpoint:', riderUrl);

      const response = await fetch(riderUrl, {
        method: 'DELETE',
        headers: getApiHeaders()
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Rider deleted successfully via rider endpoint');
        return data;
      }

      console.log('⚠️ Rider endpoint returned:', response.status);
    } catch (error) {
      console.log('⚠️ Rider endpoint error:', error.message);
    }

    // Fallback to user endpoint
    try {
      const userUrl = buildApiUrl(`/dev/${driverId}`);
      console.log('🔄 Trying user endpoint:', userUrl);

      const response = await fetch(userUrl, {
        method: 'DELETE',
        headers: getApiHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Rider deleted successfully via user endpoint');
      return data;
    } catch (error) {
      console.error('❌ Both endpoints failed:', error);
      throw error;
    }
  }

  // Block driver
  // Block driver
  async blockDriver(driverId, reason = '') {
    console.log('🚫 Attempting to block driver:', driverId, 'Reason:', reason);

    // Try rider endpoint first
    try {
      const riderUrl = buildApiUrl(`/riders/${driverId}/block`);
      console.log('🚫 Trying rider endpoint:', riderUrl);

      const response = await fetch(riderUrl, {
        method: 'PATCH',
        headers: {
          ...getApiHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Rider blocked successfully via rider endpoint');
        return data;
      }

      console.log('⚠️ Rider endpoint returned:', response.status);
    } catch (error) {
      console.log('⚠️ Rider endpoint error:', error.message);
    }

    // Fallback to user endpoint
    try {
      const userUrl = buildApiUrl(`/dev/${driverId}/block`);
      console.log('🔄 Trying user endpoint:', userUrl);

      const response = await fetch(userUrl, {
        method: 'PATCH',
        headers: {
          ...getApiHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Rider blocked successfully via user endpoint');
      return data;
    } catch (error) {
      console.error('❌ Both endpoints failed:', error);
      throw error;
    }
  }

  // Unblock driver
  async unblockDriver(driverId) {
    console.log('✅ Attempting to unblock driver:', driverId);

    // Try rider endpoint first
    try {
      const riderUrl = buildApiUrl(`/riders/${driverId}/unblock`);
      console.log('✅ Trying rider endpoint:', riderUrl);

      const response = await fetch(riderUrl, {
        method: 'PATCH',
        headers: getApiHeaders()
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Rider unblocked successfully via rider endpoint');
        return data;
      }

      console.log('⚠️ Rider endpoint returned:', response.status);
    } catch (error) {
      console.log('⚠️ Rider endpoint error:', error.message);
    }

    // Fallback to user endpoint
    try {
      const userUrl = buildApiUrl(`/dev/${driverId}/unblock`);
      console.log('🔄 Trying user endpoint:', userUrl);

      const response = await fetch(userUrl, {
        method: 'PATCH',
        headers: getApiHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Rider unblocked successfully via user endpoint');
      return data;
    } catch (error) {
      console.error('❌ Both endpoints failed:', error);
      throw error;
    }
  }

  // Get driver orders
  async getDriverOrders(driverId) {
    console.log('📦 Fetching orders for driver:', driverId);
    const url = buildApiUrl(`/all?riderId=${driverId}`);

    try {
      const response = await this.apiRequest(url, {
        method: 'GET'
      });

      console.log('✅ Driver orders received:', response);
      return response;
    } catch (error) {
      console.error('❌ Error fetching driver orders:', error);
      throw error;
    }
  }

  // Helper function to safely extract driver name
  extractDriverName(driver) {
    if (!driver) return 'Unknown Driver';

    // If it's already a string, return it
    if (typeof driver === 'string') return driver;

    // If it's an object, try to extract name properties
    if (typeof driver === 'object') {
      // Handle null object
      if (driver === null) return 'Unknown Driver';

      console.log('🔍 Extracting driver name from object:', driver);

      const firstName = typeof driver.name === 'string' ? driver.name : typeof driver.firstName === 'string' ? driver.firstName : '';
      const lastName = typeof driver.lname === 'string' ? driver.lname : typeof driver.lastName === 'string' ? driver.lastName : '';

      // If both first and last name exist and are different, combine them
      if (firstName && lastName && firstName !== lastName) {
        const fullName = `${firstName} ${lastName}`.trim();
        console.log('✅ Extracted full driver name:', fullName);
        return fullName;
      }

      // Return whichever name is available
      const extractedName = firstName || lastName || 'Unknown Driver';
      console.log('✅ Extracted driver name:', extractedName);
      return extractedName;
    }

    // Handle any other data type
    console.warn('⚠️ Unexpected driver data type:', typeof driver, driver);
    return 'Unknown Driver';
  }

  // Transform driver data to match frontend expectations
  transformDriverData(driver, index = 1) {
    console.log('🔄 Transforming driver data:', driver);

    // Handle if data comes wrapped in a response object
    const rawDriver = driver.rider || driver.user || driver;

    console.log('🟢 Online status fields:', {
      isOnline: rawDriver.isOnline,
      online: rawDriver.online,
      onlineStatus: rawDriver.onlineStatus,
      status: rawDriver.status
    });

    const driverName = this.extractDriverName(rawDriver);
    console.log('📝 Driver name extracted:', driverName);

    // Extract bank details if available
    const bankDetails = rawDriver.bank ||
      rawDriver.bankDetails || {
        accountNumber: rawDriver.accountNumber || 'N/A',
        ifsc: rawDriver.ifscCode || rawDriver.ifsc || 'N/A',
        bankName: rawDriver.bankName || 'N/A',
        branch: rawDriver.branch || 'N/A',
        holder: rawDriver.accountHolderName || driverName
      };

    // Extract vehicle details
    const vehicleDetails = rawDriver.vehicleDetails || {
      model: rawDriver.vehicleModel || 'N/A',
      registrationNumber: rawDriver.vehicleregisterNumber || rawDriver.vehicleNumber || 'N/A',
      color: rawDriver.vehicleColor || 'N/A',
      year: rawDriver.vehicleYear || 'N/A'
    };

    // Extract documents with fallbacks
    const documents = rawDriver.documents || rawDriver.images || {};

    const transformedData = {
      id: rawDriver._id,
      driverId: rawDriver.customerId || `DRV${rawDriver._id?.toString().slice(-6)}`,
      fullName: driverName,
      name: rawDriver.name,
      lname: rawDriver.lname,
      mobile: rawDriver.phone || rawDriver.mobile || rawDriver.altMobile || 'N/A',
      altMobile: rawDriver.phone || rawDriver.mobile,
      email: rawDriver.email || 'N/A',
      address: rawDriver.address || 'N/A',
      status: this.getDriverStatus(rawDriver),
      vehicleType: rawDriver.vehicleType || 'N/A',
      vehicleSubType: rawDriver.vehicleSubType || 'N/A',
      vehicleregisterNumber: rawDriver.vehicleregisterNumber || 'N/A',
      vehicleNumber: rawDriver.vehicleNumber || rawDriver.vehicleregisterNumber || 'N/A',
      fueltype: rawDriver.fueltype || 'N/A',
      fuelType: rawDriver.fuelType || rawDriver.fueltype || 'N/A',
      truckSize: rawDriver.truckSize || 'N/A',
      selectCity: rawDriver.selectCity || rawDriver.city || 'N/A',
      city: rawDriver.city || rawDriver.selectCity || 'N/A',
      online: rawDriver.isOnline || rawDriver.online || rawDriver.onlineStatus === 'online' || rawDriver.status === 'online' || false,
      licenseNumber: rawDriver.licenseNumber || 'N/A',
      aadharNumber: rawDriver.aadharNumber || 'N/A',
      panNumber: rawDriver.panNumber || 'N/A',
      rating: rawDriver.rating || 4.0,
      photo: rawDriver.profilePhoto || rawDriver.photo || documents.profilePhoto,
      walletBalance: rawDriver.walletBalance || rawDriver.wallet || 0,
      isBlocked: rawDriver.isBlocked,
      blockReason: rawDriver.blockReason || null,
      blockedAt: rawDriver.blockedAt || null,
      unblockedAt: rawDriver.unblockedAt || null,
      createdAt: rawDriver.createdAt,
      joiningDate: rawDriver.createdAt ? new Date(rawDriver.createdAt).toLocaleDateString() : 'N/A',
      // Additional fields for detail view
      totalOrders: rawDriver.totalOrders || 0,
      completedOrders: rawDriver.completedOrders || 0,
      cancelledOrders: rawDriver.cancelledOrders || 0,
      totalEarnings: rawDriver.totalEarnings || 0,
      lastActive: rawDriver.lastActive || rawDriver.updatedAt || 'N/A',
      // Structured data
      bank: bankDetails,
      bankDetails: bankDetails,
      vehicleDetails: vehicleDetails,
      documents: {
        aadharFront: documents.FrontaadharCard || documents.aadharFront || documents.aadharCardFront || documents.aadhar || null,
        aadharBack: documents.BackaadharCard || documents.aadharBack || documents.aadharCardBack || null,
        panCard: documents.panCard || documents.pan || null,
        drivingLicenseFront: documents.drivingLicenseFront || documents.licenseFront || documents.license || null,
        drivingLicenseBack: documents.drivingLicenseBack || documents.licenseBack || null,
        vehicleRcFront: documents.vehicleRcFront || documents.rcFront || documents.rc || null,
        vehicleRcBack: documents.vehicleRcBack || documents.rcBack || null,
        vehicleImageFront: documents.vehicleimageFront || documents.vehicleImageFront || documents.vehicleFront || null,
        vehicleImageBack: documents.vehicleimageBack || documents.vehicleImageBack || documents.vehicleBack || null,
        vehicleInsurance: documents.vehicleInsurence || documents.vehicleInsurance || documents.insurance || null,
        bankPassbook: documents.bankPassbook || documents.passbook || null,
        ownerSelfie: documents.ownerSelfie || documents.selfie || documents.profilePhoto || null
      },
      // Orders placeholder (will be loaded separately if needed)
      orders: {
        '2W': [],
        '3W': [],
        Truck: []
      },
      // Transactions placeholder
      transactions: [],
      // Current order placeholder
      currentOrder: null,
      // Document status
      documentStatus: this.getDocumentStatus(rawDriver),
      // Document rejection reasons (if any)
      documentRejectionReasons: rawDriver.documentRejectionReasons || {},
      rejectionReason: rawDriver.rejectionReason || null,
      documentApprovals: rawDriver.documentApprovals || {},
      // Raw data for debugging
      _raw: rawDriver
    };

    console.log('✅ Transformed driver data:', transformedData);
    console.log('🟢 Final online status:', transformedData.online);
    console.log('📄 Document Status:', transformedData.documentStatus);
    console.log('❌ Rejection Reason:', transformedData.rejectionReason);
    return transformedData;
  }

  // Get driver status based on various fields
  getDriverStatus(driver) {
    if (driver.isBlocked === true || driver.isBlocked === 'true') return 'Blocked';
    if (driver.status === 'Inactive') return 'Inactive';
    if (driver.documentStatus === 'verified') return 'Approved';
    if (driver.documentStatus === 'pending') return 'Pending';
    return 'Active';
  }

  // Get document status
  getDocumentStatus(driver) {
    // First check if backend has set the documentStatus
    if (driver.documentStatus && driver.documentStatus !== 'Pending') {
      return driver.documentStatus;
    }

    // Check if any document is rejected
    if (driver.documentApprovals) {
      const approvals = driver.documentApprovals;

      // If documentApprovals is a Map object, convert to array of values
      const approvalValues = approvals instanceof Map ? Array.from(approvals.values()) : Object.values(approvals);

      // Check if any document is rejected
      const hasRejected = approvalValues.some((status) => status === 'rejected' || status === 'Rejected');

      if (hasRejected) {
        return 'Rejected';
      }

      // Check if all documents are approved
      const hasApproved = approvalValues.some((status) => status === 'approved' || status === 'Approved');

      if (hasApproved) {
        return 'Approved';
      }
    }

    // Check if driver has documents uploaded
    if (driver.documents || driver.images) {
      return 'Pending';
    }

    return 'Pending';
  }

  // Transform vehicle type
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

  // Approve driver documents
  async approveDriverDocuments(driverId) {
    console.log('✅ Attempting to approve documents for driver:', driverId);

    // Try multiple endpoints for document approval
    const endpoints = [
      { name: 'Riders approve endpoint', url: buildApiUrl(`/riders/${driverId}/approve`), method: 'PATCH' },
      { name: 'Riders verify endpoint', url: buildApiUrl(`/riders/${driverId}/verify`), method: 'PATCH' },
      {
        name: 'Dev update endpoint',
        url: buildApiUrl(`/dev/${driverId}`),
        method: 'PUT',
        body: { documentStatus: 'Approved', status: 'Approved' }
      }
    ];

    for (const endpoint of endpoints) {
      try {
        console.log(`✅ Trying ${endpoint.name}:`, endpoint.url);

        const options = {
          method: endpoint.method,
          headers: {
            ...getApiHeaders(),
            'Content-Type': 'application/json'
          }
        };

        if (endpoint.body) {
          options.body = JSON.stringify(endpoint.body);
        }

        const response = await fetch(endpoint.url, options);

        if (response.ok) {
          const data = await response.json();
          console.log(`✅ Documents approved successfully via ${endpoint.name}`);
          return data;
        }

        console.log(`⚠️ ${endpoint.name} returned:`, response.status);
      } catch (error) {
        console.log(`⚠️ ${endpoint.name} error:`, error.message);
      }
    }

    throw new Error('Failed to approve documents through any endpoint');
  }

  // Reject driver documents
  async rejectDriverDocuments(driverId, reason = '') {
    console.log('❌ Attempting to reject documents for driver:', driverId);

    // Try multiple endpoints for document rejection
    const endpoints = [
      { name: 'Riders reject endpoint', url: buildApiUrl(`/riders/${driverId}/reject`), method: 'PATCH', body: { reason } },
      {
        name: 'Dev update endpoint',
        url: buildApiUrl(`/dev/${driverId}`),
        method: 'PUT',
        body: { documentStatus: 'rejected', status: 'Rejected', rejectionReason: reason }
      }
    ];

    for (const endpoint of endpoints) {
      try {
        console.log(`❌ Trying ${endpoint.name}:`, endpoint.url);

        const options = {
          method: endpoint.method,
          headers: {
            ...getApiHeaders(),
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(endpoint.body)
        };

        const response = await fetch(endpoint.url, options);

        if (response.ok) {
          const data = await response.json();
          console.log(`✅ Documents rejected successfully via ${endpoint.name}`);
          return data;
        }

        console.log(`⚠️ ${endpoint.name} returned:`, response.status);
      } catch (error) {
        console.log(`⚠️ ${endpoint.name} error:`, error.message);
      }
    }

    throw new Error('Failed to reject documents through any endpoint');
  }

  // Approve individual document
  async approveIndividualDocument(driverId, documentField) {
    console.log('✅ Approving individual document:', { driverId, documentField });

    const url = buildApiUrl(`/riders/${driverId}/approve-document`);

    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        ...getApiHeaders(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ documentField })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Individual document approved:', data);
    return data;
  }

  // Reject individual document
  async rejectIndividualDocument(driverId, documentField, reason) {
    console.log('❌ Rejecting individual document:', { driverId, documentField, reason });

    const url = buildApiUrl(`/riders/${driverId}/reject-document`);

    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        ...getApiHeaders(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ documentField, reason })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Individual document rejected:', data);
    return data;
  }

  // Upload/Update driver document
  async uploadDriverDocument(driverId, documentField, file) {
    console.log('📤 Uploading document:', { driverId, documentField, fileName: file.name });

    const formData = new FormData();
    formData.append('phone', driverId); // The backend expects phone field

    // Map frontend field names to backend field names
    const fieldMapping = {
      aadharFront: 'FrontaadharCard',
      aadharBack: 'BackaadharCard',
      panCard: 'panCard',
      drivingLicenseFront: 'drivingLicenseFront',
      drivingLicenseBack: 'drivingLicenseBack',
      vehicleRcFront: 'vehicleRcFront',
      vehicleRcBack: 'vehicleRcBack',
      vehicleImageFront: 'vehicleimageFront',
      vehicleImageBack: 'vehicleimageBack',
      vehicleInsurance: 'vehicleInsurence',
      bankPassbook: 'bankPassbook',
      ownerSelfie: 'profilePhoto'
    };

    const backendFieldName = fieldMapping[documentField] || documentField;
    formData.append(backendFieldName, file);

    const url = buildApiUrl('/riders/update/rider');

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: getApiHeaders(), // Don't set Content-Type, let browser set it with boundary
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Document uploaded successfully:', data);
      return data;
    } catch (error) {
      console.error('❌ Error uploading document:', error);
      throw error;
    }
  }

  // Get document URL (constructs full URL for viewing/downloading)
  getDocumentUrl(documentPath) {
    if (!documentPath || documentPath === 'N/A' || documentPath === null) {
      return null;
    }

    // If it's already a full URL, return it
    if (documentPath.startsWith('http://') || documentPath.startsWith('https://')) {
      return documentPath;
    }

    // Otherwise, construct the URL with the base URL
    return `${this.baseURL}/${documentPath}`;
  }

  /**
   * Export drivers data to Excel format
   */
  async exportDriversToExcel(filters = {}) {
    try {
      console.log('📊 Exporting drivers to Excel with filters:', filters);

      const queryParams = new URLSearchParams();
      if (filters.vehicleType) queryParams.append('vehicleType', filters.vehicleType);
      if (filters.city) queryParams.append('city', filters.city);
      if (filters.isBlocked !== undefined) queryParams.append('isBlocked', filters.isBlocked);

      const response = await fetch(`${this.baseURL}/api/v1/riders/export/excel?${queryParams}`, {
        method: 'GET'
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Export failed:', response.status, errorText);
        throw new Error(`Failed to export drivers: ${response.statusText}`);
      }

      // Get the blob from response
      const blob = await response.blob();

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `drivers_data_${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      console.log('✅ Drivers Excel file downloaded successfully');
      return { success: true, message: 'File downloaded successfully' };
    } catch (error) {
      console.error('❌ Error exporting drivers to Excel:', error);
      throw error;
    }
  }

  /**
   * Export drivers documents data
   */
  async exportDriversDocuments(filters = {}) {
    try {
      console.log('📄 Exporting drivers documents with filters:', filters);

      const queryParams = new URLSearchParams();
      if (filters.vehicleType) queryParams.append('vehicleType', filters.vehicleType);
      if (filters.city) queryParams.append('city', filters.city);
      if (filters.documentStatus) queryParams.append('documentStatus', filters.documentStatus);

      const response = await fetch(`${this.baseURL}/api/v1/riders/export/documents?${queryParams}`, {
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
      link.setAttribute('download', `drivers_documents_${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      console.log('✅ Documents Excel file downloaded successfully');
      return { success: true, message: 'File downloaded successfully' };
    } catch (error) {
      console.error('❌ Error exporting drivers documents:', error);
      throw error;
    }
  }
}

// Create singleton instance
const driverApi = new DriverApiService();

// Export methods as named exports
export const getAllDrivers = driverApi.getAllDrivers.bind(driverApi);
export const getDriverById = driverApi.getDriverById.bind(driverApi);
export const getDriverByPhone = driverApi.getDriverByPhone.bind(driverApi);
export const getDriverOrders = driverApi.getDriverOrders.bind(driverApi);
export const createDriver = driverApi.createDriver.bind(driverApi);
export const updateDriver = driverApi.updateDriver.bind(driverApi);
export const deleteDriver = driverApi.deleteDriver.bind(driverApi);
export const blockDriver = driverApi.blockDriver.bind(driverApi);
export const unblockDriver = driverApi.unblockDriver.bind(driverApi);
export const approveDriverDocuments = driverApi.approveDriverDocuments.bind(driverApi);
export const rejectDriverDocuments = driverApi.rejectDriverDocuments.bind(driverApi);
export const approveIndividualDocument = driverApi.approveIndividualDocument.bind(driverApi);
export const rejectIndividualDocument = driverApi.rejectIndividualDocument.bind(driverApi);
export const uploadDriverDocument = driverApi.uploadDriverDocument.bind(driverApi);
export const getDocumentUrl = driverApi.getDocumentUrl.bind(driverApi);
export const exportDriversToExcel = driverApi.exportDriversToExcel.bind(driverApi);
export const exportDriversDocuments = driverApi.exportDriversDocuments.bind(driverApi);

// Export transform functions
export const transformDriverData = driverApi.transformDriverData.bind(driverApi);

// Export default instance
export default driverApi;
