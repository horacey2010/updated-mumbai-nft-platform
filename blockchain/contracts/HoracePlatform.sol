// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/interfaces/IERC165.sol";
import "@openzeppelin/contracts/interfaces/IERC721.sol";
import "@openzeppelin/contracts/interfaces/IERC2981.sol";
import "@openzeppelin/contracts/interfaces/IERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./RentableNFT.sol";
import "./HoraceNFT.sol";
import "./HoraceERC1155NFT.sol";
import "./HoraceToken.sol";

contract HoracePlatform is Ownable {

  error HoracePlatform__WrongNFTType();

  event MintNFT(address indexed _owner, uint256 tokenId, uint256 _price, uint256 indexed _timestamp);

  RentableNFT private rentableNFT;
  HoraceNFT private horaceNFT;
  HoraceERC1155NFT private horaceERC1155NFT;

  address private immutable horaceTokenAddress;
  uint256 private constant mintNFTRewards = 1e18;
  uint256 private constant mintNFTFee = 2e17;

  enum ImageType {
    SPORTS,         
    ARTWORK,
    COLLECTIBLES,
    MUSIC,
    GAMES
  }

  struct ListingToMintERC721 {
    uint256 mintPrice;
    string tokenUri;
    bool isMinted;
    ImageType imageType;
  }

  struct ListingToMintERC1155 {
    uint256 mintPrice;
    string tokenUri;
    bool isMinted;
    uint256 id;
    ImageType imageType;
  }

  mapping(uint => ListingToMintERC721) private listingToMintERC721Map;
  mapping(uint => ListingToMintERC1155) private listingToMintERC1155Map;

  uint256 public counterERC721;
  uint256 public counterERC1155;
  address private contractOwner;
  
  constructor(address _horaceTokenAddress, address _horaceNFTAddress, address _horaceERC1155NFTAddress, address _rentableNFTAddress) {
    horaceTokenAddress = _horaceTokenAddress;
    horaceNFT = HoraceNFT(_horaceNFTAddress);
    horaceERC1155NFT = HoraceERC1155NFT(_horaceERC1155NFTAddress);
    rentableNFT = RentableNFT(_rentableNFTAddress);
    contractOwner = owner();
  }

  function listToPlatformERC721(string[] calldata _tokenURI, uint256[] memory _price, ImageType[] memory _imageType) external {
    require(msg.sender == contractOwner, "Not owner");
    for (uint i=0; i<_tokenURI.length; i++) {
      listingToMintERC721Map[counterERC721+1] = ListingToMintERC721(_price[i], _tokenURI[i], false, _imageType[i]);
      counterERC721++;
    }
  }

  function listToPlatformERC1155(string[] calldata _tokenURI, uint256[] memory _price, uint256[] memory _ids, ImageType[] memory _imageType) external {
    require(msg.sender == contractOwner, "Not owner");
    for (uint i=0; i<_tokenURI.length; i++) {
      listingToMintERC1155Map[counterERC1155+1] = ListingToMintERC1155(_price[i], _tokenURI[i], false, _ids[i], _imageType[i]);
      counterERC1155++;
    }
  }

  function clearListItems(uint256 nftType) external {
    require(msg.sender == contractOwner, "Not owner");
    if (nftType == 721) {
      for (uint i=1; i<=counterERC721; i++) {
        delete listingToMintERC721Map[i];
      }
      counterERC721 = 0;
    } else if (nftType == 1155) {
      for (uint i=1; i<=counterERC1155; i++) {
        delete listingToMintERC1155Map[i];
      }
      counterERC1155 = 0;
    } else {
      revert HoracePlatform__WrongNFTType();
    }
  }

  function checkHaveRented() public view returns(bool) {
    bool rented;
    uint rentableTokenIds = rentableNFT.getTokenIds();
    for (uint check=1; check<=rentableTokenIds; check++) {
      if (rentableNFT.userOf(check) == msg.sender && uint64(rentableNFT.userExpires(check)) > uint64(block.timestamp)) {
        rented = true;
      }
    }
    return rented;
  }

  function updateListing(uint256 _id, uint256 _nftType) internal {
    uint doubleReward;
    if (checkHaveRented()) {
      doubleReward = 2;
    } else {
      doubleReward = 1;
    }
    if (_nftType == 721) {
      ListingToMintERC721 memory item = listingToMintERC721Map[_id];
      IERC20(horaceTokenAddress).transfer(msg.sender, mintNFTRewards * doubleReward);
      item.isMinted = true;
      listingToMintERC721Map[_id] = item;
    } else if (_nftType == 1155) {
      ListingToMintERC1155 memory item = listingToMintERC1155Map[_id];
      IERC20(horaceTokenAddress).transfer(msg.sender, mintNFTRewards * doubleReward);
      item.isMinted = true;
      listingToMintERC1155Map[_id] = item;
    } else {
      revert HoracePlatform__WrongNFTType();
    }
  }

  function mintNFT(uint256 _id, uint256 _nftType, uint256 _amount, bool _royalty) public payable returns (uint256) {
    require(_nftType == 721 || _nftType == 1155);
    uint256 newTokenId;
    if (_nftType == 721) {
      ListingToMintERC721 memory item = listingToMintERC721Map[_id];
      require(item.mintPrice > 0);
      require(msg.value >= item.mintPrice);
      if (_royalty) {
        newTokenId = horaceNFT.mintWithRoyalty(item.tokenUri, msg.sender);
      } else {
        newTokenId = horaceNFT.mint(msg.sender, item.tokenUri);
      }
      updateListing(_id, _nftType);
    } else if (_nftType == 1155) {
      ListingToMintERC1155 memory item = listingToMintERC1155Map[_id];
      require(_amount > 0);
      require(item.mintPrice > 0);
      require(msg.value >= _amount * item.mintPrice);
      if (_royalty) {
        newTokenId = horaceERC1155NFT.mintWithRoyalty(msg.sender, _amount, item.id);
      } else {
        newTokenId = horaceERC1155NFT.mint(_amount, msg.sender, item.id);
      }
      updateListing(_id, _nftType);
    } else {
      revert HoracePlatform__WrongNFTType();
    }
    emit MintNFT(msg.sender, newTokenId, msg.value, block.timestamp);
    return newTokenId;
  }

  function mintOwnNFT(string memory _uri, bool _royalty) public payable {
    require(msg.value >= mintNFTFee);
    uint256 newTokenId;
    if (_royalty) {
      address royaltyReceiver = msg.sender;
      newTokenId = horaceNFT.mintWithRoyalty(_uri, royaltyReceiver);
    } else {
      newTokenId = horaceNFT.mint(msg.sender, _uri);
    }
    uint doubleReward;
    if (checkHaveRented()) {
      doubleReward = 2;
    } else {
      doubleReward = 1;
    }
    IERC20(horaceTokenAddress).transfer(msg.sender, mintNFTRewards * doubleReward);
    emit MintNFT(msg.sender, newTokenId, msg.value, block.timestamp);
  }


  function getAllListingItemERC721() public view returns(ListingToMintERC721[] memory) {
    ListingToMintERC721[] memory allItems = new ListingToMintERC721[](counterERC721);
    for (uint i=0; i<counterERC721; i++) {
      allItems[i] = listingToMintERC721Map[i+1];
    } 
    return allItems;
  }

  function getAllListingItemERC1155() public view returns(ListingToMintERC1155[] memory) {
    ListingToMintERC1155[] memory allItems = new ListingToMintERC1155[](counterERC1155);
    for (uint i=0; i<counterERC1155; i++) {
      allItems[i] = listingToMintERC1155Map[i+1];
    } 
    return allItems;
  }

  // Can use DAO for this function
  function withdrawCrypto(address _receiver) external onlyOwner {
    (bool callSuccess, ) = payable(_receiver).call{value: address(this).balance}("");
    require(callSuccess, "Call failed");
  }

  function withdrawERC20() external {
    require(msg.sender == contractOwner, "Not owner");
    uint erc20Balance = IERC20(horaceTokenAddress).balanceOf(address(this));
    IERC20(horaceTokenAddress).transfer(payable(contractOwner), erc20Balance);   
  }

  function changeMetadata(uint256 _tokenId, string memory _tokenURI) external onlyOwner {
    horaceNFT.changeMetadata(_tokenId, _tokenURI);
  }

  function setURI(string memory newuri) external onlyOwner {
    horaceERC1155NFT.setURI(newuri);
  }

  function getMintNFTRewards() external pure returns (uint256) {
    return mintNFTRewards;
  }

  function getMintNFTFee() external pure returns (uint256) {
    return mintNFTFee;
  }

  function getContractOwner() external view returns (address) {
    return contractOwner;
  }

  function checkContractType(address nftContract) public view returns(bool, bool, bool) {
    bool _iserc721 = false;
    bool _iserc1155 = false;
    bool _withRoyalty = false;

    try IERC165(nftContract).supportsInterface(type(IERC721).interfaceId) returns (bool nft) {
         _iserc721 = nft;
    } catch {
        return (false, false, false);
    }

    try IERC165(nftContract).supportsInterface(type(IERC1155).interfaceId) returns (bool nft) {
         _iserc1155 = nft;
    } catch {
        return (false, false, false);
    }

    try IERC165(nftContract).supportsInterface(type(IERC2981).interfaceId) returns (bool royalty) {
        _withRoyalty = royalty;
    } catch {
        return (false, false, false);
    }
    return (_iserc721, _iserc1155, _withRoyalty);  
  }

}
