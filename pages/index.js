import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
// import styles from '../styles/Home.module.css'
import 'bulma/css/bulma.css' // npm install bulma
import Web3 from 'web3' // npm install web3@1.7.4
import HoraceToken from '../blockchain/horacetoken'
import RentablePlatform from '../blockchain/rentableplatform'
import RentableNFT from '../blockchain/rentablenft'
import List from '../components/list'
import MyNFT from '../components/mynft'
import Marketplace from '../components/nftmarketplace'
import StakeNFT from '../components/stakenft'
import Rentable from '../components/rentable'
import DexUpdate from '../components/dexupdate'
import Collateral from '../components/collateralplatform'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Home() {

  const router = useRouter()
  let { page } = router.query

  const [web3, setWeb3] = useState()
  const [address, setAddress] = useState(0)
  const [addr, setAddr] = useState()
  const [horaceToken, setHoraceeToken] = useState()
  const [horaceTokenBalance, setHoraceTokenBalance] = useState(0)
  const [haveRented, setHaveRented] = useState([])
  const [avatar, setAvatar] = useState("")

  useEffect(() => {
    if (address) {
      addressChanged()
    }
  }, [address]) 

  const connectWalletHandler = async () => {
    console.log("connect")
    if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" })
        const web3 = new Web3(window.ethereum)
        setWeb3(web3)
        const accounts = await web3.eth.getAccounts()
        const networkId = await web3.eth.net.getId()

        if (networkId != 80001) {
          alert(
            `Please select Mumbai Testnet`,
          );
        } else {
          setAddress(accounts[0])
          const addr = accounts[0].slice(0, 5) + "..." + accounts[0].slice(38, 42)
          setAddr(addr)
          let _horaceToken = HoraceToken(web3)
          setHoraceeToken(_horaceToken)
          let _horaceTokenBalance = await _horaceToken.methods.balanceOf(accounts[0]).call()
          _horaceTokenBalance = web3.utils.fromWei(_horaceTokenBalance.toString())
          _horaceTokenBalance = parseFloat(_horaceTokenBalance).toFixed(5)
          setHoraceTokenBalance(_horaceTokenBalance)
          console.log("HoraceToken balance", _horaceTokenBalance.toString())
          let _rentablePlatform = RentablePlatform(web3)
          let _rentableNFT = RentableNFT(web3)
          let _haveRented = await _rentablePlatform.methods.checkHaveRented().call({ from: accounts[0] })
          console.log("haveRented", _haveRented)
          setHaveRented(_haveRented)
          if (_haveRented[0]) {
            let _tokenURI = await _rentableNFT.methods.tokenURI(_haveRented[1]).call()
            console.log("tokenURI", _tokenURI)
            console.log("tokenId", _haveRented[1])
            let tokenMetadata = await fetch(_tokenURI).then((response) => response.json())
            console.log("tokenMetadata image", tokenMetadata["image"])
            setAvatar(tokenMetadata["image"])
          }
        }
      } catch (error) {
        console.log(error.message)
      }
    } else {
      alert(
        `Please install Metamask Wallet`,
      );
    }
  }

  const addressChanged = async () => {

    window.ethereum.on('accountsChanged', async () => {
      const web3 = new Web3(window.ethereum)
      setWeb3(web3)
      const accounts = await web3.eth.getAccounts()

      const networkId = await web3.eth.net.getId()

      if (networkId != 80001) {
        alert(
          `Please select Mumbai Testnet`,
        );
      } else {
          setAddress(accounts[0])
          const addr = accounts[0].slice(0, 5) + "..." + accounts[0].slice(38, 42)
          setAddr(addr)
          let _horaceTokenBalance = await horaceToken.methods.balanceOf(accounts[0]).call()
          console.log("balance", _horaceTokenBalance.toString())
          _horaceTokenBalance = web3.utils.fromWei(_horaceTokenBalance)
          _horaceTokenBalance = parseFloat(_horaceTokenBalance).toFixed(5)
          setHoraceTokenBalance(_horaceTokenBalance)
          let _rentablePlatform = RentablePlatform(web3)
          let _rentableNFT = RentableNFT(web3)
          let _haveRented = await _rentablePlatform.methods.checkHaveRented().call({ from: accounts[0] })
          console.log("haveRented", _haveRented)
          setHaveRented(_haveRented)
          if (_haveRented[0]) {
            let _tokenURI = await _rentableNFT.methods.tokenURI(_haveRented[1]).call()
            console.log("tokenURI", _tokenURI)
            console.log("tokenId", _haveRented[1])
            let tokenMetadata = await fetch(_tokenURI).then((response) => response.json())
            console.log("tokenMetadata image", tokenMetadata["image"])
            setAvatar(tokenMetadata["image"])
          }
      }
    })
  }

  return (
  <>
        <div class="container">
          <nav class="navbar is-black" role="navigation" aria-label="main navigation">
            <div id="navbarBasicExample" class="navbar-menu">
              <div class="navbar-start">

                <div class="navbar-item">
                  <h2 class="title has-text-link">
                    <b>NFT Platform</b>
                  </h2>
                </div>

              </div>

              <div class="navbar-end">
                <div class="navbar-item">
                  {address.length > 0
                    ? `HAT Balance: ${horaceTokenBalance}`
                    : "HAT:"
                  }
                </div>
                {
                  haveRented[0]
                    ? 
                      <>
                        <div class="navbar-item">
                          <img src={avatar} alt="Placeholder image" width="30"/>
                        </div>
                      </>
                    : <></>
                }
                <div class="navbar-item">
                  <div class="buttons">
                    <a class="button is-primary" onClick={connectWalletHandler}>
                      <strong>
                      {address.length > 0
                        ? `${addr}`
                        : "Connect Wallet"
                      }
                      </strong>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </nav>
        </div>
         
        <section class="section">
          <div class="container">
            <h2 class="title">
              <div class="has-text-white has-text-centered">
                The Ultimate NFT Platform on Mumbai Testnet with Web3 Technologies
              </div>
            </h2>
            <h2 class="subtitle mt-4">
              <div class="has-text-white has-text-centered">
                Trade, stake and mint your NFTs with royalty. A DEX is provided to swap your tokens.
              </div>
            </h2>
            <div class="columns mt-6">
              <div class="column">
              <Link legacyBehavior href="?page=list"><a>
                <div class="card">
                  <div class="card-content">
                    <p class="title has-text-info">
                        <b>List of Art Images</b>
                    </p>
                    <p class="subtitle">
                      Tons of images to mint.
                    </p>
                  </div>
                </div>
                </a></Link>              
              </div>
              <div class="column">
                <Link legacyBehavior href="?page=mynft"><a>
                  <div class="card">
                    <div class="card-content">
                      <p class="title has-text-info">
                          <b>My NFTs</b>
                      </p>
                      <p class="subtitle">
                          Browse your NFTs.
                      </p>
                    </div>
                  </div> 
                </a></Link>
              </div>
              <div class="column">
                <Link legacyBehavior href="?page=stakednft"><a>
                  <div class="card">
                    <div class="card-content">
                      <p class="title has-text-info">
                          <b>My Staked NFTs</b>
                      </p>
                      <p class="subtitle">
                          Browse your staked NFTs.
                      </p>
                    </div>
                  </div>
                </a></Link>
              </div>
              <div class="column">
                <Link legacyBehavior href="?page=marketplace"><a>
                  <div class="card">
                    <div class="card-content">
                      <p class="title has-text-info">
                          <b>Marketplace</b>
                      </p>
                      <p class="subtitle">
                          Trade your NFTs.
                      </p>
                    </div>
                  </div> 
                </a></Link>
              </div>
            </div>
            <div class="columns mt-6">
              <div class="column">
                <Link legacyBehavior href="?page=rentable"><a>
                  <div class="card">
                    <div class="card-content">
                      <p class="title has-text-info">
                          <b>Avatars</b>
                      </p>
                      <p class="subtitle">
                          Avatars for Rnet.
                      </p>
                    </div>
                  </div>  
                </a></Link>
              </div>
              <div class="column">
                <Link legacyBehavior href="?page=dex"><a>
                  <div class="card">
                    <div class="card-content">
                      <p class="title has-text-info">
                          <b>DEX</b>
                      </p>
                      <p class="subtitle">
                          Swap MATIC and HAT.
                      </p>
                    </div>
                  </div> 
                </a></Link>
              </div>
              <div class="column">
                <Link legacyBehavior href="?page=collateral"><a>
                  <div class="card">
                    <div class="card-content">
                      <p class="title has-text-info">
                          <b>Collateral</b>
                      </p>
                      <p class="subtitle">
                          Stake your NFTs as collateral.
                      </p>
                    </div>
                  </div> 
                </a></Link>
              </div>
              <div class="column is-one-quarter"></div>
            </div>
            <br></br><br></br>
            {
              page=='list' 
                ? <List 
                    address={address}
                  />
                : page=='mynft'
                  ? <MyNFT 
                      address={address}
                    />
                  : page=='marketplace'
                    ? <Marketplace 
                        address={address}
                      />
                    : page=='stakednft'
                      ? <StakeNFT 
                          address={address}
                        />
                      : page=='rentable'
                        ? <Rentable 
                            address={address}
                          />
                        : page=='dex'
                          ? <DexUpdate
                              address={address}
                            />
                          : page=='collateral'
                            ? <Collateral
                                address={address}
                              />
                            : <></>
                      
            }

            <footer class="footer">
              <div class="content has-text-centered">
                <p>
                  <strong>NFT Platform</strong> by Pui Kei Yuen.<br></br> 
                  Contact: horacey2010@gmail.com &nbsp;&nbsp; Tel: 852-61126010
                </p>
                
              </div>
            </footer>        
            
          </div>
        </section>
    </>
  )
}
