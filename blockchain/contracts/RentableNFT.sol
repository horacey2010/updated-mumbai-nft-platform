// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./ERC4907.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RentableNFT is ERC4907, Ownable {
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  constructor() ERC4907("Avatar Token", "ATT") {}

  function mint(string[] memory _tokenURI) public onlyOwner {
    uint256 newTokenId; 
    for (uint i=0; i<_tokenURI.length; i++) {
      _tokenIds.increment();
      newTokenId = _tokenIds.current(); 
      _safeMint(msg.sender, newTokenId);
      _setTokenURI(newTokenId, _tokenURI[i]);
    }
  }

  function getTokenIds() view public returns(uint) {
    uint tokenIds = _tokenIds.current();
    return tokenIds;
  }

  function burnRentableNFT(uint256 tokenId) external onlyOwner {
    _burn(tokenId);
  }

  function changeMetadata(uint256 tokenId, string memory _tokenURI) external onlyOwner {
    _setTokenURI(tokenId, _tokenURI);
  }

}
