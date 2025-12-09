import { Box, Skeleton } from '@mui/material';

// ==============================|| SKELETON TOTAL INCOME CARD ||============================== //

const SkeletonTotalIncomeCard = () => (
  <Box sx={{ p: 2 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
      <Skeleton variant="rectangular" width={60} height={60} sx={{ borderRadius: 1 }} />
      <Skeleton variant="rectangular" width={30} height={30} sx={{ borderRadius: 1 }} />
    </Box>
    <Skeleton variant="text" width="70%" height={24} sx={{ mb: 1 }} />
    <Skeleton variant="text" width="50%" height={20} sx={{ mb: 2 }} />
    <Skeleton variant="rectangular" width="100%" height={60} sx={{ borderRadius: 1 }} />
  </Box>
);

export default SkeletonTotalIncomeCard; 