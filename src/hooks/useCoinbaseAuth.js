import { useState, useEffect } from 'react';
import { CoinbaseWalletSDK } from '@coinbase/wallet-sdk';

/**
 * Custom hook for Coinbase Wallet authentication
 * @param {Object} config - Configuration object
 * @param {string} config.appName - Your application name
 * @param {string} config.appLogoUrl - Your application logo URL
 * @param {boolean} config.darkMode - Enable dark mode
 * @returns {Object} Hook state and methods
 */
export const useCoinbaseAuth = (config = {}) => {
    const [walletAddress, setWalletAddress] = useState('');
    const [signature, setSignature] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Initialize Coinbase Wallet SDK
    const coinbaseWallet = new CoinbaseWalletSDK({
        appName: config.appName || 'My App',
        appLogoUrl: config.appLogoUrl || '',
        darkMode: config.darkMode || false,
    });

    const ethereum = coinbaseWallet.makeWeb3Provider();

    // Check if wallet is already connected on mount
    useEffect(() => {
        checkConnection();
    }, []);

    const checkConnection = async () => {
        try {
            const accounts = await ethereum.request({ method: 'eth_accounts' });
            if (accounts.length > 0) {
                setWalletAddress(accounts[0]);
                setIsConnected(true);
            }
        } catch (err) {
            console.error('Error checking connection:', err);
        }
    };

    /**
     * Connect wallet and sign authentication message
     * @param {string} email - User's email address
     * @returns {Promise<Object>} Authentication data
     */
    const signIn = async (email) => {
        setIsLoading(true);
        setError('');

        try {
            // Connect wallet
            const accounts = await ethereum.request({
                method: 'eth_requestAccounts',
            });

            const address = accounts[0];
            setWalletAddress(address);

            // Create message to sign
            const timestamp = new Date().toISOString();
            const message = `Sign this message to authenticate with your wallet.\n\nEmail: ${email}\nAddress: ${address}\nTimestamp: ${timestamp}`;

            // Get signature
            const userSignature = await ethereum.request({
                method: 'personal_sign',
                params: [message, address],
            });

            setSignature(userSignature);
            setIsConnected(true);
            setIsLoading(false);

            // Return data to send to backend
            return {
                email,
                address,
                signature: userSignature,
                message,
                timestamp,
            };
        } catch (err) {
            console.error('Sign in error:', err);
            const errorMessage = err.message || 'Failed to connect wallet';
            setError(errorMessage);
            setIsLoading(false);
            throw new Error(errorMessage);
        }
    };

    /**
     * Disconnect wallet and clear state
     */
    const disconnect = () => {
        setWalletAddress('');
        setSignature('');
        setIsConnected(false);
        setError('');
        localStorage.removeItem('authToken');
        ethereum.disconnect();
    };

    /**
     * Get account balance
     * @returns {Promise<string>} Balance in ETH
     */
    const getBalance = async () => {
        if (!walletAddress) return '0';

        try {
            const balance = await ethereum.request({
                method: 'eth_getBalance',
                params: [walletAddress, 'latest'],
            });

            // Convert from wei to ETH
            const ethBalance = parseInt(balance, 16) / 1e18;
            return ethBalance.toFixed(4);
        } catch (err) {
            console.error('Error getting balance:', err);
            return '0';
        }
    };

    /**
     * Get current network/chain ID
     * @returns {Promise<string>} Chain ID
     */
    const getChainId = async () => {
        try {
            const chainId = await ethereum.request({ method: 'eth_chainId' });
            return parseInt(chainId, 16);
        } catch (err) {
            console.error('Error getting chain ID:', err);
            return null;
        }
    };

    /**
     * Switch to a different network
     * @param {string} chainId - Chain ID in hex format
     */
    const switchNetwork = async (chainId) => {
        try {
            await ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId }],
            });
        } catch (err) {
            console.error('Error switching network:', err);
            throw err;
        }
    };

    return {
        // State
        walletAddress,
        signature,
        isConnected,
        isLoading,
        error,

        // Methods
        signIn,
        disconnect,
        getBalance,
        getChainId,
        switchNetwork,

        // Provider
        ethereum,
    };
};

export default useCoinbaseAuth;