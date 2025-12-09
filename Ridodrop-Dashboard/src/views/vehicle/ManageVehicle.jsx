import React, { useState } from 'react';
import { Box, Typography, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import AirportShuttleIcon from '@mui/icons-material/AirportShuttle';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ElectricRickshawIcon from '@mui/icons-material/ElectricRickshaw';
import { useNavigate } from 'react-router-dom';

const vehicleTypes = [
  { label: '2W', icon: <DirectionsBikeIcon fontSize="medium" /> },
  { label: '3W', icon: <AirportShuttleIcon fontSize="medium" /> },
  { label: 'Truck', icon: <LocalShippingIcon fontSize="medium" /> },
  { label: 'E-Loader', icon: <ElectricRickshawIcon fontSize="medium" /> },
];

const subTypeOptions = {
  '2W': ['Bike', 'Scooter', 'Electric Bike'],
  '3W': ['Petrol', 'Diesel', 'Electric'],
  'Truck': ['Diesel'],
  'E-Loader': ['E-Loader'],
};

// Nested sub-types for Truck (fuel type -> truck types)
const truckSubTypes = {
  'Diesel': ['TATA ACE', 'TATA 407', '8 Feet', '9 Feet', '14 Feet', '17 Feet']
};

const ManageVehicle = () => {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [subTypeIdx, setSubTypeIdx] = useState(0);
  const [truckSubTypeIdx, setTruckSubTypeIdx] = useState(0);
  const [selectedFuelType, setSelectedFuelType] = useState('');
  const navigate = useNavigate();

  React.useEffect(() => {
    setSubTypeIdx(0);
    setTruckSubTypeIdx(0);
    setSelectedFuelType('');
  }, [selectedIdx]);

  return (
    <Box sx={{ width: '100vw', minHeight: '100vh', display: 'flex', flexDirection: 'column', mt: 5 }}>
      <Typography variant="h4" color="primary" sx={{ mb: 3, ml: 2 }}>
            Manage Vehicle
          </Typography>
      <Box sx={{ display: 'flex', flex: 1, width: '100vw', alignItems: 'flex-start', justifyContent: 'flex-start' }}>
        {/* Sidebar inside a single white card */}
        <Box sx={{ minWidth: 200, mr: 2, pt: 2 }}>
          <Box sx={{ bgcolor: 'white', boxShadow: 4, borderRadius: 3, p: 2, minWidth: 180 }}>
            <List sx={{ p: 0 }}>
              {vehicleTypes.map((type, idx) => (
                <Box key={type.label} sx={{ mb: 0.5, display: 'flex', alignItems: 'flex-start', position: 'relative' }}>
                  <ListItemButton
                    selected={selectedIdx === idx}
                    onClick={() => setSelectedIdx(idx)}
                    sx={{
                      borderRadius: 1,
                      color: selectedIdx === idx ? 'primary.main' : 'text.primary',
                      bgcolor: selectedIdx === idx ? 'primary.lighter' : 'transparent',
                      fontWeight: selectedIdx === idx ? 700 : 400,
                      boxShadow: selectedIdx === idx ? 2 : 0,
                      transition: 'all 0.2s',
                      minHeight: 40,
                      pl: 1.5,
                      pr: 1.5,
                      alignItems: 'center',
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 32, color: selectedIdx === idx ? 'primary.main' : 'grey.500' }}>
                      {type.icon}
                    </ListItemIcon>
                    <ListItemText primary={type.label} primaryTypographyProps={{ fontSize: 15 }} />
                  </ListItemButton>
                  {/* Show sub-type buttons to the right of the selected sidebar item only */}
                  {selectedIdx === idx && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, ml: 2, position: 'relative', zIndex: 1 }}>
                      {subTypeOptions[type.label].map((sub, subIdx) => (
                        <Box key={sub} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Box
                            sx={{
                              bgcolor: 'white',
                              borderRadius: 2,
                              boxShadow: subIdx === subTypeIdx ? 4 : 1,
                              border: subIdx === subTypeIdx ? '2px solid #1976d2' : '1px solid #eee',
                              transition: 'all 0.2s',
                              minWidth: 90,
                              minHeight: 36,
                              px: 2,
                              py: 1.5,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              fontWeight: subIdx === subTypeIdx ? 700 : 400,
                              color: subIdx === subTypeIdx ? 'primary.main' : 'text.primary',
                              fontSize: 15,
                            }}
                            onClick={() => {
                              setSubTypeIdx(subIdx);
                              
                              // For Truck, just select the fuel type and don't navigate yet
                              if (type.label === 'Truck') {
                                setSelectedFuelType(sub);
                                setTruckSubTypeIdx(0);
                              } else {
                                // For other types, navigate directly
                                navigate(`/dashboard/vehicle/list/${encodeURIComponent(type.label)}/${encodeURIComponent(sub)}`);
                              }
                            }}
                          >
                            {sub}
                          </Box>
                          
                          {/* Show truck sub-types when Truck fuel type is selected */}
                          {type.label === 'Truck' && subIdx === subTypeIdx && truckSubTypes[sub] && (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                              {truckSubTypes[sub].map((truckType, truckIdx) => (
                                <Box
                                  key={truckType}
                                  sx={{
                                    bgcolor: 'white',
                                    borderRadius: 2,
                                    boxShadow: truckIdx === truckSubTypeIdx ? 4 : 1,
                                    border: truckIdx === truckSubTypeIdx ? '2px solid #1976d2' : '1px solid #eee',
                                    transition: 'all 0.2s',
                                    minWidth: 100,
                                    minHeight: 36,
                                    px: 2,
                                    py: 1.5,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    fontWeight: truckIdx === truckSubTypeIdx ? 700 : 400,
                                    color: truckIdx === truckSubTypeIdx ? 'primary.main' : 'text.primary',
                                    fontSize: 14,
                                  }}
                                  onClick={() => {
                                    setTruckSubTypeIdx(truckIdx);
                                    navigate(`/dashboard/vehicle/list/${encodeURIComponent(type.label)}/${encodeURIComponent(sub)}/${encodeURIComponent(truckType)}`);
                                  }}
                                >
                                  {truckType}
                                </Box>
                              ))}
                            </Box>
                          )}
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>
              ))}
            </List>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ManageVehicle; 