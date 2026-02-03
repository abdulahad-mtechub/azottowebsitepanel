// src/hooks/useWallet.js
import { useAccount, useConnect, useDisconnect } from "wagmi";

export default function useWallet() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isLoading, pendingConnector } = useConnect();
  const { disconnect } = useDisconnect();

  return {
    address,
    isConnected,
    connect,
    connectors,
    disconnect,
    isLoading,
    pendingConnector,
  };
}
