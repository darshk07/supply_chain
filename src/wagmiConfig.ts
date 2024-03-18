import { http, createConfig } from "wagmi";
import { mainnet, optimismSepolia } from "wagmi/chains";

export const config = createConfig({
  chains: [mainnet, optimismSepolia],
  connectors: [
    // walletConnect({ projectId: import.meta.env.VITE_WC_PROJECT_ID }),
  ],
  transports: {
    [mainnet.id]: http(),
    [optimismSepolia.id]: http(),
  },
});
