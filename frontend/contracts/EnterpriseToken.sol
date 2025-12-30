// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract EnterpriseToken is ERC20, Ownable {
    // Enterprise Rules: 1 USDC = 100 ENT
    uint256 public constant SWAP_RATIO = 100;

    constructor() ERC20("Arc Enterprise Token", "ENT") Ownable(msg.sender) {}

    // 1. Swap USDC to ENT (Access to RealFi)
    function swapUSDCforENT(uint256 usdcAmount) external {
        // Calculation: 10^18 precision ke sath
        uint256 entToMint = usdcAmount * SWAP_RATIO;
        _mint(msg.sender, entToMint);
    }

    // 2. Pay Post Fee (Asset register karne ke liye 50 ENT cut honge)
    function payPostFee(address user) external {
        uint256 fee = 50 * 10**decimals();
        _burn(user, fee); 
    }
}
