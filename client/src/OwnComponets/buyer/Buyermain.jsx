import React from "react";
import BuyerNavbar from "./Navbar";
import { Outlet } from "react-router-dom";

function Buyermain() {
  return (
    <>
      <BuyerNavbar />
      <Outlet />
    </>
  );
}

export default Buyermain;

