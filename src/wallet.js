const zksync = require("zksync-web3");
const Web3 = require("web3");

class SACCOWalletManager {
  constructor(privateKey) {
    this.provider = new zksync.Web3Provider("https://zksync2-testnet.zksync.dev");
    this.web3 = new Web3(this.provider);
    this.signer = new zksync.Wallet(privateKey, this.provider);
    this.account = this.web3.eth.accounts.privateKeyToAccount(privateKey);
    this.web3.eth.accounts.wallet.add(this.account);
    this.web3.eth.defaultAccount = this.account.address;
  }

  async getBalance() {
    return await this.web3.eth.getBalance(this.account.address);
  }

  async transfer(to, amount) {
    const tx = await this.signer.sendTransaction({
      to,
      value: this.web3.utils.toWei(amount, "ether"),
    });
    await tx.wait();
    return tx;
  }

  async depositToSACCO(saccoContractAddress, amount) {
    const saccoContract = new this.web3.eth.Contract(
      ["function deposit() payable"],
      saccoContractAddress
    );
    const tx = await this.signer.sendTransaction({
      to: saccoContractAddress,
      data: saccoContract.methods.deposit().encodeABI(),
      value: this.web3.utils.toWei(amount, "ether"),
    });
    await tx.wait();
    return tx;
  }

  async withdrawFromSACCO(saccoContractAddress, amount) {
    const saccoContract = new this.web3.eth.Contract(
      ["function withdraw(uint256 amount)"],
      saccoContractAddress
    );
    const tx = await this.signer.sendTransaction({
      to: saccoContractAddress,
      data: saccoContract.methods.withdraw(this.web3.utils.toWei(amount, "ether")).encodeABI(),
    });
    await tx.wait();
    return tx;
  }
}

module.exports = SACCOWalletManager;