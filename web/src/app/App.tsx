import { useState, useEffect, useMemo } from 'react';
import { AppBar, Box, Button, Container, Toolbar, Typography, Stack, useTheme, useMediaQuery, Paper, Grid, Divider, IconButton, Drawer, List, ListItem, ListItemText, ListItemButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { usePrivy } from '@privy-io/react-auth';
import { AdminPage } from '../pages/AdminPage';
import { Marketplace } from '../pages/Marketplace';
import { SellProduct } from '../pages/SellProduct';
import { ProductDetail } from '../pages/ProductDetail';
import { OrdersPage } from '../pages/OrdersPage';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { solanaService } from '../services/solanaService';

function HomePage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box>
      <Box sx={{ 
        py: { xs: 6, md: 12 }, 
        px: { xs: 2, md: 4 },
        textAlign: 'center', 
        background: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 50%, #4caf50 100%)', 
        borderRadius: { xs: 4, md: 8 }, 
        color: 'white', 
        mb: { xs: 4, md: 8 },
        boxShadow: '0 20px 40px rgba(27, 94, 32, 0.2)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Typography variant="h2" gutterBottom sx={{ 
              fontWeight: 900, 
              fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' }, 
              letterSpacing: '-0.06em',
              fontFamily: '"Inter", "Roboto", sans-serif',
              textTransform: 'uppercase',
              lineHeight: 1
            }}>
              KilimoLink
            </Typography>
          <Typography variant="h5" sx={{ 
            mb: { xs: 4, md: 6 }, 
            opacity: 0.9, 
            maxWidth: '800px', 
            mx: 'auto', 
            fontWeight: 400, 
            lineHeight: 1.6,
            fontSize: { xs: '1.1rem', md: '1.5rem' }
          }}>
            The Urban-Rural Liquidity Layer. Connecting urban centers directly with climate-smart local cultivators for future-city resilience.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" sx={{ px: 2 }}>
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
                py: { xs: 1.5, md: 2 }, 
                fontSize: '1.1rem',
                fontWeight: 'bold',
                borderRadius: 3,
                '&:hover': { bgcolor: '#f5f5f5', transform: 'translateY(-2px)' },
                transition: 'all 0.2s'
              }}
            >
              Marketplace
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
                py: { xs: 1.5, md: 2 }, 
                fontSize: '1.1rem',
                fontWeight: 'bold',
                borderRadius: 3,
                borderWidth: 2,
                '&:hover': { borderWidth: 2, bgcolor: 'rgba(255,255,255,0.1)', transform: 'translateY(-2px)' },
                transition: 'all 0.2s'
              }}
            >
              List Produce
            </Button>
          </Stack>
        </Box>
        {/* Subtle decorative elements */}
        <Box sx={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: '50%' }} />
        <Box sx={{ position: 'absolute', bottom: -100, left: -100, width: 300, height: 300, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: '50%' }} />
      </Box>

      <Typography variant="h3" align="center" gutterBottom sx={{ fontWeight: 800, mb: 2, letterSpacing: '-0.01em', fontSize: { xs: '1.75rem', md: '3rem' } }}>
        Innovate4Cities 2026 Focus
      </Typography>
      <Typography variant="body1" align="center" sx={{ mb: 6, color: 'text.secondary', maxWidth: '700px', mx: 'auto', px: 2 }}>
        Solving the most pressing challenges of urban food systems through decentralized technology and institutional intelligence.
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: { xs: 2, md: 4 }, mb: 10 }}>
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

      <Box sx={{ mb: 10, p: { xs: 3, md: 8 }, bgcolor: '#fafafa', borderRadius: 8, border: '1px solid #eee' }}>
        <Grid container spacing={{ xs: 4, md: 6 }} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h3" sx={{ fontWeight: 900, mb: 3, letterSpacing: '-0.02em', fontSize: { xs: '1.75rem', md: '3rem' } }}>Institutional Intelligence</Typography>
            <Typography variant="body1" sx={{ color: '#555', lineHeight: 1.8, mb: 4, fontSize: '1.1rem' }}>
              We are building a "trust layer" for the urban-rural nexus. By leveraging institutional intelligence and sector-leading execution, we solve the "Ghost in the Supply Chain"—eliminating price asymmetry and providing identity for rural producers.
            </Typography>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Box sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: '#e8f5e9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2e7d32', fontWeight: 'bold', flexShrink: 0 }}>✓</Box>
                <Typography variant="body1" sx={{ fontWeight: 700, fontSize: '0.95rem' }}>Execution over Artificial Incentives</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Box sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: '#e8f5e9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2e7d32', fontWeight: 'bold', flexShrink: 0 }}>✓</Box>
                <Typography variant="body1" sx={{ fontWeight: 700, fontSize: '0.95rem' }}>On-Chain Proof-of-Trade Identity</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Box sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: '#e8f5e9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2e7d32', fontWeight: 'bold', flexShrink: 0 }}>✓</Box>
                <Typography variant="body1" sx={{ fontWeight: 700, fontSize: '0.95rem' }}>Hyperlocal Resilience & Global Standards</Typography>
              </Box>
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ position: 'relative' }}>
              <Box 
                component="img" 
                src="/handshake.jpg" 
                alt="Founder with Sector Leaders"
                sx={{ 
                  width: '100%', 
                  borderRadius: 6, 
                  boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                  aspectRatio: { xs: '4/3', md: '16/10' },
                  objectFit: 'cover'
                }}
              />
              <Box sx={{ 
                position: 'absolute', 
                bottom: { xs: -10, md: -20 }, 
                right: { xs: -10, md: -20 }, 
                p: 2, 
                bgcolor: 'white', 
                borderRadius: 4, 
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)', 
                border: '1px solid #eee',
                maxWidth: '200px'
              }}>
                <Typography variant="caption" sx={{ fontWeight: 900, color: '#1b5e20', display: 'block', lineHeight: 1.2 }}>INSTITUTIONAL INTELLIGENCE</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ py: { xs: 6, md: 8 }, px: { xs: 3, md: 4 }, bgcolor: '#1b5e20', borderRadius: 6, color: 'white', display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', justifyContent: 'space-between', gap: 4, textAlign: { xs: 'center', md: 'left' } }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, fontSize: { xs: '1.5rem', md: '2.125rem' } }}>Ready to join the revolution?</Typography>
          <Typography variant="h6" sx={{ opacity: 0.8, fontWeight: 400, fontSize: { xs: '1rem', md: '1.25rem' } }}>Join 500+ urban farmers already transforming city food systems.</Typography>
        </Box>
        <Button variant="contained" size="large" sx={{ bgcolor: 'white', color: '#1b5e20', px: 6, py: 2, fontWeight: 'bold', borderRadius: 3, '&:hover': { bgcolor: '#f5f5f5' }, width: { xs: '100%', md: 'auto' } }}>
          Get Started Now
        </Button>
      </Box>
    </Box>
  );
}

