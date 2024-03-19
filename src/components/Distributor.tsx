import { Button, Modal, Table, Tag } from "antd";
import React, { useEffect, useState } from "react";
import { contractConfig } from "../config/contractConfig";
import { useAccount, useWriteContract } from "wagmi";
import { readContract, watchContractEvent } from "@wagmi/core";
import { config } from "../wagmiConfig";
import { formatEther, parseEther } from "viem";

type Props = {};

type Product = {
  name: string | null;
  price: number | null;
  quantity: number | null;
};

function Distributor({}: Props) {
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [newProduct, setNewProduct] = useState<Product | null>(null);
  const { writeContract, error } = useWriteContract();
  const [saleProducts, setSaleProducts] = useState<any[]>([]);
  const [myProducts, setMyProducts] = useState<any[]>([]);
  const { address } = useAccount();
  console.log(error);
  useEffect(() => {
    getSaleProducts();
    getMyProducts();
  }, []);

  const getSaleProducts = async () => {
    const pro: any[] = await readContract(config, {
      ...contractConfig,
      functionName: "allProductsOfManufacturer",
      account: address,
    });
    console.log(pro);
    setSaleProducts(pro);
  };

  const getMyProducts = async () => {
    const pro: any[] = await readContract(config, {
      ...contractConfig,
      functionName: "getStatusOfAllProducts",
      account: address,
      args: [address, "Distributor"],
    });
    console.log(pro);
    setMyProducts(pro);
  };

  watchContractEvent(config, {
    ...contractConfig,
    eventName: "OnSale",
    onLogs(logs: any) {
      console.log("New logs!", logs);
      if (logs[0]?.args?.addr === address) {
        getSaleProducts();
      }
    },
  });
  // const renderAddProductModal = () => {
  //   return (
  //     <div className="flex flex-col gap-8">
  //       <div className="text-2xl">Add Product</div>
  //       <div className="flex flex-col gap-4">
  //         <input
  //           onChange={(e) =>
  //             setNewProduct({ ...newProduct, name: e.target.value })
  //           }
  //           type="text"
  //           placeholder="Product Name"
  //           className="border-2 rounded-md p-2"
  //         />
  //         <input
  //           onChange={(e) =>
  //             setNewProduct({ ...newProduct, price: e.target.value })
  //           }
  //           type="number"
  //           placeholder="Product Price"
  //           className="border-2 rounded-md p-2"
  //         />
  //         <input
  //           onChange={(e) =>
  //             setNewProduct({ ...newProduct, quantity: e.target.value })
  //           }
  //           type="number"
  //           placeholder="Product Quantity"
  //           className="border-2 rounded-md p-2"
  //         />
  //       </div>
  //     </div>
  //   );
  // };

  const handlePay = (row) => {
    console.log(row);
    writeContract({
      ...contractConfig,
      functionName: "PayByDistributor",
      args: [row.productId, row.manufacturer],
      value: row.money.toString(),
    });
  };
  const saleColumns = [
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
      render: (text: string) => <Tag className="">{text}</Tag>,
    },
    {
      title: "Time",
      dataIndex: "time",
      key: "time",
      render: (text: BigInt) => {
        let newDate = new Date(0);
        newDate.setUTCSeconds(Number(text));
        return <div>{newDate.toISOString()}</div>;
      },
    },
    {
      title: "Action",
      key: "action",
      render: (text, row) => (
        <div>
          <Button
            type="text"
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

  const columns = [
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
      render: (text: string) => <Tag className="">{text}</Tag>,
    },
    {
      title: "Time",
      dataIndex: "time",
      key: "time",
      render: (text: BigInt) => {
        let newDate = new Date(0);
        newDate.setUTCSeconds(Number(text));
        return <div>{newDate.toISOString()}</div>;
      },
    },
    // {
    //   title: "Action",
    //   key: "action",
    //   render: (text, row) => (
    //     <div>
    //       <Button
    //         type="text"
    //         onClick={() => {
    //           handlePay(row);
    //         }}
    //       >
    //         Pay
    //       </Button>
    //     </div>
    //   ),
    // },
  ];

  return (
    <div className="flex-1 flex justify-start flex-col px-16 py-8 gap-8 ">
      {/* <Modal
        centered
        cancelButtonProps={{ hidden: true }}
        okButtonProps={{ type: "text" }}
        onOk={handleAddProduct}
        okText="Add Product"
        onCancel={() => setIsAdding(false)}
        open={isAdding}
      > */}
      {/* {renderAddProductModal()} */}
      {/* </Modal> */}
      <div className="flex gap-2 items-center justify-between">
        <div className="flex flex-col items-start">
          <div className="text-4xl">Distributor</div>
          <div className="text-center">
            You can add products and ship them to distributors.
          </div>
        </div>
      </div>
      <div className="flex gap-4 flex-col">
        <div className="text-xl">Products on Sale</div>
        <div className="h-[600px] border-2 rounded-md border-black p-6">
          <Table columns={saleColumns} dataSource={saleProducts} />
        </div>
      </div>
      <div className="flex gap-4 flex-col">
        <div className="text-xl">2nd category</div>
        <div className="h-[600px] border-2 rounded-md border-black p-6">
          <Table columns={columns} dataSource={myProducts} />
        </div>
      </div>
    </div>
  );
}

export default Distributor;
