import { forwardRef } from 'react';

// material-ui
import { InputLabel as MuiInputLabel } from '@mui/material';

// ==============================|| INPUT LABEL ||============================== //

const InputLabel = forwardRef(({ children, ...others }, ref) => (
  <MuiInputLabel ref={ref} {...others}>
    {children}
  </MuiInputLabel>
));

InputLabel.displayName = 'InputLabel';

export default InputLabel; 