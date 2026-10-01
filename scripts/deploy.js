// scripts/deploy.js
// ──────────────────────────────────────────────────────────────────────────────
// Deploys Voting.sol to the selected network and writes the contract address +
// ABI to  frontend/src/contracts/  so the React app can pick them up
// automatically — no manual copy-paste required.
//
// Usage:
//   npx hardhat run scripts/deploy.js --network localhost   (Hardhat node)
//   npx hardhat run scripts/deploy.js --network sepolia     (Testnet)
// ──────────────────────────────────────────────────────────────────────────────

const { ethers, artifacts, network } = require("hardhat");
const path = require("path");
const fs   = require("fs");

async function main() {
  // ── 1. Log deployer info ─────────────────────────────────────────────────
  const [deployer] = await ethers.getSigners();
  console.log("\n🚀  Deploying Voting contract...");
  console.log("    Deployer address :", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("    Deployer balance :", ethers.formatEther(balance), "ETH\n");

  // ── 2. Bootstrap candidates ──────────────────────────────────────────────
  // These names will be registered inside the constructor.
  // Edit this array freely before deploying.
  const initialCandidates = [
    "Alice Johnson",
    "Bob Martinez",
    "Carol Williams",
    "David Lee",
  ];

  // ── 3. Deploy ────────────────────────────────────────────────────────────
  const VotingFactory = await ethers.getContractFactory("Voting");
  const voting        = await VotingFactory.deploy(initialCandidates);

  await voting.waitForDeployment();           // ethers v6 API

  const contractAddress = await voting.getAddress();
  console.log("✅  Voting deployed at :", contractAddress);

  // ── 4. Export ABI + address for the React frontend ───────────────────────
  const frontendDir = path.join(__dirname, "..", "frontend", "src", "contracts");
  if (!fs.existsSync(frontendDir)) {
    fs.mkdirSync(frontendDir, { recursive: true });
  }

  // Copy the full artifact (contains ABI, bytecode, etc.)
  const votingArtifact = await artifacts.readArtifact("Voting");
  fs.writeFileSync(
    path.join(frontendDir, "Voting.json"),
    JSON.stringify(votingArtifact, null, 2)
  );

  // Write a tiny config file with just the address (and network chain ID)
  const { chainId } = await ethers.provider.getNetwork();
  const contractConfig = {
    address    : contractAddress,
    chainId    : chainId.toString(),
    network    : network.name,
    deployedAt : new Date().toISOString(),
  };
  fs.writeFileSync(
    path.join(frontendDir, "contractConfig.json"),
    JSON.stringify(contractConfig, null, 2)
  );

  console.log("\n📦  ABI  saved to  frontend/src/contracts/Voting.json");
  console.log("📦  Addr saved to  frontend/src/contracts/contractConfig.json");
  console.log("\n🎉  Phase 1 complete — ready for Phase 2 (testing)!\n");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
