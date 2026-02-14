import { PrivyProvider } from '@privy-io/react-auth';

export function PrivyCustomProvider({ children }) {
   

    return (
        <PrivyProvider
            appId="cmldgi1ou00f0l80da5puru4d"
            // clientId="your-app-client-id"
            config={{
                // Create embedded wallets for users who don't have a wallet
                embeddedWallets: {
                    ethereum: {
                        createOnLogin: 'users-without-wallets'
                    }
                }
            }}
        >
            {children}
        </PrivyProvider>
    )
}