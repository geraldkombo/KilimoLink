/**
 * Solana Integration Service
 * Grounded in 'institutional-intelligence' and 'security-best-practices'.
 * Optimized for high-integrity connection and liquidity oversight.
 */

class SolanaService {
  private rpcUrl: string;

  constructor() {
    // Defaulting to standard Mainnet Beta or public fallback
    this.rpcUrl = import.meta.env.VITE_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';
  }

  /**
   * Solana Priority Fee API (Quicknode Add-on)
   * Method: qn_estimatePriorityFees
   * Essential for ensuring connection and transactions land during high network activity.
   */
  async getPriorityFee() {
    try {
      const response = await fetch(this.rpcUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'qn_estimatePriorityFees',
          params: {
            "last_n_blocks": 100,
            "account": "JUP6LkbZbjS1jKKccwgwsS16v4Ff1L5B27n8f4S5H5H", // Example: Jupiter
            "api_version": 2
          }
        })
      });
      const data = await response.json();
      // Returns the 'medium' or 'high' estimate from recent blocks
      return data.result?.per_compute_unit?.medium || 1000;
    } catch (e) {
      console.warn('Priority Fee API fallback active.');
      return 5000;
    }
  }

  /**
   * Multi-Chain Stablecoin Balance API (Quicknode Add-on)
   * Method: getStablecoinBalances
   * Tracks USDC/USDT across 10+ networks to manage farmer liquidity.
   */
  async getStablecoinBalances(address: string) {
    try {
      const response = await fetch(this.rpcUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'getStablecoinBalances',
          params: {
            wallet: address,
            // Filtering for top stablecoins as per 'Institutional Intelligence'
            filter: {
              symbols: ["USDC", "USDT", "DAI"]
            }
          }
        })
      });
      const data = await response.json();
      return data.result || [];
    } catch (e) {
      console.error('Failed to fetch Multi-Chain balances', e);
      return [];
    }
  }
}

export const solanaService = new SolanaService();
