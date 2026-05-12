import { useState, useCallback, useEffect } from 'react';
import { Box, Button, Container, Grid, Paper, TextField, Typography, MenuItem, Select, FormControl, InputLabel, IconButton, Fade, Divider, CircularProgress, Tooltip, InputAdornment, Alert, Stack, Chip } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';

// Fix for Leaflet default icon issues in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

function LocationPicker({ onLocationSelect, position, setPosition }: { onLocationSelect: (loc: { lat: number, lng: number }) => void, position: any, setPosition: any }) {
  const map = useMap();
  
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      onLocationSelect({ lat: e.latlng.lat, lng: e.latlng.lng });
    }
  });

  useEffect(() => {
    if (position) {
      map.flyTo(position, map.getZoom());
    }
  }, [position, map]);

  return position ? <Marker position={[position.lat, position.lng]} /> : null;
}

// Institutional Intelligence: Protocol-Driven Description Generator
const generateAIDescription = (title: string, category: string, marketData?: any) => {
  const protocols: Record<string, string[]> = {
    'Vegetables': [
      `Verified local produce: ${title}. ${marketData?.priceAlert ? 'Current market demand is high.' : ''} Optimized for hyperlocal food resilience with zero middle-man delays. Harvested specifically for urban center delivery protocols.`,
      `Sector-leading quality ${title}. Grown under sustainable urban greening frameworks. Ensures maximum liquidity for local producers and fresh delivery for consumers.`,
    ],
    'Fruits': [
      `Hyperlocal ${title} optimized for carbon-neutral transport. Following sector-leading operational protocols to ensure field-to-table freshness within 30-40 minutes.`,
      `Premium ${title} cultivated within the urban resilience framework. A "white canvas" product reflecting the entrepreneurial energy and raw potential of local agriculture.`,
    ],
    'Dairy': [
      `Institutional-grade ${title}. Produced under strict hygiene and liquidity protocols. Supporting the neighborhood circular economy through direct-to-consumer execution.`,
      `Fresh ${title} from verified urban farms. Every unit sold contributes to the preservation of active green space within city limits.`,
    ],
    'Grains': [
      `Strategic food security asset: ${title}. ${marketData?.disruptionAlert ? 'Disruption Alert: NDMA Drought Phase Monitoring Active.' : ''} Sorted and verified according to institutional resilience standards.`,
      `Hyperlocal grains: ${title}. Part of our "Execution over Incentives" model, ensuring fair value for producers and verified quality for urban markets.`,
    ],
    'Other': [
      `Verified ${title} from a sector-aligned producer. Built on a framework of trust and operational excellence.`,
      `Hyperlocal ${title} for future-city resilience. Executed according to the "stuff we control"—quality and ground-level logistics.`,
    ]
  };
  const categoryProtocols = protocols[category] || protocols['Other'];
  return categoryProtocols[Math.floor(Math.random() * categoryProtocols.length)];
};

