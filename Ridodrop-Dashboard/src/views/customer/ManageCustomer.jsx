import React, { useState, useEffect } from 'react';
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
  Alert,
  Snackbar,
  Pagination,
  Stack
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
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
import VisibilityIcon from '@mui/icons-material/Visibility';
import DownloadIcon from '@mui/icons-material/Download';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import { useNavigate } from 'react-router-dom';
import { useCustomers } from '../../hooks/useCustomers';
import { getAllOrders, exportOrderDetailsToExcel, exportCancelDetailsToExcel } from '../../api/bookingApi';
import referralApi from '../../api/referralApi';
import { exportCustomersToExcel, exportCustomersDocuments } from '../../api/customerApi';

const tabLabels = [
  'Profile Details',
  'Order Details',
  'Cancel Details',
  'Data Analyze',
  'Block ID',
  'High Orders',
  'Wallet',
  'Refer And Earn',
  'Download Invoice'
];

const tabIcons = [
  <AccountCircleIcon fontSize="medium" />, // Profile Details
  <ShoppingCartIcon fontSize="medium" />, // Order Details
  <CancelIcon fontSize="medium" />, // Cancel Details
  <BarChartIcon fontSize="medium" />, // Data Analyze
  <BlockIcon fontSize="medium" />, // Block ID
  <TrendingUpIcon fontSize="medium" />, // High Orders
  <AccountBalanceWalletIcon fontSize="medium" />, // Wallet
  <GroupAddIcon fontSize="medium" />, // Refer And Earn
  <DescriptionIcon fontSize="medium" /> // Download Invoice
];

const initialCustomers = [
  {
    id: 1,
    customerId: 'CUST001',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    mobile: '9876543210',
    photo: 'https://randomuser.me/api/portraits/women/1.jpg',
    status: 'Active',
    pinCode: '110001',
    memberStatus: 'Active',
    usingApp: { days: 12, months: 2, years: 1 },
    blocked: false
  },
  {
    id: 2,
    customerId: 'CUST002',
    name: 'Bob Smith',
    email: 'bob@example.com',
    mobile: '9123456780',
    photo: 'https://randomuser.me/api/portraits/men/2.jpg',
    status: 'Inactive',
    pinCode: '400001',
    memberStatus: 'Deactive',
    usingApp: { days: 5, months: 0, years: 0 },
    blocked: true
  },
  {
    id: 3,
    customerId: 'CUST003',
    name: 'Charlie Brown',
    email: 'charlie@example.com',
    mobile: '9988776655',
    photo: 'https://randomuser.me/api/portraits/men/3.jpg',
    status: 'Active',
    pinCode: '560001',
    memberStatus: 'Active',
    usingApp: { days: 30, months: 1, years: 0 },
    blocked: false
  },
  {
    id: 4,
    customerId: 'CUST004',
    name: 'Priya Singh',
    email: 'priya@example.com',
    mobile: '9876512345',
    photo: 'https://randomuser.me/api/portraits/women/4.jpg',
    status: 'Active',
    pinCode: '122001',
    memberStatus: 'Active',
    usingApp: { days: 10, months: 0, years: 2 },
    blocked: true
  },
  {
    id: 5,
    customerId: 'CUST005',
    name: 'Rohit Sharma',
    email: 'rohit@example.com',
    mobile: '9123456790',
    photo: 'https://randomuser.me/api/portraits/men/5.jpg',
    status: 'Inactive',
    pinCode: '700001',
    memberStatus: 'Deactive',
    usingApp: { days: 0, months: 0, years: 0 },
    blocked: false
  },
  {
    id: 6,
    customerId: 'CUST006',
    name: 'Suresh Kumar',
    email: 'suresh@example.com',
    mobile: '9988776611',
    photo: 'https://randomuser.me/api/portraits/men/6.jpg',
    status: 'Active',
    pinCode: '600001',
    memberStatus: 'Active',
    usingApp: { days: 25, months: 3, years: 1 },
    blocked: true
  }
];

// Dummy order data for different vehicle types
const orderData = {
  '2W': [
    {
      customerId: 'CUST001',
      customerName: 'Alice Johnson',
      orderId: 'ORD001',
      vehicleType: '2W',
      status: 'Completed',
      amount: 150,
      date: '2024-01-15',
      pickup: 'Mumbai Central',
      drop: 'Andheri West'
    },
    {
      customerId: 'CUST002',
      customerName: 'Bob Smith',
      orderId: 'ORD002',
      vehicleType: '2W',
      status: 'Canceled',
      amount: 200,
      date: '2024-01-16',
      pickup: 'Bandra East',
      drop: 'Juhu'
    },
    {
      customerId: 'CUST003',
      customerName: 'Charlie Brown',
      orderId: 'ORD003',
      vehicleType: '2W',
      status: 'Completed',
      amount: 180,
      date: '2024-01-17',
      pickup: 'Dadar West',
      drop: 'Worli'
    },
    {
      customerId: 'CUST004',
      customerName: 'Priya Singh',
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
      customerId: 'CUST005',
      customerName: 'Rohit Sharma',
      orderId: 'ORD005',
      vehicleType: '3W',
      status: 'Completed',
      amount: 250,
      date: '2024-01-15',
      pickup: 'Thane West',
      drop: 'Mulund'
    },
    {
      customerId: 'CUST006',
      customerName: 'Suresh Kumar',
      orderId: 'ORD006',
      vehicleType: '3W',
      status: 'Canceled',
      amount: 300,
      date: '2024-01-16',
      pickup: 'Navi Mumbai',
      drop: 'Panvel'
    },
    {
      customerId: 'CUST007',
      customerName: 'Meera Patel',
      orderId: 'ORD007',
      vehicleType: '3W',
      status: 'Completed',
      amount: 220,
      date: '2024-01-17',
      pickup: 'Vashi',
      drop: 'Belapur'
    }
  ],
  Truck: [
    {
      customerId: 'CUST008',
      customerName: 'Amit Kumar',
      orderId: 'ORD008',
      vehicleType: 'Truck',
      status: 'Completed',
      amount: 800,
      date: '2024-01-15',
      pickup: 'Mumbai Port',
      drop: 'Bhiwandi'
    },
    {
      customerId: 'CUST009',
      customerName: 'Rajesh Singh',
      orderId: 'ORD009',
      vehicleType: 'Truck',
      status: 'Canceled',
      amount: 1200,
      date: '2024-01-16',
      pickup: 'JNPT',
      drop: 'Pune'
    },
    {
      customerId: 'CUST010',
      customerName: 'Vikram Malhotra',
      orderId: 'ORD010',
      vehicleType: 'Truck',
      status: 'Completed',
      amount: 950,
      date: '2024-01-17',
      pickup: 'Taloja',
      drop: 'Kalyan'
    },
    {
      customerId: 'CUST011',
      customerName: 'Sanjay Gupta',
      orderId: 'ORD011',
      vehicleType: 'Truck',
      status: 'Completed',
      amount: 1100,
      date: '2024-01-18',
      pickup: 'Dombivli',
      drop: 'Thane'
    }
  ]
};

const tabContent = [
  '', // Profile Details will show the table
  '', // Order Details will show vehicle type tabs
  'Cancel details content goes here.',
  'Data analyze content goes here.',
  'Block ID content goes here.',
  'High orders content goes here.',
  'Wallet content goes here.',
  'Refer and earn content goes here.',
  'Download invoice content goes here.'
];

