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
        <Tab label="Growth Engine (AARRR)" />
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
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Box sx={{ mb: 4, p: 3, bgcolor: '#f3e5f5', borderRadius: 4, border: '1px solid #ce93d8' }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#4a148c', mb: 1 }}>Algorithmic Growth Funnel (Triple-A, Triple-R)</Typography>
              <Typography variant="body2" color="text.secondary">
                Moving beyond 19th-century AIDA models to a modern signal-first growth engine. Tracking activation and retention as the primary levers for sustainable scale.
              </Typography>
            </Box>
          </Grid>

          {[
            { label: 'Awareness', value: '12.4k', sub: 'Reach', color: '#9c27b0' },
            { label: 'Acquisition', value: '2.1k', sub: 'Installs', color: '#673ab7' },
            { label: 'Activation', value: '68%', sub: 'First List/Buy', color: '#3f51b5' },
            { label: 'Retention', value: '42%', sub: 'Week 4', color: '#2196f3' },
            { label: 'Referral', value: '12%', sub: 'K-Factor', color: '#03a9f4' },
            { label: 'Revenue', value: 'KES 450k', sub: 'GMV', color: '#00bcd4' },
          ].map((metric, idx) => (
            <Grid item xs={6} md={2} key={idx}>
              <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 4, borderTop: `4px solid ${metric.color}` }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block' }}>{metric.label.toUpperCase()}</Typography>
                <Typography variant="h5" sx={{ fontWeight: 900, my: 1 }}>{metric.value}</Typography>
                <Typography variant="caption" color="text.secondary">{metric.sub}</Typography>
              </Paper>
            </Grid>
          ))}

          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 4, borderRadius: 5, height: 400, boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 4 }}>Growth Loop: Activation vs. Acquisition</Typography>
              <ResponsiveContainer width="100%" height="80%">
                <BarChart data={[
                  { day: 'Mon', acq: 120, act: 80 },
                  { day: 'Tue', acq: 150, act: 110 },
                  { day: 'Wed', acq: 200, act: 140 },
                  { day: 'Thu', acq: 180, act: 130 },
                  { day: 'Fri', acq: 250, act: 190 },
                  { day: 'Sat', acq: 300, act: 240 },
                  { day: 'Sun', acq: 280, act: 210 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip cursor={{fill: 'transparent'}} />
                  <Bar dataKey="acq" fill="#ce93d8" radius={[4, 4, 0, 0]} name="Acquisition" />
                  <Bar dataKey="act" fill="#4a148c" radius={[4, 4, 0, 0]} name="Activation" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, borderRadius: 5, bgcolor: '#fafafa' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 2 }}>ATTRIBUTION BRIDGE</Typography>
              <Stack spacing={2}>
                <Box sx={{ p: 2, bgcolor: 'white', borderRadius: 3, border: '1px solid #eee' }}>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>Meta Ads Integration</Typography>
                  <Typography variant="caption" color="text.secondary">Correct tracking active. Signal strength: High.</Typography>
                </Box>
                <Box sx={{ p: 2, bgcolor: 'white', borderRadius: 3, border: '1px solid #eee' }}>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>Google App Campaigns</Typography>
                  <Typography variant="caption" color="text.secondary">Attributing LTV to iOS users (High Potential).</Typography>
                </Box>
                <Box sx={{ p: 2, bgcolor: 'white', borderRadius: 3, border: '1px solid #eee' }}>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>TikTok Referral Loop</Typography>
                  <Typography variant="caption" color="text.secondary">Organic K-Factor tracking enabled.</Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
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
                Strategic monitoring of regulatory frameworks, cross-border experiments, and market signals. All intelligence is derived from verified sector pioneers and global operational protocols.
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, borderRadius: 5, bgcolor: '#fafafa', border: '1px solid #eee' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 2, color: '#666' }}>STRATEGIC FRAMEWORKS</Typography>
              <Stack spacing={2}>
                <Box sx={{ p: 2, bgcolor: 'white', borderRadius: 3, border: '1px solid #eee' }}>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>AARRR Funnel</Typography>
                  <Typography variant="caption" color="text.secondary">Moving beyond AIDA to track Activation and Retention.</Typography>
                </Box>
                <Box sx={{ p: 2, bgcolor: 'white', borderRadius: 3, border: '1px solid #eee' }}>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>Mental & Physical Availability</Typography>
                  <Typography variant="caption" color="text.secondary">Ensuring KilimoLink is the first choice for urban food.</Typography>
                </Box>
                <Box sx={{ p: 2, bgcolor: 'white', borderRadius: 3, border: '1px solid #eee' }}>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>The 60:40 Rule</Typography>
                  <Typography variant="caption" color="text.secondary">Balancing brand building with sales activation.</Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, borderRadius: 5, bgcolor: '#fafafa', border: '1px solid #eee' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 2, color: '#666' }}>INTELLIGENCE SOURCES</Typography>
              <Stack spacing={2}>
                <Box sx={{ p: 2, bgcolor: 'white', borderRadius: 3, border: '1px solid #eee' }}>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>Glovo Co-Founder Transcripts</Typography>
                  <Typography variant="caption" color="text.secondary">Primary source for African operational execution.</Typography>
                </Box>
                <Box sx={{ p: 2, bgcolor: 'white', borderRadius: 3, border: '1px solid #eee' }}>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>Growth & Marketing Science</Typography>
                  <Typography variant="caption" color="text.secondary">Hacking Growth (Sean Ellis) & Future Demand (James Hurman).</Typography>
                </Box>
                <Box sx={{ p: 2, bgcolor: 'white', borderRadius: 3, border: '1px solid #eee' }}>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>Solana Ecosystem Theses</Typography>
                  <Typography variant="caption" color="text.secondary">Infrastructure for decentralized Proof-of-Trade.</Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12} md={8}>
            <Grid container spacing={3}>
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
          </Grid>
        </Grid>
      )}
    </Container>
  );
}
