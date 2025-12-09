import { forwardRef } from 'react';

// material-ui
import { Slide, Zoom, Fade, Grow, Collapse } from '@mui/material';

// ==============================|| TRANSITIONS ||============================== //

const Transitions = forwardRef(({ children, position = 'top-left', type = 'grow', direction = 'up', ...others }, ref) => {
  let positionSX = {
    transformOrigin: '0 0 0'
  };

  switch (position) {
    case 'top-right':
    case 'top':
    case 'top-left':
      positionSX = {
        transformOrigin: '0 0 0'
      };
      break;
    case 'bottom-right':
    case 'bottom':
    case 'bottom-left':
      positionSX = {
        transformOrigin: '0 100% 0'
      };
      break;
    case 'right-top':
    case 'right':
    case 'right-bottom':
      positionSX = {
        transformOrigin: '100% 0 0'
      };
      break;
    case 'left-top':
    case 'left':
    case 'left-bottom':
      positionSX = {
        transformOrigin: '0 0 0'
      };
      break;
    default:
      positionSX = {
        transformOrigin: '0 0 0'
      };
      break;
  }

  return (
    <div ref={ref}>
      {type === 'grow' && (
        <Grow {...others}>
          <div style={positionSX}>{children}</div>
        </Grow>
      )}
      {type === 'collapse' && (
        <Collapse {...others} sx={positionSX}>
          {children}
        </Collapse>
      )}
      {type === 'fade' && (
        <Fade
          {...others}
          timeout={{
            appear: 500,
            enter: 600,
            exit: 400
          }}
        >
          <div style={positionSX}>{children}</div>
        </Fade>
      )}
      {type === 'slide' && (
        <Slide
          {...others}
          timeout={{
            appear: 0,
            enter: 400,
            exit: 200
          }}
          direction={direction}
        >
          <div style={positionSX}>{children}</div>
        </Slide>
      )}
      {type === 'zoom' && (
        <Zoom {...others}>
          <div style={positionSX}>{children}</div>
        </Zoom>
      )}
    </div>
  );
});

Transitions.displayName = 'Transitions';

export default Transitions; 