import { AppBar, Box, Button, Container, Toolbar, Typography } from '@mui/material';
import { useEffect } from 'react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { usePrivy } from '@privy-io/react-auth';
import { AdminPage } from '../pages/AdminPage';
import { MarketPage } from '../pages/MarketPage';
import { applyToken } from '../services/auth';

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
            <Route path="/" element={<AdminPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/market" element={<MarketPage />} />
          </Routes>
        </Container>
      </Box>
    </BrowserRouter>
  );
}
