import React, { useState, useEffect } from 'react';
import { AppConfig, UserSession, showConnect } from '@stacks/connect';
import {
  makeContractCall,
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

  useEffect(() => {
    if (userSession.isSignInPending()) {
      userSession.handlePendingSignIn().then((userData) => {
        setUserData(userData);
      });
    } else if (userSession.isUserSignedIn()) {
      setUserData(userSession.loadUserData());
    }
  }, []);

  const connectWallet = () => {
    showConnect({
      appDetails: {
        name: 'TipsJar',
        icon: window.location.origin + '/logo.png',
      },
      redirectTo: '/',
      onFinish: () => {
        setUserData(userSession.loadUserData());
      },
      userSession,
    });
  };

  const disconnectWallet = () => {
    userSession.signUserOut();
    setUserData(null);
  };

  const sendTip = async () => {
    if (!recipientAddress || !tipAmount) {
      setError('Please enter both recipient address and amount');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Convert STX to microSTX (1 STX = 1,000,000 microSTX)
      const amountInMicroSTX = Math.floor(parseFloat(tipAmount) * 1000000);

      const functionArgs = [
        standardPrincipalCV(recipientAddress),
        uintCV(amountInMicroSTX),
        stringUtf8CV(tipMessage || ''),
      ];

      const txOptions = {
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'tip',
        functionArgs,
        network: NETWORK,
        appDetails: {
          name: 'TipsJar',
          icon: window.location.origin + '/logo.png',
        },
        onFinish: (data) => {
          setError('');
          alert(`Transaction broadcast! TX ID: ${data.txId}`);
          setRecipientAddress('');
          setTipAmount('');
          setTipMessage('');
        },
        onCancel: () => {
          setError('Transaction cancelled');
        },
      };

      await makeContractCall(txOptions);
    } catch (err) {
      setError(`Error: ${err.message}`);
    } finally {
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
        {/* Send Tip Section */}
        <div className="card">
          <h2>💸 Send Tip</h2>
          <div className="form-group">
            <label>Recipient Address:</label>
            <input
              type="text"
              placeholder="ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM"
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
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
              onChange={(e) => setTipAmount(e.target.value)}
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
