import { useState, useEffect } from "react";
import { useContract } from "@/ContractContext/ContractContext";
import { ethers } from "ethers";

const useGetCropsForAuction = () => {
  const { state } = useContract();
  const contract = state.contract;
  const [auctionCrops, setAuctionCrops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCropsForAuction = async () => {
      if (!contract) return;

      setLoading(true);
      try {
        const crops = await contract.getCropsForAuction();
        const formattedCrops = crops.map((crop) => ({
          id: crop.id.toString(),
          name: crop.crop.name,
          price: ethers.formatEther(crop.crop.price),
          quantity: crop.crop.quantity.toString(),
          quality: crop.crop.quality,
          seller: crop.crop.seller,
          isSold: crop.crop.isSold,
          location: crop.crop.location,
        }));
        setAuctionCrops(formattedCrops);
      } catch (error) {
        console.error("Error fetching auction crops:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCropsForAuction();
  }, [contract]);

  return { crops: auctionCrops, loading };
};


export default useGetCropsForAuction;