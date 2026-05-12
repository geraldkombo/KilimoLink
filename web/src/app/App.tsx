import { AppBar, Box, Button, Container, Toolbar, Typography, Stack, useTheme, useMediaQuery, Paper, Grid, Divider } from '@mui/material';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { usePrivy } from '@privy-io/react-auth';
import { AdminPage } from '../pages/AdminPage';
import { Marketplace } from '../pages/Marketplace';
import { SellProduct } from '../pages/SellProduct';
import { ProductDetail } from '../pages/ProductDetail';
import { OrdersPage } from '../pages/OrdersPage';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import PublicIcon from '@mui/icons-material/Public';

function HomePage() {
  return (
    <Box>
      <Box sx={{ 
        py: { xs: 8, md: 12 }, 
        px: 4,
        textAlign: 'center', 
        background: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 50%, #4caf50 100%)', 
        borderRadius: { xs: 4, md: 8 }, 
        color: 'white', 
        mb: 8,
        boxShadow: '0 20px 40px rgba(27, 94, 32, 0.2)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography variant="h2" gutterBottom sx={{ fontWeight: 900, fontSize: { xs: '2.5rem', md: '4rem' }, letterSpacing: '-0.02em' }}>
            KilimoLink
          </Typography>
          <Typography variant="h5" sx={{ mb: 6, opacity: 0.9, maxWidth: '800px', mx: 'auto', fontWeight: 400, lineHeight: 1.6 }}>
            Hyperlocal Food Resilience for Future Cities. Connecting urban centers directly with climate-smart local cultivators.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} justifyContent="center">
            <Button 
              variant="contained" 
              size="large" 
              component={Link} 
              to="/market"
              startIcon={<ShoppingBagIcon />}
              sx={{ 
                bgcolor: 'white', 
                color: '#1b5e20', 
                px: 4, 
                py: 2, 
                fontSize: '1.1rem',
                fontWeight: 'bold',
                borderRadius: 3,
                '&:hover': { bgcolor: '#f5f5f5', transform: 'translateY(-2px)' },
                transition: 'all 0.2s'
              }}
            >
              Explore Marketplace
            </Button>
            <Button 
              variant="outlined" 
              color="inherit" 
              size="large" 
              component={Link} 
              to="/sell"
              startIcon={<AddCircleIcon />}
              sx={{ 
                px: 4, 
                py: 2, 
                fontSize: '1.1rem',
                fontWeight: 'bold',
                borderRadius: 3,
                borderWidth: 2,
                '&:hover': { borderWidth: 2, bgcolor: 'rgba(255,255,255,0.1)', transform: 'translateY(-2px)' },
                transition: 'all 0.2s'
              }}
            >
              Sell Your Produce
            </Button>
          </Stack>
        </Box>
        {/* Subtle decorative elements */}
        <Box sx={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: '50%' }} />
        <Box sx={{ position: 'absolute', bottom: -100, left: -100, width: 300, height: 300, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: '50%' }} />
      </Box>

      <Typography variant="h3" align="center" gutterBottom sx={{ fontWeight: 800, mb: 2, letterSpacing: '-0.01em' }}>
        Innovate4Cities 2026 Focus
      </Typography>
      <Typography variant="body1" align="center" sx={{ mb: 6, color: 'text.secondary', maxWidth: '700px', mx: 'auto' }}>
        Our platform is built to solve the most pressing challenges of urban food systems through decentralized technology.
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 4, mb: 10 }}>
        {[
          {
            title: "Food Waste Reduction",
            desc: "Direct farm-to-city trade eliminates middle-man delays, significantly reducing post-harvest losses in informal settlements.",
            icon: "🍃",
            color: "#f1f8e9"
          },
          {
            title: "Transport Decarbonization",
            desc: "Our geolocation engine prioritizes products within a 5km radius, minimizing the carbon footprint of urban food logistics.",
            icon: "🚚",
            color: "#e3f2fd"
          },
          {
            title: "Urban Greening",
            desc: "Every farmer registered on KilimoLink represents 100m² of preserved or active green space mapped within city limits.",
            icon: "🏙️",
            color: "#fff3e0"
          }
        ].map((item, idx) => (
          <Paper key={idx} elevation={0} sx={{ p: 4, bgcolor: item.color, borderRadius: 5, border: '1px solid rgba(0,0,0,0.05)', transition: 'transform 0.3s', '&:hover': { transform: 'translateY(-8px)' } }}>
            <Typography variant="h2" sx={{ mb: 2 }}>{item.icon}</Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 2, color: '#1b5e20' }}>{item.title}</Typography>
            <Typography variant="body1" sx={{ color: '#444', lineHeight: 1.7 }}>{item.desc}</Typography>
          </Paper>
        ))}
      </Box>

      <Box sx={{ mb: 10, p: { xs: 4, md: 8 }, bgcolor: '#fafafa', borderRadius: 8, border: '1px solid #eee' }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h3" sx={{ fontWeight: 900, mb: 3, letterSpacing: '-0.02em' }}>Sector-Leading Execution</Typography>
            <Typography variant="body1" sx={{ color: '#555', lineHeight: 1.8, mb: 4, fontSize: '1.1rem' }}>
              Kenya is at a unique intersection of young talent, digital hunger, and magnificent potential. We believe the future of food systems is a blank canvas, and we are painting it with sector-leading, hyperlocal execution and institutional intelligence.
            </Typography>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: '#e8f5e9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2e7d32', fontWeight: 'bold' }}>✓</Box>
                <Typography variant="body1" sx={{ fontWeight: 700 }}>Execution over Artificial Incentives</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: '#e8f5e9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2e7d32', fontWeight: 'bold' }}>✓</Box>
                <Typography variant="body1" sx={{ fontWeight: 700 }}>Institutional Intelligence & Strategic Growth</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: '#e8f5e9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2e7d32', fontWeight: 'bold' }}>✓</Box>
                <Typography variant="body1" sx={{ fontWeight: 700 }}>Resilient Operational Frameworks</Typography>
              </Box>
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ position: 'relative' }}>
              <Box 
                component="img" 
                src="https://images.unsplash.com/photo-1590682680695-43b964a3ae17?auto=format&fit=crop&w=800&q=80" 
                sx={{ width: '100%', borderRadius: 6, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
              />
              <Box 
                sx={{ 
                  position: 'absolute', 
                  bottom: -20, 
                  right: -20, 
                  width: '60%', 
                  bgcolor: 'white', 
                  p: 1, 
                  borderRadius: 4, 
                  boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                  border: '4px solid #fff'
                }}
              >
                <Box 
                  component="img" 
                  src="/handshake.jpg"
                  onError={(e: any) => {
                    e.target.src = 'https://images.unsplash.com/photo-1521791136364-798a7bc0d262?auto=format&fit=crop&w=800&q=80';
                  }}
                  sx={{ width: '100%', borderRadius: 3 }}
                />
                <Typography variant="caption" sx={{ display: 'block', mt: 1, textAlign: 'center', fontWeight: 'bold', color: '#1b5e20' }}>
                  Strategic Alignment with Sector Pioneers
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ py: 8, px: 4, bgcolor: '#1b5e20', borderRadius: 6, color: 'white', display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', justifyContent: 'space-between', gap: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>Ready to join the revolution?</Typography>
          <Typography variant="h6" sx={{ opacity: 0.8, fontWeight: 400 }}>Join 500+ urban farmers already transforming city food systems.</Typography>
        </Box>
        <Button variant="contained" size="large" sx={{ bgcolor: 'white', color: '#1b5e20', px: 6, py: 2, fontWeight: 'bold', borderRadius: 3, '&:hover': { bgcolor: '#f5f5f5' } }}>
          Get Started Now
        </Button>
      </Box>
    </Box>
  );
}

