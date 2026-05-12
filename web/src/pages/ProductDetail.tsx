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
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setFetching(true);
      setError(null);
      try {
        const res = await api.get(`/products`);
        const p = res.data.find((item: any) => item.id === id);
        if (p) {
          setProduct(p);
        } else {
          setError('Product not found.');
        }
      } catch (err) {
        console.error('Failed to fetch product', err);
        setError('Failed to load product details.');
      } finally {
        setFetching(false);
      }
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
        const tx = await sendTransaction({
          to: '84YBJeHew5F7NwzjLU9sqK4C7STR7XUZYugKFUscuGEd',
          value: '1000000', 
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
    } catch (err: any) {
      console.error('Order failed', err);
      alert(err.response?.data?.message || 'Failed to place order.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return (
    <Container sx={{ py: 12, textAlign: 'center' }}>
      <CircularProgress color="success" />
      <Typography sx={{ mt: 2 }}>Fetching product details...</Typography>
    </Container>
  );

  if (error || !product) return (
    <Container sx={{ py: 12, textAlign: 'center' }}>
      <Typography color="error" variant="h5" sx={{ fontWeight: 800, mb: 3 }}>{error || 'Product not found'}</Typography>
      <Button variant="contained" component={Link} to="/market" sx={{ bgcolor: '#1b5e20', borderRadius: 3, px: 4 }}>
        Back to Marketplace
      </Button>
    </Container>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <IconButton onClick={() => navigate(-1)} sx={{ bgcolor: '#f5f5f5', mb: 2 }}>
          <ArrowBackIcon />
        </IconButton>
      </Box>

      {success && (
        <Fade in>
          <Alert severity="success" sx={{ mb: 4, borderRadius: 4, fontWeight: 700 }}>
            Order placed successfully! Redirecting to your orders...
          </Alert>
        </Fade>
      )}

      <Grid container spacing={8}>
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ borderRadius: 8, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.1)', border: '1px solid rgba(0,0,0,0.05)' }}>
            <img 
              src={product.imageUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80'} 
              alt={product.title}
              style={{ width: '100%', height: '500px', objectFit: 'cover', display: 'block' }}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box>
            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
              <Chip label={product.category} sx={{ fontWeight: 700, bgcolor: '#e8f5e9', color: '#2e7d32', border: 'none' }} />
              <Chip label="Fresh Harvest" variant="outlined" sx={{ fontWeight: 700 }} />
            </Stack>

            <Typography variant="h2" sx={{ fontWeight: 900, mb: 1, letterSpacing: '-0.03em' }}>{product.title}</Typography>
            <Typography variant="h3" sx={{ fontWeight: 900, color: '#1b5e20', mb: 4 }}>
              KES {product.price}
            </Typography>
            
            <Typography variant="body1" sx={{ color: '#555', lineHeight: 1.8, fontSize: '1.1rem', mb: 4 }}>
              {product.description || 'This high-quality produce is sourced directly from urban farmers committed to sustainable agriculture and food resilience.'}
            </Typography>

            <Divider sx={{ my: 4 }} />

            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ width: 48, height: 48, borderRadius: '50%', bgcolor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                👨‍🌾
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 700 }}>FARMER INFO</Typography>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>{product.farmer?.name || 'Local Farmer'}</Typography>
                <Typography variant="body2" color="text.secondary">{product.location?.address || 'Nairobi, Kenya'}</Typography>
              </Box>
            </Box>

            <Paper variant="outlined" sx={{ p: 3, mb: 4, borderRadius: 5, bgcolor: '#fcfcfc', border: '1px solid #eee' }}>
              <FormControlLabel
                control={<Switch checked={useCrypto} onChange={(e) => setUseCrypto(e.target.checked)} color="success" />}
                label={<Typography sx={{ fontWeight: 700 }}>Pay with Solana (Devnet Demo)</Typography>}
              />
              <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                {useCrypto 
                  ? '0.001 SOL will be transferred securely to the farmer.' 
                  : 'A mock payment reference will be generated for this transaction.'}
              </Typography>
            </Paper>

            <Button 
              fullWidth 
              variant="contained" 
              size="large" 
              onClick={handleOrder}
              disabled={loading}
              sx={{ 
                py: 2.5, 
                borderRadius: 5, 
                bgcolor: '#1b5e20', 
                fontSize: '1.2rem', 
                fontWeight: 900,
                boxShadow: '0 10px 30px rgba(27, 94, 32, 0.2)',
                '&:hover': { bgcolor: '#2e7d32', boxShadow: '0 15px 40px rgba(27, 94, 32, 0.3)' }
              }}
            >
              {loading ? 'Processing Transaction...' : 'Confirm and Place Order'}
            </Button>
            <Typography variant="caption" display="block" align="center" sx={{ mt: 2, color: 'text.secondary' }}>
              Secure transaction powered by Solana & Privy.
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}
