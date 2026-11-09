import { useEffect, useState } from 'react';
import { Box, Typography, Chip, Stack } from '@mui/material';
import { api } from '../services/api';

interface Truth {
  referencePrice: number;
  middlemanPrice: number;
  spreadKes: number;
  spreadPercent: number;
  source: string;
  asOf: string;
  note: string;
}

/**
 * Price spread panel — NEUTRAL, evidence-framed.
 *
 * What this is NOT: an accusation that any particular buyer is cheating the farmer.
 * What this IS: two price points with stated provenance, side by side, so a seller
 * can see the spread and decide what to do with it. The gap is a market fact to
 * display, not a moral verdict to deliver.
 *
 * The old framing ("Farmer underpaid ... lost to bad information") treated a whole
 * trade class as fraudulent on the basis of a single representative quote. That is
 * not defensible and it is not what a tool should assert. This component now shows
 * the numbers, the sources, and the caveat — and nothing else.
 */
export function PriceTruthGap({ slug }: { slug: string | null }) {
  const [t, setT] = useState<Truth | null>(null);

  useEffect(() => {
    if (!slug) { setT(null); return; }
    api.get(`/ai/price-truth/${slug}`).then(r => setT(r.data)).catch(() => setT(null));
  }, [slug]);

  if (!t) return null;

  const max = Math.max(t.referencePrice, t.middlemanPrice);

  return (
    <Box sx={{ mt: 2, p: 2, borderRadius: 2, bgcolor: '#F5F5F5', border: '1px solid #E0E0E0' }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1, color: '#424242' }}>
        Two price points for this crop
      </Typography>
      <Typography variant="caption" sx={{ display: 'block', mb: 1.5, color: '#666', fontWeight: 500 }}>
        Government reference price vs. a typical field quote. Both are single-point
        snapshots; neither is what you will actually get. Use them as a range, not a verdict.
      </Typography>
      <Stack spacing={1.5}>
        <Box>
          <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#2E7D32' }}>
              Government reference ({t.source}, {t.asOf})
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 900, color: '#2E7D32' }}>
              KES {t.referencePrice}
            </Typography>
          </Stack>
          <Box sx={{ height: 14, borderRadius: 1, bgcolor: '#C8E6C9', overflow: 'hidden' }}>
            <Box sx={{ height: '100%', borderRadius: 1, bgcolor: '#2E7D32', transition: 'width 0.5s', width: `${(t.referencePrice / max) * 100}%` }} />
          </Box>
        </Box>
        <Box>
          <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#6D4C41' }}>
              Typical field / buyer quote
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 900, color: '#6D4C41' }}>
              KES {t.middlemanPrice}
            </Typography>
          </Stack>
          <Box sx={{ height: 14, borderRadius: 1, bgcolor: '#EFEBE9', overflow: 'hidden' }}>
            <Box sx={{ height: '100%', borderRadius: 1, bgcolor: '#8D6E63', transition: 'width 0.5s', width: `${(t.middlemanPrice / max) * 100}%` }} />
          </Box>
        </Box>
      </Stack>
      <Chip
        size="small"
        sx={{ mt: 1.5, fontWeight: 800, height: 24, bgcolor: '#ECEFF1', color: '#37474F' }}
        label={`Spread: KES ${t.spreadKes} (${t.spreadPercent}%) between the two snapshots`}
      />
      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.5, fontSize: '0.6rem' }}>
        {t.note}
      </Typography>
    </Box>
  );
}