// Shared contract configuration for frontend and backend
module.exports = {
  // Contract details
  contractName: 'tipsjar',
  
  // Deployer address (from devnet)
  deployer: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
  
  // Test wallets (from devnet)
  testWallets: {
    wallet_1: 'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5',
    wallet_2: 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG',
    wallet_3: 'ST2JHG361ZXG51QTKY2NQCVBPPRRE2KZB1HR05NNC',
  },
  
  // Network configuration
  networks: {
    devnet: 'http://localhost:3999',
    testnet: 'https://api.testnet.hiro.so',
    mainnet: 'https://api.hiro.so',
  }
};
