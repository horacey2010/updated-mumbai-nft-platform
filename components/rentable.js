import { useState, useEffect } from 'react'
import 'bulma/css/bulma.css' // npm install bulma
import styles from '../styles/Home.module.css'
import Web3 from 'web3' // npm install web3@1.7.4
import Rentable from '../blockchain/rentableplatform'
import RentableNFT from '../blockchain/rentablenft'
import Modal from '../components/Modal'
import ModalLoading from '../components/ModalLoading'


export default function RentablePlatformNFT({ address }) {

    const [web3, setWeb3] = useState()
    const [addr, setAddr] = useState()
    const [showModal, setShowModal] = useState(false)
    const [showModalLoading, setShowModalLoading] = useState(false)
    const [rentable, setRentable] = useState()
    const [rentableNFT, setRentableNFT] = useState()
    const [rentableImage, setRentableImage] = useState()
    const [rentableName, setRetableName] = useState()
    const [rentableDescription, setRentableDescription] = useState()
    const [pricePerHour, setPricePerHour] = useState("0")
    const [pricePerDay, setPricePerDay] = useState(0)
    const [endDateHumanFormat, setEndDateHumanFormat] = useState()
    const [endDateUNIX, setEndDateUNIX] = useState()
    const [startDateUNIX, setStartDateUNIX] = useState()
    const [rentableTokenId, setRentableTokenId] = useState()
    const [rentableItems, setRentableItems] = useState([])
    const [rentPeriod, setRentPeriod] = useState(30)
    const [haveRented, setHaveRented] = useState(false)
    const [numOfDays, setNumOfDays] = useState(0)
    const [nftExpires, setNFTExpires] = useState()
    const [nftUser, setNFTUser] = useState()
    const [expiresHumanFormat, setExpiresHumanFormat] = useState()
    const [availableToRent, setAvailableToRent] = useState()

    useEffect(() => {
            loadRentableData()
    }, [address])

    const loadRentableData = async () => {
        const web3 = new Web3(window.ethereum)
        setWeb3(web3)
        const networkId = await web3.eth.net.getId()
        if (networkId != 80001) {
            alert(
            `Please connect Mumbai Testnet`,
            );
        } else {
            try {
                let _rentable = Rentable(web3)
                setRentable(_rentable)
                let _rentableNFT = RentableNFT(web3)
                setRentableNFT(_rentableNFT)
                let _availableToRent = 0
                let _haveRented = await _rentable.methods.checkHaveRented().call({ from: address })
                let allItems = await _rentable.methods.getAllRentableItems().call()
                let _allRentableItems = []
                console.log("all items", allItems.length)
                console.log("rented", _haveRented[0])
                setHaveRented(_haveRented[0])
        
                let _user, _expires, avail
                for (let i=0; i<allItems.length; i++) {
                    console.log("tokenId", allItems[i].tokenId)
                    console.log("price per hour", allItems[i].pricePerHour)
                    console.log("startDateUNIX", allItems[i].startDateUNIX)
                    console.log("endDateUNIX", allItems[i].endDateUNIX)
                    _user = await _rentableNFT.methods.userOf(allItems[i].tokenId).call()
                    console.log("user", _user)
                    _expires = await _rentableNFT.methods.userExpires(allItems[i].tokenId).call()
                    console.log("expires", _expires)
                    console.log("now",Math.floor(Date.now()/1000))
                    if (!_user == null || _expires > Math.floor(Date.now()/1000)) {
                        avail = "Already Rented"
                    } else {
                        avail = "Available"
                        _availableToRent = _availableToRent + 1
                    }
                    console.log("avail", avail)
                    console.log("availableToRent", _availableToRent)
                    if (allItems[i].pricePerHour > 0) {
                        let rentableTokenUri = await _rentableNFT.methods.tokenURI(allItems[i].tokenId).call()
                        console.log("tokenuri", rentableTokenUri)
                        rentableTokenUri = rentableTokenUri.replace("ipfs://", "https://nftstorage.link/ipfs/")
                        let metadata = await fetch(rentableTokenUri).then((response) => response.json())
                        _expires = await _rentableNFT.methods.userExpires(allItems[i].tokenId).call()
                        _user = await _rentableNFT.methods.userOf(allItems[i].tokenId).call()
                        let _expiresHumanFormat = new Date(_expires * 1000)
                        console.log("_expiresHumanFormat", _expiresHumanFormat)
                        let item = {
                          tokenId: allItems[i].tokenId,
                          pricePerHour: allItems[i].pricePerHour,
                          startDateUNIX: allItems[i].startDateUNIX,
                          endDateUNIX: allItems[i].endDateUNIX,
                          image: metadata["image"],
                          name: metadata["name"],
                          description: metadata["description"],
                          expires: _expires,
                          expiresHumanFormat: _expiresHumanFormat.toLocaleString(),
                          user: _user,
                          available: avail,
                        }
                        console.log("item", item)
                        _allRentableItems = [..._allRentableItems, item]
                    }
                }
                setAvailableToRent(_availableToRent)
                setRentableItems(_allRentableItems)
            } catch (error) {
                console.log(error)
            }
        }
    }

    const rent = async (_tokenId, _pricePerHour, _endDateUNIX) => {
        console.log("tokenId", _tokenId)
            setShowModal(false)
            setShowModalLoading(true)
            const now = Math.ceil(Date.now() / 1000)
            const expires = now + (3600 * 24 * Number(rentPeriod))
            const fee = _pricePerHour * 24 * Number(rentPeriod)
            let numHours = 24 * Number(rentPeriod)

            if (expires <= _endDateUNIX) {
                console.log("expires", expires.toString())
                console.log("numHours", numHours)
                console.log("rentFee", fee)
                console.log("haveRented", haveRented)
                console.log("enddateUNIX", _endDateUNIX)
                console.log("price per day", _pricePerHour)
                let userAddress = await rentableNFT.methods.userOf(_tokenId).call()
                console.log("user", userAddress)
                let userExpires = await rentableNFT.methods.userExpires(_tokenId).call()
                console.log("user expires", userExpires)
                let contractOwner = await rentable.methods.contractOwner().call()
                console.log("contractOwner", contractOwner)
                try {
                    await rentable.methods.rentToPlatform(_tokenId, expires, numHours).send({ from: address, value: fee.toString() })
                    loadRentableData()
                    setShowModalLoading(false)
                } catch (error) {
                    console.log(error)
                    loadRentableData()
                    setShowModalLoading(false)
                }
                
            } else {
                alert(
                    `Rental period exceeds end date of rental`,
                );
                loadRentableData()
                setShowModalLoading(false)
            }
        
    }

    const getRentPeriod = event => {
        event.preventDefault()
        setRentPeriod(event.target.value)
    }


    const displayModal = async (_rentableImage, _name, _tokenId, _description, _pricePerHour, _startDateUNIX, _endDateUNIX, _expires, _user) => {
        if (address) {
            setRentableImage(_rentableImage)
            setRetableName(_name)
            setRentableDescription(_description)
            setRentableTokenId(_tokenId)
            setPricePerHour(_pricePerHour)
            let _pricePerDay = Number(web3.utils.fromWei(_pricePerHour)) * 24
            console.log("_pricePerDay", _pricePerDay)
            setPricePerDay(parseFloat(_pricePerDay).toFixed(5))
            setShowModal(true)
            setNFTExpires(_expires)
            setNFTUser(_user)
            // let _expiresHumanFormat = _expires
            // _expiresHumanFormat = new Date(_expiresHumanFormat * 1000)
            // setExpiresHumanFormat(_expiresHumanFormat.toLocaleString())
            setEndDateUNIX(_endDateUNIX)
            setStartDateUNIX(_startDateUNIX)
            // _endDateUNIX = new Date(_endDateUNIX * 1000)
            setEndDateHumanFormat(_endDateUNIX.toLocaleString())
            console.log("endDateUNIX", _endDateUNIX)
            console.log("startDateUNIX", _startDateUNIX)
            _startDateUNIX = new Date(_startDateUNIX * 1000)
            console.log("start date", _startDateUNIX.toLocaleString())
            console.log("now", Math.ceil(Date.now() / 1000))
            console.log("pricePerHour", _pricePerHour)
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
                Avatars for Rent
                </div>
            </h2>
            <h2 class="subtitle mt-4">
                <div class="has-text-white">
                    Rent avatar and get double rewards!! User can only rent 1 avatar
                </div>
            </h2>
            { rentableItems.map((columns, j) => {
              if ((j % 5) == 0) {
                return (
                    <div class="columns" key={j}>
                        { rentableItems.map((item, i) => {
                            if (i >= j && i < j + 5) {
                                return (
                                    <div class="column is-one-fifth" key={i}>
                                        <div class="card">
                                            <div class="card-image">
                                                <figure class="image">
                                                    <img src={item.image} alt="Placeholder image" width={240}/>
                                                </figure>
                                            </div>
                                            {
                                                item.available == "Available"
                                                    ?
                                                        <footer class="card-footer">
                                                            <a  class="card-footer-item" onClick={() => displayModal(item.image, item.name, item.tokenId, item.description, item.pricePerHour, item.startDateUNIX, item.endDateUNIX, item.expires, item.user)}>Rent</a>
                                                        </footer>                                                            
                                                    :   
                                                        <footer class="card-footer">
                                                            <a  class="card-footer-item" disabled>Expire: {item.expiresHumanFormat}</a>
                                                        </footer>                                                            
                                            }
                                        </div>
                                        <Modal show={showModal} onClose={() => setShowModal(false)}>
                                            <div class="columns">
                                                <div class="column is-one-third">
                                                    <img src={rentableImage} className="img-fluid rounded-start" alt="..." width={200} height={200}/><br></br>
                                                </div>
                                                <div class="column">
                                                    <strong>Name: </strong>{rentableName}<br></br>
                                                    <strong>Description: </strong>{rentableDescription}<br></br>
                                                    <strong>Token ID: </strong>{rentableTokenId}<br></br>
                                                    <strong>Daily Rate: </strong>{pricePerDay} MATIC<br></br>
                                                    <><strong>Rent Period:</strong> &nbsp;
                                                    <div class="select is-small" id="rentPeriod" onChange={getRentPeriod}>
                                                        <select>
                                                            <option value="30">30 days</option>
                                                            <option value="60">60 days</option>
                                                            <option value="90">90 days</option>
                                                        </select>
                                                    </div>                                
                                                    </>
                                                     <br></br>
                                                     {
                                                        haveRented
                                                            ? <></>
                                                            : <button class="button is-primary is-small is-rounded mt-3" onClick={() => rent(rentableTokenId, pricePerHour, endDateUNIX)}>Rent</button>
                                                     }
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
