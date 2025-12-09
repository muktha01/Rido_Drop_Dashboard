import React, { useState, useEffect } from 'react';
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
  Chip,
  TextField,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  CircularProgress,
  Alert,
  Pagination,
  Stack
} from '@mui/material';
import { useParams } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useDrivers } from '../../hooks/useDrivers';

const initialVehicles = [
  {
    regNo: 'MH12AB1234',
    partnerName: 'Rahul Sharma',
    partnerMobile: '9876543210',
    joiningDate: '2023-01-15',
    city: 'Pune',
    status: 'Active'
  },
  {
    regNo: 'MH14XY5678',
    partnerName: 'Priya Singh',
    partnerMobile: '9123456789',
    joiningDate: '2022-11-10',
    city: 'Mumbai',
    status: 'Inactive'
  }
];

const statusOptions = ['Active', 'Inactive'];

// Map frontend vehicle types to backend values
const vehicleTypeMap = {
  '2W': { backendTypes: ['2wheeler', 'bike'], isFuelType: false },
  '3W': { backendTypes: ['3wheeler', 'auto'], isFuelType: true },
  Truck: { backendTypes: ['truck', 'pickup'], isFuelType: true },
  'E-Loader': { backendTypes: ['e-loader'], isFuelType: false }
};

// Map fuel type names to database values (exact case match)
const fuelTypeMap = {
  Petrol: 'Petrol',
  petrol: 'Petrol',
  Diesel: 'Diesel',
  diesel: 'Diesel',
  Electric: 'Electric',
  electric: 'Electric',
  CNG: 'CNG',
  cng: 'CNG'
};

// Map vehicle subtypes to backend values (case-insensitive)
const vehicleSubTypeMap = {
  Bike: 'bike',
  bike: 'bike',
  Scooter: 'scooter',
  scooter: 'scooter',
  'Electric Bike': 'electric-bike',
  'electric-bike': 'electric-bike',
  'E-Loader': 'e-loader',
  'e-loader': 'e-loader'
};

