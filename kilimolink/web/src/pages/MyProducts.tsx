import { useState, useEffect } from 'react';
import { Box, Button, Container, Grid, Paper, Typography, Chip, Card, CardMedia, CardContent, CardActions, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, CircularProgress, Fade, Alert, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import StorefrontIcon from '@mui/icons-material/Storefront';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { applyToken } from '../services/auth';

interface Product {
  id: string;
  title: string;
  price: number;
  quantity: number;
  category: string;
  imageUrl?: string;
  description?: string;
  createdAt: string;
}

export function MyProducts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [editForm, setEditForm] = useState({ price: '', quantity: '', description: '' });
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const fetchMyProducts = async () => {
    setLoading(true);
    setError(null);
    const isDemo = !!applyToken('user') && localStorage.getItem('email')?.startsWith('demo@');
    try {
      const res = await api.get('/products/my');
      setProducts(res.data);
    } catch {
      if (isDemo) {
        setProducts([
          { id: 'demo-1', title: 'Sukuma Wiki (Kale)', price: 45, quantity: 50, category: 'Vegetables', description: 'Freshly harvested sukuma wiki.', createdAt: new Date().toISOString() },
          { id: 'demo-2', title: 'Fresh Tomatoes', price: 120, quantity: 80, category: 'Vegetables', description: 'Quality tomatoes.', createdAt: new Date().toISOString() },
        ]);
      } else {
        setError('Failed to load your products.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyProducts();
  }, []);

  const handleEditOpen = (p: Product) => {
    setEditProduct(p);
    setEditForm({ price: String(p.price), quantity: String(p.quantity), description: p.description || '' });
    setEditOpen(true);
  };

  const handleEditSave = async () => {
    if (!editProduct) return;
    setSaving(true);
    try {
      await api.patch(`/products/${editProduct.id}`, {
        price: Number(editForm.price),
        quantity: Number(editForm.quantity),
        description: editForm.description,
      });
      setEditOpen(false);
      setEditProduct(null);
      fetchMyProducts();
    } catch {
      setError('Failed to update product.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/products/${id}`);
      setDeleteConfirm(null);
      fetchMyProducts();
    } catch {
      setError('Failed to delete product.');
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 6, display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton onClick={() => navigate(-1)} sx={{ bgcolor: '#f0fdf4', color: '#064e3b' }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: '-0.02em', color: '#064e3b', flexGrow: 1 }}>
          My Products
        </Typography>
        <Button
          variant="contained"
          component={Link}
          to="/sell"
          startIcon={<AddCircleIcon />}
          sx={{ bgcolor: '#064e3b', borderRadius: 3, fontWeight: 800, '&:hover': { bgcolor: '#065f46' } }}
        >
          List New
        </Button>
      </Box>

      {error && (
        <Fade in>
          <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }} onClose={() => setError(null)}>{error}</Alert>
        </Fade>
      )}

      {loading ? (
        <Box sx={{ textAlign: 'center', py: 12 }}>
          <CircularProgress sx={{ color: '#064e3b' }} />
        </Box>
      ) : products.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 15, bgcolor: '#f9fafb', borderRadius: 8, border: '2px dashed #e5e7eb' }}>
          <StorefrontIcon sx={{ fontSize: 64, color: '#064e3b', mb: 3, opacity: 0.5 }} />
          <Typography variant="h5" sx={{ fontWeight: 900, color: '#064e3b', mb: 2 }}>
            No products listed yet
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Start selling your produce directly to city consumers.
          </Typography>
          <Button
            variant="contained"
            component={Link}
            to="/sell"
            sx={{ bgcolor: '#064e3b', px: 6, py: 2, borderRadius: 4, fontWeight: 900 }}
          >
            List Your First Product
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3} component={motion.div} initial="hidden" animate="visible" variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.04 } } }}>
          {products.map((p) => (
            <Grid item xs={12} sm={6} md={4} key={p.id} component={motion.div} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3 } } }}>
              <Card sx={{ borderRadius: 4, overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid #f0f0f0', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
                <CardMedia
                  component="img"
                  height="160"
                  image={p.imageUrl || 'https://images.unsplash.com/photo-1524179091875-bf99a9a6af97?auto=format&fit=crop&w=800&q=80'}
                  alt={p.title}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ pb: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#064e3b' }}>{p.title}</Typography>
                    <Chip label={p.category} size="small" sx={{ bgcolor: '#f0fdf4', color: '#059669', fontWeight: 700, fontSize: '0.65rem' }} />
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 900, color: '#064e3b' }}>
                    KES {p.price.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Qty: {p.quantity} | Listed: {new Date(p.createdAt).toLocaleDateString()}
                  </Typography>
                </CardContent>
                <CardActions sx={{ px: 2, pb: 2, gap: 1 }}>
                  <Button size="small" variant="outlined" startIcon={<EditIcon />} onClick={() => handleEditOpen(p)} sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700, color: '#064e3b', borderColor: '#064e3b' }}>
                    Edit
                  </Button>
                  <Button size="small" variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={() => setDeleteConfirm(p.id)} sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700 }}>
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4, p: 2 } }}>
        <DialogTitle sx={{ fontWeight: 900, color: '#064e3b' }}>Edit {editProduct?.title}</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <TextField label="Price (KES)" type="number" value={editForm.price} onChange={(e) => setEditForm({ ...editForm, price: e.target.value })} fullWidth InputProps={{ sx: { borderRadius: 3 } }} />
            <TextField label="Quantity" type="number" value={editForm.quantity} onChange={(e) => setEditForm({ ...editForm, quantity: e.target.value })} fullWidth InputProps={{ sx: { borderRadius: 3 } }} />
            <TextField label="Description" multiline rows={3} value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} fullWidth InputProps={{ sx: { borderRadius: 3 } }} />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setEditOpen(false)} sx={{ color: '#666', fontWeight: 600 }}>Cancel</Button>
          <Button variant="contained" onClick={handleEditSave} disabled={saving} sx={{ bgcolor: '#064e3b', borderRadius: 3, fontWeight: 800, px: 4 }}>
            {saving ? <CircularProgress size={20} color="inherit" /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} maxWidth="xs" PaperProps={{ sx: { borderRadius: 4, p: 2 } }}>
        <DialogTitle sx={{ fontWeight: 900, color: '#c53030' }}>Delete Product?</DialogTitle>
        <DialogContent>
          <Typography color="text.secondary">This action cannot be undone. The product will be removed from the marketplace.</Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setDeleteConfirm(null)} sx={{ color: '#666', fontWeight: 600 }}>Cancel</Button>
          <Button variant="contained" color="error" onClick={() => deleteConfirm && handleDelete(deleteConfirm)} sx={{ borderRadius: 3, fontWeight: 800 }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
