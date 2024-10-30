import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useContract } from "@/ContractContext/ContractContext";
import axios from "axios";
import useGetAllCrops from "@/hooks/useGetAllCrops";
import Loader from "@/components/Loader/Loader"; // Import the Loader component
import toast from "react-hot-toast";
import useSocket from "../utils/Sockt";
import { useNavigate } from "react-router-dom";
export default function AllListedCrops() {
  const [activeSection, setActiveSection] = useState("approved");
  const [localAgents, setLocalAgents] = useState([]);
  const [selectedCropId, setSelectedCropId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [assignAgent, setAssignAgent] = useState({});
  const [isLoading, setIsLoading] = useState(true); // Loading state for crops
  const [isAgentLoading, setIsAgentLoading] = useState(false); // Loading state for agents
  const [isAssigningAgent, setIsAssigningAgent] = useState(false); // Loading state for assigning agents
  const { state } = useContract();
  const contract = state.contract;
  const socket = useSocket(); 
  const handleSectionChange = (section) => {
    setActiveSection(section);
  };
  const navigate=useNavigate()
  // Fetch crops from blockchain
  const crops = useGetAllCrops();

  useEffect(() => {
    if (crops.length) setIsLoading(false); // Stop loading when crops are fetched
  }, [crops]);

  // Fetch available local agents from the backend
  const fetchLocalAgents = async () => {
    setIsAgentLoading(true); // Start agent loading
    try {
      const response = await axios.get(
        "http://localhost:3000/api/v6/users/getAgents",
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      setLocalAgents(response.data.localAgents);
    } catch (error) {
      console.error("Error fetching local agents:", error);
    } finally {
      setIsAgentLoading(false); // Stop agent loading
    }
  };

  const handleAddLocalAgentClick = (cropId) => {
    setSelectedCropId(cropId);
    fetchLocalAgents();
    setIsModalOpen(true);
  };

  const handleAgentSelect = async (agentId) => {
    setIsAssigningAgent(true); // Set assigning state to true
    try {
      await contract.addLocalAgent(agentId, selectedCropId);
      toast.success("Successfully added agent");
      setAssignAgent((prev) => ({
        ...prev,
        [selectedCropId]: true,
      }));
      if(socket){
        const data={
          from: "farmer",
          metamaskId:agentId,
          data:"a new crop assigned to you for verification",
          navigate:"/localagent/verifycrops"
        }
        socket.emit("sendsinglenotification",data)
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error assigning agent:", error);
      toast.error("Error assigning agent");
    } finally {
      setIsAssigningAgent(false); // Reset assigning state after assignment
    }
  };

  const handleStartAuction = async (cropId) => {
    try {
      const startAuction = await contract.startAuction(cropId);
      await startAuction.wait();
      navigate("/farmer/marketplace")
      toast.success("Auction started");
    } catch (error) {
      console.log("Error Starting Auction : " + error.message);
      toast.error("Error starting auction");
    }
  };

  const filteredCrops = crops.filter(
    (crop) => crop.status === activeSection || activeSection === "all"
  );

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-center space-x-4 mb-4">
        <Button
          onClick={() => handleSectionChange("approved")}
          className={
            activeSection === "approved"
              ? "bg-blue-500 text-white"
              : "bg-gray-200"
          }
        >
          Listed and Approved
        </Button>
        <Button
          onClick={() => handleSectionChange("sold")}
          className={
            activeSection === "sold" ? "bg-blue-500 text-white" : "bg-gray-200"
          }
        >
          Sold
        </Button>
        <Button
          onClick={() => handleSectionChange("all")}
          className={
            activeSection === "all" ? "bg-blue-500 text-white" : "bg-gray-200"
          }
        >
          All Crops
        </Button>
      </div>

      {isLoading ? (
        <Loader />
      ) : (
        <>
          {filteredCrops.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredCrops.map((crop) => (
                <Card key={crop.id} className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold">
                      {crop.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Quantity: {crop.quantity} kg</p>
                    <p>Harvest Date: {crop.harvestDate}</p>
                    <p>Price: {crop.price} ETH</p>
                    <p className="capitalize">Status: {crop.status}</p>
                    {crop.isVerified ? (
                      <div className="w-full flex items-center justify-between">
                        <div
                          className="w-full"
                          onClick={() => handleStartAuction(crop.id)}
                        >
                          <Button
                            className={`mt-4 bg-green-500 w-full text-white ${
                              crop.isSold ? "hidden" : ""
                            }`}
                          >
                            Auction
                          </Button>
                        </div>
                        <Button
                          disabled
                          className={`mt-4 w-full bg-green-500 text-white ${
                            crop.isSold ? "cursor-not-allowed" : "hidden"
                          }`}
                        >
                          Sold
                        </Button>
                      </div>
                    ) : assignAgent[crop.id] && crop.status === "pending" ? (
                      <Button
                        className="mt-4 bg-yellow-500 text-white"
                        disabled
                      >
                        
                        Pending Verification
                      </Button>
                    ) : (
                      <Button
                        className="mt-4 bg-green-500 text-white"
                        onClick={() => handleAddLocalAgentClick(crop.id)}
                      >
                        Add Local Agent
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center">No crops found in this category.</p>
          )}
        </>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Select a Local Agent</h2>
            {isAgentLoading ? (
              <Loader />
            ) : localAgents.length > 0 ? (
              <ul>
                {localAgents.map((agent) => (
                  <li key={agent.id} className="mb-2">
                    <div className="border p-2 rounded-md">
                      <p>
                        <strong>Name:</strong> {agent.fullName}
                      </p>
                      <p>
                        <strong>Email:</strong> {agent.email}
                      </p>
                      <p>
                        <strong>Phone:</strong> {agent.phoneNumber}
                      </p>
                      <Button
                        className="mt-2 w-full bg-blue-500 text-white"
                        onClick={() => handleAgentSelect(agent.metamaskId)}
                        disabled={isAssigningAgent} // Disable button while assigning agent
                      >
                        {isAssigningAgent ? <Loader /> : `Assign ${agent.fullName}`} {/* Show Loader */}
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No local agents available.</p>
            )}
            <Button
              className="mt-4 bg-red-500 text-white"
              onClick={() => setIsModalOpen(false)}
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
