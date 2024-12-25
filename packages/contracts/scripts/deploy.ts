import { ethers } from "hardhat";

async function main() {
  console.log("Deploying RoundManager...");

  const RoundManager = await ethers.getContractFactory("RoundManager");
  const roundManager = await RoundManager.deploy();

  await roundManager.waitForDeployment();

  console.log(
    `RoundManager deployed to ${await roundManager.getAddress()}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 