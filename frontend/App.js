import React, { useState } from 'react';
import { ethers } from 'ethers';

// YOUR ENT CONTRACT
const ENT_CONTRACT_ADDRESS = "0x8A42b7C9fa082D38d4bD212bd2D5B76465b01053";

function App() {
  const [walletAddress, setWalletAddress] = useState("");
  const [entBalance, setEntBalance] = useState("0.00");
  const [isPosting, setIsPosting] = useState(false);
  const [repoName, setRepoName] = useState("");

  // ONLY READS FROM BLOCKCHAIN
  async function fetchBalance(address) {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const abi = ["function balanceOf(address) view returns (uint256)"];
      const contract = new ethers.Contract(ENT_CONTRACT_ADDRESS, abi, provider);
      const bal = await contract.balanceOf(address);
      setEntBalance(ethers.formatUnits(bal, 18));
    } catch (e) { console.log("Sync error"); }
  }

  async function connectWallet() {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setWalletAddress(accounts[0]);
      fetchBalance(accounts[0]);
    }
  }

  // THE REAL "POST & EARN" LOGIC
  async function handlePost() {
    if (!walletAddress || !repoName) return alert("Enter Repo Name!");

    try {
      setIsPosting(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      // ABI for a public 'claim' or 'mint' function
      const abi = ["function mint(address to, uint256 amount) public"];
      const contract = new ethers.Contract(ENT_CONTRACT_ADDRESS, abi, signer);

      // This will trigger MetaMask and show actual interaction
      const tx = await contract.mint(walletAddress, ethers.parseUnits("10", 18));
      
      alert("Post submitting to Arc Network...");
      await tx.wait(); // Waiting for actual block confirmation
      
      alert("Post Successful! 10 ENT received permanently.");
      fetchBalance(walletAddress); // Refreshing real data
      setRepoName("");
    } catch (error) {
      alert("Error: Your ENT contract does not allow public minting.");
      console.error(error);
    } finally {
      setIsPosting(false);
    }
  }

  return (
    <div style={styles.body}>
      <nav style={styles.nav}>
        <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
          <span style={{fontWeight:'bold', color:'#f0f6fc'}}>ARC HUB</span>
        </div>
        <button onClick={connectWallet} style={styles.btnSec}>
          {walletAddress ? "Connected" : "Connect Wallet"}
        </button>
      </nav>

      <div style={styles.container}>
        <div style={styles.sidebar}>
          <div style={styles.avatar}></div>
          <h3 style={{color:'#f0f6fc'}}>{entBalance} ENT</h3>
          <p style={{fontSize:'12px', color:'#8b949e'}}>ON-CHAIN ASSETS</p>
        </div>

        <div style={styles.content}>
          <div style={styles.postBox}>
            <input 
              placeholder="Repository name (e.g. Real-Estate-Token)" 
              value={repoName}
              onChange={(e) => setRepoName(e.target.value)}
              style={styles.input}
            />
            <button onClick={handlePost} disabled={isPosting} style={styles.btnPri}>
              {isPosting ? "Posting..." : "Create Repository"}
            </button>
          </div>
          <p style={{fontSize:'12px', color:'#8b949e', textAlign:'left'}}>* Posting costs gas fees. Reward: 10 ENT per post.</p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  body: { background: '#0d1117', color: '#c9d1d9', minHeight: '100vh', fontFamily: 'sans-serif' },
  nav: { padding: '15px 50px', background: '#161b22', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #30363d' },
  btnSec: { background: '#21262d', border: '1px solid #30363d', color: '#c9d1d9', padding: '5px 15px', borderRadius: '6px' },
  container: { display: 'flex', maxWidth: '1000px', margin: '40px auto', gap: '30px' },
  sidebar: { width: '250px' },
  avatar: { width: '250px', height: '250px', background: '#30363d', borderRadius: '50%' },
  content: { flex: 1 },
  postBox: { background: '#161b22', padding: '20px', borderRadius: '6px', border: '1px solid #30363d', display: 'flex', gap: '10px' },
  input: { flex: 1, background: '#0d1117', border: '1px solid #30363d', color: 'white', padding: '10px', borderRadius: '6px' },
  btnPri: { background: '#238636', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', fontWeight: 'bold' }
};

export default App;
