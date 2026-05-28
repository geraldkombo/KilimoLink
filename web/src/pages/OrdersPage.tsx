import { useEffect, useState } from 'react';
import { Box, Container, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Stack, Button, CircularProgress, IconButton } from '@mui/material';
import { motion } from 'framer-motion';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';

export function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get('/orders');
        setOrders(res.data.orders ?? res.data ?? []);
      } catch (err) {
        console.error('Failed to fetch orders', err);
        setError('Failed to load orders. Please ensure you are logged in.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED': return { bg: '#ecfdf5', text: '#065f46' };
      case 'CONFIRMED': return { bg: '#eff6ff', text: '#1e40af' };
      case 'PENDING': return { bg: '#fffbeb', text: '#92400e' };
      case 'CANCELLED': return { bg: '#fef2f2', text: '#991b1b' };
      default: return { bg: '#f9fafb', text: '#374151' };
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ mb: 6, display: 'flex', alignItems: 'center', gap: 3 }}>
        <IconButton onClick={() => navigate('/')} sx={{ bgcolor: '#f0fdf4', color: '#064e3b', '&:hover': { bgcolor: '#dcfce7' } }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h3" sx={{ fontWeight: 900, letterSpacing: '-0.04em', color: '#064e3b' }}>
          Your Orders
        </Typography>
      </Box>
      
      {loading ? (
        <Box sx={{ textAlign: 'center', py: 12 }}>
          <CircularProgress sx={{ color: '#064e3b' }} />
          <Typography sx={{ mt: 3, fontWeight: 600, color: '#374151' }}>Fetching your orders...</Typography>
        </Box>
      ) : error ? (
        <Paper sx={{ p: 6, textAlign: 'center', bgcolor: '#fef2f2', borderRadius: 6, border: '1px solid #fecaca' }}>
          <Typography color="#991b1b" variant="h6" sx={{ fontWeight: 800, mb: 3 }}>{error}</Typography>
          <Button variant="contained" sx={{ bgcolor: '#064e3b', borderRadius: 4, px: 6, fontWeight: 800 }} onClick={() => window.location.reload()}>Retry</Button>
        </Paper>
      ) : orders.length === 0 ? (
        <Box sx={{ py: 15, textAlign: 'center', bgcolor: '#f9fafb', borderRadius: 8, border: '2px dashed #e5e7eb' }}>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#374151', mb: 2 }}>No orders found yet</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 5 }}>When you buy fresh produce, your orders will appear here.</Typography>
          <Button variant="contained" sx={{ bgcolor: '#064e3b', borderRadius: 4, px: 6, py: 1.5, fontWeight: 900 }} onClick={() => navigate('/market')}>
            Browse Marketplace
          </Button>
        </Box>
      ) : (
        <TableContainer component={motion.div} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} sx={{ borderRadius: 6, boxShadow: '0 10px 30px rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.05)', overflow: 'hidden' }}>
          <Table>
                <TableHead sx={{ bgcolor: '#f9fafb' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 800, py: 3 }}>Order ID</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Product</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Farmer Phone</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Amount</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders.map((order) => {
                    const status = getStatusColor(order.status);
                    const farmerPhone = order.items[0]?.product?.farmer?.phone;
                    return (
                      <TableRow key={order.id} sx={{ '&:hover': { bgcolor: '#fcfcfc' } }}>
                        <TableCell sx={{ fontWeight: 700, color: '#6b7280' }}>#{order.id.slice(-6).toUpperCase()}</TableCell>
                        <TableCell sx={{ fontWeight: 800, color: '#111827' }}>
                          {order.items[0]?.product?.title || 'Fresh Produce'}
                          {order.items.length > 1 && (
                            <Typography component="span" variant="caption" sx={{ ml: 1, color: '#059669', fontWeight: 700 }}>
                              +{order.items.length - 1} more
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          {farmerPhone ? (
                            <Typography sx={{ fontWeight: 800, color: '#064e3b', fontSize: '0.9rem' }}>
                              📞 {farmerPhone}
                            </Typography>
                          ) : (
                            <Typography variant="caption" color="text.secondary">Not provided</Typography>
                          )}
                        </TableCell>
                        <TableCell sx={{ fontWeight: 900, color: '#064e3b' }}>KES {order.totalAmount}</TableCell>
                        <TableCell>
                          <Chip 
                            label={order.status} 
                            size="small" 
                            sx={{ 
                              fontWeight: 800, 
                              bgcolor: status.bg, 
                              color: status.text,
                              borderRadius: 2
                            }} 
                          />
                        </TableCell>
                        <TableCell sx={{ fontWeight: 500, color: '#6b7280' }}>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                      </TableRow>
                    );
                  })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
}
