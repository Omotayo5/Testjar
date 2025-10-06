# TipsJar - Complete Testing Guide

This guide will help you test the entire TipsJar project from backend to frontend.

---

## ✅ Test Results Summary

### Backend (Smart Contract)
- ✅ **Contract Tests Passed** - All unit tests successful
- ✅ **Tip Function** - Sends STX and records tips correctly
- ✅ **Get-Tip Function** - Retrieves tip amounts correctly

### Frontend (React App)
- ✅ **Dependencies Installed** - All packages ready
- ✅ **UI Compiled** - React app builds successfully
- ✅ **Forms Ready** - Send Tip and View Tip forms displayed

---

## 🧪 Manual Testing Steps

### 1. Backend Testing (Already Passed ✅)

```bash
# Run contract tests
npm test
```

**Expected Output:**
```
✓ tests/tipsjar_test.ts (1 test) 144ms
  ✓ tipsjar contract > tips wallet_2 with 100 uSTX

Test Files  1 passed (1)
Tests  1 passed (1)
```

---

### 2. Frontend Testing (Manual)

#### **A. Visual Test**

Open your browser to: **http://localhost:3000**

**What You Should See:**
- 🎁 **TipsJar** heading with purple gradient background
- 💸 **Send Tip** card with:
  - Recipient Address input field
  - Amount (STX) input field
  - "Send Tip" button
- 🔍 **View Tip** card with:
  - Sender Address input field
  - Recipient Address input field
  - "View Tip" button

✅ **Pass if:** All elements are visible and styled correctly

---

#### **B. View Tip Test (Read-Only - No Wallet Needed)**

This tests if the frontend can query the blockchain.

**Steps:**
1. In the **View Tip** section, enter:
   - **Sender Address:** `ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM`
   - **Recipient Address:** `ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5`
2. Click **"View Tip"** button

**Expected Results:**
- Button shows "Querying..." while loading
- Result appears below showing either:
  - "No tip found between these addresses" (if no tip exists)
  - "X STX (X microSTX)" (if a tip exists)

✅ **Pass if:** Query completes without errors

---

#### **C. Send Tip Test (Requires Wallet)**

This tests the full transaction flow.

**Prerequisites:**
1. Install [Hiro Wallet](https://wallet.hiro.so/) or [Leather Wallet](https://leather.io/) browser extension
2. Create/import a wallet
3. Switch to **Testnet** in wallet settings
4. Get testnet STX from [Stacks Faucet](https://explorer.hiro.so/sandbox/faucet?chain=testnet)

**Steps:**
1. In the **Send Tip** section, enter:
   - **Recipient Address:** `ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5`
   - **Amount:** `1`
2. Click **"Send Tip"** button
3. Wallet popup appears - review transaction details
4. Click **"Confirm"** in wallet
5. Wait for transaction confirmation (1-2 minutes)

**Expected Results:**
- Button shows "Processing..." while loading
- Wallet popup appears with transaction details showing:
  - Contract: `ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.tipsjar`
  - Function: `tip`
  - Amount: 1 STX + gas fees
- Alert shows: "Transaction broadcast! TX ID: [transaction-id]"
- Form clears after successful broadcast

✅ **Pass if:** Transaction broadcasts successfully

**Verify Transaction:**
1. Copy the transaction ID from the alert
2. Go to [Stacks Explorer](https://explorer.hiro.so/?chain=testnet)
3. Paste transaction ID in search
4. Wait for "Success" status (1-2 minutes)

---

#### **D. End-to-End Test**

After sending a tip, verify it was recorded:

**Steps:**
1. Wait 2-3 minutes for transaction to confirm
2. In **View Tip** section, enter:
   - **Sender Address:** [Your wallet address]
   - **Recipient Address:** `ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5`
3. Click **"View Tip"**

**Expected Results:**
- Shows: "1.0 STX (1000000 microSTX)" or your sent amount

✅ **Pass if:** The tip you sent is displayed correctly

---

## 🎯 Test Scenarios

### Scenario 1: Multiple Tips
1. Send multiple tips to the same recipient
2. View tip should show the **most recent** tip amount (contract only stores latest)

### Scenario 2: Different Recipients
1. Send tips to different addresses
2. Each sender-recipient pair has independent tip records

### Scenario 3: Error Handling
1. Try sending a tip with invalid address
2. Try sending more STX than you have
3. Verify error messages appear

---

## 🐛 Troubleshooting

### Frontend Won't Start
```bash
cd frontend
npm install
npm start
```

### Wallet Won't Connect
- Ensure wallet extension is installed
- Refresh the page
- Check that you're on Testnet, not Mainnet

### Transaction Fails
- Check you have enough STX balance
- Verify recipient address is valid
- Ensure you're on the correct network (Testnet)

### View Tip Shows "No tip found"
- Wait 2-3 minutes after sending for blockchain confirmation
- Verify the sender and recipient addresses are correct
- Check transaction on Stacks Explorer to ensure it succeeded

---

## 📊 Test Accounts (From Devnet)

Use these addresses for local testing:

| Account | Address | Initial Balance |
|---------|---------|-----------------|
| deployer | `ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM` | 100M STX |
| wallet_1 | `ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5` | 100M STX |
| wallet_2 | `ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG` | 100M STX |
| wallet_3 | `ST2JHG361ZXG51QTKY2NQCVBPPRRE2KZB1HR05NNC` | 100M STX |

---

## ✅ Testing Checklist

- [ ] Backend tests pass (`npm test`)
- [ ] Frontend starts without errors (`npm run frontend`)
- [ ] UI displays correctly in browser
- [ ] "View Tip" query works (read-only test)
- [ ] Wallet connects successfully
- [ ] "Send Tip" transaction broadcasts
- [ ] Transaction confirms on blockchain
- [ ] "View Tip" shows the sent tip amount
- [ ] Error messages display for invalid inputs

---

## 🎉 Success Criteria

**Project passes all tests if:**
1. ✅ All backend unit tests pass
2. ✅ Frontend compiles and runs
3. ✅ UI is responsive and styled correctly
4. ✅ Can query tip data from blockchain
5. ✅ Can send tips via wallet
6. ✅ Transactions confirm on blockchain
7. ✅ Sent tips are queryable and display correctly

---

## 📞 Need Help?

If tests fail, check:
1. All dependencies are installed (`npm install` in both root and frontend)
2. You're using Node.js >= 18.0.0
3. Wallet extension is properly configured for Testnet
4. You have testnet STX in your wallet

For more details, see:
- [README.md](./README.md) - Full documentation
- [QUICKSTART.md](./QUICKSTART.md) - Quick setup guide
- [Stacks Documentation](https://docs.stacks.co/)
