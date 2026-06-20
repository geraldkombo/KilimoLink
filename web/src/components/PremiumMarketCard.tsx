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
    farmer?: { name: string };
    location?: { address: string };
  };
  delay?: number;
}

/**
 * Composition Pattern: Specialized Card for the Marketplace.
 * Grounded in 'frontend-design' and 'composition-patterns' skills.
 */
const CATEGORY_IMAGES: Record<string, string> = {
  Vegetables: 'https://images.unsplash.com/photo-1524179091875-bf99a9a6af97?auto=format&fit=crop&w=800&q=80',
  Fruits: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=800&q=80',
  Dairy: 'https://images.unsplash.com/photo-1550583724-1255818c0533?auto=format&fit=crop&w=800&q=80',
  Grains: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80',
  Meat: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=800&q=80',
  Honey: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80',
  'Poultry & Eggs': 'https://images.unsplash.com/photo-1568654952584-b3c6e1d8c1f4?auto=format&fit=crop&w=800&q=80',
  Tubers: 'https://images.unsplash.com/photo-1590164741170-4f9e5bccb33c?auto=format&fit=crop&w=800&q=80',
};

export const PremiumMarketCard = ({ product, delay = 0 }: PremiumMarketCardProps) => {
  return (
    <Fade in timeout={300 + delay}>
      <Card sx={{ 
        height: '100%', 
        borderRadius: 6, 
        border: '1px solid rgba(0,0,0,0.05)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)', 
        '&:hover': { 
          transform: 'translateY(-10px)', 
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          borderColor: '#064e3b'
        } 
      }}>
        <Box sx={{ position: 'relative' }}>
          <CardMedia
            component="img"
            height="220"
            image={product.imageUrl || CATEGORY_IMAGES[product.category] || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80'}
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
              bgcolor: 'rgba(255,255,255,0.95)', 
              backdropFilter: 'blur(8px)',
              fontWeight: 800,
              color: '#064e3b',
              border: 'none',
              fontSize: '0.7rem',
              textTransform: 'uppercase'
            }} 
          />
        </Box>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 900, lineHeight: 1.2, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: 0.5, color: '#111827' }}>
                {product.title}
                <VerifiedIcon sx={{ fontSize: 18, color: '#059669' }} />
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                Verified Local Farmer
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'right', ml: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 900, color: '#064e3b' }}>
                KES {product.price}
              </Typography>
              {product.farmer?.name ? (
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#065f46', mt: 0.25 }}>
                  {product.farmer.name}
                </Typography>
              ) : null}
              {product.location?.address ? (
                <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary', fontWeight: 600, mt: 0.25 }}>
                  {product.location.address}
                </Typography>
              ) : null}
            </Box>
          </Box>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3, fontWeight: 500 }}>
            {product.quantity} units available • Direct from farm
          </Typography>

          <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
            <Chip 
              icon={<LocationOnIcon sx={{ fontSize: '14px !important' }} />}
              label={product.distance !== undefined ? `${product.distance.toFixed(1)} km away` : 'Nearby'} 
              size="small" 
              sx={{ 
                fontWeight: 700, 
                borderRadius: 2,
                bgcolor: '#f0fdf4',
                color: '#064e3b',
                border: '1px solid #dcfce7'
              }}
            />
          </Stack>

          <Button 
            fullWidth 
            variant="contained" 
            component={Link}
            to={`/product/${product.id}`}
            sx={{ 
              borderRadius: 3, 
              py: 1.5, 
              bgcolor: '#064e3b', 
              color: 'white', 
              boxShadow: 'none',
              fontWeight: 800,
              textTransform: 'none',
              '&:hover': { bgcolor: '#065f46', boxShadow: '0 4px 12px rgba(6, 78, 59, 0.2)' }
            }}
          >
            View Details
          </Button>
        </CardContent>
      </Card>
    </Fade>
  );
};
