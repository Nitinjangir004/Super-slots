# Super Slot

Super Slot is a decentralized Ethereum-based slot machine game featuring popular memecoins. Players can spin the slots for a chance to win ETH from the prize pool.
 
- Frontend: https://super-slot.vercel.app/
- Contract Deployed on Scroll Sepolia Testnet: [0x6da2F4963E3c936DfF4cea3a9a6C521807895C6E](https://sepolia.scrollscan.com/address/0x6da2F4963E3c936DfF4cea3a9a6C521807895C6E)


## Features

- Connect to Ethereum wallet (e.g., MetaMask)
- Spin the slot machine with memecoin-themed symbols
- Win ETH prizes based on symbol combinations
- Real-time updates of prize pool and player balance
- Responsive design for desktop and mobile devices

## Technologies Used

- React
- TypeScript
- ethers.js
- Solidity (for the smart contract)

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)
- An Ethereum wallet (e.g., MetaMask) installed in your browser
- Some ETH in your wallet for transactions (on the network where the contract is deployed)

## Installation

1. Clone the repository:
git clone https://github.com/justforkityo/Super-Slot.git

Copy

2. Navigate to the project directory:
cd Super-Slot

Copy

3. Install the dependencies:
npm install

Copy

4. Create a `.env` file in the root directory and add your contract address:
REACT_APP_CONTRACT_ADDRESS=your_contract_address_here

Copy

## Usage

1. Start the development server:
npm start

livecodeserver
Copy

2. Open your browser and visit `http://localhost:3000`

3. Connect your Ethereum wallet by clicking the "Connect Wallet" button.

4. Once connected, you can spin the slot machine by clicking the "Spin" button. Each spin costs 0.001 ETH.

5. If you win, your prize will be automatically credited to your wallet.

## Smart Contract

The Super Slot game interacts with a Solidity smart contract deployed on the Ethereum network. The contract handles the following:

- Managing the prize pool
- Processing spins and determining results
- Distributing winnings

Make sure to deploy the smart contract and update the contract address in your `.env` file before running the application.

## Contributing

Contributions to Super Slot are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Make your changes and commit them: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- Memecoin icons used in this project are for illustrative purposes only and may be subject to copyright.
- This project is for educational purposes and should not be used for real gambling.

## Disclaimer

Super Slot is a demonstration project and should not be used for real gambling purposes. Always gamble responsibly and be aware of the risks involved in cryptocurrency transactions.