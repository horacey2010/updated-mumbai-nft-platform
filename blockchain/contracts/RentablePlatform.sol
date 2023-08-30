// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./RentableNFT.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RentablePlatform is Ownable {

  RentableNFT public rentable;
  uint public rentableCounter;
  address payable public contractOwner;

  struct Rentable {
    uint256 tokenId;
    uint256 pricePerHour;
    uint64 startDateUNIX;
    uint64 endDateUNIX;
  }

  mapping(uint => Rentable) private rentableMap; // tokenId => RentableNFT

  constructor(address _rentable) {
    rentable = RentableNFT(_rentable);
    contractOwner = payable(owner());
  }

  function listToRentablePlatform(
    uint256[] memory _tokenId, 
    uint256[] memory _pricePerHour, 
    uint64[] memory _startDateUNIX, 
    uint64[] memory _endDateUNIX
  ) external onlyOwner {
    for (uint i=0; i<_tokenId.length; i++) {
      rentableMap[rentableCounter+1] = Rentable(
        _tokenId[i],
        _pricePerHour[i],
        _startDateUNIX[i],
        _endDateUNIX[i]
      );
      rentableCounter++;
    }
  }

  function clearRentablePlatform() external onlyOwner {
    for (uint i=1; i<=rentableCounter; i++) {
      delete rentableMap[i];
    }
  }

  function rentToPlatform(uint256 _tokenId, uint64 _expires, uint256 _numHours) public payable {
    (bool haveRented,) = checkHaveRented();
    require(!haveRented, "Already rented");
    require(rentable.userOf(_tokenId) == address(0) || block.timestamp > rentable.userExpires(_tokenId));
    Rentable storage rentableNFT = rentableMap[_tokenId];
    require(_expires <= rentableNFT.endDateUNIX);
    uint256 rentalFee = rentableNFT.pricePerHour * _numHours;
    require(msg.value >= rentalFee, "not enough payment");
    rentable.setUser(_tokenId, msg.sender, _expires);
    (bool callSuccess, ) = payable(contractOwner).call{value: msg.value}("");
    require(callSuccess, "Call failed");
  }

  function checkHaveRented() public view returns(bool, uint256) {
    uint rentableTokenIds = rentable.getTokenIds();
    bool rented;
    uint256 tokenId;
    for (uint check=1; check<=rentableTokenIds; check++) {
      if (rentable.userOf(check) == msg.sender && uint64(rentable.userExpires(check)) > uint64(block.timestamp)) {
        rented = true;
        tokenId = check;
      }
    }
    return (rented, tokenId);
  }

  function changeRentableData(uint256 _tokenId, uint256 _pricePerHour, uint64 _startDateUNIX, uint64 _endDateUNIX) external onlyOwner {
    require(rentable.userOf(_tokenId) == address(0) || block.timestamp > rentable.userExpires(_tokenId));
    require(_pricePerHour > 0);
    require(_endDateUNIX > _startDateUNIX);
    for (uint i=1; i<=rentableCounter; i++) {
      if (rentableMap[i].tokenId == _tokenId) {
        Rentable storage rentableNFT = rentableMap[i];
        rentableNFT.pricePerHour = _pricePerHour;
        rentableNFT.startDateUNIX = _startDateUNIX;
        rentableNFT.endDateUNIX = _endDateUNIX;
        rentableMap[i] = rentableNFT;
      }
    }
  }

  function getAllRentableItems() public view returns(Rentable[] memory) {
    Rentable[] memory allItems = new Rentable[](rentableCounter);
    for (uint i=0; i<rentableCounter; i++) {
      allItems[i] = rentableMap[i+1];
    }
    return allItems;
  }
  
}
