// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/interfaces/IERC2981.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import {PriceConverter} from "./PriceConverter.sol";

contract HoraceMarketplace is ERC721Holder, ReentrancyGuard, Ownable {

    error HoraceMarketplace__WrongNFTType();

    using PriceConverter for uint256;

    event BuyItem(address indexed contractAddress, uint256 indexed tokenId, address indexed buyer, uint256 nftPrice, uint256 amount, uint256 datePruchase);
    event AddToMarketplace(address indexed _nftContract, uint256 indexed _tokenId, uint256 _price, uint256 _amount, address indexed _owner);

    uint public marketplaceCounter;
    uint public tradingCounter;
    address private immutable horaceTokenAddress;
    address private immutable contractOwner;
    uint256 private immutable marketplaceFee; 

    AggregatorV3Interface private s_priceFeed;

    struct MarketplaceItem {
        address nftContract;
        uint256 tokenId;
        uint256 nftPrice;
        uint256 amount;
        address payable nftOwner;
    }

    struct TradingRecord {
        address nftContract;
        uint256 tokenId;
        uint256 nftPrice;
        uint256 amount;
        address buyer;
        uint256 dateOfPurchased;
    }

    mapping(uint256 => MarketplaceItem) private marketplaceItems;
    mapping(uint256 => TradingRecord) private tradingRecords;

    constructor(address _dbtAddress, address priceFeed) {
        contractOwner = owner();
        horaceTokenAddress = _dbtAddress;
        marketplaceFee = 5e17;
        s_priceFeed = AggregatorV3Interface(priceFeed);
    }

    function onERC1155Received(address, address, uint256, uint256, bytes memory) public virtual returns (bytes4) {
        return this.onERC1155Received.selector;
    }

    function onERC1155BatchReceived(address, address, uint256[] memory, uint256[] memory, bytes memory) public virtual returns (bytes4) {
        return this.onERC1155BatchReceived.selector;
    }

    function checkContractType(address nftContract) public view returns(bool, bool, bool) {
        bool _iserc721 = false;
        bool _iserc1155;
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

    function addToMarketplace(address _nftContract, uint256 _tokenId, uint256 _price, uint256 _amount) public {
        require(IERC20(horaceTokenAddress).balanceOf(msg.sender) >= marketplaceFee);
        require(_price > 0);
        (bool isERC721, bool isERC1155, ) = checkContractType(_nftContract);
        if (isERC721) {
            require(IERC721(_nftContract).ownerOf(_tokenId) == msg.sender);
            IERC20(horaceTokenAddress).transferFrom(msg.sender, address(this), marketplaceFee);
            IERC721(_nftContract).safeTransferFrom(msg.sender, address(this), _tokenId);
            marketplaceCounter++;
            marketplaceItems[marketplaceCounter] = MarketplaceItem(_nftContract, _tokenId, _price, 0, payable(msg.sender));
            
        } else if (isERC1155) {
            require(_amount > 0);
            require(IERC1155(_nftContract).balanceOf(msg.sender, _tokenId) >= _amount);
            IERC20(horaceTokenAddress).transferFrom(msg.sender, address(this), marketplaceFee);
            IERC1155(_nftContract).safeTransferFrom(msg.sender, address(this), _tokenId, _amount, "");
            bool itemExist = false;
            for (uint256 i=1; i<=marketplaceCounter; i++) {
                if (marketplaceItems[i].nftContract == _nftContract && marketplaceItems[i].tokenId == _tokenId && marketplaceItems[i].nftOwner == msg.sender) {
                    MarketplaceItem memory item = marketplaceItems[i];
                    item.amount = item.amount + _amount;
                    item.nftPrice = _price;
                    marketplaceItems[i] = item;
                    itemExist = true;
                }
            }
            if (!itemExist) {
                marketplaceCounter++;
                marketplaceItems[marketplaceCounter] = MarketplaceItem(_nftContract, _tokenId, _price, _amount, payable(msg.sender));
            }
            emit AddToMarketplace(_nftContract, _tokenId, _price, _amount, msg.sender);
        } else {
            revert HoraceMarketplace__WrongNFTType();
        }
    }

    function unlistFromMarketplace(address _nftContract, uint256 _tokenId) public nonReentrant {
        (bool isERC721, bool isERC1155,) = checkContractType(_nftContract);
        if (isERC721) {
            for (uint256 i=1; i<=marketplaceCounter; i++) {
                if (marketplaceItems[i].nftContract == _nftContract && marketplaceItems[i].tokenId == _tokenId) {
                    MarketplaceItem memory item = marketplaceItems[i];
                    require(item.nftOwner == msg.sender);
                    delete marketplaceItems[i];
                    IERC721(_nftContract).transferFrom(address(this), msg.sender, _tokenId);
                }
            }
        }
        if (isERC1155) {
            for (uint256 i=1; i<=marketplaceCounter; i++) {
                if (marketplaceItems[i].nftContract == _nftContract && marketplaceItems[i].tokenId == _tokenId && marketplaceItems[i].nftOwner == msg.sender) {
                    MarketplaceItem memory item = marketplaceItems[i];
                    uint256 amount = item.amount;
                    delete marketplaceItems[i];
                    IERC1155(_nftContract).safeTransferFrom(address(this), msg.sender, _tokenId, amount, "");
                }
            }
        }
    }

    function buyItems(address _nftContract, uint256 _tokenId, uint256 _amount, address _nftOwner) public payable {
        (bool isERC721, bool isERC1155, bool isRoyalty) = checkContractType(_nftContract);
        if (isERC721 && isERC1155) { revert HoraceMarketplace__WrongNFTType(); }
        for (uint256 i=1; i<=marketplaceCounter; i++) {
            if (marketplaceItems[i].nftContract == _nftContract && marketplaceItems[i].tokenId == _tokenId && marketplaceItems[i].nftOwner == _nftOwner) {
                MarketplaceItem memory item = marketplaceItems[i];
                require(item.nftOwner != msg.sender);
                require(item.amount >= _amount);
                if (isRoyalty == true) {
                    (address royaltyReceiver, uint256 royaltyAmount) = IERC2981(_nftContract).royaltyInfo(_tokenId, item.nftPrice);
                    if (royaltyReceiver != item.nftOwner && royaltyReceiver != contractOwner) {
                        if (isERC721) {
                            require(msg.value >= item.nftPrice + royaltyAmount);
                            payable(item.nftOwner).transfer(item.nftPrice);
                            payable(royaltyReceiver).transfer(royaltyAmount);
                        }
                        if (isERC1155) {
                            require(msg.value >= (item.nftPrice + royaltyAmount) * _amount);
                            payable(item.nftOwner).transfer(item.nftPrice * _amount);
                            payable(royaltyReceiver).transfer(royaltyAmount * _amount);
                        }
                    } else {
                        if (isERC721) {
                            require(msg.value >= item.nftPrice);
                            payable(item.nftOwner).transfer(item.nftPrice);
                        }
                        if (isERC1155) {
                            require(msg.value >= item.nftPrice * _amount);
                            payable(item.nftOwner).transfer(item.nftPrice * _amount);
                        }
                    }
                } else {
                    if (isERC721) {
                        require(msg.value >= item.nftPrice);
                        payable(item.nftOwner).transfer(item.nftPrice);
                    }
                    if (isERC1155) {
                        require(msg.value >= item.nftPrice * _amount);
                        payable(item.nftOwner).transfer(item.nftPrice * _amount);
                    }
                } 
                if (isERC721) {
                    delete marketplaceItems[i];
                    IERC721(_nftContract).transferFrom(address(this), msg.sender, _tokenId);
                }
                if (isERC1155) {
                    if (item.amount == _amount) {
                        delete marketplaceItems[i];
                    } else {
                        item.amount = item.amount - _amount;
                        marketplaceItems[i] = item;
                    }
                    IERC1155(_nftContract).safeTransferFrom(address(this), msg.sender, _tokenId, _amount, "");
                }
                tradingCounter++;
                tradingRecords[tradingCounter] = TradingRecord(_nftContract, _tokenId, item.nftPrice, _amount, msg.sender, block.timestamp);
            }
        }
    }


    function getAllMarketplaceItem() public view returns(MarketplaceItem[] memory) {
        MarketplaceItem[] memory allMarketplaceItems = new MarketplaceItem[](marketplaceCounter);
        uint index = 0;
        for (uint256 i=1; i<=marketplaceCounter; i++) {
            if (marketplaceItems[i].nftContract != address(0)) {
                allMarketplaceItems[index] = marketplaceItems[i];
                index++;
            }
        }
        return allMarketplaceItems;
    }

    function getAllTradingRecords() public view returns(TradingRecord[] memory) {
        TradingRecord[] memory allTradingRecords = new TradingRecord[](tradingCounter);
        for (uint i=0; i<tradingCounter; i++) {
            allTradingRecords[i] = tradingRecords[i+1];
        } 
        return allTradingRecords;
    }

    function withdrawERC20() external onlyOwner() {
        IERC20(horaceTokenAddress).transfer(contractOwner, IERC20(horaceTokenAddress).balanceOf(address(this)));
    }

    function getVersion() public view returns (uint256){
        return s_priceFeed.version();
    }

    function getETHPrice(uint256 ethAmount) external view returns(uint256) {
        return (ethAmount.getConversionRate(s_priceFeed));
    }

}
