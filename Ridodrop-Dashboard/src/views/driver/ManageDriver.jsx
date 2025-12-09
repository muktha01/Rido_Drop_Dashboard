import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Tabs,
  Tab,
  Chip,
  CircularProgress,
  Snackbar,
  Alert,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Pagination,
  Stack
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import CancelIcon from '@mui/icons-material/Cancel';
import BarChartIcon from '@mui/icons-material/BarChart';
import BlockIcon from '@mui/icons-material/Block';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import DescriptionIcon from '@mui/icons-material/Description';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import DownloadIcon from '@mui/icons-material/Download';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import Rating from '@mui/material/Rating';
import Link from '@mui/material/Link';
import { useDrivers } from '../../hooks/useDrivers';
import { getAllOrders } from '../../api/bookingApi';
import referralApi from '../../api/referralApi';
import {
  approveDriverDocuments,
  rejectDriverDocuments,
  approveIndividualDocument,
  rejectIndividualDocument,
  exportDriversToExcel,
  exportDriversDocuments
} from '../../api/driverApi';

const tabLabels = [
  'Profile Details',
  'Order Details',

  'Documents', // Renamed from 'Cancel Details'
  'Data Analyze',
  'Block ID',
  'High Orders',
  'Wallet',
  'Refer And Earn'
  // 'Download Invoice'
  // 'Live Order'
];

const tabIcons = [
  <AccountCircleIcon fontSize="medium" />, // Profile Details
  <DirectionsCarIcon fontSize="medium" />, // Order Details
  <DescriptionIcon fontSize="medium" />, // Documents (changed icon)
  <BarChartIcon fontSize="medium" />, // Data Analyze
  <BlockIcon fontSize="medium" />, // Block ID
  <TrendingUpIcon fontSize="medium" />, // High Orders
  <AccountBalanceWalletIcon fontSize="medium" />, // Wallet
  <GroupAddIcon fontSize="medium" />, // Refer And Earn
  <DescriptionIcon fontSize="medium" /> // Download Invoice
];

const vehicleTypes = ['2W', '3W', 'Truck'];

const initialDrivers = [
  {
    id: 1,
    driverId: 'DRV001',
    fullName: 'John Doe',
    altMobile: '9876543210',
    email: 'john.doe@example.com',
    address: '123 Main St, City A',
    status: 'Approved',
    vehicleType: '2W',
    online: true,
    licenseNumber: 'DL-123456',
    aadharNumber: '1234-5678-9012',
    panNumber: 'ABCDE1234F',
    rating: 4.5,
    photo: 'https://randomuser.me/api/portraits/men/1.jpg',
    documents: {
      aadharFront: 'aadhar_front_john.jpg',
      aadharBack: 'aadhar_back_john.jpg',
      pan: 'pan_john.jpg',
      selfie: 'selfie_john.jpg',
      vehicleRcFront: 'rc_front_john.jpg',
      vehicleRcBack: 'rc_back_john.jpg',
      vehicleImageFront: 'vehicle_front_john.jpg',
      vehicleImageBack: 'vehicle_back_john.jpg',
      vehicleInsurance: 'insurance_john.jpg',
      licenseFront: 'license_front_john.jpg',
      licenseBack: 'license_back_john.jpg'
    },
    order: { id: 'ORD123', item: 'Parcel', status: 'In Transit' },
    location: { pickup: 'Sector 10, City A', drop: 'Sector 22, City B' },
    documentStatus: 'Pending',
    createdAt: '2024-06-10' // Example date
  },
  {
    id: 2,
    driverId: 'DRV002',
    fullName: 'Jane Smith',
    altMobile: '9123456780',
    email: 'jane.smith@example.com',
    address: '456 Market Rd, City B',
    status: 'Pending',
    vehicleType: '3W',
    online: false,
    licenseNumber: 'DL-654321',
    aadharNumber: '2345-6789-0123',
    panNumber: 'XYZAB9876K',
    rating: 3.8,
    photo: 'https://randomuser.me/api/portraits/women/2.jpg',
    documents: { aadhar: 'aadhar_jane.pdf', pan: 'pan_jane.pdf', license: 'license_jane.pdf' },
    order: { id: 'ORD124', item: 'Groceries', status: 'Delivered' },
    location: { pickup: 'Market Road, City C', drop: 'Mall Road, City D' },
    documentStatus: 'Pending',
    createdAt: '2024-06-09'
  },
  {
    id: 3,
    driverId: 'DRV003',
    fullName: 'Amit Kumar',
    altMobile: '9988776655',
    email: 'amit.kumar@example.com',
    address: '789 Warehouse Ln, City C',
    status: 'Suspended',
    vehicleType: 'Truck',
    online: false,
    licenseNumber: 'DL-789012',
    aadharNumber: '3456-7890-1234',
    panNumber: 'LMNOP5432Q',
    rating: 4.0,
    photo: 'https://randomuser.me/api/portraits/men/3.jpg',
    documents: { aadhar: 'aadhar_amit.pdf', pan: 'pan_amit.pdf', license: 'license_amit.pdf' },
    order: { id: 'ORD125', item: 'Furniture', status: 'Pending' },
    location: { pickup: 'Warehouse 1', drop: 'Shop 5, City E' },
    documentStatus: 'Pending',
    createdAt: '2024-06-11'
  },
  {
    id: 4,
    driverId: 'DRV004',
    fullName: 'Priya Singh',
    altMobile: '9876512345',
    email: 'priya.singh@example.com',
    address: '321 Park Ave, City D',
    status: 'Approved',
    vehicleType: '2W',
    online: true,
    licenseNumber: 'DL-456789',
    aadharNumber: '4567-8901-2345',
    panNumber: 'QRSTU6789V',
    rating: 4.2,
    photo: 'https://randomuser.me/api/portraits/women/4.jpg',
    documents: { aadhar: 'aadhar_priya.pdf', pan: 'pan_priya.pdf', license: 'license_priya.pdf' },
    order: { id: 'ORD126', item: 'Electronics', status: 'In Transit' },
    location: { pickup: 'Tech Park, City F', drop: 'Residential Area, City G' },
    documentStatus: 'Pending',
    createdAt: '2024-06-08'
  },
  {
    id: 5,
    driverId: 'DRV005',
    fullName: 'Rohit Sharma',
    altMobile: '9123456790',
    email: 'rohit.sharma@example.com',
    address: '654 Business Rd, City E',
    status: 'Approved',
    vehicleType: '3W',
    online: true,
    licenseNumber: 'DL-321098',
    aadharNumber: '5678-9012-3456',
    panNumber: 'VWXYZ1234A',
    rating: 4.7,
    photo: 'https://randomuser.me/api/portraits/men/5.jpg',
    documents: { aadhar: 'aadhar_rohit.pdf', pan: 'pan_rohit.pdf', license: 'license_rohit.pdf' },
    order: { id: 'ORD127', item: 'Food', status: 'Delivered' },
    location: { pickup: 'Restaurant Row, City H', drop: 'Office Complex, City I' },
    documentStatus: 'Pending',
    createdAt: '2024-06-12'
  }
];

// Dummy order data for different vehicle types
const orderData = {
  '2W': [
    {
      driverId: 'DRV001',
      driverName: 'John Doe',
      orderId: 'ORD001',
      vehicleType: '2W',
      status: 'Completed',
      amount: 150,
      date: '2024-01-15',
      pickup: 'Mumbai Central',
      drop: 'Andheri West'
    },
    {
      driverId: 'DRV004',
      driverName: 'Priya Singh',
      orderId: 'ORD004',
      vehicleType: '2W',
      status: 'Completed',
      amount: 120,
      date: '2024-01-18',
      pickup: 'Kurla West',
      drop: 'Ghatkopar'
    }
  ],
  '3W': [
    {
      driverId: 'DRV002',
      driverName: 'Jane Smith',
      orderId: 'ORD002',
      vehicleType: '3W',
      status: 'Canceled',
      amount: 200,
      date: '2024-01-16',
      pickup: 'Bandra East',
      drop: 'Juhu'
    },
    {
      driverId: 'DRV005',
      driverName: 'Rohit Sharma',
      orderId: 'ORD005',
      vehicleType: '3W',
      status: 'Completed',
      amount: 250,
      date: '2024-01-15',
      pickup: 'Thane West',
      drop: 'Mulund'
    }
  ],
  Truck: [
    {
      driverId: 'DRV003',
      driverName: 'Amit Kumar',
      orderId: 'ORD003',
      vehicleType: 'Truck',
      status: 'Completed',
      amount: 800,
      date: '2024-01-15',
      pickup: 'Mumbai Port',
      drop: 'Bhiwandi'
    }
  ]
};

const documentFields = [
  { key: 'aadharFront', label: 'Aadhar Card Front' },
  { key: 'aadharBack', label: 'Aadhar Card Back' },
  { key: 'pan', label: 'PAN Card' },
  { key: 'selfie', label: 'Selfie' },
  { key: 'vehicleRcFront', label: 'Vehicle RC Front' },
  { key: 'vehicleRcBack', label: 'Vehicle RC Back' },
  { key: 'vehicleImageFront', label: 'Vehicle Image Front' },
  { key: 'vehicleImageBack', label: 'Vehicle Image Back' },
  { key: 'vehicleInsurance', label: 'Vehicle Insurance' },
  { key: 'licenseFront', label: 'Driving License Front' },
  { key: 'licenseBack', label: 'Driving License Back' }
];

