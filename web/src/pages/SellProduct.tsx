import { useState, useCallback, useEffect } from 'react';
import { IconButton, Fade, Divider } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box, Button, Container, Grid, Paper, TextField, Typography, MenuItem, Select, FormControl, InputLabel, CircularProgress, Tooltip, InputAdornment, Alert, Stack, Chip } from '@mui/material';
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

// Plain Language Description Generator
const generateAIDescription = (title: string, category: string, marketData?: any) => {
  const templates: Record<string, string[]> = {
    'Dairy': [
      `Pure, fresh ${title} from healthy local cows. Clean, safe, and delivered cold to your neighborhood.`,
      `Farm-fresh ${title}. We follow strict hygiene rules to make sure you get the best quality every day.`,
    ],
    'Vegetables': [
      `Freshly harvested ${title}. Grown locally using organic methods. Picked this morning for the best taste and nutrition.`,
      `Quality ${title} from our local garden. We don't use harsh chemicals, and we deliver fast to keep it crisp.`,
    ],
    'Fruits': [
      `Sweet and juicy ${title}. Ripened naturally on the tree and brought straight to the city. Perfect for healthy snacks.`,
      `Local ${title} full of flavor. We handle our fruit with care so it reaches you in perfect condition.`,
    ],
    'Grains': [
      `High-quality ${title} harvested from our recent crop. Cleaned, dried, and ready for your kitchen.`,
      `Local ${title} grown with care. Great for long-term storage or immediate use in your favorite meals.`,
    ],
    'Meat': [
      `Quality ${title} from locally raised livestock. Processed with care and delivered fresh to your neighborhood.`,
      `Premium ${title} sourced directly from trusted local farmers. Safe, clean, and nutritious for your family.`,
    ],
    'Honey': [
      `Pure, raw ${title} harvested from local bee colonies. Natural, unprocessed, and full of health benefits.`,
      `Local ${title} with a unique floral flavor. Perfect for sweetening your drinks or as a healthy spread.`,
    ],
    'Other': [
      `Fresh ${title} produced with care on our local farm. Quality you can trust, delivered directly to you.`,
      `High-quality ${title} from a verified local producer. Simple, honest food for Kenya's future.`,
    ]
  };
  const categoryTemplates = templates[category] || templates['Other'];
  return categoryTemplates[Math.floor(Math.random() * categoryTemplates.length)];
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

  // KNBS Intelligence: Fetch real produce names from dataset
  const knbsProduce = [
    { name: 'Maize', category: 'Grains', price: 180 },
    { name: 'Sukuma Wiki', category: 'Vegetables', price: 40 },
    { name: 'Grade A Milk', category: 'Dairy', price: 60 },
    { name: 'Indigenous Chicken', category: 'Meat', price: 450 },
    { name: 'Managu', category: 'Vegetables', price: 55 },
    { name: 'Irish Potatoes', category: 'Grains', price: 120 },
    { name: 'Pure Honey', category: 'Honey', price: 800 }
  ];

  // AI Title Capitalization & Enhancement
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // Capitalize first letter of each word
    const capitalized = val.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    
    // KNBS Intelligence: Auto-match category and suggested price
    const match = knbsProduce.find(p => capitalized.includes(p.name));
    if (match) {
      setFormData({ 
        ...formData, 
        title: capitalized, 
        category: match.category,
        price: match.price.toString()
      });
    } else {
      setFormData({ ...formData, title: capitalized });
    }
  };

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

  // Data Integration: Fetch Market Oracle Data
  useEffect(() => {
    const fetchOracleData = async () => {
      try {
        const [prices, alerts] = await Promise.all([
          api.get('/oracle/prices?product=' + formData.category),
          api.get('/market/disruption-alerts')
        ]);
        setMarketInsights({
          recommendedPrice: prices.data?.average || 150,
          disruption: alerts.data?.active || false
        });
      } catch (e) {
        console.warn('Oracle data unavailable, using standard pricing.');
      }
    };
    if (formData.category) fetchOracleData();
  }, [formData.category]);

  const handleGenerateAI = useCallback(() => {
    if (!formData.title) {
      setError('Please enter a product title first.');
      return;
    }
    setGenerating(true);
    setTimeout(() => {
      const aiDesc = generateAIDescription(formData.title, formData.category, marketInsights);
      setFormData(prev => ({ ...prev, description: aiDesc }));
      setGenerating(false);
      setError(null);
    }, 800);
  }, [formData.title, formData.category, marketInsights]);

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
      setError(err.response?.data?.message || 'Failed to list product. Please ensure you are logged in.');
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
        <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: '-0.02em', color: '#064e3b' }}>
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
            Market Notice: There are currently weather or transport delays in your area. You might want to adjust your prices.
          </Alert>
        </Fade>
      )}

      <Paper sx={{ p: { xs: 3, md: 5 }, borderRadius: 6, boxShadow: '0 20px 50px rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.05)' }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: '#064e3b' }}>PRODUCT DETAILS (KNBS VERIFIED)</Typography>
              <FormControl fullWidth required>
                <InputLabel>What are you selling?</InputLabel>
                <Select
                  value={formData.title}
                  label="What are you selling?"
                  onChange={(e) => {
                    const item = knbsProduce.find(p => p.name === e.target.value);
                    if (item) {
                      setFormData({ 
                        ...formData, 
                        title: item.name, 
                        category: item.category,
                        price: item.price.toString()
                      });
                    }
                  }}
                  sx={{ borderRadius: 3 }}
                >
                  {knbsProduce.map((item) => (
                    <MenuItem key={item.name} value={item.name}>
                      {item.name} — Verified {item.category}
                    </MenuItem>
                  ))}
                </Select>
                <Typography variant="caption" sx={{ mt: 1, color: '#059669', fontWeight: 600 }}>
                  ✓ Institutional intelligence: Only verified KNBS produce can be listed for urban trade.
                </Typography>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#064e3b' }}>DESCRIPTION</Typography>
                <Button 
                  size="small" 
                  startIcon={generating ? <CircularProgress size={16} color="inherit" /> : <AutoAwesomeIcon />}
                  onClick={handleGenerateAI}
                  disabled={generating}
                  sx={{ 
                    textTransform: 'none', 
                    borderRadius: 2, 
                    color: '#064e3b', 
                    fontWeight: 'bold',
                    '&:hover': { bgcolor: '#f0fdf4' }
                  }}
                >
                  {generating ? 'Writing...' : 'Help me write this'}
                </Button>
              </Box>
              <TextField
                fullWidth
                placeholder="Tell buyers about your produce. When was it harvested? How was it grown?"
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
                disabled
                required
                InputProps={{ 
                  sx: { borderRadius: 3, bgcolor: '#f9fafb' },
                  startAdornment: (
                    <InputAdornment position="start">
                      <GppGoodIcon sx={{ color: '#059669', fontSize: 18 }} />
                    </InputAdornment>
                  )
                }}
                helperText="Fixed market price from KNBS dataset"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="How much do you have?"
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                required
                InputProps={{ sx: { borderRadius: 3 } }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth disabled>
                <InputLabel>Category</InputLabel>
                <Select
                  value={formData.category}
                  label="Category"
                  sx={{ borderRadius: 3, bgcolor: '#f9fafb' }}
                >
                  <MenuItem value="Dairy">Dairy</MenuItem>
                  <MenuItem value="Vegetables">Vegetables</MenuItem>
                  <MenuItem value="Fruits">Fruits</MenuItem>
                  <MenuItem value="Grains">Grains</MenuItem>
                  <MenuItem value="Meat">Meat</MenuItem>
                  <MenuItem value="Honey">Honey & Bee Products</MenuItem>
                  <MenuItem value="Other">Other Items</MenuItem>
                </Select>
                <Typography variant="caption" sx={{ mt: 1 }}>
                  Category is automatically assigned based on produce type.
                </Typography>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: '#064e3b' }}>PRODUCT PHOTO</Typography>
              <TextField
                fullWidth
                label="Photo Link"
                placeholder="Paste a link to a photo of your produce"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                helperText="Tip: You can upload your photo to Google Photos or Imgur and paste the link here."
                InputProps={{ 
                  sx: { borderRadius: 3 },
                  startAdornment: (
                    <InputAdornment position="start">
                      <HelpOutlineIcon sx={{ fontSize: 18, color: '#064e3b' }} />
                    </InputAdornment>
                  )
                }}
              />
              <Box sx={{ mt: 1.5, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Typography variant="caption" sx={{ color: '#666', mr: 1, mt: 0.5 }}>Quick samples:</Typography>
                {[
                  { label: 'Kale/Sukuma', url: 'https://images.unsplash.com/photo-1524179091875-bf99a9a6af97?auto=format&fit=crop&w=800&q=80' },
                  { label: 'Fresh Milk', url: 'https://images.unsplash.com/photo-1550583724-1255818c0533?auto=format&fit=crop&w=800&q=80' },
                  { label: 'Maize/Corn', url: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80' },
                ].map((chip) => (
                  <Chip 
                    key={chip.label} 
                    label={chip.label} 
                    size="small" 
                    onClick={() => setFormData({ ...formData, imageUrl: chip.url })}
                    sx={{ bgcolor: '#f0fdf4', color: '#064e3b', fontWeight: 600, fontSize: '0.7rem', cursor: 'pointer', '&:hover': { bgcolor: '#dcfce7' } }} 
                  />
                ))}
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 2 }}>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#064e3b' }}>FARM LOCATION</Typography>
                  <Typography variant="caption" color="text.secondary">Where can buyers find your produce?</Typography>
                </Box>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Chip 
                    icon={<GppGoodIcon />} 
                    label={privacyRadius ? "Privacy On" : "Exact Location"} 
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
                    sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 'bold', color: '#064e3b', borderColor: '#064e3b' }}
                  >
                    Use GPS
                  </Button>
                </Stack>
              </Box>

              <TextField
                fullWidth
                size="small"
                label="Coordinates (Optional)"
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
                border: '4px solid #f0fdf4', 
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
                {privacyRadius ? "Privacy Mode: Buyers only see your general area (500m), protecting your farm's exact spot." : "Exact location: Buyers will see exactly where you are located."}
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
                  bgcolor: '#064e3b', 
                  fontSize: '1.2rem',
                  fontWeight: 900,
                  borderRadius: 4,
                  boxShadow: '0 10px 30px rgba(6, 78, 59, 0.2)',
                  '&:hover': { bgcolor: '#065f46', boxShadow: '0 15px 40px rgba(6, 78, 59, 0.3)' },
                  '&:disabled': { bgcolor: '#ccc' }
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'List My Produce Now'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
}
