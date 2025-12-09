import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
  Alert,
  Paper,
  Container,
  MenuItem,
  Select
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { strengthColor, strengthIndicator } from '../../utils/password-strength';

const AdminRegister = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { register, loading, error, clearError } = useAdminAuth();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    role: 'admin'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [strength, setStrength] = useState(0);
  const [level, setLevel] = useState();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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

    // Check password strength
    if (name === 'password') {
      const temp = strengthIndicator(value);
      setStrength(temp);
      setLevel(strengthColor(temp));
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const validateForm = () => {
    const errors = {};

    // First name validation
    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    } else if (formData.firstName.length < 2) {
      errors.firstName = 'First name must be at least 2 characters';
    }

    // Last name validation
    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    } else if (formData.lastName.length < 2) {
      errors.lastName = 'Last name must be at least 2 characters';
    }

    // Email validation
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Mobile validation (optional)
    if (formData.mobile && !/^\d{10}$/.test(formData.mobile.replace(/\s+/g, ''))) {
      errors.mobile = 'Mobile number must be 10 digits';
    }

    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    } else if (strength < 2) {
      errors.password = 'Password is too weak';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    // Role validation
    if (!formData.role) {
      errors.role = 'Role is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const { confirmPassword, ...registerData } = formData;
    const result = await register(registerData);

    if (result.success) {
      navigate('/dashboard');
    }
  };

  return (
    <Container component="main" maxWidth="md">
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
              Admin Registration
            </Typography>

            {/* Error Alert */}
            {error && (
              <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
                {error}
              </Alert>
            )}

            {/* Register Form */}
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
              <Grid container spacing={2}>
                {/* First Name Field */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth error={Boolean(formErrors.firstName)}>
                    <InputLabel htmlFor="outlined-adornment-firstname">
                      First Name *
                    </InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-firstname"
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      label="First Name *"
                      placeholder="Enter first name"
                      autoComplete="given-name"
                    />
                    {formErrors.firstName && (
                      <FormHelperText error>
                        {formErrors.firstName}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                {/* Last Name Field */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth error={Boolean(formErrors.lastName)}>
                    <InputLabel htmlFor="outlined-adornment-lastname">
                      Last Name *
                    </InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-lastname"
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      label="Last Name *"
                      placeholder="Enter last name"
                      autoComplete="family-name"
                    />
                    {formErrors.lastName && (
                      <FormHelperText error>
                        {formErrors.lastName}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                {/* Email Field */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth error={Boolean(formErrors.email)}>
                    <InputLabel htmlFor="outlined-adornment-email">
                      Email *
                    </InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      label="Email *"
                      placeholder="Enter email address"
                      autoComplete="email"
                    />
                    {formErrors.email && (
                      <FormHelperText error>
                        {formErrors.email}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                {/* Mobile Field */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth error={Boolean(formErrors.mobile)}>
                    <InputLabel htmlFor="outlined-adornment-mobile">
                      Mobile Number
                    </InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-mobile"
                      type="text"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      label="Mobile Number"
                      placeholder="Enter mobile number (optional)"
                      autoComplete="tel"
                    />
                    {formErrors.mobile && (
                      <FormHelperText error>
                        {formErrors.mobile}
                      </FormHelperText>
                    )}
                    {!formErrors.mobile && (
                      <FormHelperText>
                        Optional: Enter 10-digit mobile number
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                {/* Role Field */}
                <Grid size={12}>
                  <FormControl fullWidth error={Boolean(formErrors.role)}>
                    <InputLabel htmlFor="outlined-adornment-role">
                      Role *
                    </InputLabel>
                    <Select
                      id="outlined-adornment-role"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      label="Role *"
                    >
                      <MenuItem value="admin">Admin</MenuItem>
                      <MenuItem value="super_admin">Super Admin</MenuItem>
                      <MenuItem value="moderator">Moderator</MenuItem>
                    </Select>
                    {formErrors.role && (
                      <FormHelperText error>
                        {formErrors.role}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                {/* Password Field */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth error={Boolean(formErrors.password)}>
                    <InputLabel htmlFor="outlined-adornment-password">
                      Password *
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
                      label="Password *"
                      placeholder="Enter password"
                      autoComplete="new-password"
                    />
                    {formErrors.password && (
                      <FormHelperText error>
                        {formErrors.password}
                      </FormHelperText>
                    )}
                  </FormControl>
                  {formData.password !== '' && (
                    <FormControl fullWidth>
                      <Box sx={{ mb: 2 }}>
                        <Grid container spacing={2} alignItems="center">
                          <Grid item>
                            <Box style={{ backgroundColor: level?.color }} sx={{ width: 85, height: 8, borderRadius: '7px' }} />
                          </Grid>
                          <Grid item>
                            <Typography variant="subtitle1" fontSize="0.75rem">
                              {level?.label}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Box>
                    </FormControl>
                  )}
                </Grid>

                {/* Confirm Password Field */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth error={Boolean(formErrors.confirmPassword)}>
                    <InputLabel htmlFor="outlined-adornment-confirm-password">
                      Confirm Password *
                    </InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-confirm-password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowConfirmPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                            size="large"
                          >
                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      }
                      label="Confirm Password *"
                      placeholder="Confirm password"
                      autoComplete="new-password"
                    />
                    {formErrors.confirmPassword && (
                      <FormHelperText error>
                        {formErrors.confirmPassword}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                {/* Submit Button */}
                <Grid size={12}>
                  <Button
                    disableElevation
                    disabled={loading}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2 }}
                  >
                    {loading ? 'Creating Account...' : 'Create Admin Account'}
                  </Button>
                </Grid>

                {/* Login Link */}
                <Grid item xs={12}>
                  <Stack direction="row" justifyContent="center" alignItems="center">
                    <Typography variant="body2">
                      Already have an admin account?{' '}
                      <Link
                        to="/admin/login"
                        style={{
                          color: theme.palette.primary.main,
                          textDecoration: 'none',
                          fontWeight: 'bold'
                        }}
                      >
                        Sign in here
                      </Link>
                    </Typography>
                  </Stack>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default AdminRegister;
