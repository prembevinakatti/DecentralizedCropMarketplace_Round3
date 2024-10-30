import { useContract } from "@/ContractContext/ContractContext";
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";

const useGetAllCrops = () => {
  const { state } = useContract();
  const contract = state.contract;
  const [fetchedCrops, setCrops] = useState([]);

  useEffect(() => {
    const fetchCrops = async () => {
      try {
        const cropCount = await contract.cropCount();
        const fetchedCrops = [];
        

        for (let i = 1; i <= cropCount; i++) {
          const crop = await contract.getCropDetails(i);
          fetchedCrops.push({
            id: i,
            name: crop.name,
            image: crop.image, // Image URL or base64
            quality: crop.quality,
            harvestDate: crop.harvestDate,
            quantity: crop.quantity.toString(),
            price: ethers.formatEther(crop.price), // Convert price to Ether
            seller: crop.seller,
            isVerified: crop.isVerified,
            isSold: crop.isSold,
            buyer: crop.buyer,
            assignedAgent: crop.assignedAgent, // Agent who verified the crop
            status: crop.isSold
              ? "sold"
              : crop.isVerified
              ? "approved"
              : "pending",
          });
        }

        setCrops(fetchedCrops);
      } catch (error) {
        console.error("Error fetching crops:", error);
      }
    };

    if (contract) {
      fetchCrops();
    }
  }, [contract]);

  return fetchedCrops;
};

export default useGetAllCrops;
