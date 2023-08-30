
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract HoraceERC1155NFT is ERC1155, ERC2981, Ownable {

    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    uint96 private constant royaltyFee = 500;

    constructor() ERC1155("https://mumbai-nft-platform.vercel.app/ERC1155_metadata_art/{id}.json") {
        _setDefaultRoyalty(msg.sender, royaltyFee);
    }

    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    function mint(uint256 amount, address mintee, uint256 id)
        public onlyOwner returns(uint256)
    {
        _tokenIdCounter.increment();
        _mint(mintee, id, amount, "");
        return id;
    }

    function mintWithRoyalty(address _royaltyReceiver, uint256 amount, uint256 id) public onlyOwner returns(uint256) {
        uint256 tokenId = mint(amount, _royaltyReceiver, id);
        _setTokenRoyalty(tokenId, _royaltyReceiver, royaltyFee);
        return tokenId;
    }

    function getTokenIdCounter() public view returns(uint256) {
      uint256 counter = _tokenIdCounter.current();
      return counter;
    }

    function supportsInterface(bytes4 interfaceId)
      public view virtual override(ERC1155, ERC2981)
      returns (bool) {
        return super.supportsInterface(interfaceId);
    }

}
