import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import useGetAllCrops from "@/hooks/useGetAllCrops";

export default function ListedCropView() {
  const { cropId } = useParams(); // Get the crop ID from the URL
  const crops = useGetAllCrops(); // Fetch all crops
  const [cropData, setCropData] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  

  useEffect(() => {
    // Find the crop with the matching cropId
    const selectedCrop = crops.filter((crop) => crop.id == cropId);
    console.log(selectedCrop);
    
    setCropData(selectedCrop);
  }, [cropId, crops]);

  const handleToggleDetails = () => {
    setShowDetails(!showDetails);
  };

  if (!cropData) {
    return <p>Loading crop details...</p>;
  }

  return (
    <div className="flex justify-center py-8 px-4">
      <Card className="shadow-lg rounded-lg w-full max-w-md bg-white dark:bg-gray-800 transition-all">
        <CardHeader className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <CardTitle className="text-2xl font-semibold text-gray-800 dark:text-white">
            {cropData[0]?.name}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="px-4 py-4">
          
          <div className="mb-4">
            <div className="w-full h-[30vw]">
              <img className="w-full h-full object-cover" src={cropData[0]?.image} alt="" />
            </div>
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 w-full text-center mb-2">Crop Details</h3>
            <p className="mb-2"><strong>Quality Test:</strong> <span className="text-gray-600 dark:text-gray-400">{cropData[0]?.quality}</span></p>
            <p className="mb-2"><strong> Price:</strong> <span className="text-gray-600 dark:text-gray-400">{cropData[0]?.price} ETH</span></p>
            <p className="mb-2"><strong>Quantity:</strong> <span className="text-gray-600 dark:text-gray-400">{cropData[0]?.quantity} KG</span></p>
            <p className="mb-2"><strong>Harvest Date:</strong> <span className="text-gray-600 dark:text-gray-400">{cropData[0]?.harvestDate}</span></p>
          </div>
        </CardContent>

       
      </Card>
    </div>
  );
}
