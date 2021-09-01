pragma solidity ^0.5.0;
import "./Token.sol";

contract EthSwap {
    string public name = "EthSwap Instant Exchange";
    Token public token;
    uint256 public rate = 100;

    event tokenPurchase(
        address account,
        address token,
        uint256 amount,
        uint256 rate
    );

    constructor(Token _token) public {
        token = _token;
    }

    function buyTokens() public payable {
        // Calculate the amount of token to be transferred in excahnge of 1 ether
        uint256 tokenAmount = (msg.value) * 100;

        // To check if there are enough tokens to transfer
        require(token.balanceOf(address(this)) >= tokenAmount);

        token.transfer(msg.sender, tokenAmount);

        // Emit an event
        emit tokenPurchase(msg.sender, address(token), tokenAmount, rate);
    }
}
