import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useContract } from "@/ContractContext/ContractContext";
import { useSelector } from "react-redux";
import useGetCropsByAgent from "@/hooks/useGetCropsByAgent"; // Adjust the path if needed
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"; // Ensure you have this Dialog component
import { Input } from "@/components/ui/input"; // Import input component for form fields
import { ethers } from "ethers"; // Import ethers for price conversion
import axios from "axios";

export default function AgentHomePage() {
  const { userId } = useSelector((store) => store.roles);
  const [agentAddress, setAgentAddress] = useState("");
  const { state } = useContract(); // Get contract and user details from context
  const contract = state.contract;
  

  useEffect(() => {
    try {
      const fetchUser = async () => {
        const res = await axios.get(
          `http://localhost:3000/api/v6/users/getUserById/${userId}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
        console.log(res.data.user);
        setAgentAddress(res.data.user.metamaskId);
      };

      fetchUser();
    } catch (error) {
      console.log("Error Getting User Details in client", error);
    }
  }, [userId]);

  const { roles } = useSelector((store) => store.roles);
  console.log(roles);

  // Fetch crops assigned to the agent
  const { crops, loading, error } = useGetCropsByAgent(agentAddress);
  console.log("crops:", crops);

  const verifiedCrops = crops.filter(
    (crop) => crop.isVerified && !crop.isSold && !crop.quality == ""
  );
  console.log("pedinig  rops :", verifiedCrops);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCropId, setSelectedCropId] = useState(null);
  const [quality, setQuality] = useState("");
  const [price, setPrice] = useState("");

  // State to track verification status
  const [isVerified, setIsVerified] = useState({});

  // Function to handle crop verification
  const handleVerifyCrop = async (cropId) => {
    try {
      // Verify the crop
      const tx = await contract.verifyCrop(cropId); // Initiates the transaction
      await tx.wait(); // Wait for the transaction to be confirmed

      // Set verification status to true for this crop
      setIsVerified((prev) => ({ ...prev, [cropId]: true }));

      // Set the crop ID for which quality and price will be added and open the dialog
      setSelectedCropId(cropId);
      setIsDialogOpen(true); // Open the dialog after verification
    } catch (error) {
      console.error("Error verifying crop:", error);
      // Optionally, show an alert or message to the user about the error
    }
  };

  return (
    <div className="container mx-auto p-8">
      {/* Agent Welcome Card */}
      <div className="my-10">
        <Card>
          <CardHeader>
            <CardTitle>Welcome, Agent!</CardTitle>
          </CardHeader>
          <CardContent>
            <p>As a local agent, your main responsibilities are:</p>
            <ul className="list-disc list-inside my-4">
              <li>Verify the crops provided by the company.</li>
              <li>
                Estimate the crop's price based on the current market
                conditions.
              </li>
              <li>Submit verified crops for final approval.</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Pending Crop Verifications Card */}
      <div className="my-10">
        <Card>
          <CardHeader>
            <CardTitle>Verified Crops</CardTitle>
          </CardHeader>
          <CardContent>
            {loading && <p className="text-center">Loading crops...</p>}{" "}
            {/* Loading state */}
            {error && (
              <p className="text-center text-red-500">{error.message}</p>
            )}{" "}
            {/* Error state */}
            {verifiedCrops.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Crop Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estimated Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {verifiedCrops.map(({ id, name, isVerified, price }) => (
                    <tr key={id}>
                      <td className="px-6 py-4 whitespace-nowrap">{name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {isVerified ? "Verified" : "Pending Verification"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {price ? `${price} ETH` : "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {!isVerified && (
                          <Button
                            variant="secondary"
                            className="bg-green-500 text-white"
                            onClick={() => handleVerifyCrop(id)}
                          >
                            Verify
                          </Button>
                        )}
                        {isVerified && (
                          <Button
                            variant="primary"
                            disabled={!price == ""}
                            className={`bg-blue-500 text-white  `}
                            onClick={() => {
                              setSelectedCropId(id);
                              setIsDialogOpen(true);
                            }}
                          >
                            {price == "" ? "Add Details" : "Verified"}
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-center">No crops verification yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
