import { useState, useEffect } from 'react'
import 'bulma/css/bulma.css' // npm install bulma
import Web3 from 'web3' // npm install web3@1.7.4
import StakeNFT from '../blockchain/horacestakenft'
import ModalLoading from '../components/ModalLoading'

export default function Stake_NFT({ address }) {

    const [web3, setWeb3] = useState()
    const [stakeNFT, setStakeNFT] = useState() 
    const [allStakeNFTItems, setAllStakeNFTItems] = useState([])
    const [reward, setReward] = useState()
    const [showModalLoading, setShowModalLoading] = useState(false)
    const [nftContractAbi, setNftContractAbi] = useState([{"inputs":[{"internalType":"uint256","name":"_maxSupply","type":"uint256"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"PlatformNFT__ExceedMaxSupply","type":"error"},{"inputs":[],"name":"PlatformNFT__NotOwner","type":"error"},{"inputs":[],"name":"PlatformNFT__ValueNotEnough","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_owner","type":"address"},{"indexed":false,"internalType":"uint256","name":"tokenId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"_price","type":"uint256"}],"name":"MintNFT","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"burnNFT","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getMaxSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getOwner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getTokenIds","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"_tokenURI","type":"string"},{"internalType":"uint256","name":"_price","type":"uint256"}],"name":"mint","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"string","name":"_tokenURI","type":"string"},{"internalType":"uint96","name":"feeNumerator","type":"uint96"},{"internalType":"uint256","name":"_price","type":"uint256"}],"name":"mintWithRoyalty","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_tokenId","type":"uint256"},{"internalType":"uint256","name":"_salePrice","type":"uint256"}],"name":"royaltyInfo","outputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"}])
    const [erc1155ContractAbi, setabi] = useState([{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256[]","name":"ids","type":"uint256[]"},{"indexed":false,"internalType":"uint256[]","name":"values","type":"uint256[]"}],"name":"TransferBatch","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"id","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"TransferSingle","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"value","type":"string"},{"indexed":true,"internalType":"uint256","name":"id","type":"uint256"}],"name":"URI","type":"event"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"id","type":"uint256"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address[]","name":"accounts","type":"address[]"},{"internalType":"uint256[]","name":"ids","type":"uint256[]"}],"name":"balanceOfBatch","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getMinter","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getOwner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getTokenIdCounter","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"address","name":"buyer","type":"address"},{"internalType":"uint256","name":"id","type":"uint256"}],"name":"mint","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_royaltyReceiver","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"id","type":"uint256"}],"name":"mintWithRoyalty","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"uint256","name":"salePrice","type":"uint256"}],"name":"royaltyInfo","outputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256[]","name":"ids","type":"uint256[]"},{"internalType":"uint256[]","name":"amounts","type":"uint256[]"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"safeBatchTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_minter","type":"address"}],"name":"setMinter","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"newuri","type":"string"}],"name":"setURI","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"uri","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"}])

    useEffect(() => {
        if (address) {
            loadStakeNFTData()
        }
    }, [address])

    const loadStakeNFTData = async () => {
        const web3 = new Web3(window.ethereum)
        setWeb3(web3)
        const networkId = await web3.eth.net.getId()
        if (networkId != 80001) {
            alert(
            `Please connect Mumbai Testnet`,
            );
        } else {
            let _stakenft = StakeNFT(web3)
            setStakeNFT(_stakenft)
            let _allStakedItems = await _stakenft.methods.getAllStakedItems().call()
            console.log("all staked items", _allStakedItems.length)
            let stakedItems = [] 
            for (let i=0; i<_allStakedItems.length; i++) {
                if (address == _allStakedItems[i].nftOwner && _allStakedItems[i].tokenId >= 1) {
                    console.log("staked start", _allStakedItems[i].stakedStart)
                    console.log("nft owner", _allStakedItems[i].nftOwner)
                    console.log("nft contract", _allStakedItems[i].nftContract)
                    console.log("tokenId", _allStakedItems[i].tokenId)
                    console.log("amount", _allStakedItems[i].amount)

                    let nftContract, tokenURI, tokenMetadata
                    let contractType = await _stakenft.methods.checkContractType(_allStakedItems[i].nftContract).call()
                    if (contractType[0] == true) {
                        nftContract = new web3.eth.Contract(nftContractAbi, _allStakedItems[i].nftContract)
                        tokenURI = await nftContract.methods.tokenURI(_allStakedItems[i].tokenId).call()
                        console.log("token uri", tokenURI)
                        tokenMetadata = await fetch(tokenURI).then((response) => response.json())
                    } else if (contractType[1] == true) {
                        nftContract = new web3.eth.Contract(erc1155ContractAbi, _allStakedItems[i].nftContract)
                        tokenURI = await nftContract.methods.uri(_allStakedItems[i].tokenId).call()
                        let temp = _allStakedItems[i].tokenId
                        console.log("temp", temp)
                        let tempString = Math.abs(temp).toString(16).padStart(64, '0');
                        console.log("tempString", tempString)
                        tokenURI = tokenURI.replace("{id}", tempString)
                        console.log("tokenURI", tokenURI)
                        tokenMetadata = await fetch(tokenURI).then((response) => response.json())
                    }
                    let metadata_attributes
                    if (!(tokenMetadata["attributes"] === null)) {
                        metadata_attributes = tokenMetadata["attributes"]
                    } else {
                        metadata_attributes = []
                    }
                    const stakedItem = {
                        image: tokenMetadata["image"],
                        name: tokenMetadata["name"],
                        description: tokenMetadata["description"],
                        attributes: metadata_attributes, 
                        tokenId: _allStakedItems[i].tokenId,
                        owner: _allStakedItems[i].nftOwner,
                        nftContract: _allStakedItems[i].nftContract,
                        stakedStart: _allStakedItems[i].stakedStart,
                        amount: _allStakedItems[i].amount,
                    }
                    stakedItems = [...stakedItems, stakedItem]
                }
            }
            setAllStakeNFTItems(stakedItems)
        }
    }


    const getRewards = async (_stakedStart) => {
        let _reward = await stakeNFT.methods.calculateRewards(_stakedStart).call()
        _reward = web3.utils.fromWei(_reward)
        setReward(_reward)
    }

    const unstakeNFT = async (_nftContract, _tokenId, _stakedStart) => {
        console.log("_nftContract", _nftContract)
        console.log("_tokenId", _tokenId)
        setShowModalLoading(true)
        console.log("test 1")
        try {
          await stakeNFT.methods.unStake(_nftContract, _tokenId, _stakedStart).send({ from: address })
          loadStakeNFTData()
          setShowModalLoading(false)
        } catch (error) {
          console.log(error)
          loadStakeNFTData()
          setShowModalLoading(false)
        }
    }
  
    return (
        <>
        <h2 class="title">
          <div class="has-text-white">
          Staked NFTs
          </div>
        </h2>
        <h2 class="subtitle mt-4">
          <div class="has-text-white">
            Your NFTs are staked here!! Unstake them to earn HAT rewards 
          </div>
        </h2>
            { allStakeNFTItems.map((item, j) => {
                let humanformatstakeStart = new Date(item.stakedStart * 1000)
                humanformatstakeStart = humanformatstakeStart.toLocaleString()
                getRewards(item.stakedStart)
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
                                            <strong>Stake start at:</strong> {humanformatstakeStart}.
                                            <br></br>
                                            <strong>Staked Reward:</strong> {reward} HAT.
                                            <br></br>
                                            </p>
                                        </div>
                                        <br></br>
                                        <button class="button is-primary is-small is-rounded ml-2 mb-3" onClick={() => unstakeNFT(item.nftContract, item.tokenId, item.stakedStart)}>Unstake</button>
                                        
                                    </div>
                                </article>
                            </div> 
                        </div>
                        <div class="column is-two-fifths"></div>
                    </div>
                )
            })}
            <br></br><br></br>
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
        </>
    )

}
