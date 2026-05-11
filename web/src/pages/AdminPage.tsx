import { useEffect, useState } from 'react';
import { Box, Container, Typography, Paper, Tab, Tabs, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, IconButton, Stack, Chip } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { api } from '../services/api';
import DeleteIcon from '@mui/icons-material/Delete';

export function AdminPage() {
  const [tab, setTab] = useState(0);
  const [metrics, setMetrics] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [impactHistory, setImpactHistory] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [mRes, uRes, pRes] = await Promise.all([
          api.get('/admin/impact'),
          api.get('/admin/users'),
          api.get('/admin/products')
        ]);
        setMetrics(mRes.data);
        setUsers(uRes.data);
        setProducts(pRes.data);
        
        // Mocking history for charts
        setImpactHistory([
          { date: '05-01', co2: 10, waste: 5, space: 100 },
          { date: '05-03', co2: 25, waste: 12, space: 200 },
          { date: '05-05', co2: 45, waste: 20, space: 300 },
          { date: '05-07', co2: 70, waste: 35, space: 500 },
          { date: '05-09', co2: 110, waste: 50, space: 800 },
          { date: 'Today', ...mRes.data }
        ]);
      } catch (err) {
        console.error('Failed to fetch admin data', err);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('Delete this product?')) {
      await api.delete(`/admin/products/${id}`);
      setProducts(products.filter(p => p.id !== id));
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 4 }}>Innovate4Cities 2026 Admin</Typography>
      
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 4 }}>
        <Tab label="Impact Dashboard" />
        <Tab label="User Management" />
        <Tab label="Product Approval" />
      </Tabs>

      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button 
          variant="outlined" 
          color="warning" 
          size="small" 
          onClick={async () => {
            if(window.confirm('Seed demo data? This will add sample products.')) {
              await api.post('/admin/seed');
              window.location.reload();
            }
          }}
        >
          Seed Demo Data
        </Button>
      </Box>

      {tab === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, borderRadius: 3, bgcolor: '#e8f5e9', borderLeft: '6px solid #2e7d32' }}>
              <Typography variant="subtitle2" color="text.secondary">CO2 SAVED (KG)</Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#1b5e20' }}>{metrics?.co2SavedKg?.toFixed(1) || 0}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, borderRadius: 3, bgcolor: '#fff3e0', borderLeft: '6px solid #ef6c00' }}>
              <Typography variant="subtitle2" color="text.secondary">WASTE DIVERTED (KG)</Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#e65100' }}>{metrics?.wasteDivertedKg?.toFixed(1) || 0}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, borderRadius: 3, bgcolor: '#e3f2fd', borderLeft: '6px solid #1565c0' }}>
              <Typography variant="subtitle2" color="text.secondary">GREEN SPACE (M²)</Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#0d47a1' }}>{metrics?.greenSpaceM2 || 0}</Typography>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper sx={{ p: 3, borderRadius: 3, height: 400 }}>
              <Typography variant="h6" gutterBottom>City Resilience Progress</Typography>
              <ResponsiveContainer width="100%" height="90%">
                <AreaChart data={impactHistory}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="co2SavedKg" stackId="1" stroke="#2e7d32" fill="#4caf50" name="CO2 Saved" />
                  <Area type="monotone" dataKey="wasteDivertedKg" stackId="2" stroke="#ef6c00" fill="#ff9800" name="Waste Diverted" />
                </AreaChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>
      )}

      {tab === 1 && (
        <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Joined</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell sx={{ fontWeight: 'bold' }}>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell><Chip label={user.role} size="small" /></TableCell>
                  <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <IconButton color="error" size="small"><DeleteIcon /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {tab === 2 && (
        <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell>Farmer</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell sx={{ fontWeight: 'bold' }}>{product.title}</TableCell>
                  <TableCell>{product.farmer?.name}</TableCell>
                  <TableCell>KES {product.price}</TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Button size="small" variant="outlined" color="success">Approve</Button>
                      <IconButton color="error" size="small" onClick={() => handleDeleteProduct(product.id)}><DeleteIcon /></IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
}
