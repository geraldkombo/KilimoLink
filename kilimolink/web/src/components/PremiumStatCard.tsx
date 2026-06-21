import { Box, Paper, Typography, Fade } from '@mui/material';
import { ReactNode } from 'react';

interface PremiumStatCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  color?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

/**
 * Composition Pattern: Specialized Stat Card for rapid oversight.
 * Grounded in 'chart-visualization' and 'frontend-design' skills.
 */
export const PremiumStatCard = ({ label, value, subtitle, icon, color = '#1b5e20', trend }: PremiumStatCardProps) => {
  return (
    <Fade in timeout={600}>
      <Paper sx={{ 
        p: 3, 
        borderRadius: 4, 
        height: '100%', 
        bgcolor: 'white',
        border: '1px solid #f0f0f0',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          borderColor: color,
          transform: 'scale(1.02)',
          boxShadow: `0 10px 30px ${color}10`
        }
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="caption" sx={{ fontWeight: 800, color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {label}
          </Typography>
          {icon && <Box sx={{ color }}>{icon}</Box>}
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 900, color, mb: 0.5 }}>
          {value}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {trend && (
            <Typography variant="caption" sx={{ fontWeight: 800, color: trend.isPositive ? '#2e7d32' : '#d32f2f' }}>
              {trend.isPositive ? '↑' : '↓'} {trend.value}
            </Typography>
          )}
          {subtitle && (
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
              {subtitle}
            </Typography>
          )}
        </Box>
      </Paper>
    </Fade>
  );
};
