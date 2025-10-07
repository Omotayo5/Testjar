import React, { useState, useEffect } from 'react';
import { AppConfig, UserSession, showConnect, openContractCall } from '@stacks/connect';
import {
  callReadOnlyFunction,
  standardPrincipalCV,
  uintCV,
  stringUtf8CV,
  cvToValue,
} from '@stacks/transactions';
import { StacksTestnet } from '@stacks/network';
import './App.css';

const appConfig = new AppConfig(['store_write', 'publish_data']);
const userSession = new UserSession({ appConfig });

// Configure your contract details
// Deployer address from devnet (ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM)
const CONTRACT_ADDRESS = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
const CONTRACT_NAME = 'tipsjar';
const NETWORK = new StacksTestnet(); // Use StacksTestnet for testnet or StacksMainnet for mainnet

// For local development with Clarinet devnet, you can uncomment:
// import { StacksDevnet } from '@stacks/network';
// const NETWORK = new StacksDevnet();

function App() {
  const [userData, setUserData] = useState(null);
  const [recipientAddress, setRecipientAddress] = useState('');
  const [tipAmount, setTipAmount] = useState('');
  const [tipMessage, setTipMessage] = useState('');
  const [viewSender, setViewSender] = useState('');
  const [viewRecipient, setViewRecipient] = useState('');
  const [tipResult, setTipResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Debug: Log state changes
  console.log('App render - Current state:', {
    userData: userData ? 'Connected' : 'Not connected',
    recipientAddress,
    tipAmount,
    tipMessage
  });

  useEffect(() => {
    console.log('App mounting, checking user session...');
    
    if (userSession.isSignInPending()) {
      console.log('Sign-in pending, handling...');
      userSession.handlePendingSignIn().then((userData) => {
        console.log('User signed in:', userData);
        setUserData(userData);
      });
    } else if (userSession.isUserSignedIn()) {
      console.log('User already signed in');
      const data = userSession.loadUserData();
      console.log('Loaded user data:', data);
      setUserData(data);
    } else {
      console.log('No user signed in');
    }
  }, []);

  const connectWallet = () => {
    try {
      showConnect({
        appDetails: {
          name: 'TipsJar',
          icon: window.location.origin + '/favicon.ico',
        },
        onFinish: () => {
          window.location.reload();
        },
        onCancel: () => {
          console.log('User cancelled wallet connection');
        },
        userSession,
      });
    } catch (err) {
      console.error('Wallet connection error:', err);
      setError('Failed to open wallet connection. Please make sure your wallet extension is installed and enabled.');
    }
  };

  const disconnectWallet = () => {
    userSession.signUserOut();
    setUserData(null);
  };

  const sendTip = async () => {
    // Clear any previous errors
    setError('');

    if (!userData) {
      setError('Please connect your wallet first to send tips');
      return;
    }

    // Trim inputs to remove whitespace
    const recipient = recipientAddress?.trim();
    const amount = tipAmount?.toString().trim();

    console.log('Send Tip Debug:', { recipient, amount, recipientAddress, tipAmount });

    if (!recipient || !amount) {
      setError('Please enter both recipient address and amount');
      return;
    }

    if (parseFloat(amount) <= 0) {
      setError('Amount must be greater than 0');
      return;
    }

    setLoading(true);

    try {
      // Convert STX to microSTX (1 STX = 1,000,000 microSTX)
      const amountInMicroSTX = Math.floor(parseFloat(amount) * 1000000);

      console.log('Preparing transaction:', {
        recipient,
        stxAmount: amount,
        microSTX: amountInMicroSTX,
        message: tipMessage
      });

      // Prepare function arguments
      const functionArgs = [
        standardPrincipalCV(recipient),
        uintCV(amountInMicroSTX),
        stringUtf8CV(tipMessage || ''),
      ];

      console.log('Function args prepared:', functionArgs);

      // Transaction options
      const txOptions = {
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'tip',
        functionArgs: functionArgs,
        network: NETWORK,
        anchorMode: 1, // AnchorMode.Any
        postConditionMode: 1, // PostConditionMode.Allow
        onFinish: (data) => {
          console.log('Transaction finished:', data);
          setLoading(false);
          setError('');
          alert(`Transaction broadcast! TX ID: ${data.txId}`);
          setRecipientAddress('');
          setTipAmount('');
          setTipMessage('');
        },
        onCancel: () => {
          console.log('Transaction cancelled by user');
          setLoading(false);
          setError('Transaction cancelled');
        },
      };

      console.log('Opening transaction popup with options:', txOptions);
      await openContractCall(txOptions);
    } catch (err) {
      console.error('Transaction error:', err);
      console.error('Error details:', {
        message: err.message,
        stack: err.stack,
        error: err
      });
      
      let errorMessage = 'Transaction failed';
      
      if (err.message) {
        errorMessage = err.message;
      } else if (err.toString) {
        errorMessage = err.toString();
      }
      
      // Check for specific error types
      if (errorMessage.includes('map')) {
        errorMessage = 'Wallet connection error. Please disconnect and reconnect your wallet, then try again.';
      }
      
      setError(`Error: ${errorMessage}`);
      setLoading(false);
    }
  };

  const viewTip = async () => {
    if (!viewSender || !viewRecipient) {
      setError('Please enter both sender and recipient addresses');
      return;
    }

    // Validate addresses
    if (!viewSender.startsWith('ST') && !viewSender.startsWith('SP')) {
      setError('Invalid sender address format');
      return;
    }
    if (!viewRecipient.startsWith('ST') && !viewRecipient.startsWith('SP')) {
      setError('Invalid recipient address format');
      return;
    }

    setLoading(true);
    setError('');
    setTipResult(null);

    try {
      const functionArgs = [
        standardPrincipalCV(viewSender),
        standardPrincipalCV(viewRecipient),
      ];

      console.log('Calling contract:', {
        address: CONTRACT_ADDRESS,
        name: CONTRACT_NAME,
        function: 'get-tip',
        sender: viewSender,
        recipient: viewRecipient
      });

      const result = await callReadOnlyFunction({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'get-tip-with-message',
        functionArgs,
        network: NETWORK,
        senderAddress: viewSender,
      });

      console.log('Raw result:', result);
      console.log('Result type:', result?.type);
      
      // Handle the response safely
      if (!result) {
        setTipResult('No response from contract');
        return;
      }

      // Check if result is 'none' (no tip found) - type 9
      if (result.type === 9) {
        setTipResult('No tip found between these addresses');
        return;
      }

      // If it's 'some' (type 10), extract the tuple with amount and message
      if (result.type === 10 && result.value) {
        console.log('Result value:', result.value);
        
        const tipData = cvToValue(result);
        console.log('Tip data:', tipData);
        
        if (tipData && tipData.amount) {
          const microSTX = typeof tipData.amount === 'bigint' 
            ? Number(tipData.amount) 
            : parseInt(tipData.amount);
          const stx = microSTX / 1000000;
          const message = tipData.message || '';
          
          if (message) {
            setTipResult(`${stx} STX (${microSTX} microSTX)\nMessage: "${message}"`);
          } else {
            setTipResult(`${stx} STX (${microSTX} microSTX)\n(No message)`);
          }
        } else {
          setTipResult('No tip found between these addresses');
        }
      } else {
        setTipResult('No tip found between these addresses');
      }
    } catch (err) {
      console.error('Full error:', err);
      console.error('Error stack:', err.stack);
      setError(`Error: ${err.message || 'Unknown error occurred'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🎁 TipsJar</h1>
        <p>Send and track STX tips on Stacks blockchain</p>
      </header>

      <div className="container">
        {/* Wallet Connection Section */}
        <div className="wallet-section">
          {!userData ? (
            <div className="wallet-prompt">
              <p>Connect your wallet to send tips</p>
              <button className="btn btn-primary" onClick={connectWallet}>
                🔐 Connect Wallet
              </button>
            </div>
          ) : (
            <div className="wallet-info">
              <div className="wallet-address">
                <span className="label">Connected:</span>
                <strong className="address">
                  {userData.profile.stxAddress.testnet || userData.profile.stxAddress.mainnet}
                </strong>
              </div>
              <button className="btn btn-secondary btn-small" onClick={disconnectWallet}>
                Disconnect
              </button>
            </div>
          )}
        </div>

        {/* Send Tip Section */}
        <div className="card">
          <h2>💸 Send Tip</h2>
          {!userData && (
            <div className="info-banner">
              <span>ℹ️ Connect your wallet above to send tips</span>
            </div>
          )}
          <div className="form-group">
            <label>Recipient Address:</label>
            <input
              type="text"
              placeholder="ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM"
              value={recipientAddress}
              onChange={(e) => {
                console.log('Recipient changed:', e.target.value);
                setRecipientAddress(e.target.value);
              }}
              className="input"
            />
          </div>
          <div className="form-group">
            <label>Amount (STX):</label>
            <input
              type="number"
              step="0.000001"
              placeholder="1.0"
              value={tipAmount}
              onChange={(e) => {
                console.log('Amount changed:', e.target.value);
                setTipAmount(e.target.value);
              }}
              className="input"
            />
          </div>
          <div className="form-group">
            <label>Message (Optional):</label>
            <textarea
              placeholder="Thanks for the great content!"
              value={tipMessage}
              onChange={(e) => setTipMessage(e.target.value)}
              className="input textarea"
              maxLength="280"
              rows="3"
            />
            <small className="char-count">{tipMessage.length}/280 characters</small>
          </div>
          <button
            className="btn btn-primary"
            onClick={sendTip}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Send Tip'}
          </button>
        </div>

        {/* View Tip Section */}
        <div className="card">
          <h2>🔍 View Tip</h2>
          <div className="form-group">
            <label>Sender Address:</label>
            <input
              type="text"
              placeholder="ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM"
              value={viewSender}
              onChange={(e) => setViewSender(e.target.value)}
              className="input"
            />
          </div>
          <div className="form-group">
            <label>Recipient Address:</label>
            <input
              type="text"
              placeholder="ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5"
              value={viewRecipient}
              onChange={(e) => setViewRecipient(e.target.value)}
              className="input"
            />
          </div>
          <button
            className="btn btn-primary"
            onClick={viewTip}
            disabled={loading}
          >
            {loading ? 'Querying...' : 'View Tip'}
          </button>
          {tipResult && (
            <div className="result">
              <strong>Result:</strong> {tipResult}
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && <div className="error">{error}</div>}
      </div>
    </div>
  );
}

export default App;
