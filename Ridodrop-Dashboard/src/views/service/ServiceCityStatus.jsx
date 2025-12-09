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
  Switch,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import { useParams } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import { useServices } from '../../hooks/useServices';

export default function ServiceCityStatus() {
  const { vehicleType, subType } = useParams();
  const navigate = useNavigate();

  // Use services hook with filters for current vehicle type and subtype
  const { services, loading, error, actions } = useServices({
    vehicleType,
    subType
  });

  // Local state for dialogs
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [newCity, setNewCity] = useState('');
  const [editService, setEditService] = useState(null);
  const [editCityName, setEditCityName] = useState('');
  const [deleteService, setDeleteService] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Fetch services when component mounts or params change
  useEffect(() => {
    actions.filterServices({ vehicleType, subType });
  }, [vehicleType, subType]);

  const handleToggle = async (service) => {
    try {
      await actions.toggleServiceStatus(service._id);
      setSnackbar({ open: true, message: `Service ${service.isActive ? 'deactivated' : 'activated'} successfully`, severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: err.message || 'Failed to toggle service', severity: 'error' });
    }
  };

  const handleAddCity = async () => {
    if (!newCity.trim()) {
      setSnackbar({ open: true, message: 'Please enter a city name', severity: 'error' });
      return;
    }

    // Check if city already exists for this vehicle type and subtype
    const existingService = services.find((s) => s.city.toLowerCase() === newCity.toLowerCase());
    if (existingService) {
      setSnackbar({ open: true, message: 'Service already exists for this city', severity: 'error' });
      return;
    }

    try {
      await actions.createService({
        vehicleType,
        subType,
        city: newCity.trim(),
        isActive: false
      });

      setSnackbar({ open: true, message: 'City added successfully', severity: 'success' });
      setNewCity('');
      setAddDialogOpen(false);
    } catch (err) {
      setSnackbar({ open: true, message: err.message || 'Failed to add city', severity: 'error' });
    }
  };

  const handleEditCity = async () => {
    if (!editCityName.trim() || !editService) {
      setSnackbar({ open: true, message: 'Please enter a valid city name', severity: 'error' });
      return;
    }

    try {
      await actions.updateService(editService._id, {
        ...editService,
        city: editCityName.trim()
      });

      setSnackbar({ open: true, message: 'City updated successfully', severity: 'success' });
      setEditDialogOpen(false);
      setEditService(null);
      setEditCityName('');
    } catch (err) {
      setSnackbar({ open: true, message: err.message || 'Failed to update city', severity: 'error' });
    }
  };

  const handleDeleteCity = async () => {
    if (!deleteService) return;

    try {
      await actions.deleteService(deleteService._id);
      setSnackbar({ open: true, message: 'City deleted successfully', severity: 'success' });
      setDeleteDialogOpen(false);
      setDeleteService(null);
    } catch (err) {
      setSnackbar({ open: true, message: err.message || 'Failed to delete city', severity: 'error' });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box
      sx={{ width: '100%', minHeight: '100vh', mt: 6, p: { xs: 2, md: 4 }, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <Box sx={{ alignSelf: 'flex-start', mb: 2 }}>
        <IconButton onClick={() => navigate(-1)} color="primary" size="large">
          <ArrowBackIcon />
        </IconButton>
      </Box>

      <Typography variant="h4" color="primary" fontWeight={700} gutterBottom>
        {subType} Service Status by City ({vehicleType})
      </Typography>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3, width: '100%', maxWidth: 900 }} onClose={() => actions.clearError()}>
          {error}
        </Alert>
      )}

      {/* Loading State */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      <Button
        variant="contained"
        startIcon={<AddIcon />}
        sx={{ mb: 3, alignSelf: 'flex-end' }}
        onClick={() => setAddDialogOpen(true)}
        disabled={loading}
      >
        Add City
      </Button>

      <Box sx={{ width: '100%', maxWidth: 900, overflowX: 'auto', p: 0, borderRadius: 2, border: '1px solid #eee', background: 'none' }}>
        <Table sx={{ minWidth: 600, background: 'none', '& th, & td': { border: 'none' }, '& tbody tr:hover': { background: '#f5f7fa' } }}>
          <TableHead>
            <TableRow>
              <TableCell>City</TableCell>
              <TableCell align="center">Active</TableCell>
              <TableCell align="center">Service Hours</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {services.map((service) => (
              <TableRow key={service._id}>
                <TableCell>{service.city}</TableCell>
                <TableCell align="center">
                  <Switch checked={service.isActive} onChange={() => handleToggle(service)} color="primary" disabled={loading} />
                </TableCell>
                <TableCell align="center">
                  {service.startTime === '00:00' && service.endTime === '23:59'
                    ? '24/7'
                    : service.startTime && service.endTime
                      ? `${service.startTime} - ${service.endTime}`
                      : 'Not Set'}
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    color="primary"
                    onClick={() => {
                      setEditDialogOpen(true);
                      setEditService(service);
                      setEditCityName(service.city);
                    }}
                    disabled={loading}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => {
                      setDeleteDialogOpen(true);
                      setDeleteService(service);
                    }}
                    disabled={loading}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {services.length === 0 && !loading && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No cities found for {vehicleType} - {subType} service.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Box>

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
      {/* Add City Dialog */}
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)}>
        <DialogTitle>Add City</DialogTitle>
        <DialogContent sx={{ minWidth: 350, pt: 2 }}>
          <TextField label="City Name" value={newCity} onChange={(e) => setNewCity(e.target.value)} fullWidth sx={{ mt: 1 }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddCity} disabled={!newCity.trim() || loading}>
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit City Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit City</DialogTitle>
        <DialogContent sx={{ minWidth: 350, pt: 2 }}>
          <TextField label="City Name" value={editCityName} onChange={(e) => setEditCityName(e.target.value)} fullWidth sx={{ mt: 1 }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleEditCity} disabled={!editCityName.trim() || loading}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete City Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete City</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete service for <strong>{deleteService?.city}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleDeleteCity} disabled={loading}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