export default function VehicleList() {
  const { vehicleType, subType, truckType } = useParams();

  console.log('🚗 VehicleList - URL Params - vehicleType:', vehicleType, 'subType:', subType, 'truckType:', truckType);

  // Get vehicle type configuration
  const vehicleConfig = vehicleTypeMap[vehicleType];
  const isFuelTypeFilter = vehicleConfig?.isFuelType || false;

  // Determine what to filter by based on the vehicle type
  let apiFilters = {};

  if (isFuelTypeFilter) {
    // For 3W and Truck, subType is the fuel type
    const fuelType = fuelTypeMap[subType] || subType?.toLowerCase();
    // Use the main vehicle type (first in array)
    const mainVehicleType = vehicleConfig?.backendTypes?.[0];

    if (mainVehicleType) {
      apiFilters.vehicleType = mainVehicleType;
    }

    // Add fuel type filter to API
    apiFilters.fuelType = fuelType;

    // If it's a truck and truckType is provided, add that filter
    if (vehicleType === 'Truck' && truckType) {
      apiFilters.truckSize = truckType;
      console.log('🚚 Filtering by Truck Type:', mainVehicleType, 'Fuel:', fuelType, 'Size:', truckType);
    } else {
      console.log('🔥 Filtering by Vehicle Type:', mainVehicleType, 'and Fuel Type:', fuelType);
    }
  } else {
    // For 2W, subType is the vehicle variant (Bike, Scooter, etc.)
    // Database has vehicleType: "2wheeler" and vehicleSubType: "Bike"
    const mainVehicleType = vehicleConfig?.backendTypes?.[0];

    if (mainVehicleType) {
      apiFilters.vehicleType = mainVehicleType;
    }

    // Add vehicleSubType filter for 2W
    apiFilters.vehicleSubType = subType; // Use the subType directly (Bike, Scooter, Electric Bike)
    console.log('🚲 Filtering by Vehicle Type:', mainVehicleType, 'and SubType:', subType);
  }

  console.log('🔍 API Filters:', apiFilters);

  // Use drivers hook with filters
  const { drivers, loading, error, pagination, actions } = useDrivers(apiFilters);

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterCity, setFilterCity] = useState('');
  const [filterPeriod, setFilterPeriod] = useState('');
  const [customStart, setCustomStart] = useState(null);
  const [customEnd, setCustomEnd] = useState(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editIdx, setEditIdx] = useState(null);
  const [form, setForm] = useState({ regNo: '', partnerName: '', partnerMobile: '', joiningDate: '', city: '', status: 'Active' });

  console.log('📋 Drivers received:', drivers.length, 'drivers');
  console.log('🔧 Loading:', loading, 'Error:', error);

  // Log first driver to see data structure
  if (drivers.length > 0) {
    console.log('👤 First driver sample:', {
      name: drivers[0].fullName || drivers[0].name,
      vehicleType: drivers[0].vehicleType,
      fuelType: drivers[0].fueltype || drivers[0].fuelType,
      regNo: drivers[0].vehicleregisterNumber
    });
    console.log('🔍 Full first driver object:', drivers[0]);
  } else {
    console.warn('⚠️ No drivers found with filters:', apiFilters);
  }

  // Convert drivers to vehicle format for display
  const vehicles = drivers.map((driver) => ({
    regNo: driver.vehicleregisterNumber || driver.vehicleNumber || 'N/A',
    partnerName: driver.fullName || driver.name || 'Unknown',
    partnerMobile: driver.altMobile || driver.phone || 'N/A',
    joiningDate: driver.createdAt || driver.createdDate || new Date().toISOString(),
    city: driver.selectCity || driver.city || 'N/A',
    status: driver.status === 'Blocked' || driver.isBlocked === 'true' ? 'Inactive' : 'Active',
    vehicleType: driver.vehicleType,
    fuelType: (driver.fueltype || driver.fuelType || 'N/A').toLowerCase(),
    truckSize: driver.truckSize || 'N/A',
    driverId: driver.id || driver._id
  }));

  console.log('🚗 Vehicles mapped:', vehicles);
  console.log('✅ Backend filtering applied - showing', vehicles.length, 'vehicles');

  // Date filter logic
  const now = dayjs();
  let filteredByDate = vehicles;
  if (filterPeriod === 'Weekly') {
    filteredByDate = vehicles.filter((v) => dayjs(v.joiningDate).isAfter(now.subtract(7, 'day')));
  } else if (filterPeriod === 'Monthly') {
    filteredByDate = vehicles.filter((v) => dayjs(v.joiningDate).isAfter(now.subtract(1, 'month')));
  } else if (filterPeriod === 'Yearly') {
    filteredByDate = vehicles.filter((v) => dayjs(v.joiningDate).isAfter(now.subtract(1, 'year')));
  } else if (filterPeriod === 'Custom' && customStart && customEnd) {
    filteredByDate = vehicles.filter((v) => {
      const d = dayjs(v.joiningDate);
      return d.isAfter(dayjs(customStart).subtract(1, 'day')) && d.isBefore(dayjs(customEnd).add(1, 'day'));
    });
  }

  // Filtered and searched vehicles
  const filteredVehicles = filteredByDate.filter((v) => {
    const matchesSearch =
      v.regNo.toLowerCase().includes(search.toLowerCase()) ||
      v.partnerName.toLowerCase().includes(search.toLowerCase()) ||
      v.partnerMobile.includes(search) ||
      v.city.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus ? v.status === filterStatus : true;
    const matchesCity = filterCity ? v.city.toLowerCase() === filterCity.toLowerCase() : true;
    return matchesSearch && matchesStatus && matchesCity;
  });

  console.log('🎯 Final filtered vehicles to display:', filteredVehicles.length, filteredVehicles);

  // Add new vehicle (placeholder - not connected to API yet)
  const handleAdd = () => {
    // TODO: Connect to API to add vehicle
    setAddDialogOpen(false);
    setForm({ regNo: '', partnerName: '', partnerMobile: '', joiningDate: '', city: '', status: 'Active' });
  };

  // Edit vehicle (placeholder - not connected to API yet)
  const handleEditOpen = (idx) => {
    setEditIdx(idx);
    setForm(filteredVehicles[idx]);
    setEditDialogOpen(true);
  };
  const handleEditSave = () => {
    // TODO: Connect to API to update vehicle
    setEditDialogOpen(false);
    setEditIdx(null);
    setForm({ regNo: '', partnerName: '', partnerMobile: '', joiningDate: '', city: '', status: 'Active' });
  };

  // Delete vehicle (placeholder - not connected to API yet)
  const handleDelete = (idx) => {
    // TODO: Connect to API to delete vehicle
    console.log('Delete vehicle at index:', idx);
  };

  return (
    <Box sx={{ width: '100vw', minHeight: '100vh', bgcolor: 'background.default', p: { xs: 2, md: 6 }, boxSizing: 'border-box' }}>
      <Typography variant="h3" color="primary" gutterBottom sx={{ fontWeight: 700, mb: 4 }}>
        {vehicleType} - {subType} Vehicles List
      </Typography>

      {/* Loading State */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress />
        </Box>
      )}

      {/* Error State */}
      {error && !loading && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Content */}
      {!loading && !error && (
        <>
          {/* Search and Filter */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', alignItems: 'center' }}>
            <TextField label="Search" value={search} onChange={(e) => setSearch(e.target.value)} size="small" sx={{ minWidth: 180 }} />
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Status</InputLabel>
              <Select value={filterStatus} label="Status" onChange={(e) => setFilterStatus(e.target.value)}>
                <MenuItem value="">All</MenuItem>
                {statusOptions.map((opt) => (
                  <MenuItem key={opt} value={opt}>
                    {opt}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="City"
              value={filterCity}
              onChange={(e) => setFilterCity(e.target.value)}
              size="small"
              sx={{ minWidth: 120 }}
            />
            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel>Period</InputLabel>
              <Select value={filterPeriod} label="Period" onChange={(e) => setFilterPeriod(e.target.value)}>
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Weekly">Weekly</MenuItem>
                <MenuItem value="Monthly">Monthly</MenuItem>
                <MenuItem value="Yearly">Yearly</MenuItem>
                <MenuItem value="Custom">Custom</MenuItem>
              </Select>
            </FormControl>
            {filterPeriod === 'Custom' && (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Start Date"
                  value={customStart}
                  onChange={setCustomStart}
                  slotProps={{ textField: { size: 'small', sx: { minWidth: 120 } } }}
                />
                <DatePicker
                  label="End Date"
                  value={customEnd}
                  onChange={setCustomEnd}
                  slotProps={{ textField: { size: 'small', sx: { minWidth: 120 } } }}
                />
              </LocalizationProvider>
            )}
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => setAddDialogOpen(true)} sx={{ ml: 'auto' }}>
              Add Vehicle
            </Button>
          </Box>
          <Box
            sx={{
              width: '100%',
              overflowX: 'auto',
              bgcolor: 'background.paper',
              borderRadius: 3,
              boxShadow: 2,
              maxWidth: '100vw',
              mx: 'auto',
              p: 0
            }}
          >
            <Table sx={{ minWidth: 900 }}>
              <TableHead>
                <TableRow>
                  <TableCell>S. No.</TableCell>
                  <TableCell>Vehicle Registration No.</TableCell>
                  <TableCell>Partner Name</TableCell>
                  <TableCell>Partner Mobile Number</TableCell>
                  <TableCell>Joining Date</TableCell>
                  <TableCell>City</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredVehicles.map((v, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{(pagination.page - 1) * pagination.limit + idx + 1}</TableCell>
                    <TableCell>
                      {/* Vehicle Registration Number displayed as plain text (non-clickable) per request */}
                      <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                        {v.regNo}
                      </Typography>
                    </TableCell>
                    <TableCell>{v.partnerName}</TableCell>
                    <TableCell>{v.partnerMobile}</TableCell>
                    <TableCell>{v.joiningDate}</TableCell>
                    <TableCell>{v.city}</TableCell>
                    <TableCell>
                      <Chip label={v.status} color={v.status === 'Active' ? 'success' : 'default'} />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton color="primary" onClick={() => handleEditOpen(idx)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDelete(idx)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredVehicles.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      No vehicles found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Box>
          {/* Pagination: use server pagination info if available */}
          {pagination.total > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Showing {(pagination.page - 1) * pagination.limit + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)}{' '}
                of {pagination.total} vehicles
              </Typography>
              <Stack spacing={2}>
                <Pagination
                  count={pagination.pages}
                  page={pagination.page}
                  onChange={(e, value) => actions.changePage(value)}
                  color="primary"
                  showFirstButton
                  showLastButton
                />
              </Stack>
            </Box>
          )}
          {/* Add Dialog */}
          <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)}>
            <DialogTitle>Add Vehicle</DialogTitle>
            <DialogContent sx={{ minWidth: 350 }}>
              <TextField
                label="Vehicle Registration No."
                value={form.regNo}
                onChange={(e) => setForm({ ...form, regNo: e.target.value })}
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                label="Partner Name"
                value={form.partnerName}
                onChange={(e) => setForm({ ...form, partnerName: e.target.value })}
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                label="Partner Mobile Number"
                value={form.partnerMobile}
                onChange={(e) => setForm({ ...form, partnerMobile: e.target.value })}
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                label="Joining Date"
                type="date"
                value={form.joiningDate}
                onChange={(e) => setForm({ ...form, joiningDate: e.target.value })}
                fullWidth
                sx={{ mb: 2 }}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="City"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                fullWidth
                sx={{ mb: 2 }}
              />
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Status</InputLabel>
                <Select value={form.status} label="Status" onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  {statusOptions.map((opt) => (
                    <MenuItem key={opt} value={opt}>
                      {opt}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
              <Button variant="contained" onClick={handleAdd}>
                Add
              </Button>
            </DialogActions>
          </Dialog>
          {/* Edit Dialog */}
          <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
            <DialogTitle>Edit Vehicle</DialogTitle>
            <DialogContent sx={{ minWidth: 350 }}>
              <TextField
                label="Vehicle Registration No."
                value={form.regNo}
                onChange={(e) => setForm({ ...form, regNo: e.target.value })}
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                label="Partner Name"
                value={form.partnerName}
                onChange={(e) => setForm({ ...form, partnerName: e.target.value })}
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                label="Partner Mobile Number"
                value={form.partnerMobile}
                onChange={(e) => setForm({ ...form, partnerMobile: e.target.value })}
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                label="Joining Date"
                type="date"
                value={form.joiningDate}
                onChange={(e) => setForm({ ...form, joiningDate: e.target.value })}
                fullWidth
                sx={{ mb: 2 }}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="City"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                fullWidth
                sx={{ mb: 2 }}
              />
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Status</InputLabel>
                <Select value={form.status} label="Status" onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  {statusOptions.map((opt) => (
                    <MenuItem key={opt} value={opt}>
                      {opt}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
              <Button variant="contained" onClick={handleEditSave}>
                Save
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </Box>
  );
}
