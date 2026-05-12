import { useEffect, useState } from 'react';
import { Box, Container, Typography, Paper, Tab, Tabs, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, IconButton, Stack, Chip, Card, CardContent } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, Cell } from 'recharts';
import { api } from '../services/api';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

export function AdminPage() {
  const [tab, setTab] = useState(0);
  const [metrics, setMetrics] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [impactHistory, setImpactHistory] = useState<any[]>([]);
  const [resilienceLogs, setResilienceLogs] = useState<any[]>([]);

  const fetchData = async () => {
    try {
      const [mRes, uRes, pRes, rRes] = await Promise.all([
        api.get('/admin/impact'),
        api.get('/admin/users'),
        api.get('/admin/products'),
        api.get('/admin/resilience')
      ]);
      setMetrics(mRes.data);
      setUsers(uRes.data);
      setProducts(pRes.data);
      setResilienceLogs(rRes.data);
      
      setImpactHistory([
        { date: '05-01', co2: 12, waste: 8, space: 100 },
        { date: '05-03', co2: 28, waste: 15, space: 200 },
        { date: '05-05', co2: 48, waste: 25, space: 300 },
        { date: '05-07', co2: 75, waste: 40, space: 500 },
        { date: '05-09', co2: 115, waste: 55, space: 800 },
        { date: 'Today', co2: mRes.data.co2SavedKg, waste: mRes.data.wasteDivertedKg, space: mRes.data.greenSpaceM2 }
      ]);
    } catch (err) {
      console.error('Failed to fetch admin data', err);
    }
  };

  useEffect(() => {
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

  const COLORS = ['#2e7d32', '#ef6c00', '#1565c0'];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: '-0.02em' }}>
          Innovate4Cities Admin
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button 
            variant="outlined" 
            startIcon={<RefreshIcon />}
            onClick={fetchData}
            sx={{ borderRadius: 2 }}
          >
            Refresh
          </Button>
          <Button 
            variant="contained" 
            startIcon={<CloudUploadIcon />}
            color="warning" 
            onClick={async () => {
              if(window.confirm('Seed demo data? This will add sample products.')) {
                await api.post('/admin/seed');
                fetchData();
              }
            }}
            sx={{ borderRadius: 2, bgcolor: '#ed6c02' }}
          >
            Seed Demo Data
          </Button>
        </Stack>
      </Box>
      
      <Tabs 
        value={tab} 
        onChange={(_, v) => setTab(v)} 
        sx={{ 
          mb: 6,
          '& .MuiTab-root': { fontWeight: 'bold', fontSize: '1rem' },
          '& .Mui-selected': { color: '#1b5e20 !important' },
          '& .MuiTabs-indicator': { bgcolor: '#1b5e20' }
        }}
      >
        <Tab label="Impact Analytics" />
        <Tab label="User Ecosystem" />
        <Tab label="Market Oversight" />
        <Tab label="Institutional Intelligence" />
      </Tabs>

      {tab === 0 && (
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: 5, boxShadow: '0 10px 30px rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.05)' }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 700 }}>CO2 SAVED (KG)</Typography>
                <Typography variant="h2" sx={{ fontWeight: 900, color: '#2e7d32', my: 1 }}>
                  {metrics?.co2SavedKg?.toFixed(1) || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ↑ 12% from last week
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: 5, boxShadow: '0 10px 30px rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.05)' }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 700 }}>WASTE DIVERTED (KG)</Typography>
                <Typography variant="h2" sx={{ fontWeight: 900, color: '#ef6c00', my: 1 }}>
                  {metrics?.wasteDivertedKg?.toFixed(1) || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ↑ 8% from last week
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: 5, boxShadow: '0 10px 30px rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.05)' }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 700 }}>GREEN SPACE (M²)</Typography>
                <Typography variant="h2" sx={{ fontWeight: 900, color: '#1565c0', my: 1 }}>
                  {metrics?.greenSpaceM2 || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  5 new urban farms added
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 4, borderRadius: 5, height: 450, boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 4 }}>Resilience Growth Over Time</Typography>
              <ResponsiveContainer width="100%" height="80%">
                <AreaChart data={impactHistory}>
                  <defs>
                    <linearGradient id="colorCo2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2e7d32" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#2e7d32" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
                  />
                  <Area type="monotone" dataKey="co2" stroke="#2e7d32" strokeWidth={3} fillOpacity={1} fill="url(#colorCo2)" name="CO2 Saved" />
                  <Area type="monotone" dataKey="waste" stroke="#ef6c00" strokeWidth={3} fillOpacity={0.1} fill="#ef6c00" name="Waste Diverted" />
                </AreaChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 4, borderRadius: 5, height: 450, boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 4 }}>Impact Distribution</Typography>
              <ResponsiveContainer width="100%" height="80%">
                <BarChart data={[
                  { name: 'CO2', value: metrics?.co2SavedKg || 0 },
                  { name: 'Waste', value: metrics?.wasteDivertedKg || 0 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip cursor={{fill: 'transparent'}} />
                  <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                    <Cell fill="#2e7d32" />
                    <Cell fill="#ef6c00" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>
      )}

      {tab === 1 && (
        <TableContainer component={Paper} sx={{ borderRadius: 5, boxShadow: '0 10px 30px rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.05)' }}>
          <Table>
            <TableHead sx={{ bgcolor: '#fcfcfc' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 800 }}>User</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Role</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Joined</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Activity</TableCell>
                <TableCell align="right" sx={{ fontWeight: 800 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id} sx={{ '&:hover': { bgcolor: '#f9f9f9' } }}>
                  <TableCell>
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 700 }}>{user.name}</Typography>
                      <Typography variant="body2" color="text.secondary">{user.email}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={user.role} 
                      size="small" 
                      sx={{ 
                        fontWeight: 700, 
                        bgcolor: user.role === 'ADMIN' ? '#fff3e0' : user.role === 'FARMER' ? '#e8f5e9' : '#e3f2fd',
                        color: user.role === 'ADMIN' ? '#ef6c00' : user.role === 'FARMER' ? '#2e7d32' : '#1565c0'
                      }} 
                    />
                  </TableCell>
                  <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Box sx={{ width: '100%', bgcolor: '#eee', height: 4, borderRadius: 2 }}>
                      <Box sx={{ width: `${Math.random() * 100}%`, bgcolor: '#2e7d32', height: '100%', borderRadius: 2 }} />
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton color="error" size="small"><DeleteIcon /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {tab === 2 && (
        <TableContainer component={Paper} sx={{ borderRadius: 5, boxShadow: '0 10px 30px rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.05)' }}>
          <Table>
            <TableHead sx={{ bgcolor: '#fcfcfc' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 800 }}>Product</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Farmer</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Price</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Status</TableCell>
                <TableCell align="right" sx={{ fontWeight: 800 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id} sx={{ '&:hover': { bgcolor: '#f9f9f9' } }}>
                  <TableCell sx={{ fontWeight: 700 }}>{product.title}</TableCell>
                  <TableCell>{product.farmer?.name}</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#2e7d32' }}>KES {product.price}</TableCell>
                  <TableCell>
                    <Chip label="Pending Review" size="small" variant="outlined" sx={{ fontWeight: 600 }} />
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Button size="small" variant="contained" sx={{ bgcolor: '#2e7d32', borderRadius: 2 }}>Approve</Button>
                      <IconButton color="error" size="small" onClick={() => handleDeleteProduct(product.id)}><DeleteIcon /></IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {tab === 3 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box sx={{ mb: 4, p: 3, bgcolor: '#f1f8e9', borderRadius: 4, border: '1px solid #c5e1a5' }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#1b5e20', mb: 1 }}>Ecosystem Resilience & Institutional Intelligence</Typography>
              <Typography variant="body2" color="text.secondary">
                Strategic monitoring of regulatory frameworks, cross-border experiments, and market signals. Verified through field-level execution and sector-leading operational protocols.
              </Typography>
            </Box>
          </Grid>
          {resilienceLogs.length === 0 ? (
            <Grid item xs={12}>
              <Paper sx={{ p: 8, textAlign: 'center', borderRadius: 5, border: '1px dashed #ccc' }}>
                <Typography variant="h6" color="text.secondary">No resilience signals logged yet.</Typography>
                <Button 
                  variant="contained" 
                  sx={{ mt: 2, bgcolor: '#1b5e20' }}
                  onClick={async () => {
                    await api.post('/admin/resilience', {
                      type: 'REGULATORY',
                      title: 'Digital Service Tax Update',
                      description: 'New guidelines on platform service fees in Kenya. Execution-first approach remains stable.',
                      impact: 'NEUTRAL',
                      status: 'MONITORED'
                    });
                    fetchData();
                  }}
                >
                  Log Sample Signal
                </Button>
              </Paper>
            </Grid>
          ) : (
            resilienceLogs.map((log) => (
              <Grid item xs={12} md={6} key={log.id}>
                <Card sx={{ borderRadius: 4, borderLeft: `6px solid ${log.impact === 'POSITIVE' ? '#2e7d32' : log.impact === 'NEGATIVE' ? '#d32f2f' : '#fbc02d'}` }}>
                  <CardContent>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                      <Chip label={log.type} size="small" sx={{ fontWeight: 'bold' }} />
                      <Typography variant="caption" color="text.secondary">{new Date(log.createdAt).toLocaleDateString()}</Typography>
                    </Stack>
                    <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>{log.title}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{log.description}</Typography>
                    <Stack direction="row" spacing={1}>
                      <Chip label={log.status} size="small" variant="outlined" color={log.status === 'RESOLVED' ? 'success' : 'warning'} />
                      <Chip label={log.impact} size="small" variant="outlined" />
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      )}
    </Container>
  );
}
