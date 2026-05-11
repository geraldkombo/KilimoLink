import { useEffect, useState } from 'react';
import { Box, Card, CardContent, CardMedia, Container, Grid, Typography, Chip, Button, TextField, InputAdornment } from '@mui/material';
import { api } from '../services/api';
import { Link } from 'react-router-dom';

export function Marketplace() {
  const [products, setProducts] = useState<any[]>([]);
  const [coords, setCoords] = useState<{ lat: number, lng: number } | null>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
    });
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      const url = coords ? `/products?lat=${coords.lat}&lng=${coords.lng}` : '/products';
      const res = await api.get(url);
      setProducts(res.data);
    };
    fetchProducts();
  }, [coords]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>Nearby Produce</Typography>
        <Button variant="contained" component={Link} to="/sell" sx={{ bgcolor: '#2e7d32' }}>
          Sell Your Produce
        </Button>
      </Box>

      <Grid container spacing={3}>
        {products.map((p) => (
          <Grid item xs={12} sm={6} md={4} key={p.id}>
            <Card sx={{ height: '100%', borderRadius: 3, transition: '0.3s', '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 } }}>
              <CardMedia
                component="img"
                height="200"
                image={p.imageUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80'}
                alt={p.title}
              />
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{p.title}</Typography>
                  <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                    KES {p.price}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {p.category} • {p.quantity} units available
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mt: 2, alignItems: 'center' }}>
                  <Chip 
                    label={p.distance !== undefined ? `${p.distance.toFixed(1)} km away` : 'Location unknown'} 
                    size="small" 
                    color={p.distance < 5 ? "success" : "default"}
                    variant="outlined"
                  />
                  {p.distance < 2 && <Chip label="Ultra Local" size="small" color="secondary" />}
                </Box>
                <Button 
                  fullWidth 
                  variant="outlined" 
                  sx={{ mt: 2, borderRadius: 2 }}
                  component={Link}
                  to={`/product/${p.id}`}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
