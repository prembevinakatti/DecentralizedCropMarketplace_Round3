// useSocket.js
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import axios from "axios"; // Don't forget to import axios

let socket;

const useSocket = () => {
  const { userId, role } = useSelector((store) => store.roles);
  const [metamaskId, setMetamaskId] = useState("");
  const [isSocketReady, setIsSocketReady] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
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
        setMetamaskId(res.data.user.metamaskId);
      } catch (error) {
        console.log("Error Getting User Details in client", error);
      }
    };

    fetchUserDetails();
  }, [userId]);

  useEffect(() => {
    if (metamaskId && !socket) {
      socket = io("http://localhost:3000", {
        withCredentials: true,
        transports: ["websocket"],
        query: { userId, role, metamaskId }, // Pass credentials from Redux store
      });

      socket.on("connect", () => {
        console.log("Connected to server with Socket ID:", socket.id);
        setIsSocketReady(true);
      });

      socket.on("disconnect", () => {
        console.log("Disconnected from server");
        setIsSocketReady(false);
      });
    }

    return () => {
      if (socket) {
        socket.disconnect();
        socket = null;
      }
    };
  }, [metamaskId, userId, role]);

  return isSocketReady ? socket : null;
};

export default useSocket;
