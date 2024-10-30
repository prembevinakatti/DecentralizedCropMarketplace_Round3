import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Assuming you're using ShadCN
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useContract } from "@/ContractContext/ContractContext";
import useGetAllCrops from "@/hooks/useGetAllCrops";
import { useSelector } from "react-redux";
import axios from "axios";

const BuyerHomePage = () => {
  const navigate = useNavigate();
  const { state } = useContract();
  const contract = state.contract;
  const crops = useGetAllCrops();
  const { userId } = useSelector((store) => store.roles);
  const [buyer, setBuyer] = useState("");
  console.log("buyer :",buyer);
  
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
  const soldCrops = crops.filter(crop => crop.buyer.toLowerCase() === buyer.toLowerCase());

  console.log("state: " + contract);

  const handlenavigate = () => {
    navigate("/buyer/purchase-history");
  }

  return (
    <div className="container mx-auto p-6 space-y-12">
      {/* Section: Welcome */}
      <Card className="bg-blue-50 shadow-lg border-0">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-blue-600">
            Welcome, Buyer!
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-gray-700 text-lg">
            Explore a variety of crops from trusted sellers, track your orders,
            and review your past purchases with ease.
          </p>
          <div className="mt-6">
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md shadow-md transition-all"
              onClick={() => navigate("/buyer/viewcrops")}
            >
              Browse Available Crops
            </Button>
          </div>
        </CardContent>
      </Card>


      {/* Section: Recently Purchased */}
      <div className="space-y-8">
        <div onClick={handlenavigate}>
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              Recently Purchased
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {soldCrops.length === 0 ? (
                <div className="col-span-full text-center text-gray-600">
                  No recently purchased crops found.
                </div>
              ) : (
                soldCrops.map((crop) => (
                  <div key={crop.id} className="group">
                    <div className="relative overflow-hidden rounded-md">
                      <img
                        src={crop.image}
                        alt={crop.name}
                        className="w-full h-40 object-cover rounded-md transition-transform duration-300 transform group-hover:scale-105"
                      />
                    </div>
                    <p className="text-center mt-2 font-medium text-gray-700">
                      {crop.name}
                    </p>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
        </div>
      </div>

      {/* Section: Track Your Orders */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Track Your Orders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">
            You can easily track the status of your ongoing orders in real time.
            Stay updated with the latest information on your purchases.
          </p>
          <div className="mt-6">
            <Button
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md shadow-md transition-all"
              onClick={() => navigate("/buyer/track-orders")}
            >
              Track Orders
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BuyerHomePage;
