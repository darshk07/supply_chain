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

  return (
    <div className="bg-secondary flex justify-between items-center h-20 w-full mx-auto px-4 text-white">
      {/* {isLoading ? <Loading /> : null} */}
      <h1
        onClick={() => navigate("/")}
        className="p-5 text-3xl font-semibold text-primary cursor-pointer"
      >
        d-ERP
      </h1>
      <div
        onClick={() => {
          navigate("/history");
        }}
        className="ml-auto mr-12"
      >
        Get Supply History
      </div>
      {isConnected ? (
        <div className="flex justify-center items-center text-lg pr-0">
          <div className="mr-2">
            <MdAccountBalanceWallet size={26} color="#ffe900" />
          </div>
          <div className="mr-2">{balance}</div>
          <div className="mr-2">
            <FaEthereum />
          </div>
        </div>
      ) : null}

      <div
        onClick={isConnected ? handleLogout : handleLogin}
        className="p-4 flex items-center gap-4 hover:bg-[#00df9a] rounded-xl cursor-pointer duration-300 hover:text-black m-20"
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
