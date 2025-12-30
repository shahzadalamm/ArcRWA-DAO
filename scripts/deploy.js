const hre = require("hardhat");

async function main() {
  // 1. Enterprise Token
  const ENT = await hre.ethers.getContractFactory("EnterpriseToken");
  const ent = await ENT.deploy();
  await ent.waitForDeployment();
  console.log("ENT_TOKEN_ADDRESS:", await ent.getAddress());

  // 2. Asset Registry
  const Registry = await hre.ethers.getContractFactory("AssetRegistry");
  const registry = await Registry.deploy();
  await registry.waitForDeployment();
  console.log("REGISTRY_ADDRESS:", await registry.getAddress());

  // Pehle se deployed DAO address hum yahan note kar chuke hain
  console.log("DAO_ADDRESS: 0x056263C13686a1897c710cCCaEd2E8754160CA5a");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
