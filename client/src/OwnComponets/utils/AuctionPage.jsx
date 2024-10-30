import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import useGetCropsForAuction from "@/hooks/useGetCropsForAuction";
import useGetBiddersForCrop from "@/hooks/getBiddersForCrop";
import { useContract } from "@/ContractContext/ContractContext";
import { ethers } from "ethers";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AuctionPage = () => {
  const { crops: auctionCrops, loading: cropsLoading } = useGetCropsForAuction();
  const cropId = auctionCrops?.[0]?.id;

  const {
    biddersData,
    loading: biddersLoading,
    error: biddersError,
  } = useGetBiddersForCrop(cropId);
  const { state } = useContract();
  const contract = state.contract;

  const { role } = useSelector((store) => store.roles);
  const navigate = useNavigate();

  const cropDetails = auctionCrops?.[0] || {
    name: "Loading...",
    quantity: "Loading...",
    quality: "Loading...",
    harvestDate: "Loading...",
    seller: "Loading...",
    estimatedPrice: "Loading...",
    location: "Loading...",
    marketTrend: "Loading...",
  };

  const [latestBid, setLatestBid] = useState(0);
  const [yourBid, setYourBid] = useState(0);
  const [bidHistory, setBidHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(120); // 2 minutes
  const [biddersNames, setBiddersNames] = useState({});

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchHighestBid = async () => {
      if (cropId) {
        try {
          const highestBid = await contract.getHighestBid(cropId);
          setLatestBid(ethers.formatEther(highestBid)); // Convert from wei to Ether
        } catch (error) {
          console.error("Failed to fetch highest bid:", error);
        }
      }
    };

    fetchHighestBid();
  }, [contract, cropId]);

  // Fetch user names for bidders
  useEffect(() => {
    const fetchBiddersNames = async () => {
      const names = {};
      for (const bidder of biddersData) {
        try {
          const response = await axios.get(
            `http://localhost:3000/api/v6/users/getUserByMetamaskId/${bidder.address}`
          );
          names[bidder.address] = response.data.user.fullName;
        } catch (error) {
          console.error("Failed to fetch user name:", error);
        }
      }
      setBiddersNames(names);
    };

    if (biddersData.length > 0) {
      fetchBiddersNames();
    }
   

  }, [biddersData]);

  const handleBidSubmit = async () => {
    const bidAmount = parseFloat(yourBid);
    if (bidAmount <= latestBid) {
      alert(
        `Your bid must be greater than the current bid of ${latestBid} Ethereum.`
      );
      return;
    }

    setLoading(true);
    try {
      const bidTransaction = await contract.bid(cropId, {
        value: ethers.parseEther(bidAmount.toString()),
      });
      await bidTransaction.wait();

      setLatestBid(bidAmount);
      setBidHistory(
        [
          { name: "You", bid: bidAmount, profilePhoto: "/avatars/you.png" },
          ...bidHistory,
        ].slice(0, 3)
      );
      setYourBid(0);
    } catch (error) {
      console.error("Bid submission failed:", error);
      alert("There was an error submitting your bid. Please try again.");
    } finally {
      setLoading(false);
      window.location.reload();
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  const handleGetResult = async () => {
    try {
      const result = await contract.finalizeAuction(cropId);
      await result.wait();
      role === "farmer"
        ? navigate("/farmer/alllistedcrops")
        : navigate("/buyer/purchase-history");
      console.log("Auction Ended And Crop Sold");
    } catch (error) {
      console.log("Error Getting Result: ", error.message);
    }
  };

  return (
    <div className="flex flex-col p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Auction for {cropDetails.name}</h1>
        {role === "farmer" && (
          <Button className="bg-red-500 text-white" onClick={handleGetResult}>
            Finalize Result
          </Button>
        )}
      </div>

      <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">
        <h2 className="text-lg font-semibold">Crop Details</h2>
        <p><strong>Crop:</strong> {cropDetails.name}</p>
        <p><strong>Quantity:</strong> {cropDetails.quantity}</p>
        <p><strong>Quality:</strong> {cropDetails.quality}</p>
        <p><strong>Harvest Date:</strong> {cropDetails.harvestDate}</p>
        <p><strong>Estimated Price:</strong> {cropDetails.price} Ethereum</p>
        <p><strong>Market Trend:</strong> {cropDetails.marketTrend}</p>
        <h2 className="text-lg font-semibold mt-4">Farmer Details</h2>
        <p><strong>Farmer:</strong> {cropDetails.seller}</p>
        <p><strong>Location:</strong> {cropDetails.location}</p>
      </div>

      <Separator className="my-4" />

      <div className="flex space-x-6">
        <div className="flex-1 p-4 bg-white dark:bg-gray-800 rounded shadow">
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4 shadow-lg">
              <h3 className="text-md font-semibold">Highest Bid</h3>
              <p className="text-2xl font-bold mt-2">{latestBid} Ethereum</p>
              <h4 className="text-sm font-semibold mt-4">Bid History</h4>
              {biddersLoading ? (
                <p>Loading bid history...</p>
              ) : biddersError ? (
                <p>Error: {biddersError}</p>
              ) : (
                biddersData.map((bidder, index) => (
                  <div key={index} className="flex items-center text-sm">
                    <p>
                      Bidder: {biddersNames[bidder.address] || bidder.address} - Bid Amount: {ethers.formatEther(bidder.bidAmount)} Ethereum
                    </p>
                  </div>
                ))
              )}
            </Card>

            {role === "buyer" && (
              <Card className="p-4 shadow-lg">
                <h3 className="text-md font-semibold">Your Bid</h3>
                <input
                  type="number"
                  value={yourBid}
                  onChange={(e) => setYourBid(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Enter your bid"
                />
                <Button
                  onClick={handleBidSubmit}
                  className="mt-4 bg-blue-500 hover:bg-blue-600 text-white"
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Submit Bid"}
                </Button>
              </Card>
            )}
          </div>
          {/* <div className="mt-6 flex justify-between items-center">
            <p
              className={`text-lg py-2 px-4 rounded ${
                timer < 60 ? "bg-red-500" : "bg-yellow-400"
              } text-white`}
            >
              Time Remaining: {formatTime(timer)}
            </p>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default AuctionPage;
