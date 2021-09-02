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

    event tokenSold(
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

    function sellTokens(uint256 _amount) public {
        // User Can't sell more tokens than they have
        require(token.balanceOf(msg.sender) >= _amount);
        // Calculate the amount of ether to redeem
        uint256 etherAmount = _amount / rate;

        require(address(this).balance >= etherAmount);

        // Transfer token to ethSwap
        token.transferFrom(msg.sender, address(this), _amount);

        // Transfer etherAmount to investor
        msg.sender.transfer(etherAmount);

        // Emit an event
        emit tokenSold(msg.sender, address(token), _amount, rate);
    }
}
