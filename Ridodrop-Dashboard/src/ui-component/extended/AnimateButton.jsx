import { forwardRef } from 'react';

// material-ui
import { Button } from '@mui/material';

// ==============================|| ANIMATE BUTTON ||============================== //

const AnimateButton = forwardRef(({ children, type = 'button', ...others }, ref) => (
  <Button
    ref={ref}
    type={type}
    {...others}
    sx={{
      position: 'relative',
      '&:hover': {
        transform: 'translateY(-2px)',
        transition: 'all 0.2s ease-in-out'
      }
    }}
  >
    {children}
  </Button>
));

AnimateButton.displayName = 'AnimateButton';

export default AnimateButton; 