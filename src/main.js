
const contractABI = [ 
    {
      "inputs": [],
      "name": "deposit",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getBalance",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "withdraw",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
   ];
const contractAddress = "<DEPLOYED_CONTRACT_ADDRESS>";
let web3;
let saccoWalletContract;
let account;

window.onload = async function() {
  // Connect to Web3 (MetaMask)
  const connectWalletBtn = document.getElementById('connectWallet');
  connectWalletBtn.onclick = connectWallet;

  // Deposit event
  const depositBtn = document.getElementById('depositBtn');
  depositBtn.onclick = depositToSACCO;

  // Withdraw event
  const withdrawBtn = document.getElementById('withdrawBtn');
  withdrawBtn.onclick = withdrawFromSACCO;

  // Check SACCO balance event
  const checkBalanceBtn = document.getElementById('checkBalanceBtn');
  checkBalanceBtn.onclick = checkSACCOBalance;
};

async function connectWallet() {
  if (window.ethereum) {
    try {
      // Request account access if needed
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      web3 = new Web3(window.ethereum);
      const accounts = await web3.eth.getAccounts();
      account = accounts[0];
      
      // Display the account address
      document.getElementById('accountAddress').innerText = `Account: ${account}`;
      
      // Set up the contract instance
      saccoWalletContract = new web3.eth.Contract(contractABI, contractAddress);

      // Fetches and displays the account balance
      const balance = await web3.eth.getBalance(account);
      document.getElementById('accountBalance').innerText = `Balance: ${web3.utils.fromWei(balance, "ether")} ETH`;

    } catch (err) {
      console.error("Wallet connection failed:", err);
    }
  } else {
    alert("Please install MetaMask!");
  }
}

async function depositToSACCO() {
  const depositAmount = document.getElementById('depositAmount').value;
  if (!depositAmount) return alert("Please enter a deposit amount");

  const depositStatus = document.getElementById('depositStatus');
  depositStatus.innerText = "Processing deposit...";

  try {
    await saccoWalletContract.methods.deposit().send({
      from: account,
      value: web3.utils.toWei(depositAmount, "ether"),
      gas: 2000000,
    });

    depositStatus.innerText = `Successfully deposited ${depositAmount} ETH`;
  } catch (err) {
    depositStatus.innerText = `Deposit failed: ${err.message}`;
  }
}

async function withdrawFromSACCO() {
  const withdrawAmount = document.getElementById('withdrawAmount').value;
  if (!withdrawAmount) return alert("Please enter a withdrawal amount");

  const withdrawStatus = document.getElementById('withdrawStatus');
  withdrawStatus.innerText = "Processing withdrawal...";

  try {
    await saccoWalletContract.methods.withdraw(web3.utils.toWei(withdrawAmount, "ether")).send({
      from: account,
      gas: 2000000,
    });

    withdrawStatus.innerText = `Successfully withdrew ${withdrawAmount} ETH`;
  } catch (err) {
    withdrawStatus.innerText = `Withdrawal failed: ${err.message}`;
  }
}

async function checkSACCOBalance() {
  try {
    const saccoBalance = await saccoWalletContract.methods.getBalance().call({ from: account });
    document.getElementById('saccoBalance').innerText = `SACCO Balance: ${web3.utils.fromWei(saccoBalance, "ether")} ETH`;
  } catch (err) {
    console.error("Failed to fetch SACCO balance:", err);
  }
}
