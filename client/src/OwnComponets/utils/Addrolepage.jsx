import React, { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDispatch } from "react-redux";
import { setRole } from "../../store/roleSlice"; // Ensure the path is correct
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Assuming you have a Card component
import clerk from "clerk";
import axios from "axios";

const AddRolePage = () => {
  const { user } = useUser(); // Get the current user from Clerk
  const [role, setRoleState] = useState("");
  const dispatch = useDispatch(); // Initialize dispatch
  const navigate = useNavigate();

  const handleRoleChange = (value) => {
    setRoleState(value);
  };

  const handleSubmit = async () => {
    if (!user || !role) {
      console.error("User or role not defined");
      return;
    }
    if (user) {
      const userData = {
        userId: user.id,
        fullName: user.fullName || "Anonymous",
        email: user.primaryEmailAddress.emailAddress,
        phoneNumber: user.phoneNumbers[0]?.phoneNumber || "undefined",
        metamaskId: user.web3Wallets[0]?.web3Wallet || `undefined${Math.random()*10}`,
        role: role,
      };

      console.log(userData);

      try {
        const response = await axios.post(
          "http://localhost:3000/api/v6/users/createuser",
          userData,
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );

        
        console.log(response.data);
        dispatch(setRole({ userId: user.id, role: role }));

        // Navigate to the appropriate page based on role
        if (role === "farmer") {
          navigate("/farmer/home");
        } else if (role === "localagent") {
          navigate("/localagent/home");
        } else {
          navigate("/buyer/home");
        }
      } catch (error) {
        console.error("Error sending user data:", error);
      }
      console.log(role);

      // Dispatch action to set role in Redux
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <Card className="w-full max-w-md p-6 shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold mb-4">
            Assign Your Role
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={role} onValueChange={handleRoleChange}>
            <SelectTrigger className="w-full border-gray-300 rounded-md">
              <SelectValue placeholder="Select your role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="farmer">Farmer</SelectItem>
              <SelectItem value="localagent">Local Agent</SelectItem>
              <SelectItem value="buyer">Buyer</SelectItem>
            </SelectContent>
          </Select>

          <Button
            className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md"
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddRolePage;
