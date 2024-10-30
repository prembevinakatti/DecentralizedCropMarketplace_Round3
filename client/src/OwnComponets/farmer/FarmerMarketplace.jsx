import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useGetCropsForAuction from "@/hooks/useGetCropsForAuction"; // Import the hook

export default function FarmerMarketplace() {
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState("All");

  // Fetch auction crops from the hook
  const { crops: auctionCrops, loading: loadingAuctionCrops } = useGetCropsForAuction();

  // Filter the crops based on status
  const filteredCrops = auctionCrops?.filter(
    (crop) =>
      filterStatus === "All" || (filterStatus === "Open" && !crop.isSold)
  );

  return (
    <div className="container mx-auto py-8 px-4 dark:bg-gray-900">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-4 text-gray-800 dark:text-white">
          Auction Marketplace
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Join the auction and place your bids!
        </p>
      </header>

      {/* Filter Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <Button
            className={`mr-2 ${
              filterStatus === "All"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 dark:bg-gray-700"
            }`}
            onClick={() => setFilterStatus("All")}
          >
            All Crops
          </Button>
          <Button
            className={`mr-2 ${
              filterStatus === "Open"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 dark:bg-gray-700"
            }`}
            onClick={() => setFilterStatus("Open")}
          >
            Open Auctions
          </Button>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-300">
          {loadingAuctionCrops ? "Loading..." : `${filteredCrops?.length} crop(s) available`}
        </p>
      </div>

      {/* Auction Crops List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loadingAuctionCrops ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : (
          filteredCrops?.map((crop) => (
            <Card
              key={crop.id}
              className="shadow-lg bg-white dark:bg-gray-800 rounded-lg hover:shadow-xl transition-all duration-300"
            >
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-gray-800 dark:text-white">
                  {crop.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-700 dark:text-gray-300">
                    Price: {crop.price} ETH
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    Quantity: {crop.quantity} kg
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    Quality: {crop.quality}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    Harvest Date:{" "}
                    {new Date(crop.harvestDate * 1000).toLocaleDateString()}{" "}
                    {/* Assuming harvestDate is in seconds */}
                  </p>
                  <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                    <p>
                      Status:{" "}
                      <span
                        className={crop.isSold ? "text-red-500" : "text-green-500"}
                      >
                        {crop.isSold ? "Sold" : "Available"}
                      </span>
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <Button
                      className={`${
                        crop.isSold
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-blue-500 hover:bg-blue-600"
                      } text-white`}
                      onClick={() => navigate(`/auction`)} // Update to navigate to the specific auction
                      disabled={crop.isSold}
                    >
                      {crop.isSold ? "Sold" : "Join Auction"}
                    </Button>
                    <Button
                      className="bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-300"
                      onClick={() => alert(`Details of ${crop.name}`)}
                    >
                      Info
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
