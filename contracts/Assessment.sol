// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CalculatorContract {
    int256 public result;

    function add(int256 a, int256 b) public {
        result = a + b;
    }

    function subtract(int256 a, int256 b) public {
        result = a - b;
    }

    function getResult() public view returns (int256) {
        return result;
    }
}
