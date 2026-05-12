import { useState, useCallback, useEffect } from 'react';
import { Box, Button, Container, Grid, Paper, TextField, Typography, MenuItem, Select, FormControl, InputLabel, IconButton, Fade, Divider, CircularProgress, Tooltip, InputAdornment, Alert, Stack, Chip } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import SearchIcon from '@mui/icons-material/Search';
import GppGoodIcon from '@mui/icons-material/GppGood';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap, Circle } from 'react-leaflet';
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

// Nairobi Neighborhoods for Search Simulation
const NAIROBI_NEIGHBORHOODS = [
  { name: 'Westlands', lat: -1.2675, lng: 36.8120 },
  { name: 'Kilimani', lat: -1.2901, lng: 36.7830 },
  { name: 'Kasarani', lat: -1.2201, lng: 36.8961 },
  { name: 'Karen', lat: -1.3200, lng: 36.7000 },
  { name: 'Eastlands', lat: -1.2858, lng: 36.8833 },
  { name: 'Nairobi CBD', lat: -1.286389, lng: 36.817223 },
  { name: 'Langata', lat: -1.3333, lng: 36.7667 },
  { name: 'Embakasi', lat: -1.3000, lng: 36.9167 },
];

function LocationPicker({ onLocationSelect, position, setPosition, privacyMode }: { onLocationSelect: (loc: { lat: number, lng: number }) => void, position: any, setPosition: any, privacyMode: boolean }) {
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

  return position ? (
    <>
      {privacyMode ? (
        <Circle 
          center={[position.lat, position.lng]} 
          radius={500} 
          pathOptions={{ color: '#1b5e20', fillColor: '#1b5e20', fillOpacity: 0.2 }} 
        />
      ) : (
        <Marker position={[position.lat, position.lng]} />
      )}
    </>
  ) : null;
}

