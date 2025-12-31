async function buyENT() {
    if (!walletAddress) return;
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      // Ye line ensure karegi ke poore 10 USDC (18 decimals ke saath) jayein
      const amountToSend = ethers.parseUnits(usdcAmount.toString(), 18);
      
      const tx = await signer.sendTransaction({
        to: MY_WALLET,
        value: amountToSend, // Ab ye sirf point wala number nahi, pura digit bhejega
      });

      alert(`Confirm karein: ${usdcAmount} USDC transfer ho rahe hain.`);
      await tx.wait();
      
      alert("USDC Deducted! Ab ENT balance check karein.");
      checkBalance(walletAddress);
    } catch (err) {
      alert("Transaction fail ho gayi!");
      console.error(err);
    }
  }
