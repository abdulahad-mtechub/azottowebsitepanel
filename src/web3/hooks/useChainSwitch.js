import { toast } from 'react-toastify';
import { useSwitchChain, useAccount } from 'wagmi';
import { sepolia } from 'wagmi/chains';

export const useChainSwitch = () => {
    const { switchChainAsync } = useSwitchChain();
    const { chain } = useAccount();

    const switchToChain = async (targetChainId = sepolia.id) => {
        // Check if already on target chain
        if (chain?.id === targetChainId) {
            return;
        }

        try {
            // Use switchChainAsync and wait for it to complete
            await switchChainAsync({ chainId: targetChainId });

            // Additional wait to ensure chain is fully switched
            await new Promise(resolve => setTimeout(resolve, 500));

            // console.log('Chain switched successfully!');
        } catch (error) {
            if (error.code === 4001 || error.message.includes('User rejected')) {
                toast.error('You rejected the chain switch request');
            } else {
                toast.error('Failed to switch chain. Please try again.');
            }
            console.error('Chain switch error:', error);

            // Re-throw error to stop execution in parent component
            throw error;
        }
    };

    return { switchToChain };
};

// Usage in parent component:
// import { useChainSwitch } from './hooks/useChainSwitch';
// 
// function ParentComponent() {
//   const { switchToChain } = useChainSwitch();
//   
//   const handleStake = async () => {
//     try {
//       setLoader(true);
//       
//       // Just call it - no need to check return value
//       await switchToChain();
//       
//       // If user rejects, code won't reach here
//       // Continue with staking logic
//       // console.log('Proceed with staking...');
//       
//     } catch (e) {
//       // Automatically handled if user rejects
//       console.error('Error:', e);
//     } finally {
//       setLoader(false);
//     }
//   };
//   
//   return <button onClick={handleStake}>Stake</button>;
// }