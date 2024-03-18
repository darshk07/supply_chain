import React, { useState } from "react";
import { useAccount, useReadContract } from "wagmi";
import { contractConfig } from "../config/contractConfig";
import { Button, Input } from "antd";
import { readContract } from "@wagmi/core";
import { config } from "../wagmiConfig";

type Props = {};

const SupplyHistory = (props: Props) => {
  const { address } = useAccount();
  const [productId, setProductId] = useState<string>("");
  const [data, setData] = useState<any>();

  const checkIfEmpty = (s: any) => {
    if (s === "0x0000000000000000000000000000000000000000") return true;
    return false;
  };

  const handleSubmit = async () => {
    console.log("productId", productId);
    const result: any[] = await readContract(config, {
      ...contractConfig,
      functionName: "getSupplyHistory",
      account: address,
      args: [parseInt(productId)],
    });
    console.log(result);
    setData(result[0]);
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-center ">
      <div className="p-8 flex gap-4">
        <Input
          className="w-[420px]"
          onChange={(e) => setProductId(e.target.value)}
        />
        <Button onClick={handleSubmit}>Submit</Button>
      </div>
      {data && (
        <div className="">
          <div className="">
            Manufacturer :{" "}
            {checkIfEmpty(data.manufacturer) ? "Na" : data.manufacturer}
          </div>
          <div className="">
            Distributor :{" "}
            {checkIfEmpty(data.distributor) ? "Na" : data.distributor}
          </div>
          <div className="">Money : {data.money.toString()}</div>
          <div className="">
            Product Amount : {data.productAmount.toString()}
          </div>
          <div className="">Product Name: {data.productName}</div>
          <div className="">
            Retailer : {checkIfEmpty(data.retailer) ? "Na" : data.retailer}
          </div>
          <div className="">Status : {data.status}</div>
        </div>
      )}
    </div>
  );
};

export default SupplyHistory;
