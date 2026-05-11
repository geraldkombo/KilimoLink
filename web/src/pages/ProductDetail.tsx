import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Button, Container, Grid, Paper, Typography, Chip, Switch, FormControlLabel, Divider, Alert } from '@mui/material';
import { api } from '../services/api';
import { usePrivy } from '@privy-io/react-auth';

export function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { authenticated, login, sendTransaction } = usePrivy();
  const [product, setProduct] = useState<any>(null);
  const [useCrypto, setUseCrypto] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      const res = await api.get(`/products`);
      const p = res.data.find((item: any) => item.id === id);
      setProduct(p);
    };
    fetchProduct();
  }, [id]);

  const handleOrder = async () => {
    if (!authenticated) {
      login();
      return;
    }

    setLoading(true);
    try {
      if (useCrypto) {
        // Mocking farmer wallet address
        const tx = await sendTransaction({
          to: '84YBJeHew5F7NwzjLU9sqK4C7STR7XUZYugKFUscuGEd',
          value: '1000000', // 0.001 SOL in lamports
        });
        if (!tx) throw new Error('Transaction failed');
      }

      await api.post('/orders', {
        productId: id,
        quantity: 1,
        paymentMethod: useCrypto ? 'CRYPTO' : 'MOCK'
      });
      
      setSuccess(true);
      setTimeout(() => navigate('/orders'), 2000);
    } catch (err) {
      console.error('Order failed', err);
    } finally {
      setLoading(false);
    }
  };

  if (!product) return <Typography>Loading...</Typography>;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {success && <Alert severity="success" sx={{ mb: 2 }}>Order placed successfully! Redirecting...</Alert>}
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ borderRadius: 4, overflow: 'hidden' }}>
            <img 
              src={product.imageUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80'} 
              alt={product.title}
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box>
            <Chip label={product.category} color="primary" sx={{ mb: 2 }} />
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>{product.title}</Typography>
            <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold', mb: 3 }}>
              KES {product.price}
            </Typography>
            
            <Typography variant="body1" color="text.secondary" paragraph>
              {product.description || 'No description provided.'}
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>FARMER INFO</Typography>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{product.farmer?.name || 'Local Farmer'}</Typography>
              <Typography variant="body2">{product.location?.address || 'Nairobi, Kenya'}</Typography>
            </Box>

            <Paper variant="outlined" sx={{ p: 2, mb: 3, borderRadius: 3, bgcolor: '#f9f9f9' }}>
              <FormControlLabel
                control={<Switch checked={useCrypto} onChange={(e) => setUseCrypto(e.target.value === 'true')} />}
                label="Pay with Solana (Devnet Demo)"
              />
              <Typography variant="caption" display="block" color="text.secondary">
                {useCrypto ? '0.001 SOL will be sent to the farmer' : 'Mock payment will be used'}
              </Typography>
            </Paper>

            <Button 
              fullWidth 
              variant="contained" 
              size="large" 
              onClick={handleOrder}
              disabled={loading}
              sx={{ py: 2, borderRadius: 3, bgcolor: '#2e7d32', fontSize: '1.1rem' }}
            >
              {loading ? 'Processing...' : 'Place Order Now'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}
