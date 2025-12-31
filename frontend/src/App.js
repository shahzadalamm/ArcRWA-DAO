async function buyENT() {
    if (!walletAddress) return alert("Pehle Wallet Connect Karein!");
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      const amountInWei = ethers.parseUnits(usdcToPay.toString(), 18);
      
      alert(`Confirm karein: ${usdcToPay} USDC ka transfer`);

      // MANUAL GAS LIMIT ADDED
      const tx = await signer.sendTransaction({
        to: MY_WALLET,
        value: amountInWei,
        gasLimit: 100000 // Manual gas limit taake error na aaye
      });

      alert("Transaction Sent! Processing...");
      await tx.wait();
      
      alert("Success! Purchase Complete.");
      checkBalance(walletAddress);
    } catch (err) {
      console.error(err);
      // Detail error check
      if (err.code === "INSUFFICIENT_FUNDS") {
        alert("Error: Aapke paas kafi USDC nahi hain (Gas fees shamil karke).");
      } else {
        alert("Transaction Failed! MetaMask mein 'Gas' check karein ya balance refresh karein.");
      }
    }
  }
