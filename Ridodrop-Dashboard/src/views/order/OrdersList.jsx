import React from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip } from '@mui/material';
import { useParams } from 'react-router-dom';

const mockOrders = [
  { id: 'ORD001', customer: 'Alice', date: '2024-06-01', status: 'completed', amount: 150 },
  { id: 'ORD002', customer: 'Bob', date: '2024-06-02', status: 'pending', amount: 200 },
  { id: 'ORD003', customer: 'Carol', date: '2024-06-03', status: 'canceled', amount: 100 },
  { id: 'ORD004', customer: 'David', date: '2024-06-04', status: 'completed', amount: 250 },
  { id: 'ORD005', customer: 'Eve', date: '2024-06-05', status: 'pending', amount: 180 },
  { id: 'ORD006', customer: 'Frank', date: '2024-06-06', status: 'canceled', amount: 120 },
];

const statusColors = {
  completed: 'success',
  pending: 'warning',
  canceled: 'error',
};

export default function OrdersList() {
  const { filterType } = useParams();
  let filtered = mockOrders;
  if (filterType === 'completed') filtered = mockOrders.filter(o => o.status === 'completed');
  else if (filterType === 'pending') filtered = mockOrders.filter(o => o.status === 'pending');
  else if (filterType === 'canceled') filtered = mockOrders.filter(o => o.status === 'canceled');
  // else 'all' or unknown: show all

  return (
    <Box sx={{ maxWidth: 1100, mx: 'auto', mt: 6, p: 2 }}>
      <Typography variant="h4" color="primary" fontWeight={700} gutterBottom>
        {filterType === 'all' ? 'All Orders' : filterType.charAt(0).toUpperCase() + filterType.slice(1) + ' Orders'}
      </Typography>
      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Amount (₹)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((order, idx) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>{order.date}</TableCell>
                <TableCell>
                  <Chip label={order.status.charAt(0).toUpperCase() + order.status.slice(1)} color={statusColors[order.status]} />
                </TableCell>
                <TableCell>{order.amount}</TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">No orders found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
} 