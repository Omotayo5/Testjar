# TipsJar - Full-Stack Stacks DApp

A decentralized tipping platform built on the Stacks blockchain, allowing users to send and track STX tips between accounts. Includes both the Clarity smart contract and a React frontend with Stacks.js integration.

## 📋 Overview

TipsJar is a Clarity smart contract that enables peer-to-peer tipping functionality on the Stacks blockchain. Users can send STX tokens as tips to other users, and the contract maintains a permanent record of all tips sent between accounts.

## 🎯 Features

### Smart Contract
- **Send Tips**: Users can send STX tokens as tips to any other Stacks address
- **Track Tips**: The contract stores a record of tips sent between each unique sender-recipient pair
- **Read Tip History**: Query the amount tipped between any two addresses
- **Secure Transfers**: Built on Stacks' native STX transfer functionality

### Frontend
- 🔐 **Wallet Connection** - Connect with Hiro or Leather wallet via @stacks/connect
- 💸 **Send Tip UI** - Input recipient address + amount, broadcast transaction
- 🔍 **View Tip UI** - Query contract to see tip amounts between addresses
- 🎨 **Modern UI** - Beautiful gradient design with responsive layout
- ⚡ **Real-time Updates** - Transaction status and error handling

## 🏗️ Contract Structure

### Data Storage

The contract uses a map to store tip information:

```clarity
(define-map tips
  { sender: principal, recipient: principal }
  { amount: uint })
```

### Public Functions

#### `tip`
Sends a tip from the transaction sender to a recipient.

**Parameters:**
- `recipient` (principal): The Stacks address receiving the tip
- `amount` (uint): The amount of STX to send (in microSTX)

**Returns:**
- `(ok true)` on successful transfer
- `(err transfer-error)` if the transfer fails

**Example:**
```clarity
(contract-call? .tipsjar tip 'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5 u1000000)
```

### Read-Only Functions

#### `get-tip`
Retrieves the tip amount sent from a specific sender to a specific recipient.

**Parameters:**
- `sender` (principal): The Stacks address of the tipper
- `recipient` (principal): The Stacks address of the recipient

**Returns:**
- `(some uint)` with the tip amount if a tip exists
- `none` if no tip has been sent

**Example:**
```clarity
(contract-call? .tipsjar get-tip 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM 'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5)
```

## 🚀 Getting Started

### Prerequisites

- Node.js (>= 18.0.0)
- npm or yarn
- Clarinet CLI (for local blockchain development)
- Stacks Wallet (Hiro Wallet or Leather) browser extension

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Testjar
```

2. Install backend dependencies:
```bash
npm install
```

3. Install frontend dependencies:
```bash
npm run frontend:install
# or manually:
cd frontend && npm install
```

### Running the Project

#### Backend (Smart Contract)

**Run Tests:**
```bash
# Run all contract tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

**Start Local Devnet:**
```bash
npm run devnet
# or
clarinet devnet start
```

**Open Clarinet Console:**
```bash
npm run console
# or
clarinet console
```

#### Frontend (React App)

**Run Development Server:**
```bash
npm run frontend
# or
cd frontend && npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

**Build for Production:**
```bash
npm run frontend:build
# or
cd frontend && npm run build
```

## 📁 Project Structure

```
Testjar/
├── contracts/
│   └── tipsjar.clar          # Main smart contract
├── tests/
│   └── tipsjar_test.ts       # Contract unit tests
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── App.js           # Main component with Stacks.js integration
│   │   ├── App.css          # Styling
│   │   ├── index.js         # React entry point
│   │   └── index.css        # Base styles
│   ├── public/
│   │   └── index.html       # HTML template
│   └── package.json         # Frontend dependencies
├── settings/
│   └── Devnet.toml          # Devnet configuration with test accounts
├── deployments/
│   └── default.simnet-plan.yaml  # Deployment plan
├── Clarinet.toml            # Project configuration
├── contract.config.js       # Shared contract configuration
├── package.json             # Root NPM dependencies & scripts
├── tsconfig.json            # TypeScript configuration
├── vitest.config.mjs        # Vitest test configuration
└── setup.ts                 # Test environment setup
```

## 🧪 Testing

The project includes comprehensive unit tests using the Clarinet JS SDK:

### Test Coverage

- ✅ Sending tips between wallets
- ✅ Verifying tip amounts are stored correctly
- ✅ Retrieving tip history between addresses

### Example Test

```typescript
it("tips wallet_2 with 100 uSTX", () => {
  const accounts = simnet.getAccounts();
  const wallet1 = accounts.get("wallet_1")!;
  const wallet2 = accounts.get("wallet_2")!;

  const tipCall = simnet.callPublicFn(
    "tipsjar", 
    "tip", 
    [Cl.principal(wallet2), Cl.uint(100)], 
    wallet1
  );

  expect(tipCall.result).toBeOk(Cl.bool(true));

  const tipValue = simnet.callReadOnlyFn(
    "tipsjar",
    "get-tip",
    [Cl.principal(wallet1), Cl.principal(wallet2)],
    wallet1
  );

  expect(tipValue.result).toBeSome(Cl.uint(100));
});
```

## 🔧 Configuration

### Clarinet.toml

Defines the project and contract configuration:

```toml
[project]
name = "tipsjar-backend"
telemetry = false

