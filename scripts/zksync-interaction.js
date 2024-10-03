const { Web3 } = require('web3');
const { ZKsyncPlugin } = require('web3-plugin-zksync');

async function main() {
  const web3 = new Web3(/* optional L1 provider */);
  // create a plugin instance with the L2 provider
  web3.registerPlugin(new ZKsyncPlugin("https://sepolia.era.zksync.dev"));
  const zksync = web3.ZKsync;
  console.log("L2 contract addresses:", await zksync.ContractsAddresses);
}

main()
  .then(() => console.log("✅ Script executed successfully"))
  .catch((error) => console.error(`❌ Error executing script: ${error}`));