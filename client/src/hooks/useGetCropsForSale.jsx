import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useContract } from "@/ContractContext/ContractContext";

const useGetCropsForSale = () => {
  const [cropsForSale, setCropsForSale] = useState([]);
  const [loading, setLoading] = useState(true);
  const { state } = useContract();
  const contract = state.contract;

  useEffect(() => {
    const fetchCrops = async () => {
      if (!contract) return;

      setLoading(true);
      try {
        const crops = await contract.getCropsForSale();
        const formattedCrops = crops.map((cropWithID) => ({
          id: cropWithID.id.toString(),
          name: cropWithID.crop.name,
          price: ethers.formatEther(cropWithID.crop.price),
          quantity: cropWithID.crop.quantity.toString(),
          quality: cropWithID.crop.quality,
          seller: cropWithID.crop.seller,
          isVerified: cropWithID.crop.isVerified,
          isSold: cropWithID.crop.isSold,
        }));
        setCropsForSale(formattedCrops);
      } catch (error) {
        console.error("Error fetching crops for sale:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCrops();
  }, [contract]);

  
  return { crops: cropsForSale, loading };
};

export default useGetCropsForSale;
