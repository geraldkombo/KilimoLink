import { useEffect, useState } from 'react';
import { Box, Typography, Chip, Stack } from '@mui/material';
import { api } from '../services/api';

interface Truth {
  referencePrice: number;
  middlemanPrice: number;
  gapKes: number;
  farmerLossPercent: number;
  source: string;
  asOf: string;
  note: string;
}

export function PriceTruthGap({ slug }: { slug: string | null }) {
  const [t, setT] = useState<Truth | null>(null);

  useEffect(() => {
    if (!slug) { setT(null); return; }
    api.get(`/ai/price-truth/${slug}`).then(r => setT(r.data)).catch(() => setT(null));
  }, [slug]);

  if (!t) return null;

  const max = Math.max(t.referencePrice, t.middlemanPrice);

  return (
    <Box sx={{ mt: 2, p: 2, borderRadius: 2, bgcolor: '#FFF8E1', border: '1px solid #F9A825' }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1, color: '#E65100' }}>
        The Price Truth Gap
      </Typography>
      <Typography variant="caption" sx={{ display: 'block', mb: 1.5, color: '#666', fontWeight: 500 }}>
        What farmers are quoted vs. the government reference price
      </Typography>
      <Stack spacing={1.5}>
        <Box>
          <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#C62828' }}>
              WhatsApp / middleman quote
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 900, color: '#C62828' }}>
              KES {t.middlemanPrice}
            </Typography>
          </Stack>
          <Box sx={{ height: 14, borderRadius: 1, bgcolor: '#FFCDD2', overflow: 'hidden' }}>
            <Box sx={{ height: '100%', borderRadius: 1, bgcolor: '#C62828', transition: 'width 0.5s', width: `${(t.middlemanPrice / max) * 100}%` }} />
          </Box>
        </Box>
        <Box>
          <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#2E7D32' }}>
              {t.source} ({t.asOf})
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 900, color: '#2E7D32' }}>
              KES {t.referencePrice}
            </Typography>
          </Stack>
          <Box sx={{ height: 14, borderRadius: 1, bgcolor: '#C8E6C9', overflow: 'hidden' }}>
            <Box sx={{ height: '100%', borderRadius: 1, bgcolor: '#2E7D32', transition: 'width 0.5s', width: `${(t.referencePrice / max) * 100}%` }} />
          </Box>
        </Box>
      </Stack>
      <Chip
        size="small"
        color="error"
        sx={{ mt: 1.5, fontWeight: 800, height: 24 }}
        label={`Farmer underpaid KES ${t.gapKes} - ${t.farmerLossPercent}% lost to bad information`}
      />
      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.5, fontSize: '0.6rem' }}>
        Reference: {t.source}. Middleman rate: representative field quote, being validated.
      </Typography>
    </Box>
  );
}
