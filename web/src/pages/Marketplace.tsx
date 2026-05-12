import { useEffect, useState, useMemo, useCallback } from 'react';
import { Box, Card, CardContent, CardMedia, Container, Grid, Typography, Chip, Button, TextField, InputAdornment, Stack, Skeleton, Fade, IconButton } from '@mui/material';
import { api } from '../services/api';
import { Link } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { PremiumMarketCard } from '../components/PremiumMarketCard';

export function Marketplace() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [coords, setCoords] = useState<{ lat: number, lng: number } | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        (err) => {
          console.warn("Location access denied or failed", err);
        }
      );
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const url = coords ? `/products?lat=${coords.lat}&lng=${coords.lng}` : '/products';
      const res = await api.get(url);
      setProducts(res.data);
    } catch (err) {
      console.error('Failed to fetch products', err);
      setError('Failed to load products. Please check your connection.');
    } finally {
      setLoading(false);
    }
  }, [coords]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => 
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
    );
  }, [products, search]);

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <Box sx={{ mb: 6 }}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
          <IconButton component={Link} to="/" sx={{ bgcolor: '#f5f5f5' }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: '-0.02em' }}>
            Nearby Produce
          </Typography>
        </Stack>

        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search for kale, milk, or traditional greens..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
                sx: { borderRadius: 4, bgcolor: 'white' }
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Stack direction="row" spacing={2} justifyContent={{ md: 'flex-end' }}>
              <Button 
                variant="outlined" 
                startIcon={<FilterListIcon />}
                sx={{ borderRadius: 3, px: 3, color: '#333', borderColor: '#ddd' }}
              >
                Filters
              </Button>
              <Button 
                variant="contained" 
                component={Link} 
                to="/sell" 
                sx={{ bgcolor: '#1b5e20', borderRadius: 3, px: 4, '&:hover': { bgcolor: '#2e7d32' } }}
              >
                Sell Your Produce
              </Button>
            </Stack>
          </Grid>
        </Grid>

        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <LocationOnIcon sx={{ fontSize: 16, color: coords ? '#2e7d32' : '#666' }} />
          <Typography variant="body2" color="text.secondary">
            {coords ? 'Prioritizing local food within 5km' : 'Enable location for hyperlocal results'}
          </Typography>
        </Box>
      </Box>

      {loading ? (
        <Grid container spacing={4}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 4, mb: 2 }} />
              <Skeleton width="60%" height={32} sx={{ mb: 1 }} />
              <Skeleton width="40%" height={24} />
            </Grid>
          ))}
        </Grid>
      ) : error ? (
        <Box sx={{ textAlign: 'center', py: 8, bgcolor: '#f9f9f9', borderRadius: 4, border: '1px solid #eee' }}>
          <Typography color="text.secondary" variant="h6" gutterBottom>No produce listed in your area yet.</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>Be the first to list fresh produce and help build urban food resilience!</Typography>
          <Button variant="contained" component={Link} to="/sell" sx={{ bgcolor: '#1b5e20', px: 4, py: 1.5, borderRadius: 3 }}>
            List Your Produce
          </Button>
        </Box>
      ) : filteredProducts.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 12, bgcolor: '#f9f9f9', borderRadius: 6, border: '1px dashed #ddd' }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>No produce found</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            {search ? `We couldn't find anything matching "${search}"` : 'Be the first to list produce in your neighborhood!'}
          </Typography>
          <Button variant="contained" component={Link} to="/sell" sx={{ bgcolor: '#1b5e20', px: 4, py: 1.5, borderRadius: 3 }}>
            List Your Produce
          </Button>
        </Box>
      ) : (
        <Grid container spacing={4}>
          {filteredProducts.map((p, idx) => (
            <Grid item xs={12} sm={6} md={4} key={p.id}>
              <PremiumMarketCard product={p} delay={idx * 100} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}
