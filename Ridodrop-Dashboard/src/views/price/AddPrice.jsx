import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import { useParams } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { usePrices } from '../../hooks/usePrices';

const timeSlots = ['9 AM - 12 PM', '12 PM - 4 PM', '4 PM - 8 PM', '8 PM - 12 AM', '12 AM - 9 AM'];

export default function AddPrice() {
  const { vehicleType, subType } = useParams();
  const [km, setKm] = useState('');
  const [rate, setRate] = useState('');
  const [time, setTime] = useState('');
  const [editIdx, setEditIdx] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editData, setEditData] = useState({ km: '', rate: '', time: '', id: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Use the prices hook with filters for current vehicle type and subtype
  const { prices, loading, error, actions } = usePrices({
    vehicleType,
    subType
  });

  // Fetch prices when component mounts or params change
  useEffect(() => {
    actions.filterPrices({ vehicleType, subType });
  }, [vehicleType, subType]);

  const handleSave = async () => {
    if (!km || !rate) {
      setSnackbar({ open: true, message: 'Please enter KM Range and Rate', severity: 'error' });
      return;
    }

    try {
      const payload = {
        vehicleType,
        subType,
        kmRange: km,
        rate: parseFloat(rate)
      };
      if (time) payload.timeSlot = time;

      await actions.createPrice(payload);

      setSnackbar({ open: true, message: 'Price added successfully', severity: 'success' });
      setKm('');
      setRate('');
      setTime('');
    } catch (err) {
      setSnackbar({ open: true, message: err.message || 'Failed to add price', severity: 'error' });
    }
  };

  const handleDelete = async (priceId) => {
    try {
      await actions.deletePrice(priceId);
      setSnackbar({ open: true, message: 'Price deleted successfully', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: err.message || 'Failed to delete price', severity: 'error' });
    }
  };

  const handleEditOpen = (price, idx) => {
    setEditIdx(idx);
    setEditData({
      km: price.kmRange,
      rate: price.rate.toString(),
      time: price.timeSlot,
      id: price._id
    });
    setEditDialogOpen(true);
  };

  const handleEditSave = async () => {
    try {
      const updatePayload = {
        vehicleType,
        subType,
        kmRange: editData.km,
        rate: parseFloat(editData.rate)
      };
      if (editData.time) updatePayload.timeSlot = editData.time;

      await actions.updatePrice(editData.id, updatePayload);

      setSnackbar({ open: true, message: 'Price updated successfully', severity: 'success' });
      setEditDialogOpen(false);
      setEditIdx(null);
    } catch (err) {
      setSnackbar({ open: true, message: err.message || 'Failed to update price', severity: 'error' });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ width: '100vw', minHeight: '100vh', bgcolor: 'background.default', p: { xs: 2, md: 6 }, boxSizing: 'border-box' }}>
      <Typography variant="h3" color="primary" gutterBottom sx={{ fontWeight: 700, mb: 4 }}>
        Add Price - {vehicleType} / {subType}
      </Typography>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => actions.clearError()}>
          {error}
        </Alert>
      )}

      {/* Loading State */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4, mb: 4 }}>
        <Box sx={{ flex: 1, minWidth: 260 }}>
          <TextField label="KM Range (e.g. 1-5)" value={km} onChange={(e) => setKm(e.target.value)} fullWidth sx={{ mb: 3 }} required />
          <TextField
            label="Rate (Rs)"
            type="number"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            fullWidth
            sx={{ mb: 3 }}
            required
          />
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel id="time-slot-label">Time</InputLabel>
            <Select labelId="time-slot-label" value={time} label="Time" onChange={(e) => setTime(e.target.value)}>
              {timeSlots.map((slot) => (
                <MenuItem key={slot} value={slot}>
                  {slot}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box sx={{ textAlign: 'right' }}>
            <Button variant="contained" color="primary" size="large" onClick={handleSave} disabled={loading}>
              Save
            </Button>
          </Box>
        </Box>
        <Box sx={{ flex: 2 }}>
          <TableContainer sx={{ borderRadius: 3, boxShadow: 2, bgcolor: 'background.paper' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>KM Range</TableCell>
                  <TableCell>Rate (Rs)</TableCell>
                  <TableCell>Time Slot</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {prices.map((entry, idx) => (
                  <TableRow key={entry._id}>
                    <TableCell>{entry.kmRange}</TableCell>
                    <TableCell>₹{entry.rate}</TableCell>
                    <TableCell>{entry.timeSlot || 'Not specified'}</TableCell>
                    <TableCell align="right">
                      <IconButton color="primary" onClick={() => handleEditOpen(entry, idx)} disabled={loading}>
                        <EditIcon />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDelete(entry._id)} disabled={loading}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {prices.length === 0 && !loading && (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No price entries yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
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
      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit Price Entry</DialogTitle>
        <DialogContent sx={{ minWidth: 350, pt: 2 }}>
          <TextField
            label="KM Range"
            value={editData.km}
            onChange={(e) => setEditData({ ...editData, km: e.target.value })}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Rate (Rs)"
            type="number"
            value={editData.rate}
            onChange={(e) => setEditData({ ...editData, rate: e.target.value })}
            fullWidth
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="edit-time-slot-label">Time</InputLabel>
            <Select
              labelId="edit-time-slot-label"
              value={editData.time}
              label="Time"
              onChange={(e) => setEditData({ ...editData, time: e.target.value })}
            >
              {timeSlots.map((slot) => (
                <MenuItem key={slot} value={slot}>
                  {slot}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleEditSave} disabled={loading}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
