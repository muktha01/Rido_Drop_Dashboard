import React from 'react';
import { Box, Typography, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import { useNavigate } from 'react-router-dom';

const appTypes = [
  { label: 'Customer App', icon: <PersonIcon fontSize="medium" />, route: 'customer' },
  { label: 'Partner App', icon: <GroupIcon fontSize="medium" />, route: 'partner' }
];

export default function AppSetting() {
  const navigate = useNavigate();
  return (
    <Box sx={{ width: '100vw', minHeight: '100vh', display: 'flex', flexDirection: 'column', mt: 5 }}>
      <Typography variant="h4" color="primary" sx={{ mb: 3, ml: 2 }}>
        App Setting
      </Typography>
      <Box sx={{ display: 'flex', flex: 1, width: '100vw', alignItems: 'flex-start', justifyContent: 'flex-start' }}>
        {/* Sidebar inside a single white card */}
        <Box sx={{ minWidth: 200, mr: 2, pt: 2 }}>
          <Box sx={{ bgcolor: 'white', boxShadow: 4, borderRadius: 3, p: 2, minWidth: 180 }}>
            <List sx={{ p: 0 }}>
              {appTypes.map((type, idx) => (
                <ListItemButton
                  key={type.label}
                  onClick={() => {
                    // Navigate directly to vehicles page for Customer App
                    if (type.route === 'customer') {
                      navigate('/dashboard/app-setting/customer/vehicles');
                    } else {
                      navigate(`/dashboard/app-setting/${type.route}`);
                    }
                  }}
                  sx={{
                    borderRadius: 1,
                    color: 'text.primary',
                    bgcolor: 'transparent',
                    fontWeight: 400,
                    transition: 'all 0.2s',
                    minHeight: 40,
                    pl: 1.5,
                    pr: 1.5,
                    alignItems: 'center'
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 32 }}>{type.icon}</ListItemIcon>
                  <ListItemText primary={type.label} primaryTypographyProps={{ fontSize: 15 }} />
                </ListItemButton>
              ))}
            </List>
          </Box>
        </Box>
        {/* Main content area placeholder */}
        <Box sx={{ flex: 1, p: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography variant="h5" color="text.secondary">
            Select an app to manage banners and icons.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
