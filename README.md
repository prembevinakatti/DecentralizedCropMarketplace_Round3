# Crop Marketplace

## Overview

Crop Marketplace is a decentralized platform that allows farmers to list their crops for sale or auction, enabling direct interactions between sellers and buyers in a transparent and trustless environment. The platform utilizes Ethereum smart contracts to manage crop listings, purchases, and auctions securely.

The platform also includes a role for local agents, who can verify crops on behalf of farmers to ensure quality and trustworthiness.

## Features

- **Crop Listing**: Farmers can list their crops with details like name, price, image, and quantity.
- **Crop Verification**: Local agents can verify the quality of the crops, ensuring buyers of their authenticity.
- **Auction Mechanism**: Sellers can start an auction for their crops, where buyers can place bids within a set auction duration.
- **Purchase**: Buyers can purchase verified crops by paying the listed price.
- **Local Agents**: Only authorized agents can verify crops and add quality information.

## Smart Contract Structure

The contract is written in Solidity and contains two main structs:
- **Crop**: Stores basic information about the crop (name, price, seller, etc.).
- **Auction**: Manages auction details like highest bid, highest bidder, and auction end time.

## Prerequisites

To collaborate and run this project locally, ensure you have the following installed:

- **Node.js**: JavaScript runtime for backend.
- **npm**: Package manager for JavaScript.
- **Hardhat**: Development environment for Ethereum smart contract development.
- **Metamask**: Wallet for interacting with the Ethereum blockchain.

## Setup Instructions

1. **Client**:
   ```bash
   cd client
   npm run dev

2. **Server**:
   ```bash
   cd server
   npm run dev

3. **BlockChain**:
   ```bash
   cd blockchain
   npx hardhat compile
   npx hardhat run scripts/deploy.js
   npx hardhat run --network linea scripts/deploy.js

