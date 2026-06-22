import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  Avatar,
  Badge,
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  Paper,
  Skeleton,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SendIcon from '@mui/icons-material/Send';
import { useSearchParams } from 'react-router-dom';
import { api } from '../services/api';

type Conversation = {
  partner: { id: string; name?: string };
  lastMessage: { text: string; createdAt: string };
  unreadCount: number;
};

type Message = {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  readAt?: string;
  createdAt: string;
  sender?: { id: string; name?: string };
  receiver?: { id: string; name?: string };
};

const getUserId = () => localStorage.getItem('kilomolink_user_id');

const timeAgo = (date: string) =>
  new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

export function Chat() {
  const [searchParams] = useSearchParams();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeUserId, setActiveUserId] = useState<string | null>(searchParams.get('userId'));
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up('md'));
  const currentUserId = getUserId();

  const loadConversations = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/chat/conversations');
      setConversations(data);
    } catch {
      setError('Could not load conversations');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMessages = useCallback(async () => {
    if (!activeUserId) return;
    setMessagesLoading(true);
    try {
      const { data } = await api.get(`/chat/messages/${activeUserId}`);
      setMessages(data);
    } catch {
      setError('Could not load messages');
    } finally {
      setMessagesLoading(false);
    }
  }, [activeUserId]);

  const sendMessage = async () => {
    if (!activeUserId || !text.trim()) return;
    const body = text.trim();
    setText('');
    try {
      await api.post('/chat/messages', { receiverId: activeUserId, text: body });
      await Promise.all([loadMessages(), loadConversations()]);
    } catch {
      setError('Could not send message');
      setText(body);
    }
  };

  useEffect(() => { loadConversations(); }, [loadConversations]);
  useEffect(() => { loadMessages(); }, [loadMessages]);

  useEffect(() => {
    if (!activeUserId) return;
    const timer = window.setInterval(loadMessages, 5000);
    return () => window.clearInterval(timer);
  }, [activeUserId, loadMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const activePartner = conversations.find((c) => c.partner.id === activeUserId)?.partner;

  const conversationList = (
    <Paper sx={{ width: desktop ? 320 : '100%', minHeight: 520, overflow: 'hidden' }}>
      <Box sx={{ p: 2 }}><Typography variant="h6" fontWeight={700}>Messages</Typography></Box>
      <Divider />
      {loading ? (
        <Stack spacing={2} sx={{ p: 2 }}>
          {[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} variant="rounded" height={64} />)}
        </Stack>
      ) : error ? (
        <Box sx={{ p: 2 }}>
          <Alert severity="error" action={<Button onClick={loadConversations}>Retry</Button>}>{error}</Alert>
        </Box>
      ) : conversations.length === 0 ? (
        <Typography sx={{ p: 2 }} color="text.secondary">No active coordination threads.</Typography>
      ) : (
        conversations.map((c) => (
          <Box
            key={c.partner.id}
            onClick={() => setActiveUserId(c.partner.id)}
            sx={{
              p: 2, cursor: 'pointer',
              bgcolor: activeUserId === c.partner.id ? 'action.hover' : 'transparent',
              '&:hover': { bgcolor: 'action.hover' },
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Badge badgeContent={c.unreadCount} color="error">
                <Avatar>{c.partner.name?.[0] ?? '?'}</Avatar>
              </Badge>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography fontWeight={700} noWrap>{c.partner.name ?? 'User'}</Typography>
                <Typography variant="body2" color="text.secondary" noWrap>{c.lastMessage.text.slice(0, 50)}</Typography>
              </Box>
              <Typography variant="caption" color="text.secondary">{timeAgo(c.lastMessage.createdAt)}</Typography>
            </Stack>
          </Box>
        ))
      )}
    </Paper>
  );

  const messageThread = (
    <Paper sx={{ flex: 1, minHeight: 520, display: 'flex', flexDirection: 'column' }}>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ p: 2 }}>
        {!desktop && (
          <IconButton onClick={() => setActiveUserId(null)}><ArrowBackIcon /></IconButton>
        )}
        <Typography variant="h6" fontWeight={700}>{activePartner?.name ?? 'Conversation'}</Typography>
      </Stack>
      <Divider />
      <Box sx={{ flex: 1, p: 2, overflowY: 'auto' }}>
        {messagesLoading ? (
          <Stack spacing={2}>
            <Skeleton variant="rounded" height={52} width="60%" />
            <Skeleton variant="rounded" height={52} width="70%" sx={{ alignSelf: 'flex-end' }} />
            <Skeleton variant="rounded" height={52} width="55%" />
          </Stack>
        ) : messages.length === 0 ? (
          <Typography color="text.secondary">No messages yet. Begin coordinating supply logistics.</Typography>
        ) : (
          <Stack spacing={1.5}>
            {messages.map((msg) => {
              const mine = msg.senderId === currentUserId;
              return (
                <Box key={msg.id} sx={{ alignSelf: mine ? 'flex-end' : 'flex-start', maxWidth: '75%' }}>
                  <Box sx={{ px: 2, py: 1.25, borderRadius: 3, bgcolor: mine ? '#dcfce7' : '#f3f4f6', color: mine ? '#065f46' : 'text.primary' }}>
                    <Typography>{msg.text}</Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary">{timeAgo(msg.createdAt)}</Typography>
                </Box>
              );
            })}
            <div ref={bottomRef} />
          </Stack>
        )}
      </Box>
      <Divider />
      <Stack direction="row" spacing={1} sx={{ p: 2 }}>
        <TextField fullWidth multiline maxRows={3} placeholder="Write a message..." value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }} />
        <IconButton color="primary" disabled={!text.trim()} onClick={sendMessage}><SendIcon /></IconButton>
      </Stack>
    </Paper>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {desktop ? (
        <Stack direction="row" spacing={2}>
          {conversationList}
          {activeUserId ? messageThread : (
            <Paper sx={{ flex: 1, p: 4 }}><Typography color="text.secondary">Select a coordination thread.</Typography></Paper>
          )}
        </Stack>
      ) : activeUserId ? messageThread : conversationList}
    </Container>
  );
}
