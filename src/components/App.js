import React, { Component } from "react";
import Web3 from "web3";
import "./App.css";
import EthSwap from "../abis/EthSwap.json";
import Token from "../abis/Token.json";
import NavBar from "./NavBar";
import Main from "./Main";

class App extends Component {
  async componentDidMount() {
    await this.loadWeb3();
    await this.loadBlockChainData();
    // console.log(window.web3);
  }

  async loadBlockChainData() {
    const web3 = window.web3;

    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });

    const ethSwapBalance = await web3.eth.getBalance(this.state.account);
    this.setState({ ethBalance: ethSwapBalance });
    // console.log(this.state.ethBalance)

    // Load Token
    const networkId = await web3.eth.net.getId();
    const tokenData = Token.networks[networkId];
    if (tokenData) {
      const token = new web3.eth.Contract(Token.abi, tokenData.address);
      console.log(token);
      this.setState({ token: token });
      console.log(this.state.account);
      let tokenBalance = await token.methods
        .balanceof(this.state.account)
        .call();
      this.setState({ tokenBalance: window.web3.utils.fromWei(tokenBalance.toString()) });
      console.log(this.state.tokenBalance);
    } else {
      window.alert("Token contract not deployed to detected network");
    }

    // Load EthSwap
    const ethSwapData = EthSwap.networks[networkId];
    if (ethSwapData) {
      const ethSwap = new web3.eth.Contract(EthSwap.abi, ethSwapData.address);
      console.log(ethSwap);
      this.setState({ ethSwap: ethSwap });
    } else {
      window.alert("ethSwap contract not deployed to detected network");
    }
    this.setState({ loading: false });
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "Non Ethereum browser detected. You should consider trying MetaMask."
      );
    }
  }

  buyToken=async (etherAmount)=> {
    this.setState({ loading: true });
    await this.state.ethSwap.methods
      .buyTokens()
      .send({ value: etherAmount, from: this.state.account })
      .on("transactionHash", (hash) => {
        this.setState({ loading: false });
      });
      // window.location.reload()
      
  }

  constructor(props) {
    super(props);
    this.state = {
      account: "",
      ethBalance: "0",
      token: "",
      tokenBalance: "0",
      ethSwap: "",
      loading: true,
    };
  }

  render() {
    let content;
    if (this.state.loading) {
      content = <p id="loader">loading...</p>;
    } else {
      content = (
        <Main
          ethBalance={this.state.ethBalance}
          tokenBalance={this.state.tokenBalance}
          buyToken={this.buyToken}
        />
      );
    }

    return (
      <div>
        <NavBar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <a
                  href="http://www.dappuniversity.com/bootcamp"
                  target="_blank"
                  rel="noopener noreferrer"
                ></a>
                {content}
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
