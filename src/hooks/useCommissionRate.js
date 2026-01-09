import { useQuery } from "@apollo/client";
import { GET_SETTING } from "../graphql/query";

/**
 * Hook to fetch and provide commission rate from backend settings
 * @returns {Object} { commissionRate: number (0.04 = 4%), loading: boolean, error: any }
 */
export const useCommissionRate = () => {
  const { data, loading, error } = useQuery(GET_SETTING, {
    fetchPolicy: "cache-first",
  });

  let commissionRate = data?.getSetting?.commissionRate || 0.06; // Default to 6% if not set

  // If commission rate is greater than 1, treat it as percentage (e.g., 5 means 5%)
  // and convert to decimal (e.g., 5 -> 0.05)
  if (commissionRate > 1) {
    commissionRate = commissionRate / 100;
  }

  return {
    commissionRate,
    loading,
    error,
  };
};
