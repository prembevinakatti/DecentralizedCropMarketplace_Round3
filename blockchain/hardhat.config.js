require("@nomicfoundation/hardhat-toolbox");

require("dotenv").config();
/** @type import('hardhat/config').HardhatUserConfig */

const LINEA_URL = process.env.LINEA_URL;
const API_KEY = process.env.API_KEY;
module.exports = {
  solidity: "0.8.20",
  networks: {
    linea: {
      url: LINEA_URL,
      accounts: [API_KEY],
    },
  },
};