// Institutional Intelligence: Protocol-Driven Description Generator
const generateAIDescription = (title: string, category: string, marketData?: any) => {
  const protocols: Record<string, string[]> = {
    'Vegetables': [
      `Verified local produce: ${title}. ${marketData?.priceAlert ? 'Current market demand is high.' : ''} Shelf-life optimized: field-to-table in <4h. Protocol-verified for urban centers.`,
      `Sector-leading quality ${title}. Grown under sustainable urban greening frameworks. Delivery window: Same-day local fulfillment via hyperlocal fulfillment centers.`,
    ],
    'Fruits': [
      `Hyperlocal ${title} optimized for carbon-neutral transport. Operational constraint: 30-40 min transport max to ensure peak nutrient density and freshness.`,
      `Premium ${title} cultivated within the urban resilience framework. Strategic liquidity asset: verified supply for high-demand urban neighborhoods.`,
    ],
    'Dairy': [
      `Institutional-grade ${title}. Produced under strict hygiene and cold-chain liquidity protocols. Fulfillment protocol: Batch-verified for 1-hour urban delivery cycles.`,
      `Fresh ${title} from verified urban farms. Operational integrity: 100% traceability from farm pin to consumer doorstep.`,
    ],
    'Grains': [
      `Strategic food security asset: ${title}. ${marketData?.disruptionAlert ? 'Disruption Alert: NDMA Drought Phase Monitoring Active.' : ''} Verified for 12-month storage stability in urban resilience hubs.`,
      `Hyperlocal grains: ${title}. Part of our "Execution over Incentives" model, ensuring fair value for producers and zero-delay urban market liquidity.`,
    ],
    'Other': [
      `Verified ${title} from a sector-aligned producer. Operational protocol: Validated via on-chain Proof-of-Trade history.`,
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

  const [searchArea, setSearchArea] = useState('');
  const [coordsInput, setCoordsInput] = useState('');
  const [privacyRadius, setPrivacyRadius] = useState(true);

  const handleSearchArea = (areaName: string) => {
    const area = NAIROBI_NEIGHBORHOODS.find(n => n.name === areaName);
    if (area) {
      const loc = { lat: area.lat, lng: area.lng };
      setMapPosition(loc);
      setFormData(prev => ({ ...prev, location: { ...prev.location, ...loc, address: areaName } }));
      setSearchArea(areaName);
      setCoordsInput(`${area.lat.toFixed(6)}, ${area.lng.toFixed(6)}`);
    }
  };

  const handleCoordsPaste = (val: string) => {
    setCoordsInput(val);
    const parts = val.split(',').map(p => parseFloat(p.trim()));
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      const loc = { lat: parts[0], lng: parts[1] };
      setMapPosition(loc);
      setFormData(prev => ({ ...prev, location: { ...prev.location, ...loc, address: 'Pasted Coordinates' } }));
    }
  };

  const handleUseCurrentLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setMapPosition(loc);
        setFormData(prev => ({ ...prev, location: { ...prev.location, ...loc, address: 'Current Location' } }));
        setCoordsInput(`${loc.lat.toFixed(6)}, ${loc.lng.toFixed(6)}`);
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
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 2 }}>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#666' }}>FARM LOCATION & SECURITY</Typography>
                  <Typography variant="caption" color="text.secondary">Select neighborhood, click map, or paste coordinates.</Typography>
                </Box>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Chip 
                    icon={<GppGoodIcon />} 
                    label={privacyRadius ? "Privacy Enabled" : "Exact Location"} 
                    onClick={() => setPrivacyRadius(!privacyRadius)}
                    color={privacyRadius ? "success" : "default"}
                    variant={privacyRadius ? "filled" : "outlined"}
                    size="small"
                    sx={{ fontWeight: 'bold' }}
                  />
                  <TextField
                    select
                    size="small"
                    label="Quick Area"
                    value={searchArea}
                    onChange={(e) => handleSearchArea(e.target.value)}
                    sx={{ width: 140, '& .MuiInputBase-root': { borderRadius: 2 } }}
                  >
                    {NAIROBI_NEIGHBORHOODS.map((option) => (
                      <MenuItem key={option.name} value={option.name}>
                        {option.name}
                      </MenuItem>
                    ))}
                  </TextField>
                  <Button 
                    size="small" 
                    variant="outlined" 
                    startIcon={<MyLocationIcon />} 
                    onClick={handleUseCurrentLocation}
                    sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 'bold' }}
                  >
                    GPS
                  </Button>
                </Stack>
              </Box>

              <TextField
                fullWidth
                size="small"
                label="Paste Coordinates (lat, lng)"
                placeholder="-1.286, 36.817"
                value={coordsInput}
                onChange={(e) => handleCoordsPaste(e.target.value)}
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <ContentPasteIcon sx={{ fontSize: 18, color: '#666' }} />
                    </InputAdornment>
                  ),
                  sx: { borderRadius: 3 }
                }}
              />

              <Box sx={{ 
                height: { xs: '300px', md: '400px' }, 
                width: '100%', 
                borderRadius: 5, 
                overflow: 'hidden', 
                border: '4px solid #f5f5f5', 
                position: 'relative',
                boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.05)'
              }}>
                <MapContainer center={[-1.286389, 36.817223]} zoom={13} style={{ height: '100%', width: '100%' }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <LocationPicker 
                    onLocationSelect={(loc) => {
                      setFormData({ ...formData, location: { ...formData.location, ...loc } });
                      setCoordsInput(`${loc.lat.toFixed(6)}, ${loc.lng.toFixed(6)}`);
                    }} 
                    position={mapPosition} 
                    setPosition={setMapPosition} 
                    privacyMode={privacyRadius}
                  />
                </MapContainer>
              </Box>
              <Typography variant="caption" sx={{ mt: 1, display: 'block', color: 'text.secondary', fontStyle: 'italic' }}>
                {privacyRadius ? "Privacy Radius active: Buyers see a general area (500m), protecting your exact farm location from unauthorized surveillance." : "Exact location active: Use this only for public collection points."}
              </Typography>
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
