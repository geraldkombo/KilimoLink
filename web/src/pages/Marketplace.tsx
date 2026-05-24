import { useEffect, useState, useMemo, useCallback } from 'react';
import { Box, Card, CardContent, CardMedia, Container, Grid, Typography, Chip, Button, TextField, InputAdornment, Stack, Skeleton, Fade, IconButton } from '@mui/material';
import { api } from '../services/api';
import { Link } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { PremiumMarketCard } from '../components/PremiumMarketCard';

import { useProducts } from '../app/ProductContext';

export function Marketplace() {
  const { products, loading, error, fetchProducts, searchProducts } = useProducts();
  const [coords, setCoords] = useState<{ lat: number, lng: number } | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const newCoords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setCoords(newCoords);
          fetchProducts(newCoords);
        },
        (err) => {
          console.warn("Location access denied or failed", err);
          fetchProducts();
        }
      );
    } else {
      fetchProducts();
    }
  }, [fetchProducts]);

  const filteredProducts = useMemo(() => {
    return searchProducts(search);
  }, [searchProducts, search]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 8 }}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 6 }}>
          <IconButton component={Link} to="/" sx={{ bgcolor: '#f0fdf4', color: '#064e3b', '&:hover': { bgcolor: '#dcfce7' } }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h3" sx={{ fontWeight: 900, letterSpacing: '-0.04em', color: '#064e3b' }}>
            Local Produce
          </Typography>
        </Stack>

        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={7}>
            <TextField
              fullWidth
              placeholder="Search for kale, milk, or traditional greens..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#064e3b' }} />
                  </InputAdornment>
                ),
                sx: { 
                  borderRadius: 4, 
                  bgcolor: 'white',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                  border: '1px solid rgba(0,0,0,0.05)',
                  '& fieldset': { border: 'none' }
                }
              }}
            />
          </Grid>
          <Grid item xs={12} md={5}>
            <Stack direction="row" spacing={2} justifyContent={{ md: 'flex-end' }}>
              <Button 
                variant="outlined" 
                startIcon={<FilterListIcon />}
                sx={{ 
                  borderRadius: 4, 
                  px: 3, 
                  color: '#374151', 
                  borderColor: '#d1d5db',
                  fontWeight: 700,
                  textTransform: 'none',
                  '&:hover': { borderColor: '#064e3b', bgcolor: '#f0fdf4' }
                }}
              >
                Filters
              </Button>
              <Button 
                variant="contained" 
                component={Link} 
                to="/sell" 
                sx={{ 
                  bgcolor: '#064e3b', 
                  borderRadius: 4, 
                  px: 4, 
                  fontWeight: 800,
                  textTransform: 'none',
                  boxShadow: '0 10px 20px rgba(6, 78, 59, 0.2)',
                  '&:hover': { bgcolor: '#065f46', transform: 'translateY(-2px)' },
                  transition: 'all 0.2s'
                }}
              >
                Sell Your Produce
              </Button>
            </Stack>
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', gap: 1.5, p: 2, bgcolor: '#f0fdf4', borderRadius: 3, width: 'fit-content' }}>
          <LocationOnIcon sx={{ fontSize: 20, color: '#059669' }} />
          <Typography variant="body2" sx={{ fontWeight: 700, color: '#064e3b' }}>
            {coords ? 'Showing fresh produce within 5km of your location' : 'Enable location to see the closest produce'}
          </Typography>
        </Box>
      </Box>

      {loading ? (
        <Grid container spacing={4}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Skeleton variant="rectangular" height={220} sx={{ borderRadius: 6, mb: 2 }} />
              <Skeleton width="60%" height={32} sx={{ mb: 1, borderRadius: 2 }} />
              <Skeleton width="40%" height={24} sx={{ borderRadius: 2 }} />
            </Grid>
          ))}
        </Grid>
      ) : error ? (
        <Box sx={{ textAlign: 'center', py: 12, bgcolor: '#f9fafb', borderRadius: 8, border: '1px solid #e5e7eb' }}>
          <Typography color="#374151" variant="h5" sx={{ fontWeight: 800, mb: 2 }}>Something went wrong</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>We couldn't load the marketplace. Please try again.</Typography>
          <Button variant="contained" onClick={() => void fetchProducts()} sx={{ bgcolor: '#064e3b', px: 6, py: 1.5, borderRadius: 4, fontWeight: 800 }}>
            Try Again
          </Button>
        </Box>
      ) : filteredProducts.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 15, bgcolor: '#f9fafb', borderRadius: 8, border: '2px dashed #e5e7eb' }}>
          <Typography variant="h4" sx={{ fontWeight: 900, mb: 2, color: '#064e3b', letterSpacing: '-0.02em' }}>No produce found</Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 5, fontWeight: 500 }}>
            {search ? `We couldn't find anything matching "${search}"` : 'There are no listings in your area yet. Be the first!'}
          </Typography>
          <Button variant="contained" component={Link} to="/sell" sx={{ bgcolor: '#064e3b', px: 6, py: 2, borderRadius: 4, fontWeight: 900, fontSize: '1.1rem' }}>
            List Your Produce
          </Button>
        </Box>
      ) : (
        <Grid container spacing={4}>
          {filteredProducts.map((p, idx) => (
            <Grid item xs={12} sm={6} md={4} key={p.id}>
              <PremiumMarketCard product={p} delay={idx * 50} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}
