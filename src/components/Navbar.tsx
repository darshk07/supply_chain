import React, { useEffect } from "react";
import { FaUser } from "react-icons/fa";
import { MdAccountBalanceWallet } from "react-icons/md";
import { useAccount, useBalance } from "wagmi";
import { disconnect } from "@wagmi/core";
import { useConnect, useAccountEffect } from "wagmi";
import { config } from "../wagmiConfig";
import Loading from "./Loading";
import { useNavigate } from "react-router-dom";
import { FaEthereum } from "react-icons/fa";
import { FaCopy } from "react-icons/fa";
import { Alert } from "antd";

const Navbar = () => {
  const { address, isConnected: isc } = useAccount();
  const [isConnected, setIsConnected] = React.useState<Boolean>(isc);
  const { connectors, connect } = useConnect();
  const [isLoading, setIsLoading] = React.useState<Boolean>();
  const wallet = connectors[0];
  const balance = parseFloat(useBalance({ address })?.data?.formatted).toFixed(
    5
  );

  const navigate = useNavigate();
  const handleLogout = async () => {
    await disconnect(config);
  };

  const handleLogin = async () => {
    setIsLoading(true);
    await connect({ connector: wallet });
  };

  useAccountEffect({
    onConnect() {
      setIsLoading(false);
      setIsConnected(true);
    },
    onDisconnect() {
      console.log("Disconnected");
      setIsConnected(false);
    },
  });

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

  return (
    <div className="bg-secondary flex justify-between items-center h-20 w-full mx-auto px-4 text-white border-b border-black">
      {/* {isLoading ? <Loading /> : null} */}
      <h1
        onClick={() => navigate("/")}
        className="p-5 text-3xl ml-7 font-semibold text-primary cursor-pointer"
      >
        d-ERP
      </h1>
      {isConnected ? (
        <div className="ml-auto flex justify-center items-center text-lg pr-0">
          <div className="mr-2">
            <MdAccountBalanceWallet size={26} color="#ffe900" />
          </div>
          <div className="mr-2">{balance}</div>
          <div className="mr-2">
            <FaEthereum />
          </div>
        </div>
      ) : null}{" "}
      {isConnected ? (
        <div
          onClick={() => {
            window.navigator.clipboard.writeText(address?.toString() || " ");
            <Alert message="Copied To Clipboard" />;
          }}
          className="flex ml-8  justify-center items-center text-lg pr-0 rounded-2xl px-2 py-2 bg-[#cccccc44]"
        >
          <div className="mr-2">
            {/* <MdAccountBalanceWallet size={26} color="#ffe900" /> */}
          </div>
          <div className="mr-2 text-sm">{shortenAddress(address!)}</div>
          <div className="mr-2">
            <FaCopy />
            {/* <FaEthereum /> */}
          </div>
        </div>
      ) : null}
      {isConnected ? (
        <div
          onClick={() => {
            navigate("/history");
          }}
          className="p-3 flex items-center gap-4 hover:bg-primary rounded-xl cursor-pointer duration-300 hover:text-black m-12"
        >
          Get Supply History
        </div>
      ) : null}
      <div
        onClick={isConnected ? handleLogout : handleLogin}
        className="p-3 flex items-center gap-4 hover:bg-primary rounded-xl cursor-pointer duration-300 hover:text-black m-12"
      >
        <FaUser />
        {isConnected ? (
          <span>Disconnect</span>
        ) : (
          <span>Connect to Metamask</span>
        )}
      </div>
    </div>
  );
};

export default Navbar;
