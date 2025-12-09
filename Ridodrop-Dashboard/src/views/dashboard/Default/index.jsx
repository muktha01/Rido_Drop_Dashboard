import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import PeopleIcon from '@mui/icons-material/People';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CalendarViewWeekIcon from '@mui/icons-material/CalendarViewWeek';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PaidIcon from '@mui/icons-material/Paid';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { gridSpacing } from 'store/constant';

const cardData = [
  {
    title: 'Total Customer',
    value: 1200,
    icon: <PeopleIcon fontSize="large" />,
    color: '#1976d2',
    bg: 'linear-gradient(135deg, #e3f2fd 0%, #90caf9 100%)',
    tooltip: 'Total registered customers',
    navigateTo: '/dashboard/customers'
  },
  {
    title: 'Total Partner',
    value: 350,
    icon: <GroupAddIcon fontSize="large" />,
    color: '#388e3c',
    bg: 'linear-gradient(135deg, #e8f5e9 0%, #a5d6a7 100%)',
    tooltip: 'Total partners on platform',
    navigateTo: '/dashboard/drivers'
  },
  {
    title: 'Waiting for Approval',
    value: 18,
    icon: <HourglassTopIcon fontSize="large" />,
    color: '#fbc02d',
    bg: 'linear-gradient(135deg, #fffde7 0%, #ffe082 100%)',
    tooltip: 'Partners/customers pending approval',
    navigateTo: '/dashboard/manage-orders',
    state: { statusFilter: 'Pending' }
  },
  {
    title: 'Total Complete Ride',
    value: 980,
    icon: <DirectionsCarIcon fontSize="large" />,
    color: '#0288d1',
    bg: 'linear-gradient(135deg, #e1f5fe 0%, #81d4fa 100%)',
    tooltip: 'Total rides completed',
    navigateTo: '/dashboard/manage-orders',
    state: { statusFilter: 'Completed' }
  },
  {
    title: 'Today Earning',
    value: '₹5,200',
    icon: <MonetizationOnIcon fontSize="large" />,
    color: '#43a047',
    bg: 'linear-gradient(135deg, #e8f5e9 0%, #b9f6ca 100%)',
    tooltip: 'Earnings for today',
    navigateTo: '/dashboard/manage-orders'
  },
  {
    title: 'Weekly Earning',
    value: '₹32,000',
    icon: <CalendarViewWeekIcon fontSize="large" />,
    color: '#6d4c41',
    bg: 'linear-gradient(135deg, #efebe9 0%, #bcaaa4 100%)',
    tooltip: 'Earnings for this week',
    navigateTo: '/dashboard/manage-orders'
  },
  {
    title: 'Monthly Earning',
    value: '₹1,20,000',
    icon: <CalendarMonthIcon fontSize="large" />,
    color: '#8e24aa',
    bg: 'linear-gradient(135deg, #f3e5f5 0%, #ce93d8 100%)',
    tooltip: 'Earnings for this month',
    navigateTo: '/dashboard/manage-orders'
  },
  {
    title: 'Total Earning',
    value: '₹12,50,000',
    icon: <PaidIcon fontSize="large" />,
    color: '#d84315',
    bg: 'linear-gradient(135deg, #fbe9e7 0%, #ffab91 100%)',
    tooltip: 'Total earnings on platform',
    navigateTo: '/dashboard/manage-orders'
  },
  {
    title: 'Today Earning',
    value: '₹5,200',
    icon: <TrendingUpIcon fontSize="large" />,
    color: '#1565c0',
    bg: 'linear-gradient(135deg, #e3f2fd 0%, #90caf9 100%)',
    tooltip: 'Today earning (repeat card for demo)',
    navigateTo: '/dashboard/manage-orders'
  }
];

