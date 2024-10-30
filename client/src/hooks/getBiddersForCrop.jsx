import { useState, useEffect } from "react";
import { useContract } from "@/ContractContext/ContractContext"; // Adjust this import based on your structure

const useGetBiddersForCrop = (cropId) => {
  const [biddersData, setBiddersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { state } = useContract(); // Make sure this is the right context hook for your contract
  const contract = state.contract;

  useEffect(() => {
    const fetchBidders = async () => {
      if (!contract || !cropId) return;

      setLoading(true);
      setError(null);

      try {
        const [biddersList, bidsList] = await contract.getBiddersForCrop(cropId);
        
        // Create an array of objects combining bidders and their corresponding bids
        const combinedBiddersData = biddersList?.map((bidder, index) => ({
          address: bidder,
          bidAmount: bidsList[index], // Corresponding bid amount
        }));

        setBiddersData(combinedBiddersData);
      } catch (err) {
        console.error("Error fetching bidders:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBidders();
  }, [contract, cropId]);

  return { biddersData, loading, error };
};

export default useGetBiddersForCrop;

