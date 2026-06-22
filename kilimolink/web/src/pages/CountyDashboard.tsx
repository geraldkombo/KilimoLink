import { useEffect, useState } from 'react';
import { Box, Card, CardContent, Chip, Container, Grid, LinearProgress, Paper, Stack, Typography, Skeleton, Alert, Button } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import MapIcon from '@mui/icons-material/Map';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import Co2Icon from '@mui/icons-material/Co2';
import InsightsIcon from '@mui/icons-material/Insights';
import { api } from '../services/api';

const flows = [
  { from: 'Kiambu corridor', to: 'Mathare', crop: 'Tomatoes', risk: 'High', color: '#dc2626' },
  { from: 'Machakos corridor', to: 'Mukuru', crop: 'Sukuma Wiki', risk: 'Watch', color: '#f59e0b' },
  { from: 'Kajiado corridor', to: 'Kibera', crop: 'Milk', risk: 'Stable', color: '#16a34a' },
];

const neighborhoods = [
  { name: 'Mukuru', spike: 32, access: 42, status: 'critical' },
  { name: 'Mathare', spike: 24, access: 55, status: 'watch' },
  { name: 'Kibera', spike: 18, access: 61, status: 'watch' },
  { name: 'Kilimani', spike: 5, access: 89, status: 'stable' },
];

