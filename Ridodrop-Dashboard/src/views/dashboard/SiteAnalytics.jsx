import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar } from 'recharts';
import { Card, CardContent, Typography, Grid, Box, CircularProgress, Paper } from '@mui/material';

// Mock API fetch function
const fetchAnalyticsData = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        visitors: [
          { name: 'Jan', visitors: 1200 },
          { name: 'Feb', visitors: 2100 },
          { name: 'Mar', visitors: 800 },
          { name: 'Apr', visitors: 1600 },
          { name: 'May', visitors: 900 },
          { name: 'Jun', visitors: 1700 },
          { name: 'Jul', visitors: 2500 },
          { name: 'Aug', visitors: 2200 },
          { name: 'Sep', visitors: 1900 },
          { name: 'Oct', visitors: 2300 },
          { name: 'Nov', visitors: 2000 },
          { name: 'Dec', visitors: 2700 }
        ],
        signups: [
          { name: 'Jan', signups: 300 },
          { name: 'Feb', signups: 500 },
          { name: 'Mar', signups: 200 },
          { name: 'Apr', signups: 400 },
          { name: 'May', signups: 250 },
          { name: 'Jun', signups: 600 },
          { name: 'Jul', signups: 800 },
          { name: 'Aug', signups: 700 },
          { name: 'Sep', signups: 650 },
          { name: 'Oct', signups: 900 },
          { name: 'Nov', signups: 850 },
          { name: 'Dec', signups: 1000 }
        ]
      });
    }, 1000);
  });
};

const SummaryCard = ({ title, value, color }) => (
  <Paper elevation={4} sx={{ p: 3, borderRadius: 3, textAlign: 'center', borderBottom: `4px solid ${color}` }}>
    <Typography variant="h6" color="textSecondary" gutterBottom>
      {title}
    </Typography>
    <Typography variant="h4" color={color} fontWeight={700}>
      {value}
    </Typography>
  </Paper>
);

const SiteAnalytics = () => {
  const [data, setData] = useState({ visitors: [], signups: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsData().then((res) => {
      setData(res);
      setLoading(false);
    });
  }, []);

  const totalVisitors = data.visitors.reduce((sum, d) => sum + d.visitors, 0);
  const totalSignups = data.signups.reduce((sum, d) => sum + d.signups, 0);

  return (
    <Box sx={{ maxWidth: 1100, margin: '40px auto', p: 2 }}>
      <Typography variant="h3" align="center" gutterBottom color="primary" fontWeight={700}>
        Site Analytics Dashboard
      </Typography>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
          <CircularProgress color="primary" />
        </Box>
      ) : (
        <>
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <SummaryCard title="Total Visitors" value={totalVisitors} color="#e53935" />
            </Grid>
            <Grid item xs={12} md={6}>
              <SummaryCard title="Total Signups" value={totalSignups} color="#3949ab" />
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={12} md={7}>
              <Card
                sx={{
                  boxShadow: 6,
                  borderRadius: 4,
                  background: 'linear-gradient(135deg, #fceabb 0%, #f8b500 100%)',
                  color: '#222',
                  position: 'relative',
                  overflow: 'visible',
                  minHeight: 370
                }}
              >
                <CardContent>
                  <Typography variant="h5" gutterBottom fontWeight={700} color="#e53935">
                    Monthly Visitors
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data.visitors} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                      <defs>
                        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#e53935" stopOpacity={0.8} />
                          <stop offset="100%" stopColor="#f8b500" stopOpacity={0.2} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip contentStyle={{ borderRadius: 12, background: '#fff', color: '#222', boxShadow: '0 2px 12px #f8b50033' }} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="visitors"
                        stroke="#e53935"
                        strokeWidth={4}
                        dot={{ r: 6, stroke: '#fff', strokeWidth: 2 }}
                        activeDot={{ r: 10 }}
                        fill="url(#colorUv)"
                        animationDuration={1200}
                        animationEasing="ease-in-out"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={5}>
              <Card sx={{ boxShadow: 4, borderRadius: 4, minHeight: 370 }}>
                <CardContent>
                  <Typography variant="h5" gutterBottom fontWeight={700} color="#3949ab">
                    Monthly Signups
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data.signups} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip contentStyle={{ borderRadius: 12, background: '#fff', color: '#222', boxShadow: '0 2px 12px #3949ab33' }} />
                      <Legend />
                      <Bar dataKey="signups" fill="#3949ab" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
};

export default SiteAnalytics; 