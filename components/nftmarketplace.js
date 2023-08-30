import { useState, useEffect } from 'react'
import 'bulma/css/bulma.css' // npm install bulma
import Web3 from 'web3' // npm install web3@1.7.4
import HoraceMarketplace from '../blockchain/horacemarketplace'
import HoraceNFT from '../blockchain/horacenft'
import HoracePlatform from '../blockchain/horaceplatform'
import Modal from '../components/Modal'
import ModalLoading from '../components/ModalLoading'
import ModalHistory from '../components/ModalHistory'

export default function Horace_Marketplace({ address }) {

    const [web3, setWeb3] = useState()
    const [contractOwner, setContractOwner] = useState()
    const [horaceMarketplace, setHoraceMarketplace] = useState() 
    const [horacePlatform, setHoracePlatform] = useState()
    const [allMarketplaceItems, setAllMarketplaceItems] = useState([])
    const [image, setImage] = useState()
    const [tokenUri, setTokenUri] = useState()
    const [attributes, setAttributes] = useState([])
    const [name, setName] = useState()
    const [seller, setSeller] = useState()
    const [description, setDescription] = useState()
    const [tokenId, setTokenId] = useState()
    const [nftContract, setNftContract] = useState()
    const [nftPrice, setNftPrice] = useState()
    const [ethPrice, setEthPrice] = useState()
    const [royalty, setRoyalty] = useState(false)
    const [royaltyAmount, setRoyaltyAmount] = useState() 
    const [showModal, setShowModal] = useState(false) 
    const [showModalHistory, setShowModalHistory] = useState(false)
    const [showModalLoading, setShowModalLoading] = useState(false)
    const [nftContractAbi, setNftContractAbi] = useState([{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"_fromTokenId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"_toTokenId","type":"uint256"}],"name":"BatchMetadataUpdate","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"_tokenId","type":"uint256"}],"name":"MetadataUpdate","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"string","name":"_tokenURI","type":"string"}],"name":"changeMetadata","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getRoyaltyFee","outputs":[{"internalType":"uint96","name":"","type":"uint96"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"string","name":"uri","type":"string"}],"name":"mint","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"uri","type":"string"},{"internalType":"address","name":"_royaltyReceiver","type":"address"}],"name":"mintWithRoyalty","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"uint256","name":"salePrice","type":"uint256"}],"name":"royaltyInfo","outputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}])
    const [erc1155ContractAbi, setabi] = useState([{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256[]","name":"ids","type":"uint256[]"},{"indexed":false,"internalType":"uint256[]","name":"values","type":"uint256[]"}],"name":"TransferBatch","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"id","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"TransferSingle","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"value","type":"string"},{"indexed":true,"internalType":"uint256","name":"id","type":"uint256"}],"name":"URI","type":"event"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"id","type":"uint256"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address[]","name":"accounts","type":"address[]"},{"internalType":"uint256[]","name":"ids","type":"uint256[]"}],"name":"balanceOfBatch","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getTokenIdCounter","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"address","name":"mintee","type":"address"},{"internalType":"uint256","name":"id","type":"uint256"}],"name":"mint","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_royaltyReceiver","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"id","type":"uint256"}],"name":"mintWithRoyalty","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"uint256","name":"salePrice","type":"uint256"}],"name":"royaltyInfo","outputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256[]","name":"ids","type":"uint256[]"},{"internalType":"uint256[]","name":"amounts","type":"uint256[]"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"safeBatchTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"newuri","type":"string"}],"name":"setURI","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"uri","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"}])
    const [tradingRecords, setTradingRecords] = useState([])
    const [saleAmount, setSaleAmount] = useState()
    const [nftType, setNFTType] = useState(0)
    const [buyAmount, setBuyAmount] = useState(0)
    

    useEffect(() => {
        // if (address) {
            loadMarketplaceData()
        // }
    }, [address])

    const loadMarketplaceData = async () => {
        const web3 = new Web3(window.ethereum)
        setWeb3(web3)
        const networkId = await web3.eth.net.getId()
        if (networkId != 80001) {
            alert(
            `Please connect Mumbai Testnet`,
            );
        } else {
            try {
                let _marketplace = HoraceMarketplace(web3)
                setHoraceMarketplace(_marketplace)
                let _horacePlatform = HoracePlatform(web3)
                setHoracePlatform(_horacePlatform)
                let _allMarketplaceItems = await _marketplace.methods.getAllMarketplaceItem().call()
                console.log("all marketplace items", _allMarketplaceItems.length)
                let _contractOwner = await _marketplace.methods.owner().call()
                setContractOwner(_contractOwner)
                let marketplaceItems = []
                let nftImage
                for (let i=0; i<_allMarketplaceItems.length; i++) {
                    if (_allMarketplaceItems[i].tokenId >= 1) {
                        console.log("nft contract", _allMarketplaceItems[i].nftContract)
                        console.log("tokenId", _allMarketplaceItems[i].tokenId)
                        console.log("nft price", _allMarketplaceItems[i].amount)
                        console.log("amount", _allMarketplaceItems[i].nftPrice)
                        console.log("nft owner", _allMarketplaceItems[i].nftOwner)
                        let nftContract, tokenURI, tokenMetadata
                        let contractType = await _marketplace.methods.checkContractType(_allMarketplaceItems[i].nftContract).call()
                        console.log("contract type", contractType)
                        if (contractType[0] == true) {
                            nftContract = new web3.eth.Contract(nftContractAbi, _allMarketplaceItems[i].nftContract) 
                            tokenURI = await nftContract.methods.tokenURI(_allMarketplaceItems[i].tokenId).call()
                            console.log("tokenURI", tokenURI)
                            tokenURI = tokenURI.replace("ipfs://", "https://")
                            tokenURI = tokenURI.replace("/metadata.json", ".ipfs.nftstorage.link/metadata.json")
                            console.log("tokenURI replace", tokenURI)
                            tokenMetadata = await fetch(tokenURI).then((response) => response.json())
                            console.log("tokenMetadata", tokenMetadata)
                            console.log("tokenMetadata image", tokenMetadata["image"])
                            nftImage = tokenMetadata["image"]
                            nftImage = nftImage.replace("ipfs:", "https:")
                            nftImage = nftImage.replace("/nft", ".ipfs.nftstorage.link/nft")
                        } else if (contractType[1] == true) {
                            nftContract = new web3.eth.Contract(erc1155ContractAbi, _allMarketplaceItems[i].nftContract)
                            tokenURI = await nftContract.methods.uri(_allMarketplaceItems[i].tokenId).call()
                            console.log("tokenURI", tokenURI)
                            let temp = _allMarketplaceItems[i].tokenId
                            let tempString = Math.abs(temp).toString(16).padStart(64, '0');
                            console.log("tempString", tempString)
                            tokenURI = tokenURI.replace("{id}", tempString)
                            console.log("tokenURI update", tokenURI)
                            tokenMetadata = await fetch(tokenURI).then((response) => response.json())
                            nftImage = tokenMetadata["image"]
                        } else {
                            alert(
                                `NFT type not support!!`,
                            );
                        }
                        console.log("token uri", tokenURI)
                        console.log("image", tokenMetadata["image"])
                        console.log("attributes length", tokenMetadata["attributes"])
                        let metadata_attributes
                        if (!(tokenMetadata["attributes"] === null)) {
                            metadata_attributes = tokenMetadata["attributes"]
                        } else {
                            metadata_attributes = []
                        }
                        let _nftPrice = web3.utils.fromWei(_allMarketplaceItems[i].nftPrice)
                        const marketplaceItem = {
                            image: nftImage,
                            name: tokenMetadata["name"],
                            description: tokenMetadata["description"],
                            attributes: metadata_attributes, 
                            nftPrice: _nftPrice,
                            tokenUri: tokenURI,
                            tokenId: _allMarketplaceItems[i].tokenId,
                            nftOwner: _allMarketplaceItems[i].nftOwner,
                            amount: _allMarketplaceItems[i].amount,
                            nftContract: _allMarketplaceItems[i].nftContract,
                        }
                        marketplaceItems = [...marketplaceItems, marketplaceItem]
                    }
                }
                setAllMarketplaceItems(marketplaceItems)
            } catch (error) {
                console.log(error)
            }
        }
    }

    const getBuyAmount = event => {
        setBuyAmount(event.target.value)
        console.log("buyAmount", event.target.value)
    }

    const buyNFT = async (_seller) => {
        setShowModal(false)
        setShowModalLoading(true)
        let cost
        let price = Number(nftPrice)
        let royaltyCost = Number(royaltyAmount)
        console.log("royalty amount", royaltyCost)
        console.log("nft price", price)
        console.log("cost", cost)
        console.log("royalty", royalty)
        console.log("nft type", nftType)
        if (nftType == 721) {
            if (royalty) {
                cost = price + royaltyCost
            } else {
                cost = price
            }
        } else {
            if (royalty) {
                cost = (price + royaltyCost) * buyAmount
            } else {
                cost = price * buyAmount
            }
        }
        cost = web3.utils.toWei(cost.toString())
        console.log("buyAmount", buyAmount)
        console.log("saleAmount", saleAmount)
        if (nftType == 1155) {
            if (Number(saleAmount) >= Number(buyAmount)) {
                try {
                    await horaceMarketplace.methods.buyItems(nftContract, tokenId, buyAmount, seller).send({ from: address, value: cost.toString() })
                    loadMarketplaceData()
                    setShowModalLoading(false)
                } catch (error) {
                    console.log("error", error)
                    setShowModalLoading(false)
                }
            } else {
                // setShowModalLoading(false)
                alert(
                    `Must be smaller or equal to ${saleAmount}`,
                ); 
            }
        } 
        if (nftType == 721) {
            try {
                await horaceMarketplace.methods.buyItems(nftContract, tokenId, buyAmount, seller).send({ from: address, value: cost.toString() })
                loadMarketplaceData()
                setShowModalLoading(false)
            } catch (error) {
                console.log("error", error)
                setShowModalLoading(false)
            }
        }

    }

    const unList = async (_nftContract, _tokenId) => {
        console.log("nft contract", _nftContract)
        console.log("tokenId", _tokenId)
        setShowModalLoading(true)
        try {
            await horaceMarketplace.methods.unlistFromMarketplace(_nftContract, _tokenId).send({ from: address })
        } catch(error) {
            console.log(error)
            setShowModalLoading(false)
        }
        loadMarketplaceData()
        setShowModalLoading(false)
    }

          
    const displayModal = async (_item, _image, _tokenUri, _attributes, _name, _description, _tokenId, _nftContractAddress, _nftPrice, _nftOwner, _amount) => {
        if (address) {
            setShowModal(true)
            setImage(_image)
            setTokenUri(_tokenUri)
            if (_attributes) {
                setAttributes(_attributes)
            } else {
                setAttributes([])
            }
            setName(_name)
            setDescription(_description)
            setSeller(_nftOwner)
            console.log("nft owner", _nftOwner)
            setNftPrice(_nftPrice)
            _nftPrice = web3.utils.toWei(_nftPrice)
            console.log("_nftPrice", _nftPrice)
            let _ethPrice = await horaceMarketplace.methods.getETHPrice(_nftPrice.toString()).call()
            console.log("_ethPrice", web3.utils.fromWei(_ethPrice))
            setEthPrice(web3.utils.fromWei(_ethPrice))
            let nftContract, result
            let contractType = await horacePlatform.methods.checkContractType(_nftContractAddress).call()
            if (contractType[0] == true) {
                setNFTType(721)
                setSaleAmount(0)
                nftContract = new web3.eth.Contract(nftContractAbi, _nftContractAddress)
                _nftPrice = web3.utils.toWei(_nftPrice)
                result = await nftContract.methods.royaltyInfo(_tokenId, _nftPrice.toString()).call()
            } else {
                setNFTType(1155)
                setSaleAmount(_amount)
                nftContract = new web3.eth.Contract(erc1155ContractAbi, _nftContractAddress)
                result = await nftContract.methods.royaltyInfo(_tokenId, _nftPrice.toString()).call()
            }
    
            console.log("receiver", result[0])
            console.log("receiverroyalty", result[1])
            if (result[0] != contractOwner && result[0] != _nftOwner) {
                setRoyalty(true)
                setRoyaltyAmount(web3.utils.fromWei(result[1]))
                console.log("royalty:", web3.utils.fromWei(result[1]))
            } else {
                setRoyalty(false)
                setRoyaltyAmount(0)
            }
            setTokenId(Number.parseInt(_tokenId))
            setNftContract(_nftContractAddress)
            console.log("tokenId", _tokenId)
            console.log("_image", _image)
            console.log("_tokenUri", _tokenUri)
            console.log("_name", _name)
            console.log("_description", _description)
            console.log("_contractAddress", _nftContractAddress)
        } else {
            alert(
            `Please connect Mumbai Testnet`,
            );
        }
    }

    const displayModalHistory = async (_tokenId, _nftContractAddress) => {
        setShowModalHistory(true)

        let _allTradingRecords = await horaceMarketplace.methods.getAllTradingRecords().call()
        console.log("_allTradingRecords length", _allTradingRecords.length)
    
        let _tradingRecords = []
        for (let i = 0; i < _allTradingRecords.length; i++) {
          let _contractAddress = _allTradingRecords[i].nftContract
          let _nftId = _allTradingRecords[i].tokenId
          let _nftPrice = _allTradingRecords[i].nftPrice
          let _buyer = _allTradingRecords[i].buyer
          let _date = _allTradingRecords[i].dateOfPurchased
          console.log("_nftId", _nftId)
          console.log("_contractAddress", _contractAddress)
          console.log("_nftPrice", _nftPrice)
          console.log("amount",  _allTradingRecords[i].amount)
          console.log("_buyer", _buyer)
          console.log("_date", _date)
          if (parseInt(_tokenId) == _nftId && _nftContractAddress.toLowerCase() == _contractAddress.toLowerCase()) {
            let _tradingRecore = {
              nftContract: _contractAddress,
              tokenId: _nftId,
              price: _nftPrice,
              amount: _allTradingRecords[i].amount,
              buyer: _buyer,
              date: _date,
            }
            _tradingRecords = [..._tradingRecords, _tradingRecore]
          }
        }
        console.log("_tradingRecords length", _tradingRecords.length)
        // let temp = [_tradingRecords.sort((a, b) => b.date - a.date)]
    
        setTradingRecords(_tradingRecords)
    }
        
    return (
        <>
        <h2 class="title">
          <div class="has-text-white">
          NFT Marketplace
          </div>
        </h2>
        <h2 class="subtitle mt-4">
          <div class="has-text-white">
          Buy NFTs here, for selling your NFTs please refer to <b>My NFTs</b> and select your NFT !!            </div>
        </h2>
        { allMarketplaceItems.map((columns, j) => {
            if ((j % 4) == 0) {
                return (
                    <div class="columns" key={j}>
                        { allMarketplaceItems.map((item, i) => {
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
                                                {
                                                    address == item.nftOwner
                                                        ?
                                                        <>
                                                            <a class="card-footer-item" onClick={() => unList(item.nftContract, item.tokenId)}>Unlist</a>
                                                            <a class="card-footer-item"> </a>
                                                        </>
                                                        :
                                                        <>
                                                            <a class="card-footer-item" onClick={() => displayModal(item, item.image, item.tokenUri, item.attributes, item.name, item.description, item.tokenId, item.nftContract, item.nftPrice, item.nftOwner, item.amount)}>BUY</a>
                                                            <a class="card-footer-item" >{item.nftPrice} MATIC</a>
                                                            <a class="card-footer-item" onClick={() => displayModalHistory(item.tokenId, item.nftContract)}>RECORDS</a>
                                                        </>
                                                    }
                                            </footer>                                                            
                                        </div>
                                            <Modal show={showModal} onClose={() => setShowModal(false)}>
                                                <div class="columns">
                                                    <div class="column is-one-third">
                                                        <figure class="image is-4by3">
                                                            <img src={image} alt="Placeholder image" width={1024}/>
                                                        </figure>
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
                                                        <h2>
                                                            <strong>Price:</strong> {nftPrice} MATIC (US$ {parseFloat(ethPrice).toFixed(2)}) &nbsp;&nbsp;&nbsp; <strong>ID:</strong> {tokenId}
                                                            {
                                                                nftType == 721
                                                                    ? <></>
                                                                    : <>&nbsp;&nbsp;&nbsp;<strong>Amount: </strong> {saleAmount}</>
                                                            }
                                                            {
                                                                royalty
                                                                    ? <><br></br><strong>Royalty: </strong> {royaltyAmount} MATIC</>
                                                                    : <></>
                                                            }
                                                        </h2>
                                                        <h2><strong>Seller:</strong> {seller}</h2>
                                                        <h2><strong>Contract:</strong> {nftContract}</h2>
                                                    
                                                    </div>
                                                </div>
                                                <div class="columns">
                                                    <div class="column is-one-fifths ml-4"></div>
                                                    <div class="column">
                                                        <a class="button is-link is-small is-rounded ml-1" href={`${tokenUri}`} target="_blank" rel="noreferrer">Metadata</a> 
                                                    </div> 
                                                        {
                                                            seller == address
                                                                ? 
                                                                    <div class="column ml-1">
                                                                        <button class="button is-primary is-small is-rounded mt-3 mr-6" onClick={() => unList(nftContract, tokenId)}>Unlist</button>
                                                                    </div>
                                                                : 
                                                                    <></>
                                                        }
                                                        {
                                                            seller == address
                                                                ?   <></>
                                                                : 
                                                                    nftType == 721
                                                                        ? 
                                                                            <>
                                                                                <div class="column ml-1">
                                                                                    <button class="button is-primary is-small is-rounded mr-4" onClick={() => buyNFT(seller)}>Confirm</button>
                                                                                </div>
                                                                                <div class="column"></div>                                                                        
                                                                            </>
                                                                        :
                                                                            <>
                                                                                <div class="column  is-one-fifths">
                                                                                    <input class="input is-small is-rounded" type="text" onChange={getBuyAmount} placeholder='Enter amount to buy' />
                                                                                </div>
                                                                                <div class="column ">
                                                                                    <button class="button is-primary is-small is-rounded ml-6" onClick={() => buyNFT(seller)}>Confirm</button>
                                                                                </div>
                                                                            </>
                                                        } 
                                                </div>
                                            </Modal>
                                            <ModalHistory show={showModalHistory} onClose={() => setShowModalHistory(false)}>
            <div class="columns">
                <div class="column">
                    <strong>Trading History on this platform only (the last 5 records)</strong>
                </div>
            </div>
            <div class="columns mb-0">
                <div class="column is-one-fifth">
                    <strong>Price</strong>
                </div>
                <div class="column is-3">
                    <strong>Amount(ERC1155)</strong>
                </div>
                <div class="column">
                    <strong>Buyer</strong>
                </div>
                <div class="column">
                    <strong>Date</strong>
                </div>
            </div>
            { tradingRecords.map((tradingRecord, k) => {
                console.log("tradingRecords length", tradingRecords.length)
                console.log("tradingRecord buyer", tradingRecord.buyer)
                let _buyer = tradingRecord.buyer.slice(0,20) + "....."
                let _date = new Date(tradingRecord.date * 1000)
                _date = _date.toLocaleString()
                return (
                    <div class="columns mb-0"  key={k}>
                        <div class="column is-one-fifth">
                            {web3.utils.fromWei(tradingRecord.price)} MATIC
                        </div>
                        <div class="column">
                            {tradingRecord.amount}
                        </div>
                        <div class="column">
                            {_buyer}
                        </div>
                        <div class="column">
                            {_date}
                        </div>
                    </div>
                )
            })}  
        </ModalHistory>

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
