import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Cookies from 'js-cookie';
import axios from 'axios';
// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

// ===============================|| JWT - LOGIN ||=============================== //

export default function AuthLogin() {
  const theme = useTheme();
  const navigate = useNavigate();

  const [checked, setChecked] = useState(true);

  const [showPassword, setShowPassword] = useState(false);

  const [phoneNumber, setPhonenumber] = useState('');
  const [password, setpassword] = useState('');
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const HandleSubmit = async () => {
    console.log('submitt');
    try {
      const response = await axios.post('https://lipu.w4u.in/mlm/api/v1/login', {
        number: phoneNumber,
        password
      });

      Cookies.set('Token', JSON.stringify(response.data.Token), {
        expires: 7,
        path: '/'
      });

      if (response) {
        navigate('/');
      }

      // You can store token or navigate to another page here
      // e.g., localStorage.setItem('token', response.data.token);
    } catch (error) {
      console.error('Login failed:', error.response?.data || error.message);
    }
  };
  return (
    <>
      <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
        <InputLabel htmlFor="outlined-adornment-email-login">Phone Number</InputLabel>
        <OutlinedInput
          id="outlined-adornment-email-login"
          type="text"
          name="phonenumber"
          value={phoneNumber}
          onChange={(e) => {
            setPhonenumber(e.target.value);
          }}
        />
      </FormControl>

      <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
        <InputLabel htmlFor="outlined-adornment-password-login">Password</InputLabel>
        <OutlinedInput
          id="outlined-adornment-password-login"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => {
            setpassword(e.target.value);
          }}
          name="password"
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
                size="large"
              >
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          }
          label="Password"
        />
      </FormControl>

      <Grid container sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
        <Grid>
          <FormControlLabel
            control={<Checkbox checked={checked} onChange={(event) => setChecked(event.target.checked)} name="checked" color="primary" />}
            label="Keep me logged in"
          />
        </Grid>
        {/* <Grid>
          <Typography variant="subtitle1" component={Link} to="/forgot-password" color="secondary" sx={{ textDecoration: 'none' }}>
            Forgot Password?
          </Typography>
        </Grid> */}
      </Grid>
      <Box sx={{ mt: 2 }}>
        <AnimateButton>
          <Button
            color="secondary"
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            onClick={() => {
              HandleSubmit();
            }}
          >
            Sign In
          </Button>
        </AnimateButton>
      </Box>
    </>
  );
}
