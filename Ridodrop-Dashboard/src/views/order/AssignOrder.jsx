import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  Tooltip,
  Alert,
  Snackbar,
  FormControlLabel,
  Switch,
  Pagination,
  Stack
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  Refresh as RefreshIcon,
  ArrowBack as ArrowBackIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { useDrivers } from '../../hooks/useDrivers';
import bookingApi from '../../api/bookingApi';

// Manual assignment page: lists drivers and lets admin assign selected driver to order
const AssignOrder = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const {
    drivers,
    loading,
    error,
    pagination,
    actions: { refreshDrivers, searchDrivers, changePage }
  } = useDrivers();

  const [search, setSearch] = useState('');
  const [assigningDriverId, setAssigningDriverId] = useState(null);
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });
  const [showOnlyApproved, setShowOnlyApproved] = useState(true);

  useEffect(() => {
    if (search.trim() === '') return; // Debounced search could be added
  }, [search]);

  const filteredDrivers = useMemo(() => {
    let result = drivers;

    // Filter by approved/active status
    if (showOnlyApproved) {
      result = result.filter((d) => d.status === 'Approved' || d.status === 'Active');
    }

    // Filter by search term
    if (search) {
      const term = search.toLowerCase();
      result = result.filter(
        (d) =>
          (d.fullName || '').toLowerCase().includes(term) ||
          (d.driverId || '').toLowerCase().includes(term) ||
          (d.altMobile || '').includes(term)
      );
    }

    return result;
  }, [drivers, search, showOnlyApproved]);

  const handleAssign = async (driver) => {
    if (!orderId || !driver?.id) {
      console.error('❌ Missing orderId or driver.id:', { orderId, driverId: driver?.id });
      setSnack({ open: true, message: 'Invalid order or driver ID', severity: 'error' });
      return;
    }

    if (!window.confirm(`Assign order ${orderId} to ${driver.fullName || driver.driverId}?`)) return;

    try {
      setAssigningDriverId(driver.id);
      console.log('🚀 Starting assignment...', { orderId, driverId: driver.id, driverName: driver.fullName });

      const result = await bookingApi.assignDriver(orderId, driver.id);

      console.log('✅ Assignment completed:', result);

      // Show success message
      setSnack({
        open: true,
        message: `Successfully assigned to ${driver.fullName || 'driver'}! Redirecting...`,
        severity: 'success'
      });

      // Navigate back after delay
      setTimeout(() => {
        console.log('🔄 Navigating to manage-orders...');
        navigate('/dashboard/manage-orders', { state: { refresh: true } });
      }, 1000);
    } catch (e) {
      console.error('❌ Assignment error:', e);
      setAssigningDriverId(null); // Reset on error
      const errorMsg = e.message || 'Failed to assign driver. Please check console for details.';
      setSnack({ open: true, message: errorMsg, severity: 'error' });
    }
  };

  return (
    <Box sx={{ p: 3, position: 'relative' }}>
      {/* Loading Overlay */}
      {assigningDriverId && (
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
          <Paper sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <CircularProgress size={60} />
            <Typography variant="h6">Assigning driver...</Typography>
            <Typography variant="body2" color="text.secondary">
              Please wait
            </Typography>
          </Paper>
        </Box>
      )}

      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
        <IconButton onClick={() => navigate(-1)} color="primary">
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
          Assign Driver
        </Typography>
        <Chip color="info" label={`Order ID: ${orderId}`} />
        <Box sx={{ flexGrow: 1 }} />
        <Button variant="outlined" startIcon={<RefreshIcon />} onClick={() => refreshDrivers()} disabled={loading}>
          Refresh Drivers
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            fullWidth
            placeholder="Search drivers by name, ID or mobile..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              if (e.target.value.trim() === '') return; // avoid empty fetch
              searchDrivers(e.target.value);
            }}
            InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} /> }}
          />
          <FormControlLabel
            control={<Switch checked={showOnlyApproved} onChange={(e) => setShowOnlyApproved(e.target.checked)} />}
            label="Only Approved"
          />
        </Box>
      </Paper>

      <Paper>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: 'primary.main' }}>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>#</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Driver ID</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Name</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Mobile</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>City</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Online</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <CircularProgress size={28} />
                  </TableCell>
                </TableRow>
              )}
              {!loading && filteredDrivers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <Typography variant="body2" color="text.secondary">
                      No drivers found.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
              {!loading &&
                filteredDrivers.map((driver, idx) => (
                  <TableRow
                    key={driver.id}
                    hover
                    onClick={() => driver.status !== 'Blocked' && handleAssign(driver)}
                    sx={{ cursor: driver.status !== 'Blocked' ? 'pointer' : 'not-allowed' }}
                  >
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                        {driver.driverId}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Tooltip title={driver.status === 'Blocked' ? 'Driver is blocked' : 'Click to assign this driver'}>
                        <span style={{ fontWeight: 600 }}>{driver.fullName || 'Unknown Driver'}</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell>{driver.altMobile || 'N/A'}</TableCell>
                    <TableCell>{driver.city || 'N/A'}</TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={driver.status}
                        color={driver.status === 'Blocked' ? 'error' : driver.status === 'Approved' ? 'success' : 'default'}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip size="small" label={driver.online ? 'Online' : 'Offline'} color={driver.online ? 'success' : 'default'} />
                    </TableCell>
                    <TableCell>
                      {assigningDriverId === driver.id ? (
                        <Chip label="Assigning..." color="info" size="small" />
                      ) : (
                        <Chip label="Click Row" color="primary" size="small" />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        {pagination.total > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Showing {filteredDrivers.length} of {pagination.total} drivers
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
      </Paper>

      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnack((s) => ({ ...s, open: false }))} severity={snack.severity} sx={{ width: '100%' }}>
          {snack.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AssignOrder;
