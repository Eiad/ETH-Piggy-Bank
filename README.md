# PiggyBank Smart Contract Deployment & Frontend Integration

## Overview
Welcome to the PiggyBank project! This repository contains a Solidity smart contract that allows users to deposit ETH with a specified lock time and withdraw it once the lock period has expired. The project includes a Next.js frontend that interacts with the smart contract, enabling users to deposit, withdraw, and check their balances seamlessly.

## Features
- **Deposit ETH**: Users can deposit ETH with a customizable lock time.
- **Withdraw ETH**: Users can withdraw their funds once the lock time has expired.
- **View Deposit Details**: Users can check their deposit amount and unlock time.
- **Responsive Design**: Built with TailwindCSS for a modern and responsive user interface.
- **Web3 Integration**: Connects with MetaMask for easy wallet interactions.

## Getting Started

### 1️⃣ Hardhat Deployment Setup
- Use `hardhat.config.js` to connect to the Sepolia Testnet via Alchemy.
- Store sensitive information such as the Alchemy API key and wallet private key in a `.env` file.
- Compile and deploy the smart contract to Sepolia.
- Log the deployed contract address for future reference.

### Smart Contract Verification
- Verify the contract on Sepolia Etherscan using Hardhat plugins.
- Ensure the contract is publicly viewable for transparency.

### Next.js Frontend
- Create a React app using Next.js.
- Utilize `ethers.js` to interact with the smart contract.
- Implement the following functions:
  - **Deposit ETH**: Allow users to set a lock time for their deposits.
  - **Withdraw ETH**: Ensure users can only withdraw after the unlock time.
  - **View Deposit Details**: Display the amount deposited and the unlock time.
- Style the application using TailwindCSS for a sleek look.

### Web3 Integration
- Enable MetaMask connection for user authentication.
- Fetch and display the user's wallet balance.
- Provide real-time updates on contract interactions.

### Testing & Optimization
- Use Sepolia ETH from a faucet for testing purposes.
- Handle edge cases such as zero deposits and early withdrawals.
- Optimize gas usage for efficient transactions.

## Next Steps
1. Deploy the smart contract and confirm its address on Sepolia.
2. Generate a user-friendly Next.js UI to interact with the contract.
3. Optimize the application and prepare it for a portfolio showcase.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
