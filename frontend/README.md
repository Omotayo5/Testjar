# TipsJar Frontend

React frontend application for the TipsJar Stacks smart contract with Stacks.js integration.

## Features

- 🔐 **Wallet Connection** - Connect with Hiro or Leather wallet via @stacks/connect
- 💸 **Send Tip** - Input recipient address + amount in STX, broadcasts transaction
- 🔍 **View Tip** - Query contract with get-tip to see tip amounts between addresses
- 🎨 **Modern UI** - Clean gradient design with responsive layout
- ⚡ **Real-time Updates** - Shows transaction status and errors
- 💰 **STX Conversion** - Handles microSTX ↔ STX conversion automatically

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Update contract details in `src/App.js`:**
   - Set `CONTRACT_ADDRESS` to your deployed contract address
   - Set `CONTRACT_NAME` if different from 'tipsjar'
   - Change `NETWORK` to `StacksMainnet()` for mainnet deployment

3. **Run the development server:**
   ```bash
   npm start
   ```

4. **Open [http://localhost:3000](http://localhost:3000)** in your browser

## Usage

### Send a Tip
1. Connect your Stacks wallet
2. Enter recipient's Stacks address
3. Enter tip amount in STX (e.g., 1.5)
4. Click "Send Tip"
5. Confirm transaction in your wallet

### View Tip
1. Enter sender's Stacks address
2. Enter recipient's Stacks address
3. Click "View Tip"
4. See the tip amount sent between the addresses

## Dependencies

- **@stacks/connect** - Wallet connection and authentication
- **@stacks/transactions** - Contract calls and transaction building
- **@stacks/network** - Network configuration (testnet/mainnet)
- **React** - UI framework

## Network Configuration

The app is configured for Stacks Testnet by default. To switch to mainnet:

```javascript
// In src/App.js, change:
const NETWORK = new StacksTestnet();
// to:
const NETWORK = new StacksMainnet();
```

## Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## Troubleshooting

- **Wallet not connecting**: Make sure you have Hiro Wallet or Leather Wallet extension installed
- **Transaction failing**: Ensure you have sufficient STX balance for the tip + gas fees
- **Contract not found**: Verify the `CONTRACT_ADDRESS` matches your deployed contract

## Learn More

- [Stacks.js Documentation](https://stacks.js.org/)
- [Stacks Connect Guide](https://docs.hiro.so/stacks.js/guides/connect-users)
- [Create React App Documentation](https://facebook.github.io/create-react-app/docs/getting-started)
