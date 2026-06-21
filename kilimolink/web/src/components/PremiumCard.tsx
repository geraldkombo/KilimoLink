import { Box, Paper, Typography, Fade } from '@mui/material';
import { ReactNode } from 'react';

interface PremiumCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  action?: ReactNode;
  delay?: number;
}

/**
 * Composition Pattern: Compound Component for consistent premium cards.
 * Grounded in 'frontend-design' and 'shadcn' aesthetics.
 */
export const PremiumCard = ({ title, subtitle, children, action, delay = 0 }: PremiumCardProps) => {
  return (
    <Fade in timeout={500 + delay}>
      <Paper sx={{ 
        p: 4, 
        borderRadius: 5, 
        height: '100%', 
        boxShadow: '0 10px 40px rgba(0,0,0,0.03)', 
        border: '1px solid rgba(0,0,0,0.05)',
        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.06)'
        }
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: '-0.01em' }}>{title}</Typography>
            {subtitle && <Typography variant="body2" color="text.secondary">{subtitle}</Typography>}
          </Box>
          {action && <Box>{action}</Box>}
        </Box>
        {children}
      </Paper>
    </Fade>
  );
};
