import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

// YOUR DEPLOYED CONTRACT ADDRESS
const ENT_CONTRACT_ADDRESS = "0xd8b934580fcE35a11B58C6D73aDeE468a2833fa8";

function App() {
  const [walletAddress, setWalletAddress] = useState("");
  const [entBalance, setEntBalance] = useState("0.00");
  const [isPosting, setIsPosting] = useState(false);
  const [repoName, setRepoName] = useState("");

  // Function to fetch real balance from the blockchain
  async function fetchOnChainData(address) {
    if (!address) return;
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const abi = ["function balanceOf(address) view returns (uint256)"];
      const contract = new ethers.Contract(ENT_CONTRACT_ADDRESS, abi, provider);
      
      const balance = await contract.balanceOf(address);
      setEntBalance(ethers.formatUnits(balance, 18));
    } catch (error) {
      console.error("Blockchain sync error:", error);
    }
  }

  async function connectWallet() {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setWalletAddress(accounts[0]);
        fetchOnChainData(accounts[0]);
      } catch (err) {
        alert("Wallet connection failed!");
      }
    } else {
      alert("Please use MetaMask browser!");
    }
  }

  // REAL ON-CHAIN POSTING & REWARD LOGIC
  async function handlePostProject() {
    if (!walletAddress || !repoName) return alert("Please enter a Repository name!");

    try {
      setIsPosting(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      // ABI for our reward function
      const abi = ["function rewardUser(address developer) public"];
      const contract = new ethers.Contract(ENT_CONTRACT_ADDRESS, abi, signer);

      alert(`Deploying ${repoName} to Arc Network...`);

      // This call triggers MetaMask and rewards 10 ENT to the user
      const tx = await contract.rewardUser(walletAddress);
      
      console.log("Transaction Hash:", tx.hash);
      await tx.wait(); // Wait for block confirmation
      
      alert("Success! 10 ENT rewarded to your wallet.");
      fetchOnChainData(walletAddress); // Refreshing real balance
      setRepoName("");
    } catch (error) {
      console.error(error);
      alert("Transaction failed! Ensure you have USDC for gas.");
    } finally {
      setIsPosting(false);
    }
  }

  return (
    <div style={styles.body}>
      {/* GitHub Inspired Header */}
      <nav style={styles.nav}>
        <div style={{display:'flex', alignItems:'center', gap:'12px'}}>
          <svg height="32" viewBox="0 0 16 16" width="32" fill="white"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path></svg>
          <span style={{fontWeight:'bold', fontSize:'1.1rem'}}>ARC / DEVELOPER-HUB</span>
        </div>
        <button onClick={connectWallet} style={styles.btnSec}>
          {walletAddress ? `Connected: ${walletAddress.substring(0,6)}...` : "Connect Wallet"}
        </button>
      </nav>

      <div style={styles.main}>
        {/* Sidebar Profile */}
        <div style={styles.sidebar}>
          <div style={styles.avatar}></div>
          <h2 style={{margin:'15px 0 5px', color:'#f0f6fc'}}>Web3 Developer</h2>
          <p style={{color:'#8b949e', margin:0}}>@arc_testnet_user</p>
          <hr style={{borderColor:'#21262d', margin:'20px 0'}} />
          <div style={styles.statBox}>
            <p style={{fontSize:'12px', color:'#8b949e', marginBottom:'5px'}}>BLOCKCHAIN ASSETS</p>
            <h2 style={{color:'#58a6ff', margin:0}}>{entBalance} ENT</h2>
          </div>
        </div>

        {/* Repository/Project Content */}
        <div style={styles.content}>
          <div style={styles.repoCard}>
            <h4 style={{marginTop:0, color:'#f0f6fc'}}>Post New RWA Repository</h4>
            <div style={{display:'flex', gap:'10px', marginTop:'15px'}}>
              <input 
                placeholder="Repository Name (e.g. Real-Estate-Fund)" 
                value={repoName}
                onChange={(e) => setRepoName(e.target.value)}
                style={styles.input}
              />
              <button 
                onClick={handlePostProject} 
                disabled={isPosting} 
                style={isPosting ? styles.btnDisabled : styles.btnPri}
              >
                {isPosting ? "Processing..." : "Create Repo"}
              </button>
            </div>
            <p style={{fontSize:'12px', color:'#8b949e', marginTop:'10px'}}>
              Cost: Network Gas | Reward: 10 ENT per verified post
            </p>
          </div>

          <h3 style={{textAlign:'left', borderBottom:'1px solid #30363d', paddingBottom:'10px'}}>Recent Projects</h3>
          <div style={styles.repoItem}>
            <span style={{color:'#58a6ff', fontWeight:'bold', fontSize:'1.1rem'}}>Tokenized-Gold-Reserve</span>
            <p style={{fontSize:'14px', color:'#8b949e', margin:'5px 0'}}>Automated RWA protocol for precious metal backing.</p>
            <div style={{fontSize:'12px', color:'#8b949e', marginTop:'10px'}}>
               <span style={{color:'#f1e05a'}}>●</span> JavaScript &nbsp; Updated 1 hour ago
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  body: { background: '#0d1117', color: '#c9d1d9', minHeight: '100vh', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif' },
  nav: { padding: '15px 40px', background: '#161b22', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #30363d' },
  btnSec: { background: '#21262d', border: '1px solid #30363d', color: '#c9d1d9', padding: '6px 14px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' },
  main: { display: 'flex', maxWidth: '1100px', margin: '40px auto', padding: '0 20px', gap: '40px' },
  sidebar: { width: '280px', textAlign: 'left' },
  avatar: { width: '280px', height: '280px', borderRadius: '50%', background: '#30363d', border: '1px solid #30363d' },
  statBox: { background: '#161b22', padding: '15px', borderRadius: '6px', border: '1px solid #30363d' },
  content: { flex: 1 },
  repoCard: { background: '#161b22', padding: '25px', borderRadius: '6px', border: '1px solid #30363d', marginBottom: '30px', textAlign: 'left' },
  input: { flex: 1, background: '#0d1117', border: '1px solid #30363d', color: 'white', padding: '10px 15px', borderRadius: '6px', fontSize: '1rem' },
  btnPri: { background: '#238636', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' },
  btnDisabled: { background: '#161b22', color: '#8b949e', border: '1px solid #30363d', padding: '10px 20px', borderRadius: '6px', cursor: 'not-allowed' },
  repoItem: { padding: '25px 0', borderBottom: '1px solid #21262d', textAlign: 'left' }
};

export default App;
