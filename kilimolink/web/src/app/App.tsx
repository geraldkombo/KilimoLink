import { useState, useEffect, useRef, useCallback } from 'react';
import { Grid, Divider, Dialog, DialogTitle, DialogContent, DialogActions, RadioGroup, FormControlLabel, Radio, TextField } from '@mui/material';
import { AppBar, Badge, Box, Button, Container, Toolbar, Typography, Stack, useTheme, useMediaQuery, Paper, IconButton, Drawer, List, ListItem, ListItemText, ListItemButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import StorefrontIcon from '@mui/icons-material/Storefront';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { BrowserRouter, Link, Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AdminPage } from '../pages/AdminPage';
import { Marketplace } from '../pages/Marketplace';
import { SellProduct } from '../pages/SellProduct';
import { ProductDetail } from '../pages/ProductDetail';
import { MyProducts } from '../pages/MyProducts';
import { OrdersPage } from '../pages/OrdersPage';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { motion } from 'framer-motion';
import { BackgroundArt } from '../components/BackgroundArt';
import { UIProvider, useUI } from './UIContext';
import { ProductProvider } from './ProductContext';
import { api, setAuthToken } from '../services/api';
import { applyToken, saveToken, loadRole, saveRole, isOnboardingDone, setOnboardingDone, clearAllAuth } from '../services/auth';

const MotionTypography = motion(Typography);
const MotionPaper = motion(Paper);

function HomePage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const [impact, setImpact] = useState<any>(null);

  useEffect(() => {
    api.get('/impact').then(r => setImpact(r.data)).catch(() => {});
  }, []);

  return (
    <Box sx={{ position: 'relative' }}>
      <BackgroundArt />
      
      <MotionBox 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        sx={{ 
          py: { xs: 8, md: 15 }, 
          px: { xs: 2, md: 4 },
          textAlign: 'center', 
          background: 'transparent',
          color: '#1b5e20', 
          mb: { xs: 4, md: 8 },
          position: 'relative',
          zIndex: 1
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <MotionTypography 
            variant="h1" 
            gutterBottom 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            sx={{ 
              fontWeight: 900, 
              fontSize: { xs: '3.5rem', sm: '5rem', md: '7rem' }, 
              letterSpacing: '-0.08em',
              fontFamily: '"Inter", "Roboto", sans-serif',
              textTransform: 'uppercase',
              lineHeight: 0.9,
              mb: 3,
              color: '#064e3b'
            }}
          >
            KilimoLink
          </MotionTypography>
          <MotionTypography 
            variant="h5" 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            sx={{ 
              mb: { xs: 4, md: 6 }, 
              color: '#374151',
              maxWidth: '900px', 
              mx: 'auto', 
              fontWeight: 500, 
              lineHeight: 1.5,
              fontSize: { xs: '1.1rem', md: '1.5rem' },
              letterSpacing: '-0.01em'
            }}
          >
            Cutting food miles. Cutting cold-chain emissions. Connecting Nairobi directly to the farmers who feed it.
          </MotionTypography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" sx={{ px: 2 }}>
            <Button 
              variant="contained" 
              size="large" 
              component={Link} 
              to="/market"
              startIcon={<ShoppingBagIcon />}
              sx={{ 
                bgcolor: '#064e3b', 
                color: 'white', 
                px: 5, 
                py: { xs: 1.5, md: 2.5 }, 
                fontSize: '1.1rem',
                fontWeight: 800,
                borderRadius: 4,
                '&:hover': { bgcolor: '#065f46', transform: 'translateY(-2px)' },
                transition: 'all 0.2s',
                boxShadow: '0 10px 20px rgba(6, 78, 59, 0.2)'
              }}
            >
              Explore Marketplace
            </Button>
            <Button 
              variant="outlined" 
              size="large" 
              component={Link} 
              to="/sell"
              startIcon={<AddCircleIcon />}
              sx={{ 
                px: 5, 
                py: { xs: 1.5, md: 2.5 }, 
                fontSize: '1.1rem',
                fontWeight: 800,
                borderRadius: 4,
                borderWidth: 2,
                color: '#064e3b',
                borderColor: '#064e3b',
                '&:hover': { borderWidth: 2, bgcolor: 'rgba(6, 78, 59, 0.05)', transform: 'translateY(-2px)' },
                transition: 'all 0.2s'
              }}
            >
              Start Selling
            </Button>
          </Stack>
        </Box>
      </MotionBox>



      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Typography variant="h3" align="center" gutterBottom sx={{ fontWeight: 900, mb: 2, letterSpacing: '-0.04em', color: '#064e3b' }}>
          How it works
        </Typography>
        <Typography variant="body1" align="center" sx={{ mb: 8, color: '#4b5563', maxWidth: '700px', mx: 'auto', fontSize: '1.25rem' }}>
          Simple, fast, and fair for everyone.
        </Typography>

        <Grid container spacing={4} sx={{ mb: 15 }}>
          {[
            {
              title: "Browse & Order",
              desc: "Find fresh produce from farmers near you. Order directly with no markup.",
              icon: "🛒",
              color: "#f0fdf4"
            },
            {
              title: "Sell Your Produce",
              desc: "List your harvest in minutes. Set your own price and reach customers in your city.",
              icon: "🌿",
              color: "#fffbeb"
            },
            {
              title: "Fair for Everyone",
              desc: "Farmers keep more profit. Buyers pay less. No middlemen taking a cut.",
              icon: "🤝",
              color: "#eff6ff"
            }
          ].map((item, idx) => (
            <Grid item xs={12} md={4} key={idx}>
              <MotionPaper 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                elevation={0} 
                sx={{ 
                  p: 5, 
                  bgcolor: item.color, 
                  borderRadius: 6, 
                  height: '100%',
                  border: '1px solid rgba(0,0,0,0.03)',
                  transition: 'transform 0.3s', 
                  '&:hover': { transform: 'translateY(-10px)' } 
                }}
              >
                <Typography variant="h2" sx={{ mb: 3 }}>{item.icon}</Typography>
                <Typography variant="h5" sx={{ fontWeight: 900, mb: 2, color: '#064e3b', letterSpacing: '-0.02em' }}>{item.title}</Typography>
                <Typography variant="body1" sx={{ color: '#374151', lineHeight: 1.7, fontSize: '1.1rem' }}>{item.desc}</Typography>
              </MotionPaper>
            </Grid>
          ))}
        </Grid>

        {/* Impact Section */}
        <MotionBox
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          sx={{ mb: 15 }}
        >
          <Typography variant="h3" align="center" gutterBottom sx={{ fontWeight: 900, mb: 2, letterSpacing: '-0.04em', color: '#064e3b' }}>
            Our Impact
          </Typography>
          <Typography variant="body1" align="center" sx={{ mb: 8, color: '#4b5563', maxWidth: '700px', mx: 'auto', fontSize: '1.25rem' }}>
            Real results from real transactions on KilimoLink.
          </Typography>
          <Grid container spacing={4}>
            {[
              { label: 'Waste Reduction', value: impact ? `${Math.round(impact.wasteDivertedKg)}kg` : '-', unit: 'diverted from landfill', color: '#ef6c00', icon: '♻️' },
              { label: 'Urban Farming', value: impact ? `${impact.greenSpaceM2}m\u00b2` : '-', unit: 'green space cultivated', color: '#1565c0', icon: '🏙️' },
            ].map((item, idx) => (
              <Grid item xs={12} md={4} key={idx}>
                <MotionPaper
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.15 }}
                  elevation={0}
                  sx={{
                    p: { xs: 4, md: 5 },
                    textAlign: 'center',
                    bgcolor: 'white',
                    borderRadius: 6,
                    border: '1px solid rgba(0,0,0,0.05)',
                    height: '100%',
                    transition: 'transform 0.3s',
                    '&:hover': { transform: 'translateY(-6px)', boxShadow: '0 20px 40px rgba(0,0,0,0.06)' },
                  }}
                >
                  <Typography variant="h2" sx={{ mb: 2, lineHeight: 1 }}>{item.icon}</Typography>
                  <Typography variant="h3" sx={{ fontWeight: 900, color: item.color, mb: 1, fontSize: { xs: '2.5rem', md: '3rem' }, letterSpacing: '-0.04em' }}>
                    {item.value}
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 800, color: '#374151', mb: 0.5 }}>
                    {item.label}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.unit}
                  </Typography>
                </MotionPaper>
              </Grid>
            ))}
          </Grid>
        </MotionBox>

        <MotionBox 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          sx={{ 
            py: { xs: 8, md: 12 }, 
            px: { xs: 4, md: 8 }, 
            bgcolor: '#064e3b', 
            borderRadius: 8, 
            color: 'white', 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center', 
            textAlign: 'center',
            mb: 10,
            boxShadow: '0 30px 60px rgba(6, 78, 59, 0.25)'
          }}
        >
          <Typography variant="h2" sx={{ fontWeight: 900, mb: 2, fontSize: { xs: '2.5rem', md: '3.5rem' }, letterSpacing: '-0.04em' }}>
            Ready to get started?
          </Typography>
          <Typography variant="h5" sx={{ opacity: 0.9, fontWeight: 400, mb: 2, maxWidth: '600px', lineHeight: 1.5 }}>
            Farmers list produce. Buyers order directly. No middlemen.
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.7, fontWeight: 500, mb: 6, maxWidth: '600px', lineHeight: 1.5 }}>
            kilimolink.onrender.com — live demo for I4C26 Nairobi
          </Typography>
          <Button 
            variant="contained" 
            size="large" 
            component={Link}
            to="/market"
            sx={{ 
              bgcolor: 'white', 
              color: '#064e3b', 
              px: 8, 
              py: 2.5, 
              fontWeight: 900, 
              fontSize: '1.2rem',
              borderRadius: 4, 
              '&:hover': { bgcolor: '#f0fdf4', transform: 'scale(1.05)' },
              transition: 'all 0.3s'
            }}
          >
            Get Started
          </Button>
        </MotionBox>
      </Container>
    </Box>
  );
}

