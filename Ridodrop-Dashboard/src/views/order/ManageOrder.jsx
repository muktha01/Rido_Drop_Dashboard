import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  Alert,
  Checkbox,
  Switch,
  FormControlLabel,
  Badge,
  LinearProgress,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  CircularProgress,
  Pagination
} from '@mui/material';
import OrderLiveTracking from './OrderLiveTracking';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Today as TodayIcon,
  DateRange as DateRangeIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Phone as PhoneIcon,
  Close as CloseIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  DirectionsBike as BikeIcon,
  AirportShuttle as AutoIcon,
  LocalShipping as TruckIcon,
  CalendarToday as CalendarIcon,
  Receipt as ReceiptIcon,
  Person as PersonIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Pending as PendingIcon,
  PlayArrow as PlayIcon,
  Stop as StopIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Print as PrintIcon,
  MoreVert as MoreVertIcon,
  Assignment as AssignmentIcon,
  TrendingUp as TrendingUpIcon,
  MyLocation as MyLocationIcon,
  Warning as WarningIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useBookings } from '../../hooks/useBookings';

// Real API integration - using useBookings hook for data

const ManageOrder = () => {
  // Helper function to safely display values
  const safeDisplay = (value, fallback = 'N/A') => {
    if (value === null || value === undefined) return fallback;
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return value.toString();
    if (typeof value === 'object') {
      console.warn('⚠️ Attempting to render object as string:', value);
      // If it's an object with a name property, extract it
      if (value.name && typeof value.name === 'string') return value.name;
      // If it's an object with firstName, extract it
      if (value.firstName && typeof value.firstName === 'string') return value.firstName;
      return fallback;
    }
    return String(value);
  };

  // Helper function to get customer ID (matching ManageCustomer format)
  const getCustomerId = (order) => {
    // First check if customerId exists and starts with 'CUST' (formatted ID)
    if (order?.customerId && typeof order.customerId === 'string' && order.customerId.startsWith('CUST')) {
      return order.customerId;
    }

    // Check the raw customer data if available
    if (order?._raw?.customer?.customerId && order._raw.customer.customerId.startsWith('CUST')) {
      return order._raw.customer.customerId;
    }

    if (order?._raw?.userId?.customerId && order._raw.userId.customerId.startsWith('CUST')) {
      return order._raw.userId.customerId;
    }

    // Fallback to any customerId available
    if (order?.customerId) return order.customerId;
    if (order?._raw?.customer?.customerId) return order._raw.customer.customerId;
    if (order?._raw?.userId?.customerId) return order._raw.userId.customerId;

    // Last resort: use MongoDB _id
    if (order?._raw?.customer?._id) return order._raw.customer._id;
    if (order?._raw?.userId?._id) return order._raw.userId._id;

    return 'N/A';
  };

  // Helper function to get driver ID (matching format)
  const getDriverId = (order) => {
    // First check if driverId exists and starts with 'DRV' or 'RDR' (formatted ID)
    if (order?.driverId && typeof order.driverId === 'string' && (order.driverId.startsWith('DRV') || order.driverId.startsWith('RDR'))) {
      return order.driverId;
    }

    // Check the raw rider data if available
    if (order?._raw?.rider?.riderId && (order._raw.rider.riderId.startsWith('DRV') || order._raw.rider.riderId.startsWith('RDR'))) {
      return order._raw.rider.riderId;
    }

    // Fallback to any driverId available
    if (order?.driverId && order.driverId !== 'N/A') return order.driverId;
    if (order?._raw?.rider?._id) return order._raw.rider._id;

    return 'Not Assigned';
  };

  // Use the custom hook for booking data
  const { bookings, loading, error, stats, pagination, actions } = useBookings();

  // const navigate = useNavigate();
  const location = useLocation();

  // Auto-refresh when returning from assignment with refresh state
  useEffect(() => {
    if (location.state?.refresh) {
      actions.refreshBookings();
      // Clear the state to prevent refresh on every render
      window.history.replaceState({}, document.title);
    }
  }, [location.state, actions]);

  // Set status filter from navigation state (e.g., from dashboard)
  useEffect(() => {
    if (location.state?.statusFilter) {
      setStatusFilter(location.state.statusFilter);
      // Clear the state after setting the filter
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [vehicleFilter, setVehicleFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all'); // New: Date filter (all, today, week, month, custom)
  const [customDate, setCustomDate] = useState(null); // New: Custom date for filtering
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [trackingDialogOpen, setTrackingDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [bulkActionDialogOpen, setBulkActionDialogOpen] = useState(false);
  const [bulkAction, setBulkAction] = useState('');
  const [customStartDate, setCustomStartDate] = useState(null);
  const [customEndDate, setCustomEndDate] = useState(null);

  // Filter options
  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'Pending', label: 'Pending' },
    { value: 'Accepted', label: 'Accepted' },
    { value: 'In Progress', label: 'In Progress' },
    { value: 'Completed', label: 'Completed' },
    { value: 'Cancelled', label: 'Cancelled' }
  ];

  const vehicleOptions = [
    { value: 'all', label: 'All Vehicles' },
    { value: '2W', label: '2 Wheeler' },
    { value: '3W', label: '3 Wheeler' },
    { value: 'Truck', label: 'Truck' }
  ];

  const priorityOptions = [
    { value: 'all', label: 'All Priorities' },
    { value: 'High', label: 'High Priority' },
    { value: 'Medium', label: 'Medium Priority' },
    { value: 'Low', label: 'Low Priority' }
  ];

  // Vehicle type icons
  const getVehicleIcon = (type) => {
    switch (type) {
      case '2W':
        return <BikeIcon />;
      case '3W':
        return <AutoIcon />;
      case 'Truck':
        return <TruckIcon />;
      default:
        return <BikeIcon />;
    }
  };

  // Get status color and icon
  const getStatusInfo = (status) => {
    switch (status) {
      case 'Completed':
        return { color: 'success', icon: <CheckCircleIcon /> };
      case 'In Progress':
        return { color: 'warning', icon: <PlayIcon /> };
      case 'Pending':
        return { color: 'info', icon: <PendingIcon /> };
      case 'Canceled':
        return { color: 'error', icon: <CancelIcon /> };
      default:
        return { color: 'default', icon: <InfoIcon /> };
    }
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'error';
      case 'Medium':
        return 'warning';
      case 'Low':
        return 'success';
      default:
        return 'default';
    }
  };

  // Apply filters by fetching from backend
  useEffect(() => {
    const filters = {};

    // Add search filter (search by customer name, rider name, mobile numbers)
    if (searchTerm) {
      filters.search = searchTerm;
    }

    // Add status filter
    if (statusFilter !== 'all') {
      filters.status = statusFilter.toLowerCase().replace(' ', '_');
    }

    // Add vehicle filter
    if (vehicleFilter !== 'all') {
      filters.vehicleType = vehicleFilter;
    }

    // Add date filter - calculate start and end dates based on filter type
    if (dateFilter !== 'all') {
      const now = new Date();
      let startDate, endDate;

      if (dateFilter === 'today') {
        // Today: from start of today to now
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
      } else if (dateFilter === 'week') {
        // Last 7 days
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        endDate = now;
      } else if (dateFilter === 'month') {
        // Current month
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
      } else if (dateFilter === 'custom' && customDate) {
        // Custom date
        const customDateObj = new Date(customDate);
        startDate = new Date(customDateObj.getFullYear(), customDateObj.getMonth(), customDateObj.getDate());
        endDate = new Date(customDateObj.getFullYear(), customDateObj.getMonth(), customDateObj.getDate(), 23, 59, 59);
      }

      if (startDate && endDate) {
        filters.startDate = startDate.toISOString();
        filters.endDate = endDate.toISOString();
      }
    }

    // Fetch with filters from backend (resets to page 1)
    actions.filterBookings(filters);
  }, [searchTerm, statusFilter, vehicleFilter, dateFilter, customDate, actions]);

  // Update filteredOrders when bookings change
  useEffect(() => {
    setFilteredOrders(bookings);
  }, [bookings]);

  // Handle order selection
  const handleOrderSelect = (orderId) => {
    setSelectedOrders((prev) => (prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]));
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(filteredOrders.map((order) => order.id));
    }
  };

  // Handle bulk actions
  const handleBulkAction = async () => {
    if (bulkAction && selectedOrders.length > 0) {
      try {
        // Update each selected order
        await Promise.all(
          selectedOrders.map((orderId) => actions.updateBookingStatus(orderId, bulkAction.toLowerCase().replace(' ', '_')))
        );

        setSelectedOrders([]);
        setBulkActionDialogOpen(false);
        setBulkAction('');
      } catch (error) {
        console.error('Bulk action failed:', error);
        // Error is handled by the hook
      }
    }
  };

  // Handle order detail view
  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setDetailDialogOpen(true);
  };

  // Handle live tracking
  const handleTrackOrder = (order) => {
    setSelectedOrder(order);
    setTrackingDialogOpen(true);
  };

  // Handle order edit
  const handleEditOrder = (order) => {
    setSelectedOrder(order);
    setEditDialogOpen(true);
  };

  // Calculate statistics from filtered data
  // Use pagination.total for accurate count across all pages
  const totalOrders = pagination.total || filteredOrders.length;
  const pendingOrders = filteredOrders.filter((order) => order.status === 'Pending').length;
  const inProgressOrders = filteredOrders.filter((order) => order.status === 'In Progress').length;
  const completedOrders = filteredOrders.filter((order) => order.status === 'Completed').length;
  const canceledOrders = filteredOrders.filter((order) => order.status === 'Cancelled').length;
  const totalAmount = filteredOrders.reduce((sum, order) => sum + (order.amount || 0), 0);

  const navigate = useNavigate();

  // Navigate to manual assignment page
  const handleManualAssign = (order) => {
    if (!order?.id) return;
    navigate(`/dashboard/orders/assign/${order.id}`);
  };

  return (
    <Box sx={{ p: 3, minHeight: '100vh', bgcolor: 'background.default' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
          Manage Orders
        </Typography>
        <Button variant="outlined" startIcon={<RefreshIcon />} onClick={() => actions.refreshBookings()} disabled={loading}>
          Refresh
        </Button>
      </Box>

      {/* Loading indicator */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Error alert */}
      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
          action={
            <IconButton color="inherit" size="small" onClick={() => actions.clearError()} aria-label="dismiss error">
              <CloseIcon />
            </IconButton>
          }
        >
          {error}
        </Alert>
      )}

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <Card
            sx={{
              bgcolor: 'primary.main',
              color: 'white',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 6
              }
            }}
            onClick={() => {
              setStatusFilter('all');
              actions.changePage(1);
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Total Orders
              </Typography>
              <Typography variant="h4">{totalOrders}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <Card
            sx={{
              bgcolor: 'info.main',
              color: 'white',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 6
              }
            }}
            onClick={() => {
              setStatusFilter('Pending');
              actions.changePage(1);
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Pending
              </Typography>
              <Typography variant="h4">{pendingOrders}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <Card
            sx={{
              bgcolor: 'warning.main',
              color: 'white',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 6
              }
            }}
            onClick={() => {
              setStatusFilter('In Progress');
              actions.changePage(1);
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom>
                In Progress
              </Typography>
              <Typography variant="h4">{inProgressOrders}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <Card
            sx={{
              bgcolor: 'success.main',
              color: 'white',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 6
              }
            }}
            onClick={() => {
              setStatusFilter('Completed');
              actions.changePage(1);
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Completed
              </Typography>
              <Typography variant="h4">{completedOrders}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <Card
            sx={{
              bgcolor: 'error.main',
              color: 'white',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 6
              }
            }}
            onClick={() => {
              setStatusFilter('Cancelled');
              actions.changePage(1);
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Canceled
              </Typography>
              <Typography variant="h4">{canceledOrders}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <Card
            sx={{
              bgcolor: 'secondary.main',
              color: 'white',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 6
              }
            }}
            onClick={() => {
              setStatusFilter('all');
              actions.changePage(1);
            }}
          >
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
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              placeholder="Search by Customer Name, Rider Name, or Mobile Number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} label="Status">
                {statusOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Vehicle</InputLabel>
              <Select value={vehicleFilter} onChange={(e) => setVehicleFilter(e.target.value)} label="Vehicle">
                {vehicleOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} label="Priority">
                {priorityOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 2 }}>
            <Button
              variant="outlined"
              startIcon={<FilterIcon />}
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setVehicleFilter('all');
                setPriorityFilter('all');
                setDateFilter('all');
                setCustomDate(null);
                setCustomStartDate(null);
                setCustomEndDate(null);
              }}
              fullWidth
            >
              Clear
            </Button>
          </Grid>
        </Grid>

        {/* Date Filter Buttons */}
        <Box sx={{ mt: 2 }}>
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
            <Button
              variant={dateFilter === 'all' ? 'contained' : 'outlined'}
              size="small"
              onClick={() => {
                setDateFilter('all');
                setCustomDate(null);
              }}
            >
              All
            </Button>
            <Button
              variant={dateFilter === 'today' ? 'contained' : 'outlined'}
              size="small"
              startIcon={<TodayIcon />}
              onClick={() => {
                setDateFilter('today');
                setCustomDate(null);
              }}
            >
              Today
            </Button>
            <Button
              variant={dateFilter === 'week' ? 'contained' : 'outlined'}
              size="small"
              startIcon={<DateRangeIcon />}
              onClick={() => {
                setDateFilter('week');
                setCustomDate(null);
              }}
            >
              Weekly
            </Button>
            <Button
              variant={dateFilter === 'month' ? 'contained' : 'outlined'}
              size="small"
              startIcon={<CalendarIcon />}
              onClick={() => {
                setDateFilter('month');
                setCustomDate(null);
              }}
            >
              Monthly
            </Button>
            <Button
              variant={dateFilter === 'custom' ? 'contained' : 'outlined'}
              size="small"
              startIcon={<CalendarIcon />}
              onClick={() => setDateFilter('custom')}
            >
              Custom Date
            </Button>
            {dateFilter === 'custom' && (
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Select Date"
                  value={customDate}
                  onChange={(newValue) => setCustomDate(newValue)}
                  slotProps={{
                    textField: {
                      size: 'small',
                      sx: { width: 200 }
                    }
                  }}
                />
              </LocalizationProvider>
            )}
          </Stack>
        </Box>
      </Paper>

      {/* Orders Table */}
      <Paper sx={{ overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'primary.main' }}>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>
                  <Checkbox
                    checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                    indeterminate={selectedOrders.length > 0 && selectedOrders.length < filteredOrders.length}
                    onChange={handleSelectAll}
                    sx={{ color: 'white' }}
                  />
                </TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>S. No.</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Order ID</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Customer</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Driver</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Assign</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Date & Time</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Vehicle</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Amount</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Priority</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders.map((order, index) => {
                const statusInfo = getStatusInfo(order.status);
                return (
                  <TableRow key={order.id} hover>
                    <TableCell>
                      <Checkbox checked={selectedOrders.includes(order.id)} onChange={() => handleOrderSelect(order.id)} />
                    </TableCell>
                    <TableCell>{order.serialNo}</TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color: 'primary.main',
                          cursor: 'pointer',
                          '&:hover': {
                            textDecoration: 'underline',
                            color: 'primary.dark'
                          }
                        }}
                        onClick={() => handleTrackOrder(order)}
                      >
                        📍 {order.id}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {safeDisplay(order.customerName, 'Unknown Customer')}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 500 }}>
                          ID: {getCustomerId(order)}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                          <PhoneIcon sx={{ fontSize: 12, mr: 0.5, color: 'text.secondary' }} />
                          <Typography variant="caption" color="text.secondary">
                            {safeDisplay(order.customerMobile)}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {order.driverName && order.driverName !== 'Unknown User' ? (
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {safeDisplay(order.driverName, 'Unknown Driver')}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'secondary.main', fontWeight: 500 }}>
                            ID: {getDriverId(order)}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                            <PhoneIcon sx={{ fontSize: 12, mr: 0.5, color: 'text.secondary' }} />
                            <Typography variant="caption" color="text.secondary">
                              {safeDisplay(order.driverMobile)}
                            </Typography>
                          </Box>
                        </Box>
                      ) : (
                        <Chip label="Not Assigned" size="small" color="warning" />
                      )}
                    </TableCell>
                    <TableCell>
                      {!order.driverName || order.driverName === 'Unknown User' ? (
                        <Button
                          variant="contained"
                          size="small"
                          color="primary"
                          onClick={() => handleManualAssign(order)}
                          startIcon={<AssignmentIcon />}
                        >
                          Assign
                        </Button>
                      ) : (
                        <Tooltip title="Reassign Driver">
                          <Button
                            variant="outlined"
                            size="small"
                            color="secondary"
                            onClick={() => handleManualAssign(order)}
                            startIcon={<AssignmentIcon />}
                          >
                            Change
                          </Button>
                        </Tooltip>
                      )}
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : 'N/A'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {safeDisplay(order.orderTime)}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {getVehicleIcon(order.vehicleType)}
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          {safeDisplay(order.vehicleType)}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                        ₹{safeDisplay(order.amount, '0')}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={statusInfo.icon}
                        label={safeDisplay(order.status)}
                        color={statusInfo.color}
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={safeDisplay(order.priority)}
                        color={getPriorityColor(order.priority)}
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Tooltip title="Track Live Location">
                          <IconButton color="success" size="small" onClick={() => handleTrackOrder(order)}>
                            <MyLocationIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="View Details">
                          <IconButton color="primary" size="small" onClick={() => handleViewDetails(order)}>
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit Order">
                          <IconButton color="secondary" size="small" onClick={() => handleEditOrder(order)}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="More Actions">
                          <IconButton color="default" size="small">
                            <MoreVertIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        {pagination.total > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3, px: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Showing {(pagination.page - 1) * pagination.limit + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
              {pagination.total} orders
            </Typography>
            <Stack spacing={2}>
              <Pagination
                count={pagination.pages}
                page={pagination.page}
                onChange={(event, value) => actions.changePage(value)}
                color="primary"
                showFirstButton
                showLastButton
              />
            </Stack>
          </Box>
        )}

        {filteredOrders.length === 0 && (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Alert severity="info">No orders found matching your criteria.</Alert>
          </Box>
        )}
      </Paper>

      {/* Speed Dial for Actions */}
      <SpeedDial ariaLabel="Order actions" sx={{ position: 'fixed', bottom: 16, right: 16 }} icon={<SpeedDialIcon />}>
        <SpeedDialAction icon={<RefreshIcon />} tooltipTitle="Refresh Orders" onClick={() => actions.refreshBookings()} />
      </SpeedDial>

      {/* Bulk Action Dialog */}
      <Dialog open={bulkActionDialogOpen} onClose={() => setBulkActionDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Bulk Action</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Selected {selectedOrders.length} order(s)
          </Typography>
          <FormControl fullWidth>
            <InputLabel>Action</InputLabel>
            <Select value={bulkAction} onChange={(e) => setBulkAction(e.target.value)} label="Action">
              <MenuItem value="Pending">Mark as Pending</MenuItem>
              <MenuItem value="Accepted">Mark as Accepted</MenuItem>
              <MenuItem value="In Progress">Mark as In Progress</MenuItem>
              <MenuItem value="Completed">Mark as Completed</MenuItem>
              <MenuItem value="Cancelled">Mark as Cancelled</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBulkActionDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleBulkAction} variant="contained" disabled={!bulkAction}>
            Apply
          </Button>
        </DialogActions>
      </Dialog>

      {/* Order Detail Dialog */}
      <Dialog open={detailDialogOpen} onClose={() => setDetailDialogOpen(false)} maxWidth="md" fullWidth>
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
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                  Order Information
                </Typography>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Order ID
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {selectedOrder.id}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Order Date
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {new Date(selectedOrder.orderDate).toLocaleDateString()} at {selectedOrder.orderTime}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Order Type
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {selectedOrder.orderType}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Payment Method
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {selectedOrder.paymentMethod}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Amount
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                      ₹{selectedOrder.amount}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Status
                    </Typography>
                    <Chip
                      label={selectedOrder.status}
                      color={getStatusInfo(selectedOrder.status).color}
                      icon={getStatusInfo(selectedOrder.status).icon}
                      sx={{ fontWeight: 600 }}
                    />
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Priority
                    </Typography>
                    <Chip label={selectedOrder.priority} color={getPriorityColor(selectedOrder.priority)} sx={{ fontWeight: 600 }} />
                  </Box>
                </Stack>
              </Grid>

              {/* Customer Information */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                  Customer Information
                </Typography>
                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>{(selectedOrder.customerName || 'U')[0]}</Avatar>
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {selectedOrder.customerName || 'Unknown Customer'}
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
              <Grid size={{ xs: 12 }}>
                <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                  Location Details
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                      <Typography variant="subtitle2" color="primary" gutterBottom>
                        Pickup Location
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <LocationIcon sx={{ mr: 1, color: 'success.main' }} />
                        <Typography variant="body2">{selectedOrder.pickupLocation}</Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                      <Typography variant="subtitle2" color="primary" gutterBottom>
                        Drop Location
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <LocationIcon sx={{ mr: 1, color: 'error.main' }} />
                        <Typography variant="body2">{selectedOrder.dropLocation}</Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>

              {/* Driver Information */}
              {selectedOrder.driverName && (
                <Grid size={{ xs: 12 }}>
                  <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                    Driver Information
                  </Typography>
                  <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid>
                        <Avatar sx={{ bgcolor: 'secondary.main' }}>
                          <PersonIcon />
                        </Avatar>
                      </Grid>
                      <Grid size="grow">
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {selectedOrder.driverName || 'Unknown Driver'}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                          <PhoneIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {selectedOrder.driverMobile}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid>
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

              {/* Timeline Information */}
              <Grid size={{ xs: 12 }}>
                <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                  Order Timeline
                </Typography>
                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CalendarIcon sx={{ mr: 2, color: 'primary.main' }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Order Created
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {new Date(selectedOrder.orderDate).toLocaleDateString()} at {selectedOrder.orderTime}
                      </Typography>
                    </Box>
                  </Box>
                  {selectedOrder.assignedAt && (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <AssignmentIcon sx={{ mr: 2, color: 'warning.main' }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Assigned to Driver
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {selectedOrder.assignedAt}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                  {selectedOrder.completedAt && (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CheckCircleIcon sx={{ mr: 2, color: 'success.main' }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Completed
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {selectedOrder.completedAt}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </Stack>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleTrackOrder(selectedOrder)} startIcon={<MyLocationIcon />} variant="contained" color="primary">
            Track Order
          </Button>
          <Button onClick={() => setDetailDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Live Tracking Dialog */}
      <Dialog
        open={trackingDialogOpen}
        onClose={() => setTrackingDialogOpen(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: 'hidden'
          }
        }}
      >
        {selectedOrder && <OrderLiveTracking order={selectedOrder} onClose={() => setTrackingDialogOpen(false)} />}
      </Dialog>
    </Box>
  );
};

export default ManageOrder;
