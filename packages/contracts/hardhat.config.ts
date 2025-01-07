import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config({ path: '../../.env' });

const config: HardhatUserConfig = {
  solidity: "0.8.19",
  paths: {
    sources: "./src/contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  networks: {
    hardhat: {
      // Local development network
    },
    mode: {
      url: process.env.MODE_NETWORK_URL || "https://mainnet.mode.network/",
      accounts: process.env.MODE_PRIVATE_KEY ? [process.env.MODE_PRIVATE_KEY] : [],
      chainId: 34443,
    }
  },
  etherscan: {
    apiKey: {
      mode: "any" // Mode doesn't require an API key
    },
    customChains: [
      {
        network: "mode",
        chainId: 34443,
        urls: {
          apiURL: "https://explorer.mode.network/api",
          browserURL: "https://explorer.mode.network/"
        }
      }
    ]
  }
};

export default config; 