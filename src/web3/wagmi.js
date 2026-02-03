import { createPublicClient } from 'viem';
import { http, createConfig } from 'wagmi';
import { bsc, base, arbitrum, polygon, avalanche, mainnet, sepolia } from 'wagmi/chains';
import { injected, walletConnect, coinbaseWallet } from 'wagmi/connectors';
const projectId = import.meta.env.VITE_PROJECT_ID;
const RPC = import.meta.env.VITE_CHIAIN_RPC;
// RPC URLs
const RPC_URLS = {
  [sepolia.id]: RPC,
  // [mainnet.id]: 'https://small-dimensional-film.quiknode.pro/31e2264f698374f541aed3673b0e3d0a1c6d4546',
  // [bsc.id]: 'https://bnb-mainnet.g.alchemy.com/v2/m1ZDZF0NDLbqkK-we12g0',
  // [base.id]: 'https://base-mainnet.g.alchemy.com/v2/m1ZDZF0NDLbqkK-we12g0',
  // [arbitrum.id]: 'https://arb-mainnet.g.alchemy.com/v2/m1ZDZF0NDLbqkK-we12g0',
  // [polygon.id]: 'https://black-patient-meme.matic.quiknode.pro/3bbb1518110a425966df2894ac6aa42f3b4ff2ef',
  // [avalanche.id]:
  //   'https://quiet-small-shard.avalanche-mainnet.quiknode.pro/e0c27c7b19c13d46021fa67454808a8b0dc279a5/ext/bc/C/rpc',
};

// Supported chains
export const supportedChains =[sepolia]  //[mainnet, bsc, base, arbitrum, polygon, avalanche];

// WalletConnect Project ID
// const projectId = process.env.VITE_PROJECT_ID;
  console.log('Project ID:', projectId);
if (!projectId) {
  console.warn('WalletConnect Project ID is missing! Get one from https://cloud.walletconnect.com');
}

// Wagmi configuration
export const config = createConfig({
  chains: supportedChains,
  connectors: [
    // ✅ MetaMask (via injected)
    injected({
      target: 'metaMask',
    }),

    // ✅ Coinbase Wallet
    // coinbaseWallet({
    //   appName: 'Unifarm', // shows inside Coinbase app
    // }),

    // ✅ WalletConnect
    ...(projectId
      ? [
          walletConnect({
            projectId,
            metadata: {
              name: 'Unifarm',
              description: 'Unifarm Staking',
              url: typeof window !== 'undefined' ? window.location.origin : 'https://example.com',
              icons: ['https://example.com/icon.png'],
            },
            showQrModal: true,
            qrModalOptions: {
              themeMode: 'light',
              themeVariables: {
                '--wcm-z-index': '1000',
              },
            },
          }),
        ]
      : []),
  ],

  // RPC transports (can use free `http()` fallback or your paid URLs)
  transports: {
    [sepolia.id]: http(RPC_URLS[sepolia.id]),
    // [bsc.id]: http(RPC_URLS[bsc.id]),
    // [base.id]: http(RPC_URLS[base.id]),
    // [arbitrum.id]: http(RPC_URLS[arbitrum.id]),
    // [polygon.id]: http(RPC_URLS[polygon.id]),
    // [avalanche.id]: http(RPC_URLS[avalanche.id]),
    // [mainnet.id]: http(RPC_URLS[mainnet.id]),
  },
  ssr: true,
});

// Public Clients (optional helper)
export const publicClients = supportedChains.reduce((acc, chain) => {
  acc[chain.id] = createPublicClient({
    chain,
    transport: http(RPC_URLS[chain.id]),
  });
  return acc;
}, {});
