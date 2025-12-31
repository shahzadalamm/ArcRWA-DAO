import React, { useState } from 'react';
import { ethers } from 'ethers';

// CONFIGURATION
const ENT_CONTRACT_ADDRESS = "0x8A42b7C9fa082D38d4bD212bd2D5B76465b01053";
// To see real deduction, we send money TO the contract, not back to yourself.
const RECEIVER_ADDRESS = ENT_CONTRACT_ADDRESS; 

function App() {
  const [walletAddress, setWalletAddress] = useState("");
  const [entBalance, setEntBalance] = useState("0.00");
  const [purchaseAmount, setPurchaseAmount] = useState(10);
  const [isProcessing, setIsProcessing] = useState(false);

  async function updateBalance(address) {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const abi = ["function balanceOf(address) view returns (uint256)"];
      const contract = new ethers.Contract(ENT_CONTRACT_ADDRESS, abi, provider);
      const balance = await contract.balanceOf(address);
      setEntBalance(parseFloat(ethers.formatUnits(balance, 18)).toFixed(2));
    } catch (error) {
      console.error("Balance fetch failed");
    }
  }

  async function connectWallet() {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setWalletAddress(accounts[0]);
      updateBalance(accounts[0]);
    }
  }

  async function handlePurchase() {
    if (!walletAddress) return alert("Please connect wallet!");

    try {
      setIsProcessing(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      // Converting 10 USDC to 18 decimals as shown in your screenshot
      const valueInWei = ethers.parseUnits(purchaseAmount.toString(), 18);
      
      // REAL TRANSFER: Sending to the Contract Address
      const tx = await signer.sendTransaction({
        to: RECEIVER_ADDRESS, 
        value: valueInWei,
        gasLimit: 100000 
      });

      console.log("Transaction Hash:", tx.hash);
      await tx.wait();
      
      alert("Purchase Successful! USDC Deducted.");
      updateBalance(walletAddress);
    } catch (error) {
      alert("Transaction Failed: Check balance or Gas.");
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <div style={styles.container}>
      <nav style={styles.nav}>
        <h2 style={{ color: '#38bdf8' }}>ARC <span style={{color:'#fff'}}>RWA HUB</span></h2>
        <button onClick={connectWallet} style={styles.connectBtn}>
          {walletAddress ? `Acc: ${walletAddress.substring(0,6)}...` : "Connect Wallet"}
        </button>
      </nav>

      <div style={styles.card}>
        <p style={{ color: '#94a3b8' }}>ENT TOKEN BALANCE</p>
        <h1 style={{ color: '#38bdf8', fontSize: '3rem' }}>{entBalance} ENT</h1>
        
        {walletAddress && (
          <div style={{ marginTop: '30px' }}>
            <div style={styles.inputBox}>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Amount (USDC)</p>
              <input 
                type="number" 
                value={purchaseAmount} 
                onChange={(e) => setPurchaseAmount(e.target.value)}
                style={styles.input}
              />
            </div>
            
            <button 
              onClick={handlePurchase} 
              disabled={isProcessing}
              style={isProcessing ? styles.disabledBtn : styles.actionBtn}
            >
              {isProcessing ? "AWAITING CONFIRMATION..." : `BUY ${purchaseAmount * 10} ENT`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { background: '#020617', color: 'white', minHeight: '100vh', textAlign: 'center', fontFamily: 'sans-serif' },
  nav: { padding: '20px', background: '#0f172a', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #1e293b' },
  card: { maxWidth: '400px', margin: '50px auto', background: '#0f172a', padding: '40px', borderRadius: '25px', border: '1px solid #1e293b' },
  inputBox: { background: '#1e293b', padding: '15px', borderRadius: '12px' },
  input: { background: 'transparent', border: 'none', color: 'white', fontSize: '1.5rem', width: '100%', textAlign: 'center', outline: 'none' },
  connectBtn: { background: '#38bdf8', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' },
  actionBtn: { background: '#2563eb', color: 'white', border: 'none', padding: '15px', borderRadius: '12px', width: '100%', marginTop: '20px', fontWeight: 'bold', cursor: 'pointer' },
  disabledBtn: { background: '#334155', color: '#94a3b8', padding: '15px', borderRadius: '12px', width: '100%', marginTop: '20px', cursor: 'not-allowed' }
};

export default App;
