import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  useWatchContractEvent,
} from "wagmi";
import { contractConfig } from "../config/contractConfig";

const Test = () => {
  const { data, writeContract } = useWriteContract();

  useWatchContractEvent({
    ...contractConfig,
    eventName: "messagechanged",
    onLogs(logs) {
      console.log("Logs changed!", logs);
    },
  });

  const {
    data: read,
    isLoading,
    isFetching,
    error,
    isPending,
  } = useReadContract({
    ...contractConfig,
    functionName: "read",
    // args: ["0x03A71968491d55603FFe1b11A9e23eF013f75bCF"],
  });

  const handleWrite = async () => {
    writeContract({
      ...contractConfig,
      functionName: "update",
      args: ["kedar"],
    });
  };

  useWaitForTransactionReceipt({
    ...contractConfig,
    onTransactionReceipt(receipt) {
      console.log("Transaction Receipt", receipt);
    },
  });

  return (
    <div>
      <button onClick={handleWrite}>Write</button>
      <div className="">{error}</div>
      <div className="">{isPending ? "Pending" : "not pending"}</div>
      <div className="">{isFetching ? "Fetching" : "not fetching"}</div>
      <div className="">{isLoading ? "Loading..." : read}</div>
    </div>
  );
};

export default Test;
