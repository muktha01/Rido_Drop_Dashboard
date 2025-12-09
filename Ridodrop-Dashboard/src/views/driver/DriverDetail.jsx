import React, { useState, useEffect } from 'react';
import { getDriverById, getDriverOrders, transformDriverData, uploadDriverDocument, getDocumentUrl } from '../../api/driverApi';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Button,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Tooltip,
  Grid,
  Card,
  CardContent,
  Divider,
  Container,
  Stack,
  IconButton,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PhoneIcon from '@mui/icons-material/Phone';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import AirportShuttleIcon from '@mui/icons-material/AirportShuttle';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ReplayIcon from '@mui/icons-material/Replay';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import EmailIcon from '@mui/icons-material/Email';
import BadgeIcon from '@mui/icons-material/Badge';
import BusinessIcon from '@mui/icons-material/Business';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import HistoryIcon from '@mui/icons-material/History';
import ReceiptIcon from '@mui/icons-material/Receipt';
import StarIcon from '@mui/icons-material/Star';
import PersonIcon from '@mui/icons-material/Person';
import DescriptionIcon from '@mui/icons-material/Description';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DownloadIcon from '@mui/icons-material/Download';
import UploadFileIcon from '@mui/icons-material/UploadFile';

// Dummy data for demonstration
const dummyDrivers = [
  {
    id: 'DRV001',
    name: 'John Doe',
    status: 'Active',
    mobile: '9876543210',
    email: 'john.doe@email.com',
    joiningDate: '2023-01-15',
    driverId: 'DRV001',
    rating: 4.5,
    totalOrders: 156,
    completedOrders: 142,
    cancelledOrders: 8,
    totalEarnings: 45600,
    address: '123 Main St, City A, State - 123456',
    vehicleType: '2W',
    online: true,
    licenseNumber: 'DL-1234567890123',
    aadharNumber: '1234-5678-9012',
    panNumber: 'ABCDE1234F',
    lastActive: '2024-01-24 14:30',
    bank: {
      accountNumber: '1234567890',
      ifsc: 'SBIN0001234',
      bankName: 'State Bank of India',
      branch: 'Connaught Place',
      holder: 'John Doe'
    },
    balance: 2500,
    vehicleDetails: {
      model: 'Honda Activa 6G',
      registrationNumber: 'MH-01-AB-1234',
      color: 'White',
      year: '2022'
    },
    currentOrder: {
      id: 'ORD123',
      item: 'Electronics Package',
      status: 'In Transit',
      pickup: 'Sector 10, City A',
      drop: 'Sector 22, City B',
      amount: 450,
      estimatedDelivery: '2024-01-24 16:00'
    },
    orders: {
      '2W': [
        {
          orderId: 'ORD001',
          date: '2024-01-15',
          amount: 150,
          status: 'Completed',
          customer: 'Alice Johnson',
          customerMobile: '9000000001',
          pickup: {
            location: 'Sector 10, City A',
            pincode: '110001',
            city: 'New Delhi',
            time: '09:00 AM'
          },
          drop: {
            location: 'Sector 22, City B',
            pincode: '110022',
            city: 'New Delhi',
            time: '10:30 AM'
          }
        },
        {
          orderId: 'ORD002',
          date: '2024-01-16',
          amount: 200,
          status: 'Completed',
          customer: 'Bob Smith',
          customerMobile: '9000000002',
          pickup: {
            location: 'Connaught Place, Central Delhi',
            pincode: '110001',
            city: 'New Delhi',
            time: '11:00 AM'
          },
          drop: {
            location: 'Lajpat Nagar, South Delhi',
            pincode: '110024',
            city: 'New Delhi',
            time: '12:15 PM'
          }
        }
      ],
      '3W': [
        {
          orderId: 'ORD003',
          date: '2024-02-01',
          amount: 300,
          status: 'Completed',
          customer: 'Carol Davis',
          customerMobile: '9000000003',
          pickup: {
            location: 'Karol Bagh, Central Delhi',
            pincode: '110005',
            city: 'New Delhi',
            time: '02:00 PM'
          },
          drop: {
            location: 'Dwarka Sector 12, West Delhi',
            pincode: '110075',
            city: 'New Delhi',
            time: '03:30 PM'
          }
        }
      ],
      Truck: [
        {
          orderId: 'ORD004',
          date: '2024-03-10',
          amount: 800,
          status: 'Completed',
          customer: 'David Wilson',
          customerMobile: '9000000004',
          pickup: {
            location: 'Industrial Area, Okhla',
            pincode: '110020',
            city: 'New Delhi',
            time: '08:00 AM'
          },
          drop: {
            location: 'Gurgaon Cyber City',
            pincode: '122002',
            city: 'Gurgaon',
            time: '10:00 AM'
          }
        }
      ]
    },
    transactions: [
      { id: 'TXN001', date: '2024-04-01', type: 'Earnings', amount: 1000 },
      { id: 'TXN002', date: '2024-04-10', type: 'Withdrawal', amount: -500 },
      { id: 'TXN003', date: '2024-05-01', type: 'Bonus', amount: 200 }
    ],
    documents: {
      aadharFront: 'aadhar_front_john.pdf',
      aadharBack: 'aadhar_back_john.pdf',
      panCard: 'pan_card_john.pdf',
      drivingLicense: 'driving_license_john.pdf'
    }
  },
  {
    id: 'DRV002',
    name: 'Jane Smith',
    status: 'Pending',
    mobile: '9123456780',
    email: 'jane.smith@email.com',
    joiningDate: '2023-03-20',
    driverId: 'DRV002',
    rating: 3.8,
    totalOrders: 89,
    completedOrders: 78,
    cancelledOrders: 5,
    totalEarnings: 28900,
    address: '456 Market Rd, City B, State - 234567',
    vehicleType: '3W',
    online: false,
    licenseNumber: 'DL-6543210987654',
    aadharNumber: '2345-6789-0123',
    panNumber: 'XYZAB9876K',
    lastActive: '2024-01-23 18:45',
    bank: {
      accountNumber: '0987654321',
      ifsc: 'HDFC0005678',
      bankName: 'HDFC Bank',
      branch: 'Market Road',
      holder: 'Jane Smith'
    },
    balance: 1800,
    vehicleDetails: {
      model: 'Bajaj RE Auto Rickshaw',
      registrationNumber: 'MH-02-CD-5678',
      color: 'Yellow',
      year: '2021'
    },
    currentOrder: {
      id: 'ORD124',
      item: 'Groceries Package',
      status: 'Delivered',
      pickup: 'Market Road, City C',
      drop: 'Mall Road, City D',
      amount: 320,
      deliveredAt: '2024-01-24 12:30'
    },
    orders: {
      '2W': [
        {
          orderId: 'ORD005',
          date: '2024-01-20',
          amount: 180,
          status: 'Completed',
          customer: 'Eva Brown',
          customerMobile: '9000000005',
          pickup: {
            location: 'Rajouri Garden, West Delhi',
            pincode: '110027',
            city: 'New Delhi',
            time: '10:00 AM'
          },
          drop: {
            location: 'Pitampura, North Delhi',
            pincode: '110034',
            city: 'New Delhi',
            time: '11:30 AM'
          }
        }
      ],
      '3W': [
        {
          orderId: 'ORD006',
          date: '2024-02-05',
          amount: 350,
          status: 'Completed',
          customer: 'Frank Miller',
          customerMobile: '9000000006',
          pickup: {
            location: 'Saket, South Delhi',
            pincode: '110017',
            city: 'New Delhi',
            time: '03:00 PM'
          },
          drop: {
            location: 'Greater Noida Sector 1',
            pincode: '201310',
            city: 'Greater Noida',
            time: '04:45 PM'
          }
        }
      ],
      Truck: []
    },
    transactions: [
      { id: 'TXN004', date: '2024-04-05', type: 'Earnings', amount: 800 },
      { id: 'TXN005', date: '2024-04-15', type: 'Withdrawal', amount: -300 }
    ],
    documents: {
      aadharFront: 'aadhar_front_jane.pdf',
      aadharBack: 'aadhar_back_jane.pdf',
      panCard: 'pan_card_jane.pdf',
      drivingLicense: 'driving_license_jane.pdf'
    }
  },
  {
    id: 'DRV003',
    name: 'Amit Kumar',
    status: 'Suspended',
    mobile: '9988776655',
    email: 'amit.kumar@email.com',
    joiningDate: '2022-08-10',
    driverId: 'DRV003',
    rating: 4.0,
    totalOrders: 234,
    completedOrders: 218,
    cancelledOrders: 12,
    totalEarnings: 89200,
    address: '789 Warehouse Ln, City C, State - 345678',
    vehicleType: 'Truck',
    online: false,
    licenseNumber: 'DL-7890123456789',
    aadharNumber: '3456-7890-1234',
    panNumber: 'LMNOP5432Q',
    lastActive: '2024-01-20 09:15',
    bank: {
      accountNumber: '1122334455',
      ifsc: 'ICIC0009012',
      bankName: 'ICICI Bank',
      branch: 'Industrial Area',
      holder: 'Amit Kumar'
    },
    balance: 4200,
    vehicleDetails: {
      model: 'Tata 407 Truck',
      registrationNumber: 'MH-03-EF-9012',
      color: 'Blue',
      year: '2020'
    },
    currentOrder: {
      id: 'ORD125',
      item: 'Furniture Package',
      status: 'Pending',
      pickup: 'Warehouse 1, Industrial Area',
      drop: 'Shop 5, City E',
      amount: 1200,
      estimatedDelivery: '2024-01-25 10:00'
    },
    orders: {
      '2W': [],
      '3W': [],
      Truck: [
        {
          orderId: 'ORD007',
          date: '2024-01-25',
          amount: 1200,
          status: 'Completed',
          customer: 'Grace Lee',
          customerMobile: '9000000007',
          pickup: {
            location: 'Warehouse Complex, Faridabad',
            pincode: '121001',
            city: 'Faridabad',
            time: '07:30 AM'
          },
          drop: {
            location: 'Noida Sector 62',
            pincode: '201301',
            city: 'Noida',
            time: '09:45 AM'
          }
        },
        {
          orderId: 'ORD008',
          date: '2024-02-10',
          amount: 1500,
          status: 'Completed',
          customer: 'Henry Taylor',
          customerMobile: '9000000008',
          pickup: {
            location: 'Industrial Area, Ghaziabad',
            pincode: '201001',
            city: 'Ghaziabad',
            time: '06:00 AM'
          },
          drop: {
            location: 'Gurgaon Cyber City',
            pincode: '122002',
            city: 'Gurgaon',
            time: '08:30 AM'
          }
        }
      ]
    },
    transactions: [
      { id: 'TXN006', date: '2024-04-08', type: 'Earnings', amount: 1500 },
      { id: 'TXN007', date: '2024-04-18', type: 'Withdrawal', amount: -800 },
      { id: 'TXN008', date: '2024-05-02', type: 'Bonus', amount: 500 }
    ],
    documents: {
      aadharFront: 'aadhar_front_amit.pdf',
      aadharBack: 'aadhar_back_amit.pdf',
      panCard: 'pan_card_amit.pdf',
      drivingLicense: 'driving_license_amit.pdf',
      bankPassbook: 'bank_passbook_amit.pdf',
      vehicleRcFront: 'vehicle_rc_front_amit.pdf'
    }
  }
];

