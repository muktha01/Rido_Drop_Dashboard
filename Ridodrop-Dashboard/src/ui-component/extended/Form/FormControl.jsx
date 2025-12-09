import { forwardRef } from 'react';

// material-ui
import { FormControl as MuiFormControl } from '@mui/material';

// ==============================|| FORM CONTROL ||============================== //

const FormControl = forwardRef(({ children, ...others }, ref) => (
  <MuiFormControl ref={ref} {...others}>
    {children}
  </MuiFormControl>
));

FormControl.displayName = 'FormControl';

export default FormControl; 