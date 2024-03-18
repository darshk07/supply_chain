import { Button, Modal } from "antd";
import React, { useState } from "react";
import { contractConfig } from "../config/contractConfig";
import { useWriteContract } from "wagmi";
import { parseEther } from "viem";

type Props = {};

type Product = {
  name: string | null;
  price: number | null;
  quantity: number | null;
};

function Manufacturer({}: Props) {
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [newProduct, setNewProduct] = useState<Product | null>(null);
  const { writeContract, error } = useWriteContract();
  console.log(error);
  const handleAddProduct = () => {
    writeContract({
      ...contractConfig,
      functionName: "createProduct",
      args: [
        newProduct?.name,
        parseEther(
          ((newProduct?.price || 1) * (newProduct?.quantity || 1)).toString()
        ),
        newProduct?.quantity,
      ],
    });
    setNewProduct(null);
    setIsAdding(false);
  };

  const renderAddProductModal = () => {
    return (
      <div className="flex flex-col gap-8">
        <div className="text-2xl">Add Product</div>
        <div className="flex flex-col gap-4">
          <input
            onChange={(e) =>
              setNewProduct({ ...newProduct, name: e.target.value })
            }
            type="text"
            placeholder="Product Name"
            className="border-2 rounded-md p-2"
          />
          <input
            onChange={(e) =>
              setNewProduct({ ...newProduct, price: e.target.value })
            }
            type="number"
            placeholder="Product Price"
            className="border-2 rounded-md p-2"
          />
          <input
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
        <div className="h-[600px] border-2 rounded-md border-black p-6"> </div>
      </div>
    </div>
  );
}

export default Manufacturer;
