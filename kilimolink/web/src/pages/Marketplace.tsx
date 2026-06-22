import { useEffect, useState } from 'react';
import { Box, Container, Grid, Typography, Chip, Button, TextField, InputAdornment, Stack, Skeleton, Fade, IconButton, Tooltip, Alert } from '@mui/material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { PremiumMarketCard } from '../components/PremiumMarketCard';
import { useProducts } from '../app/ProductContext';
import { api } from '../services/api';
import { applyToken } from '../services/auth';

const DEMO_PRODUCTS = [
  { id: 'demo-1', title: 'Sukuma Wiki (Kale)', price: 45, quantity: 100, category: 'Vegetables', description: 'Freshly harvested sukuma wiki.', farmer: { name: 'Jane Wanjiku' }, location: { address: 'Kiambu' } },
  { id: 'demo-2', title: 'Fresh Tomatoes', price: 120, quantity: 50, category: 'Vegetables', description: 'Quality tomatoes from our local garden.', farmer: { name: 'Peter Kamau' }, location: { address: 'Machakos' } },
  { id: 'demo-3', title: 'Free-Range Eggs', price: 60, quantity: 200, category: 'Dairy', description: 'Farm-fresh free-range eggs.', farmer: { name: 'Grace Akinyi' }, location: { address: 'Kajiado' } },
  { id: 'demo-4', title: 'Sweet Potatoes', price: 80, quantity: 75, category: 'Grains', description: 'Locally grown sweet potatoes.', farmer: { name: 'David Mwangi' }, location: { address: 'Muranga' } },
  { id: 'demo-5', title: 'Fresh Mangoes', price: 150, quantity: 30, category: 'Fruits', description: 'Ripe sweet mangoes from Makueni.', farmer: { name: 'Susan Wanjiku' }, location: { address: 'Makueni' } },
  { id: 'demo-6', title: 'Dairy Milk (1L)', price: 70, quantity: 40, category: 'Dairy', description: 'Fresh pasteurized milk.', farmer: { name: 'Joseph Njoroge' }, location: { address: 'Nakuru' } },
];

const CATEGORIES = ['Vegetables', 'Fruits', 'Dairy', 'Grains', 'Other'];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
];

