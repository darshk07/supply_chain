import { Button, Input, Modal, Table, Tag } from "antd";
import { useEffect, useState } from "react";
import { contractConfig } from "../config/contractConfig";
import { useAccount, useWatchContractEvent, useWriteContract } from "wagmi";
import { readContract } from "@wagmi/core";
import { config } from "../wagmiConfig";
import { formatEther, parseEther } from "viem";
import { convertUnixTimestampToDateTime } from "./SupplyHistory";

type Props = {};

// type Product = {
//   name: string | null;
//   price: number | null;
//   quantity: number | null;
// };

function Distributor({}: Props) {
  const { writeContract, isPending } = useWriteContract();
  const [saleProducts, setSaleProducts] = useState<any[]>([]);
  const [myProducts, setMyProducts] = useState<any[]>([]);
  const { address } = useAccount();
  // const [sellProductPrice, setSellProductPrice] = useState<number>("");

  useEffect(() => {
    getSaleProducts();
    getMyProducts();
  }, []);

  const getSaleProducts = async () => {
    const pro: any = await readContract(config, {
      ...contractConfig,
      functionName: "allProductsOfManufacturer",
      account: address,
    });
    setSaleProducts(pro);
  };

  const handleReceive = async (row: any) => {
    writeContract(
      {
        ...contractConfig,
        functionName: "ReceivedToDistributor",
        args: [row.productId],
      },
      {
        onSuccess: async () => {
          await getMyProducts();
        },
        onError: (er) => {
          console.log(er);
        },
      }
    );
  };

  const getMyProducts = async () => {
    const pro: any = await readContract(config, {
      ...contractConfig,
      functionName: "getStatusOfAllProducts",
      account: address,
      args: [address, "Distributor"],
    });
    setMyProducts(pro);
  };

  useWatchContractEvent({
    ...contractConfig,
    eventName: "OnSale",
    onLogs(logs: any) {
      console.log("New logs!", logs);
      getSaleProducts();
      getMyProducts();
    },
  });

  useWatchContractEvent({
    ...contractConfig,
    eventName: "Shipped",
    onLogs(logs: any) {
      console.log("New logs!", logs);
      getMyProducts();
    },
  });
  useWatchContractEvent({
    ...contractConfig,
    eventName: "Received",
    onLogs(logs: any) {
      console.log("New logs!", logs);
      getMyProducts();
    },
  });

  useWatchContractEvent({
    ...contractConfig,
    eventName: "Paid",
    onLogs(logs: any) {
      console.log("New logs!", logs);
      getSaleProducts();
      getMyProducts();
    },
  });

  const handlePay = (row: any) => {
    writeContract(
      {
        ...contractConfig,
        functionName: "PayByDistributor",
        args: [row.productId, row.manufacturer],
        value: row.money.toString(),
      },
      {
        onSuccess: async () => {
          console.log("Successfully paid");
          await getMyProducts();
        },
      }
    );
  };
  const saleColumns = [
    {
      title: "Product Id",
      dataIndex: "productId",
      key: "productId",
      sorter: (a: any, b: any) => Number(a.productId) - Number(b.productId),
      render: (text: any) => <div>{text.toString()}</div>,
    },
    {
      title: "Product Name",
      dataIndex: "productName",
      key: "name",
      render: (text: string) => {
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
      title: "Time",
      dataIndex: "time",
      key: "time",
      sorter: (a: any, b: any) => Number(a.time) - Number(b.time),
      render: (text: BigInt) => {
        return <div>{convertUnixTimestampToDateTime(Number(text))}</div>;
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_: string, row: any) => (
        <div>
          <Button
            type="dashed"
            onClick={() => {
              handlePay(row);
            }}
          >
            Pay
          </Button>
        </div>
      ),
    },
  ];

  const modalContent = (row: any) => {
    let price = 0;
    console.log(price);
    return (
      <div className="flex flex-col gap-8">
        <div>
          <h3 className="font-semibold">
            Enter price for which you want to sell?
          </h3>
          <div>
            Bought Price : {formatEther(row.money.toString()).toString()} ETH
          </div>
          <Input
            size="large"
            allowClear
            placeholder="Enter price"
            type="number"
            suffix="ETH"
            onChange={(e: any) => (price = e.target.value)}
          />
        </div>
        <Button onClick={() => handleSell(row, price)}>Sell</Button>
      </div>
    );
  };

  const handleShip = (row: any) => {
    writeContract(
      {
        ...contractConfig,
        functionName: "shippedFromDistributor",
        args: [row.productId],
      },
      {
        onSuccess: async () => {
          await getMyProducts();
        },
        onError: (er) => {
          console.log(er);
        },
      }
    );
  };

  const handleSell = (row: any, price: any) => {
    console.log("Sell", price);
    writeContract(
      {
        ...contractConfig,
        functionName: "onSaleByDistributor",
        args: [row.productId, parseEther(price)],
      },
      {
        onSuccess: () => {
          getMyProducts();
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
      render: (text: any) => {
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
      title: "Time",
      dataIndex: "time",
      key: "time",
      render: (text: BigInt) => {
        return <div>{convertUnixTimestampToDateTime(Number(text))}</div>;
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_: string, row: any) => {
        if (row.status === "Shipped from Manufacturer")
          return (
            <div>
              <Button
                type="dashed"
                onClick={() => {
                  handleReceive(row);
                }}
              >
                Mark as Received
              </Button>
            </div>
          );

        if (row.status === "Received To Distributor")
          return (
            <div>
              <Button
                type="dashed"
                onClick={() => {
                  Modal.confirm({
                    maskClosable: true,
                    title: "Do you want to sell this product?",
                    content: modalContent(row),
                    centered: true,
                    cancelButtonProps: { style: { display: "none" } },
                    okButtonProps: { style: { display: "none" } },
                  });
                }}
              >
                Sell
              </Button>
            </div>
          );
        if (row.status === "Paid by Retailer to Distributor") {
          return <Button onClick={() => handleShip(row)}>Ship</Button>;
        }
      },
    },
  ];

  return (
    <div className="flex-1 flex justify-start flex-col px-16 py-8 gap-6 ">
      <div className="flex gap-2 items-center justify-between">
        <div className="flex flex-col items-start">
          <div className="text-4xl">Distributor</div>
          <div className="text-center">
            You can buy products from manufacturers and sell it to your
            retailers.
          </div>
        </div>
      </div>
      <div className="flex gap-4 flex-col">
        <div className="text-xl">Products on Sale</div>
        <div className="rounded-md">
          <Table
            bordered
            loading={isPending}
            columns={saleColumns}
            pagination={false}
            dataSource={saleProducts}
          />
        </div>
      </div>
      <div className="flex gap-4 flex-col">
        <div className="text-xl">Your Products</div>
        <div className="rounded-md">
          <Table
            bordered
            loading={isPending}
            columns={columns}
            pagination={false}
            dataSource={myProducts}
          />
        </div>
      </div>
    </div>
  );
}

export default Distributor;
