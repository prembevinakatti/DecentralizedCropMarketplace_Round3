import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FaPhone,
  FaMapMarkerAlt,
  FaEye,
  FaShoppingCart,
  FaGavel,
} from "react-icons/fa";
import { useState, useEffect } from "react";
import Loader from "@/components/Loader/Loader"; // Import Loader component
import useGetCropsForSale from "@/hooks/useGetCropsForSale";
import useGetCropsForAuction from "@/hooks/useGetCropsForAuction";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useContract } from "@/ContractContext/ContractContext";
import { ethers } from "ethers";
import MarketplacePage from "./Marketplace";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function CropViewPage() {
  const { state } = useContract();
  const contract = state.contract;
  const navigate=useNavigate()
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState("direct");
  const [loading, setLoading] = useState(false);
  const [ethToInrRate, setEthToInrRate] = useState(0); // State for ETH to INR rate

  // Fetch crops for direct sale and auction
  const { crops: cropsForSale, loading: loadingCropsForSale } = useGetCropsForSale();
  const { crops: auctionCrops, loading: loadingAuctionCrops } = useGetCropsForAuction();

  useEffect(() => {
    const fetchEthToInrRate = async () => {
      try {
        const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=inr");
        const data = await response.json();
        setEthToInrRate(data.ethereum.inr); // Set the ETH to INR rate
      } catch (error) {
        console.error("Error fetching ETH to INR rate:", error);
      }
    };

    fetchEthToInrRate();
  }, []);

  const handleViewDetails = (crop) => {
    setSelectedCrop(crop);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedCrop(null);
  };

  const handleNavigate = () => {
    if (selectedCrop?.location?.latitude && selectedCrop?.location?.longitude) {
      const { latitude, longitude } = selectedCrop.location;
      const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
      window.open(url, "_blank");
    } else {
      alert("Location not available");
    }
  };

  const handleBuyForSale = async (cropId) => {
    try {
      setLoading(true);
      const priceInWei = ethers.parseEther(selectedCrop.price.toString());
      const tx = await contract.purchaseCrop(cropId, { value: priceInWei });
      await tx.wait();
      toast.success("Purchase Successful");
      navigate("/buyer")
      setLoading(false);
    } catch (error) {
      console.log("Error while buying: " + error.message);
      setLoading(false);
      toast.error("Error purchasing crop: ");
    }
  };

  const handleBidForAuction = async (cropId) => {
    try {
      setLoading(true);
      const bidAmountInWei = ethers.parseEther(selectedCrop.price.toString());
      const tx = await contract.bid(cropId, { value: bidAmountInWei });
      await tx.wait();
      toast.success("Bid Successfully");
      setLoading(false);
    } catch (error) {
      console.log("Error while placing bid: " + error.message);
      setLoading(false);
      toast.error("Error placing bid: ");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-semibold text-center mb-8 text-blue-600">
        Crop Listings
      </h1>

      {/* Loader for fetching crops */}
      {loadingCropsForSale || loadingAuctionCrops ? (
        <Loader />
      ) : (
        <>
          {/* Buttons to toggle between Direct Sale and Auction */}
          <div className="flex justify-center space-x-6 mb-8">
            <Button
              onClick={() => setViewMode("direct")}
              className={`flex items-center justify-center px-6 py-3 rounded-full text-white font-semibold text-lg transition-all duration-300 ease-in-out transform ${
                viewMode === "direct"
                  ? "bg-gradient-to-r from-green-400 to-blue-500 shadow-lg scale-105"
                  : "bg-gray-300 hover:bg-gradient-to-r hover:from-green-400 hover:to-blue-500 hover:text-white"
              }`}
            >
              <FaShoppingCart className="w-5 h-5 mr-2" />
              Direct Sale
            </Button>

            <Button
              onClick={() => setViewMode("auction")}
              className={`flex items-center justify-center px-6 py-3 rounded-full text-white font-semibold text-lg transition-all duration-300 ease-in-out transform ${
                viewMode === "auction"
                  ? "bg-gradient-to-r from-yellow-400 to-red-500 shadow-lg scale-105"
                  : "bg-gray-300 hover:bg-gradient-to-r hover:from-yellow-400 hover:to-red-500 hover:text-white"
              }`}
            >
              <FaGavel className="w-5 h-5 mr-2" />
              Auction Sale
            </Button>
          </div>

          {/* Display the crops based on selected view */}
          <div className="w-full flex flex-wrap gap-8 items-center justify-center">
            {viewMode === "direct" ? (
              cropsForSale?.length > 0 ? (
                cropsForSale.map((crop) => (
                  <Card
                    key={crop.id}
                    className="p-6 w-fit shadow-lg border border-gray-200 rounded-lg hover:shadow-xl hover:border-blue-500 transition-all duration-300 transform hover:scale-105"
                  >
                    <div className="text-center">
                      <h2 className="text-2xl font-semibold text-gray-800">
                        {crop.name}
                      </h2>
                      <p className="text-gray-600 text-lg mt-2">
                        Price: {crop.price} ETH
                      </p>
                      <p className="text-gray-600">
                        Quantity: {crop.quantity.toString()} kg
                      </p>
                    </div>

                    <div className="mt-4 text-center">
                      <div className="bg-green-100 p-2 rounded-md">
                        <span className="font-semibold text-green-700 text-xl">
                          Harvest Quality: {crop.quality}
                        </span>
                      </div>
                      <div className="mt-2 p-2 rounded-md bg-blue-100">
                        <span className="font-semibold text-blue-700 text-xl">
                          Direct Sale
                        </span>
                      </div>
                    </div>

                    <div className="mt-6 gap-2 flex justify-between items-center">
                      <Button
                        variant="outline"
                        className="flex items-center hover:bg-blue-500 hover:text-white transition-all"
                        onClick={() =>
                          (window.location.href = `tel:${crop.seller}`)
                        }
                      >
                        <FaPhone className="w-5 h-5 mr-2" /> Call Seller
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleViewDetails(crop)}
                        className="hover:bg-green-500 hover:text-white transition-all"
                      >
                        <FaEye className="w-5 h-5 mr-2" /> View Details
                      </Button>
                      <Button
                        variant="outline"
                        className="flex items-center hover:bg-yellow-500 hover:text-white transition-all"
                        onClick={handleNavigate}
                      >
                        <FaMapMarkerAlt className="w-5 h-5 mr-2" /> Navigate
                      </Button>
                    </div>
                  </Card>
                ))
              ) : (
                <p className="text-center text-gray-500 text-lg">
                  No crops available for direct sale.
                </p>
              )
            ) : auctionCrops?.length > 0 ? (
              <MarketplacePage
                tradingRooms={auctionCrops}
                filterStatus="Open"
              />
            ) : (
              <p className="text-center text-gray-500 text-lg">
                No crops available for auction.
              </p>
            )}
          </div>

          {/* Loader for transaction confirmation */}
          {loading && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
              <Loader />
              <p className="text-white">Processing...</p>
            </div>
          )}

          {/* Dialog for viewing crop details */}
          {selectedCrop && (
            <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{selectedCrop.name}</DialogTitle>
                </DialogHeader>
                <p className="mt-2">Price: {selectedCrop.price} ETH ({(selectedCrop.price * ethToInrRate).toFixed(2)} INR)</p>
                <p className="mt-2">Quantity: {selectedCrop.quantity} kg</p>
                <p className="mt-2">Harvest Quality: {selectedCrop.quality}</p>

                <div className="mt-4 flex justify-between">
                  {viewMode === "direct" ? (
                    <Button onClick={() => handleBuyForSale(selectedCrop.id)}>
                      Buy Now
                    </Button>
                  ) : (
                    <Button onClick={() => handleBidForAuction(selectedCrop.id)}>
                      Place Bid
                    </Button>
                  )}
                  <Button onClick={handleCloseDialog}>Close</Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </>
      )}
    </div>
  );
}
