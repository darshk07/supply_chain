import {
  useAccount,
  useAccountEffect,
  useBalance,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
} from "wagmi";
import { config } from "../wagmiConfig";
import Payable from "../components/Payable";
import Loading from "../components/Loading";
import React from 'react'

const Home = () => {
  const { address } = useAccount({});
  const { disconnect } = useDisconnect();
  const { data: ensName } = useEnsName({ address });
  const { data: ensAvatar } = useEnsAvatar({ name: ensName });
  const balance = useBalance({ address });
  const b = balance?.data;

  useAccountEffect({
    config: config,
    onConnect() {
      console.log("Connected");
    },
    onDisconnect() {
      console.log("Disconnected");
    },
  });

  return (
    <div>
      {ensAvatar && <img alt="ENS Avatar" src={ensAvatar} />}
      {address && <div>{ensName ? `${ensName} (${address})` : address}</div>}
      {balance && <div>Balance : {b?.formatted}</div>}
      <button onClick={() => disconnect()}>Disconnect</button>
      {/* <Test /> */}
      <Payable />
    </div>
  );
};

export default Home;
