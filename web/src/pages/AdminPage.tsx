import { useEffect, useState } from 'react';
import { Box, Container, Typography, Paper, Tab, Tabs, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, IconButton, Stack, Chip, Card, CardContent, Divider } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, Cell, PieChart, Pie } from 'recharts';
import { api } from '../services/api';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SecurityIcon from '@mui/icons-material/Security';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import BugReportIcon from '@mui/icons-material/BugReport';
import { PremiumCard } from '../components/PremiumCard';
import { PremiumStatCard } from '../components/PremiumStatCard';
import { securityService, SecurityLog } from '../services/securityService';
import { solanaService } from '../services/solanaService';

export function AdminPage() {
  const [tab, setTab] = useState(0);
  const [metrics, setMetrics] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [impactHistory, setImpactHistory] = useState<any[]>([]);
  const [resilienceLogs, setResilienceLogs] = useState<any[]>([]);
  const [securityLogs, setSecurityLogs] = useState<SecurityLog[]>(securityService.getLogs());
  const [systemHealth, setSystemHealth] = useState(securityService.getHealthScore());
  const [simulationMode, setSimulationMode] = useState<'NORMAL' | 'PEAK_HARVEST' | 'DROUGHT_ALERT'>('NORMAL');
  const [priorityFee, setPriorityFee] = useState<number>(0);

  const fetchData = async () => {
    try {
      const [mRes, uRes, pRes, rRes, fee] = await Promise.all([
        api.get('/admin/impact'),
        api.get('/admin/users'),
        api.get('/admin/products'),
        api.get('/admin/resilience'),
        solanaService.getPriorityFee()
      ]);
      setMetrics(mRes.data);
      setUsers(uRes.data);
      setProducts(pRes.data);
      setResilienceLogs(rRes.data);
      setSecurityLogs(securityService.getLogs());
      setSystemHealth(securityService.getHealthScore());
      setPriorityFee(fee);
      
      const multiplier = simulationMode === 'DROUGHT_ALERT' ? 0.6 : simulationMode === 'PEAK_HARVEST' ? 1.5 : 1;
      
      setImpactHistory([
        { date: '05-01', co2: 12, waste: 8, supply: 45 * multiplier, demand: 60 },
        { date: '05-03', co2: 28, waste: 15, supply: 55 * multiplier, demand: 75 },
        { date: '05-05', co2: 48, waste: 25, supply: 70 * multiplier, demand: 85 },
        { date: '05-07', co2: 75, waste: 40, supply: 85 * multiplier, demand: 110 },
        { date: '05-09', co2: 115, waste: 55, supply: 105 * multiplier, demand: 130 },
        { date: 'Today', co2: mRes.data.co2SavedKg, waste: mRes.data.wasteDivertedKg, supply: 120 * multiplier, demand: 150 }
      ]);
    } catch (err) {
      console.error('Failed to fetch admin data', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [simulationMode]);

  useEffect(() => {
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('Delete this product?')) {
      await api.delete(`/admin/products/${id}`);
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const COLORS = ['#1b5e20', '#ef6c00', '#1565c0', '#4a148c'];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 6 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: '-0.04em', color: '#1b5e20' }}>
            KilimoLink Oversight
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Strategic Administrative Control Panel | Build v1.0.6
          </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <Button 
            variant="outlined" 
            startIcon={<RefreshIcon />}
            onClick={fetchData}
            sx={{ borderRadius: 3, px: 3, fontWeight: 700 }}
          >
            Sync Data
          </Button>
          <Button 
            variant="contained" 
            startIcon={<CloudUploadIcon />}
            onClick={async () => {
              if(window.confirm('Seed demo data?')) {
                await api.post('/admin/seed');
                fetchData();
              }
            }}
            sx={{ borderRadius: 3, px: 3, bgcolor: '#1b5e20', fontWeight: 700, boxShadow: 'none' }}
          >
            Seed Oracle
          </Button>
        </Stack>
      </Box>

      <Box sx={{ mb: 4, p: 2, bgcolor: '#f5f5f5', borderRadius: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#666' }}>SCENARIO SIMULATION:</Typography>
        <Stack direction="row" spacing={1}>
          {[
            { id: 'NORMAL', label: 'Stable Market', color: '#1b5e20' },
            { id: 'PEAK_HARVEST', label: 'Peak Harvest', color: '#1565c0' },
            { id: 'DROUGHT_ALERT', label: 'Drought Stress', color: '#d32f2f' },
          ].map((mode) => (
            <Chip 
              key={mode.id}
              label={mode.label}
              onClick={() => setSimulationMode(mode.id as any)}
              sx={{ 
                fontWeight: 800, 
                bgcolor: simulationMode === mode.id ? mode.color : 'transparent',
                color: simulationMode === mode.id ? 'white' : mode.color,
                border: `1px solid ${mode.color}`,
                '&:hover': { bgcolor: mode.color, color: 'white' }
              }}
            />
          ))}
        </Stack>
      </Box>
      
      <Tabs 
        value={tab} 
        onChange={(_, v) => setTab(v)} 
        sx={{ 
          mb: 6,
          '& .MuiTab-root': { fontWeight: 800, fontSize: '0.9rem', textTransform: 'none' },
          '& .Mui-selected': { color: '#1b5e20 !important' },
          '& .MuiTabs-indicator': { bgcolor: '#1b5e20', height: 3 }
        }}
      >
        <Tab label="Market Liquidity" />
        <Tab label="Algorithmic Growth" />
        <Tab label="Security & Integrity" />
        <Tab label="Institutional Intelligence" />
      </Tabs>

      {tab === 0 && (
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <PremiumCard title="Market Resilience Growth" subtitle="Supply vs Demand Liquidity (KG Equivalent)">
              <ResponsiveContainer width="100%" height="300}>
                <AreaChart data={impactHistory}>
                  <defs>
                    <linearGradient id="colorSupply" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1b5e20" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#1b5e20" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                  />
                  <Area type="monotone" dataKey="supply" stroke="#1b5e20" strokeWidth={4} fillOpacity={1} fill="url(#colorSupply)" name="Supply" />
                  <Area type="monotone" dataKey="demand" stroke="#ef6c00" strokeWidth={4} fillOpacity={0.05} fill="#ef6c00" name="Demand" />
                </AreaChart>
              </ResponsiveContainer>
            </PremiumCard>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <PremiumCard title="Price Volatility" subtitle="Index by Category">
              <ResponsiveContainer width="100%" height="300}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Stable', value: 70 },
                      { name: 'Volatile', value: 20 },
                      { name: 'Critical', value: 10 },
                    ]}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {COLORS.map((color, index) => (
                      <Cell key={`cell-${index}`} fill={color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <Box sx={{ mt: 2 }}>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                  <Typography variant="caption" sx={{ fontWeight: 700 }}>Stable (KNBS Aligned)</Typography>
                  <Typography variant="caption" color="success.main">70%</Typography>
                </Stack>
                <Box sx={{ width: '100%', height: 4, bgcolor: '#eee', borderRadius: 2 }}>
                  <Box sx={{ width: '70%', height: '100%', bgcolor: '#1b5e20', borderRadius: 2 }} />
                </Box>
              </Box>
            </PremiumCard>
          </Grid>

          <Grid item xs={12}>
            <TableContainer component={Paper} sx={{ borderRadius: 5, boxShadow: 'none', border: '1px solid #eee' }}>
              <Table>
                <TableHead sx={{ bgcolor: '#fafafa' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 800 }}>Product Flow</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Liquidity Score</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Price Stability</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 800 }}>Oversight</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell sx={{ fontWeight: 700 }}>{p.title}</TableCell>
                      <TableCell>
                        <Chip label="Optimal" size="small" sx={{ bgcolor: '#e8f5e9', color: '#1b5e20', fontWeight: 800 }} />
                      </TableCell>
                      <TableCell>KES {p.price} (±0.0%)</TableCell>
                      <TableCell align="right">
                        <Button size="small" variant="text" sx={{ color: '#1b5e20', fontWeight: 800 }}>View Trace</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      )}

      {tab === 1 && (
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Box sx={{ mb: 4, p: 3, bgcolor: '#f3e5f5', borderRadius: 4, border: '1px solid #ce93d8' }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#4a148c', mb: 1 }}>Algorithmic Growth Funnel (Triple-A, Triple-R)</Typography>
              <Typography variant="body2" color="text.secondary">
                Tracking 'Correct Signal' over noise. Optimized for iOS LTV acceleration and mobile-first attribution.
              </Typography>
            </Box>
          </Grid>

          {[
            { label: 'Awareness', value: '14.2k', sub: 'Reach', trend: '12%', color: '#9c27b0' },
            { label: 'Liquidity Depth', value: '82%', sub: 'Supply Coverage', trend: '8%', color: '#673ab7' },
            { label: 'Operational Velocity', value: '2.4h', sub: 'Avg. Fulfillment', trend: '15%', color: '#3f51b5' },
            { label: 'Farmer Retention', value: '45%', sub: 'Active Cohort', trend: '2%', color: '#2196f3' },
            { label: 'Referral K-Factor', value: '1.4', sub: 'Organic Growth', trend: '0.2', color: '#03a9f4' },
            { label: 'Market GMV', value: '520k', sub: 'KES Volume', trend: '15%', color: '#00bcd4' },
          ].map((metric, idx) => (
            <Grid item xs={6} md={2} key={idx}>
              <PremiumStatCard 
                label={metric.label} 
                value={metric.value} 
                subtitle={metric.sub} 
                color={metric.color}
                trend={{ value: metric.trend, isPositive: true }}
              />
            </Grid>
          ))}

          <Grid item xs={12} md={8}>
            <PremiumCard title="Incremental Growth Testing" subtitle="Control vs Test Groups (Last 7 Days)">
              <ResponsiveContainer width="100%" height="300}>
                <BarChart data={[
                  { day: 'Mon', control: 120, test: 145 },
                  { day: 'Tue', control: 150, test: 180 },
                  { day: 'Wed', control: 200, test: 260 },
                  { day: 'Thu', control: 180, test: 220 },
                  { day: 'Fri', control: 250, test: 310 },
                  { day: 'Sat', control: 300, test: 420 },
                  { day: 'Sun', control: 280, test: 390 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip cursor={{fill: 'transparent'}} />
                  <Bar dataKey="control" fill="#ce93d8" radius={[4, 4, 0, 0]} name="Control" />
                  <Bar dataKey="test" fill="#4a148c" radius={[4, 4, 0, 0]} name="Experiment (AI Logic)" />
                </BarChart>
              </ResponsiveContainer>
            </PremiumCard>
          </Grid>

          <Grid item xs={12} md={4}>
            <PremiumCard title="Attribution Signal" subtitle="Live Ad Platform Bridge">
              <Stack spacing={2} sx={{ mt: 1 }}>
                {['Meta Ads', 'Google Ads', 'TikTok Ads'].map((platform, i) => (
                  <Box key={i} sx={{ p: 2, bgcolor: '#fcfcfc', borderRadius: 3, border: '1px solid #eee' }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="body2" sx={{ fontWeight: 800 }}>{platform}</Typography>
                      <Chip label="Correct Tracking" size="small" sx={{ bgcolor: '#e8f5e9', color: '#1b5e20', fontSize: '0.6rem', fontWeight: 900 }} />
                    </Stack>
                    <Box sx={{ mt: 1.5, height: 4, bgcolor: '#eee', borderRadius: 2 }}>
                      <Box sx={{ width: `${85 + (i * 5)}%`, height: '100%', bgcolor: '#4a148c', borderRadius: 2 }} />
                    </Box>
                  </Box>
                ))}
              </Stack>
            </PremiumCard>
          </Grid>
        </Grid>
      )}

      {tab === 2 && (
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <PremiumStatCard 
              label="Solana Network" 
              value={`${(priorityFee / 1000).toFixed(1)}k`} 
              subtitle="Micro-Lamports Priority" 
              color="#9945FF"
              trend={{ value: 'Optimal', isPositive: true }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <PremiumStatCard 
              label="Onchain Liquidity" 
              value="SECURE" 
              subtitle="Institutional RPC Active" 
              color="#14F195"
              trend={{ value: '100%', isPositive: true }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <PremiumStatCard 
              label="System Health" 
              value={`${systemHealth}%`} 
              subtitle="Institutional Integrity" 
              color="#1b5e20"
              trend={{ value: 'Stable', isPositive: true }}
            />
          </Grid>

          <Grid item xs={12} md={8}>
            <PremiumCard title="Integrity Audit Log" subtitle="Real-time Sector-Leading Protocols">
              <Stack spacing={1.5} sx={{ maxHeight: 400, overflowY: 'auto', pr: 1 }}>
                {securityLogs.map((log) => (
                  <Box key={log.id} sx={{ p: 2, bgcolor: '#fcfcfc', borderRadius: 3, border: '1px solid #eee' }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 800 }}>{log.action}</Typography>
                        <Typography variant="caption" color="text.secondary">{log.time} • {log.details}</Typography>
                      </Box>
                      <Chip 
                        label={log.status} 
                        size="small" 
                        sx={{ 
                          fontWeight: 800, 
                          bgcolor: log.status === 'SUCCESS' ? '#e8f5e9' : log.status === 'MITIGATED' ? '#e3f2fd' : '#fff3e0', 
                          color: log.status === 'SUCCESS' ? '#1b5e20' : log.status === 'MITIGATED' ? '#1565c0' : '#e65100' 
                        }} 
                      />
                    </Stack>
                  </Box>
                ))}
              </Stack>
            </PremiumCard>
          </Grid>
          <Grid item xs={12}>
            <PremiumCard title="User Ecosystem" subtitle="Authorized Access Control">
              <TableContainer sx={{ mt: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 800 }}>Identity</TableCell>
                      <TableCell sx={{ fontWeight: 800 }}>Role</TableCell>
                      <TableCell sx={{ fontWeight: 800 }}>Verification</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 800 }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map((u) => (
                      <TableRow key={u.id}>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 700 }}>{u.name}</Typography>
                          <Typography variant="caption" color="text.secondary">{u.email}</Typography>
                        </TableCell>
                        <TableCell>
                          <Chip label={u.role} size="small" variant="outlined" sx={{ fontWeight: 800 }} />
                        </TableCell>
                        <TableCell>
                          <Chip label="Verified" size="small" sx={{ bgcolor: '#e8f5e9', color: '#1b5e20', fontWeight: 800 }} />
                        </TableCell>
                        <TableCell align="right">
                          <IconButton size="small" color="error"><DeleteIcon /></IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </PremiumCard>
          </Grid>
        </Grid>
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
