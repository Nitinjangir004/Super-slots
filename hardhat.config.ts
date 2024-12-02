import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.19",
  networks: {
    goerli: {
      url: `https://eth-goerli.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`,
      accounts: [process.env.PRIVATE_KEY!]
    },
    scroll_sepolia: {
      url: `https://sepolia-rpc.scroll.io/`,
      accounts: [process.env.PRIVATE_KEY!]
    }
  }
};

export default config;