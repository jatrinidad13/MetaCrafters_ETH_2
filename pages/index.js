import { useState, useEffect } from "react";
import { ethers } from "ethers";
import calculator_abi from "../artifacts/contracts/Assessment.sol/CalculatorContract.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(null);
  const [account, setAccount] = useState(null);
  const [calculator, setCalculator] = useState(null);
  const [result, setResult] = useState(null); // Use null to check loading state
  const [a, setA] = useState(0); // First number for addition/subtraction
  const [b, setB] = useState(0); // Second number for addition/subtraction

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const calculatorABI = calculator_abi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    } else {
      alert("Please install MetaMask to use this app.");
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
    setAccount(accounts[0]);
    getCalculatorContract(); // Fetch the contract once the account is connected
  };

  const getCalculatorContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const calculatorContract = new ethers.Contract(contractAddress, calculatorABI, signer);

    setCalculator(calculatorContract);
  };

  const getResult = async () => {
    if (!calculator) return;
    try {
      const currentResult = await calculator.getResult();
      setResult(currentResult.toString());
    } catch (error) {
      console.error("Error calling getResult:", error);
      setResult(null); // Reset result on error
    }
  };

  const add = async () => {
    if (calculator) {
      try {
        const tx = await calculator.add(a, b, {
          gasLimit: 100000, // Adjust according to contract's needs
          gasPrice: ethers.utils.parseUnits("20", "gwei") // Adjust gas price if needed
        });
        await tx.wait();
        getResult(); // Update result after the transaction
      } catch (error) {
        console.error("Error during add:", error); // Log errors
      }
    }
  };
  
  const subtract = async () => {
    if (calculator) {
      try {
        const tx = await calculator.subtract(a, b, {
          gasLimit: 100000, // Adjust according to contract's needs
          gasPrice: ethers.utils.parseUnits("20", "gwei") // Adjust gas price if needed
        });
        await tx.wait();
        getResult(); // Update result after the transaction
      } catch (error) {
        console.error("Error during subtract:", error); // Log errors
      }
    }
  };
  

  useEffect(() => {
    getWallet(); // Initialize wallet on component mount
  }, []); // Only run once when component mounts

  useEffect(() => {
    if (account && calculator) {
      getResult(); // Fetch result after account is connected and contract is set
    }
  }, [account, calculator]); // Runs when account or calculator is set

  const initUser = () => {
    if (!ethWallet) {
      return <p>Please install Metamask in order to use this calculator.</p>;
    }

    if (!account) {
      return <button onClick={connectAccount}>Connect your MetaMask wallet</button>;
    }

    return (
      <div>
        <p>Your Account: {account}</p>
        <p>Current Result: {result}</p>
        <div>
          <input
            type="number"
            value={a}
            onChange={(e) => setA(parseInt(e.target.value))}
            placeholder="Enter first number"
          />
          <input
            type="number"
            value={b}
            onChange={(e) => setB(parseInt(e.target.value))}
            placeholder="Enter second number"
          />
        </div>
        <button onClick={add}>Add</button>
        <button onClick={subtract}>Subtract</button>
      </div>
    );
  };

  return (
    <main className="container">
      <header>
        <h1>Welcome to the Ethereum Calculator!</h1>
      </header>
      {initUser()}
      <style jsx>{`
        .container {
          text-align: center;
        }
        input {
          margin: 5px;
        }
        button {
          margin-top: 10px;
          margin-bottom: 10px;
        }
      `}</style>
    </main>
  );
}
