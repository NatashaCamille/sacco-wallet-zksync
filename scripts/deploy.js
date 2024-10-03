const { Wallet, utils } = require("zksync-web3");
const { Deployer } = require("@matterlabs/hardhat-zksync-deploy");

async function main() {
  const wallet = new Wallet("<YOUR_PRIVATE_KEY>");
  const deployer = new Deployer(hre, wallet);
  const artifact = await deployer.loadArtifact("SACCOWallet");
  
  const deploymentFee = await deployer.estimateDeployFee(artifact, []);
  
  const parsedFee = ethers.utils.formatEther(deploymentFee.toString());
  console.log(`The deployment is estimated to cost ${parsedFee} ETH`);

  const saccoWallet = await deployer.deploy(artifact, []);

  console.log("SACCO Wallet address: ", saccoWallet.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
