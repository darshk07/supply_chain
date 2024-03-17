import { useAccount } from "wagmi";
import "./App.css";
import { WalletOptions } from "./components/WalletOptions";
import Home from "./pages/home";

function ConnectWallet() {
  const { isConnected } = useAccount();
  if (isConnected) return <Home />;
  return <WalletOptions />;
}

function App() {
  return (
    <>
      <ConnectWallet />
    </>
  );
}

export default App;
