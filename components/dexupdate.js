import { useState, useEffect } from 'react'
import 'bulma/css/bulma.css' // npm install bulma
import styles from '../styles/Home.module.css'
import Web3 from 'web3' // npm install web3@1.7.4
import DexUpdate from '../blockchain/dexupdate'
import HoraceToken from '../blockchain/horacetoken'
import ModalLoading from '../components/ModalLoading'
import Modal from '../components/Modal'
import ModalWithdrawDeposit from'../components/ModalWithdrawDeposit'

export default function Dexupdate({ address }) {

    const [web3, setWeb3] = useState()
    const [dexUpdate, setDexUpdate] = useState()  
    const [dexUpdateAddress, setDexUpdateAddress] = useState()
    const [horaceToken, setHoraceToken] = useState()
    const [totalLiquidty, setTotalLiquidty] = useState()
    const [horaceTokenLiquidty, setHoraceTokenLiquidty] = useState()
    const [yourLiquidity, setYourLiquidity] = useState(0)
    const [swapType, setSwapType] = useState(1)
    const [swapAmount, setSwapAmount] = useState()
    const [swapOutput, setSwapOutput] = useState()
    const [withdrawAmount, setWithdrawAmount] = useState()
    const [depositAmount, setDepositAmount] = useState()
    const [ethReserve, setETHReserve] = useState()
    const [horaceTokenReserve, setHoraceTokenReserve] = useState()
    const [showModal, setShowModal] = useState(false) 
    const [showModalWithdrawDeposit, setShowModalWithdrawDeposit] = useState(false)
    const [showModalLoading, setShowModalLoading] = useState(false)
    const [liquidityWithdraw, setLiquidityWithdraw] = useState(false)
    const [liquidityDeposit, setLiquidityDeposit] = useState(false)

    useEffect(() => {
            loadDexUpdateData()
    }, [address])

    const loadDexUpdateData = async () => {
        const web3 = new Web3(window.ethereum)
        setWeb3(web3)
        const networkId = await web3.eth.net.getId()
        if (networkId != 80001) {
            alert(
            `Please connect Mumbai Testnet`,
            );
        } else {
            let _dexUpdate = DexUpdate(web3)
            setDexUpdate(_dexUpdate)
            setDexUpdateAddress(_dexUpdate.options.address)
            let _horaceToken = HoraceToken(web3)
            setHoraceToken(_horaceToken)
            console.log("dexUpdate", _dexUpdate)
            let _totalLiquidty = await web3.eth.getBalance(_dexUpdate.options.address)
            _totalLiquidty = web3.utils.fromWei(_totalLiquidty)
            _totalLiquidty = parseFloat(_totalLiquidty).toFixed(7)
            setTotalLiquidty(_totalLiquidty)
            let _horaceTokenLiquidty = await _horaceToken.methods.balanceOf(_dexUpdate.options.address).call()
            _horaceTokenLiquidty = web3.utils.fromWei(_horaceTokenLiquidty)
            _horaceTokenLiquidty = parseFloat(_horaceTokenLiquidty).toFixed(7)
            setHoraceTokenLiquidty(_horaceTokenLiquidty)
            if (address) {
                let _yourLiquidity = await _dexUpdate.methods.getLiquidity(address).call()
                _yourLiquidity = web3.utils.fromWei(_yourLiquidity)
                setYourLiquidity(_yourLiquidity)
            }
            let _ethReserve = await web3.eth.getBalance(_dexUpdate.options.address)
            _ethReserve = web3.utils.fromWei(_ethReserve)
            setETHReserve(_ethReserve)
            let _horaceTokenReserve = await _horaceToken.methods.balanceOf(_dexUpdate.options.address).call()
            _horaceTokenReserve = web3.utils.fromWei(_horaceTokenReserve)
            setHoraceTokenReserve(_horaceTokenReserve)
        }
    } 

    const getSwapType = event => {
        event.preventDefault()
        setSwapType(event.target.value)
        console.log("SwapType", event.target.value)
    }

    const getSwapAmount = event => {
        event.preventDefault()
        setSwapAmount(Number(event.target.value))
        console.log("swap amount", event.target.value)
    }

    const processSwap = async () => {
        setShowModalLoading(true)
        console.log("swapAmount", swapAmount)
        if (swapType == 1) {
            let ethInput = web3.utils.toWei(swapAmount.toString())
            let horaceTokenOutput = await dexUpdate.methods.ethToToken().send({ from: address, value: ethInput.toString() })
        } else {
            let horaceTokenInput = web3.utils.toWei(swapAmount.toString())
            await horaceToken.methods.approve(dexUpdate.options.address, horaceTokenInput.toString()).send({ from: address })
            let ethOutput = await dexUpdate.methods.tokenToEth(horaceTokenInput.toString()).send({ from: address })
        }
        loadDexUpdateData()
        setShowModal(false)
        setShowModalLoading(false)
    }

    const swapcrypto = async () => {
        if (address) {
            let ethInput, horaceTokenInput, ethReserve, horaceTokenReserve, swapOutput, ethOutput, horaceTokenOutput
            ethReserve = await web3.eth.getBalance(dexUpdate.options.address)
            console.log("eth liquitidy", ethReserve)
            setETHReserve(ethReserve)
            horaceTokenReserve = await horaceToken.methods.balanceOf(dexUpdate.options.address).call()
            console.log("horaceToken liquitidy", horaceTokenReserve)
            setHoraceTokenReserve(horaceTokenReserve)
            console.log("swapType", swapType)
            if (swapAmount > 0) {
                if (swapType == 1) {
                    ethInput = web3.utils.toWei(swapAmount.toString())
                    horaceTokenOutput = await dexUpdate.methods.price(ethInput.toString(), ethReserve.toString(), horaceTokenReserve.toString()).call()
                    console.log("ethinput", ethInput)
                    console.log("ethReserve", ethReserve)
                    console.log("horaceTokenReserve", horaceTokenReserve)
                    console.log("horaceTokenOutput", horaceTokenOutput)
                    setSwapOutput(web3.utils.fromWei(horaceTokenOutput.toString()))
                    setShowModal(true)
                } else {
                    horaceTokenInput = web3.utils.toWei(swapAmount.toString())
                    ethOutput = await dexUpdate.methods.price(horaceTokenInput.toString(), horaceTokenReserve.toString(), ethReserve.toString()).call()
                    setSwapOutput(web3.utils.fromWei(ethOutput.toString()))
                    setShowModal(true)
                }
                        
            } else {
                alert(
                    `Swap amount must be greater than zero!!`,
                );
            }
        } else {
            alert(
            `Please connect Mumbai Testnet`,
            );
        }
    }

    const getWithdrawAmount = event => {
        event.preventDefault()
        setWithdrawAmount(event.target.value)
        console.log("amount", event.target.value)
    }

    const getDepositAmount = event => {
        event.preventDefault()
        setDepositAmount(event.target.value)
        console.log("amount", event.target.value)
    }

    const withdrawLiquidity = async () => {
        if (address) {
            if (Number(withdrawAmount) <= Number(yourLiquidity)) {
                console.log("withdrawAmount", withdrawAmount)
                setLiquidityWithdraw(true)
                setShowModalWithdrawDeposit(true)
            } else {
                alert(
                    `Withdraw amount exceed your liquidity !!`,
                );
            }
        } else {
            alert(
            `Please connect Mumbai Testnet`,
            );
        }
    }

    const depositLiquidity = async () => {
        if (address) {
            if (Number(depositAmount) > 0) {
                setLiquidityDeposit(true)
                setShowModalWithdrawDeposit(true)
            } else {
                alert(
                    `Deposit amount must be greater than 0 !!`,
                );
            }
        } else {
            alert(
            `Please connect Mumbai Testnet`,
            );
        }
    }

    const processWithdrawDeposit = async () => {
        setShowModalLoading(true)
        if (liquidityDeposit) {
            console.log("Liquidity Deposit")
            let _depositAmount = web3.utils.toWei(depositAmount)
            console.log("_depositAmount", _depositAmount.toString())
            console.log("horaceTokenReserve", horaceTokenReserve.toString())
            console.log("ethReserve", ethReserve.toString())
            try {
                let _horaceTokendeposit = (Number(horaceTokenReserve) / Number(ethReserve) * Number(depositAmount)) + 1
                _horaceTokendeposit = web3.utils.toWei(_horaceTokendeposit.toString())
                console.log("_horaceTokendeposit", _horaceTokendeposit.toString())
                await horaceToken.methods.approve(dexUpdateAddress, _horaceTokendeposit.toString()).send({ from: address })
                let returnDeposit = await dexUpdate.methods.deposit().send({ from: address, value: _depositAmount.toString() })
                loadDexUpdateData()
                setShowModalLoading(false)
                setShowModalWithdrawDeposit(false)
            } catch (error) {
                console.log(error)
                setShowModalLoading(false)
                setShowModalWithdrawDeposit(false)
            }
        }
        if (liquidityWithdraw) {
            console.log("Liquidity Withdraw")
            setShowModalLoading(true)
            let _withdrawAmount = web3.utils.toWei(withdrawAmount)
            console.log("_withdrawAmount", _withdrawAmount.toString())
            try {
                let values = await dexUpdate.methods.withdraw(_withdrawAmount.toString()).send({ from: address })
                console.log("values", values)
                loadDexUpdateData()
                setShowModalLoading(false)
                setShowModalWithdrawDeposit(false)
            } catch (error) {
                console.log(error)
                setShowModalLoading(false)
                setShowModalWithdrawDeposit(false)
            }
        }
    }

    return (
        <>
            <h2 class="title">
              <div class="has-text-white">
                Decentralized Exchange (DEX)
              </div>
            </h2>
            <h2 class="subtitle mt-4">
              <div class="has-text-white">
                Swap between MATIC and HAT, service charges is apply!! Your Liquidity: {yourLiquidity} MATIC.           
              </div>
            </h2>
            <div class="columns">
                <div class="column is-two-fifths">
                    <div class="box">
                        <div><b>Contract: {dexUpdateAddress}</b></div>
                        <div>
                            <b>MATIC Liquidity : {totalLiquidty} &nbsp; | &nbsp; HAT Liquidty : {horaceTokenLiquidty}</b>
                        </div>
                        <br></br>
                        <div class="select is-primary" id="swaptype" onChange={getSwapType}>
                            <select>
                                <option value="1">Swap from MATIC to HAT</option>
                                <option value="2">Swap from HAT to MATIC</option>
                            </select>
                        </div> 
                        <br></br><br></br>                             
                        <div class="field">
                            <div class="control">
                                <input class="input" type="name" placeholder="Type in the amount you want to swap" onChange={getSwapAmount}/>
                            </div>
                        </div>
                        <button class="button is-primary" onClick={swapcrypto}>Swap</button>
                        <Modal show={showModal} onClose={() => setShowModal(false)}>
                            <div class="columns">
                                <div class="column">
                                {
                                    swapType == 1
                                        ? 
                                            <>
                                                <h2><strong>Swap from MATIC to HAT</strong></h2>
                                                <h2><strong>Input Amount :</strong> {swapAmount} MATIC</h2>
                                                <h2><strong>Output Amount :</strong> {swapOutput} HAT</h2>
                                            </>
                                        : 
                                            <>
                                                <h2><strong>Swap from HAT to MATIC</strong></h2>
                                                <h2><strong>Input Amount :</strong> {swapAmount} HAT</h2>
                                                <h2><strong>Output Amount :</strong> {swapOutput} MATIC</h2>
                                            </>
                                }
                                </div>
                            </div>
                            <div class="columns">
                                <div class="column is-one-fifth">
                                    <button class="button is-primary is-small" onClick={processSwap}>Confirm</button>
                                </div>
                                <div class="column is-one-fifth">
                                    <button class="button is-primary is-small" onClick={() => {setShowModal(false)}}>Cancel</button>
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
                </div>
                <div class="column">
                    <div class="box">
                        <div><b>Deposit Liquidity</b></div>
                        <div><b>Your Liquidity:</b> {yourLiquidity} MATIC</div>
                        <br></br>
                        <div class="field">
                            <div class="control">
                                <input class="input" type="name" placeholder="Type in the amount you want to deposit" onChange={getDepositAmount}/>
                            </div>
                        </div>
                        <button class="button is-primary" onClick={depositLiquidity}>Deposit</button>
                    </div>
                </div>
                <div class="column">
                    <div class="box">
                        <div><b>Withdraw Liquidity</b></div>
                        <div><b>Your Liquidity:</b> {yourLiquidity} MATIC</div>
                        <br></br>
                        {
                            yourLiquidity > 0
                                ?
                                    <>
                                        <div class="field">
                                            <div class="control">
                                                <input class="input" type="name" placeholder="Type in the amount you want to withdraw" onChange={getWithdrawAmount}/>
                                            </div>
                                        </div>
                                        <button class="button is-primary" onClick={withdrawLiquidity}>Withdraw</button>
                                    </>
                                :   <><b>You do not have any liquidity to withdraw!!</b></>
                        }                             
                    </div>
                </div>
                <ModalWithdrawDeposit show={showModalWithdrawDeposit} onClose={() => setShowModalWithdrawDeposit(false)}>
                    <div class="columns">
                        {
                            liquidityWithdraw
                                ?
                                    <>
                                        <div class="column">
                                            Your Liquidity: <b>{yourLiquidity} MATIC</b>.<br></br>
                                            You want to withdraw <b>{withdrawAmount} MATIC</b> from your liquidity.
                                        </div>
                                    </>
                                :   <></>
                        }
                        {
                            liquidityDeposit
                                ?
                                    <>
                                        <div class="column">
                                            Your Liquidity: <b>{yourLiquidity} MATIC</b>.<br></br>
                                            You want to deposit <b>{depositAmount} MATIC</b> to your liquidity.
                                        </div>
                                    </>
                                :   <></>
                        }
                    </div>
                    <div class="columns">
                        <div class="column is-one-fifth">
                            <button class="button is-primary is-small" onClick={processWithdrawDeposit}>Confirm</button>
                        </div>
                        <div class="column is-one-fifth">
                            <button class="button is-primary is-small" onClick={() => {setShowModalWithdrawDeposit(false)}}>Cancel</button>
                        </div>
                    </div>
                </ModalWithdrawDeposit>
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
            <br></br><br></br>
        </>

    )

}
