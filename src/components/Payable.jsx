import React from "react";
import { useReadContract, useWriteContract } from "wagmi";
import { contractConfig } from "../config/contractConfig";
import { parseEther } from "viem";

const Payable = () => {
  const { data, writeContract, error } = useWriteContract();

  const { data: balance } = useReadContract({
    ...contractConfig,
    functionName: "getContractBalance",
  });
  // const { config, error } = useSimulateContract({
  // ...contractConfig,
  // functionName: "deposit",
  // value: parseEther("0.01"),
  // });

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
      // args: ["0x94d3366702BA6A00DFc1b2278e1f4D3356B1087e"],
      value: parseEther("0.01"),
    });
    console.log("clicked");
  };
  console.log(error);
  // console.log(error);

  return (
    <div>
      <h1>Payable</h1>
      <p>Click the button to pay</p>
      <button onClick={() => handlePay()}>Pay</button>

      <h1>Contract Balance</h1>
      <p>{balance?.toString()}</p>

      <h1>Withdraw to me</h1>
      <button onClick={handleWithdraw}>Withdraw</button>
    </div>
  );
};

export default Payable;
