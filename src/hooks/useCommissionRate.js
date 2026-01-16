import { useQuery } from "@apollo/client";
import { GET_SETTING } from "../graphql/query";

export const useCommissionRate = () => {
  const { data, loading, error } = useQuery(GET_SETTING, {
    fetchPolicy: "cache-first",
  });

  let commissionRate = data?.getSetting?.commissionRate;
  if (commissionRate > 1) {
    commissionRate = commissionRate / 100;
  }

  return {
    commissionRate,
    loading,
    error,
  };
};
