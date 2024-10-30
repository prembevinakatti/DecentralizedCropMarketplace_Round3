import { useEffect, useState } from "react";
import { ethers } from "ethers"; // Make sure to import ethers if you're using it
import { useContract } from "@/ContractContext/ContractContext"; // Adjust the path as necessary

const useGetCropsByAgent = (agentAddress) => {
  const { state } = useContract(); // Get the contract state from context
  const [crops, setCrops] = useState([]); // State to store crops
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const fetchCrops = async () => {
      if (!state.contract || !agentAddress) return; // Ensure contract and agent address are available

      setLoading(true); // Set loading to true at the start
      

      try {
        // Call the getCropsByAgent function from the contract
        const cropsList = await state.contract.getCropsByAgent(agentAddress);

        // Map the received tuples to a more usable format
        const formattedCrops = cropsList.map(({ id, crop }) => ({
          id: id.toString(), // Crop ID
          name: crop.name, // Name
          image: crop.image, // Image URL or path
          quality: crop.quality, // Quality
          harvestDate: crop.harvestDate, // Harvest date
          quantity: crop.quantity.toString(), // Quantity as string
          price: ethers.formatEther(crop.price), // Price formatted to ETH
          isVerified: crop.isVerified, // Verification status
          isSold: crop.isSold, // Sold status
          buyer: crop.buyer, // Buyer address
          assignedAgent: crop.assignedAgent, // Assigned agent
        }));

        console.log("Fetched crops:", formattedCrops); // Debug log to check fetched data

        setCrops(formattedCrops); // Set the crops state
      } catch (err) {
        setError(err); // Set error state if an error occurs
        console.error("Error fetching crops:", err);
      } finally {
        setLoading(false); // Set loading to false once fetching is done
      }
    };

    fetchCrops();
  }, [agentAddress, state.contract]); // Fetch crops when agentAddress or contract changes

  return { crops, loading, error }; // Return the crops, loading status, and any errors
};

export default useGetCropsByAgent;