const vehicleTypes = [
  { label: '2W', icon: <DirectionsBikeIcon /> },
  { label: '3W', icon: <AirportShuttleIcon /> },
  { label: 'Truck', icon: <LocalShippingIcon /> }
];

export default function DriverDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [driver, setDriver] = useState(null);
  const [orders, setOrders] = useState({ '2W': [], '3W': [], Truck: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState(0);
  const [balance, setBalance] = useState(0);
  const [bankDialog, setBankDialog] = useState(false);
  const [editBank, setEditBank] = useState({});
  const [bankDetails, setBankDetails] = useState({});
  const [addDialog, setAddDialog] = useState(false);
  const [addAmount, setAddAmount] = useState('');
  const [removeDialog, setRemoveDialog] = useState(false);
  const [removeAmount, setRemoveAmount] = useState('');
  const [documentDialog, setDocumentDialog] = useState({ open: false, document: null });
  const [documents, setDocuments] = React.useState({
    passbook: null,
    rcFront: null,
    rcBack: null,
    insurance: null
  });
  const [uploading, setUploading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const fetchDriverData = async () => {
      if (!id) {
        setError('Driver ID is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        console.log('📍 Fetching driver with ID:', id);

        // Fetch driver basic details and orders in parallel
        const [driverData, ordersData] = await Promise.allSettled([getDriverById(id), getDriverOrders(id)]);

        // Handle driver data
        if (driverData.status === 'fulfilled') {
          console.log('📦 Raw driver data received:', driverData.value);

          let driver;
          const driverResponse = driverData.value;

          // Handle the response structure similar to customer
          if (driverResponse.success && driverResponse.data) {
            driver = driverResponse.data;
          } else if (driverResponse.data) {
            driver = driverResponse.data;
          } else {
            driver = driverResponse;
          }

          const transformed = transformDriverData(driver);
          console.log('✅ Transformed driver data:', transformed);
          setDriver(transformed);
          setBalance(transformed.walletBalance || 0);
          setBankDetails(transformed.bank || {});
          setEditBank(transformed.bank || {});
        } else {
          throw new Error('Failed to fetch driver data');
        }

        // Handle orders data
        if (ordersData.status === 'fulfilled') {
          console.log('📦 Raw orders data received:', ordersData.value);

          const ordersResponse = ordersData.value;
          const bookings = ordersResponse.bookings || ordersResponse.data || [];

          // Group orders by vehicle type
          const groupedOrders = {
            '2W': [],
            '3W': [],
            Truck: []
          };

          bookings.forEach((booking) => {
            const vehicleType = booking.vehicleType || '2W';
            const orderData = {
              orderId: booking.bookingId || booking._id || 'N/A',
              date: booking.createdAt ? new Date(booking.createdAt).toLocaleDateString() : 'N/A',
              amount: booking.bookingAmount || booking.totalAmount || 0,
              status: booking.status || 'Unknown',
              customer: booking.user?.name || booking.userName || 'N/A',
              customerMobile: booking.user?.phone || booking.userPhone || 'N/A',
              pickup: {
                location: booking.pickupAddress?.address || booking.fromLocation?.address || 'N/A',
                pincode: booking.pickupAddress?.pincode || 'N/A',
                city: booking.pickupAddress?.city || 'N/A',
                time: booking.pickupTime || 'N/A'
              },
              drop: {
                location: booking.dropoffAddress?.address || booking.toLocation?.address || 'N/A',
                pincode: booking.dropoffAddress?.pincode || 'N/A',
                city: booking.dropoffAddress?.city || 'N/A',
                time: booking.dropoffTime || 'N/A'
              }
            };

            if (groupedOrders[vehicleType]) {
              groupedOrders[vehicleType].push(orderData);
            }
          });

          console.log('✅ Grouped orders:', groupedOrders);
          setOrders(groupedOrders);
        } else {
          console.warn('⚠️ Failed to fetch orders:', ordersData.reason);
          // Keep empty orders if fetch fails
        }

        setLoading(false);
      } catch (err) {
        console.error('❌ Error loading driver details:', err);
        setError(err.message || 'Failed to load driver details');
        setLoading(false);
      }
    };

    fetchDriverData();
  }, [id]);

  if (loading) return <Box sx={{ p: 4, textAlign: 'center' }}>Loading driver details...</Box>;
  if (error) return <Box sx={{ p: 4, textAlign: 'center', color: 'error.main' }}>{error}</Box>;
  if (!driver) return <Box sx={{ p: 4, textAlign: 'center' }}>No driver found.</Box>;

  const handleAddAmount = () => {
    const amt = parseFloat(addAmount);
    if (!isNaN(amt) && amt > 0) {
      setBalance((prev) => prev + amt);
      setAddDialog(false);
      setAddAmount('');
    }
  };

  const handleRemoveAmount = () => {
    const amt = parseFloat(removeAmount);
    if (!isNaN(amt) && amt > 0 && amt <= balance) {
      setBalance((prev) => prev - amt);
      setRemoveDialog(false);
      setRemoveAmount('');
    }
  };

  const handleBankEditOpen = () => {
    setEditBank({ ...bankDetails });
    setBankDialog(true);
  };

  const handleBankEditChange = (e) => {
    const { name, value } = e.target;
    setEditBank((prev) => ({ ...prev, [name]: value }));
  };

  const handleBankEditSave = () => {
    setBankDetails({ ...editBank });
    setBankDialog(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Pending':
        return 'warning';
      case 'Suspended':
        return 'error';
      default:
        return 'default';
    }
  };

  const handleDocumentView = (documentPath) => {
    if (!documentPath || documentPath === 'N/A' || documentPath === null) {
      setSnackbar({ open: true, message: 'Document not available', severity: 'warning' });
      return;
    }

    const fullUrl = getDocumentUrl(documentPath);
    if (fullUrl) {
      window.open(fullUrl, '_blank');
    } else {
      setSnackbar({ open: true, message: 'Invalid document path', severity: 'error' });
    }
  };

  const handleDocumentClose = () => {
    setDocumentDialog({ open: false, document: null });
  };

  const handleDocumentDownload = (documentPath, documentName) => {
    if (!documentPath || documentPath === 'N/A' || documentPath === null) {
      setSnackbar({ open: true, message: 'Document not available', severity: 'warning' });
      return;
    }

    const fullUrl = getDocumentUrl(documentPath);
    if (fullUrl) {
      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = fullUrl;
      link.download = documentName || 'document';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setSnackbar({ open: true, message: 'Download started', severity: 'success' });
    } else {
      setSnackbar({ open: true, message: 'Invalid document path', severity: 'error' });
    }
  };

  const handleDocChange = async (documentField, file) => {
    if (!file) {
      setSnackbar({ open: true, message: 'No file selected', severity: 'warning' });
      return;
    }

    // Validate file type (images and PDFs)
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      setSnackbar({
        open: true,
        message: 'Invalid file type. Please upload JPG, PNG, WEBP or PDF files only.',
        severity: 'error'
      });
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setSnackbar({
        open: true,
        message: 'File size too large. Maximum size is 5MB.',
        severity: 'error'
      });
      return;
    }

    try {
      setUploading(true);
      console.log('📤 Uploading document:', { documentField, fileName: file.name });

      // Upload using driver's phone number as identifier
      const response = await uploadDriverDocument(driver.mobile, documentField, file);

      if (response.success || response.rider || response.data) {
        setSnackbar({
          open: true,
          message: 'Document uploaded successfully!',
          severity: 'success'
        });

        // Refresh driver data to show the updated document
        const driverData = await getDriverById(id);
        let updatedDriver;
        const driverResponse = driverData;

        if (driverResponse.success && driverResponse.data) {
          updatedDriver = driverResponse.data;
        } else if (driverResponse.data) {
          updatedDriver = driverResponse.data;
        } else {
          updatedDriver = driverResponse;
        }

        const transformed = transformDriverData(updatedDriver);
        setDriver(transformed);
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('❌ Error uploading document:', error);
      setSnackbar({
        open: true,
        message: `Upload failed: ${error.message}`,
        severity: 'error'
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        py: 3,
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
      }}
    >
      <Container maxWidth="xl">
        {/* Header with Back Button */}
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
          <IconButton
            onClick={() => navigate(-1)}
            sx={{
              mr: 2,
              bgcolor: 'white',
              boxShadow: 2,
              '&:hover': { bgcolor: 'grey.100' }
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
            Driver Details
          </Typography>
        </Box>

        {/* Main Content Grid */}
        <Grid container spacing={3} alignItems="stretch">
          {/* Profile Details Card - Left Side */}
          <Grid item xs={12} md={8}>
            <Card
              sx={{
                borderRadius: 4,
                boxShadow: 4,
                p: 0,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                minHeight: 340,
                height: '100%'
              }}
            >
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <Avatar
                  sx={{
                    width: 110,
                    height: 110,
                    mx: 'auto',
                    mb: 2,
                    border: '5px solid #fff',
                    boxShadow: 3,
                    fontSize: 48,
                    bgcolor: 'rgba(255,255,255,0.15)'
                  }}
                >
                  {typeof driver.name === 'string' ? driver.name[0] : driver.name?.firstName?.[0] || driver.name?.name?.[0] || 'D'}
                </Avatar>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, letterSpacing: 1 }}>
                  {typeof driver.name === 'string'
                    ? driver.name
                    : driver.name?.firstName && driver.name?.lastName
                      ? `${driver.name.firstName} ${driver.name.lastName}`
                      : driver.name?.name || driver.name?.firstName || 'Unknown Driver'}
                </Typography>
                <Chip
                  label={driver.status}
                  color={getStatusColor(driver.status)}
                  size="medium"
                  sx={{
                    fontWeight: 600,
                    bgcolor:
                      driver.status === 'Active'
                        ? 'rgba(76, 175, 80, 0.9)'
                        : driver.status === 'Pending'
                          ? 'rgba(255, 152, 0, 0.9)'
                          : 'rgba(244, 67, 54, 0.9)',
                    color: 'white',
                    mb: 2
                  }}
                />
                <Divider sx={{ my: 2, bgcolor: 'rgba(255,255,255,0.2)' }} />
                <Box sx={{ textAlign: 'left', color: 'white', pl: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <PhoneIcon sx={{ mr: 1, color: 'white' }} />
                    <Typography variant="body1">{driver.mobile}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <EmailIcon sx={{ mr: 1, color: 'white' }} />
                    <Typography variant="body1">{driver.email}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <BadgeIcon sx={{ mr: 1, color: 'white' }} />
                    <Typography variant="body1">{driver.driverId}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CalendarTodayIcon sx={{ mr: 1, color: 'white' }} />
                    <Typography variant="body1">{driver.joiningDate}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <StarIcon sx={{ mr: 1, color: 'white' }} />
                    <Typography variant="body1">{driver.rating} Rating</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <LocationOnIcon sx={{ mr: 1, color: 'white' }} />
                    <Typography variant="body1">{driver.address}</Typography>
                  </Box>
                </Box>
              </Box>
            </Card>
          </Grid>

          {/* Right Side: Bank Details Card + Wallet Card */}
          <Grid item xs={12} md={4}>
            <Stack spacing={3} sx={{ height: '100%' }}>
              {/* Bank Details Card */}
              <Card
                sx={{
                  borderRadius: 4,
                  boxShadow: 4,
                  p: 0,
                  background: 'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)',
                  minHeight: 180,
                  maxWidth: 400,
                  mx: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}
              >
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', color: 'primary.main' }}>
                      <AccountBalanceIcon sx={{ mr: 1 }} />
                      Bank Details
                    </Typography>
                    <Button variant="outlined" size="small" onClick={handleBankEditOpen} sx={{ fontWeight: 600 }}>
                      Update
                    </Button>
                  </Box>
                  <Box sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                    <BusinessIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="body2" color="text.secondary">
                      {bankDetails.bankName}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                    <CreditCardIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="body2" color="text.secondary">
                      {bankDetails.accountNumber}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                    <AccountCircleIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="body2" color="text.secondary">
                      {bankDetails.holder}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                    <BadgeIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="body2" color="text.secondary">
                      {bankDetails.ifsc}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <LocationOnIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="body2" color="text.secondary">
                      {bankDetails.branch}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
              {/* Wallet Card */}
              <Card
                sx={{
                  borderRadius: 4,
                  boxShadow: 4,
                  mt: 0,
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  color: 'white',
                  textAlign: 'center',
                  minHeight: 180,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}
              >
                <CardContent>
                  <AccountBalanceWalletIcon sx={{ fontSize: 48, mb: 2, opacity: 0.9 }} />
                  <Typography variant="h6" sx={{ mb: 1, opacity: 0.9 }}>
                    Wallet Balance
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 700 }}>
                    ₹{balance.toLocaleString()}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
                    <Button
                      variant="contained"
                      color="success"
                      sx={{ borderRadius: 2, fontWeight: 600 }}
                      onClick={() => setAddDialog(true)}
                    >
                      Add Amount
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      sx={{ borderRadius: 2, fontWeight: 600 }}
                      onClick={() => setRemoveDialog(true)}
                    >
                      Remove Amount
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Stack>
          </Grid>
        </Grid>

        {/* Performance Stats Cards */}
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: 3,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                cursor: 'pointer',
                transition: 'transform 0.15s',
                '&:hover': { transform: 'scale(1.03)', boxShadow: 6 }
              }}
              onClick={() => navigate('/orders/list/all')}
            >
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                  {driver.totalOrders}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Total Orders
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: 3,
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                color: 'white',
                cursor: 'pointer',
                transition: 'transform 0.15s',
                '&:hover': { transform: 'scale(1.03)', boxShadow: 6 }
              }}
              onClick={() => navigate('/orders/list/completed')}
            >
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                  {driver.completedOrders}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Completed Orders
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 3, boxShadow: 3, background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                  ₹{driver.totalEarnings.toLocaleString()}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Total Earnings
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 3, boxShadow: 3, background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', color: 'white' }}>
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                  {driver.rating}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Rating
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button
            variant="outlined"
            color="primary"
            sx={{ fontWeight: 600, borderRadius: 2 }}
            onClick={() => navigate('/driver-orders/summary')}
          >
            View All Orders
          </Button>
        </Box>

        {/* Current Order Card */}
        {driver.currentOrder && (
          <Card sx={{ borderRadius: 3, boxShadow: 3, mt: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center' }}>
                <ReceiptIcon sx={{ mr: 1, color: 'primary.main' }} />
                Current Order
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    Order ID
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {driver.currentOrder.id}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    Item
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {driver.currentOrder.item}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    Amount
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: 'primary.main' }}>
                    ₹{driver.currentOrder.amount}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    Status
                  </Typography>
                  <Chip
                    label={driver.currentOrder.status}
                    color={driver.currentOrder.status === 'Delivered' ? 'success' : 'warning'}
                    size="small"
                    sx={{ fontWeight: 600 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Pickup
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {driver.currentOrder.pickup}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Drop
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {driver.currentOrder.drop}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}

        {/* Vehicle Information Card */}
        <Card sx={{ borderRadius: 3, boxShadow: 3, mt: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center' }}>
              <DirectionsBikeIcon sx={{ mr: 1, color: 'primary.main' }} />
              Vehicle Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Model
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {driver.vehicleDetails.model}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Registration
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {driver.vehicleDetails.registrationNumber}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Color
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {driver.vehicleDetails.color}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Year
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {driver.vehicleDetails.year}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Documents Card */}
        <Card sx={{ borderRadius: 3, boxShadow: 3, mt: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center' }}>
              <DescriptionIcon sx={{ mr: 1, color: 'primary.main' }} />
              Documents
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Box
                  sx={{
                    p: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    bgcolor: 'background.paper',
                    '&:hover': { bgcolor: 'grey.50' }
                  }}
                >
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                      Aadhar Card Front
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {driver.documents.aadharFront}
                    </Typography>
                    <Box sx={{ mt: 1, mb: 1, display: 'flex', gap: 1 }}>
                      <Button size="small" color="success" variant="outlined">
                        Approved
                      </Button>
                      <Button size="small" color="error" variant="outlined">
                        Reject
                      </Button>
                      <Button size="small" color="primary" variant="outlined" component="label">
                        Reupload
                        <input type="file" hidden onChange={(e) => handleDocChange('aadharFront', e.target.files[0])} />
                      </Button>
                    </Box>
                  </Box>
                  <Box>
                    <IconButton size="small" component="label" disabled={uploading}>
                      <UploadFileIcon />
                      <input
                        type="file"
                        hidden
                        accept="image/*,application/pdf"
                        onChange={(e) => handleDocChange('aadharFront', e.target.files[0])}
                      />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDocumentDownload(driver.documents.aadharFront, 'aadhar-front')}
                      disabled={!driver.documents.aadharFront}
                    >
                      <DownloadIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDocumentView(driver.documents.aadharFront)}
                      disabled={!driver.documents.aadharFront}
                      sx={{ mr: 1 }}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box
                  sx={{
                    p: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    bgcolor: 'background.paper',
                    '&:hover': { bgcolor: 'grey.50' }
                  }}
                >
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                      Aadhar Card Back
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {driver.documents.aadharBack}
                    </Typography>
                    <Box sx={{ mt: 1, mb: 1, display: 'flex', gap: 1 }}>
                      <Button size="small" color="success" variant="outlined">
                        Approved
                      </Button>
                      <Button size="small" color="error" variant="outlined">
                        Reject
                      </Button>
                      <Button size="small" color="primary" variant="outlined" component="label">
                        Reupload
                        <input type="file" hidden onChange={(e) => handleDocChange('aadharBack', e.target.files[0])} />
                      </Button>
                    </Box>
                  </Box>
                  <Box>
                    <IconButton size="small" component="label" disabled={uploading}>
                      <UploadFileIcon />
                      <input
                        type="file"
                        hidden
                        accept="image/*,application/pdf"
                        onChange={(e) => handleDocChange('aadharBack', e.target.files[0])}
                      />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDocumentDownload(driver.documents.aadharBack, 'aadhar-back')}
                      disabled={!driver.documents.aadharBack}
                    >
                      <DownloadIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDocumentView(driver.documents.aadharBack)}
                      disabled={!driver.documents.aadharBack}
                      sx={{ mr: 1 }}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box
                  sx={{
                    p: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    bgcolor: 'background.paper',
                    '&:hover': { bgcolor: 'grey.50' }
                  }}
                >
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                      PAN Card
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {driver.documents.panCard}
                    </Typography>
                    <Box sx={{ mt: 1, mb: 1, display: 'flex', gap: 1 }}>
                      <Button size="small" color="success" variant="outlined">
                        Approved
                      </Button>
                      <Button size="small" color="error" variant="outlined">
                        Reject
                      </Button>
                      <Button size="small" color="primary" variant="outlined" component="label">
                        Reupload
                        <input
                          type="file"
                          hidden
                          accept="image/*,application/pdf"
                          onChange={(e) => handleDocChange('panCard', e.target.files[0])}
                        />
                      </Button>
                    </Box>
                  </Box>
                  <Box>
                    <IconButton size="small" component="label" disabled={uploading}>
                      <UploadFileIcon />
                      <input
                        type="file"
                        hidden
                        accept="image/*,application/pdf"
                        onChange={(e) => handleDocChange('panCard', e.target.files[0])}
                      />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDocumentDownload(driver.documents.panCard, 'pan-card')}
                      disabled={!driver.documents.panCard}
                    >
                      <DownloadIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDocumentView(driver.documents.panCard)}
                      disabled={!driver.documents.panCard}
                      sx={{ mr: 1 }}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box
                  sx={{
                    p: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    bgcolor: 'background.paper',
                    '&:hover': { bgcolor: 'grey.50' }
                  }}
                >
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                      Driving License Front
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {driver.documents.drivingLicenseFront}
                    </Typography>
                    <Box sx={{ mt: 1, mb: 1, display: 'flex', gap: 1 }}>
                      <Button size="small" color="success" variant="outlined">
                        Approved
                      </Button>
                      <Button size="small" color="error" variant="outlined">
                        Reject
                      </Button>
                      <Button size="small" color="primary" variant="outlined" component="label">
                        Reupload
                        <input
                          type="file"
                          hidden
                          accept="image/*,application/pdf"
                          onChange={(e) => handleDocChange('drivingLicenseFront', e.target.files[0])}
                        />
                      </Button>
                    </Box>
                  </Box>
                  <Box>
                    <IconButton size="small" component="label" disabled={uploading}>
                      <UploadFileIcon />
                      <input
                        type="file"
                        hidden
                        accept="image/*,application/pdf"
                        onChange={(e) => handleDocChange('drivingLicenseFront', e.target.files[0])}
                      />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDocumentDownload(driver.documents.drivingLicenseFront, 'driving-license-front')}
                      disabled={!driver.documents.drivingLicenseFront}
                    >
                      <DownloadIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDocumentView(driver.documents.drivingLicenseFront)}
                      disabled={!driver.documents.drivingLicenseFront}
                      sx={{ mr: 1 }}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box
                  sx={{
                    p: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    bgcolor: 'background.paper',
                    '&:hover': { bgcolor: 'grey.50' }
                  }}
                >
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                      Driving License Back
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {driver.documents.drivingLicenseBack}
                    </Typography>
                    <Box sx={{ mt: 1, mb: 1, display: 'flex', gap: 1 }}>
                      <Button size="small" color="success" variant="outlined">
                        Approved
                      </Button>
                      <Button size="small" color="error" variant="outlined">
                        Reject
                      </Button>
                      <Button size="small" color="primary" variant="outlined" component="label">
                        Reupload
                        <input type="file" hidden onChange={(e) => handleDocChange('drivingLicenseBack', e.target.files[0])} />
                      </Button>
                    </Box>
                  </Box>
                  <Box>
                    <IconButton size="small" component="label">
                      <UploadFileIcon />
                      <input type="file" hidden onChange={(e) => handleDocChange('drivingLicenseBack', e.target.files[0])} />
                    </IconButton>
                    <IconButton size="small">
                      <DownloadIcon />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDocumentView(driver.documents.aadharFront)} sx={{ mr: 1 }}>
                      <VisibilityIcon />
                    </IconButton>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box
                  sx={{
                    p: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    bgcolor: 'background.paper',
                    '&:hover': { bgcolor: 'grey.50' }
                  }}
                >
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                      Bank Passbook
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {driver.documents.bankPassbook}
                    </Typography>
                    <Box sx={{ mt: 1, mb: 1, display: 'flex', gap: 1 }}>
                      <Button size="small" color="success" variant="outlined">
                        Approved
                      </Button>
                      <Button size="small" color="error" variant="outlined">
                        Reject
                      </Button>
                      <Button size="small" color="primary" variant="outlined" component="label">
                        Reupload
                        <input type="file" hidden onChange={(e) => handleDocChange('bankPassbook', e.target.files[0])} />
                      </Button>
                    </Box>
                  </Box>
                  <Box>
                    <IconButton size="small" component="label">
                      <UploadFileIcon />
                      <input type="file" hidden onChange={(e) => handleDocChange('bankPassbook', e.target.files[0])} />
                    </IconButton>
                    <IconButton size="small">
                      <DownloadIcon />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDocumentView(driver.documents.bankPassbook)} sx={{ mr: 1 }}>
                      <VisibilityIcon />
                    </IconButton>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box
                  sx={{
                    p: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    bgcolor: 'background.paper',
                    '&:hover': { bgcolor: 'grey.50' }
                  }}
                >
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                      Vehicle RC Front
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {driver.documents.vehicleRcFront}
                    </Typography>
                    <Box sx={{ mt: 1, mb: 1, display: 'flex', gap: 1 }}>
                      <Button size="small" color="success" variant="outlined">
                        Approved
                      </Button>
                      <Button size="small" color="error" variant="outlined">
                        Reject
                      </Button>
                      <Button size="small" color="primary" variant="outlined" component="label">
                        Reupload
                        <input type="file" hidden onChange={(e) => handleDocChange('vehicleRcFront', e.target.files[0])} />
                      </Button>
                    </Box>
                  </Box>
                  <Box>
                    <IconButton size="small" component="label">
                      <UploadFileIcon />
                      <input type="file" hidden onChange={(e) => handleDocChange('vehicleRcFront', e.target.files[0])} />
                    </IconButton>
                    <IconButton size="small">
                      <DownloadIcon />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDocumentView(driver.documents.vehicleRcFront)} sx={{ mr: 1 }}>
                      <VisibilityIcon />
                    </IconButton>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box
                  sx={{
                    p: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    bgcolor: 'background.paper',
                    '&:hover': { bgcolor: 'grey.50' }
                  }}
                >
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                      Vehicle RC Back
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {driver.documents.vehicleRcBack}
                    </Typography>
                    <Box sx={{ mt: 1, mb: 1, display: 'flex', gap: 1 }}>
                      <Button size="small" color="success" variant="outlined">
                        Approved
                      </Button>
                      <Button size="small" color="error" variant="outlined">
                        Reject
                      </Button>
                      <Button size="small" color="primary" variant="outlined" component="label">
                        Reupload
                        <input type="file" hidden onChange={(e) => handleDocChange('vehicleRcBack', e.target.files[0])} />
                      </Button>
                    </Box>
                  </Box>
                  <Box>
                    <IconButton size="small" component="label">
                      <UploadFileIcon />
                      <input type="file" hidden onChange={(e) => handleDocChange('vehicleRcBack', e.target.files[0])} />
                    </IconButton>
                    <IconButton size="small">
                      <DownloadIcon />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDocumentView(driver.documents.vehicleRcBack)} sx={{ mr: 1 }}>
                      <VisibilityIcon />
                    </IconButton>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box
                  sx={{
                    p: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    bgcolor: 'background.paper',
                    '&:hover': { bgcolor: 'grey.50' }
                  }}
                >
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                      Vehicle Image Front
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {driver.documents.vehicleImageFront}
                    </Typography>
                    <Box sx={{ mt: 1, mb: 1, display: 'flex', gap: 1 }}>
                      <Button size="small" color="success" variant="outlined">
                        Approved
                      </Button>
                      <Button size="small" color="error" variant="outlined">
                        Reject
                      </Button>
                      <Button size="small" color="primary" variant="outlined" component="label">
                        Reupload
                        <input type="file" hidden onChange={(e) => handleDocChange('vehicleImageFront', e.target.files[0])} />
                      </Button>
                    </Box>
                  </Box>
                  <Box>
                    <IconButton size="small" component="label">
                      <UploadFileIcon />
                      <input type="file" hidden onChange={(e) => handleDocChange('vehicleImageFront', e.target.files[0])} />
                    </IconButton>
                    <IconButton size="small">
                      <DownloadIcon />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDocumentView(driver.documents.vehicleImageFront)} sx={{ mr: 1 }}>
                      <VisibilityIcon />
                    </IconButton>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box
                  sx={{
                    p: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    bgcolor: 'background.paper',
                    '&:hover': { bgcolor: 'grey.50' }
                  }}
                >
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                      Vehicle Image Back
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {driver.documents.vehicleImageBack}
                    </Typography>
                    <Box sx={{ mt: 1, mb: 1, display: 'flex', gap: 1 }}>
                      <Button size="small" color="success" variant="outlined">
                        Approved
                      </Button>
                      <Button size="small" color="error" variant="outlined">
                        Reject
                      </Button>
                      <Button size="small" color="primary" variant="outlined" component="label">
                        Reupload
                        <input type="file" hidden onChange={(e) => handleDocChange('vehicleImageBack', e.target.files[0])} />
                      </Button>
                    </Box>
                  </Box>
                  <Box>
                    <IconButton size="small" component="label">
                      <UploadFileIcon />
                      <input type="file" hidden onChange={(e) => handleDocChange('vehicleImageBack', e.target.files[0])} />
                    </IconButton>
                    <IconButton size="small">
                      <DownloadIcon />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDocumentView(driver.documents.vehicleImageBack)} sx={{ mr: 1 }}>
                      <VisibilityIcon />
                    </IconButton>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box
                  sx={{
                    p: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    bgcolor: 'background.paper',
                    '&:hover': { bgcolor: 'grey.50' }
                  }}
                >
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                      Vehicle Insurance
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {driver.documents.vehicleInsurance}
                    </Typography>
                    <Box sx={{ mt: 1, mb: 1, display: 'flex', gap: 1 }}>
                      <Button size="small" color="success" variant="outlined">
                        Approved
                      </Button>
                      <Button size="small" color="error" variant="outlined">
                        Reject
                      </Button>
                      <Button size="small" color="primary" variant="outlined" component="label">
                        Reupload
                        <input type="file" hidden onChange={(e) => handleDocChange('vehicleInsurance', e.target.files[0])} />
                      </Button>
                    </Box>
                  </Box>
                  <Box>
                    <IconButton size="small" component="label">
                      <UploadFileIcon />
                      <input type="file" hidden onChange={(e) => handleDocChange('vehicleInsurance', e.target.files[0])} />
                    </IconButton>
                    <IconButton size="small">
                      <DownloadIcon />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDocumentView(driver.documents.vehicleInsurance)} sx={{ mr: 1 }}>
                      <VisibilityIcon />
                    </IconButton>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box
                  sx={{
                    p: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    bgcolor: 'background.paper',
                    '&:hover': { bgcolor: 'grey.50' }
                  }}
                >
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                      Owner Selfie
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {driver.documents.ownerSelfie}
                    </Typography>
                    <Box sx={{ mt: 1, mb: 1, display: 'flex', gap: 1 }}>
                      <Button size="small" color="success" variant="outlined">
                        Approved
                      </Button>
                      <Button size="small" color="error" variant="outlined">
                        Reject
                      </Button>
                      <Button size="small" color="primary" variant="outlined" component="label">
                        Reupload
                        <input type="file" hidden onChange={(e) => handleDocChange('ownerSelfie', e.target.files[0])} />
                      </Button>
                    </Box>
                  </Box>
                  <Box>
                    <IconButton size="small" component="label">
                      <UploadFileIcon />
                      <input type="file" hidden onChange={(e) => handleDocChange('ownerSelfie', e.target.files[0])} />
                    </IconButton>
                    <IconButton size="small">
                      <DownloadIcon />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDocumentView(driver.documents.ownerSelfie)} sx={{ mr: 1 }}>
                      <VisibilityIcon />
                    </IconButton>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Order History Card */}
        <Card sx={{ borderRadius: 3, boxShadow: 3, mt: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center' }}>
              <ReceiptIcon sx={{ mr: 1, color: 'primary.main' }} />
              Order History
            </Typography>
            <Tabs
              value={tab}
              onChange={(_, v) => setTab(v)}
              sx={{
                mb: 3,
                '& .MuiTab-root': {
                  minHeight: 48,
                  borderRadius: 2,
                  mx: 0.5
                }
              }}
            >
              {vehicleTypes.map((type, idx) => (
                <Tab
                  key={type.label}
                  label={type.label}
                  icon={type.icon}
                  iconPosition="start"
                  sx={{
                    bgcolor: tab === idx ? 'primary.light' : 'transparent',
                    color: tab === idx ? 'white' : 'text.primary',
                    '&:hover': {
                      bgcolor: tab === idx ? 'primary.main' : 'grey.100'
                    }
                  }}
                />
              ))}
            </Tabs>
            <TableContainer sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'grey.50' }}>
                    <TableCell sx={{ fontWeight: 600 }}>S. No.</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Order ID</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Pickup Location</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Drop Location</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Amount (₹)</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Customer</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(orders[vehicleTypes[tab].label] || [])
                    .filter((order) => order.status === 'Completed' || order.status === 'Processing')
                    .map((order, idx) => (
                      <TableRow
                        key={idx}
                        sx={{
                          background:
                            order.status === 'Completed'
                              ? 'rgba(76, 175, 80, 0.05)'
                              : order.status === 'Canceled'
                                ? 'rgba(244, 67, 54, 0.05)'
                                : 'inherit',
                          '&:hover': { bgcolor: 'grey.50' }
                        }}
                      >
                        <TableCell>{idx + 1}</TableCell>
                        <TableCell sx={{ fontWeight: 500 }}>{order.orderId}</TableCell>
                        <TableCell>{order.date}</TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {order.pickup.location}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {order.pickup.city} - {order.pickup.pincode}
                            </Typography>
                            <Typography variant="caption" display="block" color="primary.main" sx={{ fontWeight: 600 }}>
                              {order.pickup.time}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {order.drop.location}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {order.drop.city} - {order.drop.pincode}
                            </Typography>
                            <Typography variant="caption" display="block" color="primary.main" sx={{ fontWeight: 600 }}>
                              {order.drop.time}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600, color: 'primary.main' }}>₹{order.amount}</TableCell>
                        <TableCell>
                          <Chip
                            label={order.status}
                            color={order.status === 'Completed' ? 'success' : order.status === 'Canceled' ? 'error' : 'default'}
                            size="small"
                            sx={{ fontWeight: 600 }}
                          />
                        </TableCell>
                        <TableCell>
                          {order.status === 'Completed' && order.customer ? (
                            <Tooltip title={`Mobile: ${order.customerMobile}`}>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <AccountCircleIcon color="primary" sx={{ mr: 0.5, fontSize: 16 }} />
                                <Typography variant="body2">{order.customer}</Typography>
                              </Box>
                            </Tooltip>
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              -
                            </Typography>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Transaction History Card */}
        <Card sx={{ borderRadius: 3, boxShadow: 3, mt: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center' }}>
              <HistoryIcon sx={{ mr: 1, color: 'primary.main' }} />
              Transaction History
            </Typography>
            <TableContainer sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'grey.50' }}>
                    <TableCell sx={{ fontWeight: 600 }}>S. No.</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Transaction ID</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Amount (₹)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {driver.transactions.map((txn, idx) => (
                    <TableRow key={idx} sx={{ '&:hover': { bgcolor: 'grey.50' } }}>
                      <TableCell>{idx + 1}</TableCell>
                      <TableCell sx={{ fontWeight: 500 }}>{txn.id}</TableCell>
                      <TableCell>{txn.date}</TableCell>
                      <TableCell>
                        <Chip
                          label={txn.type}
                          size="small"
                          sx={{
                            bgcolor: txn.type === 'Earnings' ? 'success.light' : txn.type === 'Bonus' ? 'warning.light' : 'error.light',
                            color: txn.type === 'Earnings' ? 'success.dark' : txn.type === 'Bonus' ? 'warning.dark' : 'error.dark',
                            fontWeight: 600
                          }}
                        />
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 600,
                          color: txn.amount < 0 ? 'error.main' : 'success.main',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        {txn.amount < 0 ? (
                          <ArrowDownwardIcon fontSize="small" color="error" sx={{ mr: 0.5 }} />
                        ) : (
                          <ArrowUpwardIcon fontSize="small" color="success" sx={{ mr: 0.5 }} />
                        )}
                        ₹{Math.abs(txn.amount)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Bank Details Update Dialog */}
        <Dialog open={bankDialog} onClose={() => setBankDialog(false)} maxWidth="xs" fullWidth>
          <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white' }}>Update Bank Details</DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <TextField
              label="Bank Name"
              name="bankName"
              value={editBank.bankName}
              onChange={handleBankEditChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Account Number"
              name="accountNumber"
              value={editBank.accountNumber}
              onChange={handleBankEditChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Account Holder"
              name="holder"
              value={editBank.holder}
              onChange={handleBankEditChange}
              fullWidth
              margin="normal"
            />
            <TextField label="IFSC Code" name="ifsc" value={editBank.ifsc} onChange={handleBankEditChange} fullWidth margin="normal" />
            <TextField label="Branch" name="branch" value={editBank.branch} onChange={handleBankEditChange} fullWidth margin="normal" />
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setBankDialog(false)} variant="outlined" sx={{ borderRadius: 2 }}>
              Cancel
            </Button>
            <Button onClick={handleBankEditSave} variant="contained" color="primary" sx={{ borderRadius: 2 }}>
              Save
            </Button>
          </DialogActions>
        </Dialog>

        {/* Add Amount Dialog */}
        <Dialog open={addDialog} onClose={() => setAddDialog(false)} maxWidth="xs" fullWidth>
          <DialogTitle sx={{ bgcolor: 'success.main', color: 'white' }}>Add Amount</DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <TextField
              label="Amount to Add"
              type="number"
              value={addAmount}
              onChange={(e) => setAddAmount(e.target.value)}
              fullWidth
              margin="normal"
              inputProps={{ min: 1 }}
            />
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setAddDialog(false)} variant="outlined" sx={{ borderRadius: 2 }}>
              Cancel
            </Button>
            <Button
              onClick={handleAddAmount}
              variant="contained"
              color="success"
              sx={{ borderRadius: 2 }}
              disabled={!addAmount || parseFloat(addAmount) <= 0}
            >
              Add
            </Button>
          </DialogActions>
        </Dialog>

        {/* Remove Amount Dialog */}
        <Dialog open={removeDialog} onClose={() => setRemoveDialog(false)} maxWidth="xs" fullWidth>
          <DialogTitle sx={{ bgcolor: 'error.main', color: 'white' }}>Remove Amount</DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <TextField
              label="Amount to Remove"
              type="number"
              value={removeAmount}
              onChange={(e) => setRemoveAmount(e.target.value)}
              fullWidth
              margin="normal"
              inputProps={{ min: 1, max: balance }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Current Balance: ₹{balance.toLocaleString()}
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setRemoveDialog(false)} variant="outlined" sx={{ borderRadius: 2 }}>
              Cancel
            </Button>
            <Button
              onClick={handleRemoveAmount}
              variant="contained"
              color="error"
              sx={{ borderRadius: 2 }}
              disabled={!removeAmount || parseFloat(removeAmount) <= 0 || parseFloat(removeAmount) > balance}
            >
              Remove
            </Button>
          </DialogActions>
        </Dialog>

        {/* Document View Dialog */}
        <Dialog open={documentDialog.open} onClose={handleDocumentClose} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white' }}>View Document: {documentDialog.document}</DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <DescriptionIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                {documentDialog.document}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Document preview would be displayed here
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={handleDocumentClose} variant="outlined" sx={{ borderRadius: 2 }}>
              Close
            </Button>
            <Button variant="contained" startIcon={<DownloadIcon />} sx={{ borderRadius: 2 }}>
              Download
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>

        {/* Loading overlay for document upload */}
        {uploading && (
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              bgcolor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999
            }}
          >
            <Box sx={{ textAlign: 'center', bgcolor: 'white', p: 4, borderRadius: 2 }}>
              <CircularProgress size={60} />
              <Typography variant="h6" sx={{ mt: 2 }}>
                Uploading document...
              </Typography>
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  );
}
