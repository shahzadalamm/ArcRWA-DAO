// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract EnterpriseToken is ERC20, Ownable {
    // Enterprise Rules: 1 USDC = 100 ENT
    uint256 public constant SWAP_RATIO = 100;

    constructor() ERC20("Arc Enterprise Token", "ENT") Ownable(msg.sender) {}

    // 1. Swap USDC to ENT (RealFi Access Gate)
    function swapUSDCforENT(uint256 usdcAmount) external {
        uint256 entToMint = usdcAmount * SWAP_RATIO;
        _mint(msg.sender, entToMint);
    }

    // 2. Pay Post Fee (Asset posting par 50 ENT burn honge)
    function payPostFee(address user) external {
        uint256 fee = 50 * 10**decimals();
        _burn(user, fee); 
    }
}
