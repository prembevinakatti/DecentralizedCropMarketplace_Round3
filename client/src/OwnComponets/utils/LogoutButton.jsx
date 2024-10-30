import { Button } from "@/components/ui/button";
import { useClerk } from "@clerk/clerk-react";
import { useDispatch } from "react-redux";

const LogoutButton = () => {
  const { signOut } = useClerk();
    const dispatch=useDispatch()
  const handleLogout = async () => {
    try {
      await signOut();  // Clerk's logout function
      // Optionally, redirect after logout
      window.location.href = "/";  // Redirect to login or home after logout
      dispatch(setRole({ userId: null, role :null}));
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return <Button className={"bg-red-900"} onClick={handleLogout}>Logout</Button>;
};

export default LogoutButton;

