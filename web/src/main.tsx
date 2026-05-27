import React, { useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import { CssBaseline } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { clusterApiUrl } from '@solana/web3.js';
import { PrivyProvider } from '@privy-io/react-auth';
import { App } from './app/App';

// Default styles that can be overridden by your app
import '@solana/wallet-adapter-react-ui/styles.css';

const queryClient = new QueryClient();

function Root() {
  /**
   * NETWORK RESILIENCE: 
   * Since Devnets are unstable, we use a prioritized list of RPCs.
   * 1. Your Quiknode Premium RPC (most reliable)
   * 2. Public Devnet (fallback)
   */
  const endpoint = useMemo(() => {
    const qn = import.meta.env.VITE_SOLANA_RPC_URL;
    return qn || clusterApiUrl('devnet');
  }, []);

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
    ],
    []
  );

  return (
    <React.StrictMode>
      {/* 
        INNOVATION: Privy allows for Email/Phone login for farmers 
        who don't have Phantom wallets yet.
      */}
      <PrivyProvider
        appId={import.meta.env.VITE_PRIVY_APP_ID || 'cmp000ywe01mm0cldpk8r2kt7'}
        config={{
          loginMethods: ['email', 'wallet'],
          appearance: {
            theme: 'light',
            accentColor: '#064e3b',
            logo: '/handshake.jpg',
            showWalletLoginFirst: false,
          },
          embeddedWallets: {
            createOnLogin: 'users-without-wallets',
            requireUserPasswordOnCreate: false,
          },
        }}
      >
        <ConnectionProvider endpoint={endpoint}>
          <WalletProvider wallets={wallets} autoConnect>
            <WalletModalProvider>
              <QueryClientProvider client={queryClient}>
                <CssBaseline />
                <App />
              </QueryClientProvider>
            </WalletModalProvider>
          </WalletProvider>
        </ConnectionProvider>
      </PrivyProvider>
    </React.StrictMode>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(<Root />);
