import { Box, Skeleton } from '@mui/material';

// ==============================|| SKELETON TOTAL ORDER CARD ||============================== //

const SkeletonTotalOrderCard = () => (
  <Box sx={{ p: 2 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
      <Skeleton variant="rectangular" width={60} height={60} sx={{ borderRadius: 1 }} />
      <Skeleton variant="rectangular" width={30} height={30} sx={{ borderRadius: 1 }} />
    </Box>
    <Skeleton variant="text" width="65%" height={24} sx={{ mb: 1 }} />
    <Skeleton variant="text" width="45%" height={20} sx={{ mb: 2 }} />
    
    {/* Line chart skeleton */}
    <Box sx={{ position: 'relative', height: 120, mb: 2 }}>
      <Skeleton variant="rectangular" width="100%" height={2} sx={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)' }} />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', height: '100%' }}>
        <Skeleton variant="rectangular" width={3} height="30%" sx={{ borderRadius: 1 }} />
        <Skeleton variant="rectangular" width={3} height="60%" sx={{ borderRadius: 1 }} />
        <Skeleton variant="rectangular" width={3} height="40%" sx={{ borderRadius: 1 }} />
        <Skeleton variant="rectangular" width={3} height="80%" sx={{ borderRadius: 1 }} />
        <Skeleton variant="rectangular" width={3} height="50%" sx={{ borderRadius: 1 }} />
        <Skeleton variant="rectangular" width={3} height="70%" sx={{ borderRadius: 1 }} />
        <Skeleton variant="rectangular" width={3} height="90%" sx={{ borderRadius: 1 }} />
      </Box>
    </Box>
    
    {/* Stats skeleton */}
    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
      <Box>
        <Skeleton variant="text" width={40} height={16} sx={{ mb: 0.5 }} />
        <Skeleton variant="text" width={60} height={20} />
      </Box>
      <Box>
        <Skeleton variant="text" width={40} height={16} sx={{ mb: 0.5 }} />
        <Skeleton variant="text" width={60} height={20} />
      </Box>
    </Box>
  </Box>
);

export default SkeletonTotalOrderCard; 