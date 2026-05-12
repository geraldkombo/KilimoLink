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
import { BackgroundArt } from '../components/BackgroundArt';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

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

  const COLORS = ['#064e3b', '#ef6c00', '#1565c0', '#4a148c'];

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh' }}>
      <BackgroundArt seed={1234} />
      
      <Container maxWidth="lg" sx={{ py: 6, position: 'relative', zIndex: 1 }}>
        <MotionBox 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 6 }}
        >
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 900, letterSpacing: '-0.05em', color: '#064e3b' }}>
              Platform Oversight
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500 }}>
              Managing Kenya's food resilience with direct technology.
            </Typography>
          </Box>
          <Stack direction="row" spacing={2}>
            <Button 
              variant="outlined" 
              startIcon={<RefreshIcon />}
              onClick={fetchData}
              sx={{ borderRadius: 4, px: 3, fontWeight: 700, borderColor: '#064e3b', color: '#064e3b', '&:hover': { bgcolor: 'rgba(6,78,59,0.05)', borderColor: '#064e3b' } }}
            >
              Refresh
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
              sx={{ borderRadius: 4, px: 3, bgcolor: '#064e3b', fontWeight: 800, boxShadow: 'none', '&:hover': { bgcolor: '#065f46', boxShadow: 'none' } }}
            >
              Seed Data
            </Button>
          </Stack>
        </MotionBox>

        <Box sx={{ mb: 6, p: 3, bgcolor: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)', borderRadius: 6, border: '1px solid rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: 3 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#374151' }}>MARKET SCENARIO:</Typography>
          <Stack direction="row" spacing={2}>
            {[
              { id: 'NORMAL', label: 'Stable Market', color: '#064e3b' },
              { id: 'PEAK_HARVEST', label: 'Peak Harvest', color: '#1565c0' },
              { id: 'DROUGHT_ALERT', label: 'Drought Stress', color: '#d32f2f' },
            ].map((mode) => (
              <Chip 
                key={mode.id}
                label={mode.label}
                onClick={() => setSimulationMode(mode.id as any)}
                sx={{ 
                  fontWeight: 800, 
                  px: 1,
                  bgcolor: simulationMode === mode.id ? mode.color : 'transparent',
                  color: simulationMode === mode.id ? 'white' : mode.color,
                  border: `2px solid ${mode.color}`,
                  '&:hover': { bgcolor: mode.color, color: 'white' },
                  transition: 'all 0.2s'
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
            '& .MuiTab-root': { fontWeight: 800, fontSize: '1rem', textTransform: 'none', px: 4 },
            '& .Mui-selected': { color: '#064e3b !important' },
            '& .MuiTabs-indicator': { bgcolor: '#064e3b', height: 4, borderRadius: '4px 4px 0 0' }
          }}
        >
          <Tab label="Market Trends" />
          <Tab label="Growth Analytics" />
          <Tab label="System Security" />
          <Tab label="Future Planning" />
        </Tabs>

        {tab === 0 && (
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <PremiumCard title="Market Resilience Growth" subtitle="Supply vs Demand Liquidity (KG Equivalent)">
                <ResponsiveContainer width="100%" height="300">
                  <AreaChart data={impactHistory}>
                    <defs>
                      <linearGradient id="colorSupply" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#064e3b" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#064e3b" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                    />
                    <Area type="monotone" dataKey="supply" stroke="#064e3b" strokeWidth={4} fillOpacity={1} fill="url(#colorSupply)" name="Supply" />
                    <Area type="monotone" dataKey="demand" stroke="#ef6c00" strokeWidth={4} fillOpacity={0.05} fill="#ef6c00" name="Demand" />
                  </AreaChart>
                </ResponsiveContainer>
              </PremiumCard>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <PremiumCard title="Price Volatility" subtitle="Index by Category">
                <ResponsiveContainer width="100%" height="300">
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
                    <Typography variant="caption" sx={{ fontWeight: 700 }}>Stable (Fair Prices)</Typography>
                    <Typography variant="caption" color="success.main" sx={{ fontWeight: 800 }}>70%</Typography>
                  </Stack>
                  <Box sx={{ width: '100%', height: 6, bgcolor: '#eee', borderRadius: 3 }}>
                    <Box sx={{ width: '70%', height: '100%', bgcolor: '#064e3b', borderRadius: 3 }} />
                  </Box>
                </Box>
              </PremiumCard>
            </Grid>

            <Grid item xs={12}>
              <TableContainer component={Paper} sx={{ borderRadius: 6, boxShadow: '0 10px 30px rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.05)' }}>
                <Table>
                  <TableHead sx={{ bgcolor: '#f9fafb' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 800, py: 2.5 }}>Product</TableCell>
                      <TableCell sx={{ fontWeight: 800 }}>Market Status</TableCell>
                      <TableCell sx={{ fontWeight: 800 }}>Current Price</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 800 }}>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {products.map((p) => (
                      <TableRow key={p.id} sx={{ '&:hover': { bgcolor: '#fcfcfc' } }}>
                        <TableCell sx={{ fontWeight: 700, py: 2.5 }}>{p.title}</TableCell>
                        <TableCell>
                          <Chip label="Optimal" size="small" sx={{ bgcolor: '#ecfdf5', color: '#065f46', fontWeight: 800, borderRadius: 2 }} />
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>KES {p.price}</TableCell>
                        <TableCell align="right">
                          <Button size="small" variant="text" sx={{ color: '#064e3b', fontWeight: 800, textTransform: 'none' }}>Details</Button>
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
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#4a148c', mb: 1 }}>Algorithmic Growth Funnel</Typography>
                <Typography variant="body2" color="text.secondary">
                  Tracking 'Correct Signal' over noise. Optimized for mobile-first attribution.
                </Typography>
              </Box>
            </Grid>

            {[
              { label: 'Awareness', value: '14.2k', sub: 'Reach', trend: '12%', color: '#9c27b0' },
              { label: 'Liquidity Depth', value: '82%', sub: 'Supply Coverage', trend: '8%', color: '#673ab7' },
              { label: 'Velocity', value: '2.4h', sub: 'Avg. Fulfillment', trend: '15%', color: '#3f51b5' },
              { label: 'Retention', value: '45%', sub: 'Active Cohort', trend: '2%', color: '#2196f3' },
              { label: 'K-Factor', value: '1.4', sub: 'Organic Growth', trend: '0.2', color: '#03a9f4' },
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
              <PremiumCard title="Growth Experiments" subtitle="Control vs Test Groups">
                <ResponsiveContainer width="100%" height="300">
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
                        <Chip label="Live" size="small" sx={{ bgcolor: '#e8f5e9', color: '#1b5e20', fontSize: '0.6rem', fontWeight: 900 }} />
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
                subtitle="Priority Fee" 
                color="#9945FF"
                trend={{ value: 'Optimal', isPositive: true }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <PremiumStatCard 
                label="Liquidity" 
                value="SECURE" 
                subtitle="On-chain Active" 
                color="#14F195"
                trend={{ value: '100%', isPositive: true }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <PremiumStatCard 
                label="System Health" 
                value={`${systemHealth}%`} 
                subtitle="Integrity Score" 
                color="#064e3b"
                trend={{ value: 'Stable', isPositive: true }}
              />
            </Grid>

            <Grid item xs={12} md={8}>
              <PremiumCard title="Security Logs" subtitle="Real-time monitoring">
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
                            bgcolor: log.status === 'SUCCESS' ? '#ecfdf5' : '#eff6ff', 
                            color: log.status === 'SUCCESS' ? '#065f46' : '#1e40af' 
                          }} 
                        />
                      </Stack>
                    </Box>
                  ))}
                </Stack>
              </PremiumCard>
            </Grid>
            <Grid item xs={12}>
              <PremiumCard title="User Management" subtitle="Access control">
                <TableContainer sx={{ mt: 2 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 800 }}>User</TableCell>
                        <TableCell sx={{ fontWeight: 800 }}>Role</TableCell>
                        <TableCell sx={{ fontWeight: 800 }}>Status</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 800 }}>Action</TableCell>
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
                            <Chip label="Verified" size="small" sx={{ bgcolor: '#ecfdf5', color: '#065f46', fontWeight: 800 }} />
                          </TableCell>
                          <TableCell align="right">
                            <IconButton size="small" color="error" onClick={() => {}}><DeleteIcon /></IconButton>
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
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Box sx={{ mb: 4, p: 3, bgcolor: '#f0fdf4', borderRadius: 4, border: '1px solid #dcfce7' }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#064e3b', mb: 1 }}>Strategic Resilience</Typography>
                <Typography variant="body2" color="text.secondary">
                  Monitoring market signals and institutional intelligence.
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 4, borderRadius: 6, bgcolor: '#f9fafb', border: '1px solid #e5e7eb' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 3, color: '#374151' }}>STRATEGIC FRAMEWORKS</Typography>
                <Stack spacing={2}>
                  {[
                    { title: 'AARRR Funnel', desc: 'Tracking Activation and Retention.' },
                    { title: 'Market Availability', desc: 'Ensuring KilimoLink is the first choice.' },
                    { title: '60:40 Rule', desc: 'Balancing brand and sales activation.' },
                  ].map((f, i) => (
                    <Box key={i} sx={{ p: 2, bgcolor: 'white', borderRadius: 3, border: '1px solid #f3f4f6' }}>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>{f.title}</Typography>
                      <Typography variant="caption" color="text.secondary">{f.desc}</Typography>
                    </Box>
                  ))}
                </Stack>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Grid container spacing={3}>
                {resilienceLogs.length === 0 ? (
                  <Grid item xs={12}>
                    <Paper sx={{ p: 8, textAlign: 'center', borderRadius: 6, border: '2px dashed #e5e7eb' }}>
                      <Typography color="text.secondary">No resilience signals logged.</Typography>
                    </Paper>
                  </Grid>
                ) : (
                  resilienceLogs.map((log) => (
                    <Grid item xs={12} key={log.id}>
                      <Card sx={{ borderRadius: 4, borderLeft: `6px solid ${log.impact === 'POSITIVE' ? '#059669' : '#dc2626'}` }}>
                        <CardContent>
                          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                            <Chip label={log.type} size="small" sx={{ fontWeight: 800 }} />
                            <Typography variant="caption" color="text.secondary">{new Date(log.createdAt).toLocaleDateString()}</Typography>
                          </Stack>
                          <Typography variant="h6" sx={{ fontWeight: 900, mb: 1 }}>{log.title}</Typography>
                          <Typography variant="body2" color="text.secondary">{log.description}</Typography>
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
    </Box>
  );
}
