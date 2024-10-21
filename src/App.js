import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import SACCOWalletABI from './artifacts/contracts/SACCOWallet.json'; // Import the ABI
import './style.css'; 

const App = () => {
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState('0');
  const [saccoBalance, setSaccoBalance] = useState('0');
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [status, setStatus] = useState('');
  
  const contractAddress = process.env.DEPLOYED_CONTRACT_ADDRESS;
  let web3;
  let saccoWalletContract;

  // Initialize Web3 and the contract instance
  useEffect(() => {
    if (window.ethereum) {
      web3 = new Web3(window.ethereum);
      saccoWalletContract = new web3.eth.Contract(SACCOWalletABI, contractAddress);
      
      window.ethereum.request({ method: 'eth_requestAccounts' })
        .then(accounts => {
          setAccount(accounts[0]);
          getAccountBalance(accounts[0]);
        })
        .catch((err) => {
          setStatus(`Failed to connect wallet: ${err.message}`);
        });
    } else {
      alert('Please install MetaMask to use this app!');
    }
  }, []);

  // Get account balance
  const getAccountBalance = async (account) => {
    const balance = await web3.eth.getBalance(account);
    setBalance(web3.utils.fromWei(balance, 'ether'));
  };

  // Get SACCO wallet balance
  const getSaccoBalance = async () => {
    try {
      const saccoBalance = await saccoWalletContract.methods.getBalance().call({ from: account });
      setSaccoBalance(web3.utils.fromWei(saccoBalance, 'ether'));
    } catch (error) {
      setStatus(`Error fetching SACCO balance: ${error.message}`);
    }
  };

  // Deposit function
  const handleDeposit = async () => {
    try {
      setStatus('Processing deposit...');
      await saccoWalletContract.methods.deposit().send({
        from: account,
        value: web3.utils.toWei(depositAmount, 'ether'),
        gas: 2000000,
      });
      setStatus(`Successfully deposited ${depositAmount} ETH`);
      setDepositAmount('');
      getSaccoBalance(); // Refresh SACCO balance
    } catch (error) {
      setStatus(`Deposit failed: ${error.message}`);
    }
  };

  // Withdraw function
  const handleWithdraw = async () => {
    try {
      setStatus('Processing withdrawal...');
      await saccoWalletContract.methods.withdraw(web3.utils.toWei(withdrawAmount, 'ether')).send({
        from: account,
        gas: 2000000,
      });
      setStatus(`Successfully withdrew ${withdrawAmount} ETH`);
      setWithdrawAmount('');
      getSaccoBalance(); // Refresh SACCO balance
    } catch (error) {
      setStatus(`Withdrawal failed: ${error.message}`);
    }
  };

  return (
    <div className="app-container">
      <h1>SACCO Wallet</h1>

      <div className="wallet-info">
        <h2>Wallet Information</h2>
        <p>Account: {account}</p>
        <p>Account Balance: {balance} ETH</p>
      </div>

      <div className="sacco-info">
        <h2>SACCO Information</h2>
        <button onClick={getSaccoBalance}>Check SACCO Balance</button>
        <p>SACCO Balance: {saccoBalance} ETH</p>
      </div>

      <div className="actions">
        <h2>Deposit to SACCO</h2>
        <input
          type="text"
          value={depositAmount}
          onChange={(e) => setDepositAmount(e.target.value)}
          placeholder="Amount in ETH"
        />
        <button onClick={handleDeposit}>Deposit</button>

        <h2>Withdraw from SACCO</h2>
        <input
          type="text"
          value={withdrawAmount}
          onChange={(e) => setWithdrawAmount(e.target.value)}
          placeholder="Amount in ETH"
        />
        <button onClick={handleWithdraw}>Withdraw</button>
      </div>

      <div className="status">
        <h3>Status</h3>
        <p>{status}</p>
      </div>
    </div>
  );
};

export default App;
