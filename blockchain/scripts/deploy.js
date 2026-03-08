const hre = require("hardhat");

async function main() {
  const CryptoPrediction = await hre.ethers.getContractFactory("CryptoPrediction");
  const prediction = await CryptoPrediction.deploy();

  await prediction.waitForDeployment();

  console.log(`CryptoPrediction deployed to: ${await prediction.getAddress()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
