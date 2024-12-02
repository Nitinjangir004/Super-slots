import { ethers } from "hardhat";

async function main() {
  const SuperSlot = await ethers.getContractFactory("SuperSlot");
  console.log("Deploying SuperSlot...");
  const superSlot = await SuperSlot.deploy();
  await superSlot.waitForDeployment();
  const address = await superSlot.getAddress();
  console.log("SuperSlot deployed to:", address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});