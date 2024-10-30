// MarketPriceModal.js
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const MarketPriceModal = ({ onClose, isOpen }) => {
  const marketPrices = [
    {
      name: "Rice",
      price: "₹15,000/ton",
      trend: "+5%",
      supply: "High",
      demand: "Moderate",
      regionalPrices: {
        North: "₹15,500/ton",
        South: "₹14,500/ton",
        East: "₹15,200/ton",
        West: "₹14,800/ton",
      },
      
    },
    {
      name: "Wheat",
      price: "₹18,500/ton",
      trend: "+3%",
      supply: "Moderate",
      demand: "High",
      regionalPrices: {
        North: "₹19,000/ton",
        South: "₹18,000/ton",
        East: "₹18,700/ton",
        West: "₹18,300/ton",
      },
    },
    {
      name: "Corn",
      price: "₹12,500/ton",
      trend: "-2%",
      supply: "Low",
      demand: "High",
      regionalPrices: {
        North: "₹12,800/ton",
        South: "₹12,200/ton",
        East: "₹12,500/ton",
        West: "₹12,300/ton",
      },
    },
    {
      name: "Soybeans",
      price: "₹16,000/ton",
      trend: "+4%",
      supply: "High",
      demand: "Low",
      regionalPrices: {
        North: "₹15,700/ton",
        South: "₹16,200/ton",
        East: "₹16,100/ton",
        West: "₹16,300/ton",
      },
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose} className="fixed inset-0 flex items-center justify-center">
      <DialogContent className="w-full max-w-md h-auto max-h-[70vh] p-4 overflow-y-auto rounded-lg shadow-lg bg-white">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold">Market Prices</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 p-2">
          {marketPrices.map((crop, index) => (
            <div key={index} className="border-b-2 pb-3 mb-3 space-y-1">
              <h2 className="text-lg font-bold text-gray-800">{crop.name}</h2>
              <div className="flex justify-between text-gray-700">
                <span>Price:</span> <span className="font-semibold text-blue-600">{crop.price}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Trend:</span> <span className={`font-semibold ${crop.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{crop.trend}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Supply:</span> <span className="font-semibold">{crop.supply}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Demand:</span> <span className="font-semibold">{crop.demand}</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mt-2">Regional Prices</h3>
              <div className="grid grid-cols-2 gap-2 text-gray-600">
                {Object.entries(crop.regionalPrices).map(([region, price]) => (
                  <p key={region} className="flex justify-between">
                    <span>{region}:</span> <span className="font-semibold">{price}</span>
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
        <DialogFooter className="text-center">
          <Button onClick={onClose} variant="destructive" className="mx-auto mt-4">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MarketPriceModal;
