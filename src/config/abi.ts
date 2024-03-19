import { Abi } from "viem";

export const abi: Abi = [
  { inputs: [], stateMutability: "nonpayable", type: "constructor" },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "productId",
        type: "uint256",
      },
      { indexed: true, internalType: "address", name: "addr", type: "address" },
      { indexed: false, internalType: "string", name: "role", type: "string" },
    ],
    name: "OnSale",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "productId",
        type: "uint256",
      },
      { indexed: true, internalType: "address", name: "addr", type: "address" },
      { indexed: false, internalType: "string", name: "role", type: "string" },
    ],
    name: "Paid",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "productId",
        type: "uint256",
      },
      { indexed: true, internalType: "address", name: "addr", type: "address" },
      { indexed: false, internalType: "string", name: "role", type: "string" },
    ],
    name: "Received",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "addr", type: "address" },
      { indexed: true, internalType: "string", name: "role", type: "string" },
    ],
    name: "RoleAssigned",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "productId",
        type: "uint256",
      },
      { indexed: true, internalType: "address", name: "addr", type: "address" },
      { indexed: false, internalType: "string", name: "role", type: "string" },
    ],
    name: "Shipped",
    type: "event",
  },
  {
    inputs: [
      { internalType: "uint256", name: "productId", type: "uint256" },
      {
        internalType: "address payable",
        name: "_manufacturer",
        type: "address",
      },
    ],
    name: "PayByDistributor",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "productId", type: "uint256" },
      {
        internalType: "address payable",
        name: "_distributor",
        type: "address",
      },
    ],
    name: "PayByRetailer",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "productId", type: "uint256" }],
    name: "ReceivedToDistributor",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "productId", type: "uint256" }],
    name: "ReceivedToRetailer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "string", name: "_role", type: "string" },
      { internalType: "address", name: "_addr", type: "address" },
    ],
    name: "addRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "allProductsOfManufacturer",
    outputs: [
      {
        components: [
          { internalType: "address", name: "manufacturer", type: "address" },
          { internalType: "address", name: "distributor", type: "address" },
          { internalType: "address", name: "retailer", type: "address" },
          { internalType: "string", name: "productName", type: "string" },
          { internalType: "uint256", name: "productAmount", type: "uint256" },
          { internalType: "uint256", name: "productId", type: "uint256" },
          { internalType: "string", name: "status", type: "string" },
          { internalType: "uint256", name: "money", type: "uint256" },
          { internalType: "uint256", name: "time", type: "uint256" },
        ],
        internalType: "struct dERP.Product[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "string", name: "_name", type: "string" },
      { internalType: "uint256", name: "_money", type: "uint256" },
      { internalType: "uint256", name: "_productAmount", type: "uint256" },
    ],
    name: "createProduct",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "productId", type: "uint256" }],
    name: "getProductData",
    outputs: [
      {
        components: [
          { internalType: "address", name: "manufacturer", type: "address" },
          { internalType: "address", name: "distributor", type: "address" },
          { internalType: "address", name: "retailer", type: "address" },
          { internalType: "string", name: "productName", type: "string" },
          { internalType: "uint256", name: "productAmount", type: "uint256" },
          { internalType: "uint256", name: "productId", type: "uint256" },
          { internalType: "string", name: "status", type: "string" },
          { internalType: "uint256", name: "money", type: "uint256" },
          { internalType: "uint256", name: "time", type: "uint256" },
        ],
        internalType: "struct dERP.Product",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getRole",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_addr", type: "address" },
      { internalType: "string", name: "_role", type: "string" },
    ],
    name: "getStatusOfAllProducts",
    outputs: [
      {
        components: [
          { internalType: "address", name: "manufacturer", type: "address" },
          { internalType: "address", name: "distributor", type: "address" },
          { internalType: "address", name: "retailer", type: "address" },
          { internalType: "string", name: "productName", type: "string" },
          { internalType: "uint256", name: "productAmount", type: "uint256" },
          { internalType: "uint256", name: "productId", type: "uint256" },
          { internalType: "string", name: "status", type: "string" },
          { internalType: "uint256", name: "money", type: "uint256" },
          { internalType: "uint256", name: "time", type: "uint256" },
        ],
        internalType: "struct dERP.Product[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "productId", type: "uint256" }],
    name: "getSupplyHistory",
    outputs: [
      {
        components: [
          { internalType: "address", name: "manufacturer", type: "address" },
          { internalType: "address", name: "distributor", type: "address" },
          { internalType: "address", name: "retailer", type: "address" },
          { internalType: "string", name: "productName", type: "string" },
          { internalType: "uint256", name: "productAmount", type: "uint256" },
          { internalType: "uint256", name: "productId", type: "uint256" },
          { internalType: "string", name: "status", type: "string" },
          { internalType: "uint256", name: "money", type: "uint256" },
          { internalType: "uint256", name: "time", type: "uint256" },
        ],
        internalType: "struct dERP.Product[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "productId", type: "uint256" },
      { internalType: "uint256", name: "_money", type: "uint256" },
    ],
    name: "onSaleByDistributor",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "productCount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "products",
    outputs: [
      { internalType: "address", name: "manufacturer", type: "address" },
      { internalType: "address", name: "distributor", type: "address" },
      { internalType: "address", name: "retailer", type: "address" },
      { internalType: "string", name: "productName", type: "string" },
      { internalType: "uint256", name: "productAmount", type: "uint256" },
      { internalType: "uint256", name: "productId", type: "uint256" },
      { internalType: "string", name: "status", type: "string" },
      { internalType: "uint256", name: "money", type: "uint256" },
      { internalType: "uint256", name: "time", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_addr", type: "address" }],
    name: "removeRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "productId", type: "uint256" }],
    name: "shippedFromDistributor",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "productId", type: "uint256" }],
    name: "shippedFromManufacturer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "", type: "uint256" },
      { internalType: "uint256", name: "", type: "uint256" },
    ],
    name: "supplyHistory",
    outputs: [
      { internalType: "address", name: "manufacturer", type: "address" },
      { internalType: "address", name: "distributor", type: "address" },
      { internalType: "address", name: "retailer", type: "address" },
      { internalType: "string", name: "productName", type: "string" },
      { internalType: "uint256", name: "productAmount", type: "uint256" },
      { internalType: "uint256", name: "productId", type: "uint256" },
      { internalType: "string", name: "status", type: "string" },
      { internalType: "uint256", name: "money", type: "uint256" },
      { internalType: "uint256", name: "time", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
];
