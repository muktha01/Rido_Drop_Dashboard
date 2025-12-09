import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Paper, 
  Avatar, 
  Button, 
  Tabs, 
  Tab, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  TextField, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Chip, 
  Tooltip, 
  Grid, 
  Card, 
  CardContent, 
  Divider,
  Container,
  Stack,
  IconButton,
  CircularProgress
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PhoneIcon from '@mui/icons-material/Phone';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import AirportShuttleIcon from '@mui/icons-material/AirportShuttle';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ReplayIcon from '@mui/icons-material/Replay';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import EmailIcon from '@mui/icons-material/Email';
import BadgeIcon from '@mui/icons-material/Badge';
import BusinessIcon from '@mui/icons-material/Business';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import HistoryIcon from '@mui/icons-material/History';
import ReceiptIcon from '@mui/icons-material/Receipt';

// Import customer API
import { 
  getCustomerById, 
  getCustomerOrders, 
  getCustomerWalletDetails, 
  getCustomerReferralDetails 
} from '../../api/customerApi';

const vehicleTypes = [
  { label: '2W', icon: <DirectionsBikeIcon /> },
  { label: '3W', icon: <AirportShuttleIcon /> },
  { label: 'Truck', icon: <LocalShippingIcon /> }
];

const CustomerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // State for customer data
  const [customer, setCustomer] = useState(null);
  const [orders, setOrders] = useState({});
  const [walletDetails, setWalletDetails] = useState(null);
  const [referralDetails, setReferralDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // UI state
  const [tab, setTab] = useState(0);
  const [refundDialog, setRefundDialog] = useState(false);
  const [refundAmount, setRefundAmount] = useState('');
  const [balance, setBalance] = useState(0);
  const [bankDialog, setBankDialog] = useState(false);
  const [editBank, setEditBank] = useState({});
  const [bankDetails, setBankDetails] = useState({});
  const [addDialog, setAddDialog] = useState(false);
  const [addAmount, setAddAmount] = useState('');
  const [removeDialog, setRemoveDialog] = useState(false);
  const [removeAmount, setRemoveAmount] = useState('');
  const [txnDateFilter, setTxnDateFilter] = useState('all');
  const [txnCustomDate, setTxnCustomDate] = useState('');

  // Fetch customer data on component mount
  useEffect(() => {
    const fetchCustomerData = async () => {
      if (!id) {
        setError('Customer ID is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch customer basic details
        const customerData = await getCustomerById(id);
        console.log('Customer data received:', customerData);
        
        if (customerData.success && customerData.data) {
          const customer = customerData.data;
          setCustomer(customer);
          setBalance(customer.wallet?.balance || 0);
          setBankDetails(customer.bank || {});
          setEditBank(customer.bank || {});

          // Fetch additional customer details in parallel
          const [ordersData, walletData, referralData] = await Promise.allSettled([
            getCustomerOrders(id),
            getCustomerWalletDetails(id),
            getCustomerReferralDetails(id)
          ]);

          // Process orders data
          if (ordersData.status === 'fulfilled' && ordersData.value.success) {
            setOrders(ordersData.value.data || {});
          }

          // Process wallet data
          if (walletData.status === 'fulfilled' && walletData.value.success) {
            setWalletDetails(walletData.value.data);
            if (walletData.value.data.balance !== undefined) {
              setBalance(walletData.value.data.balance);
            }
          }

          // Process referral data
          if (referralData.status === 'fulfilled' && referralData.value.success) {
            setReferralDetails(referralData.value.data);
          }
        } else {
          setError('Customer not found');
        }
      } catch (err) {
        console.error('Error fetching customer data:', err);
        setError(err.message || 'Failed to load customer data');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerData();
  }, [id]);

  // Helper function to filter transactions by date
  const filterTransactions = (transactions) => {
    if (!transactions || !Array.isArray(transactions)) return [];
    if (txnDateFilter === 'all') return transactions;
    const now = new Date();
    return transactions.filter(txn => {
      const txnDate = new Date(txn.createdAt || txn.date);
      if (txnDateFilter === 'today') {
        return txnDate.toDateString() === now.toDateString();
      } else if (txnDateFilter === 'week') {
        const weekAgo = new Date(now);
        weekAgo.setDate(now.getDate() - 7);
        return txnDate >= weekAgo && txnDate <= now;
      } else if (txnDateFilter === 'month') {
        return txnDate.getMonth() === now.getMonth() && txnDate.getFullYear() === now.getFullYear();
      } else if (txnDateFilter === 'year') {
        return txnDate.getFullYear() === now.getFullYear();
      } else if (txnDateFilter === 'custom' && txnCustomDate) {
        return txnDate.toDateString() === new Date(txnCustomDate).toDateString();
      }
      return true;
    });
  };

  // Show loading state
  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh' 
      }}>
        <CircularProgress />
      </Box>
    );
  }

  // Show error state
  if (error || !customer) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh',
        gap: 2
      }}>
        <Typography variant="h6" color="error">
          {error || 'Customer not found'}
        </Typography>
        <Button variant="contained" onClick={() => navigate('/dashboard/customers')}>
          Back to Customers
        </Button>
      </Box>
    );
  }

  const handleRefund = () => {
    const amt = parseFloat(refundAmount);
    if (!isNaN(amt) && amt > 0 && amt <= balance) {
      setBalance((prev) => prev - amt); // Subtract refund from balance
      setRefundDialog(false);
      setRefundAmount('');
    }
  };

  const handleAddAmount = () => {
    const amt = parseFloat(addAmount);
    if (!isNaN(amt) && amt > 0) {
      setBalance((prev) => prev + amt);
      setAddDialog(false);
      setAddAmount('');
    }
  };

  const handleRemoveAmount = () => {
    const amt = parseFloat(removeAmount);
    if (!isNaN(amt) && amt > 0 && amt <= balance) {
      setBalance((prev) => prev - amt);
      setRemoveDialog(false);
      setRemoveAmount('');
    }
  };

  const handleBankEditOpen = () => {
    setEditBank({ ...bankDetails });
    setBankDialog(true);
  };
  const handleBankEditChange = (e) => {
    const { name, value } = e.target;
    setEditBank((prev) => ({ ...prev, [name]: value }));
  };
  const handleBankEditSave = () => {
    setBankDetails({ ...editBank });
    setBankDialog(false);
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      bgcolor: 'background.default', 
      py: 3,
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
    }}>
      <Container maxWidth="xl">
        {/* Header with Back Button */}
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
          <IconButton 
            onClick={() => navigate(-1)} 
            sx={{ 
              mr: 2, 
              bgcolor: 'white', 
              boxShadow: 2,
              '&:hover': { bgcolor: 'grey.100' }
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
            Customer Details
          </Typography>
        </Box>

        {/* Main Content Grid */}
        <Grid container spacing={3} alignItems="stretch">
          {/* Profile Details Card - Left Side */}
          <Grid item xs={12} md={8}>
            <Card sx={{ borderRadius: 4, boxShadow: 4, p: 0, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', minHeight: 340, height: '100%' }}>
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <Avatar 
                  sx={{ width: 110, height: 110, mx: 'auto', mb: 2, border: '5px solid #fff', boxShadow: 3, fontSize: 48, bgcolor: 'rgba(255,255,255,0.15)' }}
                >
                  {(customer.firstName && customer.firstName[0]) || (customer.name && customer.name[0]) || 'U'}
                </Avatar>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, letterSpacing: 1 }}>
                  {customer.firstName && customer.lastName 
                    ? `${customer.firstName} ${customer.lastName}` 
                    : customer.name || 'Unknown User'}
                </Typography>
                <Chip 
                  label={customer.isBlocked ? 'Blocked' : 'Active'} 
                  color={customer.isBlocked ? 'error' : 'success'} 
                  size="medium" 
                  sx={{ fontWeight: 600, bgcolor: customer.isBlocked ? 'rgba(244, 67, 54, 0.9)' : 'rgba(76, 175, 80, 0.9)', color: 'white', mb: 2 }} 
                />
                <Divider sx={{ my: 2, bgcolor: 'rgba(255,255,255,0.2)' }} />
                <Box sx={{ textAlign: 'left', color: 'white', pl: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <PhoneIcon sx={{ mr: 1, color: 'white' }} />
                    <Typography variant="body1">{customer.mobile || 'Not provided'}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <EmailIcon sx={{ mr: 1, color: 'white' }} />
                    <Typography variant="body1">{customer.email || 'Not provided'}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <BadgeIcon sx={{ mr: 1, color: 'white' }} />
                    <Typography variant="body1">{customer._id || customer.customerId || 'N/A'}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CalendarTodayIcon sx={{ mr: 1, color: 'white' }} />
                    <Typography variant="body1">
                      {customer.createdAt 
                        ? new Date(customer.createdAt).toLocaleDateString() 
                        : customer.joiningDate || 'Unknown'}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <LocationOnIcon sx={{ mr: 1, color: 'white' }} />
                    <Typography variant="body1">{customer.address || 'Address not provided'}</Typography>
                  </Box>
                </Box>
              </Box>
            </Card>
          </Grid>

          {/* Right Side: Bank Details Card + Wallet Card */}
          <Grid item xs={12} md={4}>
            <Stack spacing={3} sx={{ height: '100%' }}>
              {/* Bank Details Card */}
              <Card sx={{ borderRadius: 4, boxShadow: 4, p: 0, background: 'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)', minHeight: 180, maxWidth: 400, mx: 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', color: 'primary.main' }}>
                      <AccountBalanceIcon sx={{ mr: 1 }} />
                      Bank Details
                    </Typography>
                    <Button variant="outlined" size="small" onClick={handleBankEditOpen} sx={{ fontWeight: 600 }}>
                      Update
                    </Button>
                  </Box>
                  <Box sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                    <BusinessIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="body2" color="text.secondary">{bankDetails.bankName}</Typography>
                  </Box>
                  <Box sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                    <CreditCardIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="body2" color="text.secondary">{bankDetails.accountNumber}</Typography>
                  </Box>
                  <Box sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                    <AccountCircleIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="body2" color="text.secondary">{bankDetails.holder}</Typography>
                  </Box>
                  <Box sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                    <BadgeIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="body2" color="text.secondary">{bankDetails.ifsc}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <LocationOnIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="body2" color="text.secondary">{bankDetails.branch}</Typography>
                  </Box>
                </CardContent>
              </Card>
              {/* Wallet Card */}
              <Card sx={{ borderRadius: 4, boxShadow: 4, mt: 0, background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white', textAlign: 'center', minHeight: 180, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <CardContent>
                  <AccountBalanceWalletIcon sx={{ fontSize: 48, mb: 2, opacity: 0.9 }} />
                  <Typography variant="h6" sx={{ mb: 1, opacity: 0.9 }}>
                    Wallet Balance
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 700 }}>
                    ₹{balance.toLocaleString()}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
                    <Button variant="contained" color="success" sx={{ borderRadius: 2, fontWeight: 600 }} onClick={() => setAddDialog(true)}>
                      Add Amount
                    </Button>
                    <Button variant="contained" color="error" sx={{ borderRadius: 2, fontWeight: 600 }} onClick={() => setRemoveDialog(true)}>
                      Remove Amount
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Stack>
          </Grid>
        </Grid>

        {/* Order History Card */}
        <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center' }}>
              <ReceiptIcon sx={{ mr: 1, color: 'primary.main' }} />
              Order History
            </Typography>
            <Tabs 
              value={tab} 
              onChange={(_, v) => setTab(v)} 
              sx={{ 
                mb: 3,
                '& .MuiTab-root': {
                  minHeight: 48,
                  borderRadius: 2,
                  mx: 0.5
                }
              }}
            >
              {vehicleTypes.map((type, idx) => (
                <Tab 
                  key={type.label} 
                  label={type.label} 
                  icon={type.icon} 
                  iconPosition="start" 
                  sx={{ 
                    bgcolor: tab === idx ? 'primary.light' : 'transparent',
                    color: tab === idx ? 'white' : 'text.primary',
                    '&:hover': {
                      bgcolor: tab === idx ? 'primary.main' : 'grey.100'
                    }
                  }}
                />
              ))}
            </Tabs>
            <TableContainer sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'grey.50' }}>
                    <TableCell sx={{ fontWeight: 600 }}>S. No.</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Order ID</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Amount (₹)</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Driver</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(orders[vehicleTypes[tab].label] || []).map((order, idx) => (
                    <TableRow 
                      key={idx} 
                      sx={{ 
                        background: order.status === 'Completed' ? 'rgba(76, 175, 80, 0.05)' : order.status === 'Canceled' ? 'rgba(244, 67, 54, 0.05)' : 'inherit',
                        '&:hover': { bgcolor: 'grey.50' }
                      }}
                    >
                      <TableCell>{idx + 1}</TableCell>
                      <TableCell sx={{ fontWeight: 500 }}>{order.orderId}</TableCell>
                      <TableCell>{order.date}</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: 'primary.main' }}>₹{order.amount}</TableCell>
                      <TableCell>
                        <Chip 
                          label={order.status} 
                          color={order.status === 'Completed' ? 'success' : order.status === 'Canceled' ? 'error' : 'default'} 
                          size="small" 
                          sx={{ fontWeight: 600 }}
                        />
                      </TableCell>
                      <TableCell>
                        {order.status === 'Completed' && order.driver ? (
                          <Tooltip title={`Mobile: ${order.driverMobile}`}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <AccountCircleIcon color="primary" sx={{ mr: 0.5, fontSize: 16 }} />
                              <Typography variant="body2">{order.driver}</Typography>
                            </Box>
                          </Tooltip>
                        ) : (
                          <Typography variant="body2" color="text.secondary">-</Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Transaction History Card */}
        <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center' }}>
              <HistoryIcon sx={{ mr: 1, color: 'primary.main' }} />
              Transaction History
            </Typography>
            {/* Filter Buttons */}
            <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
              <Button variant={txnDateFilter === 'all' ? 'contained' : 'outlined'} onClick={() => setTxnDateFilter('all')}>All</Button>
              <Button variant={txnDateFilter === 'today' ? 'contained' : 'outlined'} onClick={() => setTxnDateFilter('today')}>Today</Button>
              <Button variant={txnDateFilter === 'week' ? 'contained' : 'outlined'} onClick={() => setTxnDateFilter('week')}>Weekly</Button>
              <Button variant={txnDateFilter === 'month' ? 'contained' : 'outlined'} onClick={() => setTxnDateFilter('month')}>Monthly</Button>
              <Button variant={txnDateFilter === 'year' ? 'contained' : 'outlined'} onClick={() => setTxnDateFilter('year')}>Yearly</Button>
              <Button variant={txnDateFilter === 'custom' ? 'contained' : 'outlined'} onClick={() => setTxnDateFilter('custom')}>Custom Date</Button>
              {txnDateFilter === 'custom' && (
                <TextField
                  type="date"
                  size="small"
                  value={txnCustomDate}
                  onChange={e => setTxnCustomDate(e.target.value)}
                  sx={{ ml: 1, minWidth: 150 }}
                />
              )}
            </Box>
            <TableContainer sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
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
                  {filterTransactions(walletDetails?.transactions || []).map((txn, idx) => (
                    <TableRow key={idx} sx={{ '&:hover': { bgcolor: 'grey.50' } }}>
                      <TableCell>{idx + 1}</TableCell>
                      <TableCell sx={{ fontWeight: 500 }}>{txn._id || txn.id}</TableCell>
                      <TableCell>
                        {txn.createdAt 
                          ? new Date(txn.createdAt).toLocaleDateString() 
                          : txn.date || 'N/A'}
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={txn.type || txn.transactionType || 'Unknown'} 
                          size="small" 
                          sx={{ 
                            bgcolor: (txn.type === 'Top Up' || txn.type === 'credit') ? 'success.light' : 
                                    (txn.type === 'Refund') ? 'warning.light' : 'error.light',
                            color: (txn.type === 'Top Up' || txn.type === 'credit') ? 'success.dark' : 
                                  (txn.type === 'Refund') ? 'warning.dark' : 'error.dark',
                            fontWeight: 600
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ 
                        fontWeight: 600, 
                        color: txn.amount < 0 ? 'error.main' : 'success.main',
                        display: 'flex',
                        alignItems: 'center'
                      }}>
                        {txn.amount < 0 ? (
                          <ArrowDownwardIcon fontSize="small" color="error" sx={{ mr: 0.5 }} />
                        ) : (
                          <ArrowUpwardIcon fontSize="small" color="success" sx={{ mr: 0.5 }} />
                        )}
                        ₹{Math.abs(txn.amount)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Refund Dialog */}
        <Dialog open={refundDialog} onClose={() => setRefundDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white' }}>
            Process Refund
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <TextField
              label="Refund Amount"
              type="number"
              value={refundAmount}
              onChange={(e) => setRefundAmount(e.target.value)}
              fullWidth
              margin="normal"
              inputProps={{ min: 1, max: balance }}
              sx={{ mb: 2 }}
            />
            <Typography variant="body2" color="text.secondary">
              Current Balance: ₹{balance.toLocaleString()}
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button 
              onClick={() => setRefundDialog(false)}
              variant="outlined"
              sx={{ borderRadius: 2 }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleRefund} 
              variant="contained" 
              color="primary" 
              disabled={!refundAmount || parseFloat(refundAmount) <= 0 || parseFloat(refundAmount) > balance}
              sx={{ borderRadius: 2 }}
            >
              Process Refund
            </Button>
          </DialogActions>
        </Dialog>

        {/* Bank Details Update Dialog */}
        <Dialog open={bankDialog} onClose={() => setBankDialog(false)} maxWidth="xs" fullWidth>
          <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white' }}>Update Bank Details</DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <TextField
              label="Bank Name"
              name="bankName"
              value={editBank.bankName}
              onChange={handleBankEditChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Account Number"
              name="accountNumber"
              value={editBank.accountNumber}
              onChange={handleBankEditChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Account Holder"
              name="holder"
              value={editBank.holder}
              onChange={handleBankEditChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="IFSC Code"
              name="ifsc"
              value={editBank.ifsc}
              onChange={handleBankEditChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Branch"
              name="branch"
              value={editBank.branch}
              onChange={handleBankEditChange}
              fullWidth
              margin="normal"
            />
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setBankDialog(false)} variant="outlined" sx={{ borderRadius: 2 }}>
              Cancel
            </Button>
            <Button onClick={handleBankEditSave} variant="contained" color="primary" sx={{ borderRadius: 2 }}>
              Save
            </Button>
          </DialogActions>
        </Dialog>

        {/* Add Amount Dialog */}
        <Dialog open={addDialog} onClose={() => setAddDialog(false)} maxWidth="xs" fullWidth>
          <DialogTitle sx={{ bgcolor: 'success.main', color: 'white' }}>Add Amount</DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <TextField
              label="Amount to Add"
              type="number"
              value={addAmount}
              onChange={e => setAddAmount(e.target.value)}
              fullWidth
              margin="normal"
              inputProps={{ min: 1 }}
            />
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setAddDialog(false)} variant="outlined" sx={{ borderRadius: 2 }}>
              Cancel
            </Button>
            <Button onClick={handleAddAmount} variant="contained" color="success" sx={{ borderRadius: 2 }} disabled={!addAmount || parseFloat(addAmount) <= 0}>
              Add
            </Button>
          </DialogActions>
        </Dialog>

        {/* Remove Amount Dialog */}
        <Dialog open={removeDialog} onClose={() => setRemoveDialog(false)} maxWidth="xs" fullWidth>
          <DialogTitle sx={{ bgcolor: 'error.main', color: 'white' }}>Remove Amount</DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <TextField
              label="Amount to Remove"
              type="number"
              value={removeAmount}
              onChange={e => setRemoveAmount(e.target.value)}
              fullWidth
              margin="normal"
              inputProps={{ min: 1, max: balance }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Current Balance: ₹{balance.toLocaleString()}
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setRemoveDialog(false)} variant="outlined" sx={{ borderRadius: 2 }}>
              Cancel
            </Button>
            <Button onClick={handleRemoveAmount} variant="contained" color="error" sx={{ borderRadius: 2 }} disabled={!removeAmount || parseFloat(removeAmount) <= 0 || parseFloat(removeAmount) > balance}>
              Remove
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default CustomerDetail; 