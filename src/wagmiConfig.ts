import { injected } from "@wagmi/core";
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
    [optimismSepolia.id]: http(
      "https://opt-sepolia.g.alchemy.com/v2/jP854jxPIRUML99MGVRKNdfr-6ub1FlM"
    ),
  },
});
