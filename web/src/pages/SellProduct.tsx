import { useState } from 'react';
import { Box, Button, Container, Grid, Paper, TextField, Typography, MenuItem, Select, FormControl, InputLabel, IconButton, Fade, Divider } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';

function LocationPicker({ onLocationSelect }: { onLocationSelect: (loc: { lat: number, lng: number }) => void }) {
  const [position, setPosition] = useState<{ lat: number, lng: number } | null>(null);
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      onLocationSelect({ lat: e.latlng.lat, lng: e.latlng.lng });
    }
  });
  return position ? <Marker position={[position.lat, position.lng]} /> : null;
}

export function SellProduct() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    quantity: '',
    category: 'Vegetables',
    imageUrl: '',
    location: { lat: -1.286389, lng: 36.817223, address: '' }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.post('/products', {
        ...formData,
        price: Number(formData.price),
        quantity: Number(formData.quantity)
      });
      navigate('/market');
    } catch (err: any) {
      console.error('Failed to create product', err);
      setError(err.response?.data?.message || 'Failed to list product. Please ensure you are logged in as a farmer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 2, mb: 6, display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton onClick={() => navigate(-1)} sx={{ bgcolor: '#f5f5f5' }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: '-0.02em' }}>
          List Your Produce
        </Typography>
      </Box>

      {error && (
        <Fade in>
          <Paper sx={{ p: 2, mb: 4, bgcolor: '#fff5f5', color: '#c53030', borderRadius: 3, border: '1px solid #feb2b2', display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>{error}</Typography>
          </Paper>
        </Fade>
      )}

      <Paper sx={{ p: { xs: 3, md: 5 }, borderRadius: 6, boxShadow: '0 20px 50px rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.05)' }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: '#666' }}>PRODUCT DETAILS</Typography>
              <TextField
                fullWidth
                label="Product Title"
                placeholder="e.g. Fresh Organic Kale"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                InputProps={{ sx: { borderRadius: 3 } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                placeholder="Tell buyers about your farming methods, harvest date, or special qualities"
                multiline
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                InputProps={{ sx: { borderRadius: 3 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Price (KES)"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
                InputProps={{ sx: { borderRadius: 3 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Quantity Available"
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                required
                InputProps={{ sx: { borderRadius: 3 } }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={formData.category}
                  label="Category"
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  sx={{ borderRadius: 3 }}
                >
                  <MenuItem value="Vegetables">Vegetables</MenuItem>
                  <MenuItem value="Fruits">Fruits</MenuItem>
                  <MenuItem value="Dairy">Dairy</MenuItem>
                  <MenuItem value="Grains">Grains</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Image URL"
                placeholder="Paste a link to a high-quality photo of your produce"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                InputProps={{ sx: { borderRadius: 3 } }}
              />
            </Grid>
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: '#666' }}>FARM LOCATION</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Click on the map to precisely mark your farm location. This enables hyperlocal discovery for buyers within 5km.
              </Typography>
              <Box sx={{ height: '350px', width: '100%', borderRadius: 4, overflow: 'hidden', border: '1px solid #eee', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)' }}>
                <MapContainer center={[-1.286389, 36.817223]} zoom={13} style={{ height: '100%', width: '100%' }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <LocationPicker onLocationSelect={(loc) => setFormData({ ...formData, location: { ...formData.location, ...loc } })} />
                </MapContainer>
              </Box>
            </Grid>
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Button 
                type="submit" 
                variant="contained" 
                size="large" 
                fullWidth 
                disabled={loading}
                sx={{ 
                  py: 2, 
                  bgcolor: '#1b5e20', 
                  fontSize: '1.1rem',
                  fontWeight: 800,
                  borderRadius: 4,
                  boxShadow: '0 10px 30px rgba(27, 94, 32, 0.2)',
                  '&:hover': { bgcolor: '#2e7d32', boxShadow: '0 15px 40px rgba(27, 94, 32, 0.3)' },
                  '&:disabled': { bgcolor: '#ccc' }
                }}
              >
                {loading ? 'Processing...' : 'List Product for Sale'}
              </Button>
              <Typography variant="caption" display="block" align="center" sx={{ mt: 2, color: 'text.secondary' }}>
                By listing, you agree to provide fresh, high-quality produce to your local community.
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
}
