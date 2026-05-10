import { useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import { applyToken, loadToken, saveToken } from '../services/auth';

export function AdminPage() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [totp, setTotp] = useState('');
  const [squadsAddress, setSquadsAddress] = useState(localStorage.getItem('squads_address') || '84YBJeHew5F7NwzjLU9sqK4C7STR7XUZYugKFUscuGEd');
  const token = useMemo(() => loadToken('admin'), []);

  const login = useMutation({
    mutationFn: async () => {
      const res = await api.post('/admin/auth/login', { email, password, totp: totp || undefined });
      return res.data as { token: string; mfaSetup?: { secretBase32: string; otpauthUrl: string } };
    },
    onSuccess: (data) => {
      saveToken('admin', data.token);
      applyToken('admin');
      setLoginOpen(false);
    }
  });

  const auditLogs = useQuery({
    queryKey: ['admin-audit-logs'],
    queryFn: async () => (await api.get('/admin/audit-logs')).data,
    enabled: !!token
  });

  const treasuryInfo = useQuery({
    queryKey: ['treasury-info', squadsAddress],
    queryFn: async () => (await api.get(`/admin/treasury-info?address=${squadsAddress}`)).data,
    enabled: !!token && !!squadsAddress
  });

  const saveSquadsAddress = () => {
    localStorage.setItem('squads_address', squadsAddress);
    treasuryInfo.refetch();
  };

  return (
    <Stack spacing={2}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4">Admin Dashboard</Typography>
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            onClick={() => {
              setLoginOpen(true);
            }}
          >
            {token ? 'Re-login' : 'Login'}
          </Button>
          <Button
            variant="text"
            onClick={() => {
              saveToken('admin', null);
              applyToken('admin');
              window.location.reload();
            }}
          >
            Logout
          </Button>
        </Stack>
      </Box>

      {!token ? <Alert severity="info">Login required to access admin features.</Alert> : null}

      {token ? (
        <Stack spacing={4}>
          <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 2, bgcolor: '#ffffff' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Financial Operations (Altitude)</Typography>
              <Chip label="Powered by Squads V4" size="small" variant="outlined" />
            </Box>
            
            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
              <TextField 
                fullWidth 
                label="Altitude / Squads Address" 
                value={squadsAddress} 
                onChange={(e) => setSquadsAddress(e.target.value)}
                placeholder="Enter address from squads.xyz"
                size="small"
              />
              <Button variant="contained" onClick={saveSquadsAddress} sx={{ bgcolor: '#000', '&:hover': { bgcolor: '#333' } }}>Link Hub</Button>
            </Stack>
            
            {treasuryInfo.data && !treasuryInfo.data.error ? (
              <Stack spacing={2}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ bgcolor: '#f9f9f9', p: 2, borderRadius: 1, borderLeft: '4px solid #2e7d32' }}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>Treasury Balance</Typography>
                      <Typography variant="h4" sx={{ color: '#2e7d32', fontWeight: 'bold' }}>
                        {treasuryInfo.data.balanceSol.toFixed(4)} SOL
                      </Typography>
                      <Typography variant="caption" display="block">~ 0.00 USDC (Est.)</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ bgcolor: '#f9f9f9', p: 2, borderRadius: 1, borderLeft: '4px solid #0288d1' }}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>Yield & Payouts</Typography>
                      <Typography variant="h6" sx={{ color: '#0288d1' }}>0% APY</Typography>
                      <Typography variant="caption" display="block">Ready for ACH/SWIFT payouts</Typography>
                    </Box>
                  </Grid>
                </Grid>

                <Box display="flex" gap={1}>
                  <Button variant="outlined" size="small" startIcon={<span>💳</span>}>Manage Cards</Button>
                  <Button variant="outlined" size="small" startIcon={<span>🌍</span>}>Global Payout</Button>
                  <Button 
                    size="small" 
                    href={treasuryInfo.data.explorerUrl} 
                    target="_blank" 
                    sx={{ ml: 'auto' }}
                  >
                    On-chain Audit
                  </Button>
                </Box>
              </Stack>
            ) : squadsAddress ? (
              <Alert severity="warning">Syncing with Altitude... Ensure address is valid for Devnet.</Alert>
            ) : (
              <Alert severity="info">Link your Altitude business account to manage urban agricultural funds.</Alert>
            )}
          </Box>

          <Box>
            <Typography variant="h6">Recent Audit Logs</Typography>
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap', backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '4px' }}>
              {JSON.stringify(auditLogs.data || [], null, 2)}
            </pre>
          </Box>

          <Box sx={{ borderTop: '1px solid #ddd', pt: 3 }}>
            <Typography variant="h6" gutterBottom>Agentic Future (Inspiration)</Typography>
            <Typography variant="body2" color="text.secondary">
              Leveraging the <strong>Colosseum Agent Hackathon</strong> stack, KilimoLink can evolve into an autonomous 
              Market Monitor. This agent would automatically verify KNBS data against marketplace prices and 
              issue drought alerts via <strong>Radiants DAO</strong> protocols.
            </Typography>
          </Box>
        </Stack>
      ) : null}

      <Dialog open={loginOpen} onClose={() => setLoginOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>KilimoLink Admin Login</DialogTitle>
        <DialogContent>
          <Stack spacing={2} pt={1}>
            {login.isError ? <Alert severity="error">Login failed</Alert> : null}
            <TextField
              label="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              placeholder="e.g. shikunyi@proton.me"
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
            />
            <TextField label="MFA Code (if enabled)" value={totp} onChange={(e) => setTotp(e.target.value)} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLoginOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => login.mutate()} disabled={login.isPending}>
            Login
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
