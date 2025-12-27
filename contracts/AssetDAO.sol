// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract AssetDAO {
    IERC20 public governanceToken;
    
    struct Proposal {
        string description;
        uint256 forVotes;
        bool executed;
    }

    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => mapping(address => bool)) public hasVoted;
    uint256 public proposalCount;

    constructor(address _tokenAddress) {
        governanceToken = IERC20(_tokenAddress);
    }

    function createProposal(string memory _description) public {
        proposalCount++;
        proposals[proposalCount] = Proposal(_description, 0, false);
    }

    function vote(uint256 _proposalId) public {
        require(!hasVoted[_proposalId][msg.sender], "Aap pehle vote de chuke hain");
        
        uint256 voteWeight = governanceToken.balanceOf(msg.sender);
        require(voteWeight > 0, "Vote dene ke liye tokens hona lazmi hain");

        proposals[_proposalId].forVotes += voteWeight;
        hasVoted[_proposalId][msg.sender] = true;
    }
}