export function CountyDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [impact, setImpact] = useState<any>(null);

  const fetchImpact = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/impact');
      setImpact(res.data);
    } catch {
      setError('Could not load live impact data. Showing demo data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImpact();
  }, []);
  const showDemo = !!error || !impact;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Stack spacing={1} sx={{ mb: 4 }}>
        <Chip
          label="Prototype for Nairobi City County"
          sx={{ alignSelf: 'flex-start', bgcolor: '#ecfdf5', color: '#047857', fontWeight: 900 }}
        />
        <Typography variant="h3" sx={{ fontWeight: 950, color: '#064e3b', letterSpacing: '-0.05em', fontSize: { xs: '1.5rem', sm: '3rem' } }}>
          Nairobi Food System Intelligence - Climate & Transport Dashboard
        </Typography>
        <Typography variant="h6" sx={{ color: '#4b5563', maxWidth: 920, lineHeight: 1.5 }}>
          Live food flows, transport corridors, price stability, and supply disruption alerts across Nairobi's food system.
        </Typography>
        <Typography variant="body1" sx={{ color: '#374151', maxWidth: 920, fontWeight: 800 }}>
          AI-driven early warnings prioritize informal-settlement neighborhoods (e.g., Mukuru, Mathare, Kibera) and surface transport resilience recommendations for rapid response.
        </Typography>
      </Stack>

      {error && (
        <Alert severity="warning" sx={{ mb: 4, borderRadius: 3, fontWeight: 700 }}
          action={<Button size="small" variant="outlined" sx={{ fontWeight: 800 }} onClick={fetchImpact}>Retry</Button>}
        >
          Live resilience data is temporarily unavailable. Displaying representative figures for demonstration.
        </Alert>
      )}

      {loading && (
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {[1, 2, 3, 4].map((i) => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <Card elevation={0} sx={{ borderRadius: 4, border: '1px solid #e5e7eb', height: '100%' }}>
                <CardContent>
                  <Skeleton variant="circular" width={40} height={40} />
                  <Skeleton variant="text" width="60%" height={48} />
                  <Skeleton variant="text" width="80%" />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {!loading && (
      <>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {[
          { icon: <WarningAmberIcon />, label: 'Supply Disruption Alerts', value: '3 alerts', tone: '#dc2626' },
          { icon: <ShowChartIcon />, label: 'Active Supply Routes', value: '32 routes', tone: '#f59e0b' },
          { icon: <Co2Icon />, label: 'Tonnes Coordinated', value: '12.3 t', tone: '#059669' },
          { icon: <InsightsIcon />, label: 'Communities Served', value: '12', tone: '#2563eb' },
        ].map((item) => (
          <Grid item xs={12} sm={6} md={3} key={item.label}>
            <Card elevation={0} sx={{ borderRadius: 4, border: '1px solid #e5e7eb', height: '100%' }}>
              <CardContent>
                <Box sx={{ color: item.tone, mb: 1 }}>{item.icon}</Box>
                <Typography variant="h4" sx={{ fontWeight: 950, color: item.tone }}>{item.value}</Typography>
                <Typography variant="body2" sx={{ color: '#4b5563', fontWeight: 700 }}>{item.label}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 5, border: '1px solid #e5e7eb', minHeight: 430 }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
              <MapIcon sx={{ color: '#064e3b' }} />
              <Typography variant="h5" sx={{ fontWeight: 900, color: '#064e3b' }}>🚜 Food-Flow Corridor Map</Typography>
            </Stack>
            <Box sx={{ position: 'relative', height: 330, borderRadius: 4, overflow: 'hidden', bgcolor: '#ecfdf5', border: '1px solid #bbf7d0' }}>
              <Box sx={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 45% 45%, rgba(6,78,59,.18), transparent 22%), radial-gradient(circle at 70% 60%, rgba(220,38,38,.18), transparent 18%), radial-gradient(circle at 30% 70%, rgba(245,158,11,.18), transparent 16%)' }} />
              {flows.map((flow, idx) => (
                <Box key={flow.to} sx={{ position: 'absolute', left: `${12 + idx * 18}%`, top: `${18 + idx * 21}%`, width: `${52 - idx * 8}%`, borderTop: `5px solid ${flow.color}`, transform: `rotate(${14 - idx * 11}deg)`, transformOrigin: 'left center', borderRadius: 999 }}>
                  <Chip size="small" label={`${flow.from} → ${flow.to}`} sx={{ mt: -4, bgcolor: 'white', color: flow.color, fontWeight: 900, boxShadow: '0 8px 20px rgba(0,0,0,.08)' }} />
                </Box>
              ))}
              <Box sx={{ position: 'absolute', bottom: 16, left: 16, right: 16, p: 2, bgcolor: 'rgba(255,255,255,.92)', borderRadius: 3 }}>
                <Typography variant="body2" sx={{ fontWeight: 800, color: '#064e3b' }}>
                  Prototype map layer powered by marketplace listings — demonstrates routing, supply corridors, and early-warning overlays.
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={5}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 5, border: '1px solid #e5e7eb', mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 900, color: '#064e3b', mb: 2 }}>⚠️ Supply Disruption Risk</Typography>
            <Box sx={{ p: 2, borderRadius: 3, bgcolor: '#fef2f2', border: '1px solid #fecaca' }}>
              <Typography sx={{ fontWeight: 950, color: '#991b1b' }}>🚨 Kiambu tomato corridor at risk</Typography>
              <Typography variant="body2" sx={{ color: '#7f1d1d', mt: 1 }}>
                Heavy rain forecast plus falling listing volume suggests possible tomato supply drop next week. Priority monitoring: Mathare and Mukuru.
              </Typography>
            </Box>
          </Paper>

          <Paper elevation={0} sx={{ p: 3, borderRadius: 5, border: '1px solid #e5e7eb' }}>
            <Typography variant="h5" sx={{ fontWeight: 900, color: '#064e3b', mb: 2 }}>📊 Price Stability & Food Access</Typography>
            <Stack spacing={2}>
              {neighborhoods.map((n) => (
                <Box key={n.name}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                    <Typography sx={{ fontWeight: 900 }}>{n.name}</Typography>
                    <Chip
                      size="small"
                      label={`${n.spike}% price change`}
                      color={n.status === 'critical' ? 'error' : n.status === 'watch' ? 'warning' : 'success'}
                      sx={{ fontWeight: 800 }}
                    />
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={n.access}
                    sx={{ height: 9, borderRadius: 999, bgcolor: '#e5e7eb', '& .MuiLinearProgress-bar': { bgcolor: n.status === 'critical' ? '#dc2626' : n.status === 'watch' ? '#f59e0b' : '#16a34a' } }}
                  />
                  <Typography variant="caption" color="text.secondary">Fresh food access index: {n.access}/100</Typography>
                </Box>
              ))}
            </Stack>
          </Paper>
        </Grid>
      </Grid>
      </>
      )}
    </Container>
  );
}
