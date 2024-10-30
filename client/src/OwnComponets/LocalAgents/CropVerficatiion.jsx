// CropVerification.js
import Loader from "@/components/Loader/Loader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useContract } from "@/ContractContext/ContractContext";
import useGetCropsByAgent from "@/hooks/useGetCropsByAgent";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ethers } from "ethers";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import useSocket from "../utils/Sockt";
import MarketPriceModal from "./Marketpricepage";

export default function CropVerification() {
  const { state } = useContract();
  const { userId } = useSelector((store) => store.roles);
  const [agentAddress, setAgentAddress] = useState("");
  const [isMarketPriceModalOpen, setIsMarketPriceModalOpen] = useState(false);
  const [conversionRate, setConversionRate] = useState(null);

  // States for INR input and converted ETH price
  const [inrPrice, setInrPrice] = useState("");
  const [convertedEthPrice, setConvertedEthPrice] = useState("");

  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/v6/users/getUserById/${userId}`,
          { headers: { "Content-Type": "application/json" }, withCredentials: true }
        );
        setAgentAddress(res.data.user.metamaskId);
      } catch (error) {
        console.log("Error Getting User Details in client", error);
      }
    };

    fetchUser();
    fetchETHtoINRRate(); // Fetch conversion rate on load
  }, [userId]);

  const fetchETHtoINRRate = async () => {
    try {
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=inr`
      );
      setConversionRate(response.data.ethereum.inr);
    } catch (error) {
      console.error("Error fetching conversion rate:", error);
      setConversionRate(null); // Set to null if fetching fails
    }
  };

  // Function to convert INR to ETH
  const convertINRtoETH = (inrPrice) => {
    if (conversionRate && inrPrice) {
      const ethAmount = (inrPrice / conversionRate).toFixed(6); // Keep 6 decimal places
      setConvertedEthPrice(ethAmount); // Set the converted ETH value
    } else {
      setConvertedEthPrice("");
    }
  };

  const contract = state.contract;
  const navigate = useNavigate();
  const socket = useSocket();
  const { crops, loading, error } = useGetCropsByAgent(agentAddress);
  const pendingCrops = crops.filter((crop) => crop.quality === "");

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCropId, setSelectedCropId] = useState(null);
  const [quality, setQuality] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [transactionLoading, setTransactionLoading] = useState(false);

  const handleVerifyCrop = async (cropId, seller) => {
    console.log(seller)
    try {
      setTransactionLoading(true);
      const tx = await contract.verifyCrop(cropId);
      await tx.wait();
      toast.success("Crop Successfully Verified");
      const data = {
        from: "localagent",
        metamaskId:"0x3a2fc3f7e1a3204169bff907fcb6041784680f2b",
        data: `Your crop has been verified successfully`,
        navigate: "/farmer/alllistedcrops",
      };
      socket.emit("sendsinglenotification", data);
      setSelectedCropId(cropId);
      setIsDialogOpen(true);
    } catch (error) {
      console.error("Error verifying crop:", error);
      setErrorMessage("Error verifying crop. Please try again.");
      toast.error("Error verifying crop. Please try again.");
    } finally {
      setTransactionLoading(false);
    }
  };

  const handleSubmitDetails = async () => {
    if (!quality || !convertedEthPrice || isNaN(convertedEthPrice) || Number(convertedEthPrice) <= 0) {
      setErrorMessage("Please enter valid quality and price.");
      return;
    }

    try {
      setTransactionLoading(true);
      const priceInWei = ethers.parseEther(convertedEthPrice); // Use the converted ETH price
      const tx = await contract.addQuality(quality, priceInWei, selectedCropId);
      await tx.wait();
      toast.success("Crop Details Submitted Successfully");
      navigate("/localagent/home");
      setIsDialogOpen(false);
      setQuality("");
      setErrorMessage("");
      setConvertedEthPrice(""); // Reset converted price
      setInrPrice(""); // Reset INR input
    } catch (error) {
      console.error("Error setting crop details:", error);
      setErrorMessage("Error submitting details. Please try again.");
      toast.error("Error submitting details. Please try again.");
    } finally {
      setTransactionLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <div className="my-10">
        <div className="absolute top-3 right-6">
          <Button onClick={() => setIsMarketPriceModalOpen(true)} className="bg-blue-500 text-white">
            Market Price
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Pending Crop Verifications</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Loader />
            ) : error ? (
              <p className="text-center text-red-500">{error.message}</p>
            ) : pendingCrops.length > 0 ? (
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
                  {pendingCrops.map(({ id, name, isVerified, price, seller }) => (
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
                            onClick={() => handleVerifyCrop(id, seller)}
                            disabled={transactionLoading}
                          >
                            {transactionLoading ? "Verifying..." : "Verify"}
                          </Button>
                        )}
                        {isVerified && (
                          <Button
                            variant="primary"
                            className={`bg-blue-500 text-white`}
                            onClick={() => {
                              setSelectedCropId(id);
                              setIsDialogOpen(true);
                            }}
                            disabled={transactionLoading}
                          >
                            {quality === "" ? "Add Details" : "Verified"}
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-center">
                No crops assigned for verification yet.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Crop Verification Details</DialogTitle>
          </DialogHeader>
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          <div className="mb-4">
            <label className="block mb-1">Quality:</label>
            <Input
              value={quality}
              onChange={(e) => setQuality(e.target.value)}
              placeholder="Enter Quality"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Price in INR:</label>
            <Input
              value={inrPrice}
              onChange={(e) => {
                setInrPrice(e.target.value);
                convertINRtoETH(e.target.value); // Convert on every change
              }}
              placeholder="Enter Price in INR"
              type="number"
              min="0"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Price in ETH:</label>
            <Input
              value={convertedEthPrice}
              placeholder="Converted Price in ETH"
              type="number"
              min="0"
              readOnly // Make this field read-only to avoid manual input
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="destructive" onClick={() => setIsDialogOpen(false)}>
              Close
            </Button>
            <Button
              className="bg-blue-500"
              onClick={handleSubmitDetails}
              disabled={transactionLoading}
            >
              {transactionLoading ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <MarketPriceModal
        isOpen={isMarketPriceModalOpen}
        onClose={() => setIsMarketPriceModalOpen(false)}
      />
    </div>
  );
}
