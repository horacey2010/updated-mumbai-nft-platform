import { useState, useEffect } from 'react'
import 'bulma/css/bulma.css' // npm install bulma
import Web3 from 'web3' // npm install web3@1.7.4
import HoraceCollateral from '../blockchain/collateralplatform'
import HoraceToken from '../blockchain/horacetoken'
import ModalLoading from '../components/ModalLoading'

export default function Collateral({ address }) {

    const [web3, setWeb3] = useState()
    const [horaceCollateral, setHoraceCollateral] = useState()
    const [allCollateralItems, setAllCollateralItems] = useState([])
    const [loanPayment, setLoanPayment] = useState(0)
    const [showModalLoading, setShowModalLoading] = useState(false)
    const [nftContractAbi, setNftContractAbi] = useState([{"inputs":[{"internalType":"uint256","name":"_maxSupply","type":"uint256"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"PlatformNFT__ExceedMaxSupply","type":"error"},{"inputs":[],"name":"PlatformNFT__NotOwner","type":"error"},{"inputs":[],"name":"PlatformNFT__ValueNotEnough","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_owner","type":"address"},{"indexed":false,"internalType":"uint256","name":"tokenId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"_price","type":"uint256"}],"name":"MintNFT","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"burnNFT","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getMaxSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getOwner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getTokenIds","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"_tokenURI","type":"string"},{"internalType":"uint256","name":"_price","type":"uint256"}],"name":"mint","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"string","name":"_tokenURI","type":"string"},{"internalType":"uint96","name":"feeNumerator","type":"uint96"},{"internalType":"uint256","name":"_price","type":"uint256"}],"name":"mintWithRoyalty","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_tokenId","type":"uint256"},{"internalType":"uint256","name":"_salePrice","type":"uint256"}],"name":"royaltyInfo","outputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"}])
    const [erc1155ContractAbi, setabi] = useState([{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256[]","name":"ids","type":"uint256[]"},{"indexed":false,"internalType":"uint256[]","name":"values","type":"uint256[]"}],"name":"TransferBatch","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"id","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"TransferSingle","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"value","type":"string"},{"indexed":true,"internalType":"uint256","name":"id","type":"uint256"}],"name":"URI","type":"event"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"id","type":"uint256"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address[]","name":"accounts","type":"address[]"},{"internalType":"uint256[]","name":"ids","type":"uint256[]"}],"name":"balanceOfBatch","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getMinter","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getOwner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getTokenIdCounter","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"address","name":"buyer","type":"address"},{"internalType":"uint256","name":"id","type":"uint256"}],"name":"mint","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_royaltyReceiver","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"id","type":"uint256"}],"name":"mintWithRoyalty","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"uint256","name":"salePrice","type":"uint256"}],"name":"royaltyInfo","outputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256[]","name":"ids","type":"uint256[]"},{"internalType":"uint256[]","name":"amounts","type":"uint256[]"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"safeBatchTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_minter","type":"address"}],"name":"setMinter","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"newuri","type":"string"}],"name":"setURI","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"uri","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"}])
    
    useEffect(() => {
        if (address) {
          loadCollateralData()
        }
    }, [address])
  
  
    const loadCollateralData = async () => {
      const web3 = new Web3(window.ethereum)
      setWeb3(web3)
      const networkId = await web3.eth.net.getId()
      if (networkId != 80001) {
          alert(
          `Please connect Mumbai Testnet`,
          );
      } else {
        try {
          let _collateral = HoraceCollateral(web3)
          setHoraceCollateral(_collateral)
          let _allCollateralItems = await _collateral.methods.getAllCollateralItems().call()
          console.log("all items", _allCollateralItems.length)
          let collateralItems = [] 
          let nftImage
          for (let i=0; i<_allCollateralItems.length; i++) {
            if (address == _allCollateralItems[i].nftOwner && _allCollateralItems[i].tokenId >= 1) {
              let nftContract, tokenURI, tokenMetadata
              let contractType = await _collateral.methods.checkContractType(_allCollateralItems[i].nftContract).call()
              if (contractType[0] == true) {
                  nftContract = new web3.eth.Contract(nftContractAbi, _allCollateralItems[i].nftContract)
                  tokenURI = await nftContract.methods.tokenURI(_allCollateralItems[i].tokenId).call()
                  console.log("token uri 1", tokenURI)
                  tokenURI = tokenURI.replace("ipfs://", "https://")
                  tokenURI = tokenURI.replace("/metadata.json", ".ipfs.nftstorage.link/metadata.json")
                  console.log("token uri 2", tokenURI)
                  tokenMetadata = await fetch(tokenURI).then((response) => response.json())
                  nftImage = tokenMetadata["image"]
                  nftImage = nftImage.replace("ipfs:", "https:")
                  nftImage = nftImage.replace("/nft", ".ipfs.nftstorage.link/nft")
              } else if (contractType[1] == true) {
                  nftContract = new web3.eth.Contract(erc1155ContractAbi, _allCollateralItems[i].nftContract)
                  tokenURI = await nftContract.methods.uri(_allCollateralItems[i].tokenId).call()
                  let temp = _allCollateralItems[i].tokenId
                  console.log("temp", temp)
                  let tempString = Math.abs(temp).toString(16).padStart(64, '0');
                  console.log("tempString", tempString)
                  tokenURI = tokenURI.replace("{id}", tempString)
                  console.log("tokenURI", tokenURI)
                  tokenMetadata = await fetch(tokenURI).then((response) => response.json())
                  nftImage = tokenMetadata["image"]
              }
              let metadata_attributes
              if (!(tokenMetadata["attributes"] === null)) {
                  metadata_attributes = tokenMetadata["attributes"]
              } else {
                  metadata_attributes = []
              }
              const collateralItem = {
                  image: nftImage,
                  name: tokenMetadata["name"],
                  description: tokenMetadata["description"],
                  attributes: metadata_attributes, 
                  tokenId: _allCollateralItems[i].tokenId,
                  owner: _allCollateralItems[i].nftOwner,
                  nftContract: _allCollateralItems[i].nftContract,
                  collateralStart: _allCollateralItems[i].collateralStart,
                  amount: _allCollateralItems[i].amount,
                  period: _allCollateralItems[i].period
              }
              collateralItems = [...collateralItems, collateralItem]
            }
          }
          setAllCollateralItems(collateralItems)
        } catch (error) {
          console.log(error)
        }
      }
    }

    const getLoanPayment = async (_nftContract, _tokenId, _period, _amount) => {
        try {
            let _loanPayment = []
            _loanPayment = await horaceCollateral.methods.calculatePriceCollateral(_nftContract, _tokenId, _period).call()
            console.log("loan", _loanPayment[0].toString())
            console.log("repayment", _loanPayment[1].toString())
            let totalPayment
            if (Number(_amount) >= 2) {
                totalPayment = (Number(_loanPayment[0]) + Number(_loanPayment[1])) * Number(_amount)
            } else {
                totalPayment = Number(_loanPayment[0]) + Number(_loanPayment[1])
            }
            totalPayment = web3.utils.fromWei(totalPayment.toString())
            setLoanPayment(totalPayment)
        } catch (error) {
            console.log(error)
        }
    }

    const repayment = async (_nftContract, _tokenId, _collateralStart, _period) => {
        setShowModalLoading(true)
        try {
            let horaceToken = HoraceToken(web3)
            let _loanPayment = web3.utils.toWei(loanPayment)
            await horaceToken.methods.approve(horaceCollateral.options.address, _loanPayment.toString()).send({ from: address })
            await horaceCollateral.methods.withdrawItem(_nftContract, _tokenId, _collateralStart, _period).send({ from: address })
            loadCollateralData()
        } catch (error) {
            setShowModalLoading(false)
            console.log(error)
        }
        setShowModalLoading(false)
    }
          
    return (
        <>
            <h2 class="title">
            <div class="has-text-white">
            Pay your loan.
            </div>
            </h2>
            <h2 class="subtitle mt-4">
            <div class="has-text-white">
                Pay your loan and receive your collateral !!
            </div>
            </h2>
            
            { allCollateralItems.map((item, j) => {
                let withdraw = true
                let humanformatcollateralStart = new Date(item.collateralStart * 1000)
                humanformatcollateralStart = humanformatcollateralStart.toLocaleString()
                let collateralEnd = Number(item.collateralStart) + (Number(item.period)*30*24*60*60)
                console.log("collateralEnd", Number(item.collateralStart) + (30*24*60*60))
                console.log("now", Math.floor(Date.now()/1000))
                if (Number(item.collateralStart) + (30*24*60*60) < Math.floor(Date.now()/1000)) {
                    withdraw = false
                }
                let humanformatcollateralEnd = new Date(collateralEnd * 1000)
                humanformatcollateralEnd = humanformatcollateralEnd.toLocaleString()
                getLoanPayment(item.nftContract, item.tokenId, item.period, item.amount) 
                return (
                    <div class="columns" key={j}>
                        <div class="column">
                            <div class="box">
                                <article class="media">
                                    <div class="media-left">
                                        <figure class="image is-128x128">
                                            <img src={item.image} alt="Placeholder image"/>
                                        </figure>
                                    </div>
                                    <div class="media-content">
                                        <div class="content">
                                            <p>
                                            <strong>NFT Contract: </strong> {item.nftContract} 
                                            <br></br>
                                            <strong>Token ID: </strong> {item.tokenId} &nbsp;&nbsp;
                                            {
                                                item.amount > 0
                                                    ?   <><strong>Amount: </strong> {item.amount}</>
                                                    :   <></>
                                            }
                                            <br></br>
                                            <strong>Loan Period: </strong> {Number(item.period) * 30} days
                                            <br></br>
                                            <strong>Loan start at:</strong> {humanformatcollateralStart}.
                                            <br></br>
                                            <strong>Loan End at:</strong> {humanformatcollateralEnd}.
                                            <br></br>
                                            <><strong>Repayment:</strong> {loanPayment} HAT</>
                                            </p>
                                        </div>
                                        {
                                            withdraw
                                                ?   <button class="button is-primary is-small is-rounded ml-1 mt-2" onClick={() => repayment(item.nftContract, item.tokenId, item.collateralStart, item.period)}>Repayment</button>
                                                :   <></>
                                        }
                                        
                                    </div>
                                </article>
                            </div> 
                        </div>  
                        <div class="column is-two-fifths"></div>
                        <ModalLoading show={showModalLoading}>
                            <div class="columns">
                                <div class="column is-one-third">
                                    <></><br></br>
                                </div>
                                <div class="column is-one-third">
                                    <img src="../Walk.gif" width="50"/><br></br>
                                </div>
                                <div class="column is-one-third">
                                    <></><br></br>
                                </div>
                            </div>
                            <div class="columns">
                                <div class="column is-one-third">
                                    <></><br></br>
                                </div>
                            </div>
                        </ModalLoading>
                    </div>
                )
            })}
            <br></br><br></br>

        </>
    )

}
