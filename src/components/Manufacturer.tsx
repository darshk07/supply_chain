import { Button, Input, Modal, Table, Tag } from "antd";
import React, { useEffect, useState } from "react";
import { contractConfig } from "../config/contractConfig";
import { useAccount, useWatchContractEvent, useWriteContract } from "wagmi";
import { formatEther, parseEther, parseGwei } from "viem";
import { readContract, watchContractEvent } from "@wagmi/core";
import { config } from "../wagmiConfig";
import dayjs from "dayjs";
import { GrEbay } from "react-icons/gr";
import { convertUnixTimestampToDateTime } from "./SupplyHistory";

type Props = {};

type Product = {
  name: string | null;
  price: number | null;
  quantity: number | null;
};

function Manufacturer({}: Props) {
  const { address } = useAccount();
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [newProduct, setNewProduct] = useState<Product | null>(null);
  const { writeContract, error } = useWriteContract();
  const [myProducts, setMyProducts] = useState<any[]>([]);

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async () => {
    const pro: any[] = await readContract(config, {
      ...contractConfig,
      functionName: "getStatusOfAllProducts",
      account: address,
      args: [address, "Manufacturer"],
    });
    setMyProducts(pro);
  };

  useWatchContractEvent({
    ...contractConfig,
    eventName: "Paid",
    onLogs(logs: any) {
      console.log("New logs!", logs);
      getProducts();
    },
  });
  useWatchContractEvent({
    ...contractConfig,
    eventName: "Received",
    onLogs(logs: any) {
      console.log("New logs!", logs);
      getProducts();
    },
  });

  useWatchContractEvent({
    ...contractConfig,
    eventName: "Shipped",
    onLogs(logs: any) {
      console.log("New logs!", logs);
      getProducts();
    },
  });

  useWatchContractEvent({
    ...contractConfig,
    eventName: "OnSale",
    onError(error) {
      console.log("Error", error);
    },
    onLogs(logs: any) {
      console.log("New logs!", logs);
      getProducts();
    },
  });

  const handleAddProduct = () => {
    writeContract(
      {
        ...contractConfig,
        functionName: "createProduct",
        args: [
          newProduct?.name,
          parseEther(
            ((newProduct?.price || 1) * (newProduct?.quantity || 1)).toString()
          ),
          newProduct?.quantity,
        ],
      }
      // {
      //   onSuccess: async () => {
      //     console.log("added");
      //     await getProducts();
      //   },
      // }
    );
    setNewProduct(null);
    setIsAdding(false);
  };

  const renderAddProductModal = () => {
    return (
      <div className="flex flex-col gap-8">
        <div className="text-2xl">Add Product</div>
        <div className="flex flex-col gap-4">
          <Input
            onChange={(e) =>
              setNewProduct({ ...newProduct, name: e.target.value })
            }
            type="text"
            placeholder="Product Name"
            className="border-2 rounded-md p-2"
          />
          <Input
            onChange={(e) =>
              setNewProduct({ ...newProduct, price: e.target.value })
            }
            suffix="ETH"
            type="number"
            placeholder="Product Price"
            className="border-2 rounded-md p-2"
          />
          <Input
            onChange={(e) =>
              setNewProduct({ ...newProduct, quantity: e.target.value })
            }
            type="number"
            placeholder="Product Quantity"
            className="border-2 rounded-md p-2"
          />
        </div>
      </div>
    );
  };

  const handleProductShip = async (row) => {
    writeContract(
      {
        ...contractConfig,
        functionName: "shippedFromManufacturer",
        args: [row.productId],
      },
      {
        onSuccess: async () => {
          console.log("Shipped");
          await getProducts();
        },
      }
    );
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
      render: (text) => {
        if (text === "") return <span>Test5</span>;
        return <span>{text} </span>;
      },
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
      render: (text: string, row) => {
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
      title: "Time",
      dataIndex: "time",
      key: "time",
      render: (text: BigInt, row) => {
        return <div>{convertUnixTimestampToDateTime(Number(text))}</div>;
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, row) => {
        if (row.status === "Paid by Distributor to Manufacturer")
          return (
            <Button
              onClick={() => {
                handleProductShip(row);
              }}
              type="dashed"
            >
              Ship
            </Button>
          );
      },
    },
  ];

  return (
    <div className="flex-1 flex justify-start flex-col px-16 py-8 gap-8 ">
      <Modal
        centered
        cancelButtonProps={{ hidden: true }}
        okButtonProps={{ type: "text" }}
        onOk={handleAddProduct}
        okText="Add Product"
        onCancel={() => setIsAdding(false)}
        open={isAdding}
      >
        {renderAddProductModal()}
      </Modal>
      <div className="flex gap-2 items-center justify-between">
        <div className="flex flex-col items-start">
          <div className="text-4xl">Manufacturer</div>
          <div className="text-center">
            You can add products and ship them to distributors.
          </div>
        </div>
        <Button size="large" type="text" onClick={() => setIsAdding(true)}>
          Add Product
        </Button>
      </div>
      <div className="flex gap-4 flex-col">
        <div className="text-xl">Your Products</div>
        <div className="border-2 rounded-md">
          <Table bordered columns={columns} dataSource={myProducts} />
        </div>
      </div>
    </div>
  );
}

export default Manufacturer;
