import { AppBar, Box, Button, Container, Toolbar, Typography, Stack } from '@mui/material';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { usePrivy } from '@privy-io/react-auth';
import { AdminPage } from '../pages/AdminPage';
import { Marketplace } from '../pages/Marketplace';
import { SellProduct } from '../pages/SellProduct';
import { ProductDetail } from '../pages/ProductDetail';
import { OrdersPage } from '../pages/OrdersPage';

function HomePage() {
  return (
    <Box>
      <Box sx={{ py: 8, textAlign: 'center', background: 'linear-gradient(135deg, #1b5e20 0%, #4caf50 100%)', borderRadius: 4, color: 'white', mb: 6 }}>
        <Typography variant="h2" gutterBottom sx={{ fontWeight: 800 }}>KilimoLink</Typography>
        <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>Hyperlocal Food Resilience for Future Cities</Typography>
        <Stack direction="row" spacing={2} justifyContent="center">
          <Button variant="contained" color="secondary" size="large" component={Link} to="/market">Explore Marketplace</Button>
          <Button variant="outlined" color="inherit" size="large" component={Link} to="/sell">Sell Your Produce</Button>
        </Stack>
      </Box>

      <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>Innovate4Cities 2026 Focus</Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1 -1', md: 'repeat(3, 1fr)' }, gap: 3 }}>
        <Box sx={{ p: 3, bgcolor: '#f1f8e9', borderRadius: 3 }}>
          <Typography variant="h6" color="primary" gutterBottom>Food Waste Reduction</Typography>
          <Typography variant="body2">Direct farm-to-city trade eliminates middle-man delays, significantly reducing post-harvest losses in informal settlements.</Typography>
        </Box>
        <Box sx={{ p: 3, bgcolor: '#e3f2fd', borderRadius: 3 }}>
          <Typography variant="h6" color="primary" gutterBottom>Transport Decarbonization</Typography>
          <Typography variant="body2">Our geolocation engine prioritizes products within a 5km radius, minimizing the carbon footprint of urban food logistics.</Typography>
        </Box>
        <Box sx={{ p: 3, bgcolor: '#fff3e0', borderRadius: 3 }}>
          <Typography variant="h6" color="primary" gutterBottom>Urban Greening</Typography>
          <Typography variant="body2">Every farmer registered on KilimoLink represents 100m² of preserved or active green space mapped within city limits.</Typography>
        </Box>
      </Box>
    </Box>
  );
}

export function App() {
  const { login, authenticated, user, logout } = usePrivy();

  return (
    <BrowserRouter>
      <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: '#fafafa' }}>
        <AppBar position="sticky" elevation={0} sx={{ bgcolor: '#ffffff', borderBottom: '1px solid #eee' }}>
          <Toolbar>
            <Typography 
              variant="h6" 
              component={Link} 
              to="/" 
              sx={{ flexGrow: 1, fontWeight: '900', letterSpacing: 1.5, color: '#2e7d32', textDecoration: 'none' }}
            >
              KILIMOLINK
            </Typography>
            <Stack direction="row" spacing={1}>
              <Button color="inherit" component={Link} to="/market" sx={{ color: '#333' }}>Market</Button>
              <Button color="inherit" component={Link} to="/orders" sx={{ color: '#333' }}>Orders</Button>
              <Button color="inherit" component={Link} to="/admin" sx={{ color: '#333' }}>Admin</Button>
              <Box sx={{ ml: 2 }}>
                {!authenticated ? (
                  <Button variant="contained" color="success" onClick={login} sx={{ textTransform: 'none', borderRadius: 2 }}>
                    Login
                  </Button>
                ) : (
                  <Button variant="outlined" color="success" onClick={logout} sx={{ textTransform: 'none', borderRadius: 2 }}>
                    {user?.email?.address || 'Farmer'} (Logout)
                  </Button>
                )}
              </Box>
            </Stack>
          </Toolbar>
        </AppBar>
        <Container sx={{ py: 4 }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/market" element={<Marketplace />} />
            <Route path="/sell" element={<SellProduct />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </Container>
      </Box>
    </BrowserRouter>
  );
}
