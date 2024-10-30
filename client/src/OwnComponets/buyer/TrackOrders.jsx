import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AiOutlineInfoCircle } from 'react-icons/ai';  // Info icon replacement
import { GiHammerDrop } from 'react-icons/gi';  // Auction icon replacement
import { MdOutlineRequestQuote } from 'react-icons/md';  // Request quote icon

export default function TrackOrders() {
  const [selectedTab, setSelectedTab] = useState('crops');

  // Dummy Data
  const requestedCrops = [
    {
      id: 1,
      cropName: 'Wheat',
      status: 'Pending',
      priceOffered: 1200,
      quantity: 50,
      dateRequested: '2024-09-10',
    },
    
    {
      id: 2,
      cropName: 'Rice',
      status: 'Approved',
      priceOffered: 1500,
      quantity: 100,
      dateRequested: '2024-09-15',
    },
  ];

  const registeredAuctions = [
    {
      auctionID: '1',
      cropName: 'Barley',
      currentBid: 2000,
      highestBidder: 'John Doe',
      auctionEnd: '2024-10-30',
    },
    {
      auctionID: '2',
      cropName: 'Corn',
      currentBid: 2500,
      highestBidder: 'Jane Smith',
      auctionEnd: '2024-10-25',
    },
  ];

  const priceData = [
    { date: '2024-09-01', wheat: 1200, rice: 1500, corn: 2000 },
    { date: '2024-09-15', wheat: 1250, rice: 1450, corn: 2100 },
    { date: '2024-09-30', wheat: 1300, rice: 1400, corn: 2150 },
  ];

  const renderContent = () => {
    if (selectedTab === 'crops') {
      return requestedCrops.map((crop) => (
        <Card key={crop.id} className="p-4 mb-4 shadow-md border-2 border-gray-200 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800">{crop.cropName}</h3>
          <p className="text-gray-600">Status: {crop.status}</p>
          <p className="text-gray-600">Price Offered: ₹{crop.priceOffered}</p>
          <p className="text-gray-600">Quantity: {crop.quantity} kg</p>
          <p className="text-gray-600">Date Requested: {crop.dateRequested}</p>
        </Card>
      ));
    } else if (selectedTab === 'auctions') {
      return registeredAuctions.map((auction) => (
        <Card key={auction.auctionID} className="p-4 mb-4 shadow-md border-2 border-gray-200 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800">{auction.cropName}</h3>
          <p className="text-gray-600">Current Bid: ₹{auction.currentBid}</p>
          <p className="text-gray-600">Highest Bidder: {auction.highestBidder}</p>
          <p className="text-gray-600">Auction Ends: {auction.auctionEnd}</p>
          <Button className="mt-4 bg-yellow-500 text-white hover:bg-yellow-600">
            View Auction Details
          </Button>
        </Card>
      ));
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-semibold text-center mb-8 text-blue-600">Track Your Orders</h1>

      {/* Tabs for switching between requested crops and auctions */}
      <div className="flex justify-center mb-8">
        <Button
          className={`px-4 py-2 mr-4 ${selectedTab === 'crops' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}
          onClick={() => setSelectedTab('crops')}
        >
          <MdOutlineRequestQuote className="mr-2" /> Requested Crops
        </Button>
        <Button
          className={`px-4 py-2 ${selectedTab === 'auctions' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}
          onClick={() => setSelectedTab('auctions')}
        >
          <GiHammerDrop className="mr-2" /> Registered Auctions
        </Button>
      </div>

      {/* Content based on the selected tab */}
      <div className="mb-8">
        {renderContent()}
      </div>

      {/* Graph Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-center mb-4">Price Trends of Crops</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={priceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="wheat" stroke="#8884d8" />
            <Line type="monotone" dataKey="rice" stroke="#82ca9d" />
            <Line type="monotone" dataKey="corn" stroke="#ffc658" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