export default function Dashboard() {
  const [isLoading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleCardClick = (card) => {
    if (card.navigateTo) {
      // Navigate with state if provided
      if (card.state) {
        navigate(card.navigateTo, { state: card.state });
      } else {
        navigate(card.navigateTo);
      }
    }
  };

  return (
    <Grid
      container
      spacing={gridSpacing}
      justifyContent="center"
      sx={{
        minHeight: '100vh',
        background: '#f7f9ff',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Top Banner */}
      {/* <Grid item xs={12} sx={{ mb: 3 }}>
        <Box
          sx={{
            width: '100%',
            borderRadius: 5,
            p: { xs: 3, md: 6 },
            background: 'linear-gradient(90deg, #1976d2 0%, #90caf9 100%)',
            color: 'white',
            boxShadow: '0 8px 32px 0 rgba(34, 139, 230, 0.18)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 140,
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            '::after': {
              content: '""',
              position: 'absolute',
              top: '-30%',
              left: '-10%',
              width: '120%',
              height: '160%',
              background: 'radial-gradient(circle, rgba(255,255,255,0.12) 0%, rgba(25,118,210,0.04) 100%)',
              zIndex: 1,
            },
          }}
        >
          <Box sx={{ mr: 4, display: { xs: 'none', md: 'block' }, zIndex: 2 }}>
            <TrendingUpIcon sx={{ fontSize: 90, opacity: 0.18, color: '#fff' }} />
          </Box>
          <Box sx={{ zIndex: 2 }}>
            <Typography variant="h2" sx={{ fontWeight: 900, mb: 1, letterSpacing: 1, color: '#303030', fontSize: { xs: 28, md: 40 } }}>
              Welcome Ridodrop
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: '#303030', fontSize: { xs: 18, md: 28 } }}>
              Your all-in-one platform for smart logistics, real-time analytics, and seamless growth.
            </Typography>
            <Typography variant="h5" sx={{ opacity: 0.97, fontWeight: 500, color: '#303030', fontSize: { xs: 15, md: 22 } }}>
              Keep up the great work—track your stats, earnings, and more right here on your dashboard.
            </Typography>
          </Box>
        </Box>
      </Grid> */}
      {/* 9 Cards layout: 5 in first row, 4 in second row */}
      {/* First Row - 5 Cards */}
      <Grid container item xs={12} spacing={2} justifyContent="center">
        {cardData.slice(0, 5).map((card, idx) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={2.4}
            lg={2.4}
            xl={2.4}
            key={card.title + idx}
            sx={{
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            <Card
              onClick={() => handleCardClick(card)}
              sx={{
                background: '#fff',
                color: '#303030',
                borderRadius: 2,
                boxShadow: 3,
                p: 1,
                transition: 'transform 0.2s, box-shadow 0.2s',
                cursor: card.navigateTo ? 'pointer' : 'default',
                '&:hover': {
                  transform: 'translateY(-5px) scale(1.02)',
                  boxShadow: '0 4px 16px 0 rgba(34, 139, 230, 0.15)',
                  filter: 'brightness(1.03)'
                },
                minHeight: 100,
                width: '220px',
                maxWidth: '220px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                border: '1px solid #e3e8ef'
              }}
            >
              <CardContent
                sx={{ width: '100%', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', p: 0.5 }}
              >
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: '#f7f9ff',
                    boxShadow: '0 1px 4px 0 rgba(34,139,230,0.04)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid #f0f1f6',
                    mb: 0.5
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: 'transparent',
                      color: card.color,
                      width: 24,
                      height: 24,
                      fontSize: 18,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {card.icon}
                  </Avatar>
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.3, color: '#303030', fontSize: 12 }}>
                  {card.title}
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#303030', fontSize: 16 }}>
                  {card.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Second Row - 4 Cards */}
      <Grid container item xs={12} spacing={2} justifyContent="center">
        {cardData.slice(5, 9).map((card, idx) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={3}
            lg={3}
            xl={3}
            key={card.title + idx}
            sx={{
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            <Card
              onClick={() => handleCardClick(card)}
              sx={{
                background: '#fff',
                color: '#303030',
                borderRadius: 2,
                boxShadow: 3,
                p: 1,
                transition: 'transform 0.2s, box-shadow 0.2s',
                cursor: card.navigateTo ? 'pointer' : 'default',
                '&:hover': {
                  transform: 'translateY(-5px) scale(1.02)',
                  boxShadow: '0 4px 16px 0 rgba(34, 139, 230, 0.15)',
                  filter: 'brightness(1.03)'
                },
                minHeight: 100,
                width: '220px',
                maxWidth: '220px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                border: '1px solid #e3e8ef'
              }}
            >
              <CardContent
                sx={{ width: '100%', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', p: 0.5 }}
              >
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: '#f7f9ff',
                    boxShadow: '0 1px 4px 0 rgba(34,139,230,0.04)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid #f0f1f6',
                    mb: 0.5
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: 'transparent',
                      color: card.color,
                      width: 24,
                      height: 24,
                      fontSize: 18,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {card.icon}
                  </Avatar>
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.3, color: '#303030', fontSize: 12 }}>
                  {card.title}
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#303030', fontSize: 16 }}>
                  {card.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      {/* Decorative wave divider */}
      <Grid item xs={12} sx={{ width: '100%', p: 0, m: 0 }}>
        <Box sx={{ width: '100%', overflow: 'hidden', lineHeight: 0, mb: -2 }}>
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 60, display: 'block' }}>
            <path fill="#38f9d7" fillOpacity="0.18" d="M0,32 C360,80 1080,0 1440,48 L1440,80 L0,80 Z" />
            <path fill="#43e97b" fillOpacity="0.12" d="M0,48 C480,0 960,80 1440,32 L1440,80 L0,80 Z" />
          </svg>
        </Box>
      </Grid>
    </Grid>
  );
}