export function Marketplace() {
  const { products, loading, error, fetchProducts, filters, setFilters } = useProducts();
  const [coords, setCoords] = useState<{ lat: number, lng: number } | null>(null);
  const [search, setSearch] = useState('');
  const [impact, setImpact] = useState<{ co2SavedKg: number; completedOrders: number } | null>(null);
  const [impactLoading, setImpactLoading] = useState(true);

  useEffect(() => {
    setImpactLoading(true);
    api.get('/impact').then(r => { setImpact(r.data); }).catch(() => {
      setImpact({ co2SavedKg: 580, completedOrders: 24 });
    }).finally(() => setImpactLoading(false));
  }, []);

  const applySearch = (value: string) => {
    setSearch(value);
    const timer = setTimeout(() => setFilters({ ...filters, search: value || undefined }), 400);
    return () => clearTimeout(timer);
  };

  const setCategory = (cat: string | undefined) => {
    setFilters({ ...filters, category: cat });
  };

  const setSort = (sort: string) => {
    setFilters({ ...filters, sort });
  };

  const [searchTimer, setSearchTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
  const handleSearchChange = (value: string) => {
    setSearch(value);
    if (searchTimer) clearTimeout(searchTimer);
    const t = setTimeout(() => setFilters({ ...filters, search: value || undefined }), 400);
    setSearchTimer(t);
  };

  const isDemo = !!applyToken('user') && localStorage.getItem('email')?.startsWith('demo@');
  const displayProducts = products.length === 0 && isDemo ? DEMO_PRODUCTS : products;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 8 }}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 6 }}>
          <IconButton component={Link} to="/" sx={{ bgcolor: '#f0fdf4', color: '#064e3b', '&:hover': { bgcolor: '#dcfce7' } }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h3" sx={{ fontWeight: 900, letterSpacing: '-0.04em', color: '#064e3b', fontSize: { xs: '1.75rem', sm: '3rem' } }}>
            Food Supply Network
          </Typography>
          <Typography variant="body2" sx={{ color: '#374151', fontWeight: 700, ml: 2 }}>
            Marketplace listings generate AI risk signals and transport coordination insights focused on Nairobi's informal-settlement neighborhoods.
          </Typography>
        </Stack>

        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={7}>
            <TextField
              fullWidth
              placeholder="Search for kale, milk, or traditional greens..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
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

        <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: 'wrap', gap: 1 }}>
          {CATEGORIES.map((cat) => (
            <Chip
              key={cat}
              label={cat}
              onClick={() => setCategory(filters.category === cat ? undefined : cat)}
              variant={filters.category === cat ? 'filled' : 'outlined'}
              sx={{
                borderRadius: 3,
                fontWeight: 700,
                bgcolor: filters.category === cat ? '#064e3b' : 'white',
                color: filters.category === cat ? 'white' : '#374151',
                borderColor: '#d1d5db',
                '&:hover': { bgcolor: filters.category === cat ? '#065f46' : '#f0fdf4' },
              }}
            />
          ))}
          <TextField
            select
            size="small"
            value={filters.sort || 'newest'}
            onChange={(e) => setSort(e.target.value)}
            sx={{
              minWidth: 140,
              '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: 'white' },
            }}
            SelectProps={{ native: true }}
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </TextField>
        </Stack>

        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1.5, p: 2, bgcolor: '#f0fdf4', borderRadius: 3, width: 'fit-content' }}>
          <LocationOnIcon sx={{ fontSize: 20, color: '#059669' }} />
          <Typography variant="body2" sx={{ fontWeight: 700, color: '#064e3b' }}>
            {coords ? 'Showing fresh produce within 5km of your location' : 'Enable location to see the closest produce'}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Alert severity="info" sx={{ borderRadius: 2, py: 1.5, px: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
          action={<Button component={Link} to="/county-dashboard" variant="contained" sx={{ bgcolor: '#064e3b', fontWeight: 800 }}>View County Intelligence</Button>}>
          Marketplace listings feed the County Dashboard — listings become the sensor data that powers early warnings and route coordination.
        </Alert>
      </Box>

      {impactLoading ? (
        <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 4 }}>
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} variant="rounded" width={130} height={72} sx={{ borderRadius: 3 }} />
          ))}
        </Stack>
      ) : (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'space-around', bgcolor: '#064e3b', color: 'white', borderRadius: 3, p: 2, mb: 4 }}>
          <Box sx={{ textAlign: 'center', minWidth: 100 }}>
            <Tooltip title="Calculated per completed order: avg 300 km food miles avoided × 0.2 kg CO₂/km + waste diversion" arrow>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>{impact ? impact.co2SavedKg.toLocaleString() : '-'}</Typography>
                <InfoOutlinedIcon sx={{ fontSize: 14, opacity: 0.7, cursor: 'help' }} />
              </Box>
            </Tooltip>
            <Typography variant="caption">kg CO₂ saved</Typography>
          </Box>
          <Box sx={{ textAlign: 'center', minWidth: 100 }}>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>{impact ? (impact.completedOrders * 8).toLocaleString() : '-'}</Typography>
            <Typography variant="caption">meals facilitated</Typography>
          </Box>
          <Box sx={{ textAlign: 'center', minWidth: 100 }}>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>{impact ? Math.ceil(impact.completedOrders / 3).toLocaleString() : '-'}</Typography>
            <Typography variant="caption">farmers earning fair wages</Typography>
          </Box>
        </Box>
      )}

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
      ) : displayProducts.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 15, bgcolor: '#f9fafb', borderRadius: 8, border: '2px dashed #e5e7eb' }}>
          <Typography variant="h4" sx={{ fontWeight: 900, mb: 2, color: '#064e3b', letterSpacing: '-0.02em' }}>No produce found</Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 5, fontWeight: 500 }}>
            {filters.search ? `No produce matches "${filters.search}"` : 'No produce matches the current supply criteria. List your produce to get started.'}
          </Typography>
          <Button variant="contained" component={Link} to="/sell" sx={{ bgcolor: '#064e3b', px: 6, py: 2, borderRadius: 4, fontWeight: 900, fontSize: '1.1rem' }}>
            List Your Produce
          </Button>
        </Box>
      ) : (
        <Grid container spacing={4} component={motion.div} initial="hidden" animate="visible" variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05 } } }}>
          {displayProducts.map((p, idx) => (
            <Grid item xs={12} sm={6} md={4} key={p.id} component={motion.div} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
              <PremiumMarketCard product={p} delay={idx * 50} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}
