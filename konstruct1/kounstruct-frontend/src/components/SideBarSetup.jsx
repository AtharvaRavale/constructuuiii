import React from "react";
import { NavLink } from "react-router-dom";
import { useTheme } from "../ThemeContext";
import { useSidebar } from "./SidebarContext"; // <-- important

const ORANGE = "#ffbe63";
const BG_OFFWHITE = "#fcfaf7";
const SIDEBAR_WIDTH = 240; // px

function getAllRoles() {
  const userString = localStorage.getItem("USER_DATA");
  if (!userString || userString === "undefined") return [];
  try {
    const userData = JSON.parse(userString);
    let roles = [];
    if (typeof userData.role === "string") roles.push(userData.role);
    if (Array.isArray(userData.roles)) {
      userData.roles.forEach((r) => {
        if (typeof r === "string") roles.push(r);
        else if (typeof r === "object" && r && r.role) roles.push(r.role);
      });
    }
    if (Array.isArray(userData.accesses)) {
      userData.accesses.forEach((a) => {
        if (Array.isArray(a.roles)) {
          a.roles.forEach((r) => {
            if (typeof r === "string") roles.push(r);
            else if (typeof r === "object" && r && r.role) roles.push(r.role);
          });
        }
      });
    }
    if (userData.superadmin) roles.push("Super Admin");
    if (userData.is_manager) roles.push("Manager");
    if (userData.is_client === false) roles.push("Admin");
    return [...new Set(roles)];
  } catch {
    return [];
  }
}

function SideBarSetup() {
  const { theme } = useTheme();
  const { sidebarOpen } = useSidebar(); // <-- important!
  const allRoles = getAllRoles();
  const rolee = (localStorage.getItem("ROLE") || "").toLowerCase();

  const isInitializer = allRoles.some(
    (r) => r === "Intializer" || r === "Initializer"
  );
  if (isInitializer) return null;

  let navItems;
  if (rolee === "manager") {
    navItems = [
      { name: "User & Role", path: "/user" },
      { name: "Checklist", path: "/Checklist" },
      { name: "Category management", path: "/category-sidebar" },
      { name: "Purpose Management", path: "/create-purpose" },
    ];
  } else {
    navItems = [
      { name: "User Setup", path: "/user-setup" },
      { name: "Unit Setup", path: "/setup" },
      { name: "User & Role", path: "/user" },
      { name: "Checklist", path: "/Checklist" },
      { name: "Users Management", path: "/UsersManagement" },
      { name: "Purpose Management", path: "/create-purpose" },
    ];
  }

  // Palette
  const bgColor = theme === "dark" ? "#191922" : BG_OFFWHITE;
  const cardColor = theme === "dark" ? "#23232c" : "#fff";
  const borderColor = ORANGE;
  const textColor = theme === "dark" ? "#fff" : "#222";
  const iconColor = ORANGE;

  return (
    <div
      className="fixed top-0 left-0 z-[1000] h-screen shadow-lg flex flex-col transition-transform duration-300 ease-in-out"
      style={{
        width: `${SIDEBAR_WIDTH}px`,
        background: bgColor,
        borderRight: `3px solid ${borderColor}`,
        boxShadow: "0 4px 32px #0001",
        transform: sidebarOpen
          ? "translateX(0)"
          : `translateX(-${SIDEBAR_WIDTH}px)`,
        transition: "transform 0.35s cubic-bezier(.6,-0.17,.22,1.08)",
      }}
    >
      <div className="mb-6 text-center mt-4">
        <div
          className="text-lg font-bold tracking-wide"
          style={{
            color: iconColor,
            letterSpacing: "2px",
            transition: "color 0.3s",
          }}
        >
          Admin Panel
        </div>
      </div>
      <nav className="space-y-2 flex-1 px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className="block px-4 py-2 rounded-md text-sm font-semibold transition-colors duration-200"
            style={({ isActive }) =>
              isActive
                ? {
                    background: iconColor,
                    color: "#fff",
                  }
                : {
                    color: textColor,
                    background: cardColor,
                  }
            }
          >
            {item.name}
          </NavLink>
        ))}
      </nav>
      <div className="mt-8 text-xs text-center" style={{ color: iconColor }}>
        &copy; {new Date().getFullYear()} Your Company
      </div>
    </div>
  );
}

export default SideBarSetup;
