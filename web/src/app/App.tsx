import { useState, useEffect, useMemo, useRef } from 'react';
import { Grid, Divider, Dialog, DialogTitle, DialogContent, DialogActions, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { AppBar, Box, Button, Container, Toolbar, Typography, Stack, useTheme, useMediaQuery, Paper, IconButton, Drawer, List, ListItem, ListItemText, ListItemButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import StorefrontIcon from '@mui/icons-material/Storefront';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { BrowserRouter, Link, Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import { usePrivy } from '@privy-io/react-auth';
import { AnimatePresence } from 'framer-motion';
import { AdminPage } from '../pages/AdminPage';
import { Marketplace } from '../pages/Marketplace';
import { SellProduct } from '../pages/SellProduct';
import { ProductDetail } from '../pages/ProductDetail';
import { MyProducts } from '../pages/MyProducts';
import { OrdersPage } from '../pages/OrdersPage';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { solanaService } from '../services/solanaService';
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
            Direct farm-to-city trade. No middlemen. Just fresh produce and fair prices.
            <Box component="span" sx={{ display: 'block', mt: 1, fontWeight: 800, color: '#059669', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Built for the Innovate4Cities 2026 Challenge
            </Box>
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

      {/* Primary Visual: Handshake Photo */}
      <MotionBox 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        sx={{ mb: 15, position: 'relative', zIndex: 1 }}
      >
        <Box sx={{ position: 'relative', maxWidth: '1100px', mx: 'auto', px: 2 }}>
          <Box 
            component="img" 
            src="/handshake.jpg" 
            alt="Institutional Intelligence"
            sx={{ 
              width: '100%', 
              borderRadius: 8, 
              boxShadow: '0 40px 80px rgba(0,0,0,0.15)',
              aspectRatio: { xs: '4/3', md: '21/9' },
              objectFit: 'cover',
              border: '1px solid rgba(0,0,0,0.05)'
            }}
          />
          <Box sx={{ 
            position: 'absolute', 
            bottom: { xs: 20, md: 40 }, 
            left: { xs: 20, md: 40 }, 
            right: { xs: 20, md: 'auto' },
            p: 4, 
            bgcolor: 'rgba(255,255,255,0.95)', 
            backdropFilter: 'blur(12px)',
            borderRadius: 6, 
            boxShadow: '0 30px 60px rgba(0,0,0,0.12)', 
            border: '1px solid rgba(255,255,255,0.8)',
            maxWidth: { xs: 'none', md: '600px' }
          }}>
            <Typography variant="h6" sx={{ fontWeight: 950, color: '#064e3b', mb: 1.5, letterSpacing: '-0.03em', lineHeight: 1.2 }}>
              Institutional intelligence from global founders backing Kenya's food future
            </Typography>
            <Typography variant="body1" sx={{ color: '#4b5563', lineHeight: 1.7, fontWeight: 500 }}>
              We are rebuilding the trust layer between urban demand and rural supply, ensuring every transaction strengthens our food system.
            </Typography>
          </Box>
        </Box>
      </MotionBox>

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Typography variant="h3" align="center" gutterBottom sx={{ fontWeight: 900, mb: 2, letterSpacing: '-0.04em', color: '#064e3b' }}>
          Built for Resilience
        </Typography>
        <Typography variant="body1" align="center" sx={{ mb: 8, color: '#4b5563', maxWidth: '700px', mx: 'auto', fontSize: '1.25rem' }}>
          Solving urban food challenges with simple, direct technology.
        </Typography>

        <Grid container spacing={4} sx={{ mb: 15 }}>
          {[
            {
              title: "Zero Waste",
              desc: "Direct farm-to-city trade means less time in transit and more fresh food on tables.",
              icon: "🌱",
              color: "#f0fdf4"
            },
            {
              title: "Local First",
              desc: "We prioritize products grown within your city limits to reduce carbon footprint.",
              icon: "📍",
              color: "#eff6ff"
            },
            {
              title: "Fair Prices",
              desc: "By removing middlemen, farmers earn more and you pay less for better quality.",
              icon: "🤝",
              color: "#fffbeb"
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
            Join the food revolution.
          </Typography>
          <Typography variant="h5" sx={{ opacity: 0.9, fontWeight: 400, mb: 6, maxWidth: '600px', lineHeight: 1.5 }}>
            Help us build a more resilient and transparent food system for everyone in Kenya.
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
  const { login, authenticated, user, logout, getAccessToken } = usePrivy();
  const [balances, setBalances] = useState<any[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState<string | null>(loadRole());
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>('FARMER');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [syncKey, setSyncKey] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();

  useEffect(() => {
    applyToken('user');
  }, []);

  useEffect(() => {
    const syncToken = async () => {
      if (!authenticated) {
        saveToken('user', null);
        setAuthToken(null);
        setCurrentRole(null);
        return;
      }

      try {
        await getAccessToken();
      } catch {
        setLoginError('Could not complete authentication. Try again.');
        return;
      }

      const email = user?.email?.address ?? `${user?.wallet?.address || 'wallet-user'}@privy.kilimolink`;
      const name =
        user?.email?.address?.split('@')[0] ||
        user?.wallet?.address?.slice(0, 8) ||
        'Farmer';

      const savedRole = loadRole();
      if (!isOnboardingDone() && !savedRole) {
        setSelectedRole('FARMER');
        setOnboardingOpen(true);
        return;
      }

      try {
        const response = await api.post('/auth/login-email', {
          email,
          name,
          role: savedRole || 'FARMER',
        });

        const token = response.data?.token;
        const role = response.data?.user?.role || savedRole || 'FARMER';
        saveToken('user', token);
        saveRole(role);
        setAuthToken(token);
        setCurrentRole(role);
        setLoginError(null);
      } catch {
        setLoginError('Could not connect to the server. Please try again later.');
        clearAllAuth();
        setCurrentRole(null);
      }
    };
    syncToken();
  }, [authenticated, getAccessToken, user, syncKey]);

  const handleOnboardingConfirm = async () => {
    setOnboardingOpen(false);
    setOnboardingDone(true);
    const role = selectedRole === 'BOTH' ? 'FARMER' : selectedRole;
    saveRole(role);

    const email = user?.email?.address ?? `${user?.wallet?.address || 'wallet-user'}@privy.kilimolink`;
    const name =
      user?.email?.address?.split('@')[0] ||
      user?.wallet?.address?.slice(0, 8) ||
      'Farmer';

    try {
      const response = await api.post('/auth/login-email', {
        email,
        name,
        role,
      });
      const token = response.data?.token;
      const serverRole = response.data?.user?.role || role;
      saveToken('user', token);
      saveRole(serverRole);
      setAuthToken(token);
      setCurrentRole(serverRole);
      setLoginError(null);
      setSyncKey(k => k + 1);
    } catch (err) {
      console.error('Failed to complete onboarding', err);
      setLoginError('Onboarding failed. Please try again.');
    }
  };

  useEffect(() => {
    if (authenticated && user?.wallet?.address) {
      const fetchBalances = async () => {
        const data = await solanaService.getStablecoinBalances(user.wallet!.address!);
        setBalances(data);
      };
      fetchBalances();
    } else {
      setBalances([]);
    }
  }, [authenticated, user]);

  const totalUSDC = useMemo(() => {
    return balances
      .filter(b => b.symbol === 'USDC')
      .reduce((acc, curr) => acc + (curr.balance || 0), 0);
  }, [balances]);

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: 'background.default', display: 'flex', flexDirection: 'column' }}>
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
              {authenticated && totalUSDC > 0 && (
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1, 
                  bgcolor: '#e8f5e9', 
                  px: 2, 
                  py: 0.75, 
                  borderRadius: 3,
                  border: '1px solid #c8e6c9'
                }}>
                  <AccountBalanceWalletIcon sx={{ fontSize: 18, color: '#2e7d32' }} />
                  <Typography variant="body2" sx={{ fontWeight: 800, color: '#064e3b' }}>
                    {totalUSDC.toLocaleString()} USDC
                  </Typography>
                </Box>
              )}
              <Button color="inherit" component={Link} to="/market" sx={{ color: '#333', fontWeight: 600, px: 2 }}>Market</Button>
              {authenticated && currentRole === 'FARMER' && (
                <Button color="inherit" component={Link} to="/my-products" sx={{ color: '#333', fontWeight: 600, px: 2 }}>My Products</Button>
              )}
              <Button color="inherit" component={Link} to="/orders" sx={{ color: '#333', fontWeight: 600, px: 2 }}>Orders</Button>
              {authenticated && user?.email?.address === 'admin@kilimolink.demo' && (
                <Button color="inherit" component={Link} to="/admin" sx={{ color: '#333', fontWeight: 600, px: 2 }}>Admin</Button>
              )}
              <Box sx={{ ml: 2 }}>
                {!authenticated ? (
                  <Button variant="contained" color="success" onClick={login} sx={{ textTransform: 'none', borderRadius: 3, px: 4, py: 1, fontWeight: 'bold', boxShadow: 'none' }}>
                    Connect
                  </Button>
                ) : (
                  <Button
                    variant="outlined"
                    color="success"
                    onClick={() => {
                      saveToken('user', null);
                      setAuthToken(null);
                      logout();
                    }}
                    sx={{ textTransform: 'none', borderRadius: 3, px: 3, py: 1, fontWeight: 'bold' }}
                  >
                    {user?.email?.address?.split('@')[0] || 'Farmer'}
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
          {authenticated && user?.email?.address === 'admin@kilimolink.demo' && (
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/admin" onClick={() => setMobileMenuOpen(false)}>
                <ListItemText primary="Admin Oversight" primaryTypographyProps={{ fontWeight: 700 }} />
              </ListItemButton>
            </ListItem>
          )}
          <Divider sx={{ my: 2 }} />
          <ListItem sx={{ flexDirection: 'column', gap: 2 }}>
            {!authenticated ? (
              <Button fullWidth variant="contained" color="success" onClick={login} sx={{ borderRadius: 3, py: 1.5, fontWeight: 'bold' }}>
                Connect Wallet
              </Button>
            ) : (
              <>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%', p: 2, bgcolor: '#f5f5f5', borderRadius: 3 }}>
                  <AccountBalanceWalletIcon sx={{ color: '#064e3b' }} />
                  <Typography variant="body2" sx={{ fontWeight: 800 }}>{totalUSDC} USDC</Typography>
                </Box>
                <Button
                  fullWidth
                  variant="outlined"
                  color="error"
                  onClick={() => {
                    saveToken('user', null);
                    setAuthToken(null);
                    logout();
                  }}
                  sx={{ borderRadius: 3, py: 1.5, fontWeight: 'bold' }}
                >
                  Logout
                </Button>
              </>
            )}
          </ListItem>
        </List>
      </Drawer>

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
                      Sell your produce and buy from other farmers — the full marketplace experience.
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
              <Button size="small" sx={{ mt: 1, color: '#059669', fontWeight: 700, textTransform: 'none' }} onClick={() => { clearAllAuth(); logout(); }}>
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
                KilimoLink is a transparent marketplace and climate-action tracker connecting urban consumers with local producers.
              </Typography>
              <Typography variant="caption" sx={{ fontWeight: 800, color: '#059669', textTransform: 'uppercase' }}>
                Built for the Innovate4Cities 2026 challenge
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
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 2 }}>Impact</Typography>
              <Stack spacing={1}>
                <Typography variant="body2" color="text.secondary">Carbon Offset</Typography>
                <Typography variant="body2" color="text.secondary">Waste Reduction</Typography>
                <Typography variant="body2" color="text.secondary">Urban Farming</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 2 }}>Contact</Typography>
              <Typography variant="body2" color="text.secondary">kilimolink@proton.me</Typography>
              <Typography variant="body2" color="text.secondary">Nairobi, Kenya</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block', opacity: 0.5 }}>
                Build v1.0.6 - Institutional Intelligence
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
  );
}

export function App() {
  return (
    <BrowserRouter>
      <UIProvider>
        <ProductProvider>
          <AppContent />
        </ProductProvider>
      </UIProvider>
    </BrowserRouter>
  );
}
