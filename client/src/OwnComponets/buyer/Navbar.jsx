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
import { FaHome, FaShoppingCart, FaBoxOpen, FaChartLine } from "react-icons/fa"; // Icons
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import LogoutButton from "../utils/LogoutButton";


const BuyerNavbar = () => {
  const [isOpen, setIsOpen] = useState(false); // State to control the sheet
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
    setIsOpen(false); // Close drawer after navigation
  };

  return (
    <div className="">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        {/* Trigger Button */}
        <SheetTrigger
          onClick={() => setIsOpen(true)}
          className="absolute top-2 left-2 z-10 bg-white"
        >
          <IoMenu size={30} />
        </SheetTrigger>

        {/* Drawer Menu */}
        
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle>Buyer Panel</SheetTitle>
            <SheetDescription>
              <div>
                <Separator className="my-3" />

                {/* Home Link */}
                <div
                  className="cursor-pointer text-slate-800 hover:text-black flex items-center space-x-2"
                  onClick={() => handleNavigation("/buyer/home")}
                >
                  <FaHome /> <span>Home</span>
                </div>

                <Separator className="my-3" />

                {/* View Crops */}
                <div
                  className="cursor-pointer text-slate-800 hover:text-black flex items-center space-x-2"
                  onClick={() => handleNavigation("/buyer/viewcrops")}
                >
                  <FaShoppingCart /> <span>Browse Crops</span>
                </div>

                <Separator className="my-3" />

                {/* Purchase History */}
                <div
                  className="cursor-pointer text-slate-800 hover:text-black flex items-center space-x-2"
                  onClick={() => handleNavigation("/buyer/purchase-history")}
                >
                  <FaBoxOpen /> <span>Purchase History</span>
                </div>

                <Separator className="my-3" />

                {/* Track Orders */}
                <div
                  className="cursor-pointer text-slate-800 hover:text-black flex items-center space-x-2"
                  onClick={() => handleNavigation("/buyer/track-orders")}
                >
                  <FaChartLine /> <span>Track Orders</span>
                </div>

                <Separator className="my-3" />

              <div>
                <LogoutButton/>
              </div>
          
              </div>
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default BuyerNavbar;