// Add dummy high order data
const highOrderData = [
  {
    serialNo: 1,
    customerId: 'CUST010',
    customerName: 'Deepak Mehta',
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
      },
      {
        orderId: 'ORD1004',
        date: '2024-06-01',
        receiver: { name: 'Ravi Kumar', number: '9000000001', pincode: '110011', address: '123, MG Road, Delhi' }
      },
      {
        orderId: 'ORD1005',
        date: '2024-06-01',
        receiver: { name: 'Ravi Kumar', number: '9000000001', pincode: '110011', address: '123, MG Road, Delhi' }
      }
    ]
  },
  {
    serialNo: 2,
    customerId: 'CUST011',
    customerName: 'Meena Shah',
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
      },
      {
        orderId: 'ORD2003',
        date: '2024-06-02',
        receiver: { name: 'Sunita Sharma', number: '9000000002', pincode: '400012', address: '45, Marine Drive, Mumbai' }
      },
      {
        orderId: 'ORD2004',
        date: '2024-06-02',
        receiver: { name: 'Sunita Sharma', number: '9000000002', pincode: '400012', address: '45, Marine Drive, Mumbai' }
      },
      {
        orderId: 'ORD2005',
        date: '2024-06-02',
        receiver: { name: 'Sunita Sharma', number: '9000000002', pincode: '400012', address: '45, Marine Drive, Mumbai' }
      },
      {
        orderId: 'ORD2006',
        date: '2024-06-02',
        receiver: { name: 'Sunita Sharma', number: '9000000002', pincode: '400012', address: '45, Marine Drive, Mumbai' }
      }
    ]
  },
  {
    serialNo: 3,
    customerId: 'CUST012',
    customerName: 'Rajesh Kumar',
    orders: [
      {
        orderId: 'ORD3001',
        date: '2024-06-03',
        receiver: { name: 'Priya Singh', number: '9000000003', pincode: '560001', address: '78, Brigade Road, Bangalore' }
      },
      {
        orderId: 'ORD3002',
        date: '2024-06-03',
        receiver: { name: 'Priya Singh', number: '9000000003', pincode: '560001', address: '78, Brigade Road, Bangalore' }
      },
      {
        orderId: 'ORD3003',
        date: '2024-06-03',
        receiver: { name: 'Priya Singh', number: '9000000003', pincode: '560001', address: '78, Brigade Road, Bangalore' }
      },
      {
        orderId: 'ORD3004',
        date: '2024-06-03',
        receiver: { name: 'Priya Singh', number: '9000000003', pincode: '560001', address: '78, Brigade Road, Bangalore' }
      },
      {
        orderId: 'ORD3005',
        date: '2024-06-03',
        receiver: { name: 'Priya Singh', number: '9000000003', pincode: '560001', address: '78, Brigade Road, Bangalore' }
      },
      {
        orderId: 'ORD3006',
        date: '2024-06-03',
        receiver: { name: 'Priya Singh', number: '9000000003', pincode: '560001', address: '78, Brigade Road, Bangalore' }
      },
      {
        orderId: 'ORD3007',
        date: '2024-06-03',
        receiver: { name: 'Priya Singh', number: '9000000003', pincode: '560001', address: '78, Brigade Road, Bangalore' }
      }
    ]
  },
  {
    serialNo: 4,
    customerId: 'CUST013',
    customerName: 'Anita Patel',
    orders: [
      {
        orderId: 'ORD4001',
        date: '2024-06-04',
        receiver: { name: 'Vikram Malhotra', number: '9000000004', pincode: '700001', address: '12, Park Street, Kolkata' }
      },
      {
        orderId: 'ORD4002',
        date: '2024-06-04',
        receiver: { name: 'Vikram Malhotra', number: '9000000004', pincode: '700001', address: '12, Park Street, Kolkata' }
      },
      {
        orderId: 'ORD4003',
        date: '2024-06-04',
        receiver: { name: 'Vikram Malhotra', number: '9000000004', pincode: '700001', address: '12, Park Street, Kolkata' }
      },
      {
        orderId: 'ORD4004',
        date: '2024-06-04',
        receiver: { name: 'Vikram Malhotra', number: '9000000004', pincode: '700001', address: '12, Park Street, Kolkata' }
      },
      {
        orderId: 'ORD4005',
        date: '2024-06-04',
        receiver: { name: 'Vikram Malhotra', number: '9000000004', pincode: '700001', address: '12, Park Street, Kolkata' }
      }
    ]
  },
  {
    serialNo: 5,
    customerId: 'CUST014',
    customerName: 'Suresh Verma',
    orders: [
      {
        orderId: 'ORD5001',
        date: '2024-06-05',
        receiver: { name: 'Neha Gupta', number: '9000000005', pincode: '500001', address: '45, Banjara Hills, Hyderabad' }
      },
      {
        orderId: 'ORD5002',
        date: '2024-06-05',
        receiver: { name: 'Neha Gupta', number: '9000000005', pincode: '500001', address: '45, Banjara Hills, Hyderabad' }
      },
      {
        orderId: 'ORD5003',
        date: '2024-06-05',
        receiver: { name: 'Neha Gupta', number: '9000000005', pincode: '500001', address: '45, Banjara Hills, Hyderabad' }
      },
      {
        orderId: 'ORD5004',
        date: '2024-06-05',
        receiver: { name: 'Neha Gupta', number: '9000000005', pincode: '500001', address: '45, Banjara Hills, Hyderabad' }
      },
      {
        orderId: 'ORD5005',
        date: '2024-06-05',
        receiver: { name: 'Neha Gupta', number: '9000000005', pincode: '500001', address: '45, Banjara Hills, Hyderabad' }
      },
      {
        orderId: 'ORD5006',
        date: '2024-06-05',
        receiver: { name: 'Neha Gupta', number: '9000000005', pincode: '500001', address: '45, Banjara Hills, Hyderabad' }
      },
      {
        orderId: 'ORD5007',
        date: '2024-06-05',
        receiver: { name: 'Neha Gupta', number: '9000000005', pincode: '500001', address: '45, Banjara Hills, Hyderabad' }
      },
      {
        orderId: 'ORD5008',
        date: '2024-06-05',
        receiver: { name: 'Neha Gupta', number: '9000000005', pincode: '500001', address: '45, Banjara Hills, Hyderabad' }
      }
    ]
  }
];

// Add dummy wallet data
const walletData = [
  {
    serialNo: 1,
    customerId: 'CUST001',
    customerName: 'Alice Johnson',
    topUp: 2000,
    used: 1500,
    refund: 0,
    balance: 500,
    lastTransaction: '2024-01-15'
  },
  {
    serialNo: 2,
    customerId: 'CUST002',
    customerName: 'Bob Smith',
    topUp: 1000,
    used: 800,
    refund: 100,
    balance: 300,
    lastTransaction: '2024-01-16'
  },
  {
    serialNo: 3,
    customerId: 'CUST003',
    customerName: 'Charlie Brown',
    topUp: 500,
    used: 500,
    refund: 0,
    balance: 0,
    lastTransaction: '2024-01-17'
  },
  {
    serialNo: 4,
    customerId: 'CUST004',
    customerName: 'Priya Singh',
    topUp: 3000,
    used: 2500,
    refund: 200,
    balance: 700,
    lastTransaction: '2024-01-18'
  },
  {
    serialNo: 5,
    customerId: 'CUST005',
    customerName: 'Rohit Sharma',
    topUp: 0,
    used: 0,
    refund: 0,
    balance: 0,
    lastTransaction: 'N/A'
  },
  {
    serialNo: 6,
    customerId: 'CUST006',
    customerName: 'Suresh Kumar',
    topUp: 1200,
    used: 1000,
    refund: 0,
    balance: 200,
    lastTransaction: '2024-01-19'
  },
  {
    serialNo: 7,
    customerId: 'CUST007',
    customerName: 'Meera Patel',
    topUp: 2500,
    used: 1800,
    refund: 150,
    balance: 850,
    lastTransaction: '2024-01-20'
  },
  {
    serialNo: 8,
    customerId: 'CUST008',
    customerName: 'Amit Kumar',
    topUp: 800,
    used: 600,
    refund: 0,
    balance: 200,
    lastTransaction: '2024-01-21'
  }
];

// Add dummy refer and earn data
const referAndEarnData = [
  {
    serialNo: 1,
    customerId: 'CUST001',
    customerName: 'Alice Johnson',
    mobileNumber: '9876543210',
    city: 'Mumbai',
    referrerName: 'N/A',
    referrerId: 'N/A',
    earning: 0,
    referralDate: '2024-01-15',
    status: 'Active'
  },
  {
    serialNo: 2,
    customerId: 'CUST002',
    customerName: 'Bob Smith',
    mobileNumber: '9876543211',
    city: 'Delhi',
    referrerName: 'Alice Johnson',
    referrerId: 'CUST001',
    earning: 200,
    referralDate: '2024-01-16',
    status: 'Active'
  },
  {
    serialNo: 3,
    customerId: 'CUST003',
    customerName: 'Charlie Brown',
    mobileNumber: '9876543212',
    city: 'Bangalore',
    referrerName: 'Bob Smith',
    referrerId: 'CUST002',
    earning: 150,
    referralDate: '2024-01-17',
    status: 'Active'
  },
  {
    serialNo: 4,
    customerId: 'CUST004',
    customerName: 'Priya Singh',
    mobileNumber: '9876543213',
    city: 'Chennai',
    referrerName: 'Charlie Brown',
    referrerId: 'CUST003',
    earning: 100,
    referralDate: '2024-01-18',
    status: 'Active'
  },
  {
    serialNo: 5,
    customerId: 'CUST005',
    customerName: 'Rohit Sharma',
    mobileNumber: '9876543214',
    city: 'Hyderabad',
    referrerName: 'Priya Singh',
    referrerId: 'CUST004',
    earning: 0,
    referralDate: '2024-01-19',
    status: 'Pending'
  },
  {
    serialNo: 6,
    customerId: 'CUST006',
    customerName: 'Suresh Kumar',
    mobileNumber: '9876543215',
    city: 'Pune',
    referrerName: 'Rohit Sharma',
    referrerId: 'CUST005',
    earning: 50,
    referralDate: '2024-01-20',
    status: 'Active'
  },
  {
    serialNo: 7,
    customerId: 'CUST007',
    customerName: 'Meera Patel',
    mobileNumber: '9876543216',
    city: 'Kolkata',
    referrerName: 'Alice Johnson',
    referrerId: 'CUST001',
    earning: 300,
    referralDate: '2024-01-21',
    status: 'Active'
  },
  {
    serialNo: 8,
    customerId: 'CUST008',
    customerName: 'Amit Kumar',
    mobileNumber: '9876543217',
    city: 'Ahmedabad',
    referrerName: 'Bob Smith',
    referrerId: 'CUST002',
    earning: 75,
    referralDate: '2024-01-22',
    status: 'Active'
  }
];

