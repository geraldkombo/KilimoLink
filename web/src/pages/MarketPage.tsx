import { Box, Card, CardContent, Chip, Grid, Stack, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';

export function MarketPage() {
  const products = useQuery({
    queryKey: ['products'],
    queryFn: async () => (await api.get('/products')).data
  });

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: '900' }}>Urban Marketplace</Typography>
        <Typography variant="body1" color="text.secondary">
          A transparent linkage between city consumers and climate-resilient local producers.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {Array.isArray(products.data) && products.data.map((p: any) => (
          <Grid item xs={12} sm={6} md={4} key={p.id}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6">{p.name}</Typography>
                <Typography color="primary" variant="subtitle1">KES {p.priceKes} / {p.unit}</Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>{p.description}</Typography>
                <Stack direction="row" spacing={1}>
                  <Chip label={p.category} size="small" />
                  <Chip label={p.county} size="small" color="secondary" variant="outlined" />
                </Stack>
                
                {p.verification?.verified && (
                  <Box sx={{ mt: 2, p: 1, bgcolor: '#e8f5e9', borderRadius: 1, border: '1px solid #c8e6c9' }}>
                    <Typography variant="caption" color="success.main" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      Γ£ô KNBS Verified Price
                    </Typography>
                    <Typography variant="caption" display="block" color="text.secondary">
                      Fair value based on 2026 regional data.
                    </Typography>
                  </Box>
                )}

                {p.business?.emissionsReduced > 0 && (
                  <Box sx={{ mt: 2, p: 1, bgcolor: 'success.light', borderRadius: 1 }}>
                    <Typography variant="caption" color="success.contrastText" sx={{ fontWeight: 'bold' }}>
                      🌱 {p.business.emissionsReduced} kg CO2e saved
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {!products.data?.length && (
        <Typography color="text.secondary">No urban produce available in your area currently.</Typography>
      )}
    </Stack>
  );
}
