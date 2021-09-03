import React, { Component, useEffect, useState } from "react";
import Web3 from "web3";
import "./Main.css";

export class Main extends Component {
  submit = (e) => {
    e.preventDefault();
    let etherAmount = this.state.out.toString() / 100;
    etherAmount=window.web3.utils.toWei(etherAmount.toString(),'Ether');
    this.props.buyToken(etherAmount)
    console.log("Purchasing tokens");
  };
  constructor(props) {
    super(props);
    this.state = {
      out: '0',
    };
  }
  handleChange = (e) => {
    this.setState({ out: e.target.value.toString() * 100 });
  };

  render() {
    return (
      <>
        <div className="change">
          <h3 className="left padding">Buy</h3>
          <h3 className="right padding">Sell</h3>
        </div>

        <form action="" onSubmit={this.submit}>
          <div className="box">
            <div className="change margin">
              <h6>Input</h6>
              <h6 className="right">
                Balance:{window.web3.utils.fromWei(this.props.ethBalance)}
              </h6>
            </div>
            <div className="change">
              <input
                className="full"
                value={this.state.bal}
                onChange={this.handleChange}
                type="number"
                name=""
                id=""
              />
              <h4 className="right smallBox">Ether</h4>
            </div>
            <div className="change margin">
              <h6>Output</h6>
              <h6 className="right">Balance:{this.props.tokenBalance || 0}</h6>
            </div>
            <div className="change">
              <input
                value={this.state.out}
                disabled
                className="full"
                type="number"
                name=""
                id=""
              />
              <h4 className="right">DApp</h4>
            </div>
            <div className="change margin">
              <h6>Exchange Rate</h6>
              <h6 className="right">1 Eth: 100 DApp</h6>
            </div>
            <button className="button">Swap</button>
          </div>
        </form>
      </>
    );
  }
}

export default Main;
