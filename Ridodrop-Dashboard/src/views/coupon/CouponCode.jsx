import React, { useState, useCallback, useMemo } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  Snackbar,
  CircularProgress,
  Card,
  CardContent,
  Grid,
  InputAdornment
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useCoupons } from '../../hooks/useCoupons';

const discountTypes = ['Flat Amount', 'Percentage'];
const statusOptions = ['Active', 'Inactive', 'Expired'];
const usageLimitOptions = ['1 per user', '2 per user', '3 per user', 'Unlimited'];
const createdByOptions = ['Admin', 'Marketing', 'Customer Service'];
const applicableForOptions = ['customer', 'driver', 'all'];
const vehicleTypeOptions = ['2W', '3W', 'Truck', 'E-Loader', 'All'];

export default function CouponCode() {
  const { coupons, loading, error, pagination, stats, actions } = useCoupons();

  // Dialog states
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);

  // Filter states
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [discountTypeFilter, setDiscountTypeFilter] = useState('');
  const [createdByFilter, setCreatedByFilter] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    couponCode: '',
    description: '',
    discountType: 'Percentage',
    value: '',
    usageLimit: 'Unlimited',
    usageLimitNumber: '',
    validityStart: dayjs(),
    validityEnd: dayjs().add(30, 'day'),
    createdBy: 'Admin',
    minOrderAmount: '',
    maxDiscountAmount: '',
    applicableFor: ['all'],
    vehicleTypes: ['All'],
    isFirstTimeUser: false
  });

  // Snackbar state
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Handle search with debouncing
  const handleSearch = useCallback(
    (value) => {
      setSearch(value);
      // Debounce search to prevent excessive API calls
      clearTimeout(window.searchTimeout);
      window.searchTimeout = setTimeout(() => {
        actions.searchCoupons(value);
      }, 300);
    },
    [actions]
  );

  // Handle filters
  const handleFilter = useCallback(() => {
    actions.filterCoupons({
      status: statusFilter,
      discountType: discountTypeFilter,
      createdBy: createdByFilter,
      search
    });
  }, [actions, statusFilter, discountTypeFilter, createdByFilter, search]);

  // Clear filters
  const clearFilters = useCallback(() => {
    setSearch('');
    setStatusFilter('');
    setDiscountTypeFilter('');
    setCreatedByFilter('');
    actions.fetchCoupons();
  }, [actions]);

  // Reset form - memoized initial form data
  const initialFormData = useMemo(
    () => ({
      couponCode: '',
      description: '',
      discountType: 'Percentage',
      value: '',
      usageLimit: 'Unlimited',
      usageLimitNumber: '',
      validityStart: dayjs(),
      validityEnd: dayjs().add(30, 'day'),
      createdBy: 'Admin',
      minOrderAmount: '',
      maxDiscountAmount: '',
      applicableFor: ['all'],
      vehicleTypes: ['All'],
      isFirstTimeUser: false
    }),
    []
  );

  const resetForm = useCallback(() => {
    setFormData({ ...initialFormData });
  }, [initialFormData]);

  // Memoized data transformation to avoid recreating on every render
  const transformFormData = useCallback(
    (data) => ({
      ...data,
      couponCode: data.couponCode.toUpperCase(),
      value: parseFloat(data.value),
      usageLimitNumber: data.usageLimit !== 'Unlimited' ? parseInt(data.usageLimit.split(' ')[0]) : null,
      validityStart: data.validityStart.toISOString(),
      validityEnd: data.validityEnd.toISOString(),
      minOrderAmount: data.minOrderAmount ? parseFloat(data.minOrderAmount) : 0,
      maxDiscountAmount: data.maxDiscountAmount ? parseFloat(data.maxDiscountAmount) : null
    }),
    []
  );

  // Handle add coupon - memoized
  const handleAddCoupon = useCallback(async () => {
    try {
      const couponData = transformFormData(formData);
      await actions.createCoupon(couponData);
      setSnackbar({ open: true, message: 'Coupon created successfully', severity: 'success' });
      setAddDialogOpen(false);
      resetForm();
    } catch (err) {
      setSnackbar({ open: true, message: err.message || 'Failed to create coupon', severity: 'error' });
    }
  }, [formData, actions.createCoupon, transformFormData, resetForm]);

  // Handle edit coupon - memoized
  const handleEditCoupon = useCallback(async () => {
    try {
      const couponData = transformFormData(formData);
      await actions.updateCoupon(selectedCoupon._id, couponData);
      setSnackbar({ open: true, message: 'Coupon updated successfully', severity: 'success' });
      setEditDialogOpen(false);
      resetForm();
      setSelectedCoupon(null);
    } catch (err) {
      setSnackbar({ open: true, message: err.message || 'Failed to update coupon', severity: 'error' });
    }
  }, [formData, selectedCoupon?._id, actions.updateCoupon, transformFormData, resetForm]);

  // Handle delete coupon
  const handleDeleteCoupon = async () => {
    try {
      await actions.deleteCoupon(selectedCoupon._id);
      setSnackbar({ open: true, message: 'Coupon deleted successfully', severity: 'success' });
      setDeleteDialogOpen(false);
      setSelectedCoupon(null);
    } catch (err) {
      setSnackbar({ open: true, message: err.message || 'Failed to delete coupon', severity: 'error' });
    }
  };

  // Open edit dialog
  const openEditDialog = (coupon) => {
    setSelectedCoupon(coupon);
    setFormData({
      couponCode: coupon.couponCode,
      description: coupon.description,
      discountType: coupon.discountType,
      value: coupon.value.toString(),
      usageLimit: coupon.usageLimit,
      usageLimitNumber: coupon.usageLimitNumber?.toString() || '',
      validityStart: dayjs(coupon.validityStart),
      validityEnd: dayjs(coupon.validityEnd),
      createdBy: coupon.createdBy,
      minOrderAmount: coupon.minOrderAmount?.toString() || '',
      maxDiscountAmount: coupon.maxDiscountAmount?.toString() || '',
      applicableFor: coupon.applicableFor,
      vehicleTypes: coupon.vehicleTypes,
      isFirstTimeUser: coupon.isFirstTimeUser
    });
    setEditDialogOpen(true);
  };

  // Format date for display
  const formatDate = (date) => {
    return dayjs(date).format('DD MMM YYYY');
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Inactive':
        return 'default';
      case 'Expired':
        return 'error';
      default:
        return 'default';
    }
  };

  // Handle snackbar close
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ width: '100%', minHeight: '100vh', p: { xs: 2, md: 4 }, bgcolor: 'background.default' }}>
        <Typography variant="h4" color="primary" fontWeight={700} gutterBottom sx={{ mb: 4 }}>
          <ConfirmationNumberIcon sx={{ mr: 2, verticalAlign: 'middle' }} />
          Coupon Management
        </Typography>

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="primary">
                  Total Coupons
                </Typography>
                <Typography variant="h4" fontWeight={700}>
                  {stats.total}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="success.main">
                  Active Coupons
                </Typography>
                <Typography variant="h4" fontWeight={700}>
                  {stats.active}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="error.main">
                  Expired Coupons
                </Typography>
                <Typography variant="h4" fontWeight={700}>
                  {stats.expired}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="grey.600">
                  Inactive Coupons
                </Typography>
                <Typography variant="h4" fontWeight={700}>
                  {stats.inactive}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => actions.clearError()}>
            {error}
          </Alert>
        )}

        {/* Search and Filters */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', alignItems: 'center' }}>
          <TextField
            label="Search Coupons"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            size="small"
            sx={{ minWidth: 200 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              )
            }}
          />
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select value={statusFilter} label="Status" onChange={(e) => setStatusFilter(e.target.value)}>
              <MenuItem value="">All</MenuItem>
              {statusOptions.map((opt) => (
                <MenuItem key={opt} value={opt}>
                  {opt}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Discount Type</InputLabel>
            <Select value={discountTypeFilter} label="Discount Type" onChange={(e) => setDiscountTypeFilter(e.target.value)}>
              <MenuItem value="">All</MenuItem>
              {discountTypes.map((opt) => (
                <MenuItem key={opt} value={opt}>
                  {opt}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Created By</InputLabel>
            <Select value={createdByFilter} label="Created By" onChange={(e) => setCreatedByFilter(e.target.value)}>
              <MenuItem value="">All</MenuItem>
              {createdByOptions.map((opt) => (
                <MenuItem key={opt} value={opt}>
                  {opt}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="outlined" onClick={handleFilter}>
            Apply Filters
          </Button>
          <Button variant="outlined" onClick={clearFilters}>
            Clear
          </Button>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setAddDialogOpen(true)} sx={{ ml: 'auto' }}>
            Add Coupon
          </Button>
        </Box>

        {/* Loading State */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Coupons Table */}
        {!loading && (
          <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Coupon Code</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Discount Type</TableCell>
                  <TableCell>Value</TableCell>
                  <TableCell>Usage Limit</TableCell>
                  <TableCell>Used</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Validity</TableCell>
                  <TableCell>Created By</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {coupons.map((coupon) => (
                  <TableRow key={coupon._id}>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600} color="primary">
                        {coupon.couponCode}
                      </Typography>
                    </TableCell>
                    <TableCell>{coupon.description}</TableCell>
                    <TableCell>{coupon.discountType}</TableCell>
                    <TableCell>{coupon.discountType === 'Percentage' ? `${coupon.value}%` : `₹${coupon.value}`}</TableCell>
                    <TableCell>{coupon.usageLimit}</TableCell>
                    <TableCell>{coupon.used}</TableCell>
                    <TableCell>
                      <Chip label={coupon.status} color={getStatusColor(coupon.status)} size="small" />
                    </TableCell>
                    <TableCell>
                      {formatDate(coupon.validityStart)} - {formatDate(coupon.validityEnd)}
                    </TableCell>
                    <TableCell>{coupon.createdBy}</TableCell>
                    <TableCell align="right">
                      <IconButton color="primary" onClick={() => openEditDialog(coupon)} disabled={loading}>
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => {
                          setSelectedCoupon(coupon);
                          setDeleteDialogOpen(true);
                        }}
                        disabled={loading}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {coupons.length === 0 && !loading && (
                  <TableRow>
                    <TableCell colSpan={10} align="center">
                      No coupons found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Pagination can be added here if needed */}

        {/* Add/Edit Coupon Dialog */}
        <Dialog
          open={addDialogOpen || editDialogOpen}
          onClose={() => {
            setAddDialogOpen(false);
            setEditDialogOpen(false);
            resetForm();
          }}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>{editDialogOpen ? 'Edit Coupon' : 'Add New Coupon'}</DialogTitle>
          <DialogContent sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Coupon Code"
                  value={formData.couponCode}
                  onChange={(e) => setFormData({ ...formData, couponCode: e.target.value.toUpperCase() })}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Discount Type</InputLabel>
                  <Select
                    value={formData.discountType}
                    label="Discount Type"
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                  >
                    {discountTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label={`Value ${formData.discountType === 'Percentage' ? '(%)' : '(₹)'}`}
                  type="number"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Usage Limit</InputLabel>
                  <Select
                    value={formData.usageLimit}
                    label="Usage Limit"
                    onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                  >
                    {usageLimitOptions.map((limit) => (
                      <MenuItem key={limit} value={limit}>
                        {limit}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Created By</InputLabel>
                  <Select
                    value={formData.createdBy}
                    label="Created By"
                    onChange={(e) => setFormData({ ...formData, createdBy: e.target.value })}
                  >
                    {createdByOptions.map((creator) => (
                      <MenuItem key={creator} value={creator}>
                        {creator}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Validity Start"
                  value={formData.validityStart}
                  onChange={(date) => setFormData({ ...formData, validityStart: date })}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Validity End"
                  value={formData.validityEnd}
                  onChange={(date) => setFormData({ ...formData, validityEnd: date })}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Min Order Amount (₹)"
                  type="number"
                  value={formData.minOrderAmount}
                  onChange={(e) => setFormData({ ...formData, minOrderAmount: e.target.value })}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Max Discount Amount (₹)"
                  type="number"
                  value={formData.maxDiscountAmount}
                  onChange={(e) => setFormData({ ...formData, maxDiscountAmount: e.target.value })}
                  fullWidth
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setAddDialogOpen(false);
                setEditDialogOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button variant="contained" onClick={editDialogOpen ? handleEditCoupon : handleAddCoupon} disabled={loading}>
              {editDialogOpen ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>Delete Coupon</DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to delete the coupon "{selectedCoupon?.couponCode}"?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="contained" color="error" onClick={handleDeleteCoupon} disabled={loading}>
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </LocalizationProvider>
  );
}
