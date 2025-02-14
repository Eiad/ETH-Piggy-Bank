# 🚀 Welcome to Crypto Piggy Bank Beta! 🌟

## 🌐 Live Demo
Check out our live application at [Crypto Piggy Bank](https://crypto-piggy.vercel.app/)! Experience the future of savings today!

## Overview
Welcome to the **Crypto Piggy Bank** project! This innovative application allows users to securely deposit ETH with a customizable lock time, ensuring that your funds remain untouched until you're ready to access them. Built on the Ethereum blockchain, this project combines the power of smart contracts with a sleek, user-friendly interface.

## Features
- **Time-Locked Savings**: Deposit ETH and set a lock duration to keep your savings secure.
- **Withdraw with Confidence**: Access your funds only after the specified unlock time has passed.
- **View Deposit Details**: Easily check your deposit amount and unlock time.
- **Responsive Design**: Enjoy a modern and responsive user interface built with TailwindCSS.
- **Web3 Integration**: Seamlessly connect with MetaMask for effortless wallet interactions.

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
This project is licensed under the MIT License. You can view the license details in the [License tab](https://github.com/Eiad/ETH-Piggy-Bank?tab=License-1-ov-file) on the GitHub page.
