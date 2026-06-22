# KilimoLink Direct — Chat & Messaging

## Context
NestJS + Prisma + PostgreSQL at `kilimolink/backend/`. React 19 + Vite + MUI v6 at `kilimolink/web/`. Auth (JWT) and reviews already implemented. Build: `npm run build && npm test` (web), `npx jest --passWithNoTests` (backend).

## Prisma (`prisma/schema.prisma`)
Add Message model:
```prisma
model Message {
  id         String   @id @default(cuid())
  senderId   String
  sender     User     @relation("SentMessages", fields: [senderId], references: [id])
  receiverId String
  receiver   User     @relation("ReceivedMessages", fields: [receiverId], references: [id])
  orderId    String?
  order      Order?   @relation(fields: [orderId], references: [id])
  text       String
  readAt     DateTime?
  createdAt  DateTime @default(now())
}
```
Add to User model:
```
  sentMessages     Message[] @relation("SentMessages")
  receivedMessages Message[] @relation("ReceivedMessages")
```
Run: `npx prisma migrate dev --name add_messages && npx prisma generate`

## Backend: New `chat/` module (`backend/src/chat/`)
Create 4 files:

**dto/create-message.dto.ts**: `receiverId` (string), `text` (string), `orderId?` (optional string). class-validator.

**chat.service.ts**: Inject PrismaService.
- `createMessage(senderId, dto)`: Create message with senderId, receiverId, text, orderId. Return created message with sender/receiver names included.
- `getConversations(userId)`: Find all messages where senderId=userId OR receiverId=userId. Group in code by partner (the user who is NOT userId). For each partner return: `{ partner: { id, name }, lastMessage: { text, createdAt }, unreadCount: count of messages where receiverId=userId AND readAt IS NULL }`.
- `getThread(userId, otherUserId)`: FindMany where (senderId=userId AND receiverId=otherUserId) OR (senderId=otherUserId AND receiverId=userId). OrderBy createdAt ASC. For messages where receiverId=userId AND readAt IS NULL: updateMany set readAt=now(). Return messages with sender/receiver.
- `markRead(messageId, userId)`: Update message where id=messageId AND receiverId=userId, set readAt=now().

**chat.controller.ts**:
- `POST /chat/messages` — @UseGuards(AuthGuard). @Body dto: CreateMessageDto. @Req req.
- `GET /chat/conversations` — JWT. Return conversations for req.user.id.
- `GET /chat/messages/:userId` — JWT. Return thread between req.user.id and :userId.
- `PATCH /chat/messages/:id/read` — JWT. Mark message read.

**chat.module.ts**: Standard module, import PrismaModule.

## Frontend: New Chat.tsx (`web/src/pages/Chat.tsx`)

```typescript
import { useState, useEffect, useCallback } from 'react';
import { Box, Container, Typography, TextField, IconButton, Stack, Paper, Avatar, Badge, Skeleton, Alert, Button, Divider } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
```

**Logic**:
- State: conversations[], messages[], activeUserId (string|null, init from ?userId= search param), text, loading, messagesLoading, error
- On mount: fetch GET /chat/conversations
- When activeUserId changes: fetch GET /chat/messages/{activeUserId}
- Poll every 5s when activeUserId is set: refetch messages
- sendMessage(): POST /chat/messages {receiverId: activeUserId, text}, clear input, refetch messages+conversations

**Layout**:
- Desktop (>=900px): flex row. Left panel 320px: conversations list. Right panel flex: message thread.
- Mobile (<900px): show conversations list by default. When conversation tapped, show message thread with back button.

**Left panel** (conversations):
- Loading: 5 Skeleton items. Empty: "No conversations yet." Error: Alert+retry.
- Each item: Avatar (first letter of name), name (bold), last message preview (50 chars), time ago, unread Badge

**Right panel** (messages):
- Loading: 3 Skeleton bubbles. Empty: "Send a message to start chatting."
- Message bubbles: sender → right-aligned, bg #dcfce7, color #065f46. receiver → left-aligned, bg #f3f4f6.
- Each bubble: text, timestamp below (small, gray)
- Input bar at bottom: TextField (full width, multiline? max 3 rows) + Send IconButton
- Auto-scroll to bottom when new messages arrive

## Frontend: App.tsx — Add route
Add: `const Chat = lazy(() => import('../pages/Chat').then(m=>({default:m.Chat})));`
Add route: `<Route path="/chat" element={<Chat />} />`
Add "Messages" link in desktop navbar and mobile drawer pointing to /chat.

## Frontend: OrdersPage.tsx — Message button per order
In the table row, add an IconButton column with ChatIcon. On click: navigate(`/chat?userId=${order.items[0]?.product?.farmer?.id}`). Only show if farmer.id exists.

## Frontend: ProductDetail.tsx — Message Seller button
After farmer info box, add: `<Button variant="outlined" startIcon={<ChatIcon/>} onClick={()=>navigate('/chat?userId='+product.farmer?.id)}>Message Seller</Button>` (only if farmer.id exists and user authenticated).

## Tests: New `test/chat.e2e-spec.ts`
Standard pattern (Test.createTestingModule, overridePrisma+Redis, prefix api/v1).
Create buyer and farmer users. Test:
- `POST /chat/messages` (buyer→farmer) → 201 with text
- `GET /chat/conversations` (farmer) → 200, array with 1 conversation, unreadCount=1, partner.id=buyerId
- `GET /chat/messages/:buyerId` (farmer) → 200, messages array, message.readAt is truthy
- `PATCH /chat/messages/:id/read` → 200

## Critical
- Do NOT break demo mode
- Every endpoint needs E2E tests
- Loading/empty/error states on frontend
- MUI v6 only
- Build: `cd kilimolink/web && npm run build && npm test`
- Backend tests: `cd kilimolink/backend && npx jest --passWithNoTests`
