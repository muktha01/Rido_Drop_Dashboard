import { useState } from 'react';
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Grid,
  Paper,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Tooltip
} from '@mui/material';
import {
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FilterList as FilterListIcon,
  ContentCopy as ContentCopyIcon
} from '@mui/icons-material';
import { useTickets } from '../../hooks/useTickets';
import dayjs from 'dayjs';

export default function TicketOverview() {
  const { tickets, loading, pagination, filters, stats, actions } = useTickets();
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [editFormData, setEditFormData] = useState({
    status: '',
    priority: ''
  });
  const [newComment, setNewComment] = useState('');
  const [addingComment, setAddingComment] = useState(false);

  // Handle search
  const handleSearch = (event) => {
    actions.updateFilters({ search: event.target.value });
  };

  // Handle filter change
  const handleFilterChange = (filterName, value) => {
    actions.updateFilters({ [filterName]: value });
  };

  // Handle page change
  const handleChangePage = (event, newPage) => {
    actions.updatePagination({ page: newPage + 1 });
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    actions.updatePagination({
      limit: parseInt(event.target.value, 10),
      page: 1
    });
  };

  // Open view dialog
  const openViewDialog = (ticket) => {
    setSelectedTicket(ticket);
    setViewDialogOpen(true);
  };

  // Open edit dialog
  const openEditDialog = (ticket) => {
    setSelectedTicket(ticket);
    setEditFormData({
      status: ticket.status,
      priority: ticket.priority
    });
    setEditDialogOpen(true);
  };

  // Open delete dialog
  const openDeleteDialog = (ticket) => {
    setSelectedTicket(ticket);
    setDeleteDialogOpen(true);
  };

  // Handle edit submit
  const handleEditSubmit = async () => {
    try {
      await actions.updateTicket(selectedTicket._id, editFormData);
      setSnackbar({ open: true, message: 'Ticket updated successfully', severity: 'success' });
      setEditDialogOpen(false);
      setSelectedTicket(null);
    } catch (err) {
      setSnackbar({ open: true, message: err.message || 'Failed to update ticket', severity: 'error' });
    }
  };

  // Handle delete
  const handleDelete = async () => {
    try {
      await actions.deleteTicket(selectedTicket._id);
      setSnackbar({ open: true, message: 'Ticket deleted successfully', severity: 'success' });
      setDeleteDialogOpen(false);
      setSelectedTicket(null);
    } catch (err) {
      setSnackbar({ open: true, message: err.message || 'Failed to delete ticket', severity: 'error' });
    }
  };

  // Handle add comment
  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    
    setAddingComment(true);
    try {
      await actions.addComment(selectedTicket._id, {
        userId: 'admin',
        userName: 'Support Admin',
        userType: 'admin',
        message: newComment.trim()
      });
      setNewComment('');
      setSnackbar({ open: true, message: 'Comment added successfully', severity: 'success' });
      // Refresh ticket details
      const updatedTickets = await actions.refresh();
      const updated = updatedTickets.find(t => t._id === selectedTicket._id);
      if (updated) setSelectedTicket(updated);
    } catch (err) {
      setSnackbar({ open: true, message: err.message || 'Failed to add comment', severity: 'error' });
    } finally {
      setAddingComment(false);
    }
  };

  // Copy to clipboard
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setSnackbar({ open: true, message: 'Copied to clipboard', severity: 'info' });
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Open':
        return 'error';
      case 'In Progress':
        return 'warning';
      case 'Resolved':
        return 'success';
      case 'Closed':
        return 'default';
      default:
        return 'default';
    }
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Urgent':
        return 'error';
      case 'High':
        return 'warning';
      case 'Medium':
        return 'info';
      case 'Low':
        return 'success';
      default:
        return 'default';
    }
  };

  // Format date
  const formatDate = (date) => {
    return dayjs(date).format('YYYY-MM-DD hh:mm A');
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600, color: 'primary.main' }}>
        🎫 Tickets Section
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#e3f2fd' }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1976d2' }}>
              {stats.total}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Total Tickets
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#ffebee' }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#d32f2f' }}>
              {stats.open}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Open
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#fff3e0' }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#f57c00' }}>
              {stats.inProgress}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              In Progress
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#e8f5e9' }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#388e3c' }}>
              {stats.resolved}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Resolved
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Ticket Overview (Table View) */}
      <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
        🔵 Ticket Overview (Table View)
      </Typography>

      <Card>
        {/* Search and Filters */}
        <Box sx={{ p: 2, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <TextField
            placeholder="Search by Ticket ID, Customer Name, Order ID..."
            value={filters.search}
            onChange={handleSearch}
            sx={{ flex: 1, minWidth: 250 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              )
            }}
          />

          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Status</InputLabel>
            <Select value={filters.status} label="Status" onChange={(e) => handleFilterChange('status', e.target.value)}>
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Open">Open</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Resolved">Resolved</MenuItem>
              <MenuItem value="Closed">Closed</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Priority</InputLabel>
            <Select value={filters.priority} label="Priority" onChange={(e) => handleFilterChange('priority', e.target.value)}>
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Low">Low</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="High">High</MenuItem>
              <MenuItem value="Urgent">Urgent</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 180 }}>
            <InputLabel>Issue Type</InputLabel>
            <Select value={filters.issueType} label="Issue Type" onChange={(e) => handleFilterChange('issueType', e.target.value)}>
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Delayed Delivery">Delayed Delivery</MenuItem>
              <MenuItem value="Payment Issue">Payment Issue</MenuItem>
              <MenuItem value="Payment Not Received">Payment Not Received</MenuItem>
              <MenuItem value="Damaged Parcel">Damaged Parcel</MenuItem>
              <MenuItem value="Agent Misbehavior">Agent Misbehavior</MenuItem>
              <MenuItem value="Wrong Address">Wrong Address</MenuItem>
              <MenuItem value="Missing Items">Missing Items</MenuItem>
              <MenuItem value="Order Assignment Problem">Order Assignment Problem</MenuItem>
              <MenuItem value="Customer Unavailable">Customer Unavailable</MenuItem>
              <MenuItem value="Vehicle Breakdown">Vehicle Breakdown</MenuItem>
              <MenuItem value="Accident/Emergency">Accident/Emergency</MenuItem>
              <MenuItem value="App Technical Issue">App Technical Issue</MenuItem>
              <MenuItem value="Wallet Issue">Wallet Issue</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Table */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                <TableCell sx={{ fontWeight: 600 }}>Ticket ID</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>User Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>User Type</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Subject</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Issue Type</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Priority</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Created At</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="center">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    <Typography>Loading...</Typography>
                  </TableCell>
                </TableRow>
              ) : tickets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    <Typography>No tickets found</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                tickets.map((ticket) => (
                  <TableRow key={ticket._id} hover>
                    <TableCell>{ticket.ticketId}</TableCell>
                    <TableCell>{ticket.userName || 'N/A'}</TableCell>
                    <TableCell>
                      <Chip 
                        label={ticket.userType} 
                        size="small" 
                        color={ticket.userType === 'customer' ? 'primary' : 'secondary'}
                      />
                    </TableCell>
                    <TableCell>{ticket.subject}</TableCell>
                    <TableCell>{ticket.issueType}</TableCell>
                    <TableCell>
                      <Chip label={ticket.status} color={getStatusColor(ticket.status)} size="small" />
                    </TableCell>
                    <TableCell>
                      <Chip label={ticket.priority} color={getPriorityColor(ticket.priority)} size="small" />
                    </TableCell>
                    <TableCell>{formatDate(ticket.createdAt)}</TableCell>
                    <TableCell align="center">
                      <Tooltip title="View Details">
                        <IconButton size="small" onClick={() => openViewDialog(ticket)} sx={{ color: 'info.main' }}>
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton size="small" onClick={() => openEditDialog(ticket)} sx={{ color: 'warning.main' }}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton size="small" onClick={() => openDeleteDialog(ticket)} sx={{ color: 'error.main' }}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <TablePagination
          component="div"
          count={pagination.total}
          page={pagination.page - 1}
          onPageChange={handleChangePage}
          rowsPerPage={pagination.limit}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[10, 20, 50, 100]}
        />
      </Card>

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white' }}>Ticket Details</DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {selectedTicket && (
            <Box>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">Ticket ID</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>{selectedTicket.ticketId}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">User Name</Typography>
                  <Typography variant="body1">{selectedTicket.userName || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">User Phone</Typography>
                  <Typography variant="body1">{selectedTicket.userPhone || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">User Type</Typography>
                  <Chip label={selectedTicket.userType} size="small" color={selectedTicket.userType === 'customer' ? 'primary' : 'secondary'} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">Order ID</Typography>
                  <Typography variant="body1">{selectedTicket.orderId || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary">Subject</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>{selectedTicket.subject}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">Issue Type</Typography>
                  <Typography variant="body1">{selectedTicket.issueType}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">Status</Typography>
                  <Chip label={selectedTicket.status} color={getStatusColor(selectedTicket.status)} size="small" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">Priority</Typography>
                  <Chip label={selectedTicket.priority} color={getPriorityColor(selectedTicket.priority)} size="small" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">Created At</Typography>
                  <Typography variant="body1">{formatDate(selectedTicket.createdAt)}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary">Description</Typography>
                  <Typography variant="body1">{selectedTicket.description}</Typography>
                </Grid>
                {selectedTicket.attachments && selectedTicket.attachments.length > 0 && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 1 }}>Attachments</Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {selectedTicket.attachments.map((url, idx) => (
                        <Box key={idx} component="img" src={url} alt={`Attachment ${idx + 1}`} 
                          sx={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 1, cursor: 'pointer' }}
                          onClick={() => window.open(url, '_blank')}
                        />
                      ))}
                    </Box>
                  </Grid>
                )}
                {selectedTicket.rating && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="textSecondary">Rating</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      {[...Array(5)].map((_, i) => (
                        <span key={i}>{i < selectedTicket.rating ? '⭐' : '☆'}</span>
                      ))}
                      <Typography variant="body2" sx={{ ml: 1 }}>({selectedTicket.rating}/5)</Typography>
                    </Box>
                  </Grid>
                )}
                {selectedTicket.feedback && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="textSecondary">Feedback</Typography>
                    <Typography variant="body1">{selectedTicket.feedback}</Typography>
                  </Grid>
                )}
              </Grid>

              {/* Comments Section */}
              {selectedTicket.comments && selectedTicket.comments.length > 0 && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>Comments ({selectedTicket.comments.length})</Typography>
                  {selectedTicket.comments.map((comment, idx) => (
                    <Paper key={idx} sx={{ p: 2, mb: 2, bgcolor: '#f5f5f5' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {comment.userName}
                          {comment.userType === 'admin' && (
                            <Chip label="Admin" size="small" color="info" sx={{ ml: 1 }} />
                          )}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {formatDate(comment.createdAt)}
                        </Typography>
                      </Box>
                      <Typography variant="body2">{comment.message}</Typography>
                      {comment.attachments && comment.attachments.length > 0 && (
                        <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                          {comment.attachments.map((url, i) => (
                            <Box key={i} component="img" src={url} alt={`Comment attachment ${i + 1}`}
                              sx={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 1, cursor: 'pointer' }}
                              onClick={() => window.open(url, '_blank')}
                            />
                          ))}
                        </Box>
                      )}
                    </Paper>
                  ))}
                </Box>
              )}

              {/* Add Comment */}
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>Add Comment</Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Type your response..."
                  variant="outlined"
                />
                <Button
                  variant="contained"
                  onClick={handleAddComment}
                  disabled={addingComment || !newComment.trim()}
                  sx={{ mt: 1 }}
                >
                  {addingComment ? 'Adding...' : 'Add Comment'}
                </Button>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Ticket</DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={editFormData.status}
                  label="Status"
                  onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                >
                  <MenuItem value="Open">Open</MenuItem>
                  <MenuItem value="In Progress">In Progress</MenuItem>
                  <MenuItem value="Resolved">Resolved</MenuItem>
                  <MenuItem value="Closed">Closed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={editFormData.priority}
                  label="Priority"
                  onChange={(e) => setEditFormData({ ...editFormData, priority: e.target.value })}
                >
                  <MenuItem value="Low">Low</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="High">High</MenuItem>
                  <MenuItem value="Urgent">Urgent</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleEditSubmit} variant="contained">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Delete Ticket</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete ticket {selectedTicket?.ticketId}? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
