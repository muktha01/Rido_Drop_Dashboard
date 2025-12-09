import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Button, Chip, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HistoryIcon from '@mui/icons-material/History';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

// Dummy wallet transaction data
const dummyTransactions = [
  { id: 'TXN001', date: '2024-06-10', type: 'Top Up', amount: 1000 },
  { id: 'TXN002', date: '2024-06-11', type: 'Order Payment', amount: -200 },
  { id: 'TXN003', date: '2024-06-12', type: 'Refund', amount: 150 },
  { id: 'TXN004', date: '2024-06-13', type: 'Order Payment', amount: -300 },
  { id: 'TXN005', date: '2024-06-14', type: 'Top Up', amount: 500 },
  { id: 'TXN006', date: '2024-06-15', type: 'Order Payment', amount: -100 },
  { id: 'TXN007', date: '2024-06-16', type: 'Refund', amount: 50 },
  { id: 'TXN008', date: '2024-06-17', type: 'Top Up', amount: 700 },
  { id: 'TXN009', date: '2024-06-18', type: 'Order Payment', amount: -400 },
  { id: 'TXN010', date: '2024-06-19', type: 'Top Up', amount: 1200 },
];

const CustomerWallet = () => {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const [dateFilter, setDateFilter] = useState('all');
  const [customDate, setCustomDate] = useState('');

  // Date filter logic
  const today = new Date();
  const filteredTransactions = dummyTransactions.filter((txn) => {
    const txnDate = new Date(txn.date);
    let matchesDate = true;
    if (dateFilter === 'today') {
      matchesDate = txnDate.toDateString() === today.toDateString();
    } else if (dateFilter === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(today.getDate() - 7);
      matchesDate = txnDate >= weekAgo && txnDate <= today;
    } else if (dateFilter === 'month') {
      const monthAgo = new Date();
      monthAgo.setMonth(today.getMonth() - 1);
      matchesDate = txnDate >= monthAgo && txnDate <= today;
    } else if (dateFilter === 'year') {
      const yearAgo = new Date();
      yearAgo.setFullYear(today.getFullYear() - 1);
      matchesDate = txnDate >= yearAgo && txnDate <= today;
    } else if (dateFilter === 'custom' && customDate) {
      matchesDate = txnDate.toDateString() === new Date(customDate).toDateString();
    }
    return matchesDate;
  });

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 3 }}>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
        <IconButton onClick={() => navigate(-1)} sx={{ mr: 2, bgcolor: 'white', boxShadow: 2, '&:hover': { bgcolor: 'grey.100' } }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
          Wallet Transactions for {customerId}
        </Typography>
      </Box>
      <Card sx={{ borderRadius: 3, boxShadow: 3, maxWidth: 900, mx: 'auto' }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center' }}>
            <HistoryIcon sx={{ mr: 1, color: 'primary.main' }} />
            Transaction History
          </Typography>
          <Box sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <TextField
              select
              label="Date Range"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              size="small"
              sx={{ width: 160 }}
              SelectProps={{ native: true }}
            >
              <option value="all">All</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
              <option value="custom">Custom Date</option>
            </TextField>
            {dateFilter === 'custom' && (
              <TextField
                type="date"
                value={customDate}
                onChange={(e) => setCustomDate(e.target.value)}
                size="small"
                sx={{ width: 160 }}
              />
            )}
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'grey.50' }}>
                  <TableCell sx={{ fontWeight: 600 }}>S. No.</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Transaction ID</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Amount (₹)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <Typography variant="body1" color="text.secondary" sx={{ py: 3 }}>
                        No transactions found for the selected date range.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTransactions.map((txn, idx) => (
                    <TableRow key={txn.id} sx={{ '&:hover': { bgcolor: 'grey.50' } }}>
                      <TableCell>{idx + 1}</TableCell>
                      <TableCell sx={{ fontWeight: 500 }}>{txn.id}</TableCell>
                      <TableCell>{txn.date}</TableCell>
                      <TableCell>
                        <Chip
                          label={txn.type}
                          size="small"
                          sx={{
                            bgcolor: txn.type === 'Top Up' ? 'success.light' : txn.type === 'Refund' ? 'warning.light' : 'error.light',
                            color: txn.type === 'Top Up' ? 'success.dark' : txn.type === 'Refund' ? 'warning.dark' : 'error.dark',
                            fontWeight: 600
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, color: txn.amount < 0 ? 'error.main' : 'success.main', display: 'flex', alignItems: 'center' }}>
                        {txn.amount < 0 ? (
                          <ArrowDownwardIcon fontSize="small" color="error" sx={{ mr: 0.5 }} />
                        ) : (
                          <ArrowUpwardIcon fontSize="small" color="success" sx={{ mr: 0.5 }} />
                        )}
                        ₹{Math.abs(txn.amount)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CustomerWallet; 