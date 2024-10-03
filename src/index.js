const SACCOWalletManager = require('./wallet');
const SACCOWallet = require("../artifacts/contracts/SACCOWallet.sol/SACCOWallet.json");

async function main() {
  // Setting up SACCOWalletManager
  const privateKey = "<YOUR_PRIVATE_KEY>";
  const walletManager = new SACCOWalletManager(privateKey);

  // Setting up contract instance
  const contractAddress = "<DEPLOYED_CONTRACT_ADDRESS>";
  const saccoWallet = new walletManager.web3.eth.Contract(SACCOWallet.abi, contractAddress);

  // Depositing
  const depositAmount = "0.1";
  const depositTx = await walletManager.depositToSACCO(contractAddress, depositAmount);
  console.log("Deposit transaction:", depositTx.transactionHash);

  // Checking balance
  const balance = await saccoWallet.methods.getBalance().call({ from: walletManager.account.address });
  console.log("Balance:", walletManager.web3.utils.fromWei(balance, "ether"));

  // Withdraw
  const withdrawAmount = "0.05";
  const withdrawTx = await walletManager.withdrawFromSACCO(contractAddress, withdrawAmount);
  console.log("Withdraw transaction:", withdrawTx.transactionHash);

  // Checking balance
  const newBalance = await saccoWallet.methods.getBalance().call({ from: walletManager.account.address });
  console.log("New Balance:", walletManager.web3.utils.fromWei(newBalance, "ether"));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });