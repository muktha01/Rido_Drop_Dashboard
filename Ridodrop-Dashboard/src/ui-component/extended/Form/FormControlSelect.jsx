import { forwardRef } from 'react';

// material-ui
import { FormControl as MuiFormControl, Select as MuiSelect } from '@mui/material';

// ==============================|| FORM CONTROL SELECT ||============================== //

const FormControlSelect = forwardRef(({ children, ...others }, ref) => (
  <MuiFormControl ref={ref} {...others}>
    <MuiSelect {...others}>
      {children}
    </MuiSelect>
  </MuiFormControl>
));

FormControlSelect.displayName = 'FormControlSelect';

export default FormControlSelect; 