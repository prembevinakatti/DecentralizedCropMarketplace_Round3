import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import LocalAgentNavbar from "./Navbar";
import useSocket from "../utils/Sockt";
import toast from "react-hot-toast";
import { data } from "autoprefixer";

function LocalagentMainpage() {
  const socket = useSocket(); 
  
  
  const handleClick = () => {
    if (socket) {
      const data={
        from: "farmer",
        metamaskId:"user_2nxdZJp0kmgmeGFUa812nl5dYY4",
        data:"a new crop assigned to you for verification",
        navigate:"/localagent/verifycrops"
      }
        socket.emit('sendsinglenotification',data)
      console.log("Button clicked");
    } else {
      console.error("Socket is not ready");
    }
  };
useEffect(() => {
  if (socket) {
    socket.on("someEvent", (data) => {
      console.log("Received someEvent:", data);
    });

    socket.on("notification", (message) => {
      const notificationData=message
      toast.custom((t) => (
        <div
          onClick={() => notificationData.navigate && window.open(notificationData.navigate, '_blank')}
          className={`${
            t.visible ? 'animate-enter opacity-100 scale-100' : 'animate-leave opacity-0 scale-95'
          } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-gray-300 transition transform duration-300 ease-in-out cursor-pointer`}
        >
          <div className="flex-1 w-0 p-4">
            <div className="flex items-center">
              <p className="text-sm font-medium text-gray-900">
                {notificationData.from}
              </p>
              <p className="ml-3 text-sm text-gray-500 truncate">
                {notificationData.data}
              </p>
            </div>
          </div>
          <div className="flex border-l border-gray-200">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toast.dismiss(t.id);
              }}
              className="w-full rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Close
            </button>
          </div>
        </div>
      ));
    });
  }

 
  return () => {
    if (socket) {
      socket.off("someEvent");
      socket.off("notification");
    }
  };
}, [socket]);
  return (
    <>
      {/* <button onClick={handleClick} style={{ padding: "10px", margin: "10px", backgroundColor: "#007BFF", color: "#FFF", border: "none", borderRadius: "5px" }}>
        Send Test Notification
      </button> */}
      <LocalAgentNavbar />
      <Outlet />
    </>
  );
}

export default LocalagentMainpage;
