import { Box, Grid, Typography, Card, CardActionArea } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function TicketRise() {
  const navigate = useNavigate();
  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 900, mx: 'auto' }}>
      <Typography variant="h3" sx={{ fontWeight: 800, mb: 4, textAlign: 'center', color: 'primary.main' }}>
        Tickets Section
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} sm={6}>
          <Card
            sx={{
              borderRadius: 4,
              boxShadow: 4,
              p: 2,
              background: 'linear-gradient(135deg, #e3f2fd 0%, #90caf9 100%)',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'scale(1.04)', boxShadow: 8 }
            }}
          >
            <CardActionArea onClick={() => navigate('/dashboard/ticket-overview')} sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main', mb: 2 }}>
                Ticket Overview
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                View and manage all customer support tickets.
              </Typography>
            </CardActionArea>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
