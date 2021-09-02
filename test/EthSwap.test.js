const { assert } = require("chai");

const Token = artifacts.require("Token");
const EthSwap = artifacts.require("EthSwap");

require("chai")
  .use(require("chai-as-promised"))
  .should();

function tokens(n) {
  return web3.utils.toWei(n, "ether");
}

contract("EthSwap", ([deployer, investor]) => {
  let token, ethSwap;
  before(async () => {
    token = await Token.new();
    ethSwap = await EthSwap.new(token.address);
  });

  describe("Token Deployement", async () => {
    it("contract has a name", async () => {
      const name = await token.name();
      assert.equal(name, "DApp Token");
    });
  });
  describe("Token Deployement", async () => {
    it("contract has a name", async () => {
      const name = await ethSwap.name();
      assert.equal(name, "EthSwap Instant Exchange");
    });
    it("contract has token", async () => {
      await token.transfer(ethSwap.address, tokens("1000000"));
      let balance = await token.balanceOf(ethSwap.address);
      assert.equal(balance.toString(), tokens("1000000"));
    });
  });
  describe("buyTokens", async () => {
    let result;
    before(async () => {
      //Purcahse Tokens before each example
      result = await ethSwap.buyTokens({
        from: investor,
        value: web3.utils.toWei("1", "ether"),
      });
    });
    it("Allows user to instantly purchase tokens from ethSwap for a fixed price", async () => {
      let investorBalance = await token.balanceOf(investor);
      assert.equal(investorBalance.toString(), tokens("100"));

      //   Check ethWap Balance after purchase
      let ethSwapBalance;
      ethSwapBalance = await token.balanceOf(ethSwap.address);
      assert.equal(ethSwapBalance.toString(), tokens("999900"));

      // Check if ether balance went up
      ethSwapBalance = await web3.eth.getBalance(ethSwap.address);
      assert.equal(ethSwapBalance.toString(), web3.utils.toWei("1", "ether"));

      const event = result.logs[0].args;
      assert.equal(event.account, investor);
      assert.equal(event.token, token.address);
      assert.equal(event.amount.toString(), tokens("100").toString());
      assert.equal(event.rate.toString(), "100");
    });
  });
  describe("sellTokens", async () => {
    let result;
    before(async () => {
      // Investior must approve the purchase
      await token.approve(ethSwap.address, tokens("100"), { from: investor });
      // Investor sells tokens
      result = await ethSwap.sellTokens(tokens("100"), { from: investor });
    });
    it("Allows user to sell tokens to ethSwap for a fixed price", async () => {
      // Confirm token balance of investor is back to zero
      let investorBalance = await token.balanceOf(investor);
      assert.equal(investorBalance.toString(), tokens("0"));

      // Confirm token balance of ethSwap is back to 1 Million
      let tokenBalance = await token.balanceOf(ethSwap.address);
      assert.equal(tokenBalance.toString(), tokens("1000000"));

      // Confirm if ether balance of ethSwap is back to zero
      let etherBalance = await web3.eth.getBalance(ethSwap.address);
      assert.equal(etherBalance, web3.utils.toWei("0", "ether"));

      // console.log(result.logs[0].args);
      const event = result.logs[0].args;
      assert.equal(event.account, investor);
      assert.equal(event.token, token.address);
      assert.equal(event.amount.toString(), tokens("100").toString());
      assert.equal(event.rate.toString(), "100");

      // Failure: Can't sell more tokens than it has
      await ethSwap.sellTokens(tokens("500"), { from: investor }).should.be
        .rejected;
    });
  });
});
