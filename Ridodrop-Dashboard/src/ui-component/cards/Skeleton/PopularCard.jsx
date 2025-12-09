import { Box, Skeleton } from '@mui/material';

// ==============================|| SKELETON POPULAR CARD ||============================== //

const SkeletonPopularCard = () => (
  <Box sx={{ p: 2 }}>
    <Skeleton variant="text" width="70%" height={24} sx={{ mb: 2 }} />
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
      <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
      <Box sx={{ flex: 1 }}>
        <Skeleton variant="text" width="60%" height={20} sx={{ mb: 0.5 }} />
        <Skeleton variant="text" width="40%" height={16} />
      </Box>
    </Box>
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
      <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
      <Box sx={{ flex: 1 }}>
        <Skeleton variant="text" width="50%" height={20} sx={{ mb: 0.5 }} />
        <Skeleton variant="text" width="30%" height={16} />
      </Box>
    </Box>
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
      <Box sx={{ flex: 1 }}>
        <Skeleton variant="text" width="55%" height={20} sx={{ mb: 0.5 }} />
        <Skeleton variant="text" width="35%" height={16} />
      </Box>
    </Box>
  </Box>
);

export default SkeletonPopularCard; 