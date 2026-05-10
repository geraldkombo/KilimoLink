import {
  Connection,
  Keypair,
  Transaction,
  sendAndConfirmTransaction,
} from '@solana/web3.js';
import * as multisig from '@sqds/multisig';
import bs58 from 'bs58';

async function deploySquad() {
  // 1. CONFIGURATION
  const RPC_URL = 'https://cool-sparkling-putty.solana-devnet.quiknode.pro/193e15a0bf88b4b6cb225aed43ff6c92b221fd42';
  const connection = new Connection(RPC_URL, 'confirmed');

  // PASTE YOUR SECRET PRIVATE KEY HERE (NOT your wallet address)
  const PRIVATE_KEY = 'PASTE_YOUR_SECRET_PRIVATE_KEY_HERE';
  
  if (PRIVATE_KEY === 'PASTE_YOUR_SECRET_PRIVATE_KEY_HERE') {
    throw new Error('Please paste your Phantom PRIVATE KEY (the secret one) into line 16.');
  }

  const creator = Keypair.fromSecretKey(bs58.decode(PRIVATE_KEY));
  console.log('Using Wallet Address:', creator.publicKey.toBase58());

  // 2. GENERATE SQUAD SEEDS
  const createKey = Keypair.generate();
  const [multisigPda] = multisig.getMultisigPda({
    createKey: createKey.publicKey,
  });

  console.log('Deploying KilimoLink Nairobi Council...');

  // 3. CREATE SQUAD
  const signature = await multisig.instructions.multisigCreate({
    createKey: createKey.publicKey,
    creator: creator.publicKey,
    multisigPda,
    configAuthority: null,
    threshold: 1,
    members: [{
      key: creator.publicKey,
      permissions: {
        mask: 1 | 2 | 4 // Initiate | Vote | Execute
      },
    }],
    timeLock: 0,
    memo: 'KilimoLink Nairobi Council',
  });

  const tx = new Transaction().add(signature);
  const txHash = await sendAndConfirmTransaction(connection, tx, [creator, createKey]);

  console.log('--- DEPLOYMENT SUCCESSFUL ---');
  console.log('Transaction Hash:', txHash);
  console.log('Your Multisig Address:', multisigPda.toBase58());
  console.log('View on Explorer:', `https://explorer.solana.com/address/${multisigPda.toBase58()}?cluster=devnet`);
}

deploySquad().catch(console.error);