export function App() {
  const { login, authenticated, user, logout } = usePrivy();
  const [balances, setBalances] = useState<any[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    if (authenticated && user?.wallet?.address) {
      const fetchBalances = async () => {
        const data = await solanaService.getStablecoinBalances(user.wallet.address);
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
    <BrowserRouter>
      <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: '#fcfcfc', display: 'flex', flexDirection: 'column' }}>
        <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
          <Toolbar sx={{ height: 80, justifyContent: 'space-between' }}>
            <Typography 
              variant="h5" 
              component={Link} 
              to="/" 
              sx={{ 
                fontWeight: '900', 
                letterSpacing: '-0.05em', 
                color: '#1b5e20', 
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
              <IconButton onClick={() => setMobileMenuOpen(true)} sx={{ color: '#1b5e20' }}>
                <MenuIcon />
              </IconButton>
            ) : (
              <Stack direction="row" spacing={1} alignItems="center">
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
                    <Typography variant="body2" sx={{ fontWeight: 800, color: '#1b5e20' }}>
                      {totalUSDC.toLocaleString()} USDC
                    </Typography>
                  </Box>
                )}
                <Button color="inherit" component={Link} to="/market" sx={{ color: '#333', fontWeight: 600, px: 2 }}>Market</Button>
                <Button color="inherit" component={Link} to="/orders" sx={{ color: '#333', fontWeight: 600, px: 2 }}>Orders</Button>
                {authenticated && (
                  <Button color="inherit" component={Link} to="/admin" sx={{ color: '#333', fontWeight: 600, px: 2 }}>Admin</Button>
                )}
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
            {authenticated && (
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
                    <AccountBalanceWalletIcon sx={{ color: '#1b5e20' }} />
                    <Typography variant="body2" sx={{ fontWeight: 800 }}>{totalUSDC} USDC</Typography>
                  </Box>
                  <Button fullWidth variant="outlined" color="error" onClick={logout} sx={{ borderRadius: 3, py: 1.5, fontWeight: 'bold' }}>
                    Logout
                  </Button>
                </>
              )}
            </ListItem>
          </List>
        </Drawer>

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
    </BrowserRouter>
  );
}
