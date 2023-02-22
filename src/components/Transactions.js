import React, { Component } from 'react';
import Rupee from '../rupee.jpeg'
import './App.css';
import Web3 from 'web3';
import DaiTokenMock from '../abis/DaiTokenMock.json'
import { Link } from 'react-router-dom';
class Transactions extends Component {
    async componentWillMount() {
      await this.loadWeb3()
      await this.loadBlockchainData()
    }
  
    async loadWeb3() {
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum)
        await window.ethereum.enable()
      }
      else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider)
      }
      else {
        window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
      }
    }
  
    async loadBlockchainData() {
      const web3 = window.web3
      const accounts = await web3.eth.getAccounts()
      this.setState({ account: accounts[0] })
      const daiTokenAddress = "0x6F90c88271aE7D194107322EcC8859Af5163CB95" // Replace DAI Address Here
      const daiTokenMock = new web3.eth.Contract(DaiTokenMock.abi, daiTokenAddress)
      this.setState({ daiTokenMock: daiTokenMock })
      const balance = await daiTokenMock.methods.balanceOf(this.state.account).call()
      this.setState({ balance: web3.utils.fromWei(balance.toString(), 'Ether') })
      const transactions = await daiTokenMock.getPastEvents('Transfer', { fromBlock: 0, toBlock: 'latest', filter: { from: this.state.account } })
      this.setState({ transactions: transactions })
      console.log(transactions)
      console.log(this.state.account)
      console.log(balance)
    }
  
    transfer(recipient, amount) {
      this.state.daiTokenMock.methods.transfer(recipient, amount).send({ from: this.state.account })
    }
  
    constructor(props) {
      super(props)
      this.state = {
        account: '',
        daiTokenMock: null,
        balance: 0,
        transactions: []
      }
  
      this.transfer = this.transfer.bind(this)
    }
    render() {
        return (
          <div>
            <div className="container-fluid mt-5">
              <div className="row">
                <main role="main" className="col-lg-12 d-flex text-center">
                  <div className="content mr-auto ml-auto" style={{ width: "500px" }}>
                      <img src={Rupee} width="150" />
                    {/* </a> */}
                    <h1>{this.state.balance} INR</h1>
                    <form onSubmit={(event) => {
                      event.preventDefault()
                      const recipient = this.recipient.value
                      const amount = window.web3.utils.toWei(this.amount.value, 'Ether')
                      this.transfer(recipient, amount)
                    }}>
                      <div className="form-group mr-sm-2">
                        <input
                          id="recipient"
                          type="text"
                          ref={(input) => { this.recipient = input }}
                          className="form-control"
                          placeholder="Recipient Address"
                          required />
                      </div>
                      <div className="form-group mr-sm-2">
                        <input
                          id="amount"
                          type="text"
                          ref={(input) => { this.amount = input }}
                          className="form-control"
                          placeholder="Amount"
                          required />
                      </div>
                      <button type="submit" className="btn btn-primary btn-block">Send</button>
                    </form>
                    <Link to={"/History"} state={ {vare:this.state.transactions}}>
                      <button type="button" class="btn btn-outline-primary btn-lg fixed-centre m-5">History</button>
                    </Link>
                    {console.log(this.state.transactions)}
                    
                  </div>
                </main>
              </div>
            </div>
          </div>
        );
      }
    }
    
    export default Transactions;