export function App() {
  const { login, authenticated, user, logout } = usePrivy();

  return (
    <BrowserRouter>
      <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: '#fcfcfc', display: 'flex', flexDirection: 'column' }}>
        <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
          <Toolbar sx={{ height: 80 }}>
            <Typography 
              variant="h5" 
              component={Link} 
              to="/" 
              sx={{ flexGrow: 1, fontWeight: '900', letterSpacing: -1, color: '#1b5e20', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 1 }}
            >
              <PublicIcon sx={{ fontSize: 32 }} />
              KILIMOLINK
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <Button color="inherit" component={Link} to="/market" sx={{ color: '#333', fontWeight: 600, px: 2 }}>Market</Button>
              <Button color="inherit" component={Link} to="/orders" sx={{ color: '#333', fontWeight: 600, px: 2 }}>Orders</Button>
              <Button color="inherit" component={Link} to="/admin" sx={{ color: '#333', fontWeight: 600, px: 2 }}>Admin</Button>
              <Box sx={{ ml: 2 }}>
                {!authenticated ? (
                  <Button variant="contained" color="success" onClick={login} sx={{ textTransform: 'none', borderRadius: 3, px: 4, py: 1, fontWeight: 'bold', boxShadow: 'none' }}>
                    Connect
                  </Button>
                ) : (
                  <Button variant="outlined" color="success" onClick={logout} sx={{ textTransform: 'none', borderRadius: 3, px: 3, py: 1, fontWeight: 'bold' }}>
                    {user?.email?.address?.split('@')[0] || 'Farmer'}
                  </Button>
                )}
              </Box>
            </Stack>
          </Toolbar>
        </AppBar>

        <Container sx={{ py: 6, flexGrow: 1 }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/market" element={<Marketplace />} />
            <Route path="/sell" element={<SellProduct />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </Container>

        <Box component="footer" sx={{ py: 6, borderTop: '1px solid #eee', bgcolor: 'white', mt: 'auto' }}>
          <Container maxWidth="lg">
            <Grid container spacing={4}>
              <Grid item xs={12} md={4}>
                <Typography variant="h6" sx={{ fontWeight: 900, color: '#1b5e20', mb: 2 }}>KILIMOLINK</Typography>
                <Typography variant="body2" color="text.secondary">
                  KilimoLink is a transparent marketplace and climate-action tracker connecting urban consumers with local producers. Built for the Innovate4Cities 2026 challenge.
                </Typography>
              </Grid>
              <Grid item xs={6} md={2}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 2 }}>Platform</Typography>
                <Stack spacing={1}>
                  <Link to="/market" style={{ textDecoration: 'none', color: '#666', fontSize: '0.875rem' }}>Marketplace</Link>
                  <Link to="/sell" style={{ textDecoration: 'none', color: '#666', fontSize: '0.875rem' }}>Sell Produce</Link>
                  <Link to="/orders" style={{ textDecoration: 'none', color: '#666', fontSize: '0.875rem' }}>My Orders</Link>
                </Stack>
              </Grid>
              <Grid item xs={6} md={2}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 2 }}>Impact</Typography>
                <Stack spacing={1}>
                  <Typography variant="body2" color="text.secondary">Carbon Offset</Typography>
                  <Typography variant="body2" color="text.secondary">Waste Reduction</Typography>
                  <Typography variant="body2" color="text.secondary">Urban Farming</Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 2 }}>Contact</Typography>
                <Typography variant="body2" color="text.secondary">info@kilimolink.app</Typography>
                <Typography variant="body2" color="text.secondary">Nairobi, Kenya</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block', opacity: 0.5 }}>
                  Build v1.0.4 - Institutional Intelligence
                </Typography>
              </Grid>
            </Grid>
            <Divider sx={{ my: 4 }} />
            <Typography variant="body2" color="text.secondary" align="center">
              © 2026 KilimoLink. Built with Solana & Next.js for Future Cities.
            </Typography>
          </Container>
        </Box>
      </Box>
    </BrowserRouter>
  );
}
