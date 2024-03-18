import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router";
import PRELOGIN from "./Base";
import { useAccount, useAccountEffect } from "wagmi";
import SplashScreen from "./SplashScreen";
import { useNavigate } from "react-router-dom";

const RootLayout = () => {
  const [pathname, setPathname] = useState(window.location.pathname);
  const isHome = pathname === "/";
  const [isLoading, setIsLoading] = useState(isHome);
  const navigate = useNavigate();
  const [isConnected, setIsConnected] = useState(false);

  useAccountEffect({
    onConnect() {
      setIsConnected(true);
    },
    onDisconnect() {
      setIsConnected(false);
      console.log("Disconnected");
    },
  });

  useEffect(() => {
    console.log("isConnected", isConnected);
    // if (isConnected) {
    //   console.log("Connected");
    //   navigate("/home");
    // }
    if (!isConnected) {
      console.log("Not connected");
      navigate("/");
    }
  }, [isConnected]);

  // Update pathname on navigation
  useEffect(() => {
    const updatePathname = () => setPathname(window.location.pathname);
    window.addEventListener("popstate", updatePathname);

    return () => window.removeEventListener("popstate", updatePathname);
  }, []);

  useEffect(() => {
    if (isLoading) {
      return; // Prevent unnecessary updates when loading
    }
  }, [isLoading]);

  return (
    <div className="flex flex-col relative min-h-screen">
      {isLoading && isHome ? (
        <SplashScreen finishLoading={() => setIsLoading(false)} />
      ) : (
        <>
          <Navbar />
          {isConnected ? <Outlet /> : <PRELOGIN />}
        </>
      )}
    </div>
  );
};

export default RootLayout;
