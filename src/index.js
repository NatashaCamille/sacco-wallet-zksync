

const SACCOWalletManager = require('./wallet');
const contractABI = require('./SACCOWallet.json');  

async function main() {
  const privateKey = process.env.API_KEY;
  const contractAddress = "<DEPLOYED_CONTRACT_ADDRESS>";
  
  const walletManager = new SACCOWalletManager(privateKey, contractABI, contractAddress);

  // Deposit
  const depositAmount = "0.1";
  const depositTx = await walletManager.deposit(depositAmount);
  console.log("Deposit transaction:", depositTx.transactionHash);

  // Checking balance
  const balance = await walletManager.getBalance();
  console.log("Balance:", walletManager.web3.utils.fromWei(balance, "ether"));

  // Withdraw
  const withdrawAmount = "0.05";
  const withdrawTx = await walletManager.withdraw(withdrawAmount);
  console.log("Withdraw transaction:", withdrawTx.transactionHash);


  const newBalance = await walletManager.getBalance();
  console.log("New Balance:", walletManager.web3.utils.fromWei(newBalance, "ether"));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });