import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  Chip,
  Card,
  CardContent,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Divider,
  Stack,
  Alert
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Today as TodayIcon,
  DateRange as DateRangeIcon,
  Visibility as ViewIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  DirectionsBike as BikeIcon,
  AirportShuttle as AutoIcon,
  LocalShipping as TruckIcon,
  CalendarToday as CalendarIcon,
  Receipt as ReceiptIcon,
  Person as PersonIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// Dummy order data
const dummyOrders = [
  {
    id: 'ORD001',
    serialNo: 1,
    customerId: 'CUST001',
    customerName: 'Alice Johnson',
    customerMobile: '9876543210',
    customerEmail: 'alice@example.com',
    orderDate: '2024-01-15',
    orderTime: '10:30 AM',
    vehicleType: '2W',
    pickupLocation: 'Mumbai Central, Mumbai',
    dropLocation: 'Andheri West, Mumbai',
    pickupArea: 'Mumbai Central',
    dropArea: 'Andheri West',
    city: 'Mumbai',
    pickupPincode: '400001',
    dropPincode: '400058',
    amount: 150,
    status: 'Completed',
    driverName: 'Ravi Kumar',
    driverMobile: '9000000001',
    paymentMethod: 'Wallet',
    orderType: 'Express',
    cancellationReason: null,
    cancelledBy: null,
    cancelledAt: null,
    pickTime: '10:00 AM',
    dropTime: '11:00 AM'
  },
  {
    id: 'ORD002',
    serialNo: 2,
    customerId: 'CUST002',
    customerName: 'Bob Smith',
    customerMobile: '9123456780',
    customerEmail: 'bob@example.com',
    orderDate: '2024-01-16',
    orderTime: '02:15 PM',
    vehicleType: '3W',
    pickupLocation: 'Bandra East, Mumbai',
    dropLocation: 'Juhu, Mumbai',
    pickupArea: 'Bandra East',
    dropArea: 'Juhu',
    city: 'Mumbai',
    pickupPincode: '400051',
    dropPincode: '400049',
    amount: 200,
    status: 'Canceled',
    driverName: null,
    driverMobile: null,
    paymentMethod: 'Cash',
    orderType: 'Standard',
    cancellationReason: 'Customer requested cancellation - change of plans due to emergency meeting',
    cancelledBy: 'Customer',
    cancelledAt: '2024-01-16 02:45 PM',
    pickTime: '02:00 PM',
    dropTime: '03:00 PM'
  },
  {
    id: 'ORD003',
    serialNo: 3,
    customerId: 'CUST003',
    customerName: 'Charlie Brown',
    customerMobile: '9988776655',
    customerEmail: 'charlie@example.com',
    orderDate: '2024-01-17',
    orderTime: '09:45 AM',
    vehicleType: 'Truck',
    pickupLocation: 'Mumbai Port, Mumbai',
    dropLocation: 'Bhiwandi, Maharashtra',
    pickupArea: 'Mumbai Port',
    dropArea: 'Bhiwandi',
    city: 'Mumbai',
    pickupPincode: '400001',
    dropPincode: '421302',
    amount: 800,
    status: 'Completed',
    driverName: 'Amit Sharma',
    driverMobile: '9000000003',
    paymentMethod: 'Card',
    orderType: 'Heavy',
    cancellationReason: null,
    cancelledBy: null,
    cancelledAt: null,
    pickTime: '09:30 AM',
    dropTime: '10:30 AM'
  },
  {
    id: 'ORD004',
    serialNo: 4,
    customerId: 'CUST004',
    customerName: 'Priya Singh',
    customerMobile: '9876512345',
    customerEmail: 'priya@example.com',
    orderDate: '2024-01-18',
    orderTime: '11:20 AM',
    vehicleType: '2W',
    pickupLocation: 'Kurla West, Mumbai',
    dropLocation: 'Ghatkopar, Mumbai',
    pickupArea: 'Kurla West',
    dropArea: 'Ghatkopar',
    city: 'Mumbai',
    pickupPincode: '400070',
    dropPincode: '400086',
    amount: 120,
    status: 'Completed',
    driverName: 'Suresh Singh',
    driverMobile: '9000000002',
    paymentMethod: 'Wallet',
    orderType: 'Express',
    cancellationReason: null,
    cancelledBy: null,
    cancelledAt: null,
    pickTime: '11:00 AM',
    dropTime: '12:00 PM'
  },
  {
    id: 'ORD005',
    serialNo: 5,
    customerId: 'CUST005',
    customerName: 'Rohit Sharma',
    customerMobile: '9123456790',
    customerEmail: 'rohit@example.com',
    orderDate: '2024-01-19',
    orderTime: '03:30 PM',
    vehicleType: '3W',
    pickupLocation: 'Thane West, Maharashtra',
    dropLocation: 'Mulund, Mumbai',
    pickupArea: 'Thane West',
    dropArea: 'Mulund',
    city: 'Mumbai',
    pickupPincode: '400601',
    dropPincode: '400081',
    amount: 250,
    status: 'In Progress',
    driverName: 'Rajesh Kumar',
    driverMobile: '9000000004',
    paymentMethod: 'Cash',
    orderType: 'Standard',
    cancellationReason: null,
    cancelledBy: null,
    cancelledAt: null,
    pickTime: '03:00 PM',
    dropTime: '04:00 PM'
  },
  {
    id: 'ORD006',
    serialNo: 6,
    customerId: 'CUST006',
    customerName: 'Suresh Kumar',
    customerMobile: '9988776611',
    customerEmail: 'suresh@example.com',
    orderDate: '2024-01-20',
    orderTime: '08:15 AM',
    vehicleType: 'Truck',
    pickupLocation: 'JNPT, Navi Mumbai',
    dropLocation: 'Pune, Maharashtra',
    pickupArea: 'JNPT',
    dropArea: 'Pune City',
    city: 'Mumbai',
    pickupPincode: '400707',
    dropPincode: '411001',
    amount: 1200,
    status: 'Completed',
    driverName: 'Vikram Malhotra',
    driverMobile: '9000000005',
    paymentMethod: 'Card',
    orderType: 'Heavy',
    cancellationReason: null,
    cancelledBy: null,
    cancelledAt: null,
    pickTime: '08:00 AM',
    dropTime: '09:00 AM'
  },
  {
    id: 'ORD007',
    serialNo: 7,
    customerId: 'CUST007',
    customerName: 'Meera Patel',
    customerMobile: '9876543211',
    customerEmail: 'meera@example.com',
    orderDate: '2024-01-21',
    orderTime: '12:45 PM',
    vehicleType: '2W',
    pickupLocation: 'Vashi, Navi Mumbai',
    dropLocation: 'Belapur, Navi Mumbai',
    pickupArea: 'Vashi',
    dropArea: 'Belapur',
    city: 'Mumbai',
    pickupPincode: '400703',
    dropPincode: '400614',
    amount: 180,
    status: 'Completed',
    driverName: 'Sanjay Gupta',
    driverMobile: '9000000006',
    paymentMethod: 'Wallet',
    orderType: 'Express',
    cancellationReason: null,
    cancelledBy: null,
    cancelledAt: null,
    pickTime: '12:30 PM',
    dropTime: '01:30 PM'
  },
  {
    id: 'ORD008',
    serialNo: 8,
    customerId: 'CUST008',
    customerName: 'Amit Kumar',
    customerMobile: '9123456781',
    customerEmail: 'amit@example.com',
    orderDate: '2024-01-22',
    orderTime: '10:00 AM',
    vehicleType: '3W',
    pickupLocation: 'Taloja, Navi Mumbai',
    dropLocation: 'Kalyan, Maharashtra',
    pickupArea: 'Taloja',
    dropArea: 'Kalyan',
    city: 'Mumbai',
    pickupPincode: '410208',
    dropPincode: '421301',
    amount: 300,
    status: 'Canceled',
    driverName: null,
    driverMobile: null,
    paymentMethod: 'Cash',
    orderType: 'Standard',
    cancellationReason: 'Driver unavailable in the area - no drivers found within 5km radius',
    cancelledBy: 'System',
    cancelledAt: '2024-01-22 10:30 AM',
    pickTime: '09:45 AM',
    dropTime: '10:45 AM'
  },
  {
    id: 'ORD009',
    serialNo: 9,
    customerId: 'CUST009',
    customerName: 'Neha Gupta',
    customerMobile: '9876543212',
    customerEmail: 'neha@example.com',
    orderDate: '2024-01-23',
    orderTime: '11:30 AM',
    vehicleType: '2W',
    pickupLocation: 'Andheri East, Mumbai',
    dropLocation: 'Bandra West, Mumbai',
    pickupArea: 'Andheri East',
    dropArea: 'Bandra West',
    city: 'Mumbai',
    pickupPincode: '400069',
    dropPincode: '400050',
    amount: 180,
    status: 'Canceled',
    driverName: null,
    driverMobile: null,
    paymentMethod: 'Wallet',
    orderType: 'Express',
    cancellationReason: 'Payment failed - insufficient wallet balance',
    cancelledBy: 'System',
    cancelledAt: '2024-01-23 11:35 AM',
    pickTime: '11:15 AM',
    dropTime: '12:15 PM'
  },
  {
    id: 'ORD010',
    serialNo: 10,
    customerId: 'CUST010',
    customerName: 'Rajesh Singh',
    customerMobile: '9123456782',
    customerEmail: 'rajesh@example.com',
    orderDate: '2024-01-24',
    orderTime: '03:45 PM',
    vehicleType: 'Truck',
    pickupLocation: 'Mumbai Port, Mumbai',
    dropLocation: 'Pune, Maharashtra',
    pickupArea: 'Mumbai Port',
    dropArea: 'Pune City',
    city: 'Mumbai',
    pickupPincode: '400001',
    dropPincode: '411001',
    amount: 1500,
    status: 'Canceled',
    driverName: null,
    driverMobile: null,
    paymentMethod: 'Card',
    orderType: 'Heavy',
    cancellationReason: 'Vehicle breakdown - truck maintenance required',
    cancelledBy: 'Driver',
    cancelledAt: '2024-01-24 04:00 PM',
    pickTime: '03:30 PM',
    dropTime: '04:30 PM'
  }
];

const OrderDetails = () => {
  const [orders, setOrders] = useState(dummyOrders);
  const [filteredOrders, setFilteredOrders] = useState(dummyOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [customStartDate, setCustomStartDate] = useState(null);
  const [customEndDate, setCustomEndDate] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  // Filter options
  const filterOptions = [
    { value: 'all', label: 'All Orders' },
    { value: 'today', label: 'Today' },
    { value: 'weekly', label: 'This Week' },
    { value: 'monthly', label: 'This Month' },
    { value: 'custom', label: 'Custom Date' }
  ];

  // Vehicle type icons
  const getVehicleIcon = (type) => {
    switch (type) {
      case '2W': return <BikeIcon />;
      case '3W': return <AutoIcon />;
      case 'Truck': return <TruckIcon />;
      default: return <BikeIcon />;
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'success';
      case 'In Progress': return 'warning';
      case 'Canceled': return 'error';
      case 'Pending': return 'info';
      default: return 'default';
    }
  };

  // Filter orders based on search and date filters
  useEffect(() => {
    let filtered = [...orders];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply date filter
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
    
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    switch (filterType) {
      case 'today':
        filtered = filtered.filter(order => {
          const orderDate = new Date(order.orderDate);
          return orderDate >= startOfDay && orderDate <= endOfDay;
        });
        break;
      case 'weekly':
        filtered = filtered.filter(order => {
          const orderDate = new Date(order.orderDate);
          return orderDate >= startOfWeek;
        });
        break;
      case 'monthly':
        filtered = filtered.filter(order => {
          const orderDate = new Date(order.orderDate);
          return orderDate >= startOfMonth;
        });
        break;
      case 'custom':
        if (customStartDate && customEndDate) {
          filtered = filtered.filter(order => {
            const orderDate = new Date(order.orderDate);
            return orderDate >= customStartDate && orderDate <= customEndDate;
          });
        }
        break;
      default:
        break;
    }

    setFilteredOrders(filtered);
  }, [orders, searchTerm, filterType, customStartDate, customEndDate]);

  // Handle order detail view
  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setDetailDialogOpen(true);
  };

  // Calculate statistics
  const totalOrders = filteredOrders.length;
  const completedOrders = filteredOrders.filter(order => order.status === 'Completed').length;
  const canceledOrders = filteredOrders.filter(order => order.status === 'Canceled').length;
  const totalAmount = filteredOrders.reduce((sum, order) => sum + order.amount, 0);

  return (
    <Box sx={{ p: 3, minHeight: '100vh', bgcolor: 'background.default' }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700, color: 'primary.main' }}>
        Order Details
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'primary.main', color: 'white' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Total Orders
              </Typography>
              <Typography variant="h4">{totalOrders}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'success.main', color: 'white' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Completed
              </Typography>
              <Typography variant="h4">{completedOrders}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'error.main', color: 'white' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Canceled
              </Typography>
              <Typography variant="h4">{canceledOrders}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'warning.main', color: 'white' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Total Amount
              </Typography>
              <Typography variant="h4">₹{totalAmount.toLocaleString()}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search and Filter Section */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search by customer name, ID, or order ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Filter by Date</InputLabel>
              <Select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                label="Filter by Date"
              >
                {filterOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          {filterType === 'custom' && (
            <>
              <Grid item xs={12} md={2}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Start Date"
                    value={customStartDate}
                    onChange={setCustomStartDate}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} md={2}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="End Date"
                    value={customEndDate}
                    onChange={setCustomEndDate}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </LocalizationProvider>
              </Grid>
            </>
          )}
          <Grid item xs={12} md={1}>
            <Button
              variant="outlined"
              startIcon={<FilterIcon />}
              onClick={() => {
                setSearchTerm('');
                setFilterType('all');
                setCustomStartDate(null);
                setCustomEndDate(null);
              }}
            >
              Clear
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Orders Table */}
      <Paper sx={{ overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'primary.main' }}>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>S. No.</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Order ID</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Customer Details</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Date & Time</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Vehicle</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Pickup → Drop</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>City</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Area</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Pincode</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Order Pick Time</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Order Drop Time</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Amount</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders.map((order, index) => (
                <TableRow key={order.id} hover>
                  <TableCell>{order.serialNo}</TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                      {order.id}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {order.customerName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {order.customerId}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                        <PhoneIcon sx={{ fontSize: 12, mr: 0.5, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary">
                          {order.customerMobile}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {new Date(order.orderDate).toLocaleDateString()}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {order.orderTime}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {getVehicleIcon(order.vehicleType)}
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        {order.vehicleType}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ maxWidth: 200 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {order.pickupLocation}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ↓
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {order.dropLocation}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'info.main' }}>
                      {order.city}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>
                        {order.pickupArea}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        to {order.dropArea}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Chip
                        label={order.pickupPincode}
                        color="primary"
                        size="small"
                        variant="outlined"
                        sx={{ fontWeight: 600, fontSize: '0.7rem' }}
                      />
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                        to {order.dropPincode}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {order.pickTime}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {order.dropTime}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                      ₹{order.amount}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={order.status}
                      color={getStatusColor(order.status)}
                      size="small"
                      sx={{ fontWeight: 600 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Tooltip title="View Details">
                      <IconButton
                        color="primary"
                        size="small"
                        onClick={() => handleViewDetails(order)}
                      >
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {filteredOrders.length === 0 && (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Alert severity="info">No orders found matching your criteria.</Alert>
          </Box>
        )}
      </Paper>

      {/* Order Detail Dialog */}
      <Dialog
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <ReceiptIcon sx={{ mr: 1, color: 'primary.main' }} />
            Order Details - {selectedOrder?.id}
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {selectedOrder && (
            <Grid container spacing={3}>
              {/* Order Information */}
              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                  Order Information
                </Typography>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Order ID</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>{selectedOrder.id}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Order Date</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {new Date(selectedOrder.orderDate).toLocaleDateString()} at {selectedOrder.orderTime}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Order Type</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>{selectedOrder.orderType}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Payment Method</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>{selectedOrder.paymentMethod}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Amount</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                      ₹{selectedOrder.amount}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Status</Typography>
                    <Chip
                      label={selectedOrder.status}
                      color={getStatusColor(selectedOrder.status)}
                      sx={{ fontWeight: 600 }}
                    />
                  </Box>
                </Stack>
              </Grid>

              {/* Customer Information */}
              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                  Customer Information
                </Typography>
                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                      {selectedOrder.customerName[0]}
                    </Avatar>
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {selectedOrder.customerName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {selectedOrder.customerId}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2">{selectedOrder.customerMobile}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2">{selectedOrder.customerEmail}</Typography>
                  </Box>
                </Stack>
              </Grid>

              {/* Location Information */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                  Location Details
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                      <Typography variant="subtitle2" color="primary" gutterBottom>
                        Pickup Location
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <LocationIcon sx={{ mr: 1, color: 'success.main' }} />
                        <Typography variant="body2">{selectedOrder.pickupLocation}</Typography>
                      </Box>
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2" color="text.secondary">Order Pick Time</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>{selectedOrder.pickTime}</Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                      <Typography variant="subtitle2" color="primary" gutterBottom>
                        Drop Location
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <LocationIcon sx={{ mr: 1, color: 'error.main' }} />
                        <Typography variant="body2">{selectedOrder.dropLocation}</Typography>
                      </Box>
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2" color="text.secondary">Order Drop Time</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>{selectedOrder.dropTime}</Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>

              {/* Driver Information */}
              {selectedOrder.driverName && (
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                    Driver Information
                  </Typography>
                  <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item>
                        <Avatar sx={{ bgcolor: 'secondary.main' }}>
                          <PersonIcon />
                        </Avatar>
                      </Grid>
                      <Grid item xs>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {selectedOrder.driverName}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                          <PhoneIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {selectedOrder.driverMobile}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {getVehicleIcon(selectedOrder.vehicleType)}
                          <Typography variant="body2" sx={{ ml: 1 }}>
                            {selectedOrder.vehicleType}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              )}

              {/* Cancellation Information */}
              {selectedOrder.status === 'Canceled' && (
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ mb: 2, color: 'error.main' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CancelIcon sx={{ mr: 1 }} />
                      Cancellation Details
                    </Box>
                  </Typography>
                  <Box sx={{ 
                    p: 3, 
                    border: '2px solid', 
                    borderColor: 'error.main', 
                    borderRadius: 2, 
                    bgcolor: 'error.lighter',
                    position: 'relative'
                  }}>
                    <Stack spacing={3}>
                      <Box>
                        <Typography variant="subtitle2" color="error.main" gutterBottom>
                          Cancellation Reason
                        </Typography>
                        <Typography variant="body1" sx={{ 
                          fontWeight: 600, 
                          color: 'error.dark',
                          p: 2,
                          bgcolor: 'background.paper',
                          borderRadius: 1,
                          border: '1px solid',
                          borderColor: 'error.main'
                        }}>
                          {selectedOrder.cancellationReason || 'No reason provided'}
                        </Typography>
                      </Box>
                      
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <Box>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                              Cancelled By
                            </Typography>
                            <Chip
                              label={selectedOrder.cancelledBy || 'Unknown'}
                              color={selectedOrder.cancelledBy === 'Customer' ? 'warning' : 'error'}
                              variant="outlined"
                              sx={{ fontWeight: 600 }}
                            />
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Box>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                              Cancelled At
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {selectedOrder.cancelledAt || 'Time not recorded'}
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                      
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          Order Timeline
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box sx={{ 
                            p: 1, 
                            bgcolor: 'success.main', 
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <CalendarIcon sx={{ color: 'white', fontSize: 16 }} />
                          </Box>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              Order Placed: {new Date(selectedOrder.orderDate).toLocaleDateString()} at {selectedOrder.orderTime}
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                          <Box sx={{ 
                            p: 1, 
                            bgcolor: 'error.main', 
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <CancelIcon sx={{ color: 'white', fontSize: 16 }} />
                          </Box>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: 'error.main' }}>
                              Order Cancelled: {selectedOrder.cancelledAt || 'Time not recorded'}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Stack>
                  </Box>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OrderDetails; 