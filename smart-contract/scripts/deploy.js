const hre = require("hardhat");

async function main() {
  const Crowdfunding = await hre.ethers.getContractFactory("Crowdfunding");

  const crowdfunding = await Crowdfunding.deploy(); // no need for await .deployed() in v6

  console.log("✅ Contract deployed to:", crowdfunding.target); // 👈 use .target instead of .address
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment error:", error);
    process.exit(1);
  });