[contracts.tipsjar]
path = "contracts/tipsjar.clar"
clarity_version = 2
epoch = "2.4"
```

### Test Accounts

The project includes pre-configured test accounts in `settings/Devnet.toml`:

- **deployer**: Contract deployment account
- **wallet_1**: Test wallet with 100,000,000 STX
- **wallet_2**: Test wallet with 100,000,000 STX
- **wallet_3**: Test wallet with 100,000,000 STX

## 💡 Use Cases

1. **Content Creator Tips**: Allow fans to tip content creators on decentralized platforms
2. **Service Gratuities**: Enable tipping for services in web3 applications
3. **Peer-to-Peer Appreciation**: Send tips to friends or community members
4. **Micro-payments**: Small value transfers between users

## 🛠️ Development

### Adding New Features

1. Modify the contract in `contracts/tipsjar.clar`
2. Add corresponding tests in `tests/tipsjar_test.ts`
3. Run tests to verify functionality: `npm test`

### Contract Deployment

To deploy the contract to different networks:

```bash
# Deploy to testnet
clarinet deployments apply -p testnet

# Deploy to mainnet
clarinet deployments apply -p mainnet
```

## 📊 Contract Metrics

- **Language**: Clarity (Stacks blockchain)
- **Clarity Version**: 2
- **Epoch**: 2.4
- **Functions**: 2 (1 public, 1 read-only)
- **Storage**: 1 map

## 🔐 Security Considerations

- The contract uses Stacks' native `stx-transfer?` function, which is secure and battle-tested
- Tips are final once sent (no refund mechanism)
- Only the sender's balance is checked before transfer
- The contract stores only the most recent tip amount per sender-recipient pair

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For questions or support, please open an issue in the repository.

## 🌐 Using the Frontend

1. **Start the frontend:**
   ```bash
   npm run frontend
   ```

2. **Connect your wallet:**
   - Install Hiro Wallet or Leather browser extension
   - Click "Connect Wallet" button
   - Approve the connection

3. **Send a tip:**
   - Enter recipient's Stacks address
   - Enter amount in STX
   - Click "Send Tip" and confirm in wallet

4. **View tips:**
   - Enter sender address
   - Enter recipient address
   - Click "View Tip" to see the amount

## 🔧 Configuration

### Contract Configuration

The `contract.config.js` file contains shared configuration:
- Contract name: `tipsjar`
- Deployer address: `ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM`
- Test wallet addresses
- Network endpoints

### Devnet Accounts

The following test accounts are available in devnet (from `settings/Devnet.toml`):

| Account | Address | Balance |
|---------|---------|----------|
| deployer | ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM | 100,000,000 STX |
| wallet_1 | ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5 | 100,000,000 STX |
| wallet_2 | ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG | 100,000,000 STX |
| wallet_3 | ST2JHG361ZXG51QTKY2NQCVBPPRRE2KZB1HR05NNC | 100,000,000 STX |

## 📜 Available Scripts

### Root Directory
- `npm test` - Run contract tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate test coverage report
- `npm run frontend` - Start frontend dev server
- `npm run frontend:install` - Install frontend dependencies
- `npm run frontend:build` - Build frontend for production
- `npm run devnet` - Start Clarinet devnet
- `npm run console` - Open Clarinet console

### Frontend Directory
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run frontend tests

## 🔗 Resources

- [Stacks Documentation](https://docs.stacks.co/)
- [Clarity Language Reference](https://docs.stacks.co/clarity/overview)
- [Clarinet JS SDK Documentation](https://docs.hiro.so/tools/clarinet/sdk-introduction)
- [Stacks.js Documentation](https://stacks.js.org/)
- [Stacks Connect Guide](https://docs.hiro.so/stacks.js/guides/connect-users)

---

**Built with ❤️ on Stacks**
