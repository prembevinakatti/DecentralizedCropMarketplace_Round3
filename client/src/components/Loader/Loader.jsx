// Loader.js
import React from "react";

export default function Loader() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="loader border-t-4 border-blue-500 rounded-full w-16 h-16 animate-spin"></div>
    </div>
  );
}

