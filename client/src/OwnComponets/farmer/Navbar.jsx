import React, { useEffect } from "react";
import { UserButton, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar"; // Ensure the import path is correct
import { Button } from "@/components/ui/button";
import { HiHome, HiShoppingCart, HiPlus, HiLogin } from "react-icons/hi"; // Add modern icons
import axios from "axios";
import { useSelector } from "react-redux";
import LogoutButton from "../utils/LogoutButton";

const Navbar = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const { role } = useSelector((store) => store.roles);

  console.log(user);

  return (
    <header className="flex justify-between items-center p-4 bg-white shadow-lg rounded-lg w-full">
      <h1 className="text-2xl font-bold text-blue-600">
        Crop Trading Platform
      </h1>

      <div className="flex gap-6 items-center">
        {/* Menubar with icons and improved styling */}
        <Menubar className="bg-white rounded-full shadow-md px-4 py-2 border border-gray-200">
          <MenubarMenu>
            <MenubarTrigger className="text-gray-700 font-medium hover:text-blue-600 focus:outline-none">
              Menu
            </MenubarTrigger>
            <MenubarContent className="bg-white shadow-md border border-gray-200 rounded-lg">
              <MenubarItem
                className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md cursor-pointer"
                onClick={() => navigate("/farmer/home")}
              >
                <HiHome className="text-lg" /> Home
              </MenubarItem>
              <MenubarItem
                className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md cursor-pointer"
                onClick={() => navigate("/farmer/marketplace")}
              >
                <HiShoppingCart className="text-lg" /> Marketplace
              </MenubarItem>
              <MenubarItem
                className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md cursor-pointer"
                onClick={() => navigate("/farmer/listcrops")}
              >
                <HiPlus className="text-lg" /> List Crops
              </MenubarItem>
              <LogoutButton/>
              <MenubarSeparator className="bg-gray-300" />
            </MenubarContent>
          </MenubarMenu>
        </Menubar>

        {/* User Profile Button or Login */}
        <div className="ml-4">
          {user ? (
            <UserButton className="rounded-full border-2 border-gray-300 p-1 hover:bg-gray-100" />
          ) : (
            <Button
              variant="link"
              className="text-gray-700 hover:text-blue-600 text-lg"
              onClick={() => navigate("/login")}
            >
              <HiLogin className="inline-block mr-2 text-xl" /> Login
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
