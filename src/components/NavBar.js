import Identicon from "identicon.js";
import React from "react";
import "./App.css";

function NavBar({ account }) {
  return (
    <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
      <a
        className="navbar-brand col-sm-3 col-md-2 mr-0"
        href="http://www.dappuniversity.com/bootcamp"
        target="_blank"
        rel="noopener noreferrer"
      >
        EthSwap
      </a>
      <p className="account">{account}</p>
      {account ? (
        <img
          height="30px"
          width="30px"
          src={`data:image/png;base64,${new Identicon(account, 30).toString()}`}
        />
      ) : null}
    </nav>
  );
}

export default NavBar;
