import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Container,
  Alert,
  MenuItem,
  Grid,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  OutlinedInput,
  FormHelperText
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const AdminRegisterForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    role: 'admin'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    setError('');
    setSuccess('');
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors({
        ...fieldErrors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    
    // Email validation
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Full name validation
    if (!formData.fullName || formData.fullName.trim().length < 2) {
      errors.fullName = 'Full name is required (minimum 2 characters)';
    }

    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    // Mobile validation (optional but if provided, should be valid)
    if (formData.mobile && !/^[+]?[\d\s\-\(\)]{10,}$/.test(formData.mobile)) {
      errors.mobile = 'Please enter a valid mobile number';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { confirmPassword, ...registerData } = formData;
      
      const response = await fetch('https://ridodrop-backend-24-10-2025.onrender.com/api/v1/auth/admin/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important for cookies
        body: JSON.stringify(registerData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess('Admin account created successfully! Redirecting to dashboard...');
        console.log('Registration successful:', data);
        
        // Store admin info in localStorage as backup
        localStorage.setItem('adminInfo', JSON.stringify(data.admin));
        
        // Redirect after a short delay
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('Connection error. Please check if the backend server is running.');
    } finally {
      setLoading(false);
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

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" align="center" gutterBottom color="primary">
            Admin Registration
          </Typography>
          <Typography variant="body2" align="center" gutterBottom color="textSecondary" sx={{ mb: 3 }}>
            Create your admin account to access the dashboard
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              {/* Full Name */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Full Name *"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  error={Boolean(fieldErrors.fullName)}
                  helperText={fieldErrors.fullName}
                  placeholder="Enter your full name"
                />
              </Grid>

              {/* Email */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email Address *"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={Boolean(fieldErrors.email)}
                  helperText={fieldErrors.email}
                  placeholder="Enter your email"
                />
              </Grid>

              {/* Mobile */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Mobile Number"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  error={Boolean(fieldErrors.mobile)}
                  helperText={fieldErrors.mobile || "Optional"}
                  placeholder="Enter your mobile number"
                />
              </Grid>

              {/* Role */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  label="Role *"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  helperText="Select your admin role"
                >
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="super_admin">Super Admin</MenuItem>
                  <MenuItem value="moderator">Moderator</MenuItem>
                </TextField>
              </Grid>

              {/* Password */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={Boolean(fieldErrors.password)}>
                  <InputLabel htmlFor="password">Password *</InputLabel>
                  <OutlinedInput
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="Password *"
                    placeholder="Enter password (min 6 characters)"
                  />
                  {fieldErrors.password && (
                    <FormHelperText error>{fieldErrors.password}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              {/* Confirm Password */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={Boolean(fieldErrors.confirmPassword)}>
                  <InputLabel htmlFor="confirmPassword">Confirm Password *</InputLabel>
                  <OutlinedInput
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowConfirmPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="Confirm Password *"
                    placeholder="Confirm your password"
                  />
                  {fieldErrors.confirmPassword && (
                    <FormHelperText error>{fieldErrors.confirmPassword}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              {/* Submit Button */}
              <Grid item xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  sx={{ mt: 2, py: 1.5 }}
                  disabled={loading}
                >
                  {loading ? 'Creating Account...' : 'Create Admin Account'}
                </Button>
              </Grid>

              {/* Login Link */}
              <Grid item xs={12}>
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <Typography variant="body2">
                    Already have an account?{' '}
                    <Button
                      variant="text"
                      onClick={() => navigate('/admin/login')}
                      sx={{ textTransform: 'none' }}
                    >
                      Sign in here
                    </Button>
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default AdminRegisterForm;
