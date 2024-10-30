import React, { useState } from "react";
import { IoMenu } from "react-icons/io5";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { FaHome, FaList, FaCheckCircle, FaChartLine } from "react-icons/fa";  // Icons for navigation
import LogoutButton from "../utils/LogoutButton";


const LocalAgentNavbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false); // State to control the sheet

  const handleNavigation = (path) => {
    navigate(path);
    setIsOpen(false); // Close the drawer after navigation
  };

  return (
    <div className="">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        {/* Menu Trigger */}
        <SheetTrigger
          onClick={() => setIsOpen(true)}
          className="absolute top-2 left-2 z-10 bg-white"
        >
          <IoMenu size={30} />
        </SheetTrigger>
        
        
        {/* Drawer Content */}
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle>Agent Panel</SheetTitle>
            <SheetDescription>
              <div>
                <Separator className="my-3" />

                {/* Home Link */}
                <div
                  className="cursor-pointer text-slate-800 hover:text-black flex items-center space-x-2"
                  onClick={() => handleNavigation("/localagent/home")}
                >
                  <FaHome /> <span>Home</span>
                </div>

                <Separator className="my-3" />

                {/* Pending Crops */}
                <div
                  className="cursor-pointer text-slate-800 hover:text-black flex items-center space-x-2"
                  onClick={() => handleNavigation("/localagent/verifycrops")}
                >
                  <FaList /> <span>Pending Crops</span>
                </div>

                <Separator className="my-3" />

             <LogoutButton/>
               
              </div>
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default LocalAgentNavbar;
