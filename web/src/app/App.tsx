import { AppBar, Box, Button, Container, Toolbar, Typography, Paper, Grid, Chip, Stack } from '@mui/material';
import { useEffect } from 'react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { usePrivy } from '@privy-io/react-auth';
import { AdminPage } from '../pages/AdminPage';
import { MarketPage } from '../pages/MarketPage';
import { applyToken } from '../services/auth';

function HomePage() {
  return (
    <Box>
      <Box sx={{ py: 8, textAlign: 'center', background: 'linear-gradient(135deg, #1b5e20 0%, #4caf50 100%)', borderRadius: 4, color: 'white', mb: 6 }}>
        <Typography variant="h2" gutterBottom sx={{ fontWeight: 800 }}>KilimoLink</Typography>
        <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>The Urban-Rural Liquidity Layer for East Africa</Typography>
        <Stack direction="row" spacing={2} justifyContent="center">
          <Button variant="contained" color="secondary" size="large" component={Link} to="/market">Explore Market</Button>
          <Button variant="outlined" color="inherit" size="large" component={Link} to="/admin">Governance Hub</Button>
        </Stack>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%', borderRadius: 3 }}>
            <Typography variant="h6" gutterBottom color="primary">Verified Exchange</Typography>
            <Typography variant="body2" color="text.secondary">
              Direct-to-city marketplace where every transaction is verified against KNBS data to ensure fair pricing for both farmers and consumers.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%', borderRadius: 3 }}>
            <Typography variant="h6" gutterBottom color="primary">On-Chain Identity</Typography>
            <Typography variant="body2" color="text.secondary">
              Urban farmers gain instant digital footprints through Privy email-to-wallet onboarding, unlocking access to global agricultural finance.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%', borderRadius: 3 }}>
            <Typography variant="h6" gutterBottom color="primary">Multisig Governance</Typography>
            <Typography variant="body2" color="text.secondary">
              Institutional-grade treasury management for cooperatives via Altitude, providing 100% auditability of municipal agricultural funds.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export function App() {
  const { login, authenticated, user, logout } = usePrivy();

  useEffect(() => {
    applyToken('admin');
  }, []);

  return (
    <BrowserRouter>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: '900', letterSpacing: 1.5, color: '#ffffff' }}>
              KILIMOLINK
            </Typography>
            <Button color="inherit" component={Link} to="/admin">
              Admin
            </Button>
            <Button color="inherit" component={Link} to="/market">
              Market
            </Button>
            <Box sx={{ ml: 2, display: 'flex', gap: 1 }}>
              {!authenticated ? (
                <Button variant="contained" color="secondary" onClick={login} sx={{ textTransform: 'none' }}>
                  Farmer Login
                </Button>
              ) : (
                <Button variant="outlined" color="inherit" onClick={logout} sx={{ textTransform: 'none' }}>
                  {user?.email?.address || 'Farmer'} (Logout)
                </Button>
              )}
              <WalletMultiButton />
            </Box>
          </Toolbar>
        </AppBar>
        <Container sx={{ py: 4 }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/market" element={<MarketPage />} />
          </Routes>
        </Container>
      </Box>
    </BrowserRouter>
  );
}
