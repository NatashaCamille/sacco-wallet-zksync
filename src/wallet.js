const { Web3 } = require('web3');
const { ZKsyncPlugin } = require('web3-plugin-zksync');

class SACCOWalletManager {
  constructor(privateKey, contractABI, contractAddress) {
    this.web3 = new Web3('https://zksync2-testnet.zksync.dev');
    this.web3.registerPlugin(new ZKsyncPlugin());
    this.zksync = this.web3.ZKsync;
    
    this.account = this.web3.eth.accounts.privateKeyToAccount(privateKey);
    this.web3.eth.accounts.wallet.add(this.account);
    this.web3.eth.defaultAccount = this.account.address;

    this.contract = new this.web3.eth.Contract(contractABI, contractAddress);
  }

  async getBalance() {
    return await this.contract.methods.getBalance().call({ from: this.account.address });
  }

  async deposit(amount) {
    const tx = await this.web3.eth.sendTransaction({
      from: this.account.address,
      to: this.contract.options.address,
      data: this.contract.methods.deposit().encodeABI(),
      value: this.web3.utils.toWei(amount, "ether"),
    });
    return tx;
  }

  async withdraw(amount) {
    const tx = await this.web3.eth.sendTransaction({
      from: this.account.address,
      to: this.contract.options.address,
      data: this.contract.methods.withdraw(this.web3.utils.toWei(amount, "ether")).encodeABI(),
    });
    return tx;
  }
}

module.exports = SACCOWalletManager;