import { useState, useEffect, useRef } from 'react';
import { useSignMessage, useChainId } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { toast } from "react-toastify";
import useWallet from './useWallet';
import { useChainSwitch } from './useChainSwitch';

const REQUIRED_CHAIN_ID = sepolia.id;

export const useWalletAuth = () => {
    const { address, isConnected, connect, connectors, disconnect } = useWallet();
    const [isSigningInProgress, setIsSigningInProgress] = useState(false);
    const [shouldInitiateSigningAfterConnect, setShouldInitiateSigningAfterConnect] = useState(false);
    const [signedData, setSignedData] = useState(null);
    const [isMobile, setIsMobile] = useState(false);
    const [logedIn, setLogedIn] = useState(true);
    const [isAutoSwitching, setIsAutoSwitching] = useState(false);
    const ApiUrl= '';
    const previousAddressRef = useRef(null);
    const lastProcessedSignatureRef = useRef(null); // Track last processed signature

    const chainId = useChainId();
    const { switchToChain } = useChainSwitch();

    const { signMessage, isPending: isSignPending, error: signError, data: signatureData, reset: resetSignature } = useSignMessage();

    // Helper function to clean up signing state
    const cleanupSigningState = () => {
        setIsSigningInProgress(false);
        setShouldInitiateSigningAfterConnect(false);
        setSignedData(null);
        lastProcessedSignatureRef.current = null; // Reset processed signature tracker

        // Reset wagmi's signature data
        if (resetSignature) {
            resetSignature();
        }
    };

    const isUserLoggedIn = () => {
        return !!(localStorage.getItem('accessToken') || localStorage.getItem('refreshToken'));
    };

    useEffect(() => {
        const checkMobile = /Mobi|Android/i.test(navigator.userAgent);
        setIsMobile(checkMobile);
    }, []);

    // Detect wallet account switch
    useEffect(() => {
        if (address && previousAddressRef.current) {
            if (previousAddressRef.current.toLowerCase() !== address.toLowerCase()) {
                if (isUserLoggedIn()) {
                    toast.info("Wallet account changed. Please login again.");
                    handleWalletDisconnect();
                }
                // Clean up stale signature data when address changes
                cleanupSigningState();
            }
        }

        if (address) {
            previousAddressRef.current = address;
        }
    }, [address]);

    // Watch for signing error
    useEffect(() => {
        if (signError && isSigningInProgress) {
            cleanupSigningState();
            disconnect();
        }
    }, [signError, isSigningInProgress]);

    // Watch for signature data - with stale data prevention
    useEffect(() => {
        if (signatureData && !isSignPending && !signError && isSigningInProgress) {
            // Only process if we haven't processed this signature before and we're actively signing
            if (lastProcessedSignatureRef.current !== signatureData) {
                lastProcessedSignatureRef.current = signatureData;
                setSignedData({ address, signature: signatureData });
            }
        }
    }, [signatureData, isSignPending, signError, address, isSigningInProgress]);

    // Auto-switch chain if user is on wrong network
    useEffect(() => {
        const autoSwitchChain = async () => {
            if (isConnected && address && chainId !== REQUIRED_CHAIN_ID && !isAutoSwitching) {
                setIsAutoSwitching(true);
                try {
                    await switchToChain(REQUIRED_CHAIN_ID);
                    setIsAutoSwitching(false);
                } catch (error) {
                    console.error("Auto chain switch error:", error);
                    setIsAutoSwitching(false);
                    cleanupSigningState();
                    disconnect();
                }
            }
        };

        autoSwitchChain();
    }, [isConnected, address, chainId, isAutoSwitching]);

    // Watch for wallet connection and correct chain
    useEffect(() => {
        if (isConnected && address && shouldInitiateSigningAfterConnect && chainId === REQUIRED_CHAIN_ID && !isAutoSwitching) {
            setShouldInitiateSigningAfterConnect(false);
            initiateSigningProcess();
        }
    }, [isConnected, address, shouldInitiateSigningAfterConnect, chainId, isAutoSwitching]);

    // Watch for signed data to call API
    useEffect(() => {
        if (signedData && signedData.address && signedData.signature) {
            handleLoginAPI(signedData.address, signedData.signature);
            setSignedData(null);
        }
    }, [signedData]);

    // Timeout for signing process
    useEffect(() => {
        let timeout;
        if (isSigningInProgress) {
            timeout = setTimeout(() => {
                toast.error("Signing process timed out. Please try again.");
                cleanupSigningState();
                disconnect();
            }, 30000);
        }

        return () => {
            if (timeout) {
                clearTimeout(timeout);
            }
        };
    }, [isSigningInProgress]);

    // Monitor signing cancellation
    useEffect(() => {
        if (!isSignPending && isSigningInProgress && !signatureData && !signError) {
            setTimeout(() => {
                if (!signatureData && isSigningInProgress) {
                    toast.error("Signing was cancelled or failed");
                    cleanupSigningState();
                    disconnect();
                }
            }, 1000);
        }
    }, [isSignPending, isSigningInProgress, signatureData, signError]);
    console.log(isConnected,address,"isConnected");
    const handleWalletConnect = async (connector) => {
        try {
            toast.dismiss();
            cleanupSigningState(); // Clean up before connecting
            setShouldInitiateSigningAfterConnect(true);
            await connect({ connector });
        } catch (error) {
            toast.error("Failed to connect wallet");
            cleanupSigningState();
        }
    };

    const initiateSigningProcess = () => {
        try {
            if (!address) {
                throw new Error("Wallet address not available");
            }

            if (!isConnected) {
                throw new Error("Wallet not connected");
            }

            if (chainId !== REQUIRED_CHAIN_ID) {
                throw new Error("Please switch to Sepolia network");
            }

            const message = `${address?.toLocaleLowerCase()}weareUniform`;
            setIsSigningInProgress(true);

            signMessage({ message });

        } catch (error) {
            toast.error(error.message || "Failed to start signing process");
            cleanupSigningState();
            disconnect();
        }
    };

    const handleLoginAPI = async (walletAddress, signature) => {
        try {
            if (!walletAddress || !signature) {
                throw new Error("Missing required authentication data");
            }

            const payload = {
                walletAddress: walletAddress?.toLocaleLowerCase(),
                sign: signature
            };

            const response = await fetch(`${ApiUrl}/auth/users/signup-signin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || `API Error: ${response.status}`);
            }

            setLogedIn(data.data);

            if (data.data?.accessToken) {
                localStorage.setItem('accessToken', data.data.accessToken);
            }
            if (data.data?.refreshToken) {
                localStorage.setItem('refreshToken', data.data.refreshToken);
            }

            cleanupSigningState();
            toast.dismiss();

        } catch (error) {
            toast.error(error.message || 'Authentication failed');
            cleanupSigningState();
            disconnect();
        }
    };

    const handleWalletDisconnect = () => {
        cleanupSigningState(); // Clean up before disconnecting
        disconnect();
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        previousAddressRef.current = null;
        toast.dismiss();
    };

    return {
        isConnected,
        isSigningInProgress,
        isSignPending,
        isMobile,
        connectors,
        logedIn,
        chainId,
        isAutoSwitching,
        connect,
        handleWalletConnect,
        handleWalletDisconnect,
        switchToChain
    };
};