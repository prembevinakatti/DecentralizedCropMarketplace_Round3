const hre = require("hardhat");

async function main() {
  try {
    const Crop = await hre.ethers.getContractFactory("CropMarketplace");

    const crop = await Crop.deploy();

    await crop.waitForDeployment();

    console.log(`Deployed Contract Address Is : ${crop.target}`);
  } catch (error) {
    console.log("Error in deploying", error.message);
  }
}

main()
  .then(() => {
    console.log("Deployed successfully");
  })
  .catch((error) => {
    console.log("Deploy failed: " + error.message);
  });

  