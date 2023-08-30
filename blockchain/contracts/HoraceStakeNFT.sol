// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./RentableNFT.sol";

contract HoraceStakeNFT is ERC721Holder, ReentrancyGuard, Ownable {

  uint public stakingCounter;
  // e.g. 300 wei per second, 25,920,000 wei per day or 0.00000000002592 token per day
  // uint256 public rewardsPerSecond = (1 * 10 ^ 18) / 1 days; //  earn 1 tokens per day
  uint256 private constant rewardsPerSecond = 3000000000; 
  // uint256 public doubleRewardPrice = 1e17;
  address private immutable horaceTokenAddress;
  address private immutable contractOwner;

  RentableNFT private rentableNFT;

  struct StakedNFT {
    uint256 stakedStart;
    address nftOwner;
    address nftContract;
    uint256 tokenId;
    uint256 amount;
  }

  mapping(uint256 => StakedNFT) private stakedNFTItems;

  event StakingNFT(address indexed _nftContract, uint256 indexed _tokenId, uint stakedStart, address indexed _nftOwner);
  event Unstake(address indexed _nftContract, uint256 indexed _tokenId, address indexed _nftOwner, uint256 _rewards);

  constructor(address _horaceTokenAddress, address _rentableNFTAddress) {
    contractOwner = owner();
    horaceTokenAddress = _horaceTokenAddress;
    rentableNFT = RentableNFT(_rentableNFTAddress);
  }

  // for ERC1155 NFT Receiver
  function onERC1155Received(address, address, uint256, uint256, bytes memory) public virtual returns (bytes4) {
        return this.onERC1155Received.selector;
  }

  function onERC1155BatchReceived(address, address, uint256[] memory, uint256[] memory, bytes memory) public virtual returns (bytes4) {
        return this.onERC1155BatchReceived.selector;
  }
  //

  function checkContractType(address nftContract) public view returns(bool, bool) {
    bool _iserc721 = false;
    bool _iserc1155 = false;

    try IERC165(nftContract).supportsInterface(type(IERC721).interfaceId) returns (bool nft) {
         _iserc721 = nft;
    } catch {
        return (false, false);
    }

    try IERC165(nftContract).supportsInterface(type(IERC1155).interfaceId) returns (bool nft) {
         _iserc1155 = nft;
    } catch {
        return (false, false);
    }

    return (_iserc721, _iserc1155);  
  }

  function stakeToNFTPlatform(address _nftContract, uint256 _tokenId, uint256 _amount) public {
    (bool isERC721, bool isERC1155) = checkContractType(_nftContract);
    if (isERC721) {
      require(IERC721(_nftContract).ownerOf(_tokenId) == msg.sender);
      IERC721(_nftContract).safeTransferFrom(msg.sender, address(this), _tokenId);
      _amount = 0;
    }
    if (isERC1155) {
      require(IERC1155(_nftContract).balanceOf(msg.sender, _tokenId) >= _amount);
      IERC1155(_nftContract).safeTransferFrom(msg.sender, address(this), _tokenId, _amount, "");
    }
    stakingCounter++;
    stakedNFTItems[stakingCounter] = StakedNFT(block.timestamp, msg.sender, _nftContract, _tokenId, _amount);
    emit StakingNFT(_nftContract, _tokenId, block.timestamp, msg.sender);
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

  function calculateRewards(uint256 _stakedStart) public view returns(uint256) {
    uint256 _rewards;
    uint256 doubleReward;
    if (checkHaveRented()) {
      doubleReward = 2;
    } else {
      doubleReward = 1;
    }
    uint256 timeElapsed = block.timestamp - _stakedStart;
    _rewards = timeElapsed * rewardsPerSecond * doubleReward;
    return _rewards;
  }

  function unStake(address _nftContract, uint256 _tokenId, uint256 _stakedStart) public nonReentrant {
    (bool isERC721, bool isERC1155) = checkContractType(_nftContract);
    uint256 rewards;
    if (isERC721) {
      for (uint256 i=1; i<=stakingCounter; i++) {
        if (stakedNFTItems[i].nftContract == _nftContract && stakedNFTItems[i].tokenId == _tokenId && stakedNFTItems[i].nftOwner == msg.sender) {
          rewards = calculateRewards(_stakedStart);
          require(IERC20(horaceTokenAddress).balanceOf(address(this)) >= rewards);
          delete stakedNFTItems[i];
          IERC20(horaceTokenAddress).transfer(msg.sender, rewards);
          IERC721(_nftContract).transferFrom(address(this), msg.sender, _tokenId);
        }
      }
    }
    if (isERC1155) {
      for (uint256 i=1; i<=stakingCounter; i++) {
        if (stakedNFTItems[i].nftContract == _nftContract && stakedNFTItems[i].tokenId == _tokenId && stakedNFTItems[i].nftOwner ==msg.sender && stakedNFTItems[i].stakedStart == _stakedStart) {
          StakedNFT memory item = stakedNFTItems[i];
          rewards = calculateRewards(_stakedStart);
          require(IERC20(horaceTokenAddress).balanceOf(address(this)) >= rewards);
          delete stakedNFTItems[i];
          IERC20(horaceTokenAddress).transfer(msg.sender, rewards);
          IERC1155(_nftContract).safeTransferFrom(address(this), msg.sender, _tokenId, item.amount, "");
        }
      }
    }
    emit Unstake(_nftContract, _tokenId, msg.sender, rewards);
  }

  function getAllStakedItems() public view returns (StakedNFT[] memory) {
    StakedNFT[] memory allstakedItems = new StakedNFT[](stakingCounter);
    uint256 stakedIndex = 0;
    for (uint256 i=1; i<=stakingCounter; i++) {
      if (stakedNFTItems[i].nftContract != address(0)) {
        allstakedItems[stakedIndex] = stakedNFTItems[i];
        stakedIndex++;
      }
    }
    return allstakedItems;
  }

  function withdrawERC20() external onlyOwner {
    IERC20(horaceTokenAddress).transfer(contractOwner, IERC20(horaceTokenAddress).balanceOf(address(this)));
  } 

}
