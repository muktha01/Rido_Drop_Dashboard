import { forwardRef } from 'react';

// material-ui
import { Card, CardContent, CardHeader, Divider, Typography } from '@mui/material';

// constant
const headerSX = {
  '& .MuiCardHeader-action': { mr: 0 }
};

// ==============================|| SUB CARD ||============================== //

const SubCard = forwardRef(
  (
    {
      children,
      content,
      contentClass = '',
      contentSX = {},
      darkTitle,
      secondary,
      sx = {},
      title,
      ...others
    },
    ref
  ) => {
    return (
      <Card
        elevation={0}
        ref={ref}
        {...others}
        sx={{
          ...sx,
          border: '1px solid',
          borderColor: 'divider'
        }}
      >
        {/* card header and action */}
        {!darkTitle && title && (
          <CardHeader
            sx={headerSX}
            title={typeof title === 'string' ? <Typography variant="subtitle1">{title}</Typography> : title}
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

SubCard.displayName = 'SubCard';

export default SubCard; 