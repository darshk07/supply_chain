import { useState } from "react";
import { useAccount } from "wagmi";
import { contractConfig } from "../config/contractConfig";
import { Button, Input, Table, Tag } from "antd";
import { readContract } from "@wagmi/core";
import { config } from "../wagmiConfig";
import { formatEther } from "viem";

const SupplyHistory = () => {
  const { address } = useAccount();
  const [productId, setProductId] = useState<string>("");
  const [data, setData] = useState<any[]>();

  const checkIfEmpty = (s: any) => {
    if (s === "0x0000000000000000000000000000000000000000") return true;
    return false;
  };

  const handleSubmit = async () => {
    console.log("productId", productId);
    const result: any = await readContract(config, {
      ...contractConfig,
      functionName: "getSupplyHistory",
      account: address,
      args: [parseInt(productId)],
    });
    console.log(result);
    setData(result);
  };

  function shortenAddress(address: string) {
    // Check if address is a valid Ethereum address
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      throw new Error("Invalid Ethereum address");
    }

    // Extract the first and last characters of the address
    const firstPart = address.substring(0, 6);
    const lastPart = address.substring(address.length - 4);

    // Concatenate the parts with an ellipsis in between
    return `${firstPart}...${lastPart}`;
  }

  const columns = [
    {
      title: "Product Id",
      dataIndex: "productId",
      key: "productId",
      render: (text: string) => <span>{text.toString()}</span>,
    },
    {
      title: "Product Name",
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: "Quantity",
      dataIndex: "productAmount",
      key: "productAmount",
      render: (text: string) => <span>{text.toString()}</span>,
    },
    {
      title: "Amount",
      dataIndex: "money",
      key: "money",
      render: (text: any) => <span>{formatEther(text.toString())} ETH</span>,
    },
    {
      title: "Manufacturer",
      dataIndex: "manufacturer",
      key: "manufacturer",
      render: (text: string) => {
        if (checkIfEmpty(text)) return <span>-</span>;
        return <span>{shortenAddress(text)}</span>;
      },
    },
    {
      title: "Distributor",
      dataIndex: "distributor",
      key: "distributor",
      render: (text: string) => {
        if (checkIfEmpty(text)) return <span>-</span>;
        return <span>{shortenAddress(text)}</span>;
      },
    },
    {
      title: "Retailer",
      dataIndex: "retailer",
      key: "retailer",
      render: (text: string) => {
        if (checkIfEmpty(text)) return <span>-</span>;
        return <span>{shortenAddress(text)}</span>;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text: string, row: any) => {
        let color = row.status.includes("Received")
          ? "green"
          : row.status.includes("Paid")
          ? "blue"
          : row.status.includes("Sale")
          ? "red"
          : row.status.includes("Shipped")
          ? "yellow"
          : "default";
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: "Timestamp",
      dataIndex: "time",
      key: "time",
      render: (text: BigInt) => {
        return <div>{convertUnixTimestampToDateTime(Number(text))}</div>;
      },
    },
  ];

  return (
    <div className="flex flex-1 flex-col items-center justify-center ">
      <div className="p-8 flex gap-4">
        <Input
          className="w-[420px]"
          onChange={(e) => setProductId(e.target.value)}
        />
        <Button onClick={handleSubmit}>Submit</Button>
      </div>
      <Table scroll={{ x: 1300 }} dataSource={data} columns={columns} />

      {/* {data &&
        data.map((d: any) => (
          <div className="mt-4">
            <div className="">
              Manufacturer :{" "}
              {checkIfEmpty(d.manufacturer) ? "Na" : d.manufacturer}
            </div>
            <div className="">
              Distributor : {checkIfEmpty(d.distributor) ? "Na" : d.distributor}
            </div>
            <div className="">Money : {d.money.toString()}</div>
            <div className="">
              Product Amount : {d.productAmount.toString()}
            </div>
            <div className="">Product Name: {d.productName}</div>
            <div className="">
              Retailer : {checkIfEmpty(d.retailer) ? "Na" : d.retailer}
            </div>
            <div className="">Status : {d.status}</div>
          </div>
        ))} */}
    </div>
  );
};

export function convertUnixTimestampToDateTime(unixTimestamp: any) {
  // Convert Unix timestamp to milliseconds
  const milliseconds = unixTimestamp * 1000;

  // Create a new Date object
  const dateObject = new Date(milliseconds);

  // Extract date and time components
  const date = dateObject.toLocaleDateString(); // Date in local time zone
  const time = dateObject.toLocaleTimeString(); // Time in local time zone

  // Return date and time
  return `${date} ${time}`;
}
export default SupplyHistory;
