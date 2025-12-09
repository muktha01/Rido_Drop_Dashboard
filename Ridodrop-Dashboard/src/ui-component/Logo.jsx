import { Link } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/material';

// project imports
import config from 'config';

// ==============================|| LOGO ||============================== //

const Logo = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        textDecoration: 'none',
        '&:hover': {
          textDecoration: 'none'
        }
      }}
    >
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          bgcolor: 'primary.main',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '18px'
        }}
      >
        R
      </Box>
      <Box
        sx={{
          ml: 1,
          fontWeight: 700,
          fontSize: '1.5rem',
          color: theme.palette.mode === 'dark' ? 'white' : 'primary.main'
        }}
      >
        RIDODROP
      </Box>
    </Box>
  );
};

export default Logo; 