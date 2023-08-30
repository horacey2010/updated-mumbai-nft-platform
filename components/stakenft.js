import { useState, useEffect } from 'react'
import 'bulma/css/bulma.css' // npm install bulma
import Web3 from 'web3' // npm install web3@1.7.4
import StakeNFT from '../blockchain/horacestakenft'
import HoraceNFT from '../blockchain/horacenft'
import Modal from '../components/Modal'
import ModalLoading from '../components/ModalLoading'

export default function Stake_NFT({ address }) {

    const [web3, setWeb3] = useState()
    const [stakeNFT, setStakeNFT] = useState() 
    const [allStakeNFTItems, setAllStakeNFTItems] = useState([])
    const [image, setImage] = useState()
    const [attributes, setAttributes] = useState([])
    const [name, setName] = useState()
    const [description, setDescription] = useState()
    const [tokenId, setTokenId] = useState()
    const [nftContract, setNftContract] = useState()
    const [stakedStart, setStakedStart] = useState()
    const [stakedStartAt, setStakedStartAt] = useState()
    const [stakedAmount, setStakedAmount] = useState()
    const [reward, setReward] = useState()
    const [showModal, setShowModal] = useState(false) 
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
                        // let tempString = temp.toString().padStart(64, '0');
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

    const displayModal = async (_image, _attributes, _name, _description, _tokenId, _nftContract, _owner, _stakedStart, _amount) => {
        setShowModal(true)
        setImage(_image)
        if (_attributes) {
            setAttributes(_attributes)
        } else {
            setAttributes([])
        }
        setName(_name)
        setDescription(_description)
        setTokenId(_tokenId.substr(_tokenId.length - 4))
        setNftContract(_nftContract)
        let _stakedStartAt = new Date(_stakedStart * 1000)
        setStakedStartAt(_stakedStartAt.toLocaleString())
        setStakedStart(_stakedStart)
        let _reward = await stakeNFT.methods.calculateRewards(_stakedStart).call()
        _reward = web3.utils.fromWei(_reward)
        setReward(_reward)
        setStakedAmount(_amount)
        console.log("staked start", _stakedStart)
        console.log("_image", _image)
        console.log("_name", _name)
        console.log("_description", _description)
        console.log("_tokenId", _tokenId.substr(_tokenId.length - 4))
        console.log("_contractAddress", _nftContract)
        console.log("_amount", _amount)
    }

    const unstakeNFT = async (_nftContract, _tokenId, _stakedStart) => {
        console.log("_nftContract", _nftContract)
        console.log("_tokenId", _tokenId)
        setShowModal(false)
        setShowModalLoading(true)
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
            { allStakeNFTItems.map((columns, j) => {
                if ((j % 4) == 0) {
                    return (
                        <div class="columns" key={j}>
                            { allStakeNFTItems.map((item, i) => {
                                if (i >= j && i < j + 4) {
                                    return (
                                        <div class="column is-one-quarter" key={i}>
                                            <div class="card">
                                                <div class="card-image">
                                                    <figure class="image is-4by3">
                                                        <img src={item.image} alt="Placeholder image" width={480}/>
                                                    </figure>
                                                </div>
                                                <footer class="card-footer">
                                                <a  class="card-footer-item" onClick={() => displayModal(item.image, item.attributes, item.name, item.description, item.tokenId, item.nftContract, item.owner, item.stakedStart, item.amount)}>Unstake</a>
                                                </footer>                                                            
                                            </div>
                                            
                                            <Modal show={showModal} onClose={() => setShowModal(false)}>
                                                <div class="columns mb-1">
                                                    <div class="column is-one-third">
                                                        <img src={image} alt="Placeholder image" width={200}/>
                                                    </div>
                                                    <div class="column">
                                                        <h2><strong>Name:</strong> {name}</h2>
                                                        <h2><strong>Description:</strong> {description}</h2>
                                                        {
                                                            attributes.map((attribute, k) => {
                                                            return (
                                                                <h2 key={k}><strong>{attribute.trait_type}:</strong> {attribute.value}</h2>
                                                            )
                                                            })
                                                        }
                                                        {
                                                            stakedAmount > 0
                                                                ? <><h2><strong>ID:</strong> {tokenId} &nbsp;&nbsp;&nbsp; <strong>Amount:</strong> {stakedAmount}</h2></>
                                                                : <><h2><strong>ID:</strong> {tokenId} </h2></>
                                                        }
                                                        <h2><strong>Staked Reward:</strong> approx {reward} HAT</h2>
                                                        <h2><strong>NFT Contract:</strong> {nftContract}</h2>
                                                        <h2><strong>Staked start at:</strong> {stakedStartAt}</h2>
                                                    </div>
                                                </div>
                                                <div class="columns">
                                                    <div class="column is-four-fifths">
                                                        <></>
                                                    </div>
                                                    <div class="column">
                                                        <button class="button is-primary is-small is-rounded ml-4 mb-3" onClick={() => unstakeNFT(nftContract, tokenId, stakedStart)}>Unstake</button>
                                                    </div>
                                                </div>
                                            </Modal>
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
                                }
                            })}
                        </div>
                    )
                }
            })}
            <br></br><br></br>
        </>
    )

}
