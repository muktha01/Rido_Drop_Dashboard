import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
  Alert,
  Paper,
  Container
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

import { useAdminAuth } from '../../contexts/AdminAuthContext';

const AdminLogin = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { login, loading, error, clearError } = useAdminAuth();

  const [formData, setFormData] = useState({
    identifier: '', // email or mobile
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const handleChange = (event) => {
    const { name, value, checked } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rememberMe' ? checked : value
    }));
    
    // Clear errors when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Clear global error
    if (error) {
      clearError();
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.identifier.trim()) {
      errors.identifier = 'Email or mobile number is required';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const result = await login({
      identifier: formData.identifier,
      password: formData.password
    });

    if (result.success) {
      navigate('/dashboard');
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {/* Logo */}
            <Typography component="h1" variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: theme.palette.primary.main }}>
              Admin Login
            </Typography>

            {/* Error Alert */}
            {error && (
              <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
                {error}
              </Alert>
            )}

            {/* Login Form */}
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
              <Stack spacing={2}>
                {/* Email/Mobile Field */}
                <FormControl fullWidth error={Boolean(formErrors.identifier)}>
                  <InputLabel htmlFor="outlined-adornment-identifier">
                    Email or Mobile
                  </InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-identifier"
                    type="text"
                    name="identifier"
                    value={formData.identifier}
                    onChange={handleChange}
                    label="Email or Mobile"
                    placeholder="Enter your email or mobile number"
                    autoComplete="username"
                  />
                  {formErrors.identifier && (
                    <FormHelperText error>
                      {formErrors.identifier}
                    </FormHelperText>
                  )}
                </FormControl>

                {/* Password Field */}
                <FormControl fullWidth error={Boolean(formErrors.password)}>
                  <InputLabel htmlFor="outlined-adornment-password">
                    Password
                  </InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                          size="large"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="Password"
                    placeholder="Enter your password"
                    autoComplete="current-password"
                  />
                  {formErrors.password && (
                    <FormHelperText error>
                      {formErrors.password}
                    </FormHelperText>
                  )}
                </FormControl>

                {/* Remember Me */}
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.rememberMe}
                        onChange={handleChange}
                        name="rememberMe"
                        color="primary"
                      />
                    }
                    label="Remember me"
                  />
                </Stack>

                {/* Submit Button */}
                <Button
                  disableElevation
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{ mt: 1 }}
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </Button>

                {/* Register Link */}
                <Stack direction="row" justifyContent="center" alignItems="center">
                  <Typography variant="body2">
                    Don't have an admin account?{' '}
                    <Link
                      to="/admin/register"
                      style={{
                        color: theme.palette.primary.main,
                        textDecoration: 'none',
                        fontWeight: 'bold'
                      }}
                    >
                      Register here
                    </Link>
                  </Typography>
                </Stack>
              </Stack>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default AdminLogin;
