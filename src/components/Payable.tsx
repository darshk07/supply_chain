import React from "react";
import { type UseWatchPendingTransactionsParameters } from "wagmi";
import {
  useReadContract,
  useWaitForTransactionReceipt,
  useWatchPendingTransactions,
  useWriteContract,
} from "wagmi";
import { contractConfig } from "../config/contractConfig";
import { Transaction, parseEther } from "viem";
import { config } from "../wagmiConfig";

const Payable = () => {
  const { writeContract } = useWriteContract();

  useWatchPendingTransactions({
    config: config,
    onTransactions(transactions: any) {
      console.log("New transactions!", transactions);
    },
    onTransactionSuccess: (tx: Transaction) => {
      console.log("Transaction success", tx);
    },
    onTransactionError: (tx: Transaction) => {
      console.log("Transaction error", tx);
    },
    poll: true,
  });

  const { data: balance } = useReadContract({
    ...contractConfig,
    functionName: "getContractBalance",
  });

  const handleWithdraw = async () => {
    writeContract({
      ...contractConfig,
      functionName: "withdrawToAddress",
      args: ["0x06a3BaeF4F856C1E1427914a64A2Ebd0Bf51D6C0"],
    });
  };
  const handlePay = async () => {
    writeContract({
      ...contractConfig,
      functionName: "deposit",
      value: parseEther("0.01"),
    });

    console.log("clicked");
  };

  return (
    <div className="p-2">
      <h1>Payable</h1>
      <p>Click the button to pay</p>
      <button
        className="py-2 px-6 m-2 border-2 rounded-md"
        onClick={() => handlePay()}
      >
        Pay
      </button>
      <br />
      <br />
      <h1>Contract Balance</h1>
      <p className="font-semibold text-xl ml-4">{balance?.toString()}</p>
      <br />
      <br />
      <h1>Withdraw to me</h1>
      <button
        className="py-2 px-6 m-2 border-2 rounded-md"
        onClick={handleWithdraw}
      >
        Withdraw
      </button>
    </div>
  );
};

export default Payable;
