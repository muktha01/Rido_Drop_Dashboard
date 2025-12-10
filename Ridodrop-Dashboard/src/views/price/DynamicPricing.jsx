import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  Switch,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Alert,
  Snackbar,
  CircularProgress,
  Chip,
  Divider,
  InputAdornment,
  Paper,
  Tabs,
  Tab
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import AirportShuttleIcon from '@mui/icons-material/AirportShuttle';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import axios from 'axios';

const API_BASE_URL = 'https://ridodrop-backend-24-10-2025.onrender.com/api/v1/dynamic-pricing';

const vehicleIcons = {
  '2W': <DirectionsBikeIcon />,
  '3W': <AirportShuttleIcon />,
  'Mini-Truck': <LocalShippingIcon />,
  'Tempo': <LocalShippingIcon />
};

const DynamicPricing = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [vehiclePricing, setVehiclePricing] = useState([]);
  const [groupedVehicles, setGroupedVehicles] = useState({});
  const [pricingFactors, setPricingFactors] = useState(null);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [editData, setEditData] = useState(null);
  const [editingFactors, setEditingFactors] = useState(false);
  const [editFactorsData, setEditFactorsData] = useState(null);
  const [showAddSubtypeDialog, setShowAddSubtypeDialog] = useState(false);
  const [addSubtypeCategory, setAddSubtypeCategory] = useState('');
  const [newSubtypeData, setNewSubtypeData] = useState(null);
  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState({ open: false, vehicleType: null });
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      console.log('Fetching vehicle pricing and factors...');
      const [vehiclesRes, factorsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/vehicle-pricing`).catch(err => {
          console.error('Vehicle pricing API error:', err.response || err);
          throw err;
        }),
        axios.get(`${API_BASE_URL}/pricing-factors`).catch(err => {
          console.error('Pricing factors API error:', err.response || err);
          throw err;
        })
      ]);
      
      console.log('Vehicle pricing response:', vehiclesRes.data);
      console.log('Pricing factors response:', factorsRes.data);
      
      const vehicles = vehiclesRes.data.data;
      setVehiclePricing(vehicles);
      
      // Group vehicles by category
      const grouped = {};
      vehicles.forEach(vehicle => {
        const category = vehicle.category || vehicle.vehicleType;
        if (!grouped[category]) {
          grouped[category] = [];
        }
        grouped[category].push(vehicle);
      });
      console.log('Grouped vehicles:', grouped);
      setGroupedVehicles(grouped);
      
      setPricingFactors(factorsRes.data.data);
      showSnackbar('Data loaded successfully', 'success');
    } catch (error) {
      console.error('Error fetching data:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Failed to fetch pricing data';
      showSnackbar(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleToggleFactor = async (factorName) => {
    try {
      const currentValue = pricingFactors[factorName]?.enabled;
      const response = await axios.patch(`${API_BASE_URL}/pricing-factors/${factorName}/toggle`, {
        enabled: !currentValue
      });
      setPricingFactors(response.data.data);
      showSnackbar(`${factorName} ${!currentValue ? 'enabled' : 'disabled'} successfully`);
    } catch (error) {
      showSnackbar('Failed to toggle factor', 'error');
    }
  };

  const handleEditVehicle = (vehicle) => {
    setEditingVehicle(vehicle.vehicleType);
    setEditData(JSON.parse(JSON.stringify(vehicle)));
  };

  const handleCancelEdit = () => {
    setEditingVehicle(null);
    setEditData(null);
  };

  const handleSaveVehicle = async () => {
    try {
      await axios.put(`${API_BASE_URL}/vehicle-pricing/${editingVehicle}`, editData);
      showSnackbar('Vehicle pricing updated successfully');
      setEditingVehicle(null);
      setEditData(null);
      fetchData();
    } catch (error) {
      showSnackbar('Failed to update vehicle pricing', 'error');
    }
  };

  const updateEditData = (path, value) => {
    const keys = path.split('.');
    const newData = { ...editData };
    let current = newData;
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    setEditData(newData);
  };

  const updateDistanceSlab = (index, field, value) => {
    const newData = { ...editData };
    newData.distanceSlabs[index][field] = parseFloat(value) || 0;
    setEditData(newData);
  };

  const updateLoadSlab = (index, field, value) => {
    const newData = { ...editData };
    newData.loadCharges.slabs[index][field] = field === 'description' ? value : parseFloat(value) || 0;
    setEditData(newData);
  };

  const handleEditFactors = () => {
    setEditingFactors(true);
    setEditFactorsData(JSON.parse(JSON.stringify(pricingFactors)));
  };

  const handleCancelEditFactors = () => {
    setEditingFactors(false);
    setEditFactorsData(null);
  };

  const handleSaveFactors = async () => {
    try {
      await axios.put(`${API_BASE_URL}/pricing-factors`, editFactorsData);
      showSnackbar('Pricing factors updated successfully');
      setEditingFactors(false);
      setEditFactorsData(null);
      fetchData();
    } catch (error) {
      showSnackbar('Failed to update pricing factors', 'error');
    }
  };

  const updateFactorCondition = (factorName, condition, value) => {
    const newData = { ...editFactorsData };
    newData[factorName].conditions[condition] = parseFloat(value) || 0;
    setEditFactorsData(newData);
  };

  const updateSurgeMultiplier = (level, value) => {
    const newData = { ...editFactorsData };
    newData.surgeFactor.config.multipliers[level] = parseFloat(value) || 1;
    setEditFactorsData(newData);
  };

  const updateSurgeThreshold = (level, value) => {
    const newData = { ...editFactorsData };
    newData.surgeFactor.config.thresholds[level] = parseFloat(value) || 1;
    setEditFactorsData(newData);
  };

  const handleAddSubtype = (category) => {
    setAddSubtypeCategory(category);
    // Get first vehicle in category to copy structure
    const templateVehicle = groupedVehicles[category]?.[0];
    if (templateVehicle) {
      const templateCopy = JSON.parse(JSON.stringify(templateVehicle));
      // Remove fields that should be unique
      delete templateCopy._id;
      delete templateCopy.vehicleType;
      delete templateCopy.createdAt;
      delete templateCopy.updatedAt;
      delete templateCopy.__v;
      
      setNewSubtypeData({
        ...templateCopy,
        category: category,
        subType: '',
        displayName: '',
        vehicleType: '',
        sortOrder: groupedVehicles[category].length + 1,
        isActive: true
      });
    }
    setShowAddSubtypeDialog(true);
  };

  const handleSaveNewSubtype = async () => {
    try {
      // Generate vehicleType from category and subType
      const vehicleType = `${newSubtypeData.category}-${newSubtypeData.subType}`;
      const dataToSave = { ...newSubtypeData, vehicleType };
      
      await axios.post(`${API_BASE_URL}/vehicle-pricing`, dataToSave);
      showSnackbar('New subtype added successfully');
      setShowAddSubtypeDialog(false);
      setNewSubtypeData(null);
      setAddSubtypeCategory('');
      fetchData();
    } catch (error) {
      showSnackbar('Failed to add new subtype', 'error');
    }
  };

  const handleDeleteSubtype = async (vehicleType) => {
    try {
      await axios.delete(`${API_BASE_URL}/vehicle-pricing/${vehicleType}`);
      showSnackbar('Subtype deleted successfully');
      setDeleteConfirmDialog({ open: false, vehicleType: null });
      fetchData();
    } catch (error) {
      showSnackbar('Failed to delete subtype', 'error');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      <Typography variant="h4" color="primary" sx={{ mb: 3, fontWeight: 700 }}>
        Dynamic Pricing Management
      </Typography>

      <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}>
        <Tab label="Vehicle Pricing" />
        <Tab label="Pricing Factors" />
      </Tabs>

      {/* Vehicle Pricing Tab */}
      {activeTab === 0 && (
        <Box>
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2">
              <strong>Grouped by Category:</strong> Each category can have multiple subtypes with different pricing. 
              Pricing factors (weather, traffic, surge) are shared across all vehicles.
            </Typography>
          </Alert>

          {/* Category Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs 
              value={selectedCategory} 
              onChange={(e, newValue) => setSelectedCategory(newValue)}
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab 
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <span>All Categories</span>
                    <Chip label={vehiclePricing.length} size="small" />
                  </Box>
                } 
                value="all"
              />
              {Object.keys(groupedVehicles).map((category) => (
                <Tab 
                  key={category} 
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {vehicleIcons[category] || <DirectionsBikeIcon />}
                      <span>{category}</span>
                      <Chip label={groupedVehicles[category].length} size="small" />
                    </Box>
                  } 
                  value={category}
                />
              ))}
            </Tabs>
          </Box>

          {/* Grouped Vehicle Categories */}
          {Object.entries(groupedVehicles)
            .filter(([category]) => selectedCategory === 'all' || selectedCategory === category)
            .map(([category, vehicles]) => (
            <Box key={category} sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  {vehicleIcons[category] || <DirectionsBikeIcon />}
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {category} Category
                  </Typography>
                  <Chip label={`${vehicles.length} ${vehicles.length === 1 ? 'Subtype' : 'Subtypes'}`} size="small" color="primary" />
                </Box>
                <Button 
                  variant="contained" 
                  color="primary" 
                  startIcon={<AddIcon />}
                  onClick={() => handleAddSubtype(category)}
                  size="small"
                >
                  Add Subtype
                </Button>
              </Box>

              {/* Subtypes Grid */}
              <Grid container spacing={2}>
                {/* Subtypes within category */}
                {vehicles.map((vehicle) => {
                  const isEditing = editingVehicle === vehicle.vehicleType;
                  const data = isEditing ? editData : vehicle;

                  return (
                    <Grid item xs={12} md={6} key={vehicle.vehicleType}>
                      <Card variant="outlined" sx={{ height: '100%', borderLeft: 4, borderLeftColor: 'primary.main' }}>
                        <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                              {vehicle.displayName || vehicle.subType || vehicle.vehicleType}
                            </Typography>
                            <Chip label={vehicle.vehicleType} size="small" variant="outlined" />
                            {isEditing && <Chip label="Editing" color="primary" size="small" />}
                          </Box>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            {!isEditing ? (
                              <>
                                <Button 
                                  startIcon={<EditIcon />} 
                                  variant="contained" 
                                  size="small"
                                  onClick={() => handleEditVehicle(vehicle)}
                                >
                                  Edit
                                </Button>
                                <Button 
                                  startIcon={<DeleteIcon />} 
                                  variant="outlined" 
                                  color="error"
                                  size="small"
                                  onClick={() => setDeleteConfirmDialog({ open: true, vehicleType: vehicle.vehicleType })}
                                >
                                  Delete
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button 
                                  startIcon={<SaveIcon />} 
                                  variant="contained" 
                                  color="success"
                                  size="small"
                                  onClick={handleSaveVehicle}
                                >
                                  Save
                                </Button>
                                <Button 
                                  startIcon={<CancelIcon />} 
                                  variant="outlined" 
                                  color="error"
                                  size="small"
                                  onClick={handleCancelEdit}
                                >
                                  Cancel
                                </Button>
                              </>
                            )}
                          </Box>
                        </Box>

                        {/* Compact Pricing Summary */}
                        <Box sx={{ mt: 2 }}>
                          <Grid container spacing={2}>
                            <Grid item xs={6}>
                              <Typography variant="caption" color="text.secondary">Base Fare</Typography>
                              <Typography variant="body2" fontWeight={600}>₹{data.baseFare.default}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography variant="caption" color="text.secondary">Per Stop Charge</Typography>
                              <Typography variant="body2" fontWeight={600}>₹{data.stopCharges?.perStopCharge || 0}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography variant="caption" color="text.secondary">Platform Fee</Typography>
                              <Typography variant="body2" fontWeight={600}>{data.platformFee.percentage}%</Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography variant="caption" color="text.secondary">Distance Slabs</Typography>
                              <Typography variant="body2" fontWeight={600}>{data.distanceSlabs.length} slabs</Typography>
                            </Grid>
                          </Grid>
                        </Box>

                        {isEditing && (
                          <Box sx={{ mt: 3 }}>
                            <Divider sx={{ mb: 2 }} />
                            <Grid container spacing={3}>
                              {/* Base Fare */}
                    <Grid item xs={12} md={6}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            Base Fare
                          </Typography>
                          <Grid container spacing={2}>
                            <Grid item xs={4}>
                              <TextField
                                label="Min"
                                type="number"
                                value={data.baseFare.min}
                                onChange={(e) => updateEditData('baseFare.min', parseFloat(e.target.value))}
                                disabled={!isEditing}
                                fullWidth
                                size="small"
                                InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                              />
                            </Grid>
                            <Grid item xs={4}>
                              <TextField
                                label="Default"
                                type="number"
                                value={data.baseFare.default}
                                onChange={(e) => updateEditData('baseFare.default', parseFloat(e.target.value))}
                                disabled={!isEditing}
                                fullWidth
                                size="small"
                                InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                              />
                            </Grid>
                            <Grid item xs={4}>
                              <TextField
                                label="Max"
                                type="number"
                                value={data.baseFare.max}
                                onChange={(e) => updateEditData('baseFare.max', parseFloat(e.target.value))}
                                disabled={!isEditing}
                                fullWidth
                                size="small"
                                InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                              />
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    </Grid>

                    {/* Platform Fee & GST */}
                    <Grid item xs={12} md={6}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            Platform Fee & GST
                          </Typography>
                          <Grid container spacing={2}>
                            <Grid item xs={6}>
                              <TextField
                                label="Platform Fee %"
                                type="number"
                                value={data.platformFee.percentage}
                                onChange={(e) => updateEditData('platformFee.percentage', parseFloat(e.target.value))}
                                disabled={!isEditing}
                                fullWidth
                                size="small"
                                InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }}
                              />
                            </Grid>
                            <Grid item xs={6}>
                              <TextField
                                label="GST %"
                                type="number"
                                value={data.gst.percentage}
                                onChange={(e) => updateEditData('gst.percentage', parseFloat(e.target.value))}
                                disabled={!isEditing}
                                fullWidth
                                size="small"
                                InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }}
                              />
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    </Grid>

                    {/* Distance Slabs */}
                    <Grid item xs={12}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            Distance Slabs
                          </Typography>
                          <TableContainer>
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell>Min KM</TableCell>
                                  <TableCell>Max KM</TableCell>
                                  <TableCell>Rate per KM (₹)</TableCell>
                                  <TableCell>Description</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {data.distanceSlabs.map((slab, idx) => (
                                  <TableRow key={idx}>
                                    <TableCell>
                                      <TextField
                                        type="number"
                                        value={slab.minKm}
                                        onChange={(e) => updateDistanceSlab(idx, 'minKm', e.target.value)}
                                        disabled={!isEditing}
                                        size="small"
                                        sx={{ width: 80 }}
                                      />
                                    </TableCell>
                                    <TableCell>
                                      <TextField
                                        type="number"
                                        value={slab.maxKm}
                                        onChange={(e) => updateDistanceSlab(idx, 'maxKm', e.target.value)}
                                        disabled={!isEditing}
                                        size="small"
                                        sx={{ width: 80 }}
                                      />
                                    </TableCell>
                                    <TableCell>
                                      <TextField
                                        type="number"
                                        value={slab.ratePerKm}
                                        onChange={(e) => updateDistanceSlab(idx, 'ratePerKm', e.target.value)}
                                        disabled={!isEditing}
                                        size="small"
                                        sx={{ width: 100 }}
                                      />
                                    </TableCell>
                                    <TableCell>{slab.description}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </CardContent>
                      </Card>
                    </Grid>

                    {/* Waiting Charges */}
                    <Grid item xs={12} md={6}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            Waiting Charges
                          </Typography>
                          <Grid container spacing={2}>
                            <Grid item xs={6}>
                              <TextField
                                label="Free Minutes"
                                type="number"
                                value={data.waitingCharges.freeMinutes}
                                onChange={(e) => updateEditData('waitingCharges.freeMinutes', parseFloat(e.target.value))}
                                disabled={!isEditing}
                                fullWidth
                                size="small"
                              />
                            </Grid>
                            <Grid item xs={6}>
                              <TextField
                                label="Charge per Minute"
                                type="number"
                                value={data.waitingCharges.chargePerMinute}
                                onChange={(e) => updateEditData('waitingCharges.chargePerMinute', parseFloat(e.target.value))}
                                disabled={!isEditing}
                                fullWidth
                                size="small"
                                InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                              />
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    </Grid>

                    {/* Helper Charges */}
                    <Grid item xs={12} md={6}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            Helper Charges
                          </Typography>
                          <Grid container spacing={2}>
                            <Grid item xs={6}>
                              <TextField
                                label="One Helper"
                                type="number"
                                value={data.helperCharges.oneHelper}
                                onChange={(e) => updateEditData('helperCharges.oneHelper', parseFloat(e.target.value))}
                                disabled={!isEditing}
                                fullWidth
                                size="small"
                                InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                              />
                            </Grid>
                            <Grid item xs={6}>
                              <TextField
                                label="Two Helpers"
                                type="number"
                                value={data.helperCharges.twoHelpers}
                                onChange={(e) => updateEditData('helperCharges.twoHelpers', parseFloat(e.target.value))}
                                disabled={!isEditing}
                                fullWidth
                                size="small"
                                InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                              />
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    </Grid>

                    {/* Load Charges */}
                    <Grid item xs={12}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            Load Charges (Weight-based)
                          </Typography>
                          <TableContainer>
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell>Min KG</TableCell>
                                  <TableCell>Max KG</TableCell>
                                  <TableCell>Charge (₹)</TableCell>
                                  <TableCell>Description</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {data.loadCharges.slabs.map((slab, idx) => (
                                  <TableRow key={idx}>
                                    <TableCell>
                                      <TextField
                                        type="number"
                                        value={slab.minKg}
                                        onChange={(e) => updateLoadSlab(idx, 'minKg', e.target.value)}
                                        disabled={!isEditing}
                                        size="small"
                                        sx={{ width: 80 }}
                                      />
                                    </TableCell>
                                    <TableCell>
                                      <TextField
                                        type="number"
                                        value={slab.maxKg}
                                        onChange={(e) => updateLoadSlab(idx, 'maxKg', e.target.value)}
                                        disabled={!isEditing}
                                        size="small"
                                        sx={{ width: 80 }}
                                      />
                                    </TableCell>
                                    <TableCell>
                                      <TextField
                                        type="number"
                                        value={slab.charge}
                                        onChange={(e) => updateLoadSlab(idx, 'charge', e.target.value)}
                                        disabled={!isEditing}
                                        size="small"
                                        sx={{ width: 100 }}
                                      />
                                    </TableCell>
                                    <TableCell>{slab.description}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </CardContent>
                        </Card>
                      </Grid>

                              {/* Stop Charges */}
                              <Grid item xs={12} md={6}>
                                <Card variant="outlined">
                                  <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                      Multi-Drop Stop Charges
                                    </Typography>
                                    <TextField
                                      label="Per Stop Charge"
                                      type="number"
                                      value={data.stopCharges?.perStopCharge || 0}
                                      onChange={(e) => updateEditData('stopCharges.perStopCharge', parseFloat(e.target.value))}
                                      disabled={!isEditing}
                                      fullWidth
                                      size="small"
                                      InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                                      helperText="Charge for each additional drop location"
                                    />
                                  </CardContent>
                                </Card>
                              </Grid>
                            </Grid>
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        ))}
      </Box>
    )}

      {/* Pricing Factors Tab */}
      {activeTab === 1 && pricingFactors && (
        <Box>
          <Alert severity="warning" sx={{ mb: 3 }}>
            <Typography variant="body2">
              <strong>⚠️ Shared Across All Vehicles:</strong> These pricing factors (weather, traffic, surge) apply equally to ALL vehicle types and subtypes. 
              Changes here will affect pricing calculations for 2W-Bike, 2W-Scooter, 3W-Auto, and all other vehicles.
            </Typography>
          </Alert>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3, gap: 1 }}>
            {!editingFactors ? (
              <Button startIcon={<EditIcon />} variant="contained" onClick={handleEditFactors}>
                Edit Percentages
              </Button>
            ) : (
              <>
                <Button startIcon={<SaveIcon />} variant="contained" color="success" onClick={handleSaveFactors}>
                  Save Changes
                </Button>
                <Button startIcon={<CancelIcon />} variant="outlined" color="error" onClick={handleCancelEditFactors}>
                  Cancel
                </Button>
              </>
            )}
          </Box>

          <Grid container spacing={3}>
            {/* Weather Factor */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">Weather Factor</Typography>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={pricingFactors.weatherFactor?.enabled}
                          onChange={() => handleToggleFactor('weatherFactor')}
                          color="primary"
                          disabled={editingFactors}
                        />
                      }
                      label={pricingFactors.weatherFactor?.enabled ? 'Enabled' : 'Disabled'}
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {pricingFactors.weatherFactor?.description}
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle2" gutterBottom>
                    Conditions:
                  </Typography>
                  {Object.entries((editingFactors ? editFactorsData : pricingFactors).weatherFactor?.conditions || {}).map(
                    ([key, value]) => (
                      <Box key={key} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
                        <Typography variant="body2" sx={{ textTransform: 'capitalize', minWidth: 120 }}>
                          {key.replace(/([A-Z])/g, ' $1').trim()}:
                        </Typography>
                        {editingFactors ? (
                          <TextField
                            type="number"
                            value={value}
                            onChange={(e) => updateFactorCondition('weatherFactor', key, e.target.value)}
                            size="small"
                            sx={{ width: 100 }}
                            InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }}
                          />
                        ) : (
                          <Chip label={`+${value}%`} size="small" color={value > 0 ? 'warning' : 'default'} />
                        )}
                      </Box>
                    )
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Traffic Factor */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">Traffic Factor</Typography>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={pricingFactors.trafficFactor?.enabled}
                          onChange={() => handleToggleFactor('trafficFactor')}
                          color="primary"
                          disabled={editingFactors}
                        />
                      }
                      label={pricingFactors.trafficFactor?.enabled ? 'Enabled' : 'Disabled'}
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {pricingFactors.trafficFactor?.description}
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle2" gutterBottom>
                    Conditions:
                  </Typography>
                  {Object.entries((editingFactors ? editFactorsData : pricingFactors).trafficFactor?.conditions || {}).map(
                    ([key, value]) => (
                      <Box key={key} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
                        <Typography variant="body2" sx={{ textTransform: 'capitalize', minWidth: 120 }}>
                          {key}:
                        </Typography>
                        {editingFactors ? (
                          <TextField
                            type="number"
                            value={value}
                            onChange={(e) => updateFactorCondition('trafficFactor', key, e.target.value)}
                            size="small"
                            sx={{ width: 100 }}
                            InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }}
                          />
                        ) : (
                          <Chip label={`+${value}%`} size="small" color={value > 0 ? 'error' : 'default'} />
                        )}
                      </Box>
                    )
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Surge Factor */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">Surge Pricing</Typography>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={pricingFactors.surgeFactor?.enabled}
                          onChange={() => handleToggleFactor('surgeFactor')}
                          color="primary"
                          disabled={editingFactors}
                        />
                      }
                      label={pricingFactors.surgeFactor?.enabled ? 'Enabled' : 'Disabled'}
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {pricingFactors.surgeFactor?.description}
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" gutterBottom>
                        Multipliers:
                      </Typography>
                      {Object.entries(
                        (editingFactors ? editFactorsData : pricingFactors).surgeFactor?.config?.multipliers || {}
                      ).map(([key, value]) => (
                        <Box key={key} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
                          <Typography variant="body2" sx={{ textTransform: 'capitalize', minWidth: 100 }}>
                            {key}:
                          </Typography>
                          {editingFactors ? (
                            <TextField
                              type="number"
                              value={value}
                              onChange={(e) => updateSurgeMultiplier(key, e.target.value)}
                              size="small"
                              sx={{ width: 100 }}
                              inputProps={{ step: 0.1 }}
                              InputProps={{ endAdornment: <InputAdornment position="end">x</InputAdornment> }}
                            />
                          ) : (
                            <Chip label={`${value}x`} size="small" color="primary" />
                          )}
                        </Box>
                      ))}
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" gutterBottom>
                        Thresholds:
                      </Typography>
                      {Object.entries((editingFactors ? editFactorsData : pricingFactors).surgeFactor?.config?.thresholds || {}).map(
                        ([key, value]) => (
                          <Box key={key} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
                            <Typography variant="body2" sx={{ textTransform: 'capitalize', minWidth: 100 }}>
                              {key}:
                            </Typography>
                            {editingFactors ? (
                              <TextField
                                type="number"
                                value={value}
                                onChange={(e) => updateSurgeThreshold(key, e.target.value)}
                                size="small"
                                sx={{ width: 100 }}
                                inputProps={{ step: 0.1 }}
                              />
                            ) : (
                              <Chip label={value} size="small" />
                            )}
                          </Box>
                        )
                      )}
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Other Factors */}
            {['pickupComplexityFactor', 'loadChargesFactor', 'waitingChargesFactor', 'timeSlotFactor', 'holidayFactor'].map(
              (factorKey) => (
                <Grid item xs={12} md={6} key={factorKey}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6">
                          {factorKey
                            .replace('Factor', '')
                            .replace(/([A-Z])/g, ' $1')
                            .trim()}
                        </Typography>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={pricingFactors[factorKey]?.enabled}
                              onChange={() => handleToggleFactor(factorKey)}
                              color="primary"
                              disabled={editingFactors}
                            />
                          }
                          label={pricingFactors[factorKey]?.enabled ? 'Enabled' : 'Disabled'}
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {pricingFactors[factorKey]?.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              )
            )}
          </Grid>
        </Box>
      )}

      {/* Add Subtype Dialog */}
      <Dialog open={showAddSubtypeDialog} onClose={() => setShowAddSubtypeDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Subtype to {addSubtypeCategory} Category</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Subtype Name"
              placeholder="e.g., Bike, Scooter, Auto"
              value={newSubtypeData?.subType || ''}
              onChange={(e) => setNewSubtypeData({ ...newSubtypeData, subType: e.target.value })}
              fullWidth
              required
              helperText="Short name for the variant"
            />
            <TextField
              label="Display Name"
              placeholder="e.g., Bike (2-Wheeler)"
              value={newSubtypeData?.displayName || ''}
              onChange={(e) => setNewSubtypeData({ ...newSubtypeData, displayName: e.target.value })}
              fullWidth
              required
              helperText="Name shown to customers"
            />
            <TextField
              label="Base Fare (Default)"
              type="number"
              value={newSubtypeData?.baseFare?.default || 0}
              onChange={(e) => setNewSubtypeData({ 
                ...newSubtypeData, 
                baseFare: { ...newSubtypeData.baseFare, default: parseFloat(e.target.value) }
              })}
              fullWidth
              InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
            />
            <TextField
              label="Per Stop Charge"
              type="number"
              value={newSubtypeData?.stopCharges?.perStopCharge || 0}
              onChange={(e) => setNewSubtypeData({ 
                ...newSubtypeData, 
                stopCharges: { perStopCharge: parseFloat(e.target.value) }
              })}
              fullWidth
              InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
              helperText="Charge for each additional drop location"
            />
            <Alert severity="info">
              The subtype will copy all other pricing settings from existing {addSubtypeCategory} vehicles. 
              You can edit all details after creation.
            </Alert>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddSubtypeDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleSaveNewSubtype} 
            variant="contained" 
            disabled={!newSubtypeData?.subType || !newSubtypeData?.displayName}
          >
            Add Subtype
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmDialog.open} onClose={() => setDeleteConfirmDialog({ open: false, vehicleType: null })}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete <strong>{deleteConfirmDialog.vehicleType}</strong>? 
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmDialog({ open: false, vehicleType: null })}>Cancel</Button>
          <Button 
            onClick={() => handleDeleteSubtype(deleteConfirmDialog.vehicleType)} 
            variant="contained" 
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DynamicPricing;
