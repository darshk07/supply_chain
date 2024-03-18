import { injected } from "@wagmi/core";
import { Chain, Client, Transport } from "viem";
import { http, createConfig } from "wagmi";
import { mainnet, optimismSepolia } from "wagmi/chains";
// import { metaMask, walletConnect } from "wagmi/connectors";

export const config = createConfig({
  chains: [mainnet, optimismSepolia],
  connectors: [
    injected({}),
    // walletConnect({}),
  ],
  transports: {
    [mainnet.id]: http(),
    [optimismSepolia.id]: http(),
  },
});
