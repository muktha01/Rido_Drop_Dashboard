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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  CircularProgress,
  Chip
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useAdmins } from '../../hooks/useAdmins';

const roles = ['super_admin', 'admin', 'moderator'];
const statusOptions = ['Active', 'Suspended', 'Pending'];

const initialUser = {
  firstName: '',
  lastName: '',
  email: '',
  mobile: '',
  password: '',
  role: 'admin',
  status: 'Active'
};

const ManageUser = () => {
  const { admins, loading, error, actions } = useAdmins();
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState('add'); // 'add' or 'edit'
  const [form, setForm] = useState(initialUser);
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleDialogOpen = (type, admin = null) => {
    setDialogType(type);
    if (type === 'edit' && admin) {
      setForm({
        firstName: admin.firstName || '',
        lastName: admin.lastName || '',
        email: admin.email || '',
        mobile: admin.mobile || '',
        password: '', // Don't pre-fill password for edit
        role: admin.role || 'admin',
        status: admin.status || 'Active'
      });
      setEditId(admin.id || admin._id);
    } else {
      setForm(initialUser);
      setEditId(null);
    }
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setForm(initialUser);
    setEditId(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (dialogType === 'add') {
        await actions.createAdmin(form);
        setSnackbar({ open: true, message: 'Admin added successfully!', severity: 'success' });
      } else if (dialogType === 'edit') {
        // Don't send password if it's empty for edit
        const updateData = { ...form };
        if (!updateData.password) {
          delete updateData.password;
        }
        await actions.updateAdmin(editId, updateData);
        setSnackbar({ open: true, message: 'Admin updated successfully!', severity: 'success' });
      }
      handleDialogClose();
    } catch (err) {
      setSnackbar({ open: true, message: err.message || 'Operation failed.', severity: 'error' });
    }
  };

  const handleDelete = async () => {
    try {
      await actions.deleteAdmin(deleteId);
      setSnackbar({ open: true, message: 'Admin deleted successfully!', severity: 'info' });
    } catch (err) {
      setSnackbar({ open: true, message: err.message || 'Failed to delete admin.', severity: 'error' });
    }
    setDeleteDialogOpen(false);
    setDeleteId(null);
  };

  return (
    <Box sx={{ maxWidth: 1100, mx: 'auto', mt: 5, p: { xs: 1, md: 3 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" color="primary" sx={{ fontWeight: 700 }}>
          All Users
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleDialogOpen('add')}
          sx={{ borderRadius: 2, fontWeight: 600, px: 3, boxShadow: 'none', textTransform: 'none' }}
        >
          Add User
        </Button>
      </Box>
      <TableContainer sx={{ background: 'none', boxShadow: 'none', borderRadius: 2 }}>
        <Table sx={{ minWidth: 800 }} aria-label="user-table">
          <TableHead>
            <TableRow sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TableCell sx={{ fontWeight: 700, width: 60 }}>#</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Full Name</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Mobile</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Role</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 700, width: 120 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : admins.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ color: 'text.secondary', py: 5, fontSize: 16 }}>
                  No admin users found.
                </TableCell>
              </TableRow>
            ) : (
              admins.map((admin, idx) => (
                <TableRow key={admin._id} hover sx={{ transition: 'background 0.2s', '&:hover': { background: 'rgba(0,0,0,0.03)' } }}>
                  <TableCell>{idx + 1}</TableCell>
                  <TableCell>
                    {admin.firstName} {admin.lastName}
                  </TableCell>
                  <TableCell>{admin.email}</TableCell>
                  <TableCell>{admin.mobile}</TableCell>
                  <TableCell>
                    <Chip
                      label={admin.role}
                      color={admin.role === 'super_admin' ? 'primary' : admin.role === 'admin' ? 'secondary' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip label={admin.status} color={admin.status === 'active' ? 'success' : 'error'} variant="outlined" size="small" />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleDialogOpen('edit', admin)}
                      sx={{ transition: 'color 0.2s', '&:hover': { color: 'secondary.main' } }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => {
                        setDeleteId(admin._id);
                        setDeleteDialogOpen(true);
                      }}
                      sx={{ transition: 'color 0.2s', '&:hover': { color: '#d32f2f' } }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>{dialogType === 'add' ? 'Add User' : 'Edit User'}</DialogTitle>
        <DialogContent sx={{ minWidth: 350 }}>
          <form id="user-form" onSubmit={handleSave}>
            <TextField
              label="Full Name"
              name="fullName"
              value={form.fullName}
              onChange={handleFormChange}
              fullWidth
              required
              sx={{ mb: 2 }}
            />
            <TextField
              label="Email"
              name="email"
              value={form.email}
              onChange={handleFormChange}
              fullWidth
              required
              type="email"
              sx={{ mb: 2 }}
            />
            <TextField
              label="Mobile Number"
              name="mobile"
              value={form.mobile}
              onChange={handleFormChange}
              fullWidth
              required
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth required sx={{ mb: 2 }}>
              <InputLabel>Role</InputLabel>
              <Select name="role" value={form.role} label="Role" onChange={handleFormChange}>
                {roles.map((role) => (
                  <MenuItem key={role} value={role}>
                    {role}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth required sx={{ mb: 2 }}>
              <InputLabel>Status</InputLabel>
              <Select name="status" value={form.status} label="Status" onChange={handleFormChange}>
                {statusOptions.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button
            variant="contained"
            type="submit"
            form="user-form"
            disabled={loading || !form.fullName || !form.email || !form.mobile || !form.role}
          >
            {loading ? <CircularProgress size={22} /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>Are you sure you want to delete this user?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleDelete} disabled={loading}>
            {loading ? <CircularProgress size={22} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ManageUser;
