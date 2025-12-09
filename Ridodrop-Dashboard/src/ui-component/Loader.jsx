import { Box, CircularProgress } from '@mui/material';

// ==============================|| LOADER ||============================== //

const Loader = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh'
    }}
  >
    <CircularProgress />
  </Box>
);

export default Loader; 