import "./App.css";
import React, { useState, useEffect } from "react";
import PRELOGIN from "./pages/PRELOGIN";
import HEADER from "./pages/HEADER";
import POSTLOGIN from "./pages/POSTLOGIN";
import SplashScreen from "./pages/SplashScreen";

export default function App({ children }) {
  const [pathname, setPathname] = useState(window.location.pathname);
  const isHome = pathname === "/";
  const [isLoading, setIsLoading] = useState(isHome);

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
    <html lang="en">
      {/*
       * <head /> will contain the components returned by the nearest parent
       * head.jsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
       */}
      <head />
      <body className="bg-fill bg-[url('/background.png')] bg-fixed bg-no-repeat">
        {isLoading && isHome ? (
          <SplashScreen finishLoading={() => setIsLoading(false)} />
        ) : (
          <>
            <HEADER />
            <PRELOGIN />
            {/* <POSTLOGIN /> */}
          </>
        )}
      </body>
    </html>
  );
}
