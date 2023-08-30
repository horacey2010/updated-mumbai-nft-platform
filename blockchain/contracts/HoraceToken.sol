// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract HoraceToken is ERC20, Ownable {

  uint256 private constant maxSupply = 5000000000 * 1e18; // 5000000000 tokens
  
  event MintDBT(address _receiver, uint256 _amount);
  event BurnDBT(address _tokenOwner, uint256 _amount);

  constructor() ERC20("Horace Token", "HAT") {}

  function mint(address _tokenReceiver, uint256 _amount) public onlyOwner {
      require(totalSupply() + _amount <= maxSupply);
      _mint(_tokenReceiver, _amount);
      emit MintDBT(_tokenReceiver, _amount);
  }

  function getMaxSupplyERC20() public pure returns(uint256) {
    return maxSupply;
  }

  function burn(address _tokenOwner, uint256 _amount) public onlyOwner {
    _burn(_tokenOwner, _amount);
    emit BurnDBT(_tokenOwner, _amount);
  }

}

