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
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Avatar,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Chip,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = 'https://ridodrop-backend-24-10-2025.onrender.com/api/v1';

const vehicleTypes = ['2W', '3W', 'Truck', 'E-Loader'];

export default function VehicleManagement() {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentVehicle, setCurrentVehicle] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const [form, setForm] = useState({
    vehicleType: '2W',
    subType: '',
    displayName: '',
    description: '',
    capacity: '',
    features: '',
    image: null,
    isActive: true,
    sortOrder: 0
  });

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/vehicles/all`);
      if (response.data.success) {
        setVehicles(response.data.vehicles);
      }
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      showSnackbar('Error fetching vehicles', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDialogOpen = (vehicle = null) => {
    if (vehicle) {
      setEditMode(true);
      setCurrentVehicle(vehicle);
      setForm({
        vehicleType: vehicle.vehicleType,
        subType: vehicle.subType,
        displayName: vehicle.displayName,
        description: vehicle.description || '',
        capacity: vehicle.capacity || '',
        features: Array.isArray(vehicle.features) ? vehicle.features.join(', ') : '',
        image: null,
        isActive: vehicle.isActive,
        sortOrder: vehicle.sortOrder || 0
      });
    } else {
      setEditMode(false);
      setCurrentVehicle(null);
      setForm({
        vehicleType: '2W',
        subType: '',
        displayName: '',
        description: '',
        capacity: '',
        features: '',
        image: null,
        isActive: true,
        sortOrder: 0
      });
    }
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditMode(false);
    setCurrentVehicle(null);
    setForm({
      vehicleType: '2W',
      subType: '',
      displayName: '',
      description: '',
      capacity: '',
      features: '',
      image: null,
      isActive: true,
      sortOrder: 0
    });
  };

  const handleFormChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image' && files && files[0]) {
      setForm((prev) => ({ ...prev, image: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    try {
      // Validate required fields
      if (!form.vehicleType || !form.subType || !form.displayName) {
        showSnackbar('Please fill all required fields', 'error');
        return;
      }

      if (!editMode && !form.image) {
        showSnackbar('Please upload vehicle image', 'error');
        return;
      }

      const formData = new FormData();
      formData.append('vehicleType', form.vehicleType);
      formData.append('subType', form.subType);
      formData.append('displayName', form.displayName);
      formData.append('description', form.description);
      formData.append('capacity', form.capacity);
      formData.append('isActive', form.isActive);
      formData.append('sortOrder', form.sortOrder);

      // Parse features
      const featuresArray = form.features
        .split(',')
        .map((f) => f.trim())
        .filter((f) => f);
      formData.append('features', JSON.stringify(featuresArray));

      if (form.image) {
        formData.append('image', form.image);
      }

      // Get token from Cookies (matching the login flow)
      const tokenData = Cookies.get('Token');
      const token = tokenData ? JSON.parse(tokenData) : null;

      if (!token) {
        showSnackbar('You are not logged in. Please login again.', 'error');
        navigate('/admin/login');
        return;
      }

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      };

      let response;
      if (editMode) {
        response = await axios.put(`${API_URL}/vehicles/${currentVehicle._id}`, formData, config);
      } else {
        response = await axios.post(`${API_URL}/vehicles`, formData, config);
      }

      if (response.data.success) {
        showSnackbar(editMode ? 'Vehicle updated successfully' : 'Vehicle created successfully', 'success');
        handleDialogClose();
        fetchVehicles();
      }
    } catch (error) {
      console.error('Error saving vehicle:', error);
      showSnackbar(error.response?.data?.error || 'Error saving vehicle', 'error');
    }
  };

  const handleDelete = async (vehicleId) => {
    if (!window.confirm('Are you sure you want to delete this vehicle?')) {
      return;
    }

    try {
      // Get token from Cookies (matching the login flow)
      const tokenData = Cookies.get('Token');
      const token = tokenData ? JSON.parse(tokenData) : null;

      if (!token) {
        showSnackbar('You are not logged in. Please login again.', 'error');
        navigate('/admin/login');
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await axios.delete(`${API_URL}/vehicles/${vehicleId}`, config);

      if (response.data.success) {
        showSnackbar('Vehicle deleted successfully', 'success');
        fetchVehicles();
      }
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      showSnackbar(error.response?.data?.error || 'Error deleting vehicle', 'error');
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column', mt: 5, px: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate(-1)} color="primary" size="large">
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" color="primary" sx={{ ml: 2, fontWeight: 700 }}>
          Vehicle Management
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleDialogOpen()}
          sx={{ borderRadius: 2, fontWeight: 600, px: 3, textTransform: 'none' }}
        >
          Add Vehicle
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer sx={{ borderRadius: 2, boxShadow: 2, bgcolor: 'white' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.100' }}>
                <TableCell sx={{ fontWeight: 700 }}>#</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Image</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Vehicle Type</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Sub Type</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Display Name</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Capacity</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {vehicles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 5 }}>
                    <Typography color="text.secondary">No vehicles found. Add your first vehicle!</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                vehicles.map((vehicle, idx) => (
                  <TableRow key={vehicle._id} hover>
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell>
                      <Avatar src={vehicle.imageUrl} alt={vehicle.displayName} sx={{ width: 64, height: 64 }} variant="rounded" />
                    </TableCell>
                    <TableCell>
                      <Chip label={vehicle.vehicleType} color="primary" size="small" />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 500 }}>{vehicle.subType}</TableCell>
                    <TableCell>{vehicle.displayName}</TableCell>
                    <TableCell>{vehicle.capacity || '-'}</TableCell>
                    <TableCell>
                      <Chip
                        label={vehicle.isActive ? 'Active' : 'Inactive'}
                        color={vehicle.isActive ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton color="primary" onClick={() => handleDialogOpen(vehicle)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDelete(vehicle._id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editMode ? 'Edit Vehicle' : 'Add Vehicle'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Vehicle Type *</InputLabel>
              <Select name="vehicleType" value={form.vehicleType} onChange={handleFormChange} label="Vehicle Type *">
                {vehicleTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField label="Sub Type *" name="subType" value={form.subType} onChange={handleFormChange} fullWidth />

            <TextField
              label="Display Name *"
              name="displayName"
              value={form.displayName}
              onChange={handleFormChange}
              fullWidth
              placeholder="e.g., 2 Wheeler - Bike"
            />

            <TextField
              label="Description"
              name="description"
              value={form.description}
              onChange={handleFormChange}
              fullWidth
              multiline
              rows={2}
              placeholder="Brief description of the vehicle"
            />

            <TextField
              label="Capacity"
              name="capacity"
              value={form.capacity}
              onChange={handleFormChange}
              fullWidth
              placeholder="e.g., 2 passengers, 500 kg"
            />

            <TextField
              label="Features (comma separated)"
              name="features"
              value={form.features}
              onChange={handleFormChange}
              fullWidth
              placeholder="e.g., AC, GPS Tracking, Spacious"
            />

            <TextField label="Sort Order" name="sortOrder" type="number" value={form.sortOrder} onChange={handleFormChange} fullWidth />

            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select name="isActive" value={form.isActive} onChange={handleFormChange} label="Status">
                <MenuItem value={true}>Active</MenuItem>
                <MenuItem value={false}>Inactive</MenuItem>
              </Select>
            </FormControl>

            <Button variant="outlined" component="label" fullWidth>
              {form.image ? 'Change Image' : editMode ? 'Upload New Image (Optional)' : 'Upload Image *'}
              <input type="file" name="image" accept="image/*" hidden onChange={handleFormChange} />
            </Button>

            {form.image && (
              <Box sx={{ textAlign: 'center' }}>
                <Avatar
                  src={URL.createObjectURL(form.image)}
                  alt="Preview"
                  sx={{ width: 120, height: 120, mx: 'auto' }}
                  variant="rounded"
                />
              </Box>
            )}

            {editMode && !form.image && currentVehicle?.imageUrl && (
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary">
                  Current Image:
                </Typography>
                <Avatar src={currentVehicle.imageUrl} alt="Current" sx={{ width: 120, height: 120, mx: 'auto', mt: 1 }} variant="rounded" />
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            {editMode ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
