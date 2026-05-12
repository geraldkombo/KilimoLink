import { Box, Card, CardContent, CardMedia, Typography, Chip, Button, Fade, Stack } from '@mui/material';
import { Link } from 'react-router-dom';
import LocationOnIcon from '@mui/icons-material/LocationOn';

import VerifiedIcon from '@mui/icons-material/Verified';

interface PremiumMarketCardProps {
  product: {
    id: string;
    title: string;
    price: number;
    quantity: number;
    category: string;
    imageUrl?: string;
    distance?: number;
    verified?: boolean;
  };
  delay?: number;
}

/**
 * Composition Pattern: Specialized Card for the Marketplace.
 * Grounded in 'frontend-design' and 'composition-patterns' skills.
 */
export const PremiumMarketCard = ({ product, delay = 0 }: PremiumMarketCardProps) => {
  return (
    <Fade in timeout={300 + delay}>
      <Card sx={{ 
        height: '100%', 
        borderRadius: 5, 
        border: '1px solid rgba(0,0,0,0.05)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', 
        '&:hover': { 
          transform: 'translateY(-8px)', 
          boxShadow: '0 12px 30px rgba(0,0,0,0.08)',
          borderColor: '#1b5e20'
        } 
      }}>
        <Box sx={{ position: 'relative' }}>
          <CardMedia
            component="img"
            height="220"
            image={product.imageUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80'}
            alt={product.title}
            sx={{ filter: 'brightness(0.95)' }}
          />
          <Chip 
            label={product.category} 
            size="small" 
            sx={{ 
              position: 'absolute', 
              top: 16, 
              right: 16, 
              bgcolor: 'rgba(255,255,255,0.9)', 
              backdropFilter: 'blur(4px)',
              fontWeight: 'bold',
              color: '#1b5e20',
              border: 'none'
            }} 
          />
        </Box>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2, letterSpacing: '-0.01em', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {product.title}
                <VerifiedIcon sx={{ fontSize: 16, color: '#1b5e20' }} />
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                Protocol Trace: #TRC-{product.id.substring(0, 4).toUpperCase()}
              </Typography>
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 900, color: '#1b5e20', ml: 2 }}>
              KES {product.price}
            </Typography>
          </Box>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3, fontWeight: 500 }}>
            {product.quantity} units available • Harvested recently
          </Typography>

          <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
            <Chip 
              icon={<LocationOnIcon sx={{ fontSize: '14px !important' }} />}
              label={product.distance !== undefined ? `${product.distance.toFixed(1)} km` : 'Local'} 
              size="small" 
              color={product.distance && product.distance < 5 ? "success" : "default"}
              variant={product.distance && product.distance < 5 ? "filled" : "outlined"}
              sx={{ fontWeight: 700, borderRadius: 2 }}
            />
            {product.distance && product.distance < 2 && (
              <Chip label="Ultra Local" size="small" sx={{ bgcolor: '#e8f5e9', color: '#2e7d32', fontWeight: 700, borderRadius: 2 }} />
            )}
          </Stack>

          <Button 
            fullWidth 
            variant="contained" 
            component={Link}
            to={`/product/${product.id}`}
            sx={{ 
              borderRadius: 3, 
              py: 1.5, 
              bgcolor: '#f5f5f5', 
              color: '#333', 
              boxShadow: 'none',
              fontWeight: 800,
              textTransform: 'none',
              '&:hover': { bgcolor: '#1b5e20', color: 'white', boxShadow: 'none' }
            }}
          >
            View Details
          </Button>
        </CardContent>
      </Card>
    </Fade>
  );
};
