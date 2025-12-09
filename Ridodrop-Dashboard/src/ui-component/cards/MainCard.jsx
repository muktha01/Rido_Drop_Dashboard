import { forwardRef } from 'react';

// material-ui
import { Card, CardContent, CardHeader, Divider, Typography } from '@mui/material';

// constant
const headerSX = {
  '& .MuiCardHeader-action': { mr: 0 }
};

// ==============================|| MAIN CARD ||============================== //

const MainCard = forwardRef(
  (
    {
      border = true,
      boxShadow,
      children,
      content = true,
      contentClass = '',
      contentSX = {},
      darkTitle,
      elevation,
      secondary,
      shadow,
      sx = {},
      title,
      ...others
    },
    ref
  ) => {
    return (
      <Card
        elevation={elevation || 0}
        ref={ref}
        {...others}
        sx={{
          ...sx,
          border: border ? '1px solid' : 'none',
          borderRadius: 2,
          borderColor: 'divider',
          boxShadow: boxShadow && shadow ? shadow : 'custom',
          '& pre': {
            m: 0,
            p: '16px !important',
            fontFamily: 'monospace',
            fontSize: '0.75rem'
          }
        }}
      >
        {/* card header and action */}
        {!darkTitle && title && (
          <CardHeader
            sx={headerSX}
            title={typeof title === 'string' ? <Typography variant="h6">{title}</Typography> : title}
            action={secondary}
          />
        )}

        {/* content & header divider */}
        {title && <Divider />}

        {/* card content */}
        {content && (
          <CardContent sx={contentSX} className={contentClass}>
            {children}
          </CardContent>
        )}
        {!content && children}
      </Card>
    );
  }
);

MainCard.displayName = 'MainCard';

export default MainCard; 