import { Box, Skeleton } from '@mui/material';

// ==============================|| SKELETON TOTAL GROWTH BAR CHART ||============================== //

const SkeletonTotalGrowthBarChart = () => (
  <Box sx={{ p: 2 }}>
    <Skeleton variant="text" width="60%" height={24} sx={{ mb: 2 }} />
    <Skeleton variant="text" width="40%" height={20} sx={{ mb: 3 }} />
    
    {/* Chart skeleton */}
    <Box sx={{ display: 'flex', alignItems: 'end', justifyContent: 'space-between', height: 200, mb: 2 }}>
      <Skeleton variant="rectangular" width={30} height="60%" sx={{ borderRadius: 1 }} />
      <Skeleton variant="rectangular" width={30} height="80%" sx={{ borderRadius: 1 }} />
      <Skeleton variant="rectangular" width={30} height="40%" sx={{ borderRadius: 1 }} />
      <Skeleton variant="rectangular" width={30} height="90%" sx={{ borderRadius: 1 }} />
      <Skeleton variant="rectangular" width={30} height="70%" sx={{ borderRadius: 1 }} />
      <Skeleton variant="rectangular" width={30} height="50%" sx={{ borderRadius: 1 }} />
      <Skeleton variant="rectangular" width={30} height="85%" sx={{ borderRadius: 1 }} />
    </Box>
    
    {/* Legend skeleton */}
    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Skeleton variant="rectangular" width={12} height={12} sx={{ mr: 1, borderRadius: 0.5 }} />
        <Skeleton variant="text" width={60} height={16} />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Skeleton variant="rectangular" width={12} height={12} sx={{ mr: 1, borderRadius: 0.5 }} />
        <Skeleton variant="text" width={60} height={16} />
      </Box>
    </Box>
  </Box>
);

export default SkeletonTotalGrowthBarChart; 