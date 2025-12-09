import { useState } from 'react';
import { Box, Typography, Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, OutlinedInput, InputAdornment, Stack, FormControl, InputLabel, Select, MenuItem, IconButton } from '@mui/material';
import { IconSearch } from '@tabler/icons-react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const FILTERS = ['Today', 'Weekly', 'Monthly', 'Yearly', 'Custom Date'];

const mockQueries = [
  { id: 1, name: 'Partner One', query: 'Unable to accept orders.' },
  { id: 2, name: 'Partner Two', query: 'Payment not received.' },
  { id: 3, name: 'Partner Three', query: 'App is slow during peak hours.' }
];

export default function PartnerTicketQueries() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('Today');
  const [customDate, setCustomDate] = useState({ from: '', to: '' });
  const [search, setSearch] = useState('');

  return (
    <Box sx={{ p: 0, m: 0, width: '100vw', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
        <IconButton onClick={() => navigate(-1)} sx={{ mr: 1 }}>
          <ArrowBackIcon sx={{ fontSize: 32, color: 'primary.main' }} />
        </IconButton>
        <Typography variant="h3" sx={{ fontWeight: 800, color: 'primary.main' }}>
          Partner Queries
        </Typography>
      </Box>
      <Paper sx={{ mb: 3, mx: 'auto', p: { xs: 2, md: 3 }, borderRadius: 3, boxShadow: 3, maxWidth: 1400, width: '98vw', display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { md: 'center' }, gap: 2 }}>
        <OutlinedInput
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search queries..."
          startAdornment={
            <InputAdornment position="start">
              <IconSearch stroke={1.5} size="20px" />
            </InputAdornment>
          }
          sx={{ width: { xs: '100%', md: 320 }, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}
        />
        <FormControl sx={{ minWidth: 180, width: { xs: '100%', md: 220 } }}>
          <InputLabel id="filter-label">Filter</InputLabel>
          <Select
            labelId="filter-label"
            value={filter}
            label="Filter"
            onChange={e => setFilter(e.target.value)}
            sx={{ borderRadius: 2, bgcolor: 'background.paper', fontWeight: 700 }}
          >
            {FILTERS.map((label) => (
              <MenuItem key={label} value={label}>{label}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Paper>
      {filter === 'Custom Date' && (
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
          <TextField
            type="date"
            label="From"
            InputLabelProps={{ shrink: true }}
            value={customDate.from}
            onChange={e => setCustomDate({ ...customDate, from: e.target.value })}
            size="small"
          />
          <TextField
            type="date"
            label="To"
            InputLabelProps={{ shrink: true }}
            value={customDate.to}
            onChange={e => setCustomDate({ ...customDate, to: e.target.value })}
            size="small"
          />
          <Button variant="contained" color="primary" sx={{ height: 40, mt: 1 }}>
            Apply
          </Button>
        </Box>
      )}
      <TableContainer component={Paper} sx={{ borderRadius: 0, boxShadow: 2, width: '100vw', minHeight: '100vh' }}>
        <Table sx={{ width: '100vw' }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Serial Number</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Partner Name</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Query</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mockQueries.map((row, idx) => (
              <TableRow key={row.id}>
                <TableCell>{idx + 1}</TableCell>
                <TableCell>{typeof row.name === 'string' ? row.name : (row.name?.name || row.name?.firstName || 'Unknown')}</TableCell>
                <TableCell>{row.query}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
} 