// Add dummy cancel details data at the top (after walletData or similar)
const cancelDetailsData = [
  {
    id: 1,
    customerName: 'Alice Johnson',
    reason: 'Changed mind',
    date: '2024-06-01',
    details: 'Customer decided not to proceed with the order.'
  },
  {
    id: 2,
    customerName: 'Bob Smith',
    reason: 'Found cheaper option',
    date: '2024-06-02',
    details: 'Customer found a better price elsewhere.'
  },
  {
    id: 3,
    customerName: 'Charlie Brown',
    reason: 'Delayed delivery',
    date: '2024-06-03',
    details: 'Order was delayed, customer cancelled.'
  }
];

// Add dummy download invoice data at the top (after cancelDetailsData or similar)
const downloadInvoiceData = [
  { id: 1, customerName: 'Alice Johnson', downloadCount: 3, email: 'alice@example.com' },
  { id: 2, customerName: 'Bob Smith', downloadCount: 1, email: 'bob@example.com' },
  { id: 3, customerName: 'Charlie Brown', downloadCount: 2, email: 'charlie@example.com' }
];

const ManageCustomer = () => {
  const [tab, setTab] = useState(0);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [editCustomer, setEditCustomer] = useState({});
  const [vehicleTypeTab, setVehicleTypeTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [referralSearchTerm, setReferralSearchTerm] = useState('');
  const [referralTypeFilter, setReferralTypeFilter] = useState('customer'); // 'customer' or 'rider'
  const [walletSearchTerm, setWalletSearchTerm] = useState('');
  const [highOrderSearchTerm, setHighOrderSearchTerm] = useState('');
  const [blockIdSearchTerm, setBlockIdSearchTerm] = useState('');
  const [dataAnalyzeSearchTerm, setDataAnalyzeSearchTerm] = useState('');
  const [profileDetailsSearchTerm, setProfileDetailsSearchTerm] = useState('');
  const [orderDetailsSearchTerm, setOrderDetailsSearchTerm] = useState('');
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedCancel, setSelectedCancel] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Add booking-related state
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [bookingsError, setBookingsError] = useState(null);

  // Add referral-related state
  const [referrals, setReferrals] = useState([]);
  const [referralsLoading, setReferralsLoading] = useState(false);
  const [referralsError, setReferralsError] = useState(null);

  const navigate = useNavigate();

  // Use the customer API hook
  const {
    customers,
    loading,
    error,
    pagination,
    actions: { fetchCustomers, updateCustomer, deleteCustomer, blockCustomer, unblockCustomer, searchCustomers, changePage, clearError }
  } = useCustomers();

  // Debug logging for customer data
  React.useEffect(() => {
    if (customers && customers.length > 0) {
      console.log('👥 Customers data received:', customers);
      console.log('👤 First customer structure:', customers[0]);
      console.log('📝 First customer name extraction:', safeExtractCustomerName(customers[0]));
    }
  }, [customers]);

  // Add state for Data Analyze filters
  const [dataAnalyzeDateFilter, setDataAnalyzeDateFilter] = useState('all'); // 'all', 'today', 'week', 'month', 'year', 'custom'
  const [dataAnalyzeCustomDate, setDataAnalyzeCustomDate] = useState('');
  const [dataAnalyzePincode, setDataAnalyzePincode] = useState('');

  // Add state for cancel details date filter
  const [cancelDateFilter, setCancelDateFilter] = useState('all'); // 'all', 'today', 'week', 'month', 'year', 'custom'
  const [cancelCustomDate, setCancelCustomDate] = useState('');

  // Location dialog state for Order Details
  const [locationDialogOpen, setLocationDialogOpen] = useState(false);
  const [selectedOrderLocations, setSelectedOrderLocations] = useState(null);

  const vehicleTypes = ['2W', '3W', 'Truck'];

  // Edit handlers
  // Show snackbar messages
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  // Helper function to safely extract customer name
  const safeExtractCustomerName = (customer) => {
    if (!customer) return 'Unknown Customer';

    // If it's already a string, return it
    if (typeof customer === 'string') return customer;

    // If it's an object, try to extract name properties
    if (typeof customer === 'object') {
      // Handle null object
      if (customer === null) return 'Unknown Customer';

      // Try different name field combinations
      const firstName = customer.name || customer.firstName || customer.fname || '';
      const lastName = customer.lname || customer.lastName || customer.last_name || '';

      // If both first and last name exist and are different, combine them
      if (firstName && lastName && firstName !== lastName) {
        const fullName = `${firstName} ${lastName}`.trim();
        return fullName;
      }

      // Return whichever name is available
      const extractedName = firstName || lastName || 'Unknown Customer';
      return extractedName;
    }

    // Handle any other data type
    return 'Unknown Customer';
  };

  // Helper function to get standardized customer ID
  const getCustomerId = (customer, booking) => {
    // Priority 1: Direct customer object with customerId
    if (customer?.customerId && customer.customerId.startsWith('CUST')) {
      return customer.customerId;
    }

    // Priority 2: Booking's customer with customerId
    if (booking?.customer?.customerId && booking.customer.customerId.startsWith('CUST')) {
      return booking.customer.customerId;
    }

    // Priority 3: Try to find in customers list by userId
    if (booking?.userId && customers && customers.length > 0) {
      const foundCustomer = customers.find(
        (c) => c._id === booking.userId || c.phone === booking.userId || String(c.phone) === String(booking.userId)
      );
      if (foundCustomer?.customerId && foundCustomer.customerId.startsWith('CUST')) {
        return foundCustomer.customerId;
      }
    }

    // Priority 4: Other customerId fields (even if not starting with CUST)
    if (customer?.customerId) return customer.customerId;
    if (booking?.customer?.customerId) return booking.customer.customerId;
    if (booking?.customerId) return booking.customerId;

    // Final fallbacks
    return customer?._id || booking?.customer?._id || booking?.userId || 'N/A';
  };

  // Fetch bookings from API
  const fetchBookings = async () => {
    setBookingsLoading(true);
    setBookingsError(null);
    try {
      const response = await getAllOrders();
      console.log('📦 Bookings response:', response);
      console.log('📊 Total bookings received:', response.bookings?.length);

      // Debug: Log vehicle types distribution
      if (response.bookings && response.bookings.length > 0) {
        const vehicleTypeCounts = response.bookings.reduce((acc, booking) => {
          const vType = booking.vehicleType || 'Unknown';
          acc[vType] = (acc[vType] || 0) + 1;
          return acc;
        }, {});
        console.log('🚗 Vehicle type distribution:', vehicleTypeCounts);
        console.log('📋 First booking sample:', {
          orderId: response.bookings[0]?.orderId || response.bookings[0]?._id,
          vehicleType: response.bookings[0]?.vehicleType,
          customer: response.bookings[0]?.customer?.name,
          status: response.bookings[0]?.status
        });
      }

      setBookings(response.bookings || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setBookingsError('Failed to fetch booking data');
      showSnackbar('Failed to fetch booking data', 'error');
    } finally {
      setBookingsLoading(false);
    }
  };

  // Handle search
  const handleSearch = (searchTerm) => {
    if (searchTerm.trim()) {
      searchCustomers(searchTerm);
    } else {
      fetchCustomers();
    }
  };

  // Edit handlers
  const handleEditOpen = (customer) => {
    setEditCustomer(customer);
    setSelectedCustomer(customer);
    setEditDialogOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditCustomer((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSave = async () => {
    try {
      await updateCustomer(editCustomer._id, editCustomer);
      showSnackbar('Customer updated successfully!');
      setEditDialogOpen(false);
      setSelectedCustomer(null);
    } catch (error) {
      showSnackbar('Failed to update customer', 'error');
    }
  };

  const handleEditClose = () => {
    setEditDialogOpen(false);
    setSelectedCustomer(null);
  };

  // Delete handlers
  const handleDeleteOpen = (customer) => {
    setSelectedCustomer(customer);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteCustomer(selectedCustomer._id);
      showSnackbar('Customer deleted successfully!');
      setDeleteDialogOpen(false);
      setSelectedCustomer(null);
    } catch (error) {
      showSnackbar('Failed to delete customer', 'error');
    }
  };

  const handleDeleteClose = () => {
    setDeleteDialogOpen(false);
    setSelectedCustomer(null);
  };

  // Block/Unblock handlers
  const handleToggleBlock = async (customer) => {
    try {
      if (customer.isBlocked === 'true') {
        await unblockCustomer(customer._id);
        showSnackbar('Customer unblocked successfully!');
      } else {
        await blockCustomer(customer._id);
        showSnackbar('Customer blocked successfully!');
      }
    } catch (error) {
      showSnackbar('Failed to update customer status', 'error');
    }
  };

  const handleVehicleTypeChange = (event, newValue) => {
    setVehicleTypeTab(newValue);
  };

  const getStatusColor = (status) => {
    return status === 'Completed' ? 'success' : 'error';
  };

  // Download handlers
  const handleDownloadExcel = async () => {
    try {
      setSnackbar({ open: true, message: 'Preparing Excel download...', severity: 'info' });
      const filters = {};
      await exportCustomersToExcel(filters);
      setSnackbar({ open: true, message: 'Customers data exported successfully!', severity: 'success' });
    } catch (error) {
      console.error('Error downloading Excel:', error);
      setSnackbar({ open: true, message: 'Failed to download Excel file', severity: 'error' });
    }
  };

  const handleDownloadDocuments = async () => {
    try {
      setSnackbar({ open: true, message: 'Preparing documents data download...', severity: 'info' });
      const filters = {};
      await exportCustomersDocuments(filters);
      setSnackbar({ open: true, message: 'Customers documents exported successfully!', severity: 'success' });
    } catch (error) {
      console.error('Error downloading documents data:', error);
      setSnackbar({ open: true, message: 'Failed to download documents file', severity: 'error' });
    }
  };

  // Download handlers for Order Details
  const handleDownloadOrderDetailsExcel = async () => {
    try {
      setSnackbar({ open: true, message: 'Preparing order details Excel download...', severity: 'info' });
      const filters = {
        search: orderDetailsSearchTerm,
        vehicleType: vehicleTypes[vehicleTypeTab] !== 'All' ? vehicleTypes[vehicleTypeTab] : undefined
      };
      await exportOrderDetailsToExcel(filters);
      setSnackbar({ open: true, message: 'Order details exported successfully!', severity: 'success' });
    } catch (error) {
      console.error('Error downloading order details Excel:', error);
      setSnackbar({ open: true, message: 'Failed to download order details file', severity: 'error' });
    }
  };

  // Download handlers for Cancel Details
  const handleDownloadCancelDetailsExcel = async () => {
    try {
      setSnackbar({ open: true, message: 'Preparing cancel details Excel download...', severity: 'info' });
      const filters = {
        search: searchTerm,
        dateFilter: cancelDateFilter,
        customDate: cancelCustomDate
      };
      await exportCancelDetailsToExcel(filters);
      setSnackbar({ open: true, message: 'Cancel details exported successfully!', severity: 'success' });
    } catch (error) {
      console.error('Error downloading cancel details Excel:', error);
      setSnackbar({ open: true, message: 'Failed to download cancel details file', severity: 'error' });
    }
  };

  // Filtered customers for Profile Details tab
  const filteredCustomers = customers.filter(
    (customer) =>
      (customer.name?.toLowerCase() + ' ' + (customer.lname || customer.lastName || '')).toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (customer.phone || customer.mobile)?.includes(searchTerm)
  );

  // Filtered referral data for Refer and Earn tab - Dynamic from API
  const filteredReferralData = referrals
    .filter((referral) => {
      // Filter by referral type first
      const referralType = referral.referralType || 'rider'; // default to rider for old records
      return referralType === referralTypeFilter;
    })
    .map((referral, index) => ({
      serialNo: index + 1,
      customerId: referral.referredUserId?.customerId || referral.referredUserId?._id || 'N/A',
      customerName: referral.referredUserName || 'N/A',
      mobileNumber: referral.referredUserPhone || 'N/A',
      city: referral.referredUserId?.city || referral.city || 'N/A',
      referrerId: referral.referrerId?.customerId || referral.referrerId?._id || 'N/A',
      referrerName: referral.referrerName || 'N/A',
      referrerPhone: referral.referrerPhone || 'N/A',
      earning: referral.rewardAmount || 0,
      referralDate: referral.createdAt || new Date(),
      status: referral.status === 'paid' || referral.status === 'completed' ? 'Active' : 'Pending',
      // ✅ ADD MILESTONE TRACKING DATA
      ridesCompleted: referral.totalRidesCompleted || 0,
      milestonesCompleted: referral.milestonesCompleted?.length || 0,
      totalMilestones: 5,
      rewardsCredited: referral.milestonesCompleted?.reduce((sum, m) => sum + (m.reward || 0), 0) || 0,
      vehicleType: referral.vehicleType || 'N/A',
      referralType: referral.referralType || 'rider'
    }))
    .filter(
      (referral) =>
        referral.customerName.toLowerCase().includes(referralSearchTerm.toLowerCase()) ||
        referral.customerId.toLowerCase().includes(referralSearchTerm.toLowerCase()) ||
        referral.mobileNumber.includes(referralSearchTerm) ||
        (referral.city && referral.city.toLowerCase().includes(referralSearchTerm.toLowerCase())) ||
        referral.referrerName.toLowerCase().includes(referralSearchTerm.toLowerCase()) ||
        referral.referrerId.toLowerCase().includes(referralSearchTerm.toLowerCase()) ||
        (referral.referrerPhone && referral.referrerPhone.includes(referralSearchTerm))
    );

  // Filtered wallet data for Wallet tab
  const filteredWalletData = walletData.filter(
    (wallet) =>
      wallet.customerName.toLowerCase().includes(walletSearchTerm.toLowerCase()) ||
      wallet.customerId.toLowerCase().includes(walletSearchTerm.toLowerCase())
  );

  // Filtered high order data for High Orders tab
  const filteredHighOrderData = highOrderData.filter(
    (highOrder) =>
      highOrder.customerName.toLowerCase().includes(highOrderSearchTerm.toLowerCase()) ||
      highOrder.customerId.toLowerCase().includes(highOrderSearchTerm.toLowerCase())
  );

  // Filtered customers for Block ID tab
  const filteredBlockIdCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(blockIdSearchTerm.toLowerCase()) ||
      customer.customerId.toLowerCase().includes(blockIdSearchTerm.toLowerCase())
  );

  // Filtered customers for Data Analyze tab
  const filteredDataAnalyzeCustomers = customers.filter((customer) => {
    // Pincode filter
    const matchesPincode = dataAnalyzePincode === '' || (customer.pinCode || '').includes(dataAnalyzePincode);
    // Date filter logic (using app duration) - with null checks for API data
    let matchesDate = true;
    const usingApp = customer.usingApp || { years: 0, months: 0, days: 0 };
    const totalDays = (usingApp.years || 0) * 365 + (usingApp.months || 0) * 30 + (usingApp.days || 0);
    if (dataAnalyzeDateFilter === 'today') {
      matchesDate = totalDays <= 1;
    } else if (dataAnalyzeDateFilter === 'week') {
      matchesDate = totalDays <= 7;
    } else if (dataAnalyzeDateFilter === 'month') {
      matchesDate = totalDays <= 31;
    } else if (dataAnalyzeDateFilter === 'year') {
      matchesDate = totalDays <= 366;
    } else if (dataAnalyzeDateFilter === 'custom' && dataAnalyzeCustomDate) {
      // For demo, assume all customers started today minus totalDays
      const today = new Date();
      const startedDate = new Date();
      startedDate.setDate(today.getDate() - totalDays);
      matchesDate = startedDate.toDateString() === new Date(dataAnalyzeCustomDate).toDateString();
    }
    return matchesPincode && matchesDate;
  });

  // Filtered customers for Profile Details tab
  const filteredProfileDetailsCustomers = customers.filter(
    (customer) =>
      safeExtractCustomerName(customer).toLowerCase().includes(profileDetailsSearchTerm.toLowerCase()) ||
      getCustomerId(customer).toLowerCase().includes(profileDetailsSearchTerm.toLowerCase()) ||
      (customer.mobile || customer.phone || '').includes(profileDetailsSearchTerm)
  );

  // Filtered order data for Order Details tab
  const getFilteredOrderData = (vehicleType) => {
    // Filter bookings by vehicle type and search term
    console.log('🔍 Filtering for vehicle type:', vehicleType);
    console.log('📦 Total bookings:', bookings.length);

    return bookings.filter((booking) => {
      // Normalize the booking's vehicle type for comparison
      const bookingVehicleType = (booking.vehicleType || '').toUpperCase().trim();
      const selectedVehicleType = vehicleType.toUpperCase().trim();

      console.log(`Comparing: booking="${bookingVehicleType}" vs selected="${selectedVehicleType}"`);

      // Exact match for vehicle type
      const matchesVehicleType = bookingVehicleType === selectedVehicleType;

      // Check if booking matches search term
      const matchesSearch =
        !orderDetailsSearchTerm ||
        booking.customer?.name?.toLowerCase().includes(orderDetailsSearchTerm.toLowerCase()) ||
        getCustomerId(booking.customer, booking).toLowerCase().includes(orderDetailsSearchTerm.toLowerCase()) ||
        booking.customer?.firstName?.toLowerCase().includes(orderDetailsSearchTerm.toLowerCase()) ||
        booking.customer?.lastName?.toLowerCase().includes(orderDetailsSearchTerm.toLowerCase()) ||
        booking.customerName?.toLowerCase().includes(orderDetailsSearchTerm.toLowerCase()) ||
        booking.userId?.toLowerCase().includes(orderDetailsSearchTerm.toLowerCase()) ||
        booking.bookingId?.toLowerCase().includes(orderDetailsSearchTerm.toLowerCase());

      const result = matchesVehicleType && matchesSearch;
      if (matchesVehicleType) {
        console.log('✅ Match found:', booking.orderId || booking._id, bookingVehicleType);
      }

      return result;
    });
  };

  // Helper function to filter cancel details by date
  const filterCancelDetails = () => {
    // Filter cancelled bookings from real API data
    const cancelledBookings = bookings.filter((booking) => {
      const isCancelled = booking.status?.toLowerCase() === 'cancelled' || booking.status?.toLowerCase() === 'canceled';

      // Apply search filter
      const matchesSearch =
        !searchTerm ||
        booking.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getCustomerId(booking.customer, booking).toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.customerName?.toLowerCase().includes(searchTerm.toLowerCase());

      return isCancelled && matchesSearch;
    });

    // Apply date filter
    if (cancelDateFilter === 'all') return cancelledBookings;

    const now = new Date();
    return cancelledBookings.filter((booking) => {
      const cancelDate = new Date(booking.cancelledAt || booking.updatedAt || booking.createdAt);

      if (cancelDateFilter === 'today') {
        return cancelDate.toDateString() === now.toDateString();
      } else if (cancelDateFilter === 'week') {
        const weekAgo = new Date(now);
        weekAgo.setDate(now.getDate() - 7);
        return cancelDate >= weekAgo && cancelDate <= now;
      } else if (cancelDateFilter === 'month') {
        return cancelDate.getMonth() === now.getMonth() && cancelDate.getFullYear() === now.getFullYear();
      } else if (cancelDateFilter === 'year') {
        return cancelDate.getFullYear() === now.getFullYear();
      } else if (cancelDateFilter === 'custom' && cancelCustomDate) {
        return cancelDate.toDateString() === new Date(cancelCustomDate).toDateString();
      }
      return true;
    });
  };

  // Handle error state
  useEffect(() => {
    if (error) {
      showSnackbar(error, 'error');
      clearError();
    }
  }, [error, clearError]);

  // Fetch bookings when component mounts
  useEffect(() => {
    fetchBookings();
    fetchReferrals();
  }, []);

  // Function to fetch referrals from backend
  const fetchReferrals = async () => {
    try {
      setReferralsLoading(true);
      setReferralsError(null);
      console.log('📞 Fetching referrals from API...');

      const response = await referralApi.getAllReferrals({ page: 1, limit: 1000 });
      console.log('✅ Referrals response:', response);

      if (response.success && response.referrals) {
        setReferrals(response.referrals);
        console.log(`📊 Loaded ${response.referrals.length} referrals`);
      } else {
        setReferrals([]);
      }
    } catch (err) {
      console.error('❌ Error fetching referrals:', err);
      setReferralsError(err.message || 'Failed to fetch referrals');
      setReferrals([]);
    } finally {
      setReferralsLoading(false);
    }
  };

  // Show loading spinner
  if (loading && customers.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Loading customers...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', minHeight: 500, mt: 5 }}>
      <h1>Customer Management</h1>
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
          <Typography variant="h5" color="primary" gutterBottom>
            {tabLabels[tab]}
          </Typography>
          {tab === 0 ? (
            <Box>
              {/* Search Bar and Action Buttons for Profile Details */}
              <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                <TextField
                  placeholder="Search by customer name, customer ID, or mobile number..."
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
                <Box sx={{ display: 'flex', gap: 1, ml: 'auto' }}>
                  <Button variant="outlined" color="primary" startIcon={<DownloadIcon />} onClick={handleDownloadExcel}>
                    Download Excel
                  </Button>
                  <Button variant="outlined" color="secondary" startIcon={<DescriptionOutlinedIcon />} onClick={handleDownloadDocuments}>
                    Download Documents
                  </Button>
                </Box>
              </Box>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <b>S. No.</b>
                      </TableCell>
                      <TableCell>
                        <b>Customer ID</b>
                      </TableCell>
                      <TableCell>
                        <b>Photo</b>
                      </TableCell>
                      <TableCell>
                        <b>Customer Name</b>
                      </TableCell>
                      <TableCell>
                        <b>Mobile Number</b>
                      </TableCell>
                      <TableCell>
                        <b>Email ID</b>
                      </TableCell>
                      <TableCell>
                        <b>Pin Code</b>
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
                    {filteredProfileDetailsCustomers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} align="center">
                          <Box sx={{ py: 3 }}>
                            <Typography variant="body1" color="text.secondary">
                              {profileDetailsSearchTerm ? 'No customers found matching your search.' : 'No customers available.'}
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredProfileDetailsCustomers.map((customer, idx) => (
                        <TableRow key={customer._id || customer.id || idx} hover>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {idx + 1}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                              {getCustomerId(customer)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Avatar
                              src={customer.photo || customer.profilePhoto}
                              alt={safeExtractCustomerName(customer)}
                              sx={{ width: 40, height: 40 }}
                            >
                              {safeExtractCustomerName(customer)[0].toUpperCase()}
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
                              onClick={() => navigate(`/dashboard/customers/${getCustomerId(customer)}`)}
                            >
                              {safeExtractCustomerName(customer)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {customer.mobile || customer.phone || 'N/A'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary">
                              {customer.email || 'N/A'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                              {customer.pinCode || customer.zipCode || 'N/A'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={customer.status || 'Unknown'}
                              color={customer.status === 'Active' || customer.status === 'active' ? 'success' : 'error'}
                              size="small"
                              sx={{ fontWeight: 600 }}
                            />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <IconButton
                                color="primary"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditOpen(customer);
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
                                  handleDeleteOpen(customer);
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
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Pagination */}
              {pagination.total > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
                    {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} customers
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
              {/* Search Bar and Action Buttons for Order Details */}
              <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                <TextField
                  placeholder="Search by customer name or customer ID..."
                  value={orderDetailsSearchTerm}
                  onChange={(e) => setOrderDetailsSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                  sx={{ flexGrow: 1, maxWidth: 500 }}
                />
                <Button variant="outlined" onClick={() => setOrderDetailsSearchTerm('')} disabled={!orderDetailsSearchTerm}>
                  Clear
                </Button>
                <Box sx={{ display: 'flex', gap: 1, ml: 'auto' }}>
                  <Button variant="outlined" color="primary" startIcon={<DownloadIcon />} onClick={handleDownloadOrderDetailsExcel}>
                    Download Excel
                  </Button>
                </Box>
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
                        <b>Customer ID</b>
                      </TableCell>
                      <TableCell>
                        <b>Customer Name</b>
                      </TableCell>
                      <TableCell>
                        <b>Order ID</b>
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
                        <b>Locations</b>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {getFilteredOrderData(vehicleTypes[vehicleTypeTab]).length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} align="center">
                          <Box sx={{ py: 3 }}>
                            <Typography variant="body1" color="text.secondary">
                              {bookingsLoading
                                ? 'Loading bookings...'
                                : orderDetailsSearchTerm
                                  ? 'No orders found matching your search.'
                                  : 'No orders available for this vehicle type.'}
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ) : (
                      getFilteredOrderData(vehicleTypes[vehicleTypeTab]).map((booking, index) => (
                        <TableRow key={booking._id || index} hover>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {index + 1}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                              {getCustomerId(booking.customer, booking)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar sx={{ mr: 2, bgcolor: 'primary.main', width: 32, height: 32, fontSize: '0.875rem' }}>
                                {(safeExtractCustomerName(booking.customer) || booking.customerName || 'U')[0].toUpperCase()}
                              </Avatar>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {safeExtractCustomerName(booking.customer) || booking.customerName || 'Unknown Customer'}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: 'secondary.main' }}>
                              {booking.bookingId || booking._id || 'N/A'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={booking.vehicleType || booking.category || 'N/A'}
                              color="info"
                              size="small"
                              variant="outlined"
                              sx={{ fontWeight: 600 }}
                            />
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={booking.status || 'Unknown'}
                              color={getStatusColor(booking.status)}
                              size="small"
                              sx={{ fontWeight: 600 }}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>
                              ₹{(booking.totalFare || booking.amount || 0).toLocaleString()}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary">
                              {new Date(booking.createdAt || booking.date).toLocaleDateString()}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Button
                              size="small"
                              variant="outlined"
                              startIcon={<VisibilityIcon />}
                              onClick={() => {
                                setSelectedOrderLocations(booking);
                                setLocationDialogOpen(true);
                              }}
                              sx={{ fontWeight: 600 }}
                            >
                              View Locations
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Pagination */}
              {pagination.total > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
                    {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} customers
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
          ) : tab === 2 ? (
            // Cancel Details Tab
            <Box>
              {/* Date Range Filter Buttons */}
              <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                <Button variant={cancelDateFilter === 'all' ? 'contained' : 'outlined'} onClick={() => setCancelDateFilter('all')}>
                  All
                </Button>
                <Button variant={cancelDateFilter === 'today' ? 'contained' : 'outlined'} onClick={() => setCancelDateFilter('today')}>
                  Today
                </Button>
                <Button variant={cancelDateFilter === 'week' ? 'contained' : 'outlined'} onClick={() => setCancelDateFilter('week')}>
                  Weekly
                </Button>
                <Button variant={cancelDateFilter === 'month' ? 'contained' : 'outlined'} onClick={() => setCancelDateFilter('month')}>
                  Monthly
                </Button>
                <Button variant={cancelDateFilter === 'year' ? 'contained' : 'outlined'} onClick={() => setCancelDateFilter('year')}>
                  Yearly
                </Button>
                <Button variant={cancelDateFilter === 'custom' ? 'contained' : 'outlined'} onClick={() => setCancelDateFilter('custom')}>
                  Custom Date
                </Button>
                {cancelDateFilter === 'custom' && (
                  <TextField
                    type="date"
                    size="small"
                    value={cancelCustomDate}
                    onChange={(e) => setCancelCustomDate(e.target.value)}
                    sx={{ ml: 1, minWidth: 150 }}
                  />
                )}
              </Box>
              {/* Search Bar and Action Buttons for Cancel Details */}
              <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                <TextField
                  placeholder="Search by customer name or customer ID..."
                  value={searchTerm} // Reusing searchTerm for cancel details
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                  sx={{ flexGrow: 1, maxWidth: 500 }}
                />
                <Button variant="outlined" onClick={() => setSearchTerm('')} disabled={!searchTerm}>
                  Clear
                </Button>
                <Box sx={{ display: 'flex', gap: 1, ml: 'auto' }}>
                  <Button variant="outlined" color="primary" startIcon={<DownloadIcon />} onClick={handleDownloadCancelDetailsExcel}>
                    Download Excel
                  </Button>
                </Box>
              </Box>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <b>S. No.</b>
                      </TableCell>
                      <TableCell>
                        <b>Order ID</b>
                      </TableCell>
                      <TableCell>
                        <b>Customer ID</b>
                      </TableCell>
                      <TableCell>
                        <b>Customer Name</b>
                      </TableCell>
                      <TableCell>
                        <b>Vehicle Type</b>
                      </TableCell>
                      <TableCell>
                        <b>Reason for Cancel</b>
                      </TableCell>
                      <TableCell>
                        <b>Cancel Date</b>
                      </TableCell>
                      <TableCell>
                        <b>Action</b>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filterCancelDetails().length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} align="center">
                          <Box sx={{ py: 3 }}>
                            <Typography variant="body1" color="text.secondary">
                              {bookingsLoading
                                ? 'Loading cancelled bookings...'
                                : searchTerm
                                  ? 'No cancelled bookings found matching your search.'
                                  : 'No cancelled bookings available.'}
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filterCancelDetails().map((booking, idx) => (
                        <TableRow key={booking._id || booking.id || idx} hover>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {idx + 1}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                              {booking.orderId || booking.bookingId || booking._id?.toString().slice(-8).toUpperCase() || 'N/A'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {getCustomerId(booking.customer || booking.userId, booking)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">{safeExtractCustomerName(booking.customer || booking.userId)}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">{booking.vehicleType || booking.category || 'N/A'}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {booking.cancellationReason || booking.cancelReason || 'No reason provided'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {booking.cancelledAt
                                ? new Date(booking.cancelledAt).toLocaleDateString('en-IN')
                                : booking.updatedAt
                                  ? new Date(booking.updatedAt).toLocaleDateString('en-IN')
                                  : 'N/A'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <IconButton
                              color="primary"
                              onClick={() => {
                                setSelectedCancel(booking);
                                setCancelDialogOpen(true);
                              }}
                            >
                              <VisibilityIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              {/* Cancel Details Dialog */}
              <Dialog open={cancelDialogOpen} onClose={() => setCancelDialogOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>Cancellation Details</DialogTitle>
                <DialogContent dividers>
                  {selectedCancel && (
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                        Order ID:{' '}
                        {selectedCancel.orderId || selectedCancel.bookingId || selectedCancel._id?.toString().slice(-8).toUpperCase()}
                      </Typography>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                        Customer ID: {getCustomerId(selectedCancel.customer || selectedCancel.userId, selectedCancel)}
                      </Typography>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                        Customer Name: {safeExtractCustomerName(selectedCancel.customer || selectedCancel.userId)}
                      </Typography>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                        Vehicle Type: {selectedCancel.vehicleType || selectedCancel.category || 'N/A'}
                      </Typography>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                        Cancellation Reason: {selectedCancel.cancellationReason || selectedCancel.cancelReason || 'No reason provided'}
                      </Typography>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                        Cancelled By: {selectedCancel.cancelledBy || 'N/A'}
                      </Typography>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                        Cancel Date:{' '}
                        {selectedCancel.cancelledAt
                          ? new Date(selectedCancel.cancelledAt).toLocaleString('en-IN')
                          : selectedCancel.updatedAt
                            ? new Date(selectedCancel.updatedAt).toLocaleString('en-IN')
                            : 'N/A'}
                      </Typography>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                        Amount: ₹{selectedCancel.totalPrice || selectedCancel.price || 0}
                      </Typography>
                      {(selectedCancel.fromLocation?.address || selectedCancel.fromAddress) && (
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                          Pickup: {selectedCancel.fromLocation?.address || selectedCancel.fromAddress}
                        </Typography>
                      )}
                      {(selectedCancel.toLocation?.address || selectedCancel.toAddress) && (
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                          Drop: {selectedCancel.toLocation?.address || selectedCancel.toAddress}
                        </Typography>
                      )}
                    </Box>
                  )}
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setCancelDialogOpen(false)} color="primary">
                    Close
                  </Button>
                </DialogActions>
              </Dialog>
            </Box>
          ) : tab === 3 ? (
            // Data Analyze Tab
            <Box>
              {/* Filters */}
              <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
                <TextField
                  select
                  label="Date Range"
                  value={dataAnalyzeDateFilter}
                  onChange={(e) => setDataAnalyzeDateFilter(e.target.value)}
                  size="small"
                  sx={{ width: 160 }}
                  SelectProps={{ native: true }}
                >
                  <option value="all">All</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="year">This Year</option>
                  <option value="custom">Custom Date</option>
                </TextField>
                {dataAnalyzeDateFilter === 'custom' && (
                  <TextField
                    type="date"
                    value={dataAnalyzeCustomDate}
                    onChange={(e) => setDataAnalyzeCustomDate(e.target.value)}
                    size="small"
                    sx={{ width: 160 }}
                  />
                )}
                <TextField
                  label="Pincode"
                  placeholder="Filter by pincode"
                  value={dataAnalyzePincode}
                  onChange={(e) => setDataAnalyzePincode(e.target.value)}
                  size="small"
                  sx={{ width: 140 }}
                />
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <b>S. No.</b>
                      </TableCell>
                      <TableCell>
                        <b>Customer ID</b>
                      </TableCell>
                      <TableCell>
                        <b>Customer Name</b>
                      </TableCell>
                      <TableCell>
                        <b>Using App Duration</b>
                      </TableCell>
                      <TableCell>
                        <b>Pin Code</b>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredDataAnalyzeCustomers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center">
                          <Typography variant="body1" color="text.secondary" sx={{ py: 3 }}>
                            No customers found for the selected filters.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredDataAnalyzeCustomers.map((customer, idx) => (
                        <TableRow key={customer.id} hover>
                          <TableCell>{idx + 1}</TableCell>
                          <TableCell>
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 600,
                                color: 'primary.main',
                                textDecoration: 'underline',
                                cursor: 'pointer',
                                '&:hover': { color: 'primary.dark' }
                              }}
                              onClick={() => navigate(`/dashboard/customers/${getCustomerId(customer)}`)}
                            >
                              {getCustomerId(customer)}
                            </Typography>
                          </TableCell>
                          <TableCell>{customer.name}</TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                              {(customer.usingApp?.years || 0) > 0 && (
                                <Chip
                                  label={`${(customer.usingApp || {}).years || 0} Year(s)`}
                                  color="primary"
                                  size="small"
                                  variant="outlined"
                                />
                              )}
                              {(customer.usingApp?.months || 0) > 0 && (
                                <Chip
                                  label={`${(customer.usingApp || {}).months || 0} Month(s)`}
                                  color="secondary"
                                  size="small"
                                  variant="outlined"
                                />
                              )}
                              {(customer.usingApp?.days || 0) > 0 && (
                                <Chip
                                  label={`${(customer.usingApp || {}).days || 0} Day(s)`}
                                  color="info"
                                  size="small"
                                  variant="outlined"
                                />
                              )}
                              {(customer.usingApp?.years || 0) === 0 &&
                                (customer.usingApp?.months || 0) === 0 &&
                                (customer.usingApp?.days || 0) === 0 && (
                                  <Typography variant="caption" color="text.secondary">
                                    New User
                                  </Typography>
                                )}
                            </Box>
                          </TableCell>
                          <TableCell>{customer.pinCode || customer.zipCode || 'N/A'}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Pagination */}
              {pagination.total > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
                    {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} customers
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
          ) : tab === 4 ? (
            // Block ID Tab
            <Box>
              {/* Search Bar for Block ID */}
              <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                <TextField
                  placeholder="Search by customer name or customer ID..."
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
                        <b>Customer ID</b>
                      </TableCell>
                      <TableCell>
                        <b>Customer Name</b>
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
                        <b>Actions</b>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredBlockIdCustomers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} align="center">
                          <Box sx={{ py: 3 }}>
                            <Typography variant="body1" color="text.secondary">
                              {blockIdSearchTerm ? 'No customers found matching your search.' : 'No customers available.'}
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredBlockIdCustomers.map((customer, idx) => (
                        <TableRow key={customer.id} hover>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {idx + 1}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                              {getCustomerId(customer)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar src={customer.photo} alt={customer.name} sx={{ mr: 2, width: 32, height: 32, fontSize: '0.875rem' }}>
                                {customer.name[0]}
                              </Avatar>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {customer.name}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary">
                              {customer.email}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary">
                              {customer.mobile || customer.phone || 'N/A'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={customer.blocked || customer.isBlocked === 'true' ? 'Blocked' : 'Active'}
                              color={customer.blocked || customer.isBlocked === 'true' ? 'error' : 'success'}
                              size="small"
                              sx={{ fontWeight: 600 }}
                            />
                          </TableCell>
                          <TableCell>
                            {customer.blocked || customer.isBlocked === 'true' ? (
                              <Button
                                variant="contained"
                                color="success"
                                size="small"
                                onClick={async () => {
                                  try {
                                    await unblockCustomer(customer._id || customer.id);
                                    showSnackbar('Customer unblocked successfully!', 'success');
                                  } catch (error) {
                                    console.error('Error unblocking customer:', error);
                                    showSnackbar('Failed to unblock customer', 'error');
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
                                  try {
                                    await blockCustomer(customer._id || customer.id);
                                    showSnackbar('Customer blocked successfully!', 'success');
                                  } catch (error) {
                                    console.error('Error blocking customer:', error);
                                    showSnackbar('Failed to block customer', 'error');
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

              {/* Pagination */}
              {pagination.total > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
                    {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} customers
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
          ) : tab === 5 ? (
            // High Orders Tab
            <Box>
              {/* Search Bar for High Orders */}
              <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                <TextField
                  placeholder="Search by customer name or customer ID..."
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
                        <b>Customer ID</b>
                      </TableCell>
                      <TableCell>
                        <b>Customer Name</b>
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
                              {highOrderSearchTerm
                                ? 'No high order customers found matching your search.'
                                : 'No high order data available.'}
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredHighOrderData.map((customer, idx) => (
                        <TableRow key={idx} hover>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {customer.serialNo}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                              {getCustomerId(customer)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar sx={{ mr: 2, bgcolor: 'primary.main', width: 32, height: 32, fontSize: '0.875rem' }}>
                                {customer.customerName[0]}
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
                                onClick={() => navigate(`/dashboard/customers/${getCustomerId(customer)}/orders`)}
                              >
                                {customer.customerName}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={`${(customer.orders || []).length} Orders`}
                              color="success"
                              size="small"
                              sx={{ fontWeight: 600 }}
                            />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ maxHeight: 200, overflowY: 'auto' }}>
                              {(customer.orders || []).map((order, i) => (
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
                              {(customer.orders || []).map((order, i) => (
                                <Box
                                  key={order.orderId}
                                  sx={{ mb: 1, p: 1, border: '1px solid #e0e0e0', borderRadius: 1, bgcolor: 'grey.50' }}
                                >
                                  <Typography variant="caption" sx={{ fontWeight: 600 }}>
                                    Name: {order.receiver.name}
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

              {/* Pagination */}
              {pagination.total > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
                    {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} customers
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
          ) : tab === 6 ? (
            // Wallet Tab
            <Box>
              {/* Search Bar for Wallet */}
              <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                <TextField
                  placeholder="Search by customer name or customer ID..."
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
                        <b>Customer ID</b>
                      </TableCell>
                      <TableCell>
                        <b>Customer Name</b>
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
                              {row.customerId}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box
                              sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                              onClick={() => navigate(`/customer/${row.customerId}`)}
                            >
                              <Avatar sx={{ mr: 2, bgcolor: 'primary.main', width: 32, height: 32, fontSize: '0.875rem' }}>
                                {row.customerName[0]}
                              </Avatar>
                              <Typography variant="body2" sx={{ fontWeight: 600, textDecoration: 'underline', color: 'primary.dark' }}>
                                {row.customerName}
                              </Typography>
                            </Box>
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

              {/* Pagination */}
              {pagination.total > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
                    {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} customers
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
          ) : tab === 7 ? (
            // Refer and Earn Tab
            <Box>
              {/* Referral Type Filter Buttons */}
              <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
                <Button
                  variant={referralTypeFilter === 'customer' ? 'contained' : 'outlined'}
                  onClick={() => setReferralTypeFilter('customer')}
                  startIcon={<AccountCircleIcon />}
                  sx={{ textTransform: 'none', fontWeight: 600 }}
                >
                  Customers
                </Button>
                <Button
                  variant={referralTypeFilter === 'rider' ? 'contained' : 'outlined'}
                  onClick={() => setReferralTypeFilter('rider')}
                  startIcon={<GroupAddIcon />}
                  sx={{ textTransform: 'none', fontWeight: 600 }}
                >
                  Partners
                </Button>
              </Box>

              {/* Search Bar for Refer and Earn */}
              <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                <TextField
                  placeholder="Search by customer name, ID, referrer name, or referrer ID..."
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

              {/* Loading State */}
              {referralsLoading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
                  <CircularProgress />
                </Box>
              )}

              {/* Error State */}
              {referralsError && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {referralsError}
                </Alert>
              )}

              {/* Table - Show only when not loading */}
              {!referralsLoading && (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <b>S. No.</b>
                        </TableCell>
                        <TableCell>
                          <b>{referralTypeFilter === 'customer' ? 'Customer' : 'Referred'} ID</b>
                        </TableCell>
                        <TableCell>
                          <b>{referralTypeFilter === 'customer' ? 'Customer' : 'Referred'} Name</b>
                        </TableCell>
                        <TableCell>
                          <b>Mobile Number</b>
                        </TableCell>
                        <TableCell>
                          <b>City</b>
                        </TableCell>
                        {referralTypeFilter === 'rider' && (
                          <>
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
                          </>
                        )}
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
                        {referralTypeFilter === 'customer' && (
                          <TableCell>
                            <b>Reward (₹)</b>
                          </TableCell>
                        )}
                        {referralTypeFilter === 'rider' && (
                          <TableCell>
                            <b>Max Reward (₹)</b>
                          </TableCell>
                        )}
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
                                {referralSearchTerm 
                                  ? `No ${referralTypeFilter === 'customer' ? 'customer' : 'partner'} referrals found matching your search.` 
                                  : `No ${referralTypeFilter === 'customer' ? 'customer' : 'partner'} referral data available.`}
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
                                {row.customerId}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Avatar sx={{ mr: 2, bgcolor: 'primary.main', width: 32, height: 32, fontSize: '0.875rem' }}>
                                  {row.customerName[0]}
                                </Avatar>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                  {row.customerName}
                                </Typography>
                              </Box>
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
                            {referralTypeFilter === 'rider' && (
                              <>
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
                              </>
                            )}
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
                            {referralTypeFilter === 'customer' && (
                              <TableCell>
                                <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>
                                  ₹{row.earning}
                                </Typography>
                              </TableCell>
                            )}
                            {referralTypeFilter === 'rider' && (
                              <TableCell>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                  ₹{row.earning}
                                </Typography>
                              </TableCell>
                            )}
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

              {/* Pagination */}
              {pagination.total > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
                    {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} customers
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
          ) : tab === 8 ? (
            <Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <b>S. No.</b>
                      </TableCell>
                      <TableCell>
                        <b>Customer Name</b>
                      </TableCell>
                      <TableCell>
                        <b>Download Count</b>
                      </TableCell>
                      <TableCell>
                        <b>Email ID</b>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {downloadInvoiceData.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} align="center">
                          <Typography variant="body1" color="text.secondary" sx={{ py: 3 }}>
                            No invoice download data available.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      downloadInvoiceData.map((row, idx) => (
                        <TableRow key={row.id} hover>
                          <TableCell>{idx + 1}</TableCell>
                          <TableCell>{row.customerName}</TableCell>
                          <TableCell>{row.downloadCount}</TableCell>
                          <TableCell>{row.email}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          ) : (
            <Typography variant="body1">{tabContent[tab]}</Typography>
          )}
        </Paper>
      </Box>
      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={handleEditClose} maxWidth="xs" fullWidth>
        <DialogTitle>Edit Customer</DialogTitle>
        <DialogContent dividers>
          <TextField label="Name" name="name" value={editCustomer.name || ''} onChange={handleEditChange} fullWidth margin="normal" />
          <TextField
            label="Mobile Number"
            name="mobile"
            value={editCustomer.mobile || ''}
            onChange={handleEditChange}
            fullWidth
            margin="normal"
          />
          <TextField label="Email ID" name="email" value={editCustomer.email || ''} onChange={handleEditChange} fullWidth margin="normal" />
          <TextField
            label="Pin Code"
            name="pinCode"
            value={editCustomer.pinCode || ''}
            onChange={handleEditChange}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>Cancel</Button>
          <Button onClick={handleEditSave} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteClose} maxWidth="xs">
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent dividers>
          <Typography>Are you sure you want to delete this customer?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteClose}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}>
        <Alert onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Location Details Dialog */}
      <Dialog open={locationDialogOpen} onClose={() => setLocationDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6">Location Details</Typography>
            <IconButton onClick={() => setLocationDialogOpen(false)} sx={{ color: 'white' }} size="small">
              <VisibilityIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 3 }}>
          {selectedOrderLocations && (
            <Box>
              {/* Order Info */}
              <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Order ID
                </Typography>
                <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
                  {selectedOrderLocations.bookingId || selectedOrderLocations._id || 'N/A'}
                </Typography>
              </Box>

              {/* Pickup Location */}
              <Box sx={{ mb: 3, p: 2, border: '2px solid', borderColor: 'success.main', borderRadius: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      bgcolor: 'success.main',
                      mr: 1
                    }}
                  />
                  <Typography variant="h6" color="success.main" sx={{ fontWeight: 600 }}>
                    Pickup Location
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ mt: 1, fontWeight: 500 }}>
                  {selectedOrderLocations.pickupLocation?.address || selectedOrderLocations.pickup || 'N/A'}
                </Typography>
                {selectedOrderLocations.pickupLocation?.coordinates && (
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                    Coordinates: {selectedOrderLocations.pickupLocation.coordinates.lat},{' '}
                    {selectedOrderLocations.pickupLocation.coordinates.lng}
                  </Typography>
                )}
              </Box>

              {/* Mid Stops */}
              {selectedOrderLocations.midStops && selectedOrderLocations.midStops.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" color="warning.main" sx={{ fontWeight: 600, mb: 2 }}>
                    Mid Stops ({selectedOrderLocations.midStops.length})
                  </Typography>
                  {selectedOrderLocations.midStops.map((midStop, index) => (
                    <Box
                      key={index}
                      sx={{
                        mb: 2,
                        p: 2,
                        border: '2px solid',
                        borderColor: 'warning.main',
                        borderRadius: 2,
                        bgcolor: 'warning.lighter'
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Box
                          sx={{
                            width: 10,
                            height: 10,
                            borderRadius: '50%',
                            bgcolor: 'warning.main',
                            mr: 1
                          }}
                        />
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          Stop {index + 1}
                        </Typography>
                      </Box>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {midStop.address || 'N/A'}
                      </Typography>
                      {midStop.coordinates && (
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                          Coordinates: {midStop.coordinates.lat}, {midStop.coordinates.lng}
                        </Typography>
                      )}
                    </Box>
                  ))}
                </Box>
              )}

              {/* Drop Location */}
              <Box sx={{ p: 2, border: '2px solid', borderColor: 'error.main', borderRadius: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      bgcolor: 'error.main',
                      mr: 1
                    }}
                  />
                  <Typography variant="h6" color="error.main" sx={{ fontWeight: 600 }}>
                    Drop Location
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ mt: 1, fontWeight: 500 }}>
                  {selectedOrderLocations.dropLocation?.address || selectedOrderLocations.drop || 'N/A'}
                </Typography>
                {selectedOrderLocations.dropLocation?.coordinates && (
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                    Coordinates: {selectedOrderLocations.dropLocation.coordinates.lat},{' '}
                    {selectedOrderLocations.dropLocation.coordinates.lng}
                  </Typography>
                )}
              </Box>

              {/* Additional Info */}
              {(selectedOrderLocations.distance || selectedOrderLocations.duration) && (
                <Box sx={{ mt: 3, p: 2, bgcolor: 'info.lighter', borderRadius: 2 }}>
                  <Typography variant="subtitle2" color="info.dark" sx={{ fontWeight: 600, mb: 1 }}>
                    Trip Information
                  </Typography>
                  {selectedOrderLocations.distance && (
                    <Typography variant="body2" color="text.secondary">
                      <b>Distance:</b> {selectedOrderLocations.distance} km
                    </Typography>
                  )}
                  {selectedOrderLocations.duration && (
                    <Typography variant="body2" color="text.secondary">
                      <b>Duration:</b> {selectedOrderLocations.duration} mins
                    </Typography>
                  )}
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLocationDialogOpen(false)} variant="contained" color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageCustomer;