const ManageDriver = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);
  const [vehicleTypeTab, setVehicleTypeTab] = useState(0);

  // Use the custom hook for driver data
  const {
    drivers,
    loading,
    error,
    pagination,
    stats,
    actions: {
      fetchDrivers,
      getDriverById,
      getDriverOrders,
      updateDriver,
      deleteDriver,
      blockDriver,
      unblockDriver,
      searchDrivers,
      changePage,
      clearError
    }
  } = useDrivers();

  // State for driver orders from booking API
  const [driverOrders, setDriverOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [profileDetailsSearchTerm, setProfileDetailsSearchTerm] = useState('');
  const [orderDetailsSearchTerm, setOrderDetailsSearchTerm] = useState('');
  const [orderDateFilter, setOrderDateFilter] = useState('all'); // 'all', 'today', 'week', 'month', 'custom'
  const [orderCustomDate, setOrderCustomDate] = useState('');
  const [orderPage, setOrderPage] = useState(0);
  const [orderRowsPerPage, setOrderRowsPerPage] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [formMode, setFormMode] = useState('add');
  const [formDriver, setFormDriver] = useState({});
  const [deleteId, setDeleteId] = useState(null);
  const [deleteDriver_toDelete, setDeleteDriver_toDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [viewDocDialog, setViewDocDialog] = useState({ open: false, title: '', src: '', fieldKey: '', driver: null });
  const [docSearchTerm, setDocSearchTerm] = useState('');
  const [docDateFilter, setDocDateFilter] = useState('all'); // 'all', 'today', 'week', 'month', 'custom'
  const [docCustomStart, setDocCustomStart] = useState('');
  const [docCustomEnd, setDocCustomEnd] = useState('');
  const [dataAnalyzeSearchTerm, setDataAnalyzeSearchTerm] = useState('');
  // Track individual document approvals: { driverId: { fieldKey: 'approved' | 'rejected' | 'pending' } }
  const [documentApprovals, setDocumentApprovals] = useState({});
  // State for All Documents Dialog
  const [openAllDocsDialog, setOpenAllDocsDialog] = useState(false);
  const [selectedDriverForDocs, setSelectedDriverForDocs] = useState(null);
  // State for rejection reasons
  const [documentRejectionReasons, setDocumentRejectionReasons] = useState({});

  // Helper function to safely extract driver name
  const safeExtractDriverName = (driver) => {
    if (!driver) return 'Unknown Driver';

    // If it's already a string, return it
    if (typeof driver === 'string') return driver;

    // If it's an object, try to extract name properties
    if (typeof driver === 'object') {
      // Handle null object
      if (driver === null) return 'Unknown Driver';

      // Try different name field combinations
      const firstName = driver.name || driver.firstName || driver.fname || '';
      const lastName = driver.lname || driver.lastName || driver.last_name || '';

      // If both first and last name exist and are different, combine them
      if (firstName && lastName && firstName !== lastName) {
        const fullName = `${firstName} ${lastName}`.trim();
        return fullName;
      }

      // Return whichever name is available
      const extractedName = firstName || lastName || 'Unknown Driver';
      return extractedName;
    }

    // Handle any other data type
    return 'Unknown Driver';
  };

  // Helper function to get driver status color (first definition)
  const getStatusColorNew = (status) => {
    const statusColors = {
      Approved: 'success',
      Active: 'success',
      Pending: 'warning',
      Blocked: 'error',
      Inactive: 'default'
    };
    return statusColors[status] || 'default';
  };

  // Helper function to get document URL
  const getDocumentUrl = (driver, fieldKey) => {
    if (!driver) {
      console.log('⚠️ No driver provided to getDocumentUrl');
      return null;
    }

    // Check multiple possible locations for documents
    const docs = driver.documents || driver.images || driver._raw?.documents || driver._raw?.images;

    if (!docs) {
      console.warn(`⚠️ No documents found for driver ${driver.driverId || driver.id}`);
      console.log('Available driver fields:', Object.keys(driver));
      return null;
    }

    console.log(`📋 Checking ${fieldKey} for driver ${driver.driverId}. Available document keys:`, Object.keys(docs));

    // Try to get the document by the field key
    let docUrl = docs[fieldKey];

    // If not found, try alternative naming conventions
    if (!docUrl) {
      // Map common alternative names
      const alternativeKeys = {
        aadharFront: ['aadharCardFront', 'aadhar_front', 'aadhaarFront', 'aadharFrontImage', 'aadhaar_front', 'aadhar'],
        aadharBack: ['aadharCardBack', 'aadhar_back', 'aadhaarBack', 'aadharBackImage', 'aadhaar_back'],
        pan: ['panCard', 'pan_card', 'panImage', 'panCardImage'],
        selfie: ['selfieImage', 'selfie_image', 'photo', 'profilePic', 'profilePhoto', 'driverPhoto'],
        vehicleRcFront: ['rcFront', 'rc_front', 'vehicleRC', 'rcFrontImage', 'rc', 'vehicleRCFront'],
        vehicleRcBack: ['rcBack', 'rc_back', 'rcBackImage', 'vehicleRCBack'],
        vehicleImageFront: ['vehicleFront', 'vehicle_front', 'vehicleFrontImage', 'vehiclePhoto', 'vehicleImage'],
        vehicleImageBack: ['vehicleBack', 'vehicle_back', 'vehicleBackImage'],
        vehicleInsurance: ['insurance', 'vehicleInsuranceDoc', 'insuranceImage', 'insuranceCertificate', 'vehicleInsuranceImage'],
        licenseFront: ['drivingLicenseFront', 'license_front', 'dlFront', 'licenseFrontImage', 'license', 'drivingLicense'],
        licenseBack: ['drivingLicenseBack', 'license_back', 'dlBack', 'licenseBackImage']
      };

      const alternatives = alternativeKeys[fieldKey] || [];
      for (const altKey of alternatives) {
        if (docs[altKey]) {
          docUrl = docs[altKey];
          console.log(`✅ Found ${fieldKey} using alternative key: ${altKey}`);
          break;
        }
      }
    } else {
      console.log(`✅ Found ${fieldKey} directly in documents`);
    }

    if (!docUrl) {
      console.warn(`❌ No URL found for ${fieldKey}`);
      return null;
    }

    // If it's already a full URL, return it
    if (typeof docUrl === 'string' && (docUrl.startsWith('http://') || docUrl.startsWith('https://'))) {
      console.log(`✅ Using full URL for ${fieldKey}:`, docUrl);
      return docUrl;
    }

    // If it's a relative path, construct the full URL
    const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://ridodrop-backend-24-10-2025.onrender.com';
    const cleanPath = docUrl.replace(/^\/+/, ''); // Remove leading slashes
    const fullUrl = `${baseURL}/${cleanPath}`.replace(/([^:]\/)\/+/g, '$1'); // Remove double slashes

    console.log(`✅ Constructed URL for ${fieldKey}:`, fullUrl);
    return fullUrl;
  };

  // Helper function to check if driver is online
  const isDriverOnline = (driver) => {
    if (!driver) return false;

    // Check multiple possible fields for online status
    const online =
      driver.online ||
      driver.isOnline ||
      driver.onlineStatus === 'online' ||
      driver.status === 'online' ||
      driver._raw?.isOnline ||
      driver._raw?.online ||
      driver._raw?.onlineStatus === 'online' ||
      driver._raw?.status === 'online';

    return Boolean(online);
  }; // Show snackbar message
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  // Fetch driver orders from booking API
  const fetchDriverOrders = async () => {
    setOrdersLoading(true);
    try {
      const response = await getAllOrders();
      console.log('📦 Driver orders response:', response);
      console.log('📊 Total orders received:', response.bookings?.length);

      // Filter orders that have assigned riders
      const ordersWithDrivers = response.bookings?.filter((booking) => booking.rider) || [];
      console.log('🚗 Orders with assigned drivers:', ordersWithDrivers.length);

      // Debug: Log vehicle types distribution
      if (ordersWithDrivers.length > 0) {
        const vehicleTypeCounts = ordersWithDrivers.reduce((acc, order) => {
          const vType = order.vehicleType || 'Unknown';
          acc[vType] = (acc[vType] || 0) + 1;
          return acc;
        }, {});
        console.log('🚗 Vehicle type distribution in driver orders:', vehicleTypeCounts);
        console.log('📋 First order sample:', {
          orderId: ordersWithDrivers[0]?.orderId || ordersWithDrivers[0]?._id,
          vehicleType: ordersWithDrivers[0]?.vehicleType,
          driver: ordersWithDrivers[0]?.rider?.name,
          status: ordersWithDrivers[0]?.status
        });
      }

      setDriverOrders(ordersWithDrivers);
    } catch (error) {
      console.error('❌ Error fetching driver orders:', error);
      showSnackbar('Failed to fetch driver orders', 'error');
    } finally {
      setOrdersLoading(false);
    }
  };
  const filteredDataAnalyzeDrivers = drivers.filter(
    (driver) =>
      safeExtractDriverName(driver).toLowerCase().includes(dataAnalyzeSearchTerm.toLowerCase()) ||
      (driver.driverId || '').toLowerCase().includes(dataAnalyzeSearchTerm.toLowerCase())
  );

  // Filter drivers based on search term
  const filteredProfileDetailsDrivers = drivers.filter(
    (driver) =>
      safeExtractDriverName(driver).toLowerCase().includes(profileDetailsSearchTerm.toLowerCase()) ||
      (driver.driverId || '').toLowerCase().includes(profileDetailsSearchTerm.toLowerCase()) ||
      (driver.altMobile || driver.phone || '').includes(profileDetailsSearchTerm)
  );

  // Filter order data based on search term and vehicle type
  const getFilteredOrderData = (vehicleType) => {
    // Filter driver orders by vehicle type, search term, and date
    console.log('🔍 Filtering driver orders for vehicle type:', vehicleType);
    console.log('📦 Total driver orders:', driverOrders.length);
    console.log('🔍 Search term:', orderDetailsSearchTerm);
    console.log('📅 Date filter:', orderDateFilter);

    return driverOrders.filter((order) => {
      // Normalize the order's vehicle type for comparison
      const orderVehicleType = (order.vehicleType || '').toUpperCase().trim();
      const selectedVehicleType = vehicleType.toUpperCase().trim();

      // Exact match for vehicle type
      const matchesVehicleType = orderVehicleType === selectedVehicleType;

      // Enhanced search: Check if order matches search term (Vehicle Registration, Rider Mobile, Rider Name)
      const riderPhone = order.rider?.phone || order.rider?.mobile || '';
      const riderName = safeExtractDriverName(order.rider).toLowerCase();
      const vehicleReg = (
        order.rider?.vehicleregisterNumber ||
        order.driver?.vehicleregisterNumber ||
        order.rider?.vehicleNumber ||
        order.rider?.vehicleRegistrationNumber ||
        ''
      ).toLowerCase();
      const searchLower = orderDetailsSearchTerm.toLowerCase();

      const matchesSearch =
        !orderDetailsSearchTerm ||
        riderPhone.includes(orderDetailsSearchTerm) ||
        riderName.includes(searchLower) ||
        vehicleReg.includes(searchLower);

      // Date filtering
      let matchesDate = true;
      if (orderDateFilter !== 'all') {
        const orderDate = new Date(order.createdAt || order.date);
        const now = new Date();

        if (orderDateFilter === 'today') {
          matchesDate = orderDate.toDateString() === now.toDateString();
        } else if (orderDateFilter === 'week') {
          const weekAgo = new Date(now);
          weekAgo.setDate(now.getDate() - 7);
          matchesDate = orderDate >= weekAgo && orderDate <= now;
        } else if (orderDateFilter === 'month') {
          matchesDate = orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
        } else if (orderDateFilter === 'custom' && orderCustomDate) {
          matchesDate = orderDate.toDateString() === new Date(orderCustomDate).toDateString();
        }
      }

      const result = matchesVehicleType && matchesSearch && matchesDate;

      if (matchesVehicleType && matchesSearch && matchesDate) {
        console.log('✅ Match found:', order.bookingId || order._id, orderVehicleType);
      }

      return result;
    });
  };

  // Handler for opening driver details dialog
  const handleOpenDialog = (driver) => {
    setSelectedDriver(driver);
    setOpenDialog(true);
  };

  // Handler for navigating to driver detail page
  const handleDriverClick = (driver) => {
    // Use the actual MongoDB _id for navigation, not the custom driverId
    const driverId = driver._id || driver.id;
    console.log('🔍 Navigating to driver detail:', {
      driverId,
      driverIdField: driver.driverId,
      fullDriver: driver
    });
    navigate(`/dashboard/drivers/${driverId}`);
  };

  // Handle error state
  useEffect(() => {
    if (error) {
      showSnackbar(error, 'error');
      clearError();
    }
  }, [error, clearError]);

  // Fetch driver orders when component mounts
  useEffect(() => {
    fetchDriverOrders();
  }, []);

  // Debug logging for driver data
  useEffect(() => {
    if (drivers && drivers.length > 0) {
      console.log('🚗 Drivers data received:', drivers);
      console.log('👤 First driver structure:', drivers[0]);
      console.log('📝 First driver name extraction:', safeExtractDriverName(drivers[0]));
      console.log('📄 First driver documents:', drivers[0]?.documents);
      console.log('📄 First driver images:', drivers[0]?.images);
      console.log('📄 First driver _raw.documents:', drivers[0]?._raw?.documents);
      console.log('📄 First driver _raw.images:', drivers[0]?._raw?.images);
      console.log('🟢 First driver online status:', {
        online: drivers[0]?.online,
        isOnline: drivers[0]?.isOnline,
        onlineStatus: drivers[0]?.onlineStatus,
        _raw_isOnline: drivers[0]?._raw?.isOnline,
        _raw_online: drivers[0]?._raw?.online,
        _raw_onlineStatus: drivers[0]?._raw?.onlineStatus,
        _raw_status: drivers[0]?._raw?.status
      });

      // Count online drivers
      const onlineCount = drivers.filter((d) => d.online).length;
      console.log(`🟢 Online drivers: ${onlineCount} / ${drivers.length}`);
    }
  }, [drivers]);

  // Pagination handlers for orders
  const handleOrderPageChange = (event, newPage) => {
    setOrderPage(newPage);
  };

  const handleOrderRowsPerPageChange = (event) => {
    setOrderRowsPerPage(parseInt(event.target.value, 10));
    setOrderPage(0);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedDriver(null);
  };

  // Reset order page when search term or vehicle type changes
  useEffect(() => {
    setOrderPage(0);
  }, [orderDetailsSearchTerm, vehicleTypeTab]);

  // Add/Edit form handlers
  const handleOpenForm = (mode, driver = {}) => {
    setFormMode(mode);
    setFormDriver(driver);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setFormDriver({});
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormDriver((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formMode === 'add') {
        // Note: The backend expects specific fields for driver creation
        // You may need to adjust this based on your backend schema
        await updateDriver(formDriver.id || formDriver._id, formDriver);
        showSnackbar('Driver added successfully!', 'success');
      } else if (formMode === 'edit') {
        await updateDriver(formDriver.id || formDriver._id, formDriver);
        showSnackbar('Driver updated successfully!', 'success');
      }
      handleCloseForm();
    } catch (error) {
      console.error('Form submission error:', error);
      showSnackbar('Failed to save driver', 'error');
    }
  };

  // Delete handlers
  const handleDelete = (id, driver = null) => {
    console.log('🗑️ Delete clicked for driver ID:', id);
    setDeleteId(id);
    setDeleteDriver_toDelete(driver);
  };

  const confirmDelete = async () => {
    try {
      console.log('🗑️ Attempting to delete driver with ID:', deleteId);
      await deleteDriver(deleteId);
      showSnackbar('Driver deleted successfully!', 'info');
      setDeleteId(null);
      setDeleteDriver_toDelete(null);
      // Refresh the driver list
      fetchDrivers();
    } catch (error) {
      console.error('❌ Delete driver error:', error);
      showSnackbar(error.message || 'Failed to delete driver', 'error');
    }
  };

  const cancelDelete = () => {
    setDeleteId(null);
    setDeleteDriver_toDelete(null);
  };

  // Document approval handlers
  const handleApproveDocument = async (driverId, driverName) => {
    if (!window.confirm(`Are you sure you want to approve all documents for ${driverName}?`)) {
      return;
    }

    try {
      console.log('📄 Approving documents for driver:', driverId);
      const response = await approveDriverDocuments(driverId);
      console.log('📄 Approval response:', response);
      showSnackbar('Documents approved successfully!', 'success');
      await fetchDrivers(); // Refresh the list
      console.log('📄 Drivers refreshed after approval');
    } catch (error) {
      console.error('❌ Approve document error:', error);
      showSnackbar(error.message || 'Failed to approve documents', 'error');
    }
  };

  const handleRejectDocument = async (driverId, driverName) => {
    const reason = window.prompt(`Please provide a reason for rejecting documents for ${driverName}:`, '');

    if (reason === null || reason.trim() === '') {
      // User clicked cancel or provided empty reason
      return;
    }

    try {
      console.log('📄 Rejecting documents for driver:', driverId, 'Reason:', reason);
      const response = await rejectDriverDocuments(driverId, reason);
      console.log('📄 Rejection response:', response);

      // Store the rejection reason in state
      setDocumentRejectionReasons((prev) => ({
        ...prev,
        [driverId]: reason
      }));

      showSnackbar('Documents rejected successfully!', 'warning');
      await fetchDrivers(); // Refresh the list
      console.log('📄 Drivers refreshed after rejection');
    } catch (error) {
      console.error('❌ Reject document error:', error);
      showSnackbar(error.message || 'Failed to reject documents', 'error');
    }
  };

  // Handler for opening All Documents Dialog
  const handleOpenAllDocsDialog = (driver) => {
    setSelectedDriverForDocs(driver);
    setOpenAllDocsDialog(true);
  };

  const handleCloseAllDocsDialog = () => {
    setOpenAllDocsDialog(false);
    setSelectedDriverForDocs(null);
  };

  // Gallery navigation handlers
  const handleNextDocument = () => {
    if (!viewDocDialog.driver) return;

    const currentIndex = documentFields.findIndex((field) => field.key === viewDocDialog.fieldKey);
    if (currentIndex === -1 || currentIndex === documentFields.length - 1) return;

    const nextField = documentFields[currentIndex + 1];
    const nextDocUrl = getDocumentUrl(viewDocDialog.driver, nextField.key);

    setViewDocDialog({
      open: true,
      title: nextField.label,
      src: nextDocUrl,
      fieldKey: nextField.key,
      driver: viewDocDialog.driver
    });
  };

  const handlePreviousDocument = () => {
    if (!viewDocDialog.driver) return;

    const currentIndex = documentFields.findIndex((field) => field.key === viewDocDialog.fieldKey);
    if (currentIndex === -1 || currentIndex === 0) return;

    const prevField = documentFields[currentIndex - 1];
    const prevDocUrl = getDocumentUrl(viewDocDialog.driver, prevField.key);

    setViewDocDialog({
      open: true,
      title: prevField.label,
      src: prevDocUrl,
      fieldKey: prevField.key,
      driver: viewDocDialog.driver
    });
  };

  // Handler for approving individual document
  const handleApproveIndividualDoc = async (driver, fieldKey, fieldLabel) => {
    if (!window.confirm(`Approve ${fieldLabel} for ${safeExtractDriverName(driver)}?`)) {
      return;
    }

    try {
      // Call backend API to approve individual document
      await approveIndividualDocument(driver.id, fieldKey);

      // Update local state
      setDocumentApprovals((prev) => ({
        ...prev,
        [driver.id]: {
          ...prev[driver.id],
          [fieldKey]: 'approved'
        }
      }));

      showSnackbar(`${fieldLabel} approved successfully!`, 'success');
    } catch (error) {
      console.error('❌ Error approving document:', error);
      showSnackbar(`Failed to approve document: ${error.message}`, 'error');
    }
  };

  // Handler for rejecting individual document
  const handleRejectIndividualDoc = async (driver, fieldKey, fieldLabel) => {
    const reason = window.prompt(`Provide reason for rejecting ${fieldLabel}:`, '');

    if (reason === null || reason.trim() === '') {
      return;
    }

    try {
      // Call backend API to reject individual document
      await rejectIndividualDocument(driver.id, fieldKey, reason);

      // Update local state
      setDocumentApprovals((prev) => ({
        ...prev,
        [driver.id]: {
          ...prev[driver.id],
          [fieldKey]: 'rejected'
        }
      }));

      // Store rejection reason for this specific document
      setDocumentRejectionReasons((prev) => ({
        ...prev,
        [`${driver.id}_${fieldKey}`]: reason
      }));

      showSnackbar(`${fieldLabel} rejected!`, 'warning');
    } catch (error) {
      console.error('❌ Error rejecting document:', error);
      showSnackbar(`Failed to reject document: ${error.message}`, 'error');
    }
  };

  const handleVehicleTypeChange = (event, newValue) => {
    setVehicleTypeTab(newValue);
    setOrderPage(0); // Reset to first page when changing vehicle type
  };

  // Download handlers
  const handleDownloadExcel = async () => {
    try {
      setSnackbar({ open: true, message: 'Preparing Excel download...', severity: 'info' });

      const filters = {};
      // You can add filters here if needed based on current selections

      await exportDriversToExcel(filters);

      setSnackbar({ open: true, message: 'Drivers data exported successfully!', severity: 'success' });
    } catch (error) {
      console.error('Error downloading Excel:', error);
      setSnackbar({ open: true, message: 'Failed to download Excel file', severity: 'error' });
    }
  };

  const handleDownloadDocuments = async () => {
    try {
      setSnackbar({ open: true, message: 'Preparing documents data download...', severity: 'info' });

      const filters = {};
      // You can add filters here if needed based on current selections

      await exportDriversDocuments(filters);

      setSnackbar({ open: true, message: 'Drivers documents exported successfully!', severity: 'success' });
    } catch (error) {
      console.error('Error downloading documents data:', error);
      setSnackbar({ open: true, message: 'Failed to download documents file', severity: 'error' });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved':
      case 'Active':
        return 'success';
      case 'Pending':
        return 'warning';
      case 'Suspended':
      case 'Blocked':
        return 'error';
      default:
        return 'default';
    }
  };

  // Filtering logic for Documents tab
  const today = new Date();
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const filteredDocDrivers = drivers.filter((driver) => {
    // Search by name
    if (docSearchTerm && !safeExtractDriverName(driver).toLowerCase().includes(docSearchTerm.toLowerCase())) {
      return false;
    }
    // Date filter
    const created = new Date(driver.createdAt);
    if (docDateFilter === 'today') {
      return created >= startOfToday;
    }
    if (docDateFilter === 'week') {
      return created >= startOfWeek;
    }
    if (docDateFilter === 'month') {
      return created >= startOfMonth;
    }
    if (docDateFilter === 'custom') {
      if (docCustomStart && created < new Date(docCustomStart)) return false;
      if (docCustomEnd && created > new Date(docCustomEnd)) return false;
    }
    return true;
  });

  // Paginate the filtered documents drivers
  // Note: Since the backend already provides paginated data in `drivers`,
  // and we're filtering on the frontend, we should be aware that:
  // 1. If backend pagination is used, filteredDocDrivers will only filter the current page
  // 2. For true filtering across all data, we'd need to pass filters to the backend
  // For now, we'll display the filtered results with pagination info from the backend

  // Helper function to calculate duration in years, months, days
  const getDurationString = (createdAt) => {
    const start = new Date(createdAt);
    const end = new Date();
    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();
    let days = end.getDate() - start.getDate();
    if (days < 0) {
      months--;
      // Get days in previous month
      const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }
    let str = '';
    if (years > 0) str += years + (years === 1 ? ' year' : ' years');
    if (months > 0) str += (str ? ', ' : '') + months + (months === 1 ? ' month' : ' months');
    if (days > 0 || (!years && !months)) str += (str ? ', ' : '') + days + (days === 1 ? ' day' : ' days');
    return str;
  };

  // Add state for Block ID tab search
  const [blockIdSearchTerm, setBlockIdSearchTerm] = useState('');
  // Filtered drivers for Block ID tab
  const filteredBlockIdDrivers = drivers.filter(
    (driver) =>
      safeExtractDriverName(driver).toLowerCase().includes(blockIdSearchTerm.toLowerCase()) ||
      (driver.driverId || '').toLowerCase().includes(blockIdSearchTerm.toLowerCase())
  );

  // Add dummy high order data for drivers
  const highOrderData = [
    {
      serialNo: 1,
      driverId: 'DRV001',
      driverName: 'John Doe',
      orders: [
        {
          orderId: 'ORD1001',
          date: '2024-06-01',
          receiver: { name: 'Ravi Kumar', number: '9000000001', pincode: '110011', address: '123, MG Road, Delhi' }
        },
        {
          orderId: 'ORD1002',
          date: '2024-06-01',
          receiver: { name: 'Ravi Kumar', number: '9000000001', pincode: '110011', address: '123, MG Road, Delhi' }
        },
        {
          orderId: 'ORD1003',
          date: '2024-06-01',
          receiver: { name: 'Ravi Kumar', number: '9000000001', pincode: '110011', address: '123, MG Road, Delhi' }
        }
      ]
    },
    {
      serialNo: 2,
      driverId: 'DRV002',
      driverName: 'Jane Smith',
      orders: [
        {
          orderId: 'ORD2001',
          date: '2024-06-02',
          receiver: { name: 'Sunita Sharma', number: '9000000002', pincode: '400012', address: '45, Marine Drive, Mumbai' }
        },
        {
          orderId: 'ORD2002',
          date: '2024-06-02',
          receiver: { name: 'Sunita Sharma', number: '9000000002', pincode: '400012', address: '45, Marine Drive, Mumbai' }
        }
      ]
    }
  ];
  // Add state for High Orders tab search
  const [highOrderSearchTerm, setHighOrderSearchTerm] = useState('');
  // Filtered high order data for High Orders tab
  const filteredHighOrderData = highOrderData.filter(
    (highOrder) =>
      highOrder.driverName.toLowerCase().includes(highOrderSearchTerm.toLowerCase()) ||
      highOrder.driverId.toLowerCase().includes(highOrderSearchTerm.toLowerCase())
  );

  // Add state for High Orders dialog
  const [openHighOrderDialog, setOpenHighOrderDialog] = useState(false);
  const [selectedHighOrderDriver, setSelectedHighOrderDriver] = useState(null);

  // Add dummy wallet data for drivers
  const walletData = [
    {
      serialNo: 1,
      driverId: 'DRV001',
      driverName: 'John Doe',
      topUp: 5000,
      used: 3500,
      refund: 200,
      balance: 1700,
      lastTransaction: '2024-06-10'
    },
    {
      serialNo: 2,
      driverId: 'DRV002',
      driverName: 'Jane Smith',
      topUp: 3000,
      used: 2500,
      refund: 0,
      balance: 500,
      lastTransaction: '2024-06-09'
    },
    {
      serialNo: 3,
      driverId: 'DRV003',
      driverName: 'Amit Kumar',
      topUp: 4000,
      used: 4000,
      refund: 0,
      balance: 0,
      lastTransaction: '2024-06-11'
    },
    {
      serialNo: 4,
      driverId: 'DRV004',
      driverName: 'Priya Singh',
      topUp: 6000,
      used: 5000,
      refund: 300,
      balance: 1300,
      lastTransaction: '2024-06-08'
    },
    {
      serialNo: 5,
      driverId: 'DRV005',
      driverName: 'Rohit Sharma',
      topUp: 2000,
      used: 1500,
      refund: 0,
      balance: 500,
      lastTransaction: '2024-06-12'
    }
  ];
  // Add state for Wallet tab search
  const [walletSearchTerm, setWalletSearchTerm] = useState('');
  // Filtered wallet data for Wallet tab
  const filteredWalletData = walletData.filter(
    (wallet) =>
      wallet.driverName.toLowerCase().includes(walletSearchTerm.toLowerCase()) ||
      wallet.driverId.toLowerCase().includes(walletSearchTerm.toLowerCase())
  );

  // State for Refer And Earn tab
  const [referAndEarnData, setReferAndEarnData] = useState([]);
  const [referralSearchTerm, setReferralSearchTerm] = useState('');
  const [loadingReferrals, setLoadingReferrals] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [loadingCampaigns, setLoadingCampaigns] = useState(false);
  const [openAddReferralDialog, setOpenAddReferralDialog] = useState(false);
  const [openManageCampaignsDialog, setOpenManageCampaignsDialog] = useState(false);
  const [openCampaignFormDialog, setOpenCampaignFormDialog] = useState(false);
  const [campaignFormMode, setCampaignFormMode] = useState('add'); // 'add' or 'edit'
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [addReferralForm, setAddReferralForm] = useState({
    referralCode: '',
    referredUserPhone: '',
    vehicleType: '2W',
    referralDate: new Date().toISOString().split('T')[0]
  });
  const [campaignForm, setCampaignForm] = useState({
    name: '',
    vehicleType: '2W',
    rewardAmount: '',
    maxReward: '',
    milestones: [{ id: 1, title: 'Friend Activation', description: 'Friend gets activated', rides: 0, reward: 0, daysToComplete: null }],
    icon: 'bike',
    description: '',
    terms: [''],
    isActive: true
  });

  // Fetch referral data from backend
  useEffect(() => {
    const fetchReferralData = async () => {
      if (tab === 7) {
        // Only fetch when on Refer And Earn tab
        setLoadingReferrals(true);
        try {
          const response = await referralApi.getAllReferrals({ limit: 100 });
          if (response.success && response.referrals) {
            // Transform API data to match our table structure
            const transformedData = response.referrals.map((referral, index) => ({
              serialNo: index + 1,
              driverId: referral.referredUserId?.driverId || referral.referredUserId?._id || 'N/A',
              driverName: referral.referredUserName || 'N/A',
              mobileNumber: referral.referredUserPhone || 'N/A',
              city: referral.referredUserId?.city || referral.referredUserId?.selectCity || 'N/A',
              referrerName: referral.referrerName || 'N/A',
              referrerId: referral.referrerId?.driverId || referral.referrerId?._id || 'N/A',
              earning: referral.rewardAmount || 0,
              referralDate: referral.createdAt || new Date().toISOString(),
              status: referral.status === 'paid' || referral.status === 'completed' ? 'Active' : 'Pending',
              vehicleType: referral.vehicleType || 'N/A',
              referrerPhone: referral.referrerId?.altMobile || referral.referrerPhone || 'N/A',
              // ✅ ADD MILESTONE TRACKING DATA
              ridesCompleted: referral.totalRidesCompleted || 0,
              milestonesCompleted: referral.milestonesCompleted?.length || 0,
              totalMilestones: 5, // Default 5 milestones per campaign
              rewardsCredited: referral.milestonesCompleted?.reduce((sum, m) => sum + (m.reward || 0), 0) || 0,
              maxReward: referral.rewardAmount || 0,
              referralId: referral._id
            }));
            setReferAndEarnData(transformedData);
          }
        } catch (error) {
          console.error('Error fetching referral data:', error);
          setSnackbar({
            open: true,
            message: 'Failed to load referral data. Showing sample data.',
            severity: 'warning'
          });
          // Keep dummy data as fallback
          setReferAndEarnData([
            {
              serialNo: 1,
              driverId: 'DRV001',
              driverName: 'John Doe',
              mobileNumber: '9876543210',
              city: 'Mumbai',
              referrerName: 'N/A',
              referrerId: 'N/A',
              earning: 0,
              referralDate: '2024-06-10',
              status: 'Active'
            },
            {
              serialNo: 2,
              driverId: 'DRV002',
              driverName: 'Jane Smith',
              mobileNumber: '9123456780',
              city: 'Delhi',
              referrerName: 'John Doe',
              referrerId: 'DRV001',
              earning: 200,
              referralDate: '2024-06-09',
              status: 'Active'
            }
          ]);
        } finally {
          setLoadingReferrals(false);
        }
      }
    };

    fetchReferralData();
  }, [tab]); // Re-fetch when tab changes to Refer And Earn

  // Fetch campaigns from backend
  useEffect(() => {
    const fetchCampaigns = async () => {
      if (tab === 7) {
        // Only fetch when on Refer And Earn tab
        setLoadingCampaigns(true);
        try {
          const response = await referralApi.getReferralCampaigns({ isActive: true });
          if (response.success && response.data) {
            setCampaigns(response.data);
          }
        } catch (error) {
          console.error('Error fetching campaigns:', error);
        } finally {
          setLoadingCampaigns(false);
        }
      }
    };

    fetchCampaigns();
  }, [tab]);

  // Filtered referral data for Refer And Earn tab
  const filteredReferralData = referAndEarnData.filter(
    (referral) =>
      referral.driverName.toLowerCase().includes(referralSearchTerm.toLowerCase()) ||
      referral.driverId.toLowerCase().includes(referralSearchTerm.toLowerCase()) ||
      referral.mobileNumber.includes(referralSearchTerm) ||
      referral.city.toLowerCase().includes(referralSearchTerm.toLowerCase()) ||
      referral.referrerName.toLowerCase().includes(referralSearchTerm.toLowerCase()) ||
      referral.referrerId.toLowerCase().includes(referralSearchTerm.toLowerCase()) ||
      referral.referrerPhone.toLowerCase().includes(referralSearchTerm.toLowerCase())
  );

  // Add Referral Dialog Handlers
  const handleOpenAddReferralDialog = () => {
    setOpenAddReferralDialog(true);
  };

  const handleCloseAddReferralDialog = () => {
    setOpenAddReferralDialog(false);
    setAddReferralForm({
      referralCode: '',
      referredUserPhone: '',
      vehicleType: '2W',
      referralDate: new Date().toISOString().split('T')[0]
    });
  };

  const handleAddReferralFormChange = (e) => {
    const { name, value } = e.target;
    setAddReferralForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddReferralSubmit = async (e) => {
    e.preventDefault();
    setLoadingReferrals(true);

    try {
      const response = await referralApi.createReferral({
        referralCode: addReferralForm.referralCode,
        referredUserPhone: addReferralForm.referredUserPhone,
        vehicleType: addReferralForm.vehicleType
      });

      if (response.success) {
        setSnackbar({
          open: true,
          message: 'Referral added successfully!',
          severity: 'success'
        });
        handleCloseAddReferralDialog();

        // Refresh referral data
        const refreshResponse = await referralApi.getAllReferrals({ limit: 100 });
        if (refreshResponse.success && refreshResponse.referrals) {
          const transformedData = refreshResponse.referrals.map((referral, index) => ({
            serialNo: index + 1,
            driverId: referral.referredUserId?.driverId || referral.referredUserId?._id || 'N/A',
            driverName: referral.referredUserName || 'N/A',
            mobileNumber: referral.referredUserPhone || 'N/A',
            city: referral.referredUserId?.city || referral.referredUserId?.selectCity || 'N/A',
            referrerName: referral.referrerName || 'N/A',
            referrerId: referral.referrerId?.driverId || referral.referrerId?._id || 'N/A',
            earning: referral.rewardAmount || 0,
            referralDate: referral.createdAt || new Date().toISOString(),
            status: referral.status === 'paid' || referral.status === 'completed' ? 'Active' : 'Pending',
            vehicleType: referral.vehicleType || 'N/A',
            referrerPhone: referral.referrerId?.altMobile || referral.referrerPhone || 'N/A'
          }));
          setReferAndEarnData(transformedData);
        }
      }
    } catch (error) {
      console.error('Error adding referral:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Failed to add referral. Please check the referral code and phone number.',
        severity: 'error'
      });
    } finally {
      setLoadingReferrals(false);
    }
  };

  // Campaign Management Handlers
  const handleOpenCampaignForm = (mode, campaign = null) => {
    setCampaignFormMode(mode);
    if (mode === 'edit' && campaign) {
      setSelectedCampaign(campaign);
      setCampaignForm({
        name: campaign.name || '',
        vehicleType: campaign.vehicleType || '2W',
        rewardAmount: campaign.rewardAmount || '',
        maxReward: campaign.maxReward || '',
        milestones:
          campaign.milestones?.length > 0
            ? campaign.milestones
            : [{ id: 1, title: 'Friend Activation', description: 'Friend gets activated', rides: 0, reward: 0, daysToComplete: null }],
        icon: campaign.icon || 'bike',
        description: campaign.description || '',
        terms: campaign.terms?.length > 0 ? campaign.terms : [''],
        isActive: campaign.isActive !== undefined ? campaign.isActive : true
      });
    } else {
      setSelectedCampaign(null);
      setCampaignForm({
        name: '',
        vehicleType: '2W',
        rewardAmount: '',
        maxReward: '',
        milestones: [
          { id: 1, title: 'Friend Activation', description: 'Friend gets activated', rides: 0, reward: 0, daysToComplete: null }
        ],
        icon: 'bike',
        description: '',
        terms: [''],
        isActive: true
      });
    }
    setOpenCampaignFormDialog(true);
  };

  const handleCloseCampaignForm = () => {
    setOpenCampaignFormDialog(false);
    setSelectedCampaign(null);
    setCampaignForm({
      name: '',
      vehicleType: '2W',
      rewardAmount: '',
      maxReward: '',
      milestones: [{ id: 1, title: 'Friend Activation', description: 'Friend gets activated', rides: 0, reward: 0, daysToComplete: null }],
      icon: 'bike',
      description: '',
      terms: [''],
      isActive: true
    });
  };

  const handleCampaignFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCampaignForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleTermChange = (index, value) => {
    const newTerms = [...campaignForm.terms];
    newTerms[index] = value;
    setCampaignForm((prev) => ({ ...prev, terms: newTerms }));
  };

  const handleAddTerm = () => {
    setCampaignForm((prev) => ({ ...prev, terms: [...prev.terms, ''] }));
  };

  const handleRemoveTerm = (index) => {
    if (campaignForm.terms.length > 1) {
      const newTerms = campaignForm.terms.filter((_, i) => i !== index);
      setCampaignForm((prev) => ({ ...prev, terms: newTerms }));
    }
  };

  // Milestone handlers
  const handleMilestoneChange = (index, field, value) => {
    const newMilestones = [...campaignForm.milestones];
    newMilestones[index] = {
      ...newMilestones[index],
      [field]:
        field === 'rides' || field === 'reward' || field === 'daysToComplete' || field === 'id'
          ? value === '' || value === null
            ? field === 'daysToComplete'
              ? null
              : 0
            : Number(value)
          : value
    };
    setCampaignForm((prev) => ({ ...prev, milestones: newMilestones }));
  };

  const handleAddMilestone = () => {
    const newId = campaignForm.milestones.length > 0 ? Math.max(...campaignForm.milestones.map((m) => m.id)) + 1 : 1;
    setCampaignForm((prev) => ({
      ...prev,
      milestones: [...prev.milestones, { id: newId, title: '', description: '', rides: 0, reward: 0, daysToComplete: null }]
    }));
  };

  const handleRemoveMilestone = (index) => {
    if (campaignForm.milestones.length > 1) {
      const newMilestones = campaignForm.milestones.filter((_, i) => i !== index);
      setCampaignForm((prev) => ({ ...prev, milestones: newMilestones }));
    }
  };

  const handleCampaignSubmit = async (e) => {
    e.preventDefault();
    setLoadingCampaigns(true);

    try {
      // Validate required fields
      if (!campaignForm.name || !campaignForm.vehicleType || !campaignForm.rewardAmount || !campaignForm.description) {
        setSnackbar({
          open: true,
          message: 'Please fill in all required fields (Name, Vehicle Type, Reward Amount, Description)',
          severity: 'error'
        });
        setLoadingCampaigns(false);
        return;
      }

      // Filter out empty terms
      const filteredTerms = campaignForm.terms.filter((term) => term.trim() !== '');

      // Calculate maxReward from milestones if not provided
      const totalMilestoneReward = campaignForm.milestones.reduce((sum, m) => sum + (Number(m.reward) || 0), 0);
      const maxRewardValue = campaignForm.maxReward ? parseInt(campaignForm.maxReward) : totalMilestoneReward;

      const campaignData = {
        name: campaignForm.name,
        vehicleType: campaignForm.vehicleType,
        rewardAmount: parseInt(campaignForm.rewardAmount),
        maxReward: maxRewardValue,
        milestones: campaignForm.milestones.map((m) => ({
          id: Number(m.id),
          title: m.title,
          description: m.description,
          rides: Number(m.rides) || 0,
          reward: Number(m.reward) || 0,
          daysToComplete: m.daysToComplete === null || m.daysToComplete === '' ? null : Number(m.daysToComplete)
        })),
        icon: campaignForm.icon,
        description: campaignForm.description,
        terms: filteredTerms,
        isActive: campaignForm.isActive,
        priority: 0 // Default priority since we removed the field
      };

      console.log('Submitting campaign data:', campaignData);

      let response;
      if (campaignFormMode === 'edit' && selectedCampaign) {
        response = await referralApi.updateCampaign(selectedCampaign._id, campaignData);
      } else {
        response = await referralApi.createCampaign(campaignData);
      }

      console.log('Campaign response:', response);

      if (response.success) {
        setSnackbar({
          open: true,
          message: `Campaign ${campaignFormMode === 'edit' ? 'updated' : 'created'} successfully!`,
          severity: 'success'
        });
        handleCloseCampaignForm();

        // Refresh campaigns
        const refreshResponse = await referralApi.getReferralCampaigns({ isActive: true });
        if (refreshResponse.success && refreshResponse.data) {
          setCampaigns(refreshResponse.data);
        }
      } else {
        // Handle case where response is not successful
        setSnackbar({
          open: true,
          message: response.message || `Failed to ${campaignFormMode === 'edit' ? 'update' : 'create'} campaign.`,
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Error saving campaign:', error);
      console.error('Error details:', error.response?.data);

      let errorMessage = `Failed to ${campaignFormMode === 'edit' ? 'update' : 'create'} campaign.`;

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
    } finally {
      setLoadingCampaigns(false);
    }
  };

  const handleDeleteCampaign = async (campaignId) => {
    if (!window.confirm('Are you sure you want to delete this campaign? This action cannot be undone.')) {
      return;
    }

    setLoadingCampaigns(true);
    try {
      const response = await referralApi.deleteCampaign(campaignId);
      if (response.success) {
        setSnackbar({
          open: true,
          message: 'Campaign deleted successfully!',
          severity: 'success'
        });

        // Refresh campaigns
        const refreshResponse = await referralApi.getReferralCampaigns({ isActive: true });
        if (refreshResponse.success && refreshResponse.data) {
          setCampaigns(refreshResponse.data);
        }
      }
    } catch (error) {
      console.error('Error deleting campaign:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Failed to delete campaign.',
        severity: 'error'
      });
    } finally {
      setLoadingCampaigns(false);
    }
  };

  // Show loading spinner
  if (loading && drivers.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Loading drivers...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', minHeight: 500, mt: 5 }}>
      <h1>Driver Management</h1>
      <Box sx={{ mb: 2 }}>
        <ArrowBackIcon onClick={() => navigate(-1)} color="primary" sx={{ cursor: 'pointer', fontSize: 28 }} />
      </Box>
      <Box sx={{ display: 'flex', flex: 1 }}>
        <Paper sx={{ minWidth: 200, borderRadius: 3, boxShadow: 3, mr: 2, p: 1, bgcolor: 'background.paper', height: 'fit-content' }}>
          <List sx={{ p: 0 }}>
            {tabLabels.map((label, idx) => (
              <ListItemButton
                key={label}
                selected={tab === idx}
                onClick={() => setTab(idx)}
                sx={{
                  borderRadius: 1,
                  mb: 0.5,
                  color: tab === idx ? 'primary.main' : 'text.primary',
                  bgcolor: tab === idx ? 'primary.lighter' : 'transparent',
                  fontWeight: tab === idx ? 700 : 400,
                  boxShadow: tab === idx ? 2 : 0,
                  transition: 'all 0.2s',
                  minHeight: 36,
                  pl: 1.5,
                  pr: 1.5
                }}
              >
                <ListItemIcon sx={{ minWidth: 32, color: tab === idx ? 'primary.main' : 'grey.500' }}>{tabIcons[idx]}</ListItemIcon>
                <ListItemText primary={label} primaryTypographyProps={{ fontSize: 14 }} />
              </ListItemButton>
            ))}
          </List>
        </Paper>
        <Paper sx={{ flex: 1, borderRadius: 3, boxShadow: 3, p: 4, minHeight: 500, bgcolor: 'background.paper' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" color="primary">
              {tabLabels[tab]}
            </Typography>
            {tab === 0 && (
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button variant="outlined" color="primary" startIcon={<DownloadIcon />} onClick={handleDownloadExcel}>
                  Download Excel
                </Button>
                <Button variant="outlined" color="secondary" startIcon={<DescriptionOutlinedIcon />} onClick={handleDownloadDocuments}>
                  Download Documents
                </Button>
                <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => handleOpenForm('add')}>
                  Add Driver
                </Button>
              </Box>
            )}
            {tab === 7 && (
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button variant="outlined" color="primary" onClick={() => setOpenManageCampaignsDialog(true)}>
                  Manage Campaigns
                </Button>
              </Box>
            )}
          </Box>

          {tab === 0 ? (
            <Box>
              {/* Search Bar for Profile Details */}
              <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                <TextField
                  placeholder="Search by driver name, driver ID, or mobile number..."
                  value={profileDetailsSearchTerm}
                  onChange={(e) => setProfileDetailsSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                  sx={{ flexGrow: 1, maxWidth: 500 }}
                />
                <Button variant="outlined" onClick={() => setProfileDetailsSearchTerm('')} disabled={!profileDetailsSearchTerm}>
                  Clear
                </Button>
              </Box>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <b>S. No.</b>
                      </TableCell>
                      <TableCell>
                        <b>Driver ID</b>
                      </TableCell>
                      <TableCell>
                        <b>Photo</b>
                      </TableCell>
                      <TableCell>
                        <b>Driver Name</b>
                      </TableCell>
                      <TableCell>
                        <b>Mobile Number</b>
                      </TableCell>
                      <TableCell>
                        <b>Email ID</b>
                      </TableCell>
                      <TableCell>
                        <b>City</b>
                      </TableCell>
                      <TableCell>
                        <b>Vehicle Type</b>
                      </TableCell>
                      <TableCell>
                        <b>Status</b>
                      </TableCell>
                      <TableCell>
                        <b>Online</b>
                      </TableCell>
                      <TableCell>
                        <b>Actions</b>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredProfileDetailsDrivers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={11} align="center">
                          <Box sx={{ py: 3 }}>
                            <Typography variant="body1" color="text.secondary">
                              {profileDetailsSearchTerm ? 'No drivers found matching your search.' : 'No drivers available.'}
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredProfileDetailsDrivers.map((driver, idx) => {
                        // Debug: Log driver data to check selectCity field
                        if (idx === 0) {
                          console.log('🔍 Driver data structure:', driver);
                          console.log('🏙️ City field values:', {
                            selectCity: driver.selectCity,
                            city: driver.city,
                            allFields: Object.keys(driver)
                          });
                          console.log('📍 All driver data:', JSON.stringify(driver, null, 2));
                        }
                        return (
                          <TableRow key={driver.id} hover>
                            <TableCell>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {idx + 1}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                                {driver.driverId || `DRV${driver.id?.toString().slice(-6)}`}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Avatar
                                src={driver.photo || driver.profilePhoto}
                                alt={safeExtractDriverName(driver)}
                                sx={{ width: 40, height: 40 }}
                              >
                                {safeExtractDriverName(driver)[0].toUpperCase()}
                              </Avatar>
                            </TableCell>
                            <TableCell>
                              <Typography
                                variant="body2"
                                sx={{
                                  color: 'primary.main',
                                  textDecoration: 'underline',
                                  cursor: 'pointer',
                                  fontWeight: 600,
                                  '&:hover': {
                                    color: 'primary.dark'
                                  }
                                }}
                                onClick={() => handleDriverClick(driver)}
                              >
                                {safeExtractDriverName(driver)}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {driver.altMobile || driver.phone || 'N/A'}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" color="text.secondary">
                                {driver.email || 'N/A'}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {driver.selectCity && driver.selectCity.trim() !== ''
                                  ? driver.selectCity
                                  : driver.city && driver.city.trim() !== ''
                                    ? driver.city
                                    : 'Not Set'}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                                {driver.vehicleType || 'N/A'}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={driver.status || 'Unknown'}
                                color={getStatusColor(driver.status)}
                                size="small"
                                sx={{ fontWeight: 600 }}
                              />
                            </TableCell>
                            <TableCell>
                              {isDriverOnline(driver) ? (
                                <Chip
                                  label="Online"
                                  color="success"
                                  size="small"
                                  icon={
                                    <Box
                                      sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#4caf50', animation: 'pulse 2s infinite' }}
                                    />
                                  }
                                  sx={{ fontWeight: 600 }}
                                />
                              ) : (
                                <Chip label="Offline" color="default" size="small" sx={{ fontWeight: 600 }} />
                              )}
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                <IconButton
                                  color="primary"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenForm('edit', driver);
                                  }}
                                  sx={{
                                    '&:hover': {
                                      bgcolor: 'primary.lighter',
                                      transform: 'scale(1.1)'
                                    },
                                    transition: 'all 0.2s'
                                  }}
                                >
                                  <EditIcon />
                                </IconButton>
                                <IconButton
                                  color="error"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const driverId = driver._id || driver.id;
                                    console.log('🗑️ Delete button clicked:', {
                                      driverId: driver.driverId,
                                      _id: driver._id,
                                      id: driver.id,
                                      usingId: driverId,
                                      fullDriver: driver
                                    });
                                    handleDelete(driverId, driver);
                                  }}
                                  sx={{
                                    '&:hover': {
                                      bgcolor: 'error.lighter',
                                      transform: 'scale(1.1)'
                                    },
                                    transition: 'all 0.2s'
                                  }}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Box>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Pagination */}
              {pagination.total > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
                    {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} drivers
                  </Typography>
                  <Stack spacing={2}>
                    <Pagination
                      count={pagination.pages}
                      page={pagination.page}
                      onChange={(event, value) => changePage(value)}
                      color="primary"
                      showFirstButton
                      showLastButton
                    />
                  </Stack>
                </Box>
              )}
            </Box>
          ) : tab === 1 ? (
            // Order Details Tab
            <Box>
              {/* Date Filter Buttons */}
              <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                <Button variant={orderDateFilter === 'all' ? 'contained' : 'outlined'} onClick={() => setOrderDateFilter('all')}>
                  All
                </Button>
                <Button variant={orderDateFilter === 'today' ? 'contained' : 'outlined'} onClick={() => setOrderDateFilter('today')}>
                  Today
                </Button>
                <Button variant={orderDateFilter === 'week' ? 'contained' : 'outlined'} onClick={() => setOrderDateFilter('week')}>
                  Weekly
                </Button>
                <Button variant={orderDateFilter === 'month' ? 'contained' : 'outlined'} onClick={() => setOrderDateFilter('month')}>
                  Monthly
                </Button>
                <Button variant={orderDateFilter === 'custom' ? 'contained' : 'outlined'} onClick={() => setOrderDateFilter('custom')}>
                  Custom Date
                </Button>
                {orderDateFilter === 'custom' && (
                  <TextField
                    type="date"
                    size="small"
                    value={orderCustomDate}
                    onChange={(e) => setOrderCustomDate(e.target.value)}
                    sx={{ ml: 1, minWidth: 150 }}
                  />
                )}
              </Box>

              {/* Search Bar for Order Details */}
              <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                <TextField
                  placeholder="Search by Vehicle Reg. Number, Rider Mobile, or Rider Name..."
                  value={orderDetailsSearchTerm}
                  onChange={(e) => setOrderDetailsSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                  sx={{ flexGrow: 1, maxWidth: 600 }}
                />
                <Button variant="outlined" onClick={() => setOrderDetailsSearchTerm('')} disabled={!orderDetailsSearchTerm}>
                  Clear
                </Button>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Tabs value={vehicleTypeTab} onChange={handleVehicleTypeChange}>
                  {vehicleTypes.map((type, index) => {
                    const count = getFilteredOrderData(type).length;
                    return <Tab key={type} label={`${type} (${count})`} />;
                  })}
                </Tabs>
                <Button variant="contained" color="primary" onClick={() => navigate('/dashboard/manage-orders')} sx={{ ml: 2 }}>
                  View All Orders
                </Button>
              </Box>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <b>S. No.</b>
                      </TableCell>
                      <TableCell>
                        <b>Rider Mobile Number</b>
                      </TableCell>
                      <TableCell>
                        <b>Vehicle Reg. Number</b>
                      </TableCell>
                      <TableCell>
                        <b>Driver Name</b>
                      </TableCell>
                      <TableCell>
                        <b>Booking ID</b>
                      </TableCell>
                      <TableCell>
                        <b>Vehicle Type</b>
                      </TableCell>
                      <TableCell>
                        <b>Status</b>
                      </TableCell>
                      <TableCell>
                        <b>Amount (₹)</b>
                      </TableCell>
                      <TableCell>
                        <b>Date</b>
                      </TableCell>
                      <TableCell>
                        <b>Pickup</b>
                      </TableCell>
                      <TableCell>
                        <b>Drop</b>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {getFilteredOrderData(vehicleTypes[vehicleTypeTab]).length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={11} align="center">
                          <Box sx={{ py: 3 }}>
                            <Typography variant="body1" color="text.secondary">
                              {orderDetailsSearchTerm
                                ? 'No orders found matching your search.'
                                : orderDateFilter !== 'all'
                                  ? 'No orders available for the selected date range.'
                                  : 'No orders available for this vehicle type.'}
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ) : (
                      getFilteredOrderData(vehicleTypes[vehicleTypeTab])
                        .slice(orderPage * orderRowsPerPage, orderPage * orderRowsPerPage + orderRowsPerPage)
                        .map((order, idx) => (
                          <TableRow key={order._id || idx} hover>
                            <TableCell>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {orderPage * orderRowsPerPage + idx + 1}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                                {order.rider?.phone || order.rider?.mobile || order.driver?.phone || 'N/A'}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" sx={{ fontWeight: 600, color: 'secondary.main' }}>
                                {order.rider?.vehicleregisterNumber ||
                                  order.driver?.vehicleregisterNumber ||
                                  order.rider?.vehicleNumber ||
                                  order.rider?.vehicleRegistrationNumber ||
                                  'N/A'}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {safeExtractDriverName(order.rider || order.driver)}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                                {order.bookingId || order._id?.toString().slice(-8).toUpperCase() || 'N/A'}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={order.vehicleType || 'N/A'}
                                color="info"
                                size="small"
                                variant="outlined"
                                sx={{ fontWeight: 600 }}
                              />
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={order.status || 'Unknown'}
                                color={
                                  order.status === 'completed'
                                    ? 'success'
                                    : order.status === 'cancelled' || order.status === 'canceled'
                                      ? 'error'
                                      : order.status === 'in_progress'
                                        ? 'info'
                                        : 'warning'
                                }
                                size="small"
                                sx={{ fontWeight: 600 }}
                              />
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>
                                ₹{(order.totalPrice || order.price || order.amount || 0).toLocaleString()}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" color="text.secondary">
                                {order.createdAt
                                  ? new Date(order.createdAt).toLocaleDateString('en-IN')
                                  : order.date
                                    ? new Date(order.date).toLocaleDateString('en-IN')
                                    : 'N/A'}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                  maxWidth: 200,
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap'
                                }}
                                title={order.fromLocation?.address || order.fromAddress?.address || order.pickup || 'N/A'}
                              >
                                {order.fromLocation?.address || order.fromAddress?.address || order.pickup || 'N/A'}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                  maxWidth: 200,
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap'
                                }}
                                title={order.toLocation?.address || order.dropLocation?.[0]?.address || order.drop || 'N/A'}
                              >
                                {order.toLocation?.address || order.dropLocation?.[0]?.address || order.drop || 'N/A'}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                component="div"
                count={getFilteredOrderData(vehicleTypes[vehicleTypeTab]).length}
                page={orderPage}
                onPageChange={handleOrderPageChange}
                rowsPerPage={orderRowsPerPage}
                onRowsPerPageChange={handleOrderRowsPerPageChange}
                rowsPerPageOptions={[5, 10, 25, 50]}
              />
            </Box>
          ) : tab === 2 ? (
            // Documents Tab
            <Box>
              {/* Search and Filter Bar */}
              <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
                <TextField
                  size="small"
                  placeholder="Search by driver name..."
                  value={docSearchTerm}
                  onChange={(e) => setDocSearchTerm(e.target.value)}
                  InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} /> }}
                  sx={{ minWidth: 220 }}
                />
                <Button variant={docDateFilter === 'all' ? 'contained' : 'outlined'} onClick={() => setDocDateFilter('all')}>
                  All
                </Button>
                <Button variant={docDateFilter === 'today' ? 'contained' : 'outlined'} onClick={() => setDocDateFilter('today')}>
                  Today
                </Button>
                <Button variant={docDateFilter === 'week' ? 'contained' : 'outlined'} onClick={() => setDocDateFilter('week')}>
                  Weekly
                </Button>
                <Button variant={docDateFilter === 'month' ? 'contained' : 'outlined'} onClick={() => setDocDateFilter('month')}>
                  Monthly
                </Button>
                <Button variant={docDateFilter === 'custom' ? 'contained' : 'outlined'} onClick={() => setDocDateFilter('custom')}>
                  Custom
                </Button>
                {docDateFilter === 'custom' && (
                  <>
                    <TextField
                      size="small"
                      type="date"
                      label="Start"
                      InputLabelProps={{ shrink: true }}
                      value={docCustomStart}
                      onChange={(e) => setDocCustomStart(e.target.value)}
                    />
                    <TextField
                      size="small"
                      type="date"
                      label="End"
                      InputLabelProps={{ shrink: true }}
                      value={docCustomEnd}
                      onChange={(e) => setDocCustomEnd(e.target.value)}
                    />
                  </>
                )}
              </Box>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <b>S. No.</b>
                      </TableCell>
                      <TableCell>
                        <b>Driver ID</b>
                      </TableCell>
                      <TableCell>
                        <b>Driver Name</b>
                      </TableCell>
                      <TableCell>
                        <b>Mobile Number</b>
                      </TableCell>
                      <TableCell>
                        <b>Overall Status</b>
                      </TableCell>
                      <TableCell>
                        <b>Rejection Reason</b>
                      </TableCell>
                      <TableCell>
                        <b>View Documents</b>
                      </TableCell>
                      <TableCell>
                        <b>Approve</b>
                      </TableCell>
                      <TableCell>
                        <b>Reject</b>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredDocDrivers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} align="center">
                          <Box sx={{ py: 3 }}>
                            <Typography variant="body1" color="text.secondary">
                              No drivers available.
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredDocDrivers.map((driver, idx) => (
                        <TableRow key={driver.id} hover>
                          <TableCell>{(pagination.page - 1) * pagination.limit + idx + 1}</TableCell>
                          <TableCell>{driver.driverId}</TableCell>
                          <TableCell>
                            <Typography
                              variant="body2"
                              sx={{
                                color: 'primary.main',
                                textDecoration: 'underline',
                                cursor: 'pointer',
                                fontWeight: 600,
                                '&:hover': { color: 'primary.dark' }
                              }}
                              onClick={() => handleOpenAllDocsDialog(driver)}
                            >
                              {safeExtractDriverName(driver)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {driver.altMobile || driver.phone || 'N/A'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={driver.documentStatus || 'Pending'}
                              color={
                                driver.documentStatus === 'Approved'
                                  ? 'success'
                                  : driver.documentStatus === 'Rejected'
                                    ? 'error'
                                    : 'warning'
                              }
                              size="small"
                              sx={{ fontWeight: 600 }}
                            />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ maxWidth: 300 }}>
                              {(() => {
                                const hasRejectionReason =
                                  driver.documentStatus === 'Rejected' && (driver.rejectionReason || documentRejectionReasons[driver.id]);

                                console.log(
                                  '🔍 Driver:',
                                  driver.id,
                                  'Status:',
                                  driver.documentStatus,
                                  'RejectionReason:',
                                  driver.rejectionReason,
                                  'StateReason:',
                                  documentRejectionReasons[driver.id]
                                );

                                if (hasRejectionReason) {
                                  return (
                                    <Typography variant="body2" color="error" sx={{ fontWeight: 500 }}>
                                      {driver.rejectionReason || documentRejectionReasons[driver.id]}
                                    </Typography>
                                  );
                                }

                                return (
                                  <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                    -
                                  </Typography>
                                );
                              })()}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Button
                              size="small"
                              variant="outlined"
                              color="primary"
                              onClick={() => handleOpenAllDocsDialog(driver)}
                              sx={{
                                minWidth: 120,
                                fontSize: '0.75rem',
                                '&:hover': {
                                  bgcolor: 'primary.lighter'
                                }
                              }}
                            >
                              View All Documents
                            </Button>
                          </TableCell>
                          <TableCell>
                            <Button
                              size="small"
                              variant="contained"
                              color="success"
                              startIcon={<CheckCircleIcon />}
                              onClick={() => handleApproveDocument(driver.id, safeExtractDriverName(driver))}
                              disabled={driver.documentStatus === 'Approved'}
                              sx={{
                                minWidth: 100,
                                fontSize: '0.75rem',
                                '&:hover': {
                                  bgcolor: 'success.dark'
                                }
                              }}
                            >
                              Approve
                            </Button>
                          </TableCell>
                          <TableCell>
                            <Button
                              size="small"
                              variant="contained"
                              color="error"
                              startIcon={<CancelOutlinedIcon />}
                              onClick={() => handleRejectDocument(driver.id, safeExtractDriverName(driver))}
                              disabled={driver.documentStatus === 'Rejected'}
                              sx={{
                                minWidth: 100,
                                fontSize: '0.75rem',
                                '&:hover': {
                                  bgcolor: 'error.dark'
                                }
                              }}
                            >
                              Reject
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Pagination for Documents Tab */}
              {pagination.total > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
                    {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} drivers
                  </Typography>
                  <Stack spacing={2}>
                    <Pagination
                      count={pagination.pages}
                      page={pagination.page}
                      onChange={(event, value) => changePage(value)}
                      color="primary"
                      showFirstButton
                      showLastButton
                    />
                  </Stack>
                </Box>
              )}
            </Box>
          ) : tab === 3 ? (
            // Data Analyze Tab
            <Box>
              {/* Search Bar for Data Analyze */}
              <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                <TextField
                  placeholder="Search by driver name or driver ID..."
                  value={dataAnalyzeSearchTerm}
                  onChange={(e) => setDataAnalyzeSearchTerm(e.target.value)}
                  InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} /> }}
                  sx={{ flexGrow: 1, maxWidth: 500 }}
                />
                <Button variant="outlined" onClick={() => setDataAnalyzeSearchTerm('')} disabled={!dataAnalyzeSearchTerm}>
                  Clear
                </Button>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <b>S. No.</b>
                      </TableCell>
                      <TableCell>
                        <b>Driver ID</b>
                      </TableCell>
                      <TableCell>
                        <b>Driver Name</b>
                      </TableCell>
                      <TableCell>
                        <b>Mobile</b>
                      </TableCell>
                      <TableCell>
                        <b>City</b>
                      </TableCell>
                      <TableCell>
                        <b>Status</b>
                      </TableCell>
                      <TableCell>
                        <b>Vehicle Type</b>
                      </TableCell>
                      <TableCell>
                        <b>Rating</b>
                      </TableCell>
                      <TableCell>
                        <b>Created Date</b>
                      </TableCell>
                      <TableCell>
                        <b>How Many Days Completed</b>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredDataAnalyzeDrivers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={10} align="center">
                          <Box sx={{ py: 3 }}>
                            <Typography variant="body1" color="text.secondary">
                              {dataAnalyzeSearchTerm ? 'No drivers found matching your search.' : 'No drivers available.'}
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredDataAnalyzeDrivers.map((driver, idx) => (
                        <TableRow key={driver.id} hover>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {idx + 1}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                              {driver.driverId}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar
                                src={driver.photo}
                                alt={driver.fullName}
                                sx={{ mr: 2, width: 32, height: 32, fontSize: '0.875rem' }}
                              />
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {driver.fullName}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {driver.altMobile}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 600,
                                color: driver.selectCity || driver.city ? 'text.primary' : 'text.secondary',
                                fontStyle: driver.selectCity || driver.city ? 'normal' : 'italic'
                              }}
                            >
                              {driver.selectCity || driver.city || 'Not Set'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip label={driver.status} color={getStatusColor(driver.status)} size="small" sx={{ fontWeight: 600 }} />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {driver.vehicleType}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {driver.rating}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {driver.createdAt}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {getDurationString(driver.createdAt)}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          ) : tab === 4 ? (
            // Block ID Tab
            <Box>
              {/* Search Bar for Block ID */}
              <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                <TextField
                  placeholder="Search by driver name or driver ID..."
                  value={blockIdSearchTerm}
                  onChange={(e) => setBlockIdSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                  sx={{ flexGrow: 1, maxWidth: 500 }}
                />
                <Button variant="outlined" onClick={() => setBlockIdSearchTerm('')} disabled={!blockIdSearchTerm}>
                  Clear
                </Button>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <b>S. No.</b>
                      </TableCell>
                      <TableCell>
                        <b>Driver ID</b>
                      </TableCell>
                      <TableCell>
                        <b>Driver Name</b>
                      </TableCell>
                      <TableCell>
                        <b>Email</b>
                      </TableCell>
                      <TableCell>
                        <b>Mobile</b>
                      </TableCell>
                      <TableCell>
                        <b>Status</b>
                      </TableCell>
                      <TableCell>
                        <b>Block Reason</b>
                      </TableCell>
                      <TableCell>
                        <b>Actions</b>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredBlockIdDrivers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} align="center">
                          <Box sx={{ py: 3 }}>
                            <Typography variant="body1" color="text.secondary">
                              {blockIdSearchTerm ? 'No drivers found matching your search.' : 'No drivers available.'}
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredBlockIdDrivers.map((driver, idx) => (
                        <TableRow key={driver.id} hover>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {idx + 1}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                              {driver.driverId}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar
                                src={driver.photo}
                                alt={driver.fullName}
                                sx={{ mr: 2, width: 32, height: 32, fontSize: '0.875rem' }}
                              />
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {driver.fullName}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary">
                              {driver.email}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary">
                              {driver.altMobile}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={driver.isBlocked === 'true' || driver.blocked ? 'Blocked' : 'Active'}
                              color={driver.isBlocked === 'true' || driver.blocked ? 'error' : 'success'}
                              size="small"
                              sx={{ fontWeight: 600 }}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary">
                              {driver.blockReason || '-'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            {driver.isBlocked === 'true' || driver.blocked ? (
                              <Button
                                variant="contained"
                                color="success"
                                size="small"
                                onClick={async () => {
                                  try {
                                    await unblockDriver(driver._id || driver.id);
                                    showSnackbar('Driver unblocked successfully!', 'success');
                                  } catch (error) {
                                    console.error('Error unblocking driver:', error);
                                    showSnackbar('Failed to unblock driver', 'error');
                                  }
                                }}
                                sx={{ fontWeight: 600 }}
                              >
                                Unblock
                              </Button>
                            ) : (
                              <Button
                                variant="contained"
                                color="error"
                                size="small"
                                onClick={async () => {
                                  const reason = window.prompt('Provide reason for blocking this driver:', '');
                                  console.log('🚫 Block reason entered:', reason);
                                  if (reason !== null && reason.trim()) {
                                    try {
                                      console.log('🚫 Blocking driver:', driver._id || driver.id, 'with reason:', reason.trim());
                                      await blockDriver(driver._id || driver.id, reason.trim());
                                      showSnackbar('Driver blocked successfully!', 'success');
                                    } catch (error) {
                                      console.error('Error blocking driver:', error);
                                      showSnackbar('Failed to block driver', 'error');
                                    }
                                  } else if (reason !== null) {
                                    showSnackbar('Block reason is required', 'warning');
                                  }
                                }}
                                sx={{ fontWeight: 600 }}
                              >
                                Block
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          ) : tab === 5 ? (
            // High Orders Tab
            <Box>
              {/* Search Bar for High Orders */}
              <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                <TextField
                  placeholder="Search by driver name or driver ID..."
                  value={highOrderSearchTerm}
                  onChange={(e) => setHighOrderSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                  sx={{ flexGrow: 1, maxWidth: 500 }}
                />
                <Button variant="outlined" onClick={() => setHighOrderSearchTerm('')} disabled={!highOrderSearchTerm}>
                  Clear
                </Button>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <b>S. No.</b>
                      </TableCell>
                      <TableCell>
                        <b>Driver ID</b>
                      </TableCell>
                      <TableCell>
                        <b>Driver Name</b>
                      </TableCell>
                      <TableCell>
                        <b>Number of Orders</b>
                      </TableCell>
                      <TableCell>
                        <b>Order Details</b>
                      </TableCell>
                      <TableCell>
                        <b>Receiver Details</b>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredHighOrderData.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center">
                          <Box sx={{ py: 3 }}>
                            <Typography variant="body1" color="text.secondary">
                              {highOrderSearchTerm ? 'No high order drivers found matching your search.' : 'No high order data available.'}
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredHighOrderData.map((driver, idx) => (
                        <TableRow key={idx} hover>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {driver.serialNo}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                              {driver.driverId}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar sx={{ mr: 2, bgcolor: 'primary.main', width: 32, height: 32, fontSize: '0.875rem' }}>
                                {driver.driverName[0]}
                              </Avatar>
                              <Typography
                                variant="body2"
                                sx={{
                                  fontWeight: 600,
                                  color: 'primary.main',
                                  textDecoration: 'underline',
                                  cursor: 'pointer',
                                  '&:hover': {
                                    color: 'primary.dark'
                                  }
                                }}
                                onClick={() => {
                                  setSelectedHighOrderDriver(driver);
                                  setOpenHighOrderDialog(true);
                                }}
                              >
                                {driver.driverName}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip label={`${driver.orders.length} Orders`} color="success" size="small" sx={{ fontWeight: 600 }} />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ maxHeight: 200, overflowY: 'auto' }}>
                              {driver.orders.map((order, i) => (
                                <Box
                                  key={order.orderId}
                                  sx={{ mb: 1, p: 1, border: '1px solid #e0e0e0', borderRadius: 1, bgcolor: 'grey.50' }}
                                >
                                  <Typography variant="caption" sx={{ fontWeight: 600, color: 'primary.main' }}>
                                    Order ID: {order.orderId}
                                  </Typography>
                                  <br />
                                  <Typography variant="caption" color="text.secondary">
                                    Date: {new Date(order.date).toLocaleDateString()}
                                  </Typography>
                                </Box>
                              ))}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ maxHeight: 200, overflowY: 'auto' }}>
                              {driver.orders.map((order, i) => (
                                <Box
                                  key={order.orderId}
                                  sx={{ mb: 1, p: 1, border: '1px solid #e0e0e0', borderRadius: 1, bgcolor: 'grey.50' }}
                                >
                                  <Typography variant="caption" sx={{ fontWeight: 600 }}>
                                    Name:{' '}
                                    {typeof order.receiver.name === 'string'
                                      ? order.receiver.name
                                      : order.receiver.name?.firstName && order.receiver.name?.lastName
                                        ? `${order.receiver.name.firstName} ${order.receiver.name.lastName}`
                                        : order.receiver.name?.name || order.receiver.name?.firstName || 'Unknown'}
                                  </Typography>
                                  <br />
                                  <Typography variant="caption" color="text.secondary">
                                    Number: {order.receiver.number}
                                  </Typography>
                                  <br />
                                  <Typography variant="caption" color="text.secondary">
                                    Pincode: {order.receiver.pincode}
                                  </Typography>
                                  <br />
                                  <Typography variant="caption" color="text.secondary" sx={{ wordBreak: 'break-word' }}>
                                    Address: {order.receiver.address}
                                  </Typography>
                                </Box>
                              ))}
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          ) : tab === 6 ? (
            // Wallet Tab
            <Box>
              {/* Search Bar for Wallet */}
              <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                <TextField
                  placeholder="Search by driver name or driver ID..."
                  value={walletSearchTerm}
                  onChange={(e) => setWalletSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                  sx={{ flexGrow: 1, maxWidth: 500 }}
                />
                <Button variant="outlined" onClick={() => setWalletSearchTerm('')} disabled={!walletSearchTerm}>
                  Clear
                </Button>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <b>S. No.</b>
                      </TableCell>
                      <TableCell>
                        <b>Driver ID</b>
                      </TableCell>
                      <TableCell>
                        <b>Driver Name</b>
                      </TableCell>
                      <TableCell>
                        <b>Top Up (₹)</b>
                      </TableCell>
                      <TableCell>
                        <b>Used (₹)</b>
                      </TableCell>
                      <TableCell>
                        <b>Refund (₹)</b>
                      </TableCell>
                      <TableCell>
                        <b>Balance (₹)</b>
                      </TableCell>
                      <TableCell>
                        <b>Last Transaction</b>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredWalletData.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} align="center">
                          <Box sx={{ py: 3 }}>
                            <Typography variant="body1" color="text.secondary">
                              {walletSearchTerm ? 'No wallet data found matching your search.' : 'No wallet data available.'}
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredWalletData.map((row, idx) => (
                        <TableRow key={idx} hover>
                          <TableCell>{row.serialNo}</TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                              {row.driverId}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {row.driverName}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>
                              ₹{row.topUp.toLocaleString()}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: 'error.main' }}>
                              ₹{row.used.toLocaleString()}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            {row.refund > 0 ? (
                              <Typography variant="body2" sx={{ fontWeight: 600, color: 'warning.main' }}>
                                ₹{row.refund.toLocaleString()}
                              </Typography>
                            ) : (
                              <Typography variant="body2" color="text.secondary">
                                -
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: 'info.main' }}>
                              ₹{row.balance.toLocaleString()}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary">
                              {row.lastTransaction !== 'N/A' ? new Date(row.lastTransaction).toLocaleDateString() : 'N/A'}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          ) : tab === 7 ? (
            // Refer and Earn Tab
            <Box>
              {/* Search Bar for Refer and Earn */}
              <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                <TextField
                  placeholder="Search by driver name, ID, referrer name, or referrer ID..."
                  value={referralSearchTerm}
                  onChange={(e) => setReferralSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                  sx={{ flexGrow: 1, maxWidth: 500 }}
                />
                <Button variant="outlined" onClick={() => setReferralSearchTerm('')} disabled={!referralSearchTerm}>
                  Clear
                </Button>
              </Box>

              {loadingReferrals ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <b>S. No.</b>
                        </TableCell>
                        <TableCell>
                          <b>Driver ID</b>
                        </TableCell>
                        <TableCell>
                          <b>Driver Name</b>
                        </TableCell>
                        <TableCell>
                          <b>Mobile Number</b>
                        </TableCell>
                        <TableCell>
                          <b>City</b>
                        </TableCell>
                        <TableCell>
                          <b>Vehicle Type</b>
                        </TableCell>
                        <TableCell>
                          <b>Rides</b>
                        </TableCell>
                        <TableCell>
                          <b>Milestones</b>
                        </TableCell>
                        <TableCell>
                          <b>Rewards Credited</b>
                        </TableCell>
                        <TableCell>
                          <b>Referrer ID</b>
                        </TableCell>
                        <TableCell>
                          <b>Referrer Name</b>
                        </TableCell>
                        <TableCell>
                          <b>Referrer Mobile</b>
                        </TableCell>
                        <TableCell>
                          <b>Referral Date</b>
                        </TableCell>
                        <TableCell>
                          <b>Max Reward (₹)</b>
                        </TableCell>
                        <TableCell>
                          <b>Status</b>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredReferralData.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={15} align="center">
                            <Box sx={{ py: 3 }}>
                              <Typography variant="body1" color="text.secondary">
                                {referralSearchTerm ? 'No referrals found matching your search.' : 'No referral data available.'}
                              </Typography>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredReferralData.map((row, idx) => (
                          <TableRow key={idx} hover>
                            <TableCell>{row.serialNo}</TableCell>
                            <TableCell>
                              <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                                {row.driverId}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {row.driverName}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" color="text.secondary">
                                {row.mobileNumber}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" color="text.secondary">
                                {row.city}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={row.vehicleType || 'N/A'}
                                color={row.vehicleType === '2W' ? 'primary' : row.vehicleType === '3W' ? 'secondary' : 'default'}
                                size="small"
                                sx={{ fontWeight: 600 }}
                              />
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={`${row.ridesCompleted} rides`}
                                color="info"
                                size="small"
                                sx={{ fontWeight: 600 }}
                              />
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={`${row.milestonesCompleted}/${row.totalMilestones}`}
                                color={row.milestonesCompleted === row.totalMilestones ? 'success' : 'warning'}
                                size="small"
                                sx={{ fontWeight: 600 }}
                              />
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>
                                ₹{row.rewardsCredited}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" color="text.secondary">
                                {row.referrerId}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              {row.referrerName !== 'N/A' ? (
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <Avatar sx={{ mr: 2, bgcolor: 'secondary.main', width: 32, height: 32, fontSize: '0.875rem' }}>
                                    {row.referrerName[0]}
                                  </Avatar>
                                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                    {row.referrerName}
                                  </Typography>
                                </Box>
                              ) : (
                                <Typography variant="body2" color="text.secondary">
                                  {row.referrerName}
                                </Typography>
                              )}
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" color="text.secondary">
                                {row.referrerPhone}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">{new Date(row.referralDate).toLocaleDateString()}</Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                ₹{row.maxReward}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={row.status}
                                color={row.status === 'Active' ? 'success' : 'warning'}
                                size="small"
                                sx={{ fontWeight: 600 }}
                              />
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Box>
          ) : (
            <Box sx={{ py: 4, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">
                {tabLabels[tab]} content will be implemented here.
              </Typography>
            </Box>
          )}
        </Paper>
      </Box>

      {/* Add Referral Dialog */}
      <Dialog open={openAddReferralDialog} onClose={handleCloseAddReferralDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Add Referral Earnings</DialogTitle>
        <DialogContent dividers>
          <Box component="form" id="add-referral-form" onSubmit={handleAddReferralSubmit} sx={{ mt: 1 }}>
            <TextField
              label="Referral Code"
              name="referralCode"
              value={addReferralForm.referralCode}
              onChange={handleAddReferralFormChange}
              fullWidth
              margin="normal"
              required
              placeholder="Enter referrer's referral code"
              helperText="The unique referral code of the referring driver"
            />
            <TextField
              label="Referred User Phone"
              name="referredUserPhone"
              value={addReferralForm.referredUserPhone}
              onChange={handleAddReferralFormChange}
              fullWidth
              margin="normal"
              required
              placeholder="Enter referred user's phone number"
              helperText="Phone number of the new driver who was referred"
            />
            <TextField
              select
              label="Vehicle Type"
              name="vehicleType"
              value={addReferralForm.vehicleType}
              onChange={handleAddReferralFormChange}
              fullWidth
              margin="normal"
              required
              helperText={loadingCampaigns ? 'Loading campaigns...' : 'Select vehicle type - reward amount based on active campaign'}
              disabled={loadingCampaigns}
            >
              {loadingCampaigns ? (
                <MenuItem value="">Loading...</MenuItem>
              ) : campaigns.length > 0 ? (
                campaigns.map((campaign) => (
                  <MenuItem key={campaign._id} value={campaign.vehicleType}>
                    {campaign.name} - ₹{campaign.rewardAmount}
                  </MenuItem>
                ))
              ) : (
                <>
                  <MenuItem value="2W">Two Wheeler (2W) - ₹600</MenuItem>
                  <MenuItem value="3W">Three Wheeler (3W) - ₹1200</MenuItem>
                  <MenuItem value="Truck">Truck - ₹1600</MenuItem>
                </>
              )}
            </TextField>
            <TextField
              label="Referral Date"
              name="referralDate"
              type="date"
              value={addReferralForm.referralDate}
              onChange={handleAddReferralFormChange}
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true
              }}
              helperText="Date for record keeping (backend will use server timestamp)"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddReferralDialog} disabled={loadingReferrals}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="add-referral-form"
            variant="contained"
            color="success"
            disabled={loadingReferrals}
            startIcon={loadingReferrals ? <CircularProgress size={20} /> : null}
          >
            {loadingReferrals ? 'Adding...' : 'Add Referral'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Manage Campaigns Dialog */}
      <Dialog open={openManageCampaignsDialog} onClose={() => setOpenManageCampaignsDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Manage Referral Campaigns</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ mb: 2 }}>
            <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => handleOpenCampaignForm('add')}>
              Create New Campaign
            </Button>
          </Box>
          {loadingCampaigns ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : campaigns.length === 0 ? (
            <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>
              No campaigns found. Create your first campaign!
            </Typography>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <b>Name</b>
                    </TableCell>
                    <TableCell>
                      <b>Vehicle Type</b>
                    </TableCell>
                    <TableCell>
                      <b>Reward</b>
                    </TableCell>
                    <TableCell>
                      <b>Status</b>
                    </TableCell>
                    <TableCell>
                      <b>Actions</b>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {campaigns.map((campaign) => (
                    <TableRow key={campaign._id} hover>
                      <TableCell>{campaign.name}</TableCell>
                      <TableCell>
                        <Chip
                          label={campaign.vehicleType}
                          color={campaign.vehicleType === '2W' ? 'primary' : campaign.vehicleType === '3W' ? 'secondary' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>₹{campaign.rewardAmount}</TableCell>
                      <TableCell>
                        <Chip
                          label={campaign.isActive ? 'Active' : 'Inactive'}
                          color={campaign.isActive ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton size="small" color="primary" onClick={() => handleOpenCampaignForm('edit', campaign)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" color="error" onClick={() => handleDeleteCampaign(campaign._id)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenManageCampaignsDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Campaign Form Dialog */}
      <Dialog open={openCampaignFormDialog} onClose={handleCloseCampaignForm} maxWidth="sm" fullWidth>
        <DialogTitle>{campaignFormMode === 'edit' ? 'Edit Campaign' : 'Create New Campaign'}</DialogTitle>
        <DialogContent dividers>
          <Box component="form" id="campaign-form" onSubmit={handleCampaignSubmit} sx={{ mt: 1 }}>
            <TextField
              label="Campaign Name"
              name="name"
              value={campaignForm.name}
              onChange={handleCampaignFormChange}
              fullWidth
              margin="normal"
              required
              placeholder="e.g., 2 Wheeler Referral Bonus"
            />
            <TextField
              select
              label="Vehicle Type"
              name="vehicleType"
              value={campaignForm.vehicleType}
              onChange={handleCampaignFormChange}
              fullWidth
              margin="normal"
              required
            >
              <MenuItem value="2W">Two Wheeler (2W)</MenuItem>
              <MenuItem value="3W">Three Wheeler (3W)</MenuItem>
              <MenuItem value="Truck">Truck</MenuItem>
            </TextField>
            <TextField
              label="Reward Amount (₹)"
              name="rewardAmount"
              type="number"
              value={campaignForm.rewardAmount}
              onChange={handleCampaignFormChange}
              fullWidth
              margin="normal"
              required
              placeholder="e.g., 600"
              inputProps={{ min: 0 }}
            />
            <TextField
              select
              label="Icon"
              name="icon"
              value={campaignForm.icon}
              onChange={handleCampaignFormChange}
              fullWidth
              margin="normal"
            >
              <MenuItem value="bike">Bike</MenuItem>
              <MenuItem value="auto">Auto</MenuItem>
              <MenuItem value="truck">Truck</MenuItem>
              <MenuItem value="local_shipping">Local Shipping</MenuItem>
              <MenuItem value="two_wheeler">Two Wheeler</MenuItem>
              <MenuItem value="three_wheeler">Three Wheeler</MenuItem>
            </TextField>
            <TextField
              label="Description"
              name="description"
              value={campaignForm.description}
              onChange={handleCampaignFormChange}
              fullWidth
              margin="normal"
              required
              multiline
              rows={2}
              placeholder="Describe the campaign benefits"
            />

            {/* Milestones Section */}
            <Box sx={{ mt: 3, mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                Reward Milestones (Stepwise Earnings)
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                Define milestone-based rewards. Referrers earn rewards as referred drivers complete rides.
              </Typography>

              {campaignForm.milestones.map((milestone, index) => (
                <Box key={index} sx={{ p: 2, mb: 2, border: '1px solid #e0e0e0', borderRadius: 1, bgcolor: '#f9f9f9' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle2" color="primary">
                      Milestone #{index + 1}
                    </Typography>
                    {campaignForm.milestones.length > 1 && (
                      <IconButton size="small" color="error" onClick={() => handleRemoveMilestone(index)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Box>

                  <TextField
                    label="Title"
                    value={milestone.title}
                    onChange={(e) => handleMilestoneChange(index, 'title', e.target.value)}
                    fullWidth
                    size="small"
                    margin="dense"
                    placeholder="e.g., 10 Rides Bonus"
                  />

                  <TextField
                    label="Description"
                    value={milestone.description}
                    onChange={(e) => handleMilestoneChange(index, 'description', e.target.value)}
                    fullWidth
                    size="small"
                    margin="dense"
                    placeholder="e.g., Complete 10 rides"
                  />

                  <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                    <TextField
                      label="Rides Required"
                      type="number"
                      value={milestone.rides}
                      onChange={(e) => handleMilestoneChange(index, 'rides', e.target.value)}
                      size="small"
                      inputProps={{ min: 0 }}
                      helperText="0 for activation"
                      sx={{ flex: 1 }}
                    />

                    <TextField
                      label="Reward (₹)"
                      type="number"
                      value={milestone.reward}
                      onChange={(e) => handleMilestoneChange(index, 'reward', e.target.value)}
                      size="small"
                      inputProps={{ min: 0 }}
                      sx={{ flex: 1 }}
                    />

                    <TextField
                      label="Days to Complete"
                      type="number"
                      value={milestone.daysToComplete === null ? '' : milestone.daysToComplete}
                      onChange={(e) => handleMilestoneChange(index, 'daysToComplete', e.target.value === '' ? null : e.target.value)}
                      size="small"
                      inputProps={{ min: 0 }}
                      helperText="Leave empty for no limit"
                      sx={{ flex: 1 }}
                    />
                  </Box>
                </Box>
              ))}

              <Button size="small" startIcon={<AddIcon />} onClick={handleAddMilestone} variant="outlined">
                Add Milestone
              </Button>

              <TextField
                label="Max Total Reward (₹)"
                name="maxReward"
                type="number"
                value={campaignForm.maxReward}
                onChange={handleCampaignFormChange}
                fullWidth
                margin="normal"
                helperText={`Auto-calculated: ₹${campaignForm.milestones.reduce((sum, m) => sum + (Number(m.reward) || 0), 0)} (sum of all milestone rewards)`}
                inputProps={{ min: 0 }}
                sx={{ mt: 2 }}
              />
            </Box>

            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Terms & Conditions
              </Typography>
              {campaignForm.terms.map((term, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  <TextField
                    value={term}
                    onChange={(e) => handleTermChange(index, e.target.value)}
                    fullWidth
                    size="small"
                    placeholder={`Term ${index + 1}`}
                  />
                  {campaignForm.terms.length > 1 && (
                    <IconButton size="small" color="error" onClick={() => handleRemoveTerm(index)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  )}
                </Box>
              ))}
              <Button size="small" startIcon={<AddIcon />} onClick={handleAddTerm}>
                Add Term
              </Button>
            </Box>
            <Box sx={{ mt: 2 }}>
              <label>
                <input
                  type="checkbox"
                  name="isActive"
                  checked={campaignForm.isActive}
                  onChange={handleCampaignFormChange}
                  style={{ marginRight: 8 }}
                />
                Active Campaign
              </label>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCampaignForm} disabled={loadingCampaigns}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="campaign-form"
            variant="contained"
            color="primary"
            disabled={loadingCampaigns}
            startIcon={loadingCampaigns ? <CircularProgress size={20} /> : null}
          >
            {loadingCampaigns ? 'Saving...' : campaignFormMode === 'edit' ? 'Update Campaign' : 'Create Campaign'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Driver Details Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          Driver Details
          <IconButton onClick={handleCloseDialog} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedDriver && (
            <Box>
              <Typography variant="h6" color="primary" gutterBottom>
                {selectedDriver.fullName}
              </Typography>
              <Typography>
                <b>Mobile:</b> {selectedDriver.altMobile}
              </Typography>
              <Typography>
                <b>Email:</b> {selectedDriver.email}
              </Typography>
              <Typography>
                <b>Address:</b> {selectedDriver.address}
              </Typography>
              <Typography>
                <b>Status:</b> {selectedDriver.status}
              </Typography>
              <Typography>
                <b>Vehicle Type:</b> {selectedDriver.vehicleType}
              </Typography>
              <Typography sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <b>Online:</b>
                {isDriverOnline(selectedDriver) ? (
                  <Chip label="Online" color="success" size="small" sx={{ fontWeight: 600, height: 24 }} />
                ) : (
                  <Chip label="Offline" color="default" size="small" sx={{ fontWeight: 600, height: 24 }} />
                )}
              </Typography>
              <Typography>
                <b>License Number:</b> {selectedDriver.licenseNumber}
              </Typography>
              <Typography>
                <b>Aadhar Number:</b> {selectedDriver.aadharNumber}
              </Typography>
              <Typography>
                <b>PAN Number:</b> {selectedDriver.panNumber}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <Typography>
                  <b>Rating:</b>
                </Typography>
                <Rating value={selectedDriver.rating} precision={0.1} readOnly sx={{ ml: 1 }} />
                <Typography sx={{ ml: 1 }}>({selectedDriver.rating})</Typography>
              </Box>
              <Box sx={{ mt: 2, mb: 1 }}>
                <Typography variant="subtitle1" color="secondary">
                  Order Details
                </Typography>
                <Typography>
                  <b>Order ID:</b> {selectedDriver.order.id}
                </Typography>
                <Typography>
                  <b>Item:</b> {selectedDriver.order.item}
                </Typography>
                <Typography>
                  <b>Order Status:</b> {selectedDriver.order.status}
                </Typography>
              </Box>
              <Box sx={{ mt: 2, mb: 1 }}>
                <Typography variant="subtitle1" color="secondary">
                  Location Details
                </Typography>
                <Typography>
                  <b>Pick up point:</b> {selectedDriver.location.pickup}
                </Typography>
                <Typography>
                  <b>Drop point:</b> {selectedDriver.location.drop}
                </Typography>
              </Box>
              <Box sx={{ mt: 2, mb: 1 }}>
                <Typography variant="subtitle1" color="secondary">
                  Documents
                </Typography>
                <Typography>
                  <b>Aadhar:</b>{' '}
                  <Link href="#" underline="hover">
                    {selectedDriver.documents.aadhar || '-'}
                  </Link>
                </Typography>
                <Typography>
                  <b>PAN:</b>{' '}
                  <Link href="#" underline="hover">
                    {selectedDriver.documents.pan || '-'}
                  </Link>
                </Typography>
                <Typography>
                  <b>License:</b>{' '}
                  <Link href="#" underline="hover">
                    {selectedDriver.documents.license || '-'}
                  </Link>
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add/Edit Driver Dialog */}
      <Dialog open={openForm} onClose={handleCloseForm} maxWidth="sm" fullWidth>
        <DialogTitle>{formMode === 'add' ? 'Add Driver' : 'Edit Driver'}</DialogTitle>
        <DialogContent dividers>
          <form id="driver-form" onSubmit={handleFormSubmit}>
            <TextField
              label="Full Name"
              name="fullName"
              value={formDriver.fullName || ''}
              onChange={handleFormChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Alternate Mobile"
              name="altMobile"
              value={formDriver.altMobile || ''}
              onChange={handleFormChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Email"
              name="email"
              value={formDriver.email || ''}
              onChange={handleFormChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Address"
              name="address"
              value={formDriver.address || ''}
              onChange={handleFormChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Status"
              name="status"
              value={formDriver.status || ''}
              onChange={handleFormChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Vehicle Type"
              name="vehicleType"
              value={formDriver.vehicleType || ''}
              onChange={handleFormChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="License Number"
              name="licenseNumber"
              value={formDriver.licenseNumber || ''}
              onChange={handleFormChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Aadhar Number"
              name="aadharNumber"
              value={formDriver.aadharNumber || ''}
              onChange={handleFormChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="PAN Number"
              name="panNumber"
              value={formDriver.panNumber || ''}
              onChange={handleFormChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Rating"
              name="rating"
              type="number"
              step="0.1"
              value={formDriver.rating || ''}
              onChange={handleFormChange}
              fullWidth
              margin="normal"
              required
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseForm}>Cancel</Button>
          <Button type="submit" form="driver-form" variant="contained" color="primary">
            {formMode === 'add' ? 'Add' : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteId} onClose={cancelDelete} maxWidth="xs">
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent dividers>
          {deleteDriver_toDelete ? (
            <Box>
              <Typography variant="body1" gutterBottom>
                Are you sure you want to delete this driver?
              </Typography>
              <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Driver ID: {deleteDriver_toDelete.driverId}
                </Typography>
                <Typography variant="body2">Name: {safeExtractDriverName(deleteDriver_toDelete)}</Typography>
                <Typography variant="body2">Mobile: {deleteDriver_toDelete.altMobile || 'N/A'}</Typography>
              </Box>
              <Typography variant="caption" color="error" sx={{ mt: 2, display: 'block' }}>
                This action cannot be undone.
              </Typography>
            </Box>
          ) : (
            <Typography>Are you sure you want to delete this driver?</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for feedback */}
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Dialog for showing all documents and approve/reject */}
      <Dialog
        open={openDialog === 'documents'}
        onClose={() => {
          setOpenDialog(false);
          setSelectedDriver(null);
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          Driver Documents
          <IconButton
            onClick={() => {
              setOpenDialog(false);
              setSelectedDriver(null);
            }}
            size="small"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedDriver && (
            <Box>
              <Typography variant="h6" color="primary" gutterBottom>
                {selectedDriver.fullName}
              </Typography>
              <Typography>
                <b>Driver ID:</b> {selectedDriver.driverId}
              </Typography>
              <Typography>
                <b>Aadhar:</b>{' '}
                <Link href="#" underline="hover">
                  {selectedDriver.documents?.aadhar || '-'}
                </Link>
              </Typography>
              <Typography>
                <b>PAN:</b>{' '}
                <Link href="#" underline="hover">
                  {selectedDriver.documents?.pan || '-'}
                </Link>
              </Typography>
              <Typography>
                <b>License:</b>{' '}
                <Link href="#" underline="hover">
                  {selectedDriver.documents?.license || '-'}
                </Link>
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Chip
                  label={selectedDriver.documentStatus}
                  color={
                    selectedDriver.documentStatus === 'Approved'
                      ? 'success'
                      : selectedDriver.documentStatus === 'Rejected'
                        ? 'error'
                        : 'warning'
                  }
                  size="small"
                  sx={{ fontWeight: 600 }}
                />
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenDialog(false);
              setSelectedDriver(null);
            }}
          >
            Close
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={async () => {
              try {
                await updateDriver(selectedDriver.id, { documentStatus: 'Approved' });
                showSnackbar('Documents approved successfully!', 'success');
                setOpenDialog(false);
                setSelectedDriver(null);
              } catch (error) {
                showSnackbar('Failed to approve documents', 'error');
              }
            }}
            disabled={selectedDriver?.documentStatus === 'Approved'}
          >
            Approve
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={async () => {
              try {
                await updateDriver(selectedDriver.id, { documentStatus: 'Rejected' });
                showSnackbar('Documents rejected successfully!', 'success');
                setOpenDialog(false);
                setSelectedDriver(null);
              } catch (error) {
                showSnackbar('Failed to reject documents', 'error');
              }
            }}
            disabled={selectedDriver?.documentStatus === 'Rejected'}
          >
            Reject
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Document Dialog */}
      <Dialog
        open={viewDocDialog.open}
        onClose={() => setViewDocDialog({ open: false, title: '', src: '', fieldKey: '', driver: null })}
        maxWidth="xl"
        fullWidth
        PaperProps={{
          sx: {
            height: '95vh',
            maxHeight: '95vh',
            display: 'flex',
            flexDirection: 'column'
          }
        }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {viewDocDialog.title}
              </Typography>
              {viewDocDialog.driver && (
                <Typography variant="caption" color="text.secondary">
                  {(() => {
                    const currentIndex = documentFields.findIndex((field) => field.key === viewDocDialog.fieldKey);
                    return `Document ${currentIndex + 1} of ${documentFields.length}`;
                  })()}
                </Typography>
              )}
            </Box>
            <IconButton onClick={() => setViewDocDialog({ open: false, title: '', src: '', fieldKey: '', driver: null })}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            p: 0,
            position: 'relative'
          }}
        >
          {viewDocDialog.src ? (
            <Box
              sx={{
                position: 'relative',
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'grey.100',
                overflow: 'hidden'
              }}
            >
              {/* Navigation Buttons */}
              {/* Previous Button */}
              <IconButton
                onClick={handlePreviousDocument}
                disabled={!viewDocDialog.driver || documentFields.findIndex((field) => field.key === viewDocDialog.fieldKey) === 0}
                sx={{
                  position: 'absolute',
                  left: 16,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  bgcolor: 'background.paper',
                  boxShadow: 3,
                  '&:hover': {
                    bgcolor: 'primary.main',
                    color: 'white'
                  },
                  '&:disabled': {
                    bgcolor: 'grey.200'
                  },
                  zIndex: 10
                }}
              >
                <ArrowBackIosNewIcon />
              </IconButton>

              {/* Document Display Area */}
              <Box
                sx={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  p: 2,
                  position: 'relative'
                }}
              >
                <Box sx={{ position: 'relative', maxWidth: '100%', maxHeight: '100%' }}>
                  <img
                    src={viewDocDialog.src}
                    alt={viewDocDialog.title}
                    crossOrigin="anonymous"
                    style={{
                      maxWidth: '100%',
                      maxHeight: 'calc(95vh - 200px)',
                      width: 'auto',
                      height: 'auto',
                      objectFit: 'contain',
                      borderRadius: '8px',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                      display: 'block'
                    }}
                    onLoad={(e) => {
                      console.log('✅ Image loaded successfully:', viewDocDialog.src);
                      console.log('✅ Image dimensions:', e.target.naturalWidth, 'x', e.target.naturalHeight);
                    }}
                    onError={(e) => {
                      console.error('❌ Image failed to load:', viewDocDialog.src);

                      // Try without CORS as fallback
                      if (e.target.crossOrigin === 'anonymous') {
                        console.log('🔄 Retrying without CORS...');
                        e.target.crossOrigin = null;
                        e.target.src = viewDocDialog.src;
                        return;
                      }

                      // Hide the image silently without showing error
                      e.target.style.display = 'none';

                      // Show a simple message
                      if (!e.target.parentElement.querySelector('.error-message')) {
                        const errorMsg = document.createElement('div');
                        errorMsg.className = 'error-message';
                        errorMsg.innerHTML = `
                          <div style="color: #666; padding: 60px 20px; text-align: center; background: #f5f5f5; border-radius: 8px;">
                            <p style="font-size: 16px; margin: 0;">Document not available</p>
                          </div>
                        `;
                        e.target.parentElement.appendChild(errorMsg);
                      }
                    }}
                  />
                  {/* Show approval checkmark on image */}
                  {viewDocDialog.driver &&
                    viewDocDialog.fieldKey &&
                    documentApprovals[viewDocDialog.driver.id]?.[viewDocDialog.fieldKey] === 'approved' && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 16,
                          right: 16,
                          bgcolor: 'success.main',
                          borderRadius: '50%',
                          width: 60,
                          height: 60,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                        }}
                      >
                        <CheckCircleIcon sx={{ color: 'white', fontSize: 40 }} />
                      </Box>
                    )}
                  {/* Show rejection mark on image */}
                  {viewDocDialog.driver &&
                    viewDocDialog.fieldKey &&
                    documentApprovals[viewDocDialog.driver.id]?.[viewDocDialog.fieldKey] === 'rejected' && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 16,
                          right: 16,
                          bgcolor: 'error.main',
                          borderRadius: '50%',
                          width: 60,
                          height: 60,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                        }}
                      >
                        <CancelOutlinedIcon sx={{ color: 'white', fontSize: 40 }} />
                      </Box>
                    )}
                  {/* Show rejection reason if exists */}
                  {viewDocDialog.driver &&
                    viewDocDialog.fieldKey &&
                    documentApprovals[viewDocDialog.driver.id]?.[viewDocDialog.fieldKey] === 'rejected' &&
                    documentRejectionReasons[`${viewDocDialog.driver.id}_${viewDocDialog.fieldKey}`] && (
                      <Box
                        sx={{
                          position: 'absolute',
                          bottom: 16,
                          left: 16,
                          right: 16,
                          bgcolor: 'error.light',
                          color: 'error.contrastText',
                          p: 2,
                          borderRadius: 1,
                          boxShadow: 3
                        }}
                      >
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                          Rejection Reason:
                        </Typography>
                        <Typography variant="body2">
                          {documentRejectionReasons[`${viewDocDialog.driver.id}_${viewDocDialog.fieldKey}`]}
                        </Typography>
                      </Box>
                    )}
                </Box>
              </Box>

              {/* Next Button */}
              <IconButton
                onClick={handleNextDocument}
                disabled={
                  !viewDocDialog.driver ||
                  documentFields.findIndex((field) => field.key === viewDocDialog.fieldKey) === documentFields.length - 1
                }
                sx={{
                  position: 'absolute',
                  right: 16,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  bgcolor: 'background.paper',
                  boxShadow: 3,
                  '&:hover': {
                    bgcolor: 'primary.main',
                    color: 'white'
                  },
                  '&:disabled': {
                    bgcolor: 'grey.200'
                  },
                  zIndex: 10
                }}
              >
                <ArrowForwardIosIcon />
              </IconButton>
            </Box>
          ) : (
            <Box sx={{ py: 5, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                ⚠️ No document available
              </Typography>
              <Typography variant="body2" color="text.secondary">
                This document has not been uploaded yet.
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'space-between', px: 3, py: 2, borderTop: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIosNewIcon />}
              onClick={handlePreviousDocument}
              disabled={!viewDocDialog.driver || documentFields.findIndex((field) => field.key === viewDocDialog.fieldKey) === 0}
            >
              Previous
            </Button>
            <Button
              variant="outlined"
              endIcon={<ArrowForwardIosIcon />}
              onClick={handleNextDocument}
              disabled={
                !viewDocDialog.driver ||
                documentFields.findIndex((field) => field.key === viewDocDialog.fieldKey) === documentFields.length - 1
              }
            >
              Next
            </Button>
          </Box>
          {viewDocDialog.driver && viewDocDialog.fieldKey && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                color="success"
                startIcon={<CheckCircleIcon />}
                onClick={() => handleApproveIndividualDoc(viewDocDialog.driver, viewDocDialog.fieldKey, viewDocDialog.title)}
                disabled={documentApprovals[viewDocDialog.driver.id]?.[viewDocDialog.fieldKey] === 'approved'}
              >
                Approve
              </Button>
              <Button
                variant="contained"
                color="error"
                startIcon={<CancelOutlinedIcon />}
                onClick={() => handleRejectIndividualDoc(viewDocDialog.driver, viewDocDialog.fieldKey, viewDocDialog.title)}
                disabled={documentApprovals[viewDocDialog.driver.id]?.[viewDocDialog.fieldKey] === 'rejected'}
              >
                Reject
              </Button>
            </Box>
          )}
          <Button variant="contained" onClick={() => setViewDocDialog({ open: false, title: '', src: '', fieldKey: '', driver: null })}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* High Orders Dialog */}
      {openHighOrderDialog && selectedHighOrderDriver && (
        <Dialog open={openHighOrderDialog} onClose={() => setOpenHighOrderDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>High Orders for {selectedHighOrderDriver.driverName}</DialogTitle>
          <DialogContent dividers>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <b>Order ID</b>
                    </TableCell>
                    <TableCell>
                      <b>Date</b>
                    </TableCell>
                    <TableCell>
                      <b>Pickup Location</b>
                    </TableCell>
                    <TableCell>
                      <b>Drop Location</b>
                    </TableCell>
                    <TableCell>
                      <b>Pickup Time</b>
                    </TableCell>
                    <TableCell>
                      <b>Drop Time</b>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedHighOrderDriver.orders.map((order, idx) => (
                    <TableRow key={order.orderId}>
                      <TableCell>{order.orderId}</TableCell>
                      <TableCell>{order.date || '-'}</TableCell>
                      <TableCell>{order.receiver?.pickup || order.pickup || '-'}</TableCell>
                      <TableCell>{order.receiver?.drop || order.drop || '-'}</TableCell>
                      <TableCell>{order.pickupTime || order.pickTime || '-'}</TableCell>
                      <TableCell>{order.dropTime || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenHighOrderDialog(false)} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* All Documents Dialog - Grid View with Individual Approve/Reject */}
      <Dialog
        open={openAllDocsDialog}
        onClose={handleCloseAllDocsDialog}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            minHeight: '80vh',
            maxHeight: '90vh'
          }
        }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 600, color: 'primary.main' }}>
                All Documents
              </Typography>
              {selectedDriverForDocs && (
                <Typography variant="body2" color="text.secondary">
                  Driver: {safeExtractDriverName(selectedDriverForDocs)} ({selectedDriverForDocs.driverId})
                </Typography>
              )}
            </Box>
            <IconButton onClick={handleCloseAllDocsDialog}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {selectedDriverForDocs && (
            <Box sx={{ p: 2 }}>
              {/* Driver Info Card */}
              <Paper sx={{ p: 2, mb: 3, bgcolor: 'primary.lighter', borderRadius: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar src={selectedDriverForDocs.photo || selectedDriverForDocs.profilePhoto} sx={{ width: 60, height: 60 }}>
                    {safeExtractDriverName(selectedDriverForDocs)[0]?.toUpperCase()}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {safeExtractDriverName(selectedDriverForDocs)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Mobile: {selectedDriverForDocs.altMobile || selectedDriverForDocs.phone || 'N/A'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Email: {selectedDriverForDocs.email || 'N/A'}
                    </Typography>
                  </Box>
                  <Chip
                    label={selectedDriverForDocs.documentStatus || 'Pending'}
                    color={
                      selectedDriverForDocs.documentStatus === 'Approved'
                        ? 'success'
                        : selectedDriverForDocs.documentStatus === 'Rejected'
                          ? 'error'
                          : 'warning'
                    }
                    sx={{ fontWeight: 600 }}
                  />
                </Box>
              </Paper>

              {/* Documents Grid */}
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                  gap: 3
                }}
              >
                {documentFields.map((field) => {
                  const docUrl = getDocumentUrl(selectedDriverForDocs, field.key);
                  const docStatus = documentApprovals[selectedDriverForDocs.id]?.[field.key] || 'pending';

                  return (
                    <Paper
                      key={field.key}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        border:
                          docStatus === 'approved'
                            ? '2px solid #4caf50'
                            : docStatus === 'rejected'
                              ? '2px solid #f44336'
                              : '1px solid #e0e0e0',
                        transition: 'all 0.3s',
                        '&:hover': {
                          boxShadow: 6,
                          transform: 'translateY(-4px)'
                        }
                      }}
                    >
                      {/* Document Header */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                          {field.label}
                        </Typography>
                        {docStatus === 'approved' && <CheckCircleIcon sx={{ color: 'success.main', fontSize: 24 }} />}
                        {docStatus === 'rejected' && <CancelOutlinedIcon sx={{ color: 'error.main', fontSize: 24 }} />}
                      </Box>

                      {/* Document Preview */}
                      <Box
                        sx={{
                          width: '100%',
                          height: 200,
                          bgcolor: '#f5f5f5',
                          borderRadius: 1,
                          mb: 2,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          overflow: 'hidden',
                          position: 'relative',
                          cursor: docUrl ? 'pointer' : 'default'
                        }}
                        onClick={() => {
                          if (docUrl && docUrl !== 'N/A' && !docUrl.includes('/N/A')) {
                            setViewDocDialog({
                              open: true,
                              title: field.label,
                              src: docUrl,
                              fieldKey: field.key,
                              driver: selectedDriverForDocs
                            });
                          }
                        }}
                      >
                        {docUrl && docUrl !== 'N/A' && !docUrl.includes('/N/A') ? (
                          <img
                            src={docUrl}
                            alt={field.label}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover'
                            }}
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.parentElement.innerHTML = `
                                <div style="color: #999; text-align: center; padding: 20px;">
                                  <p style="margin: 0;">Document not available</p>
                                </div>
                              `;
                            }}
                          />
                        ) : (
                          <Box sx={{ textAlign: 'center', color: 'text.secondary' }}>
                            <DescriptionIcon sx={{ fontSize: 48, opacity: 0.3, mb: 1 }} />
                            <Typography variant="caption">Not uploaded</Typography>
                          </Box>
                        )}

                        {/* Status Badge Overlay */}
                        {docStatus === 'approved' && (
                          <Box
                            sx={{
                              position: 'absolute',
                              top: 8,
                              right: 8,
                              bgcolor: 'success.main',
                              color: 'white',
                              px: 1.5,
                              py: 0.5,
                              borderRadius: 1,
                              fontSize: '0.7rem',
                              fontWeight: 600
                            }}
                          >
                            APPROVED
                          </Box>
                        )}
                        {docStatus === 'rejected' && (
                          <Box
                            sx={{
                              position: 'absolute',
                              top: 8,
                              right: 8,
                              bgcolor: 'error.main',
                              color: 'white',
                              px: 1.5,
                              py: 0.5,
                              borderRadius: 1,
                              fontSize: '0.7rem',
                              fontWeight: 600
                            }}
                          >
                            REJECTED
                          </Box>
                        )}
                      </Box>

                      {/* Rejection Reason Display */}
                      {docStatus === 'rejected' && documentRejectionReasons[`${selectedDriverForDocs.id}_${field.key}`] && (
                        <Box
                          sx={{
                            mt: 1,
                            p: 1,
                            bgcolor: 'error.lighter',
                            borderRadius: 1,
                            border: '1px solid',
                            borderColor: 'error.main'
                          }}
                        >
                          <Typography variant="caption" sx={{ fontWeight: 600, color: 'error.main', display: 'block', mb: 0.5 }}>
                            Rejection Reason:
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'error.dark' }}>
                            {documentRejectionReasons[`${selectedDriverForDocs.id}_${field.key}`]}
                          </Typography>
                        </Box>
                      )}

                      {/* Action Buttons */}
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          fullWidth
                          startIcon={<CheckCircleIcon />}
                          onClick={() => handleApproveIndividualDoc(selectedDriverForDocs, field.key, field.label)}
                          disabled={!docUrl || docUrl === 'N/A' || docStatus === 'approved'}
                          sx={{
                            fontSize: '0.75rem',
                            fontWeight: 600
                          }}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          fullWidth
                          startIcon={<CancelOutlinedIcon />}
                          onClick={() => handleRejectIndividualDoc(selectedDriverForDocs, field.key, field.label)}
                          disabled={!docUrl || docUrl === 'N/A' || docStatus === 'rejected'}
                          sx={{
                            fontSize: '0.75rem',
                            fontWeight: 600
                          }}
                        >
                          Reject
                        </Button>
                      </Box>

                      {/* View Full Button */}
                      {docUrl && docUrl !== 'N/A' && !docUrl.includes('/N/A') && (
                        <Button
                          variant="outlined"
                          size="small"
                          fullWidth
                          sx={{ mt: 1, fontSize: '0.7rem' }}
                          onClick={() => {
                            setViewDocDialog({
                              open: true,
                              title: field.label,
                              src: docUrl,
                              fieldKey: field.key,
                              driver: selectedDriverForDocs
                            });
                          }}
                        >
                          View Full Size
                        </Button>
                      )}
                    </Paper>
                  );
                })}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={handleCloseAllDocsDialog} variant="outlined">
            Close
          </Button>
          <Button
            variant="contained"
            color="success"
            startIcon={<CheckCircleIcon />}
            onClick={() => {
              if (selectedDriverForDocs) {
                handleApproveDocument(selectedDriverForDocs.id, safeExtractDriverName(selectedDriverForDocs));
                handleCloseAllDocsDialog();
              }
            }}
            disabled={selectedDriverForDocs?.documentStatus === 'Approved'}
          >
            Approve All Documents
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<CancelOutlinedIcon />}
            onClick={() => {
              if (selectedDriverForDocs) {
                handleRejectDocument(selectedDriverForDocs.id, safeExtractDriverName(selectedDriverForDocs));
                handleCloseAllDocsDialog();
              }
            }}
            disabled={selectedDriverForDocs?.documentStatus === 'Rejected'}
          >
            Reject All Documents
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageDriver;
