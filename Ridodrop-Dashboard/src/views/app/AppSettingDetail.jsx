import React, { useState } from 'react';
import {
  Box, Typography, Tabs, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Avatar, Paper
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useParams, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';

const initialData = {
  customer: {
    banners: [
      { name: 'Welcome Banner', image: '' },
    ],
    icons: [
      { name: 'Home Icon', image: '' },
    ],
  },
  partner: {
    banners: [
      { name: 'Partner Banner', image: '' },
    ],
    icons: [
      { name: 'Partner Icon', image: '' },
    ],
  },
};

const appTypeLabel = {
  customer: 'Customer App',
  partner: 'Partner App',
};

export default function AppSettingDetail() {
  const { appType } = useParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState(0); // 0: Banner, 1: Icon, 2: Vehicles (for customer app)
  const [data, setData] = useState(initialData);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editIdx, setEditIdx] = useState(null);
  const [dialogType, setDialogType] = useState('add'); // 'add' or 'edit'
  const [itemType, setItemType] = useState('banners'); // 'banners' or 'icons'
  const [form, setForm] = useState({ name: '', image: '' });

  // Navigate to Vehicle Management when Vehicles tab is selected
  const handleTabChange = (_, newValue) => {
    if (appType === 'customer' && newValue === 2) {
      navigate('/app-setting/customer/vehicles');
    } else {
      setTab(newValue);
    }
  };

  const items = data[appType][tab === 0 ? 'banners' : 'icons'];

  const handleDialogOpen = (type, itemType, idx = null) => {
    setDialogType(type);
    setItemType(itemType);
    setEditIdx(idx);
    if (type === 'edit' && idx !== null) {
      setForm(items[idx]);
    } else {
      setForm({ name: '', image: '' });
    }
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setForm({ name: '', image: '' });
    setEditIdx(null);
  };

  const handleFormChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image' && files && files[0]) {
      setForm((prev) => ({ ...prev, image: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = () => {
    setData((prev) => {
      const updated = { ...prev };
      const arr = [...updated[appType][itemType]];
      if (dialogType === 'add') {
        arr.push(form);
      } else if (dialogType === 'edit' && editIdx !== null) {
        arr[editIdx] = form;
      }
      updated[appType][itemType] = arr;
      return updated;
    });
    handleDialogClose();
  };

  const handleDelete = (idx) => {
    setData((prev) => {
      const updated = { ...prev };
      const arr = [...updated[appType][itemType]];
      arr.splice(idx, 1);
      updated[appType][itemType] = arr;
      return updated;
    });
  };

  return (
    <Box sx={{ width: '100vw', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 5, bgcolor: 'background.default' }}>
      <Box sx={{ alignSelf: 'flex-start', mb: 2, ml: 2 }}>
        <IconButton onClick={() => navigate(-1)} color="primary" size="large">
          <ArrowBackIcon />
        </IconButton>
      </Box>
      <Box sx={{ width: '100%', maxWidth: 900, mx: 'auto', p: { xs: 2, sm: 4 }, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h4" color="primary" sx={{ mb: 1, fontWeight: 700, letterSpacing: 1 }}>
          {appTypeLabel[appType]} Settings
        </Typography>
        <Tabs value={tab} onChange={handleTabChange} sx={{ mb: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Tab label="Banner" sx={{ fontWeight: 600, fontSize: 16 }} />
          <Tab label="Icon" sx={{ fontWeight: 600, fontSize: 16 }} />
          {appType === 'customer' && <Tab label="Vehicles" icon={<DirectionsCarIcon />} iconPosition="start" sx={{ fontWeight: 600, fontSize: 16 }} />}
        </Tabs>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleDialogOpen('add', tab === 0 ? 'banners' : 'icons')}
            sx={{ borderRadius: 2, fontWeight: 600, px: 3, boxShadow: 'none', textTransform: 'none' }}
          >
            {tab === 0 ? 'Upload Banner' : 'Upload Icon'}
          </Button>
        </Box>
        <TableContainer sx={{ background: 'none', boxShadow: 'none', borderRadius: 2 }}>
          <Table sx={{ minWidth: 650 }} aria-label="banner-icon-table">
            <TableHead>
              <TableRow sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TableCell sx={{ fontWeight: 700, width: 80, fontSize: 15 }}>#</TableCell>
                <TableCell sx={{ fontWeight: 700, width: 120, fontSize: 15 }}>Image</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: 15 }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 700, width: 80, fontSize: 15, pr: 0, pl: 2 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ color: 'text.secondary', py: 5, fontSize: 16 }}>
                    No {tab === 0 ? 'banners' : 'icons'} found.
                  </TableCell>
                </TableRow>
              ) : (
                items.map((item, idx) => (
                  <TableRow key={idx} hover sx={{ transition: 'background 0.2s', '&:hover': { background: 'rgba(0,0,0,0.03)' } }}>
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell>
                      <Avatar
                        src={item.image && typeof item.image !== 'string' ? URL.createObjectURL(item.image) : item.image}
                        alt={item.name}
                        sx={{ width: 56, height: 56, bgcolor: 'grey.100', fontSize: 24, border: '1px solid #eee' }}
                      >
                        {item.name[0]}
                      </Avatar>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 500, fontSize: 15, pr: 1 }}>{item.name}</TableCell>
                    <TableCell sx={{ pr: 0, pl: 2 }}>
                      <IconButton color="primary" onClick={() => handleDialogOpen('edit', tab === 0 ? 'banners' : 'icons', idx)} sx={{ transition: 'color 0.2s', '&:hover': { color: 'secondary.main' } }}>
                        <EditIcon />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDelete(idx)} sx={{ transition: 'color 0.2s', '&:hover': { color: '#d32f2f' } }}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>{dialogType === 'add' ? (tab === 0 ? 'Upload Banner' : 'Upload Icon') : (tab === 0 ? 'Edit Banner' : 'Edit Icon')}</DialogTitle>
        <DialogContent sx={{ minWidth: 320 }}>
          <TextField
            label="Name"
            name="name"
            value={form.name}
            onChange={handleFormChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          <Button
            variant="outlined"
            component="label"
            fullWidth
            sx={{ mb: 2 }}
          >
            {form.image ? 'Change Image' : 'Upload Image'}
            <input
              type="file"
              name="image"
              accept="image/*"
              hidden
              onChange={handleFormChange}
            />
          </Button>
          {form.image && (
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Avatar
                src={typeof form.image === 'string' ? form.image : URL.createObjectURL(form.image)}
                alt={form.name}
                sx={{ width: 80, height: 80, mx: 'auto' }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={!form.name || !form.image}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 