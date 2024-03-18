import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { WagmiProvider } from "wagmi";
import { config } from "./wagmiConfig.js";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import RootLayout from "./pages/RootLayout";
import Payable from "./components/Payable";
import Home from "./pages/Home";

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
        element: <Payable />,
      },
      {
        path: "/home",
        element: <Home />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {/* <ReactQueryDevtools initialIsOpen={true} /> */}
        <RouterProvider router={router} />
        {/* <App /> */}
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
);
