import { useEffect, useState } from 'react';
import { CircularProgress, Link, IconButton, Fade, Stack } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { Box, Button, Container, Grid, Paper, Typography, Chip, Switch, FormControlLabel, Divider, Alert } from '@mui/material';
import { api } from '../services/api';
import { usePrivy } from '@privy-io/react-auth';

const CATEGORY_IMAGES: Record<string, string> = {
  Vegetables: 'https://images.unsplash.com/photo-1524179091875-bf99a9a6af97?auto=format&fit=crop&w=800&q=80',
  Fruits: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=800&q=80',
  Dairy: 'https://images.unsplash.com/photo-1550583724-1255818c0533?auto=format&fit=crop&w=800&q=80',
  Grains: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80',
  Meat: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=800&q=80',
  Honey: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80',
  'Poultry & Eggs': 'https://images.unsplash.com/photo-1568654952584-b3c6e1d8c1f4?auto=format&fit=crop&w=800&q=80',
  Tubers: 'https://images.unsplash.com/photo-1590164741170-4f9e5bccb33c?auto=format&fit=crop&w=800&q=80',
};

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
        const res = await api.get(`/products/${id}`);
        setProduct(res.data);
      } catch (err: any) {
        console.error('Failed to fetch product', err);
        setError(err.response?.status === 404 ? 'Product not found.' : 'Failed to load product details.');
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
      setError(err.response?.data?.message || 'Failed to place order.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return (
    <Container sx={{ py: 15, textAlign: 'center' }}>
      <CircularProgress sx={{ color: '#064e3b' }} />
      <Typography sx={{ mt: 3, fontWeight: 700, color: '#374151' }}>Fetching product details...</Typography>
    </Container>
  );

  if (error || !product) return (
    <Container sx={{ py: 15, textAlign: 'center' }}>
      <Typography color="#991b1b" variant="h4" sx={{ fontWeight: 900, mb: 4 }}>{error || 'Product not found'}</Typography>
      <Button variant="contained" component={RouterLink} to="/market" sx={{ bgcolor: '#064e3b', borderRadius: 4, px: 6, py: 1.5, fontWeight: 900 }}>
        Back to Marketplace
      </Button>
    </Container>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ mb: 6 }}>
        <IconButton onClick={() => navigate(-1)} sx={{ bgcolor: '#f0fdf4', color: '#064e3b', '&:hover': { bgcolor: '#dcfce7' }, mb: 2 }}>
          <ArrowBackIcon />
        </IconButton>
      </Box>

      {success && (
        <Fade in>
          <Alert severity="success" sx={{ mb: 6, borderRadius: 4, fontWeight: 800, bgcolor: '#ecfdf5', color: '#065f46', border: '1px solid #dcfce7' }}>
            Order placed successfully! Redirecting to your orders...
          </Alert>
        </Fade>
      )}

      <Grid container spacing={10}>
        <Grid item xs={12} md={6}>
          <Box sx={{ position: 'sticky', top: 100 }}>
            <Paper elevation={0} sx={{ borderRadius: 8, overflow: 'hidden', boxShadow: '0 40px 80px rgba(0,0,0,0.12)', border: '1px solid rgba(0,0,0,0.05)' }}>
              <img 
                src={product.imageUrl || CATEGORY_IMAGES[product.category] || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80'} 
                alt={product.title}
                style={{ width: '100%', height: 'auto', maxHeight: '600px', objectFit: 'cover', display: 'block' }}
              />
            </Paper>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box>
            <Stack direction="row" spacing={1.5} sx={{ mb: 3 }}>
              <Chip 
                label={product.category} 
                sx={{ fontWeight: 800, bgcolor: '#f0fdf4', color: '#064e3b', border: 'none', px: 1 }} 
              />
              <Chip 
                label="Direct from Farm" 
                variant="outlined" 
                sx={{ fontWeight: 700, borderColor: '#d1d5db', color: '#374151' }} 
              />
            </Stack>

            <Typography variant="h2" sx={{ fontWeight: 950, mb: 1, letterSpacing: '-0.05em', color: '#111827', lineHeight: 1.1 }}>
              {product.title}
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 900, color: '#064e3b', mb: 5, letterSpacing: '-0.02em' }}>
              KES {product.price}
            </Typography>
            
            <Typography variant="body1" sx={{ color: '#4b5563', lineHeight: 1.8, fontSize: '1.2rem', mb: 5, fontWeight: 400 }}>
              {product.description || 'Fresh produce sourced directly from a local farmer.'}
            </Typography>

            <Divider sx={{ my: 5 }} />

              <Box sx={{ mb: 5, display: 'flex', alignItems: 'center', gap: 3, p: 3, bgcolor: '#f9fafb', borderRadius: 6 }}>
                <Box sx={{ width: 60, height: 60, borderRadius: '50%', bgcolor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                  👨‍🌾
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: '#6b7280', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Farmer</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 900, color: '#111827' }}>{product.farmer?.name || 'Local Producer'}</Typography>
                  <Typography variant="body2" sx={{ color: '#4b5563', fontWeight: 500 }}>{product.location?.address || 'Nairobi, Kenya'}</Typography>
                  {product.farmer?.phone && (
                    <Typography variant="body2" sx={{ color: '#064e3b', fontWeight: 700, mt: 0.5 }}>
                      📞 {product.farmer.phone}
                    </Typography>
                  )}
                </Box>
              </Box>

            <Paper elevation={0} sx={{ p: 4, mb: 5, borderRadius: 6, bgcolor: '#f0fdf4', border: '1px solid #dcfce7' }}>
              <FormControlLabel
                control={<Switch checked={useCrypto} onChange={(e) => setUseCrypto(e.target.checked)} sx={{ 
                  '& .MuiSwitch-switchBase.Mui-checked': { color: '#059669' },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#059669' }
                }} />}
                label={<Typography sx={{ fontWeight: 800, color: '#064e3b' }}>Pay with Solana</Typography>}
              />
              <Typography variant="body2" sx={{ mt: 1.5, color: '#065f46', fontWeight: 500, lineHeight: 1.5 }}>
                {useCrypto 
                  ? 'Your transaction will be processed instantly on the Solana network for maximum transparency.' 
                  : 'Place your order and pay through our standard secure checkout process.'}
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
                borderRadius: 4, 
                bgcolor: '#064e3b', 
                fontSize: '1.3rem', 
                fontWeight: 950,
                textTransform: 'none',
                boxShadow: '0 15px 30px rgba(6, 78, 59, 0.25)',
                '&:hover': { bgcolor: '#065f46', transform: 'translateY(-2px)', boxShadow: '0 20px 40px rgba(6, 78, 59, 0.3)' },
                transition: 'all 0.3s'
              }}
            >
              {loading ? <CircularProgress size={28} color="inherit" /> : 'Confirm Order'}
            </Button>
            <Typography variant="caption" display="block" align="center" sx={{ mt: 3, color: '#6b7280', fontWeight: 500 }}>
              Secure transaction powered by decentralized technology.
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}