const MotionBox = motion(Box);

function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <MotionBox
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {children}
    </MotionBox>
  );
}

export function AppContent() {
  const [authenticated, setAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState<string | null>(loadRole());
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>('FARMER');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [pendingOrderCount, setPendingOrderCount] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();

  useEffect(() => {
    const token = applyToken('user');
    if (token) {
      setAuthenticated(true);
      const email = localStorage.getItem('email');
      if (email) setUserEmail(email);
    }
    setAuthLoading(false);
  }, []);

  const fetchPendingCount = useCallback(async () => {
    if (!authenticated) { setPendingOrderCount(0); return; }
    try {
      const r = await api.get('/orders', { params: { limit: 100 } });
      const orders = r.data?.orders ?? [];
      setPendingOrderCount(orders.filter((o: any) => o.status === 'PENDING').length);
    } catch { /* ignore */ }
  }, [authenticated]);

  useEffect(() => { fetchPendingCount(); }, [fetchPendingCount, location.pathname]);

  useEffect(() => {
    const handler = () => fetchPendingCount();
    window.addEventListener('orders:changed', handler);
    return () => window.removeEventListener('orders:changed', handler);
  }, [fetchPendingCount]);

  const showDemoBanner = userEmail === 'demo@kilimolink.com' && authenticated;

  const handleLogin = async () => {
    if (!loginEmail.trim()) return;
    setLoginError(null);
    try {
      const response = await api.post('/auth/login-email', {
        email: loginEmail.trim(),
        name: loginEmail.trim().split('@')[0],
        role: 'BUYER',
      });
      const token = response.data?.token;
      const role = response.data?.user?.role || 'BUYER';
      saveToken('user', token);
      saveRole(role);
      localStorage.setItem('email', loginEmail.trim());
      setAuthToken(token);
      setAuthenticated(true);
      setUserEmail(loginEmail.trim());
      setCurrentRole(role);
      setLoginOpen(false);
      setLoginEmail('');
      if (!isOnboardingDone()) {
        setSelectedRole(role);
        setOnboardingOpen(true);
      }
    } catch {
      setLoginError('Could not connect to the server. Please try again.');
    }
  };

  const handleLogout = () => {
    saveToken('user', null);
    setAuthToken(null);
    clearAllAuth();
    localStorage.removeItem('email');
    setAuthenticated(false);
    setUserEmail(null);
    setCurrentRole(null);
  };

  const handleOnboardingConfirm = () => {
    setOnboardingOpen(false);
    setOnboardingDone(true);
    const role = selectedRole === 'BOTH' ? 'FARMER' : selectedRole;
    saveRole(role);
    setCurrentRole(role);
  };

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: 'background.default', display: 'flex', flexDirection: 'column' }}>
      {showDemoBanner && (
        <Box sx={{ bgcolor: '#2e7d32', color: 'white', textAlign: 'center', py: 0.5, fontSize: 13, fontWeight: 700 }}>
          Demo Mode — live system (kilimolink.onrender.com)
        </Box>
      )}
      <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
        <Toolbar sx={{ height: 80, justifyContent: 'space-between' }}>
          <Typography 
            variant="h5" 
            component={Link} 
            to="/" 
            sx={{ 
              fontWeight: '900', 
              letterSpacing: '-0.05em', 
              color: '#064e3b', 
              textDecoration: 'none', 
              fontFamily: '"Inter", "Roboto", sans-serif',
              display: 'flex', 
              alignItems: 'center', 
              gap: 1 
            }}
          >
            KILIMOLINK
          </Typography>

          {isMobile ? (
            <IconButton onClick={() => setMobileMenuOpen(true)} sx={{ color: '#064e3b' }}>
              <MenuIcon />
            </IconButton>
          ) : (
            <Stack direction="row" spacing={1} alignItems="center">
              {authenticated && currentRole && (
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 0.5, 
                  bgcolor: currentRole === 'FARMER' ? '#f0fdf4' : '#eff6ff', 
                  px: 1.5, 
                  py: 0.5, 
                  borderRadius: 2,
                }}>
                  {currentRole === 'FARMER' ? (
                    <StorefrontIcon sx={{ fontSize: 16, color: '#059669' }} />
                  ) : (
                    <ShoppingCartIcon sx={{ fontSize: 16, color: '#2563eb' }} />
                  )}
                  <Typography variant="caption" sx={{ fontWeight: 800, color: currentRole === 'FARMER' ? '#064e3b' : '#1e40af' }}>
                    {currentRole}
                  </Typography>
                </Box>
              )}
              <Button color="inherit" component={Link} to="/market" sx={{ color: '#333', fontWeight: 600, px: 2 }}>Market</Button>
              {authenticated && currentRole === 'FARMER' && (
                <Button color="inherit" component={Link} to="/my-products" sx={{ color: '#333', fontWeight: 600, px: 2 }}>My Products</Button>
              )}
              <Badge badgeContent={pendingOrderCount} color="success" sx={{ '& .MuiBadge-badge': { fontWeight: 800, fontSize: '0.65rem' } }}>
                <Button color="inherit" component={Link} to="/orders" sx={{ color: '#333', fontWeight: 600, px: 2 }}>Orders</Button>
              </Badge>
              {authenticated && currentRole === 'ADMIN' && (
                <Button color="inherit" component={Link} to="/admin" sx={{ color: '#333', fontWeight: 600, px: 2 }}>Admin</Button>
              )}
              <Box sx={{ ml: 2 }}>
                {authLoading ? (
                  <Button variant="contained" color="success" disabled sx={{ textTransform: 'none', borderRadius: 3, px: 4, py: 1, fontWeight: 'bold', boxShadow: 'none' }}>
                    Loading...
                  </Button>
                ) : !authenticated ? (
                  <Button variant="contained" color="success" onClick={() => setLoginOpen(true)} sx={{ textTransform: 'none', borderRadius: 3, px: 4, py: 1, fontWeight: 'bold', boxShadow: 'none' }}>
                    Sign In
                  </Button>
                ) : (
                  <Button
                    variant="outlined"
                    color="success"
                    onClick={handleLogout}
                    sx={{ textTransform: 'none', borderRadius: 3, px: 3, py: 1, fontWeight: 'bold' }}
                  >
                    {userEmail?.split('@')[0] || 'My Account'}
                  </Button>
                )}
              </Box>
            </Stack>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        PaperProps={{ sx: { width: '280px', p: 2 } }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <IconButton onClick={() => setMobileMenuOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        <List>
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/market" onClick={() => setMobileMenuOpen(false)}>
              <ListItemText primary="Marketplace" primaryTypographyProps={{ fontWeight: 700 }} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/orders" onClick={() => setMobileMenuOpen(false)}>
              <ListItemText primary="My Orders" primaryTypographyProps={{ fontWeight: 700 }} />
            </ListItemButton>
          </ListItem>
          {authenticated && currentRole === 'FARMER' && (
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/my-products" onClick={() => setMobileMenuOpen(false)}>
                <ListItemText primary="My Products" primaryTypographyProps={{ fontWeight: 700 }} />
              </ListItemButton>
            </ListItem>
          )}
          {authenticated && currentRole === 'ADMIN' && (
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/admin" onClick={() => setMobileMenuOpen(false)}>
                <ListItemText primary="Admin" primaryTypographyProps={{ fontWeight: 700 }} />
              </ListItemButton>
            </ListItem>
          )}
          <Divider sx={{ my: 2 }} />
          <ListItem sx={{ flexDirection: 'column', gap: 2 }}>
            {!authenticated ? (
              <Button fullWidth variant="contained" color="success" onClick={() => { setLoginOpen(true); setMobileMenuOpen(false); }} sx={{ borderRadius: 3, py: 1.5, fontWeight: 'bold' }}>
                Sign In
              </Button>
            ) : (
              <Button
                fullWidth
                variant="outlined"
                color="error"
                onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                sx={{ borderRadius: 3, py: 1.5, fontWeight: 'bold' }}
              >
                Logout
              </Button>
            )}
          </ListItem>
        </List>
      </Drawer>

      {/* Login Dialog */}
      <Dialog open={loginOpen} onClose={() => setLoginOpen(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 4, p: 2 } }}>
        <DialogTitle sx={{ fontWeight: 900, color: '#064e3b', textAlign: 'center', fontSize: '1.5rem' }}>
          Sign In
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ textAlign: 'center', mb: 3, color: '#4b5563' }}>
            Enter your email to get started.
          </Typography>
          <TextField
            autoFocus
            fullWidth
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleLogin(); }}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
          />
          {loginError && (
            <Typography sx={{ mt: 2, color: '#991b1b', fontWeight: 600, textAlign: 'center', fontSize: '0.85rem' }}>
              {loginError}
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={handleLogin}
            sx={{ bgcolor: '#064e3b', py: 1.5, borderRadius: 3, fontWeight: 800, '&:hover': { bgcolor: '#065f46' } }}
          >
            Continue
          </Button>
        </DialogActions>
      </Dialog>

      {/* Onboarding Dialog */}
      <Dialog open={onboardingOpen} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4, p: 2 } }}>
        <DialogTitle sx={{ fontWeight: 900, color: '#064e3b', textAlign: 'center', fontSize: '1.5rem' }}>
          Welcome to KilimoLink
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ textAlign: 'center', mb: 4, color: '#4b5563' }}>
            Are you here to buy fresh produce or sell your farm products?
          </Typography>
            <RadioGroup value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)} sx={{ gap: 2 }}>
            <Paper
              elevation={0}
              onClick={() => setSelectedRole('FARMER')}
              sx={{
                p: 3,
                borderRadius: 3,
                border: '2px solid',
                borderColor: selectedRole === 'FARMER' ? '#064e3b' : '#e5e7eb',
                bgcolor: selectedRole === 'FARMER' ? '#f0fdf4' : 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                transition: 'all 0.2s',
                '&:hover': { borderColor: '#064e3b', bgcolor: '#f0fdf4' },
              }}
            >
              <FormControlLabel
                value="FARMER"
                control={<Radio sx={{ '&.Mui-checked': { color: '#064e3b' } }} />}
                label={
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <StorefrontIcon sx={{ color: '#064e3b' }} />
                      <Typography sx={{ fontWeight: 800, color: '#064e3b' }}>I'm a Farmer</Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      List your produce, set prices, and sell directly to city consumers.
                    </Typography>
                  </Box>
                }
                sx={{ m: 0, width: '100%' }}
              />
            </Paper>
            <Paper
              elevation={0}
              onClick={() => setSelectedRole('BUYER')}
              sx={{
                p: 3,
                borderRadius: 3,
                border: '2px solid',
                borderColor: selectedRole === 'BUYER' ? '#064e3b' : '#e5e7eb',
                bgcolor: selectedRole === 'BUYER' ? '#f0fdf4' : 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                transition: 'all 0.2s',
                '&:hover': { borderColor: '#064e3b', bgcolor: '#f0fdf4' },
              }}
            >
              <FormControlLabel
                value="BUYER"
                control={<Radio sx={{ '&.Mui-checked': { color: '#064e3b' } }} />}
                label={
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <ShoppingCartIcon sx={{ color: '#064e3b' }} />
                      <Typography sx={{ fontWeight: 800, color: '#064e3b' }}>I'm a Buyer</Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      Browse and buy fresh local produce directly from verified farmers.
                    </Typography>
                  </Box>
                }
                sx={{ m: 0, width: '100%' }}
              />
            </Paper>
            <Paper
              elevation={0}
              onClick={() => setSelectedRole('BOTH')}
              sx={{
                p: 3,
                borderRadius: 3,
                border: '2px solid',
                borderColor: selectedRole === 'BOTH' ? '#064e3b' : '#e5e7eb',
                bgcolor: selectedRole === 'BOTH' ? '#f0fdf4' : 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                transition: 'all 0.2s',
                '&:hover': { borderColor: '#064e3b', bgcolor: '#f0fdf4' },
              }}
            >
              <FormControlLabel
                value="BOTH"
                control={<Radio sx={{ '&.Mui-checked': { color: '#064e3b' } }} />}
                label={
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <StorefrontIcon sx={{ color: '#064e3b' }} />
                      <ShoppingCartIcon sx={{ color: '#064e3b', ml: -0.5 }} />
                      <Typography sx={{ fontWeight: 800, color: '#064e3b' }}>I'm Both</Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      Sell your produce and buy from other farmers, the full marketplace experience.
                    </Typography>
                  </Box>
                }
                sx={{ m: 0, width: '100%' }}
              />
            </Paper>
          </RadioGroup>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={handleOnboardingConfirm}
            sx={{ bgcolor: '#064e3b', py: 1.5, borderRadius: 3, fontWeight: 800, '&:hover': { bgcolor: '#065f46' } }}
          >
            Continue
          </Button>
        </DialogActions>
      </Dialog>

        <Container sx={{ py: 6, flexGrow: 1 }}>
          {loginError && (
            <Box sx={{ mb: 3, p: 2, bgcolor: '#fef2f2', borderRadius: 3, border: '1px solid #fecaca', textAlign: 'center' }}>
              <Typography sx={{ color: '#991b1b', fontWeight: 600, fontSize: '0.9rem' }}>{loginError}</Typography>
              <Button size="small" sx={{ mt: 1, color: '#059669', fontWeight: 700, textTransform: 'none' }} onClick={() => { clearAllAuth(); handleLogout(); }}>
                Sign out and try again
              </Button>
            </Box>
          )}
          <AnimatePresence mode="wait">
            <MotionBox key={location.pathname} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
              <Routes location={location}>
                <Route path="/" element={<HomePage />} />
                <Route path="/market" element={<Marketplace />} />
                <Route path="/sell" element={<SellProduct />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/my-products" element={<MyProducts />} />
                <Route path="/admin" element={<AdminPage />} />
              </Routes>
            </MotionBox>
          </AnimatePresence>
        </Container>

      <Box component="footer" sx={{ py: 6, borderTop: '1px solid #eee', bgcolor: 'white', mt: 'auto' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ fontWeight: 900, color: '#064e3b', mb: 2 }}>KILIMOLINK</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                KilimoLink connects you directly with local farmers. Fresh produce, fair prices, no middlemen.
              </Typography>
            </Grid>
            <Grid item xs={6} md={2}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 2 }}>Platform</Typography>
              <Stack spacing={1}>
                <Link to="/market" style={{ textDecoration: 'none', color: '#666', fontSize: '0.875rem' }}>Marketplace</Link>
                <Link to="/sell" style={{ textDecoration: 'none', color: '#666', fontSize: '0.875rem' }}>Sell Produce</Link>
                <Link to="/my-products" style={{ textDecoration: 'none', color: '#666', fontSize: '0.875rem' }}>My Products</Link>
                <Link to="/orders" style={{ textDecoration: 'none', color: '#666', fontSize: '0.875rem' }}>My Orders</Link>
              </Stack>
            </Grid>
            <Grid item xs={6} md={2}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 2 }}>For Farmers</Typography>
              <Stack spacing={1}>
                <Typography variant="body2" color="text.secondary">Start Selling</Typography>
                <Typography variant="body2" color="text.secondary">Pricing Guide</Typography>
                <Typography variant="body2" color="text.secondary">Farmer Tips</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 2 }}>Contact</Typography>
              <Typography variant="body2" color="text.secondary">kilimolink@proton.me</Typography>
              <Typography variant="body2" color="text.secondary">Nairobi, Kenya</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block', opacity: 0.5 }}>
                v1.2.0
              </Typography>
            </Grid>
          </Grid>
          <Divider sx={{ my: 4 }} />
          <Typography variant="body2" color="text.secondary" align="center" sx={{ fontWeight: 600 }}>
            kilimolink.onrender.com — I4C26 Nairobi Live Demo
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 0.5 }}>
            &copy; 2026 KilimoLink. Fresh from the farm, straight to your table.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}

export function App() {
  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => {
      window.removeEventListener('online', on);
      window.removeEventListener('offline', off);
    };
  }, []);

  return (
    <BrowserRouter>
      {!online && (
        <Box sx={{ bgcolor: '#f59e0b', color: 'black', textAlign: 'center', py: 0.5 }}>
          <Typography variant="caption">You are offline. Showing last loaded data.</Typography>
        </Box>
      )}
      <UIProvider>
        <ProductProvider>
          <AppContent />
        </ProductProvider>
      </UIProvider>
    </BrowserRouter>
  );
}