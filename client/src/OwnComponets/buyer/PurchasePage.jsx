import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  FaPhoneAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { useEffect, useState } from "react";
import useGetAllCrops from "@/hooks/useGetAllCrops";
import { useSelector } from "react-redux";
import axios from "axios";

export default function PurchasePage({ purchases }) {
  const [filter, setFilter] = useState("All");
  const { userId } = useSelector((store) => store.roles);
  const [buyer, setBuyer] = useState("");
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [sellerDetails, setSellerDetails] = useState(null);
  const [agentDetails, setAgentDetails] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/v6/users/getUserById/${userId}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
        setBuyer(res.data.user.metamaskId);
      } catch (error) {
        console.log("Error Getting User Details in client", error);
      }
    };
    fetchUser();
  }, [userId]);

  const crops = useGetAllCrops();
  const buyedCrop = buyer ? crops.filter((crop) => crop.buyer.toLowerCase() === buyer.toLowerCase()) : [];
  const purchasesToRender = purchases || buyedCrop;

  const handleFilterChange = (newFilter) => setFilter(newFilter);

  const filteredPurchases = purchasesToRender.filter((purchase) => {
    if (filter === "All") return true;
    return purchase.saleMode === filter;
  });

  // Fetch user details by Metamask ID
  const fetchUserDetails = async (metamaskId, setUserDetails) => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/v6/users/getUserByMetamaskId/${metamaskId}`
      );
      setUserDetails(res.data.user);
    } catch (error) {
      console.log("Error fetching user details:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-semibold text-center mb-8 text-blue-600">
        Your Purchases
      </h1>

      <div className="mb-8 flex justify-center space-x-4">
        {/* Your filter buttons here */}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {filteredPurchases.length === 0 ? (
          <div className="col-span-full text-center text-gray-600">
            No purchases available under this filter.
          </div>
        ) : (
          filteredPurchases.map((purchase) => (
            <Card
              key={purchase.cropID}
              className="p-6 shadow-lg border-2 border-gray-200 rounded-lg hover:shadow-xl hover:border-blue-500 transition-all duration-300 transform hover:scale-105"
            >
              <img
                src={purchase.image}
                alt={`${purchase.name} image`}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-gray-800">
                  {purchase.name}
                </h2>
                <p className="text-gray-600 text-lg mt-2">
                  Price Paid: {purchase.price} ETH
                </p>
                <p className="text-gray-600">
                  Quantity: {purchase.quantity} kg
                </p>
              </div>

              <div className="mt-6 flex justify-between items-center">
                <Button
                  variant="outline"
                  color="blue"
                  className="flex items-center hover:bg-blue-500 hover:text-white transition-all"
                  onClick={() => (window.location.href = `tel:${purchase.sellerPhone}`)}
                >
                  <FaPhoneAlt className="w-5 h-5 mr-2" /> Call Seller
                </Button>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      color="green"
                      className="hover:bg-green-500 hover:text-white transition-all"
                      onClick={() => {
                        setSelectedCrop(purchase);
                        // Fetch user details using Metamask IDs from the purchase
                        fetchUserDetails(purchase.seller, setSellerDetails); // Fetch seller details
                        fetchUserDetails(purchase.assignedAgent, setAgentDetails); // Fetch agent details
                      }}
                    >
                      View Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Crop Details</DialogTitle>
                      <DialogClose />
                    </DialogHeader>
                    {selectedCrop && (
                      <div className="text-gray-700 mt-4">
                        <p><strong>Name:</strong> {selectedCrop.name}</p>
                        <p><strong>Price Paid:</strong> {selectedCrop.price} ETH</p>
                        <p><strong>Quantity:</strong> {selectedCrop.quantity} kg</p>
                        <p><strong>Seller Id:</strong> {selectedCrop.seller} kg</p>
                      
                        {sellerDetails && (
                          <p><strong>Seller:</strong> {sellerDetails.name} {sellerDetails.email}</p>
                        )}
                        <p><strong>Assigned Agent Id:</strong> {selectedCrop.assignedAgent} kg</p>
                        {agentDetails && (
                          <p><strong>Assigned Agent:</strong> {agentDetails.name} {agentDetails.email}</p>
                        )}
                        <img
                          src={selectedCrop.image}
                          alt={`${selectedCrop.name} image`}
                          className="w-full h-48 object-cover rounded-md mt-4"
                        />
                      </div>
                    )}
                  </DialogContent>
                </Dialog>

                <Button
                  variant="outline"
                  color="yellow"
                  className="flex items-center hover:bg-yellow-500 hover:text-white transition-all"
                  onClick={() => alert("Navigate to Seller Location")}
                >
                  <FaMapMarkerAlt className="w-5 h-5 mr-2" /> Navigate
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
