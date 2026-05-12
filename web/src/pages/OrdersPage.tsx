import { useEffect, useState } from 'react';
import { Box, Container, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Stack, Button, CircularProgress } from '@mui/material';
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
        setOrders(res.data);
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
      case 'DELIVERED': return 'success';
      case 'CONFIRMED': return 'primary';
      case 'PENDING': return 'warning';
      case 'CANCELLED': return 'error';
      default: return 'default';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button variant="outlined" onClick={() => navigate('/')} size="small">
          Back Home
        </Button>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>Your Orders</Typography>
      </Box>
      
      {loading ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <CircularProgress color="success" />
          <Typography sx={{ mt: 2 }}>Fetching your orders...</Typography>
        </Box>
      ) : error ? (
        <Paper sx={{ p: 4, textAlign: 'center', bgcolor: '#f5f5f5' }}>
          <Typography color="error" gutterBottom>{error}</Typography>
          <Button variant="contained" color="success" onClick={() => window.location.reload()}>Retry</Button>
        </Paper>
      ) : orders.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography color="text.secondary">No orders found yet.</Typography>
          <Button variant="contained" color="success" onClick={() => navigate('/market')} sx={{ mt: 2 }}>
            Go to Marketplace
          </Button>
        </Paper>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
          <Table>
            <TableHead sx={{ bgcolor: '#f5f5f5' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Order ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Product</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Amount</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Payment</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>#{order.id.slice(-6).toUpperCase()}</TableCell>
                  <TableCell>
                    {order.items[0]?.product?.title || 'Unknown Product'}
                    {order.items.length > 1 && ` + ${order.items.length - 1} more`}
                  </TableCell>
                  <TableCell>KES {order.totalAmount}</TableCell>
                  <TableCell>
                    <Chip label={order.paymentMethod} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell>
                    <Chip label={order.status} size="small" color={getStatusColor(order.status) as any} />
                  </TableCell>
                  <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
}
