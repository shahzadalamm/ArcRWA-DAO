require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    arcTestnet: {
      url: "https://rpc.quicknode.testnet.arc.network/", // Arc Network ka RPC URL
      chainId: 5042002, // Yahan Arc Testnet ki asli ID ayegi (agar 12345 nahi hai to batayein)
      accounts: ["0x054574b3db2de5b6bdd41fdd37a0cd9ee58c3c434e58538975b40a6987dc0288"] // Apne MetaMask ki Private Key yahan dalein
    }
  }
};
