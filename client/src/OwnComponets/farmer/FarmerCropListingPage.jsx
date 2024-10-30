import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { useContract } from "@/ContractContext/ContractContext";
import toast from "react-hot-toast";
import axios from "axios"; // Import axios for HTTP requests
import Loader from "@/components/Loader/Loader";
import { useNavigate } from "react-router-dom";

export function CropForm() {
  const { state } = useContract();
  const contract = state.contract;
  const navigate = useNavigate();

  const [cropData, setCropData] = useState({
    name: "",
    quantity: "",
    harvestDate: "",
    image: [],
  });

  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false); // Loading state

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCropData({ ...cropData, [name]: value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setCropData({ ...cropData, image: files });

    const previewUrls = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previewUrls);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true

    try {
      // Upload images to Cloudinary and get URLs
      const imageUrls = await Promise.all(
        cropData.image.map(async (file) => {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("upload_preset", "DecentralizedCropMarketplace"); // Replace with your Cloudinary upload preset

          const response = await axios.post(
            "https://api.cloudinary.com/v1_1/dyp7pxrli/image/upload", // Replace with your Cloudinary cloud name
            formData
          );

          return response.data.secure_url; // Get the secure URL of the uploaded image
        })
      );

      // Call the smart contract function with the correct parameters
      const listCrop = await contract.listCrop(
        cropData.name,
        imageUrls[0], // Assuming you want to use the first image URL for listing
        cropData.harvestDate,
        cropData.quantity
      );

      await listCrop.wait(); // Wait for the transaction to be mined
      navigate("/farmer/home");
      toast.success("Crop Listed successfully");
      console.log("Crop listed successfully:", listCrop);
    } catch (error) {
      console.error("Error listing crop:", error);
      toast.error("Error listing crop: ");
    } finally {
      setLoading(false); // Reset loading state after transaction
    }
  };
  

  return (
    <div className="container mx-auto p-4 dark:bg-gray-900">
      <Card className="dark:bg-gray-800 dark:text-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            List Your Crop for Sale
          </CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column - Crop Info */}
            <div className="space-y-4">
              {/* Crop Name */}
              <div>
                <Label htmlFor="name">Crop Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter Crop Name"
                  onChange={handleInputChange}
                  value={cropData.name}
                  required
                  className="dark:bg-gray-700 dark:text-white"
                />
              </div>

              {/* Quantity */}
              <div>
                <Label htmlFor="quantity">Quantity (in Kg)</Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  placeholder="Enter Quantity"
                  onChange={handleInputChange}
                  value={cropData.quantity}
                  required
                  className="dark:bg-gray-700 dark:text-white"
                />
              </div>

              {/* Expiration Date */}
              <div>
                <Label htmlFor="harvestDate">Harvest Date</Label>
                <Input
                  id="harvestDate"
                  name="harvestDate"
                  type="date"
                  onChange={handleInputChange}
                  value={cropData.harvestDate}
                  required
                  className="dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            {/* Right Column - Images */}
            <div className="space-y-4">
              {/* Crop Images */}
              <div>
                <Label htmlFor="image">Upload Crop Images</Label>
                <Input
                  id="image"
                  name="image"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  required
                  className="dark:bg-gray-700 dark:text-white"
                />
                {/* Image Preview */}
                {imagePreviews.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                    {imagePreviews.map((src, index) => (
                      <img
                        key={index}
                        src={src}
                        alt={`Crop Preview ${index}`}
                        className="w-full h-auto object-cover"
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-end">
            {loading ? ( // Show loader if loading
              <Loader />
            ) : (
              <Button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                Submit Crop
              </Button>
            )}
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
