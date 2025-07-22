// src/components/Layout.jsx
import React from "react";
import Header from "./Header";
import SideBarSetup from "./SideBarSetup";
import { useSidebar } from "./SidebarContext";

const SIDEBAR_WIDTH = 240;

function Layout({ children }) {
  const { sidebarOpen } = useSidebar();

  return (
    <>
      <Header />
      <SideBarSetup />
      <div
        style={{
          marginLeft: sidebarOpen ? SIDEBAR_WIDTH : 0,
          marginTop: 64,
          transition: "margin-left 0.35s cubic-bezier(.6,-0.17,.22,1.08)",
          minHeight: `calc(100vh - 64px)`,
        }}
      >
        {children}
      </div>
    </>
  );
}

export default Layout;
