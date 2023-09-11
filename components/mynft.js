import { useState, useEffect } from 'react'
import 'bulma/css/bulma.css' // npm install bulma
import Web3 from 'web3' // npm install web3@1.7.4
import HoraceNFT from '../blockchain/horacenft'
import HoraceERC1155NFT from '../blockchain/horaceerc1155nft'
import HoracePlatform from '../blockchain/horaceplatform'
import HoraceToken from '../blockchain/horacetoken'
import HoraceMarketplace from '../blockchain/horacemarketplace'
import HoraceStakeNFT from '../blockchain/horacestakenft'
import HoraceCollateral from '../blockchain/collateralplatform'
import Modal from '../components/Modal'
import ModalLoading from '../components/ModalLoading'
import ModalHistory from '../components/ModalHistory' 

export default function MyNFT({ address }) {

    const [web3, setWeb3] = useState()
    const [horacePlatform, setHoracePlatform] = useState()

    const [yourNftItems, setYourNftItems] = useState([])
    const [yourNft721Items, setYourNft721Items] = useState([])
    const [yourNft1155Items, setYourNft1155Items] = useState([])
    const [image, setImage] = useState()
    const [tokenUri, setTokenUri] = useState()
    const [attributes, setAttributes] = useState([])
    const [name, setName] = useState()
    const [description, setDescription] = useState()
    const [tokenId, setTokenId] = useState()
    const [nftContractAddress, setNftContractAddress] = useState()
    const [price, setPrice] = useState()
    const [nftBalance, setNFTBalance] = useState(0)
    const [job, setJob] = useState()
    const [nftContractAbi, setNftContractAbi] = useState([{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"_fromTokenId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"_toTokenId","type":"uint256"}],"name":"BatchMetadataUpdate","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"_tokenId","type":"uint256"}],"name":"MetadataUpdate","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"string","name":"_tokenURI","type":"string"}],"name":"changeMetadata","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getRoyaltyFee","outputs":[{"internalType":"uint96","name":"","type":"uint96"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"string","name":"uri","type":"string"}],"name":"mint","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"uri","type":"string"},{"internalType":"address","name":"_royaltyReceiver","type":"address"}],"name":"mintWithRoyalty","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"uint256","name":"salePrice","type":"uint256"}],"name":"royaltyInfo","outputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}])
    const [erc1155ContractAbi, setabi] = useState([{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256[]","name":"ids","type":"uint256[]"},{"indexed":false,"internalType":"uint256[]","name":"values","type":"uint256[]"}],"name":"TransferBatch","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"id","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"TransferSingle","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"value","type":"string"},{"indexed":true,"internalType":"uint256","name":"id","type":"uint256"}],"name":"URI","type":"event"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"id","type":"uint256"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address[]","name":"accounts","type":"address[]"},{"internalType":"uint256[]","name":"ids","type":"uint256[]"}],"name":"balanceOfBatch","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getTokenIdCounter","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"address","name":"mintee","type":"address"},{"internalType":"uint256","name":"id","type":"uint256"}],"name":"mint","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_royaltyReceiver","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"id","type":"uint256"}],"name":"mintWithRoyalty","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"uint256","name":"salePrice","type":"uint256"}],"name":"royaltyInfo","outputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256[]","name":"ids","type":"uint256[]"},{"internalType":"uint256[]","name":"amounts","type":"uint256[]"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"safeBatchTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"newuri","type":"string"}],"name":"setURI","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"uri","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"}])
    const [showModal, setShowModal] = useState(false)
    const [showModalHistory, setShowModalHistory] = useState(false)
    const [showModalLoading, setShowModalLoading] = useState(false)
    const [displayNFTs, setDisplatNFTs] = useState("part")
    const [tradingRecords, setTradingRecords] = useState([])
    const [amount, setAmount] = useState(1)
    const [tokenAmount, setTokenAmount] = useState(0)
    const [period, setPeriod] = useState(1)
    const [loan, setLoan] = useState(0)
    const [updateLoan, setUpdateLoan] = useState(0)
    const [contractType, setContractType] = useState("ERC-721")

    
    useEffect(() => {
      if (address) {
        checkNetwork()
      }
    }, [address, displayNFTs])

    const checkNetwork = async () => {
      const web3 = new Web3(window.ethereum)
      setWeb3(web3)
      const networkId = await web3.eth.net.getId()

      if (networkId != 80001) {
        alert(
          `Please connect Mumbai Testnet`,
        );
      } else {
        loadMyNFTData()
      }
    }

    const loadMyNFTData = async () => {
      if (address) {
        const web3 = new Web3(window.ethereum)
        setWeb3(web3)
        let horaceNFT = HoraceNFT(web3)
        let horaceErc1155 = HoraceERC1155NFT(web3)
        let horacePlatform = HoracePlatform(web3)
        setHoracePlatform(horacePlatform)
        try {
          // const baseURL = `https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_API_KEY}/getNFTs`
          const baseURL = `https://polygon-mumbai.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_API_KEY}/getNFTs`
          // const baseURL = `https://opt-goerli.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_API_KEY}/getNFTs`
          let nfts, nfts1155, nfts721
          var requestOptions = {
            method: 'GET'
          }
          if (displayNFTs == "all") {
            const fetchURL = `${baseURL}?owner=${address}`
            nfts = await fetch(fetchURL, requestOptions).then(data => data.json())
          } else {
            const fetchURL = `${baseURL}?owner=${address}&contractAddresses%5B%5D=${horaceNFT.options.address}`
            nfts721 = await fetch(fetchURL, requestOptions).then(data => data.json())
            const fetchURI1155 = `${baseURL}?owner=${address}&contractAddresses%5B%5D=${horaceErc1155.options.address}`
            nfts1155 = await fetch(fetchURI1155, requestOptions).then(data1155 => data1155.json())
            console.log("nfts1155", nfts1155)
          }
          if (nfts) {
            setYourNftItems(nfts.ownedNfts)
          }
          if (nfts721) { setYourNft721Items(nfts721.ownedNfts) }
          if (nfts1155) { setYourNft1155Items(nfts1155.ownedNfts) }
          
        } catch (error) {
          console.log(error)
        }
      } else {
        alert(
          `Please connect Metamask wallet`,
        );
      }
    }


    const displayModal = async (_item, _image, _tokenUri, _attributes, _name, _description, _tokenId, _nftContractAddress, _balance, _job) => {
      setImage(_image)
      let _period = 1
      setPeriod(_period)
      let horaceCollateral = HoraceCollateral(web3)
      let _loan = await horaceCollateral.methods.calculatePriceCollateral(_nftContractAddress, _tokenId, _period).call()
      setLoan(_loan[0])
      setUpdateLoan(_loan[0])
      setTokenUri(_tokenUri)
      if (_attributes) {
        setAttributes(_attributes)
      } else {
        setAttributes([])
      }
      setName(_name)
      setDescription(_description)
      setTokenId(Number.parseInt(_tokenId))
      setNftContractAddress(_nftContractAddress)
      setNFTBalance(_balance)
      console.log("job", _job)

      let contractType = await horacePlatform.methods.checkContractType(_nftContractAddress).call()
      console.log("contract type", contractType)
      if (contractType[0] == true) {
        console.log("ERC721")
        setContractType("ERC-721")
        setAmount(1)
      } 
      if (contractType[1] == true) {
        console.log("ERC1155")
        setContractType("ERC-1155")
        let erc1155Contract = new web3.eth.Contract(erc1155ContractAbi, _nftContractAddress)
        let _amount = await erc1155Contract.methods.balanceOf(address, Number.parseInt(_tokenId)).call()
        console.log("amount", _amount)
        setAmount(_amount)
      }
      setJob(_job)
      setShowModal(true)

      console.log("_loan", _loan)
      console.log("_image", _image)
      console.log("_tokenUri", _tokenUri)
      console.log("_name", _name)
      console.log("_description", _description)
      console.log("_tokenId", _tokenId.substr(_tokenId.length - 4))
      console.log("_contractAddress", _nftContractAddress)
      console.log("NFT balance", _balance)
      console.log("item", _item)
      console.log("job", _job)
    }


    const salePrice = event => {
      console.log("price: ", event.target.value)
      setPrice(event.target.value)
    }

    const getTokenAmount = event => {
      setTokenAmount(event.target.value)
    }

    const getPeriod = async event => {
      event.preventDefault()
      setPeriod(event.target.value)
      let horaceCollateral = HoraceCollateral(web3)
      let _loan = await horaceCollateral.methods.calculatePriceCollateral(nftContractAddress, tokenId, event.target.value).call()
      setLoan(_loan[0])
      setUpdateLoan(_loan[0])
  }
  
    const listToMarketplace = async (_nftContractAddress, _tokenId) => {
      if (price > 0) {
        setShowModal(false)
        setShowModalLoading(true)
        console.log("tokenId", _tokenId)
        console.log("contract", _nftContractAddress)
        console.log("price", price)
        let _price = web3.utils.toWei(price)
        let marketplace = HoraceMarketplace(web3)
        let horaceToken = HoraceToken(web3)
        let contractType = await marketplace.methods.checkContractType(_nftContractAddress).call()
        console.log("contract type", contractType)
        let marketplaceFee = web3.utils.toWei("0.5")
        let _amount = 0
        try {
          let nftContract
          if (contractType[1] == true) {
            console.log("contract address", _nftContractAddress)
            console.log("tokenId", _tokenId)
            console.log("price", _price.toString())
            await horaceToken.methods.approve(marketplace.options.address, marketplaceFee.toString()).send({ from: address })
            nftContract = new web3.eth.Contract(erc1155ContractAbi, _nftContractAddress)
            await nftContract.methods.setApprovalForAll(marketplace.options.address, true).send({ from: address })
            _amount = await nftContract.methods.balanceOf(address, _tokenId).call()
            await marketplace.methods.addToMarketplace(_nftContractAddress, _tokenId, _price.toString(), _amount).send({ from: address })
          } 
          if (contractType[0] == true) {
            console.log("_nftContract", _nftContractAddress)
            console.log("tokenId", _tokenId)
            console.log("price", _price.toString())
            await horaceToken.methods.approve(marketplace.options.address, marketplaceFee.toString()).send({ from: address })
            nftContract = new web3.eth.Contract(nftContractAbi, _nftContractAddress)
            await nftContract.methods.approve(marketplace.options.address, _tokenId).send({ from: address })
            await marketplace.methods.addToMarketplace(_nftContractAddress, _tokenId, _price.toString(), _amount).send({ from: address })
          }
          loadMyNFTData()
          setShowModalLoading(false)
        } catch(error) {
          console.log(error)
          setShowModalLoading(false)
        }
      } else {
        setShowModalLoading(false)
        alert(
            `Please provide price!! `,
        );
      }
  }

  const collateral = async (_nftContractAddress, _tokenId, _tokenAmount) => {
    console.log("tokenId", _tokenId)
    console.log("nfttoken address", _nftContractAddress)
    console.log("NFT balance", nftBalance)
    console.log("tokenAmount", _tokenAmount)
    console.log("amount", amount)
    console.log("period", period)
      let horaceCollateral = HoraceCollateral(web3)
      let horaceToken = HoraceToken(web3)
      let nftContract
      let contractType = await horaceCollateral.methods.checkContractType(_nftContractAddress).call()
      console.log("contract type", contractType)
      try {
        // let rented = await horaceCollateral.methods.checkHaveRented().call({ from: address })
        // console.log("rented", rented)
        if (contractType[1] == true) {
          if (Number(tokenAmount) <= Number(amount) && (Number(tokenAmount) != 0)) {
            setShowModal(false)
            setShowModalLoading(true)
            nftContract = new web3.eth.Contract(erc1155ContractAbi, _nftContractAddress, )
            await nftContract.methods.setApprovalForAll(horaceCollateral.options.address, true).send({ from: address })
            await horaceCollateral.methods.collateralToPlatform(_nftContractAddress, _tokenId, tokenAmount, period).send({ from: address })
            let counter = await horaceCollateral.methods.calculatePriceCollateral(horaceCollateral.options.address, 2).call()
            console.log("counter", counter)
            console.log("tokenAmount", Number(tokenAmount))
            console.log("amount", Number(amount))
          } else {
            alert(
              `Collateral amount must be smaller or equal to ${nftBalance} `,
            );
          }
        } else if (contractType[0] == true) {
          setShowModal(false)
          setShowModalLoading(true)
          console.log("period", period)
          nftContract = new web3.eth.Contract(nftContractAbi, _nftContractAddress)
          console.log("period", period)
          let loan = await horaceCollateral.methods.calculatePriceCollateral(_nftContractAddress, _tokenId, period).call()
          console.log("loan", web3.utils.fromWei(loan[0].toString()))      //1000000000000000000
          console.log("repayment", web3.utils.fromWei(loan[1].toString())) //200000000000000000
          let type = await horaceCollateral.methods.checkContractType(_nftContractAddress).call()
          console.log("erc721", type[0])
          console.log("erc1155", type[1])
          let contractBalance = await horaceToken.methods.balanceOf(horaceCollateral.options.address).call()
          console.log("contract balance", contractBalance.toString())
          console.log("contract address", horaceCollateral.options.address)
          await nftContract.methods.approve(horaceCollateral.options.address, _tokenId).send({ from: address })
          await horaceCollateral.methods.collateralToPlatform(_nftContractAddress, _tokenId, 0, period).send({ from: address })
        }
        loadMyNFTData()
        setShowModalLoading(false)
      } catch (error) {
        setShowModalLoading(false) 
        setShowModal(false)
        console.log("error", error)
      }
  }

  const stakeNFT = async (_nftContractAddress, _tokenId, _tokenAmount) => {
    console.log("tokenId", _tokenId)
    console.log("nfttoken address", _nftContractAddress)
    console.log("NFT balance", nftBalance)
    if (Number(_tokenAmount) <= Number(amount)) {
      setShowModal(false)
      setShowModalLoading(true)
      let stakenft = HoraceStakeNFT(web3)
  
      let nftContract
      let contractType = await horacePlatform.methods.checkContractType(_nftContractAddress).call()
      try {
        if (contractType[1] == true) {
          nftContract = new web3.eth.Contract(erc1155ContractAbi, _nftContractAddress, )
          await nftContract.methods.setApprovalForAll(stakenft.options.address, true).send({ from: address })
          await stakenft.methods.stakeToNFTPlatform(_nftContractAddress, _tokenId, tokenAmount).send({ from: address })
        } else if (contractType[0] == true) {
          nftContract = new web3.eth.Contract(nftContractAbi, _nftContractAddress)
          await nftContract.methods.approve(stakenft.options.address, _tokenId).send({ from: address })
          await stakenft.methods.stakeToNFTPlatform(_nftContractAddress, _tokenId, 0).send({ from: address })
        }
        loadMyNFTData()
        setShowModalLoading(false)
        setShowModal(false)
      } catch (error) {
        setShowModalLoading(false) 
        setShowModal(false)
        console.log("error", error)
      }
    } else {
      alert(
        `Staked amount must be smaller or equal to ${nftBalance} `,
      );
    }
  }

  const displayModalHistory = async (_tokenId, _nftContractAddress) => {
    setShowModalHistory(true)
    // let latest_block = await web3.eth.getBlockNumber()  // 36549179
    //   let historical_block = latest_block - 1000
    //   console.log("latest block", latest_block)
    // console.log("historical block", historical_block)
    // const events = await marketplace.getPastEvents(
    //     'BuyItem',
    //     { fromBlock: historical_block, toBlock: latest_block }
    // )
    // console.log("Events", events)

    let _marketplace = HoraceMarketplace(web3)
    let _allTradingRecords = await _marketplace.methods.getAllTradingRecords().call()
    console.log("_allTradingRecords length", _allTradingRecords.length)

    let _tradingRecords = []
    let recordCounter
    if (_allTradingRecords.length <= 5) { recordCounter = 0 } else { recordCounter = _allTradingRecords.length-5 }
    for (let i = _allTradingRecords.length-1; i >= recordCounter; i--) {
      let _contractAddress = _allTradingRecords[i].nftContract
      let _nftId = _allTradingRecords[i].tokenId
      let _nftPrice = _allTradingRecords[i].nftPrice
      let _amount = _allTradingRecords[i].amount
      let _buyer = _allTradingRecords[i].buyer
      let _date = _allTradingRecords[i].dateOfPurchased
      console.log("_nftId", _nftId)
      console.log("_tokenId", parseInt(_tokenId, 16))
      console.log("_contractAddress", _contractAddress)
      console.log("_nftContractAddress", _nftContractAddress)
      console.log("_nftPrice", _nftPrice)
      console.log("_buyer", _buyer)
      console.log("_date", _date)
      if (_nftId == parseInt(_tokenId, 16) && _nftContractAddress.toLowerCase() == _contractAddress.toLowerCase()) {
        let _tradingRecord = {
          nftContract: _contractAddress,
          tokenId: _nftId,
          price: _nftPrice,
          amount: _amount,
          buyer: _buyer,
          date: _date,
        }
        _tradingRecords = [..._tradingRecords, _tradingRecord]
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
            My NFTs
          </div>
        </h2>
        <h2 class="subtitle mt-4">
          <div class="has-text-white">
            You can stake your NFT to get HAT reward or put it on Marketplace for sale!! - Need HAT to put on Marketplace            </div>
        </h2>
        <h2 class="subtitle mt-4">
          <div class="has-text-white">
            {
              displayNFTs == "part"
                ? <><input class="radio is-small is-rounded" type="radio" name="displayNFTs" value="part" checked onChange={e => setDisplatNFTs(e.target.value)}/> Show NFTs you minted on this platform</>
                : <><input class="radio is-small is-rounded" type="radio" name="displayNFTs" value="part" onChange={e => setDisplatNFTs(e.target.value)}/> Show NFTs you minted on this platform</>
            } &nbsp;&nbsp;
            {
              displayNFTs == "all"
                ? <><input class="radio is-small is-rounded" type="radio" name="displayNFTs" value="all" checked onChange={e => setDisplatNFTs(e.target.value)}/> Show all your NFTs</>
                : <><input class="radio is-small is-rounded" type="radio" name="displayNFTs" value="all" onChange={e => setDisplatNFTs(e.target.value)}/> Show all your NFTs</>
            }
          </div>
        </h2>
        {
          displayNFTs == "part"
            ? <>
                {
                  yourNft721Items.length > 0
                    ? <>
                        <h2 class="subtitle mt-2">
                          <div class="has-text-link">
                            <b>ERC-721</b>              
                          </div>
                        </h2>
                      </>
                    : <></>
                }
                { yourNft721Items.map((columns, j) => {
                  if ((j % 4) == 0) {
                    return (
                      <div class="columns" key={j}>
                      { yourNft721Items.map((item, i) => {
                        if (i >= j && i < j + 4) {
                          return (
                            <div class="column is-one-quarter" key={i}>
                              <div class="card">
                                  <div class="card-image">
                                      <figure class="image is-4by3">
                                          <img src={item.media[0].gateway} alt="Placeholder image" width={480}/>
                                      </figure>
                                  </div>
                                  <footer class="card-footer">
                                    <a  class="card-footer-item" onClick={() => displayModal(item, item.media[0].gateway, item.tokenUri.gateway, item.metadata.attributes, item.metadata.name, item.metadata.description, item.id.tokenId, item.contract.address, item.balance, "marketplace")}>Trade</a>
                                    <a  class="card-footer-item" onClick={() => displayModal(item, item.media[0].gateway, item.tokenUri.gateway, item.metadata.attributes, item.metadata.name, item.metadata.description, item.id.tokenId, item.contract.address, item.balance, "stakenft")}>Stake</a>
                                    <a  class="card-footer-item" onClick={() => displayModal(item, item.media[0].gateway, item.tokenUri.gateway, item.metadata.attributes, item.metadata.name, item.metadata.description, item.id.tokenId, item.contract.address, item.balance, "collateral")}>Collateral</a>
                                    <a  class="card-footer-item" onClick={() => displayModalHistory(item.id.tokenId, item.contract.address)}>Records</a>
                                  </footer>                                                            
                              </div>
                            </div>
                          )
                        }
                      })}
                      </div>
                    )
                  }
                })}
                {
                  yourNft1155Items.length > 0
                    ? <>
                        <br></br>
                        <h2 class="subtitle mt-2">
                          <div class="has-text-link">
                            <b>ERC-1155</b>              
                          </div>
                        </h2>
                      </>
                    : <></>
                }
                { yourNft1155Items.map((columns, j) => {
                  if ((j % 4) == 0) {
                    return (
                      <div class="columns" key={j}>
                        { yourNft1155Items.map((item, i) => {
                          if (i >= j && i < j + 4) {
                            return (
                              <div class="column is-one-quarter" key={i}>
                                <div class="card">
                                  <div class="card-image">
                                      <figure class="image is-4by3">
                                          <img src={item.media[0].gateway} alt="Placeholder image" width={480}/>
                                      </figure>
                                  </div>
                                  <footer class="card-footer">
                                    <a  class="card-footer-item" onClick={() => displayModal(item, item.media[0].gateway, item.tokenUri.gateway, item.metadata.attributes, item.metadata.name, item.metadata.description, item.id.tokenId, item.contract.address, item.balance, "marketplace")}>Trade</a>
                                    <a  class="card-footer-item" onClick={() => displayModal(item, item.media[0].gateway, item.tokenUri.gateway, item.metadata.attributes, item.metadata.name, item.metadata.description, item.id.tokenId, item.contract.address, item.balance, "stakenft")}>Stake</a>
                                    <a  class="card-footer-item" onClick={() => displayModal(item, item.media[0].gateway, item.tokenUri.gateway, item.metadata.attributes, item.metadata.name, item.metadata.description, item.id.tokenId, item.contract.address, item.balance, "collateral")}>Collateral</a>
                                    <a  class="card-footer-item" onClick={() => displayModalHistory(item.id.tokenId, item.contract.address)}>Records</a>
                                  </footer>                                                            
                                </div>
                              </div>
                            )
                          }
                        })}
                      </div>
                    )
                  }
                })}
              </>
            : <></>
        }
        {
          displayNFTs == "all"
            ? <>
                <h2 class="subtitle mt-2">
                  <div class="has-text-link">
                    <b>All NFTs on Mumbai Testnet</b>              
                  </div>
                </h2>
                { yourNftItems.map((columns, j) => {
                  if ((j % 4) == 0) {
                    return (
                      <div class="columns" key={j}>
                      { yourNftItems.map((item, i) => {
                        if (i >= j && i < j + 4) {
                          return (
                            <div class="column is-one-quarter" key={i}>
                              <div class="card">
                                <div class="card-image">
                                    <figure class="image is-4by3">
                                        <img src={item.media[0].gateway} alt="Placeholder image" width={480}/>
                                    </figure>
                                </div>
                                <footer class="card-footer">
                                  <a  class="card-footer-item" onClick={() => displayModal(item, item.media[0].gateway, item.tokenUri.gateway, item.metadata.attributes, item.metadata.name, item.metadata.description, item.id.tokenId, item.contract.address, item.balance, "marketplace")}>Trade</a>
                                  <a  class="card-footer-item" onClick={() => displayModal(item, item.media[0].gateway, item.tokenUri.gateway, item.metadata.attributes, item.metadata.name, item.metadata.description, item.id.tokenId, item.contract.address, item.balance, "stakenft")}>Stake</a>
                                  <a  class="card-footer-item" onClick={() => displayModal(item, item.media[0].gateway, item.tokenUri.gateway, item.metadata.attributes, item.metadata.name, item.metadata.description, item.id.tokenId, item.contract.address, item.balance, "collateral")}>Collateral</a>
                                  <a  class="card-footer-item" onClick={() => displayModalHistory(item.id.tokenId, item.contract.address)}>Records</a>
                                </footer>                                                            
                              </div>
                            </div>
                          )
                        }
                      })}
                      </div>
                    )
                  }
                })}
              </>
            : <></>
        }
        <br></br><br></br>
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
              <strong>Token ID: </strong>{tokenId}
              {
                contractType == "ERC-1155"
                  ? <>&nbsp;&nbsp;&nbsp;<strong>Amount: </strong>{amount}</>
                  :<></>
              }
              <br></br>
              <strong>Contract Address: </strong>{nftContractAddress}<br></br>
              {
                job == "collateral"
                  ?
                    <>
                      <strong>Period:</strong> &nbsp;
                      <div class="select is-small" id="rentPeriod" onChange={getPeriod}>
                          <select>
                              <option value="1" selected>30 days</option>
                              <option value="2">60 days</option>
                              <option value="3">90 days</option>
                          </select>
                      </div>&nbsp;&nbsp;
                      <strong>Loan: </strong>{web3.utils.fromWei(updateLoan.toString())} HAT
                    </>
                  : <></>
              }

            </div>

          </div>
          <div class="columns">
            <div class="column is-two-fifth"></div>
            <div class="column is-one-fifth">
              <a class="button is-link is-small is-rounded mr-4 ml-6" href={`${tokenUri}`} target="_blank" rel="noreferrer">Metadata</a>                                      
            </div>
            {
              job == "marketplace"
                ?
                  <>
                    <div class="column is-one-fifth">
                      <label class="label ml-6">Sale Price: </label>
                    </div>
                    <div class="column is-one-fifths mr-3">
                      <input class="input is-small is-rounded mr-2" type="text" onChange={salePrice} placeholder='Enter sale price, must be > 0 MATIC' />
                    </div>
                    <div calss="column is-one-fifth">
                      <button class="button is-primary is-small is-rounded mr-4 mt-3" onClick={() => listToMarketplace(nftContractAddress, tokenId)}>Confirm</button>
                    </div>
                  </>
                :<></>
            } 
            {
              job == "stakenft"
                ?
                  <>
                    {
                      contractType == "ERC-1155"
                        ?
                          <>
                            <div class="column is-one-fifth">
                              <label class="label ml-6">Amount: </label>
                            </div>
                            <div class="column is-one-fifths mr-3">
                              <input class="input is-small is-rounded mr-2" type="text" onChange={getTokenAmount} placeholder='Enter amount to stake' />
                            </div>
                          </>
                        : <></>
                    }
                    <div calss="column is-one-fifth">
                      <button class="button is-primary is-small is-rounded mr-4 mt-3" onClick={() => stakeNFT(nftContractAddress, tokenId, tokenAmount)}>Confirm</button>
                    </div>
                  </>
                : <></>
            } 
            {
              job == "collateral"
                ?
                  <>
                    {
                      contractType == "ERC-1155"
                        ?
                          <>
                            <div class="column is-one-fifth">
                              <label class="label ml-6">Amount: </label>
                            </div>
                            <div class="column is-one-fifths mr-3">
                              <input class="input is-small is-rounded mr-2" type="text" onChange={getTokenAmount} placeholder='Enter amount to stake' />
                            </div>
                          </>
                        : <></>
                    }
                    <div calss="column is-one-fifth">
                      <button class="button is-primary is-small is-rounded mr-4 mt-3" onClick={() => collateral(nftContractAddress, tokenId, tokenAmount)}>Confirm</button>
                    </div>
                  </>
                : <></>
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
                <div class="column">
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
    </>    
  )
}
