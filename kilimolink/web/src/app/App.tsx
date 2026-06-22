import { useState, useEffect, useRef, useCallback, lazy, Suspense } from 'react';
import { Grid, Divider, Dialog, DialogTitle, DialogContent, DialogActions, RadioGroup, FormControlLabel, Radio, TextField, Alert, Tabs, Tab, CircularProgress, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { AppBar, Badge, Box, Button, Container, Toolbar, Typography, Stack, useTheme, useMediaQuery, Paper, IconButton, Drawer, List, ListItem, ListItemText, ListItemButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import StorefrontIcon from '@mui/icons-material/Storefront';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { BrowserRouter, Link, Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { motion } from 'framer-motion';
import { BackgroundArt } from '../components/BackgroundArt';
import { UIProvider, useUI } from './UIContext';
import { ProductProvider } from './ProductContext';
import { api, setAuthToken } from '../services/api';
import { applyToken, saveToken, loadRole, saveRole, isOnboardingDone, setOnboardingDone, clearAllAuth } from '../services/auth';

const AdminPage = lazy(() => import('../pages/AdminPage').then(m => ({ default: m.AdminPage })));
const Marketplace = lazy(() => import('../pages/Marketplace').then(m => ({ default: m.Marketplace })));
const SellProduct = lazy(() => import('../pages/SellProduct').then(m => ({ default: m.SellProduct })));
const ProductDetail = lazy(() => import('../pages/ProductDetail').then(m => ({ default: m.ProductDetail })));
const MyProducts = lazy(() => import('../pages/MyProducts').then(m => ({ default: m.MyProducts })));
const OrdersPage = lazy(() => import('../pages/OrdersPage').then(m => ({ default: m.OrdersPage })));
const CountyDashboard = lazy(() => import('../pages/CountyDashboard').then(m => ({ default: m.CountyDashboard })));

const MotionTypography = motion(Typography);
const MotionPaper = motion(Paper);

function HomePage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const [impact, setImpact] = useState<any>(null);

  useEffect(() => {
    api.get('/impact').then(r => setImpact(r.data)).catch(() => {
      setImpact({ wasteDivertedKg: 127, greenSpaceM2: 340 });
    });
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
            KilimoLink Direct
          </MotionTypography>
          <MotionTypography 
            variant="h6" 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.35 }}
            sx={{
              display: 'inline-flex',
              px: 2,
              py: 0.75,
              mb: 3,
              borderRadius: 999,
              bgcolor: '#ecfdf5',
              color: '#047857',
              fontWeight: 900,
              letterSpacing: '0.02em',
              textTransform: 'uppercase',
              fontSize: { xs: '0.75rem', md: '0.9rem' }
            }}
          >
            Nairobi AI Food System Climate Intelligence
          </MotionTypography>
          <MotionTypography 
            variant="h5" 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            sx={{ 
              mb: { xs: 4, md: 6 }, 
              color: '#374151',
              maxWidth: '940px', 
              mx: 'auto', 
              fontWeight: 500, 
              lineHeight: 1.5,
              fontSize: { xs: '1.1rem', md: '1.5rem' },
              letterSpacing: '-0.01em'
            }}
          >
            A working marketplace that becomes Nairobi's real-time sensor network for food flows, price shocks, emissions, and climate disruption risk.
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
          Marketplace data becomes city climate intelligence
        </Typography>
        <Typography variant="body1" align="center" sx={{ mb: 8, color: '#4b5563', maxWidth: '760px', mx: 'auto', fontSize: '1.25rem' }}>
          Farmers and buyers use the app. Nairobi County gets the missing food-flow data needed to protect vulnerable neighborhoods before climate shocks become food crises.
        </Typography>

        <Grid container spacing={4} sx={{ mb: 15 }}>
          {[
            {
              title: "Direct Food Flows",
              desc: "Each listing records what food is available, where it comes from, and which Nairobi neighborhoods it can serve.",
              icon: "🛒",
              color: "#f0fdf4"
            },
            {
              title: "AI Risk Signals",
              desc: "Price guidance, disruption alerts, and transaction trends become early warnings for shortages and price spikes.",
              icon: "🧠",
              color: "#fffbeb"
            },
            {
              title: "County Dashboard",
              desc: "Food-flow maps, informal settlement risk, food desert gaps, and climate impact metrics in one place.",
              icon: "🏙️",
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
            Real results from real transactions on KilimoLink Direct.
          </Typography>
          <Grid container spacing={4} justifyContent="center">
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
            Move food faster. Waste less. Earn more.
          </Typography>
          <Typography variant="h5" sx={{ opacity: 0.9, fontWeight: 400, mb: 2, maxWidth: '680px', lineHeight: 1.5 }}>
            Farmers list produce. Buyers order directly. Nairobi finally sees where food is, where it is going, and when climate will break the chain.
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.7, fontWeight: 500, mb: 6, maxWidth: '600px', lineHeight: 1.5 }}>
            kilimolink.onrender.com - live demo for I4C26 Nairobi
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
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('FARMER');
  const [authTab, setAuthTab] = useState(0);
  const [registerMode, setRegisterMode] = useState(false);
  const [phone, setPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpDevCode, setOtpDevCode] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState<string | null>(loadRole());
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [pendingOrderCount, setPendingOrderCount] = useState(0);
  const [isOnline, setIsOnline] = useState(() => typeof navigator === 'undefined' ? true : navigator.onLine);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();

  useEffect(() => {
    const token = applyToken('user');
    if (token) {
      api.get('/auth/me').then(r => {
        setAuthenticated(true);
        const data = r.data;
        setUserEmail(data?.email || localStorage.getItem('email'));
        setUserName(data?.name || null);
        setUserId(data?.id || null);
        setCurrentRole(data?.role || loadRole());
      }).catch(() => {
        clearAllAuth();
        setAuthenticated(false);
        setUserEmail(null);
        setUserId(null);
        setUserName(null);
        setCurrentRole(null);
      }).finally(() => setAuthLoading(false));
    } else {
      setAuthLoading(false);
    }
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

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const showDemoBanner = userEmail?.startsWith('demo@') && authenticated;

  const demoLogin = () => {
    saveToken('user', 'demo-token-123');
    saveRole('FARMER');
    localStorage.setItem('email', 'demo@farmers.co.ke');
    localStorage.setItem('kilomolink_user_id', 'demo-user-123');
    localStorage.setItem('kilomolink_user_name', 'Demo Farmer');
    setAuthToken('demo-token-123');
    setAuthenticated(true);
    setUserEmail('demo@farmers.co.ke');
    setUserId('demo-user-123');
    setUserName('Demo Farmer');
    setCurrentRole('FARMER');
    setLoginOpen(false);
    setLoginEmail('');
    setLoginPassword('');
    setPhone('');
    setOtpCode('');
    setOtpSent(false);
    setRegisterMode(false);
    setLoginError(null);
    if (!isOnboardingDone()) {
      setSelectedRole('FARMER');
      setOnboardingOpen(true);
    }
  };

  const handlePasswordLogin = async () => {
    if (!loginEmail.trim() || !loginPassword.trim()) return;
    setLoginError(null);
    setLoginLoading(true);
    try {
      const response = await api.post('/auth/login', {
        email: loginEmail.trim(),
        password: loginPassword,
      });
      const { token, user } = response.data;
      saveToken('user', token);
      saveRole(user.role);
      localStorage.setItem('email', user.email);
      localStorage.setItem('kilomolink_user_id', user.id);
      localStorage.setItem('kilomolink_user_name', user.name);
      setAuthToken(token);
      setAuthenticated(true);
      setUserEmail(user.email);
      setUserId(user.id);
      setUserName(user.name);
      setCurrentRole(user.role);
      setLoginOpen(false);
      setLoginEmail('');
      setLoginPassword('');
      setLoginError(null);
      if (!isOnboardingDone()) {
        setSelectedRole(user.role);
        setOnboardingOpen(true);
      }
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 401) setLoginError('Wrong password');
      else if (status === 404) setLoginError('User not found. Please register first.');
      else setLoginError('Server error. Use Demo Mode below.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!loginEmail.trim() || !registerPassword.trim()) return;
    if (registerPassword !== confirmPassword) {
      setLoginError('Passwords do not match');
      return;
    }
    if (registerPassword.length < 6) {
      setLoginError('Password must be at least 6 characters');
      return;
    }
    setLoginError(null);
    setLoginLoading(true);
    try {
      const response = await api.post('/auth/register', {
        email: loginEmail.trim(),
        password: registerPassword,
        name: registerName.trim() || loginEmail.trim().split('@')[0],
        role: selectedRole,
      });
      const { token, user } = response.data;
      saveToken('user', token);
      saveRole(user.role);
      localStorage.setItem('email', user.email);
      localStorage.setItem('kilomolink_user_id', user.id);
      localStorage.setItem('kilomolink_user_name', user.name);
      setAuthToken(token);
      setAuthenticated(true);
      setUserEmail(user.email);
      setUserId(user.id);
      setUserName(user.name);
      setCurrentRole(user.role);
      setLoginOpen(false);
      setRegisterMode(false);
      setLoginEmail('');
      setRegisterPassword('');
      setConfirmPassword('');
      setRegisterName('');
      setLoginError(null);
      if (!isOnboardingDone()) {
        setSelectedRole(user.role);
        setOnboardingOpen(true);
      }
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 409) setLoginError('An account with this email already exists');
      else setLoginError('Registration failed. Please try again.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleSendOtp = async () => {
    if (!phone.trim()) return;
    setLoginError(null);
    setLoginLoading(true);
    try {
      const res = await api.post('/auth/send-otp', { phone: phone.trim() });
      setOtpSent(true);
      if (res.data.devCode) {
        setOtpDevCode(res.data.devCode);
        setLoginError(`Dev code: ${res.data.devCode}`);
      } else {
        setLoginError('Code sent to your phone');
      }
    } catch {
      setLoginError('Failed to send code. Try again.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!phone.trim() || !otpCode.trim()) return;
    setLoginError(null);
    setLoginLoading(true);
    try {
      const response = await api.post('/auth/verify-otp', {
        phone: phone.trim(),
        code: otpCode,
      });
      const { token, user } = response.data;
      saveToken('user', token);
      saveRole(user.role);
      localStorage.setItem('email', user.email);
      localStorage.setItem('kilomolink_user_id', user.id);
      localStorage.setItem('kilomolink_user_name', user.name);
      setAuthToken(token);
      setAuthenticated(true);
      setUserEmail(user.email);
      setUserId(user.id);
      setUserName(user.name);
      setCurrentRole(user.role);
      setLoginOpen(false);
      setPhone('');
      setOtpCode('');
      setOtpSent(false);
      setOtpDevCode(null);
      setLoginError(null);
      if (!isOnboardingDone()) {
        setSelectedRole(user.role);
        setOnboardingOpen(true);
      }
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 429) setLoginError('Too many attempts. Account locked 10 minutes.');
      else if (status === 401) setLoginError('Invalid or expired code');
      else setLoginError('Verification failed');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleOldLogin = async () => {
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
      setLoginError('Server is waking up. Use Demo Mode below.');
    }
  };

  const handleLogout = () => {
    saveToken('user', null);
    setAuthToken(null);
    clearAllAuth();
    localStorage.removeItem('email');
    localStorage.removeItem('kilomolink_user_id');
    localStorage.removeItem('kilomolink_user_name');
    setAuthenticated(false);
    setUserEmail(null);
    setUserId(null);
    setUserName(null);
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
      {!isOnline && (
        <Alert severity="warning" sx={{ borderRadius: 0, justifyContent: 'center', '& .MuiAlert-message': { fontWeight: 800 } }}>
          You're offline - use the preloaded demo pages or backup recording.
        </Alert>
      )}
      {showDemoBanner && (
        <Box sx={{ bgcolor: '#2e7d32', color: 'white', textAlign: 'center', py: 0.5, fontSize: 13, fontWeight: 700 }}>
          Demo Mode - one tap to explore
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
            KILIMOLINK DIRECT
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
              <Button color="inherit" component={Link} to="/county-dashboard" sx={{ color: '#064e3b', fontWeight: 800, px: 2 }}>County Dashboard</Button>
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
            <ListItemButton component={Link} to="/sell" onClick={() => setMobileMenuOpen(false)}>
              <ListItemText primary="Sell Produce" primaryTypographyProps={{ fontWeight: 700, color: '#064e3b' }} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/orders" onClick={() => setMobileMenuOpen(false)}>
              <ListItemText primary="My Orders" primaryTypographyProps={{ fontWeight: 700 }} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/county-dashboard" onClick={() => setMobileMenuOpen(false)}>
              <ListItemText primary="County Dashboard" primaryTypographyProps={{ fontWeight: 800, color: '#064e3b' }} />
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
      <Dialog open={loginOpen} onClose={() => { setLoginOpen(false); setRegisterMode(false); setOtpSent(false); setLoginError(null); }} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 4, p: 2 } }}>
        <DialogTitle sx={{ fontWeight: 900, color: '#064e3b', textAlign: 'center', fontSize: '1.5rem' }}>
          {registerMode ? 'Create Account' : 'Sign In'}
        </DialogTitle>
        <DialogContent>
          {!registerMode && (
            <Tabs value={authTab} onChange={(_, v) => { setAuthTab(v); setLoginError(null); setOtpSent(false); }} sx={{ mb: 3, '& .MuiTab-root': { fontWeight: 700, textTransform: 'none' } }} centered>
              <Tab label="Password" />
              <Tab label="OTP" />
            </Tabs>
          )}

          {registerMode ? (
            <>
              <TextField autoFocus fullWidth label="Email" type="email" placeholder="you@example.com" value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)} sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />
              <TextField fullWidth label="Full Name" placeholder="Your name" value={registerName}
                onChange={(e) => setRegisterName(e.target.value)} sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />
              <TextField fullWidth label="Password" type="password" value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)} sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />
              <TextField fullWidth label="Confirm Password" type="password" value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)} sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Role</InputLabel>
                <Select value={selectedRole} label="Role" onChange={(e) => setSelectedRole(e.target.value)} sx={{ borderRadius: 3 }}>
                  <MenuItem value="FARMER">Farmer</MenuItem>
                  <MenuItem value="BUYER">Buyer</MenuItem>
                </Select>
              </FormControl>
            </>
          ) : authTab === 0 ? (
            <>
              <TextField autoFocus fullWidth label="Email" type="email" placeholder="you@example.com" value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)} sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />
              <TextField fullWidth label="Password" type="password" value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') handlePasswordLogin(); }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />
            </>
          ) : (
            <>
              <TextField autoFocus fullWidth label="Phone Number" placeholder="+2547XXXXXXXX" value={phone}
                onChange={(e) => setPhone(e.target.value)} sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />
              {otpSent && (
                <TextField fullWidth label="6-digit Code" value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') handleVerifyOtp(); }}
                  sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />
              )}
            </>
          )}

          {loginError && (
            <Typography sx={{ mt: 1, color: '#991b1b', fontWeight: 600, textAlign: 'center', fontSize: '0.85rem' }}>
              {loginError}
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, flexDirection: 'column', gap: 1.5 }}>
          {registerMode ? (
            <>
              <Button fullWidth variant="contained" size="large" disabled={loginLoading}
                onClick={handleRegister} sx={{ bgcolor: '#064e3b', py: 1.5, borderRadius: 3, fontWeight: 800, '&:hover': { bgcolor: '#065f46' } }}>
                {loginLoading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Register'}
              </Button>
              <Button fullWidth size="small" sx={{ textTransform: 'none', fontWeight: 600, color: '#059669' }}
                onClick={() => { setRegisterMode(false); setLoginError(null); }}>
                Already have an account? Sign In
              </Button>
            </>
          ) : authTab === 0 ? (
            <>
              <Button fullWidth variant="contained" size="large" disabled={loginLoading}
                onClick={handlePasswordLogin} sx={{ bgcolor: '#064e3b', py: 1.5, borderRadius: 3, fontWeight: 800, '&:hover': { bgcolor: '#065f46' } }}>
                {loginLoading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Sign In'}
              </Button>
              <Button fullWidth size="small" sx={{ textTransform: 'none', fontWeight: 600, color: '#059669' }}
                onClick={() => { setRegisterMode(true); setLoginError(null); }}>
                No account? Create one
              </Button>
            </>
          ) : (
            <>
              {!otpSent ? (
                <Button fullWidth variant="contained" size="large" disabled={loginLoading}
                  onClick={handleSendOtp} sx={{ bgcolor: '#064e3b', py: 1.5, borderRadius: 3, fontWeight: 800, '&:hover': { bgcolor: '#065f46' } }}>
                  {loginLoading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Send Code'}
                </Button>
              ) : (
                <Button fullWidth variant="contained" size="large" disabled={loginLoading}
                  onClick={handleVerifyOtp} sx={{ bgcolor: '#064e3b', py: 1.5, borderRadius: 3, fontWeight: 800, '&:hover': { bgcolor: '#065f46' } }}>
                  {loginLoading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Verify & Sign In'}
                </Button>
              )}
            </>
          )}

          <Button fullWidth variant="outlined" size="large"
            onClick={demoLogin} sx={{ color: '#059669', borderColor: '#059669', py: 1.5, borderRadius: 3, fontWeight: 800, '&:hover': { borderColor: '#047857', bgcolor: '#f0fdf4' } }}>
            Demo Mode (offline)
          </Button>
        </DialogActions>
      </Dialog>

      {/* Onboarding Dialog */}
      <Dialog open={onboardingOpen} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4, p: 2 } }}>
        <DialogTitle sx={{ fontWeight: 900, color: '#064e3b', textAlign: 'center', fontSize: '1.5rem' }}>
          Welcome to KilimoLink Direct
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
          {loginError && !loginOpen && (
            <Box sx={{ mb: 3, p: 2, bgcolor: '#fef2f2', borderRadius: 3, border: '1px solid #fecaca', textAlign: 'center' }}>
              <Typography sx={{ color: '#991b1b', fontWeight: 600, fontSize: '0.9rem' }}>{loginError}</Typography>
              <Button size="small" sx={{ mt: 1, color: '#059669', fontWeight: 700, textTransform: 'none' }} onClick={() => { clearAllAuth(); handleLogout(); }}>
                Sign out and try again
              </Button>
            </Box>
          )}
          <AnimatePresence mode="wait">
            <MotionBox key={location.pathname} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
              <Suspense fallback={<Box sx={{ p: 4, textAlign: 'center' }}><Typography color="text.secondary">Loading...</Typography></Box>}>
                <Routes location={location}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/market" element={<Marketplace />} />
                  <Route path="/sell" element={<SellProduct />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/orders" element={<OrdersPage />} />
                  <Route path="/county-dashboard" element={<CountyDashboard />} />
                  <Route path="/my-products" element={<MyProducts />} />
                  <Route path="/admin" element={<AdminPage />} />
                </Routes>
              </Suspense>
            </MotionBox>
          </AnimatePresence>
        </Container>

      <Box component="footer" sx={{ py: 6, borderTop: '1px solid #eee', bgcolor: 'white', mt: 'auto' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ fontWeight: 900, color: '#064e3b', mb: 2 }}>KILIMOLINK DIRECT</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                KilimoLink Direct connects you directly with local farmers. Fresh produce, fair prices, no middlemen.
              </Typography>
            </Grid>
            <Grid item xs={6} md={2}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 2 }}>Platform</Typography>
              <Stack spacing={1}>
                <Link to="/market" style={{ textDecoration: 'none', color: '#666', fontSize: '0.875rem' }}>Marketplace</Link>
                <Link to="/county-dashboard" style={{ textDecoration: 'none', color: '#064e3b', fontSize: '0.875rem', fontWeight: 800 }}>County Dashboard</Link>
                <Link to="/sell" style={{ textDecoration: 'none', color: '#666', fontSize: '0.875rem' }}>Sell Produce</Link>
                <Link to="/my-products" style={{ textDecoration: 'none', color: '#666', fontSize: '0.875rem' }}>My Products</Link>
                <Link to="/orders" style={{ textDecoration: 'none', color: '#666', fontSize: '0.875rem' }}>My Orders</Link>
              </Stack>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 2 }}>Contact</Typography>
              <Typography variant="body2" color="text.secondary">kilimolink@proton.me</Typography>
              <Typography variant="body2" color="text.secondary">Nairobi, Kenya</Typography>
            </Grid>
          </Grid>
          <Divider sx={{ my: 4 }} />
          <Typography variant="body2" color="text.secondary" align="center" sx={{ fontWeight: 600 }}>
            kilimolink.onrender.com - I4C26
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 0.5 }}>
            &copy; 2026 KilimoLink Direct. Fresh from the farm, straight to your table.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}

const routerBasename = import.meta.env.BASE_URL === '/' ? undefined : import.meta.env.BASE_URL.replace(/\/$/, '');

export function App() {
  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    if (window.location.search.startsWith('?/')) {
      const restoredPath = window.location.search.slice(2);
      const basePath = import.meta.env.BASE_URL === '/' ? '/' : import.meta.env.BASE_URL;
      window.history.replaceState(null, '', `${basePath}${restoredPath}${window.location.hash}`);
    }
  }, []);

  useEffect(() => {
    setTimeout(() => {
      import('../pages/Marketplace');
      import('../pages/CountyDashboard');
    }, 2000);
  }, []);

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
    <BrowserRouter basename={routerBasename}>
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