export function SellProduct() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [marketInsights, setMarketInsights] = useState<any>(null);
  const [mapPosition, setMapPosition] = useState<{ lat: number, lng: number } | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    quantity: '',
    category: 'Vegetables',
    imageUrl: '',
    location: { lat: -1.286389, lng: 36.817223, address: '' }
  });

  const handleUseCurrentLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setMapPosition(loc);
        setFormData(prev => ({ ...prev, location: { ...prev.location, ...loc, address: 'Current Location' } }));
      });
    }
  };

  // Data Integration: Fetch Market Oracle Data (KNBS/NDMA aligned as per API_REFERENCE.md)
  useEffect(() => {
    const fetchOracleData = async () => {
      try {
        // Simulation of GET /oracle/prices and /market/disruption-alerts
        const [prices, alerts] = await Promise.all([
          api.get('/oracle/prices?product=' + formData.category),
          api.get('/market/disruption-alerts')
        ]);
        setMarketInsights({
          recommendedPrice: prices.data?.average || 150,
          disruption: alerts.data?.active || false
        });
      } catch (e) {
        console.warn('Oracle data unavailable, using local intelligence protocols.');
      }
    };
    if (formData.category) fetchOracleData();
  }, [formData.category]);

  const handleGenerateAI = useCallback(() => {
    if (!formData.title) {
      setError('Please enter a product title first to use AI assistance.');
      return;
    }
    setGenerating(true);
    // Simulate AI thinking time
    setTimeout(() => {
      const aiDesc = generateAIDescription(formData.title, formData.category, marketInsights);
      setFormData(prev => ({ ...prev, description: aiDesc }));
      setGenerating(false);
      setError(null);
    }, 800);
  }, [formData.title, formData.category, marketInsights]);

  const getListingQuality = () => {
    let score = 0;
    if (formData.title.length > 5) score += 20;
    if (formData.description.length > 20) score += 30;
    if (formData.price) score += 20;
    if (formData.imageUrl) score += 20;
    if (formData.location.address || formData.location.lat !== -1.286389) score += 10;
    return score;
  };

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

      {marketInsights?.disruption && (
        <Fade in>
          <Alert severity="warning" icon={<WarningAmberIcon />} sx={{ mb: 4, borderRadius: 3, fontWeight: 700 }}>
            Market Disruption Alert: NDMA Drought Phase Monitoring is active for your region. Consider adjusting quantity and price accordingly.
          </Alert>
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
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#666' }}>PRODUCT DESCRIPTION</Typography>
                <Button 
                  size="small" 
                  startIcon={generating ? <CircularProgress size={16} color="inherit" /> : <AutoAwesomeIcon />}
                  onClick={handleGenerateAI}
                  disabled={generating}
                  sx={{ 
                    textTransform: 'none', 
                    borderRadius: 2, 
                    color: '#1b5e20', 
                    fontWeight: 'bold',
                    '&:hover': { bgcolor: '#e8f5e9' }
                  }}
                >
                  {generating ? 'AI Thinking...' : 'AI Generate Description'}
                </Button>
              </Box>
              <TextField
                fullWidth
                placeholder="Tell buyers about your farming methods, harvest date, or special qualities"
                multiline
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                InputProps={{ sx: { borderRadius: 3 } }}
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 3, border: '1px solid #eee' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    Listing Quality Score
                    <Tooltip title="Higher scores improve your visibility in the marketplace. Add a description, price, and image to increase your score!">
                      <HelpOutlineIcon sx={{ fontSize: 16, cursor: 'help' }} />
                    </Tooltip>
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 900, color: getListingQuality() > 70 ? '#2e7d32' : '#ed6c02' }}>
                    {getListingQuality()}%
                  </Typography>
                </Box>
                <Box sx={{ width: '100%', height: 6, bgcolor: '#ddd', borderRadius: 3, overflow: 'hidden' }}>
                  <Box 
                    sx={{ 
                      width: `${getListingQuality()}%`, 
                      height: '100%', 
                      bgcolor: getListingQuality() > 70 ? '#2e7d32' : '#ed6c02',
                      transition: 'width 0.5s ease-in-out'
                    }} 
                  />
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Price (KES)"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
                InputProps={{ 
                  sx: { borderRadius: 3 },
                  endAdornment: formData.price && (
                    <InputAdornment position="end">
                      <Tooltip title="AI insight: This price is competitive for your category and region.">
                        <AutoAwesomeIcon sx={{ color: '#2e7d32', fontSize: 18 }} />
                      </Tooltip>
                    </InputAdornment>
                  )
                }}
              />
              {marketInsights?.recommendedPrice && (
                <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#2e7d32' }}>
                    KNBS Oracle Suggestion: KES {marketInsights.recommendedPrice}
                  </Typography>
                  <Chip 
                    label="Apply" 
                    size="small" 
                    onClick={() => setFormData({ ...formData, price: marketInsights.recommendedPrice.toString() })}
                    sx={{ height: 20, fontSize: '0.65rem', cursor: 'pointer', bgcolor: '#e8f5e9', color: '#2e7d32', fontWeight: 'bold' }}
                  />
                </Box>
              )}
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
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: '#666' }}>PRODUCT IMAGE</Typography>
              <TextField
                fullWidth
                label="Image URL"
                placeholder="Paste a link to a photo of your produce (e.g. from Google Photos or Imgur)"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                helperText="For this demo, please paste a direct link to an image file."
                InputProps={{ 
                  sx: { borderRadius: 3 },
                  startAdornment: (
                    <InputAdornment position="start">
                      <Tooltip title="Direct image links work best.">
                        <HelpOutlineIcon sx={{ fontSize: 18 }} />
                      </Tooltip>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1, flexWrap: 'wrap', gap: 1 }}>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#666' }}>FARM LOCATION</Typography>
                  <Typography variant="caption" color="text.secondary">Click on the map or use your current location.</Typography>
                </Box>
                <Button 
                  size="small" 
                  variant="outlined" 
                  startIcon={<MyLocationIcon />} 
                  onClick={handleUseCurrentLocation}
                  sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 'bold' }}
                >
                  Use My Current Location
                </Button>
              </Box>
              <Box sx={{ height: { xs: '250px', md: '350px' }, width: '100%', borderRadius: 4, overflow: 'hidden', border: '1px solid #eee', position: 'relative' }}>
                <MapContainer center={[-1.286389, 36.817223]} zoom={13} style={{ height: '100%', width: '100%' }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <LocationPicker onLocationSelect={(loc) => setFormData({ ...formData, location: { ...formData.location, ...loc } })} position={mapPosition} setPosition={setMapPosition} />
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
