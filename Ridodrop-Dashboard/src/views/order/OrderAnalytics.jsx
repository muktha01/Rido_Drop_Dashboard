import React from 'react';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const orderStats = [
  { label: 'Total Orders', value: 120, color: '#1976d2', filter: 'all' },
  { label: 'Completed Orders', value: 90, color: '#43a047', filter: 'completed' },
  { label: 'Cancelled Orders', value: 15, color: '#e53935', filter: 'canceled' },
  { label: 'Pending Orders', value: 15, color: '#fbc02d', filter: 'pending' },
];

export default function OrderAnalytics() {
  const navigate = useNavigate();
  return (
    <Box sx={{ maxWidth: 1100, mx: 'auto', mt: 6, p: 2 }}>
      <Typography variant="h3" color="primary" fontWeight={700} gutterBottom>
        Order Analytics
      </Typography>
      <Grid container spacing={3}>
        {orderStats.map(stat => (
          <Grid item xs={12} sm={6} md={3} key={stat.label}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: 4,
                cursor: 'pointer',
                borderBottom: `4px solid ${stat.color}`,
                transition: 'box-shadow 0.2s',
                '&:hover': { boxShadow: 8, bgcolor: 'grey.50' },
              }}
              onClick={() => navigate(`/orders/list/all`)}
            >
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="textSecondary" gutterBottom>
                  {stat.label}
                </Typography>
                <Typography variant="h4" fontWeight={700} color={stat.color}>
                  {stat.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
} 