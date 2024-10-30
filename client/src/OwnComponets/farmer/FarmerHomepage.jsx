import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import useGetAllCrops from "@/hooks/useGetAllCrops";

export default function FarmerHomePage() {
  const crops = useGetAllCrops(); // Fetch all crops
  const navigate = useNavigate();

  // Limit crops to only 2 entries
  const limitedCrops = crops.slice(0, 2);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-500">
      <div className="container mx-auto py-8 px-4">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2">Farmer Dashboard</h1>
          <p className="text-lg">
            Welcome to your crop trading dashboard! Manage your crops and
            monitor your sales.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card for Listing New Crops */}
          <Card className="shadow-lg rounded-lg transition-transform hover:scale-105 dark:bg-gray-800 dark:text-white">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-green-600">
                List New Crop
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="dark:text-gray-300">
                Ready to sell your produce? Start by listing a new crop for
                buyers to view.
              </p>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button
                className="bg-green-500 hover:bg-green-600 text-white"
                onClick={() => navigate("/farmer/listcrops")}
              >
                List Crop
              </Button>
            </CardFooter>
          </Card>

          {/* Card for Viewing Listed Crops */}
          <Card className="shadow-lg rounded-lg transition-transform hover:scale-105 dark:bg-gray-800 dark:text-white">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-blue-600">
                Your Listed Crops
              </CardTitle>
            </CardHeader>
            <CardContent>
              {limitedCrops.length > 0 ? (
                <ul className="space-y-4">
                  {limitedCrops.map((crop) => (
                    <li
                      key={crop.cropId}
                      className="border-b pb-4 flex justify-between items-center last:border-none dark:border-gray-700"
                    >
                      <div>
                        <h3 className="text-lg font-medium">{crop.name}</h3>
                        <p>Price: {crop.price} ETH</p>
                        <p>Quantity: {crop.quantity} kg</p>
                        <p
                          className={`text-sm ${
                            crop.status === "Sold"
                              ? "text-red-500"
                              : "text-green-500"
                          }`}
                        >
                          Status: {crop.status}
                        </p>
                      </div>
                      <Button
                        onClick={() => navigate(`/farmer/listedcropview/${crop.id}`)}
                        className="bg-blue-500 hover:bg-blue-600 text-white"
                      >
                        View
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No crops listed yet. Start by listing a new crop.</p>
              )}
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button
                variant="link"
                className="text-blue-500 hover:text-blue-600"
                onClick={() => navigate("/farmer/alllistedcrops")}
              >
                View All
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Profile Management Section */}
        <div className="mt-8">
          <Card className="shadow-lg rounded-lg transition-transform hover:scale-105 dark:bg-gray-800 dark:text-white">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold">
                Manage Your Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Update your personal details, wallet address, or check your
                transaction history.
              </p>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button
                className="bg-gray-500 hover:bg-gray-600 text-white"
                onClick={() => alert("Go to Profile Settings Page")}
              >
                Manage Profile
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}

