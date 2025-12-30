// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract AssetRegistry {
    struct Asset {
        uint256 id;
        address owner;
        string title;        // e.g. "Malir Orchard Plot 42"
        string legalDocHash; // IPFS link to Registry/Sarkari Papers
        uint256 value;       // Estimated value in ENT/USDC
        bool isVerified;     // DAO Verification Status
    }

    uint256 public nextAssetId;
    mapping(uint256 => Asset) public assets;

    event AssetRegistered(uint256 indexed id, address indexed owner, string title);

    // Function: Zameen ke papers blockchain par dalna
    function registerAsset(
        string memory _title, 
        string memory _docHash, 
        uint256 _value
    ) public {
        assets[nextAssetId] = Asset(
            nextAssetId,
            msg.sender,
            _title,
            _docHash,
            _value,
            false // Shuru mein unverified hoga
        );

        emit AssetRegistered(nextAssetId, msg.sender, _title);
        nextAssetId++;
    }
}
