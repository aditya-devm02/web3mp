import React from "react";
import { encodeFunctionData } from "viem";
import { evmRawTransaction , useOkto} from "@okto_web3/react-sdk";

export default function Cart({ cartItems, removeFromCart }) {
  const oktoClient = useOkto();
  const total = cartItems.reduce(( sum, item ) => sum + item.price, 0);

  const handleClick = async () => {
    
    try {
      const contractAddress = "0x2182c846304c3a2a2854129c00f4cb39b41a7141";
      const functionName = "addPayment";
      const functionArgs = [30, '1,2'];

      const functionData = encodeFunctionData({
        abi: [
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
              },
              {
                "internalType": "string",
                "name": "details",
                "type": "string"
              }
            ],
            "name": "addPayment",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
          },
          {
            "inputs": [],
            "stateMutability": "nonpayable",
            "type": "constructor"
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": false,
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
              },
              {
                "indexed": true,
                "internalType": "address",
                "name": "payer",
                "type": "address"
              },
              {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
              },
              {
                "indexed": false,
                "internalType": "string",
                "name": "details",
                "type": "string"
              }
            ],
            "name": "PaymentAdded",
            "type": "event"
          },
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
              }
            ],
            "name": "getPayment",
            "outputs": [
              {
                "components": [
                  {
                    "internalType": "uint256",
                    "name": "id",
                    "type": "uint256"
                  },
                  {
                    "internalType": "address",
                    "name": "payer",
                    "type": "address"
                  },
                  {
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                  },
                  {
                    "internalType": "string",
                    "name": "details",
                    "type": "string"
                  },
                  {
                    "internalType": "uint256",
                    "name": "timestamp",
                    "type": "uint256"
                  }
                ],
                "internalType": "struct PaymentTracker.Payment",
                "name": "",
                "type": "tuple"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          },
          {
            "inputs": [],
            "name": "getTotalPayments",
            "outputs": [
              {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          }
        ]as const,
        functionName,
        args: functionArgs,
      });

      const rawTxParams = {
        networkId: "eip155:137", // Change to Polygon Amoy networkId if needed
        transaction: {
          to: contractAddress,
          data: functionData,
        },
      };

      const result = await evmRawTransaction(oktoClient, {
        networkId: "eip155:84537",
        transaction: {
          to: contractAddress,
          data: functionData,
        },
      });
      console.log("Transaction successful", result);
    } catch (error) {
      console.error("Transaction failed", error);
    }
  };

  return (
    <div className="glassmorphism-card p-6 rounded-xl shadow-lg w-full max-w-lg bg-white/10 text-white border border-gray-200">
      <h2 className="text-3xl font-bold text-center mb-4 text-blue-400">🛒 Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <p className="text-center text-lg text-gray-300">Your cart is empty</p>
      ) : (
        <ul className="space-y-4">
          {cartItems.map((item, index) => (
            <li key={index} className="flex justify-between items-center bg-gray-800 p-3 rounded-lg shadow">
              <span className="text-lg font-semibold text-blue-300">{item.name}</span>
              <span className="text-lg font-bold text-green-400">${item.price}</span>
              <button 
                onClick={() => removeFromCart(index)} 
                className="px-3 py-1 bg-red-500 hover:bg-red-700 text-white font-semibold rounded-lg shadow transition">
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
      <p className="text-2xl font-semibold text-center mt-4 text-yellow-400">Total: ${total.toFixed(2)}</p>
      <div className="flex justify-center mt-6">
        <button 
          onClick={handleClick} 
          className="px-6 py-3 bg-green-500 hover:bg-green-700 text-white text-lg font-bold rounded-lg shadow-lg transition">
          Checkout
        </button>
      </div>
    </div>
  );
}
