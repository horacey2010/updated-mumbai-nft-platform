// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract HoraceNFT is ERC721, ERC721URIStorage, ERC2981, Ownable {

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    uint96 private constant royaltyFee = 500;

    constructor() ERC721("HoraceToken", "HTK") {
      _setDefaultRoyalty(msg.sender, royaltyFee); // 1% of NFT price
    }

    function mint(address to, string memory uri) public onlyOwner returns(uint256) {
        _tokenIdCounter.increment();
        uint256 tokenId = _tokenIdCounter.current();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        return (tokenId);
    }

    function mintWithRoyalty(string memory uri, address _royaltyReceiver) public onlyOwner returns(uint256) {
      address royaltyReceiver = _royaltyReceiver;
      uint256 tokenId = mint(royaltyReceiver, uri);
      _setTokenRoyalty(tokenId, royaltyReceiver, royaltyFee);
      return (tokenId);
    }

    // The following functions are overrides required by Solidity.

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
      public view virtual override(ERC721, ERC721URIStorage, ERC2981)
      returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function getRoyaltyFee() public pure returns (uint96) {
      return royaltyFee;
    }

  function changeMetadata(uint256 tokenId, string memory _tokenURI) external onlyOwner {
    _setTokenURI(tokenId, _tokenURI);
  }

}
