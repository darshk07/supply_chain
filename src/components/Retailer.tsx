import { Button, Table, Tag } from "antd";
import { useEffect, useState } from "react";
import { contractConfig } from "../config/contractConfig";
import { useAccount, useWatchContractEvent, useWriteContract } from "wagmi";
import { formatEther } from "viem";
import { readContract } from "@wagmi/core";
import { config } from "../wagmiConfig";
import { convertUnixTimestampToDateTime } from "./SupplyHistory";

type Props = {};

// type Product = {
//   name: string | null;
//   price: number | null;
//   quantity: number | null;
// };

function Retailer({}: Props) {
  const { address } = useAccount();
  const { writeContract, error } = useWriteContract();
  const [products, setProducts] = useState<any[]>([]);
  const [myProducts, setMyProducts] = useState<any[]>([]);

  useEffect(() => {
    getProducts();
    getMyProducts();
  }, []);

  console.log(error);
  const getProducts = async () => {
    const pro: any = await readContract(config, {
      ...contractConfig,
      functionName: "allProductsOfDistributor",
      account: address,
    });
    console.log(pro);
    setProducts(pro);
  };

  const getMyProducts = async () => {
    const pro: any = await readContract(config, {
      ...contractConfig,
      functionName: "getStatusOfAllProducts",
      args: [address, "Retailer"],
      account: address,
    });
    console.log(pro);
    setMyProducts(pro);
  };

  useWatchContractEvent({
    ...contractConfig,
    eventName: "Shipped",
    onLogs(logs: any) {
      console.log("New logs!", logs);
      getMyProducts();
      getProducts();
    },
  });
  useWatchContractEvent({
    ...contractConfig,
    eventName: "OnSale",
    onLogs(logs: any) {
      console.log("New logs!", logs);
      getProducts();
      getMyProducts();
    },
  });

  useWatchContractEvent({
    ...contractConfig,
    eventName: "Paid",
    onLogs(logs: any) {
      console.log("New logs!", logs);
      getProducts();
      getMyProducts();
    },
  });

  useWatchContractEvent({
    ...contractConfig,
    eventName: "Received",
    onLogs(logs: any) {
      console.log("New logs!", logs);
      getProducts();
      getMyProducts();
    },
  });

  const handleProductPay = async (row: any) => {
    writeContract({
      ...contractConfig,
      functionName: "PayByRetailer",
      args: [row.productId, row.distributor],
      value: row.money.toString(),
    });
  };

  const markAsReceived = async (row: any) => {
    writeContract({
      ...contractConfig,
      functionName: "ReceivedToRetailer",
      args: [row.productId],
    });
  };

  const columns = [
    {
      title: "Product Id",
      dataIndex: "productId",
      key: "productId",
      render: (text: any) => <div>{text.toString()}</div>,
    },
    {
      title: "Product Name",
      dataIndex: "productName",
      key: "name",
    },
    {
      title: "Amount",
      dataIndex: "money",
      key: "amount",
      render: (text: any) => {
        return <div>{formatEther(text)} </div>;
      },
    },
    {
      title: "Quantity",
      dataIndex: "productAmount",
      key: "quantity",
      render: (text: any) => <div>{text.toString()}</div>,
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
    {
      title: "Actions",
      key: "actions",
      render: (_: string, row: any) => {
        if (row.status === "On Sale by Distributor")
          return (
            <Button onClick={() => handleProductPay(row)} type="dashed">
              Pay
            </Button>
          );
      },
    },
  ];

  const myColumns = [
    {
      title: "Product Id",
      dataIndex: "productId",
      key: "productId",
      render: (text: any) => <div>{text.toString()}</div>,
    },
    {
      title: "Product Name",
      dataIndex: "productName",
      key: "name",
    },
    {
      title: "Amount",
      dataIndex: "money",
      key: "amount",
      render: (text: any) => {
        return <div>{formatEther(text)} </div>;
      },
    },
    {
      title: "Quantity",
      dataIndex: "productAmount",
      key: "quantity",
      render: (text: any) => <div>{text.toString()}</div>,
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
    {
      title: "Actions",
      key: "actions",
      render: (_: string, row: any) => {
        if (row.status === "Shipped from Distributor")
          return (
            <Button onClick={() => markAsReceived(row)} type="dashed">
              Mark as Received
            </Button>
          );
      },
    },
  ];

  return (
    <div className="flex-1 flex justify-start flex-col px-16 py-8 gap-8 ">
      <div className="flex gap-2 items-center justify-between">
        <div className="flex flex-col items-start">
          <div className="text-4xl">Retailer</div>
          <div className="text-center">
            You can buy products from a distributor and sell it to your
            customers.
          </div>
        </div>
      </div>
      <div className="flex gap-4 flex-col">
        <div className="text-xl">On Sale by Distributor</div>
        <div className="border-2 rounded-md ">
          <Table bordered columns={columns} dataSource={products} />
        </div>
      </div>
      <div className="flex gap-4 flex-col">
        <div className="text-xl">My Products</div>
        <div className="border-2 rounded-md ">
          <Table bordered columns={myColumns} dataSource={myProducts} />
        </div>
      </div>
    </div>
  );
}

export default Retailer;
