import React, { useEffect } from "react";
import { SignedIn, SignedOut, useUser } from "@clerk/clerk-react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setRole } from "./store/roleSlice";

function App() {
  const navigate = useNavigate();
  const { user } = useUser();
  const userRole = useSelector((state) => state.roles.role);
  const dispatch = useDispatch();
  const location = useLocation(); // Get the current location

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/v6/users/getuser/${user.id}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
        const role = response.data.role; // Assuming the role is returned here
        console.log("app jsx", role);

        dispatch(setRole({ userId: user.id, role })); // Update Redux state

        if (role) {
          if (location.pathname === "/") {
            navigate(`/${role}/home`); // Redirect based on role if at root
          }
        } else {
          navigate("/addyourrole"); // Navigate to role assignment if no role is found
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
        navigate("/addyourrole"); // Navigate to role assignment on error
      }
    };

    if (user) {
      if (userRole === null) {
        fetchUserRole(); // Fetch user role if not already set
      } else {
        // Do not navigate if already at the current location
        if (location.pathname === "/") {
          navigate(`/${userRole}/home`); // Redirect to role-based home if at root
        }
      }
    }
  }, [user, userRole, navigate, dispatch, location]);

  return <Outlet />;
}

export default App;
