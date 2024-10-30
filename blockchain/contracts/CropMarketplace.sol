// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CropMarketplace {
    struct Crop {
        string name;
        string image;
        string quality;
        string harvestDate;
        uint256 quantity;
        uint256 price; // Price in wei
        address payable seller;
        bool isVerified;
        bool isSold;
        address buyer;
        address assignedAgent; // To track which agent verifies the crop
    }

    struct Auction {
        uint256 cropId;
        uint256 highestBid;
        address highestBidder;
        uint256 auctionEndTime;
        bool auctionEnded;
        bool isAuction;
        address[] bidders; // Store the addresses of bidders for each auction
        mapping(address => uint256) bids; // Store the bid amounts of each bidder
    }

    struct CropWithID {
        uint256 id; // Crop ID
        Crop crop; // Crop data
    }

    mapping(uint256 => Crop) public crops;
    mapping(uint256 => Auction) public auctions;
    uint256 public cropCount;

    address public admin;

    mapping(address => bool) public localAgents;
    mapping(address => uint256[]) public agentCrops; // Mapping to track crops assigned to agents

    event CropListed(
        uint256 cropId,
        string name,
        uint256 quantity,
        address seller,
        string image,
        string harvestDate,
        bool isAuction
    );
    event CropVerified(uint256 cropId, address agent);
    event CropPurchased(uint256 cropId, address buyer);
    event AuctionStarted(uint256 cropId, uint256 auctionEndTime);
    event NewHighestBid(uint256 cropId, address bidder, uint256 amount);
    event AuctionEnded(uint256 cropId, address winner, uint256 amount);
    event AgentAdded(uint256 cropId, address agent); // Event when agent is added to a crop

    constructor() {
        admin = msg.sender;
    }

    // Farmer lists the crop (for sale, by default)
    function listCrop(
        string memory _name,
        string memory _image,
        string memory _harvestDate,
        uint256 _quantity
    ) external {
        cropCount++;
        crops[cropCount] = Crop({
            name: _name,
            image: _image,
            harvestDate: _harvestDate,
            quantity: _quantity,
            seller: payable(msg.sender),
            isVerified: false,
            isSold: false,
            buyer: address(0),
            quality: "",
            price: 0, // Price set later by agent during verification
            assignedAgent: address(0) // Initialize as no agent assigned
        });

        emit CropListed(
            cropCount,
            _name,
            _quantity,
            msg.sender,
            _image,
            _harvestDate,
            false
        );
    }

    // Local agent verifies the crop and sets the price
    function verifyCrop(uint256 _cropId) external onlyAgent {
        require(_cropId > 0 && _cropId <= cropCount, "Invalid Crop ID");
        require(!crops[_cropId].isVerified, "Crop already verified");
        require(!crops[_cropId].isSold, "Crop already sold");

        crops[_cropId].isVerified = true;
        crops[_cropId].assignedAgent = msg.sender; // Assign agent to the crop

        agentCrops[msg.sender].push(_cropId); // Add the crop ID to the agent's list

        emit CropVerified(_cropId, msg.sender);
    }

    // Get crops that are available for sale
    function getCropsForSale() external view returns (CropWithID[] memory) {
        uint256 availableCount = 0;

        for (uint256 i = 1; i <= cropCount; i++) {
            if (
                crops[i].isVerified &&
                !crops[i].isSold &&
                !auctions[i].isAuction
            ) {
                availableCount++;
            }
        }

        CropWithID[] memory availableCropsForSale = new CropWithID[](
            availableCount
        );
        uint256 index = 0;

        for (uint256 i = 1; i <= cropCount; i++) {
            if (
                crops[i].isVerified &&
                !crops[i].isSold &&
                !auctions[i].isAuction
            ) {
                availableCropsForSale[index] = CropWithID({
                    id: i,
                    crop: crops[i]
                });
                index++;
            }
        }

        return availableCropsForSale;
    }

    // Get crops that are available for auction
    function getCropsForAuction() external view returns (CropWithID[] memory) {
        uint256 availableAuctionsCount = 0;

        for (uint256 i = 1; i <= cropCount; i++) {
            if (
                auctions[i].isAuction && crops[i].isVerified && !crops[i].isSold
            ) {
                availableAuctionsCount++;
            }
        }

        CropWithID[] memory availableCropsForAuction = new CropWithID[](
            availableAuctionsCount
        );
        uint256 index = 0;

        for (uint256 i = 1; i <= cropCount; i++) {
            if (
                auctions[i].isAuction && crops[i].isVerified && !crops[i].isSold
            ) {
                availableCropsForAuction[index] = CropWithID({
                    id: i,
                    crop: crops[i]
                });
                index++;
            }
        }

        return availableCropsForAuction;
    }

    // Agents can add quality and set price for the crop after verification
    function addQuality(
        string memory _quality,
        uint256 _price,
        uint256 _cropId
    ) external onlyAgent {
        Crop storage crop = crops[_cropId];
        require(
            crop.isVerified,
            "Crop must be verified before setting quality"
        );
        require(_price > 0, "Price must be greater than zero");

        crop.quality = _quality;
        crop.price = _price; // Set the price along with quality
    }

    function startAuction(uint256 _cropId) external {
        require(!crops[_cropId].isSold, "Cannot auction sold crop");

        uint256 auctionEndTime = block.timestamp + 5 * 60; // 2 minutes = 120 seconds
        auctions[_cropId].auctionEndTime = auctionEndTime;
        auctions[_cropId].isAuction = true;

        emit AuctionStarted(_cropId, auctionEndTime);
    }

    // Bidders place a bid on the crop auction
    function bid(uint256 _cropId) external payable {
        Auction storage auction = auctions[_cropId];
        require(auction.isAuction, "This crop is not up for auction");
        require(block.timestamp <= auction.auctionEndTime, "Auction has ended");
        require(msg.value > auction.highestBid, "Bid is too low");

        if (auction.highestBid > 0) {
            payable(auction.highestBidder).transfer(auction.highestBid);
        }

        auction.highestBidder = msg.sender;
        auction.highestBid = msg.value;
        auction.bidders.push(msg.sender); // Track the bidder
        auction.bids[msg.sender] = msg.value; // Store the bid amount for the bidder

        emit NewHighestBid(_cropId, msg.sender, msg.value);
    }

    function getBiddersForCrop(
        uint256 _cropId
    ) external view returns (address[] memory, uint256[] memory) {
        Auction storage auction = auctions[_cropId];
        require(auction.isAuction, "This crop is not up for auction");

        uint256 biddersCount = auction.bidders.length;
        address[] memory bidders = new address[](biddersCount);
        uint256[] memory bids = new uint256[](biddersCount);

        for (uint256 i = 0; i < biddersCount; i++) {
            bidders[i] = auction.bidders[i];
            bids[i] = auction.bids[bidders[i]];
        }

        return (bidders, bids);
    }

    function getHighestBid(uint256 _cropId) external view returns (uint256) {
        Auction storage auction = auctions[_cropId];
        require(auction.isAuction, "This crop is not up for auction");
        return auction.highestBid; // Return the highest bid amount
    }

    function getCropDetails(
        uint256 _cropId
    )
        external
        view
        returns (
            uint256 cropId,
            string memory name,
            string memory image,
            string memory quality,
            string memory harvestDate,
            uint256 quantity,
            uint256 price,
            address seller,
            bool isVerified,
            bool isSold,
            address buyer,
            address assignedAgent
        )
    {
        Crop storage crop = crops[_cropId];
        return (
            _cropId, // Return the crop ID
            crop.name,
            crop.image,
            crop.quality,
            crop.harvestDate,
            crop.quantity,
            crop.price,
            crop.seller,
            crop.isVerified,
            crop.isSold,
            crop.buyer,
            crop.assignedAgent // Return the agent assigned to the crop
        );
    }

    function getCropsByAgent(
        address _agent
    ) external view returns (CropWithID[] memory) {
        uint256 resultCount = 0;

        // First count how many crops are assigned to the agent
        for (uint256 i = 1; i <= cropCount; i++) {
            if (crops[i].assignedAgent == _agent) {
                resultCount++;
            }
        }

        CropWithID[] memory result = new CropWithID[](resultCount);
        uint256 index = 0;

        // Store crops assigned to the agent
        for (uint256 i = 1; i <= cropCount; i++) {
            if (crops[i].assignedAgent == _agent) {
                result[index] = CropWithID({
                    id: i, // Set the crop ID
                    crop: crops[i] // Set the crop data
                });
                index++;
            }
        }

        return result;
    }

    // Finalize the auction and transfer funds to the seller
    function finalizeAuction(uint256 _cropId) external onlySeller(_cropId) {
        Auction storage auction = auctions[_cropId];
        require(auction.isAuction, "This crop is not up for auction");
        require(
            block.timestamp > auction.auctionEndTime,
            "Auction not yet ended"
        );
        require(!auction.auctionEnded, "Auction already finalized");

        auction.auctionEnded = true;

        if (auction.highestBidder != address(0)) {
            crops[_cropId].seller.transfer(auction.highestBid);
            crops[_cropId].isSold = true;
            crops[_cropId].buyer = auction.highestBidder;

            emit AuctionEnded(
                _cropId,
                auction.highestBidder,
                auction.highestBid
            );
        } else {
            emit AuctionEnded(_cropId, address(0), 0);
        }
    }

    // Add a local agent to a specific crop (only admin can add)
    function addLocalAgent(address _agent, uint256 _cropId) external onlyAdmin {
        require(_cropId > 0 && _cropId <= cropCount, "Invalid Crop ID");
        require(!crops[_cropId].isSold, "Crop already sold");

        // Set the agent as a local agent if not already registered
        if (!localAgents[_agent]) {
            localAgents[_agent] = true;
        }

        crops[_cropId].assignedAgent = _agent; // Assign the agent to the crop

        emit AgentAdded(_cropId, _agent);
    }

    // Remove a local agent (only admin can remove)
    function removeLocalAgent(address _agent) external onlyAdmin {
        localAgents[_agent] = false;
    }

    // Purchase a crop directly (outside of auction)
    function purchaseCrop(uint256 _cropId) external payable {
        Crop storage crop = crops[_cropId];
        require(_cropId > 0 && _cropId <= cropCount, "Invalid Crop ID");
        require(crop.isVerified, "Crop must be verified");
        require(!crop.isSold, "Crop already sold");
        require(msg.value == crop.price, "Incorrect price");

        crop.seller.transfer(msg.value);
        crop.isSold = true;
        crop.buyer = msg.sender;

        emit CropPurchased(_cropId, msg.sender);
    }

    // Modifiers
    modifier onlySeller(uint256 _cropId) {
        require(
            crops[_cropId].seller == msg.sender,
            "Only seller can call this"
        );
        _;
    }

    modifier onlyAgent() {
        require(localAgents[msg.sender], "Only local agents can call this");
        _;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this");
        _;
    }
}
