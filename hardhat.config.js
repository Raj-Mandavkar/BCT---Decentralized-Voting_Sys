require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },

  networks: {
    // ── Local Hardhat node (default) ────────────────────────────────────────
    // Run:  npx hardhat node
    // Then: npx hardhat run scripts/deploy.js --network localhost
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },

    // ── Sepolia Testnet (optional) ───────────────────────────────────────────
    // Fill SEPOLIA_RPC_URL and PRIVATE_KEY in your .env to use this network.
    // Run:  npx hardhat run scripts/deploy.js --network sepolia
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
      chainId: 11155111,
    },
  },

  // Saves compiled ABI + bytecode artifacts here (consumed by the React frontend)
  paths: {
    artifacts: "./artifacts",
    sources:   "./contracts",
    tests:     "./test",
    cache:     "./cache",
  },
};
