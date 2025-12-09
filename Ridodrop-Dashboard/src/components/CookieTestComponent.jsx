import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Paper, 
  Alert, 
  List, 
  ListItem, 
  ListItemText 
} from '@mui/material';

const CookieTestComponent = () => {
  const [cookies, setCookies] = useState([]);
  const [adminInfo, setAdminInfo] = useState(null);

  useEffect(() => {
    checkCookiesAndTokens();
  }, []);

  const checkCookiesAndTokens = () => {
    // Get all cookies
    const allCookies = document.cookie.split(';').map(cookie => {
      const [name, value] = cookie.trim().split('=');
      return { name, value };
    }).filter(cookie => cookie.name);

    setCookies(allCookies);

    // Check localStorage for admin info
    const storedAdminInfo = localStorage.getItem('adminInfo');
    if (storedAdminInfo) {
      try {
        setAdminInfo(JSON.parse(storedAdminInfo));
      } catch (error) {
        console.error('Error parsing admin info:', error);
      }
    }
  };

  const testBackendAuth = async () => {
    try {
      const response = await fetch('https://ridodrop-backend-24-10-2025.onrender.com/api/v1/auth/admin/profile', {
        method: 'GET',
        credentials: 'include'
      });
      
      const data = await response.json();
      console.log('Backend auth test:', data);
      
      if (response.ok) {
        alert('✅ Authentication successful! Tokens are working.');
      } else {
        alert('❌ Authentication failed: ' + data.message);
      }
    } catch (error) {
      console.error('Auth test error:', error);
      alert('❌ Connection error: ' + error.message);
    }
  };

  const clearAllData = () => {
    // Clear cookies (only client-side cookies)
    document.cookie.split(";").forEach(function(c) { 
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
    });
    
    // Clear localStorage
    localStorage.removeItem('adminInfo');
    
    // Refresh state
    checkCookiesAndTokens();
    
    alert('All data cleared!');
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Authentication Status & Cookie Test
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Button variant="contained" onClick={checkCookiesAndTokens} sx={{ mr: 2 }}>
          Refresh Status
        </Button>
        <Button variant="contained" onClick={testBackendAuth} sx={{ mr: 2 }}>
          Test Backend Auth
        </Button>
        <Button variant="outlined" onClick={clearAllData}>
          Clear All Data
        </Button>
      </Box>

      {/* Admin Info */}
      {adminInfo && (
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            Admin Information (localStorage)
          </Typography>
          <Alert severity="success">
            <Typography variant="subtitle2">Name: {adminInfo.fullName}</Typography>
            <Typography variant="subtitle2">Email: {adminInfo.email}</Typography>
            <Typography variant="subtitle2">Role: {adminInfo.role}</Typography>
            <Typography variant="subtitle2">ID: {adminInfo.id}</Typography>
          </Alert>
        </Paper>
      )}

      {/* Cookies */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Browser Cookies ({cookies.length} found)
        </Typography>
        {cookies.length > 0 ? (
          <List dense>
            {cookies.map((cookie, index) => (
              <ListItem key={index}>
                <ListItemText 
                  primary={cookie.name}
                  secondary={`${cookie.value.substring(0, 50)}${cookie.value.length > 50 ? '...' : ''}`}
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Alert severity="warning">
            No cookies found. This might indicate:
            <br />• Cookies are httpOnly (more secure, but not visible here)
            <br />• Authentication hasn't been completed
            <br />• Cookies were cleared
          </Alert>
        )}
      </Paper>

      <Box sx={{ mt: 2 }}>
        <Alert severity="info">
          <Typography variant="subtitle2">
            Note: HttpOnly cookies (like access/refresh tokens) won't be visible here for security reasons.
            Use the "Test Backend Auth" button to verify if authentication is working.
          </Typography>
        </Alert>
      </Box>
    </Box>
  );
};

export default CookieTestComponent;
