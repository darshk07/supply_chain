import ReactDOM from "react-dom/client";
import "./index.css";
import { WagmiProvider } from "wagmi";
import { config } from "./wagmiConfig";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import RootLayout from "./pages/RootLayout";
import Home from "./pages/Home";
import SupplyHistory from "./components/SupplyHistory";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {},
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/history",
        element: <SupplyHistory />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <WagmiProvider config={config}>
    <QueryClientProvider client={queryClient}>
      {/* <ReactQueryDevtools initialIsOpen={true} /> */}
      <RouterProvider router={router} />
      {/* <App /> */}
    </QueryClientProvider>
  </WagmiProvider>
);
