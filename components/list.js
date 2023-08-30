import { useState, useEffect } from 'react'
import 'bulma/css/bulma.css' // npm install bulma
import styles from '../styles/Home.module.css'
import Web3 from 'web3' // npm install web3@1.7.4
import HoracePlatform from '../blockchain/horaceplatform'
import HoraceERC1155NFT from '../blockchain/horaceerc1155nft'
import HoraceNFT from '../blockchain/horacenft'
import Modal from '../components/Modal'
import ModalLoading from '../components/ModalLoading'

import { NFTStorage, File, Blob } from 'nft.storage'

const NFT_STORAGE_TOKEN = process.env.NEXT_PUBLIC_NFT_STORAGE
const nftstorageclient = new NFTStorage({ token: NFT_STORAGE_TOKEN })

    
export default function List({ address }) {

    const [web3, setWeb3] = useState()
    const [horacePlatform, setHoracePlatform] = useState() 

    const [mintReward, setMintReward] = useState()
    const [allListedItemsERC721, setAllListedItemsERC721] = useState([])
    const [allListedItemsERC1155, setAllListedItemsERC1155] = useState([])
    const [image, setImage] = useState()
    const [price, setPrice] = useState()
    const [attributes, setAttributes] = useState([])
    const [name, setName] = useState()
    const [description, setDesription] = useState()
    const [itemId, setItemId] = useState()
    const [tokenUri, setTokenUri] = useState()
    const [isRoyalty, setIsRoyalty] = useState(false)
    const [nftType, setNftType] = useState(721)
    const [showModal, setShowModal] = useState(false) 
    const [showModalLoading, setShowModalLoading] = useState(false)
    const [isRented, setIsRented] = useState(false)
    const [mediaFile, setMediaFile] = useState("")
    const [nftStorageType, setNftStorageType] = useState('')
    const [nftStorageImageType, setNftStorageImageType] = useState('')
    const [imagePreviewSrc, setImagePreviewSrc] = useState()
    const [ownName, setOwnName] = useState()
    const [ownDescription, setOwnDescription] = useState()
    const [mintFee, setMintFee] = useState()
    const [amount, setAmount] = useState(0)
    const [erc1155TokenIdCounter, setERC1155TokenIdCounter] = useState() // for changing the uploaded file name in ERC1155

    useEffect(() => {
        // if (address) {
            loadListPlatformData()
        // }
    }, [address])

    console.log("address", address)
        
    const loadListPlatformData = async () => {
        const web3 = new Web3(window.ethereum)
        setWeb3(web3)
        const networkId = await web3.eth.net.getId()
        if (networkId != 80001) {
            alert(
            `Please connect Mumbai Testnet`,
            );
        } else {
            let _horacePlatform = HoracePlatform(web3)
            setHoracePlatform(_horacePlatform)
            let allItemsERC721 = await _horacePlatform.methods.getAllListingItemERC721().call()
            console.log("items length", allItemsERC721.length)
            let allItemsERC1155 = await _horacePlatform.methods.getAllListingItemERC1155().call()
            console.log("items length", allItemsERC1155.length)
            let _mintReward = await _horacePlatform.methods.getMintNFTRewards().call()
            _mintReward = web3.utils.fromWei(_mintReward)
            setMintReward(_mintReward)
            console.log("mint reward", _mintReward)
            let _mintFee = await _horacePlatform.methods.getMintNFTFee().call()
            setMintFee(_mintFee)
            console.log("_mintFee", _mintFee)

            if (address) {
                let _checkRent = await _horacePlatform.methods.checkHaveRented().call()
                if (_checkRent) {
                    setIsRented("Yes")
                } else {
                    setIsRented("No")
                }
                console.log("_checkRent", _checkRent)
            }

            let _allListedItemsERC721 = []
            for (let i=0; i<allItemsERC721.length; i++) {
                if (allItemsERC721[i].tokenUri != "") {
                    console.log("mintPrice", allItemsERC721[i].mintPrice)
                    console.log("tokenUri", allItemsERC721[i].tokenUri)
                    console.log("is Minted", allItemsERC721[i].isMinted)
                    console.log("image type", allItemsERC721[i].imageType)
                    let tokenMetadata = await fetch(allItemsERC721[i].tokenUri).then((response) => response.json())
                    console.log("image", tokenMetadata["image"])
                    console.log("attributes length", tokenMetadata["attributes"].length)
                    
                    const item = {
                        image: tokenMetadata["image"],
                        name: tokenMetadata["name"],
                        description: tokenMetadata["description"],
                        attributes: tokenMetadata["attributes"], 
                        nftPrice: allItemsERC721[i].mintPrice,
                        tokenUri: allItemsERC721[i].tokenUri,
                        isMinted: allItemsERC721[i].isMinted,
                        imageType: allItemsERC721[i].imageType,
                        itemId: i+1,
                    }
                    _allListedItemsERC721 = [..._allListedItemsERC721, item]
                }
            }
            setAllListedItemsERC721(_allListedItemsERC721)

            let _allListedItemsERC1155 = []
            for (let i=0; i<allItemsERC1155.length; i++) {
                if (allItemsERC1155[i].tokenUri != "") {
                    console.log("nftPrice", allItemsERC1155[i].mintPrice)
                    console.log("tokenUri", allItemsERC1155[i].tokenUri)
                    console.log("is Minted", allItemsERC1155[i].isMinted)
                    console.log("id", allItemsERC1155[i].id)
                    console.log("image type", allItemsERC1155[i].imageType)
                    //
                    const request = new Request(allItemsERC1155[i].tokenUri)
                    const response = await fetch(request)
                    let tokenMetadata = await response.json()
                    console.log("tokenMetadata", tokenMetadata)
                    console.log("image", tokenMetadata["image"])
                    console.log("attributes length", tokenMetadata["attributes"].length)
                    const item = {
                        image: tokenMetadata["image"],
                        name: tokenMetadata["name"],
                        description: tokenMetadata["description"],
                        attributes: tokenMetadata["attributes"], 
                        nftPrice: allItemsERC1155[i].mintPrice,
                        tokenUri: allItemsERC1155[i].tokenUri,
                        isMinted: allItemsERC1155[i].isMinted,
                        imageType: allItemsERC1155[i].imageType,
                        itemId: i+1,
                    }
                    _allListedItemsERC1155 = [..._allListedItemsERC1155, item]
                }
            }
            setAllListedItemsERC1155(_allListedItemsERC1155)

            // let horaceNFT = HoraceNFT(web3)
            // let horaceerc1155NFT = HoraceERC1155NFT(web3)
            // let nftsERC721, nftsERC1155
            // const withMetadata = 'false';
            // // const baseURL = `https://eth-sepolia.g.alchemy.com/nft/v2/${process.env.NEXT_PUBLIC_API_KEY}/getNFTsForContract`
            // const baseURL = `https://polygon-mumbai.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_API_KEY}/getNFTsForContract`
            // // const baseURL = `https://opt-goerli.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_API_KEY}/getNFTsForContract`
            // const urlERC721 = `${baseURL}?contractAddress=${horaceNFT.options.address}&withMetadata=${withMetadata}`;
            // const urlERC1155 = `${baseURL}?contractAddress=${horaceerc1155NFT.options.address}&withMetadata=${withMetadata}`;
            // var requestOptions = {
            //     method: 'get',
            //     redirect: 'follow'
            // };

            // nftsERC721 = await fetch(urlERC721, requestOptions).then(data => data.json())
            // console.log(nftsERC721.nfts.length)

            // nftsERC1155 = await fetch(urlERC1155, requestOptions).then(data => data.json())
            // console.log(nftsERC1155.nfts.length)

            setNftType(721)
            setAmount(1)
            setOwnName("")
            setOwnDescription("")
        }
    }  

    const displayModal = async (_price, _image, _tokenUri, _attributes, _name, _description, _itemId, _imageType, _royalty, _nftType) => {
        if (address) {
            setShowModal(true)
            setImage(_image)
            _price = web3.utils.fromWei(_price)
            setPrice(_price)
            setTokenUri(_tokenUri)
            setAttributes(_attributes)
            setName(_name)
            setDesription(_description)
            setItemId(_itemId)
            setIsRoyalty(_royalty)
            setNftType(_nftType)
            console.log("image type", _imageType)
        } else {
            alert(
            `Please connect Mumbai Testnet`,
            );
        }
    }


    const mintNFT = async (_price, _itemId, _nftType, _isRoyalty) => {
        console.log("nft type", _nftType)
        console.log("amount", amount)
        console.log("itemId", _itemId)
        if (_nftType == 1155) {
            _price = amount * _price
        }
        console.log("_price", _price)
        console.log("itemId", _itemId)
        _price = web3.utils.toWei(_price.toString())
        console.log("_price", _price)
        console.log("isRoyalty", isRoyalty)
        if (address != null) {
            setShowModal(false)
            setShowModalLoading(true)
            try {
                let newTokenId = await horacePlatform.methods.mintNFT(_itemId, _nftType, amount, isRoyalty).send({ from: address, value: _price.toString() })
                loadListPlatformData()
                console.log("nft type", _nftType)
                console.log("amount", amount)
                console.log("price", price.toString())
                setShowModalLoading(false)
            } catch (error) {
                console.log(error)
                loadListPlatformData()
                setShowModalLoading(false)
            }
        } else {
            setShowModal(false)
            connectWalletHandler()
        }

    }


    const captureFile = event => {
        event.preventDefault()
        const file = event.target.files[0]
        console.log("file name", file.name)
        let extension

        if (file.name.slice(-3) === 'jpg') {
            extension = '.jpg'
            setNftStorageType('nft.jpg')
            setNftStorageImageType('image/jpg')
        } else if (file.name.slice(-4) === 'jpeg') {
            extension = '.jpeg'
            setNftStorageType('nft.jpeg')
            setNftStorageImageType('image/jpeg')
        } else if (file.name.slice(-3) === 'png') {
            extension = 'png'
            setNftStorageType('nft.png')
            setNftStorageImageType('image/png')
        } else if (file.name.slice(-3) === 'bmp') {
            extension = '..bmp'
            setNftStorageType('nft.bmp')
            setNftStorageImageType('image/bmp')
        }

        // for mint ERC1155 only, to change the file name
        Object.defineProperty(file, 'name', {
            writable: true,
            value: String(erc1155TokenIdCounter) + extension
        })

        console.log("current erc1155 toke Id", erc1155TokenIdCounter)
        if (file.name.slice(-3) === 'jpg' || file.name.slice(-4) === 'jpeg' || file.name.slice(-3) === 'png' || file.name.slice(-3) === 'bmp') {
            setMediaFile(file)
            let fileReader = new FileReader()
            fileReader.readAsDataURL(file)
            fileReader.addEventListener('load', (event) => {
                setImagePreviewSrc(event.target.result)
            })
        } else {
            alert(`Only support jpg, jpeg, png and bmp`,);
        }
    }

    const getAmount = event => {
        event.preventDefault()
        setAmount(event.target.value)
        console.log("amount", event.target.value)
    }

    const getName = event => {
        event.preventDefault()
        console.log("name: ", event.target.value)
        setOwnName(event.target.value)
    }

    const getDescription = event => {
        event.preventDefault()
        console.log("description: ", event.target.value)
        setOwnDescription(event.target.value)
    }

  
    const uploadNFTContentHandler = async (_isRoyalty) => {
        if (address) {
            if (ownName != null && ownDescription != null && mediaFile != "" ) {
                try {
                    setShowModalLoading(true)
                    const imageFile = new File([ mediaFile ], nftStorageType, { type: nftStorageImageType })
    
                    const metadata = await nftstorageclient.store({
                        name: ownName,
                        description: ownDescription,
                        image: imageFile
                    })
    
                    console.log('metadata ', metadata.url)
                    
                    await horacePlatform.methods.mintOwnNFT(metadata.url, _isRoyalty).send({ from: address, value: mintFee.toString() })
                    loadListPlatformData()
                    setShowModalLoading(false)
                } catch (error) {
                    console.log(error) 
                    loadListPlatformData()
                    setShowModalLoading(false)         
                }
            } else {
                setShowModalLoading(false)
                alert(`Please provide Name, Description and Media File !!`,); 
            }
        } else {
            alert(
            `Please connect Mumbai Testnet`,
            );
        }
    }


    return (
        <>
            <h2 class="title">
              <div class="has-text-white">
                List of Art Images
              </div>
            </h2>
            <h2 class="subtitle mt-4">
              <div class="has-text-white">
                It is that easy to create NFT. Mint it as an NFT on the Mumbai blockchain and turn it into a collectible asset. You get <b>{mintReward} HAT</b> reward for each NFT you minted.
                If you rent NFT in our Rentable NFTs, you get double HAT reward !!
              </div>
            </h2>
            <h2 class="subtitle mt-2">
              <div class="has-text-link">
                <b>ERC721</b>              
              </div>
            </h2>
            { allListedItemsERC721.map((columns, j) => {
                if ((j % 4) == 0) {
                    return (
                        <div class="columns" key={j}>
                            { allListedItemsERC721.map((item, i) => {
                                if (i >= j && i < j + 4) {
                                    return (
                                        <div class="column is-one-quarter" key={i}>
                                            {
                                                item.isMinted
                                                    ? 
                                                        <div class="card">
                                                            <div class="card-image">
                                                                <figure class="image is-4by3">
                                                                    <img src={item.image} alt="Placeholder image" width={1024} className={styles.blur}/>
                                                                </figure>
                                                            </div>
                                                        </div>
                                                    :
                                                        <div class="card">
                                                            <div class="card-image">
                                                                <figure class="image is-4by3">
                                                                    <img src={item.image} alt="Placeholder image" width={1024}/>
                                                                </figure>
                                                            </div>
                                                            <footer class="card-footer">
                                                                <a  class="card-footer-item" onClick={() => displayModal(item.nftPrice, item.image, item.tokenUri, item.attributes, item.name, item.description, item.itemId, item.imageType, false, 721)}>Mint</a>
                                                                <a  class="card-footer-item" onClick={() => displayModal(item.nftPrice, item.image, item.tokenUri, item.attributes, item.name, item.description, item.itemId, item.imageType, true, 721)}>Mint with Royalty</a>
                                                            </footer>                                                            
                                                        </div>
                                            }
                                        </div>
                                    )
                                }
                            })}
                        </div>
                    )
                }
            })}
                                            <Modal show={showModal} onClose={() => setShowModal(false)}>
                                                <div class="columns">
                                                    <div class="column is-one-third">
                                                        <img src={image} alt="Placeholder image" width={250}/>
                                                    </div>
                                                    <div class="column">
                                                        <h2><strong>Name:</strong> {name}</h2>
                                                        <h2><strong>Description:</strong> {description}</h2>
                                                        <h2><strong>Price:</strong> {price} MATIC</h2>
                                                        <h2><strong>Double Reward:</strong> {isRented}</h2>
                                                        {
                                                            nftType == 1155
                                                                ?   <>
                                                                        <h2><strong>Amount:</strong> &nbsp;
                                                                            <div class="select is-small" id="nftamount" onChange={getAmount}>
                                                                                <select>
                                                                                    <option value="1">1</option>
                                                                                    <option value="2">2</option>
                                                                                    <option value="3">3</option>
                                                                                    <option value="4">4</option>
                                                                                    <option value="5">5</option>
                                                                                    <option value="6">6</option>
                                                                                    <option value="7">7</option>
                                                                                    <option value="8">8</option>
                                                                                    <option value="9">9</option>
                                                                                    <option value="10">10</option>
                                                                                </select>
                                                                            </div>                                
                                                                        </h2>
                                                                    </>
                                                                :   <></>
                                                        }
                                                        {
                                                            isRoyalty
                                                                ? <h2><strong>Mint with Royalty:</strong> Yes</h2>
                                                                : <h2><strong>Mint with Royalty:</strong> No</h2>
                                                        }
                                                        {
                                                            attributes.map((attribute, k) => {
                                                            return (
                                                                <h2 key={k}><strong>{attribute.trait_type}:</strong> {attribute.value}</h2>
                                                            )
                                                            })
                                                        }
                                                        <br></br>
                                                        <div class="columns">
                                                            <div class="column is-three-fifths"></div>
                                                            <div class="column">
                                                                <button class="button is-primary is-small is-rounded" onClick={() => mintNFT(price, itemId, nftType, isRoyalty)}>Confirm</button> &nbsp; &nbsp;
                                                            </div>
                                                            <div class="column">
                                                                <a class="button is-link is-small is-rounded" href={`${tokenUri}`} target="_blank" rel="noreferrer">Metadata</a>
                                                            </div>
                                                        </div> 
                                                        &nbsp; &nbsp; 
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
            
            <h2 class="subtitle mt-2">
              <div class="has-text-link">
                <b>ERC1155</b>              
              </div>
            </h2>
            { allListedItemsERC1155.map((columns, j) => {
                if ((j % 4) == 0) {
                    return (
                        <div class="columns" key={j}>
                            { allListedItemsERC1155.map((item, i) => {
                                if (i >= j && i < j + 4) {
                                    return (
                                        <div class="column is-one-quarter" key={i}>
                                            {
                                               item.isMinted
                                                ? 
                                                    <div class="card">
                                                        <div class="card-image">
                                                            <figure class="image is-4by3">
                                                                <img src={item.image} alt="Placeholder image" width={1024} className={styles.blur}/>
                                                            </figure>
                                                        </div>
                                                    </div>
                                                :
                                                    <div class="card">
                                                        <div class="card-image">
                                                            <figure class="image is-4by3">
                                                                <img src={item.image} alt="Placeholder image" width={1024}/>
                                                            </figure>
                                                        </div>
                                                        <footer class="card-footer">
                                                            <a  class="card-footer-item" onClick={() => displayModal(item.nftPrice, item.image, item.tokenUri, item.attributes, item.name, item.description, item.itemId, item.imageType, false, 1155)}>Mint</a>
                                                            <a  class="card-footer-item" onClick={() => displayModal(item.nftPrice, item.image, item.tokenUri, item.attributes, item.name, item.description, item.itemId, item.imageType, true, 1155)}>Mint with Royalty</a>
                                                        </footer>                                                            
                                                    </div>
                                    
                                            }
                                        </div>
                                    )
                                }
                            })}
                        </div>
                    )
                }
            })}
            <h2 class="subtitle mt-2">
              <div class="has-text-link">
                <b>Mint Your Own NFT</b>              
              </div>
            </h2>
            <h2 class="subtitle">
              <div class="has-text-white is-size-6">
                <b>It cost 0.2 Matic to mint a NFT and get HAT reward!!</b>              
              </div>
            </h2>
            <div class="columns">
                <div class="column" is-two-fifths>
                    <div class="box">
                        <article class="media">
                            <div class="media-left">
                                {
                                    imagePreviewSrc
                                        ?
                                            <figure class="image is-128x128">
                                                <img src={imagePreviewSrc} alt="..." width={512}/>
                                            </figure>
                                        :   
                                            <figure class="image is-256x256">
                                                <img src="../128x128.png" alt="..." width={512}/>
                                            </figure>
                                }
                            </div>
                            <div class="media-content">
                                <div class="content">
                                    <p>
                                        <input type='file' className="" name='choose-file' id='choose-file' accept='.JPG, .jpg, .jpeg, .png, .bmp, .gif' onChange={captureFile} /><br></br><br></br>
                                        <div class="field">
                                            <label class="label">Name</label>
                                            <div class="control">
                                                <input class="input is-small" type="name" placeholder="Name..." onChange={getName} />
                                            </div>
                                        </div> 
                                        <div class="field">
                                            <label class="label">Description</label>
                                            <div class="control">
                                                <input class="input is-small" type="name" placeholder="Description..." onChange={getDescription} />
                                            </div>
                                        </div>
                                        <br></br>
                                        <div class="field">
                                            <div class="control">
                                                <>
                                                    <button class="button is-link is-rounded is-small mr-5" onClick={() => uploadNFTContentHandler(false)}> Mint NFT </button>
                                                    <button class="button is-link is-rounded is-small" onClick={() => uploadNFTContentHandler(true)}>Mint with Royalty</button>
                                                </>    
                                            </div>
                                        </div> 
                                    </p>
                                </div>
                            </div>
                        </article>
                    </div>
                </div>
                <div class="column"></div>
            </div>
            <br></br><br></br>
        </>
    )
}
