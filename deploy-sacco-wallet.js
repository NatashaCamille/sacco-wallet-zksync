import { Web3 } from 'web3';
import solc from 'solc';
import fs from 'fs';

// Setup web3 with your provider (e.g., Infura)
const web3 = new Web3('https://sepolia.infura.io/v3/YOUR-PROJECT-ID');

// Your account's private key
const privateKey = 'YOUR_PRIVATE_KEY';
const account = web3.eth.accounts.privateKeyToAccount(privateKey);
web3.eth.accounts.wallet.add(account);

// Compile the contract
const contractSource = fs.readFileSync('SACCOWallet.sol', 'utf8');

const input = {
    language: 'Solidity',
    sources: {
        'SACCOWallet.sol': {
            content: contractSource
        }
    },
    settings: {
        outputSelection: {
            '*': {
                '*': ['*']
            }
        }
    }
};

const compiledContract = JSON.parse(solc.compile(JSON.stringify(input)));
const abi = compiledContract.contracts['SACCOWallet.sol']['SACCOWallet'].abi;
const bytecode = compiledContract.contracts['SACCOWallet.sol']['SACCOWallet'].evm.bytecode.object;

async function deployContract() {
    const contract = new web3.eth.Contract(abi);
    
    const deployTx = contract.deploy({
        data: '0x' + bytecode,
        arguments: [] // SACCOWallet doesn't have constructor arguments
    });

    const gas = await deployTx.estimateGas();

    const deployedContract = await deployTx
        .send({
            from: account.address,
            gas
        })
        .on('error', (error) => {
            console.error('Error:', error);
        })
        .on('transactionHash', (transactionHash) => {
            console.log('Transaction Hash:', transactionHash);
        })
        .on('receipt', (receipt) => {
            console.log('Contract Address:', receipt.contractAddress);
        });

    console.log('Contract deployed at address:', deployedContract.options.address);
    return deployedContract.options.address;
}

async function main() {
    try {
        const contractAddress = await deployContract();
        console.log('Deployment successful. Contract address:', contractAddress);
        
        // Save the contract address and ABI
        fs.writeFileSync('contractAddress.txt', contractAddress);
        fs.writeFileSync('contractABI.json', JSON.stringify(abi, null, 2));
    } catch (error) {
        console.error('Deployment failed:', error);
    }
}

main();