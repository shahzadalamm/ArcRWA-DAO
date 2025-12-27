const hre = require("hardhat");

async function main() {
  console.log("Deploying AssetDAO...");

  const AssetDAO = await hre.ethers.getContractFactory("AssetDAO");
  // 0x0... address ki jagah hum filhal dummy address de rahe hain
  const dao = await AssetDAO.deploy("0x0000000000000000000000000000000000000000");

  await dao.waitForDeployment();

  console.log("AssetDAO deployed to:", await dao.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
