import { useEffect, useState } from 'react';
import { CircularProgress, Link, IconButton, Fade, Stack, Rating, TextField, Card, CardContent, Skeleton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import StarIcon from '@mui/icons-material/Star';
import ChatIcon from '@mui/icons-material/Chat';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { Box, Button, Container, Grid, Paper, Typography, Chip, Divider, Alert } from '@mui/material';
import { api } from '../services/api';
import { applyToken, loadToken } from '../services/auth';
import { PriceTruthGap } from '../components/PriceTruthGap';

const DEMO_PRODUCTS: Record<string, any> = {
  'demo-1': { id: 'demo-1', title: 'Sukuma Wiki (Kale)', price: 45, category: 'Vegetables', description: 'Freshly harvested sukuma wiki. Grown locally using organic methods. Picked this morning for the best taste and nutrition.', farmer: { name: 'Jane Wanjiku', phone: '0712345678' }, location: { address: 'Kiambu' }, imageUrl: '' },
  'demo-2': { id: 'demo-2', title: 'Fresh Tomatoes', price: 120, category: 'Vegetables', description: 'Quality tomatoes from our local garden. We don\'t use harsh chemicals, and we deliver fast to keep them crisp.', farmer: { name: 'Peter Kamau', phone: '0723456789' }, location: { address: 'Machakos' }, imageUrl: '' },
};

const CATEGORY_IMAGES: Record<string, string> = {
  Vegetables: 'https://images.unsplash.com/photo-1777353245982-c34b21fc5175?auto=format&fit=crop&w=800&q=80',
  Fruits: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=800&q=80',
  Dairy: 'https://images.unsplash.com/photo-1601436423474-51738541c1b1?auto=format&fit=crop&w=800&q=80',
  Grains: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80',
  Meat: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=800&q=80',
  Honey: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80',
  'Poultry & Eggs': 'https://images.unsplash.com/photo-1568654952584-b3c6e1d8c1f4?auto=format&fit=crop&w=800&q=80',
  Tubers: 'https://images.unsplash.com/photo-1590164741170-4f9e5bccb33c?auto=format&fit=crop&w=800&q=80',
};

export function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [reviews, setReviews] = useState<any[]>([]);
  const [avgRating, setAvgRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [userCanReview, setUserCanReview] = useState(false);
  const [reviewFormOpen, setReviewFormOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState<number | null>(5);
  const [reviewText, setReviewText] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setFetching(true);
      setError(null);
      const isDemo = !!applyToken('user') && localStorage.getItem('email')?.startsWith('demo@');
      if (isDemo && id && DEMO_PRODUCTS[id]) {
        setProduct(DEMO_PRODUCTS[id]);
        setFetching(false);
        return;
      }
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data);
      } catch (err: any) {
        if (isDemo && DEMO_PRODUCTS['demo-1']) {
          setProduct(DEMO_PRODUCTS['demo-1']);
        } else {
          setError(err.response?.status === 404 ? 'Product not found.' : (err.userMessage || 'Failed to load product details.'));
        }
      } finally {
        setFetching(false);
      }
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (!id) return;
    const fetchReviews = async () => {
      setReviewsLoading(true);
      try {
        const res = await api.get(`/products/${id}/reviews`);
        setReviews(res.data.reviews ?? []);
        setAvgRating(res.data.avgRating ?? 0);
        setReviewCount(res.data.reviewCount ?? 0);
      } catch {
        // ignore
      } finally {
        setReviewsLoading(false);
      }
    };
    fetchReviews();
  }, [id]);

  useEffect(() => {
    if (!id || !loadToken('user')) return;
    const checkEligibility = async () => {
      try {
        const ordersRes = await api.get('/orders');
        const orders = ordersRes.data?.orders ?? [];
        const hasDelivered = orders.some(
          (o: any) =>
            o.status === 'DELIVERED' &&
            o.items?.some((i: any) => i.productId === id || i.product?.id === id),
        );
        setUserCanReview(hasDelivered);
      } catch {
        // not authenticated
      }
    };
    checkEligibility();
  }, [id]);

  const handleSubmitReview = async () => {
    if (!reviewRating) return;
    setReviewSubmitting(true);
    setReviewError(null);
    try {
      await api.post('/reviews', {
        productId: id,
        rating: reviewRating,
        comment: reviewText || undefined,
      });
      setReviewFormOpen(false);
      setReviewText('');
      setReviewRating(5);
      setUserCanReview(false);
      const res = await api.get(`/products/${id}/reviews`);
      setReviews(res.data.reviews ?? []);
      setAvgRating(res.data.avgRating ?? 0);
      setReviewCount(res.data.reviewCount ?? 0);
    } catch (err: any) {
      setReviewError(err?.response?.data?.message || 'Failed to submit review');
    } finally {
      setReviewSubmitting(false);
    }
  };

  const handleOrder = async () => {
    setLoading(true);
    try {
      await api.post('/orders', {
        productId: id,
        quantity: 1,
        paymentMethod: 'CASH'
      });
      
      setSuccess(true);
      setTimeout(() => navigate('/orders'), 2000);
    } catch (err: any) {
      console.error('Order failed', err);
      setError(err.response?.data?.message || err.userMessage || 'Failed to place order.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return (
    <Container sx={{ py: 15, textAlign: 'center' }}>
      <CircularProgress sx={{ color: '#064e3b' }} />
      <Typography sx={{ mt: 3, fontWeight: 700, color: '#374151' }}>Fetching product details...</Typography>
    </Container>
  );

  if (error || !product) return (
    <Container sx={{ py: 15, textAlign: 'center' }}>
      <Typography color="#991b1b" variant="h4" sx={{ fontWeight: 900, mb: 4 }}>{error || 'Product not found'}</Typography>
      <Button variant="contained" component={RouterLink} to="/market" sx={{ bgcolor: '#064e3b', borderRadius: 4, px: 6, py: 1.5, fontWeight: 900 }}>
        Back to Marketplace
      </Button>
    </Container>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ mb: 6 }}>
        <IconButton onClick={() => navigate(-1)} sx={{ bgcolor: '#f0fdf4', color: '#064e3b', '&:hover': { bgcolor: '#dcfce7' }, mb: 2 }}>
          <ArrowBackIcon />
        </IconButton>
      </Box>

      {success && (
        <Fade in>
          <Alert severity="success" sx={{ mb: 6, borderRadius: 4, fontWeight: 800, bgcolor: '#ecfdf5', color: '#065f46', border: '1px solid #dcfce7' }}>
            Order placed successfully! Redirecting to your orders...
          </Alert>
        </Fade>
      )}

      <Grid container spacing={10}>
        <Grid item xs={12} md={6}>
          <Box sx={{ position: 'sticky', top: 100 }}>
            <Paper elevation={0} sx={{ borderRadius: 8, overflow: 'hidden', boxShadow: '0 40px 80px rgba(0,0,0,0.12)', border: '1px solid rgba(0,0,0,0.05)' }}>
              <img 
                src={product.imageUrl || CATEGORY_IMAGES[product.category] || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80'} 
                alt={product.title}
                style={{ width: '100%', height: 'auto', maxHeight: '600px', objectFit: 'cover', display: 'block' }}
              />
            </Paper>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box>
            <Stack direction="row" spacing={1.5} sx={{ mb: 3 }}>
              <Chip 
                label={product.category} 
                sx={{ fontWeight: 800, bgcolor: '#f0fdf4', color: '#064e3b', border: 'none', px: 1 }} 
              />
              <Chip 
                label="Direct from Farm" 
                variant="outlined" 
                sx={{ fontWeight: 700, borderColor: '#d1d5db', color: '#374151' }} 
              />
            </Stack>

            <Typography variant="h2" sx={{ fontWeight: 950, mb: 1, letterSpacing: '-0.05em', color: '#111827', lineHeight: 1.1 }}>
              {product.title}
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 900, color: '#064e3b', mb: 5, letterSpacing: '-0.02em' }}>
              KES {product.price}
            </Typography>
            
            <Typography variant="body1" sx={{ color: '#4b5563', lineHeight: 1.8, fontSize: '1.2rem', mb: 5, fontWeight: 400 }}>
              {product.description || 'Fresh produce sourced directly from a local farmer.'}
            </Typography>

            <PriceTruthGap slug={id || null} />

            {/* Reviews Section */}
            <Box sx={{ mt: 5, mb: 4 }}>
              <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
                {avgRating > 0 ? (
                  <>
                    <Rating value={avgRating} readOnly size="large" precision={0.5} emptyIcon={<StarIcon fontSize="inherit" sx={{ opacity: 0.3 }} />} sx={{ color: '#f59e0b' }} />
                    <Typography variant="h6" sx={{ fontWeight: 900, color: '#111827' }}>{avgRating.toFixed(1)}</Typography>
                    <Typography variant="body2" sx={{ color: '#6b7280', fontWeight: 600 }}>({reviewCount} reviews)</Typography>
                  </>
                ) : reviewsLoading ? (
                  <Skeleton variant="rounded" width={200} height={32} />
                ) : (
                  <Typography variant="body1" sx={{ fontWeight: 700, color: '#6b7280' }}>No reviews yet</Typography>
                )}
              </Stack>

              {reviewsLoading ? (
                [1, 2].map((i) => (
                  <Skeleton key={i} variant="rounded" height={80} sx={{ mb: 2, borderRadius: 3 }} />
                ))
              ) : reviews.length > 0 ? (
                reviews.map((review: any) => (
                  <Card key={review.id} elevation={0} sx={{ mb: 2, p: 2, bgcolor: '#f9fafb', borderRadius: 4 }}>
                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
                      <Rating value={review.rating} readOnly size="small" emptyIcon={<StarIcon fontSize="inherit" sx={{ opacity: 0.3 }} />} sx={{ color: '#f59e0b' }} />
                      <Typography variant="caption" sx={{ fontWeight: 800, color: '#111827' }}>
                        {review.buyer?.name || 'Buyer'}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#9ca3af' }}>
                        {new Date(review.createdAt).toLocaleDateString()}
                      </Typography>
                    </Stack>
                    {review.comment && (
                      <Typography variant="body2" sx={{ color: '#374151', fontWeight: 500 }}>
                        {review.comment}
                      </Typography>
                    )}
                  </Card>
                ))
              ) : null}

              {userCanReview && !reviewFormOpen && (
                <Button variant="outlined" size="small" onClick={() => setReviewFormOpen(true)}
                  sx={{ mt: 1, borderRadius: 3, fontWeight: 700, color: '#064e3b', borderColor: '#064e3b' }}>
                  Write a Review
                </Button>
              )}

              {reviewFormOpen && (
                <Paper elevation={0} sx={{ p: 3, bgcolor: '#f0fdf4', borderRadius: 4, border: '1px solid #dcfce7', mt: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 2, color: '#064e3b' }}>Write your review</Typography>
                  <Rating value={reviewRating} onChange={(_, v) => setReviewRating(v)} size="large" sx={{ mb: 2, color: '#f59e0b' }} />
                  <TextField fullWidth multiline rows={2} placeholder="Share your experience with this product..." value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)} sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />
                  {reviewError && <Typography sx={{ color: '#991b1b', fontWeight: 600, mb: 1, fontSize: '0.85rem' }}>{reviewError}</Typography>}
                  <Stack direction="row" spacing={1}>
                    <Button variant="contained" size="small" disabled={reviewSubmitting || !reviewRating}
                      onClick={handleSubmitReview} sx={{ bgcolor: '#064e3b', borderRadius: 3, fontWeight: 800, '&:hover': { bgcolor: '#065f46' } }}>
                      {reviewSubmitting ? <CircularProgress size={18} color="inherit" /> : 'Submit Review'}
                    </Button>
                    <Button variant="text" size="small" onClick={() => { setReviewFormOpen(false); setReviewError(null); }}
                      sx={{ color: '#6b7280', fontWeight: 700 }}>
                      Cancel
                    </Button>
                  </Stack>
                </Paper>
              )}
            </Box>

            <Divider sx={{ my: 5 }} />

              <Box sx={{ mb: 5, display: 'flex', alignItems: 'center', gap: 3, p: 3, bgcolor: '#f9fafb', borderRadius: 6 }}>
                <Box sx={{ width: 60, height: 60, borderRadius: '50%', bgcolor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                  👨‍🌾
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: '#6b7280', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Farmer</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 900, color: '#111827' }}>{product.farmer?.name || 'Local Producer'}</Typography>
                  <Typography variant="body2" sx={{ color: '#4b5563', fontWeight: 500 }}>{product.location?.address || 'Nairobi, Kenya'}</Typography>
                  {product.farmer?.phone && (
                    <Typography variant="body2" sx={{ color: '#064e3b', fontWeight: 700, mt: 0.5 }}>
                      📞 {product.farmer.phone}
                    </Typography>
                  )}
                  {product.farmer?.id && (
                    <Button variant="outlined" size="small" startIcon={<ChatIcon />}
                      onClick={() => navigate(`/chat?userId=${product.farmer.id}`)}
                      sx={{ mt: 1.5, borderRadius: 3, fontWeight: 700, color: '#064e3b', borderColor: '#064e3b', textTransform: 'none' }}>
                      Message Seller
                    </Button>
                  )}
                </Box>
              </Box>

            <Button 
              fullWidth 
              variant="contained" 
              size="large" 
              onClick={handleOrder}
              disabled={loading}
              sx={{ 
                py: 2.5, 
                borderRadius: 4, 
                bgcolor: '#064e3b', 
                fontSize: '1.3rem', 
                fontWeight: 950,
                textTransform: 'none',
                boxShadow: '0 15px 30px rgba(6, 78, 59, 0.25)',
                '&:hover': { bgcolor: '#065f46', transform: 'translateY(-2px)', boxShadow: '0 20px 40px rgba(6, 78, 59, 0.3)' },
                transition: 'all 0.3s'
              }}
            >
              {loading ? <CircularProgress size={28} color="inherit" /> : 'Confirm Order'}
            </Button>
            <Typography variant="caption" display="block" align="center" sx={{ mt: 3, color: '#6b7280', fontWeight: 500 }}>
              Pay the farmer directly via phone after ordering.
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}
