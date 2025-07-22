import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { IoSettingsOutline } from "react-icons/io5";
import { FaRegCircleUser, FaMoon, FaSun } from "react-icons/fa6";
import Notification from "./Notification";
import Profile from "./Profile";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedProject } from "../store/userSlice";
import { useTheme } from "../ThemeContext";
import { useSidebar } from "./SidebarContext";

const ORANGE = "#ffbe63";
const BG_OFFWHITE = "#fcfaf7";
const SIDEBAR_WIDTH = 240;

function Header() {
  const [isNotification, setIsNotification] = useState(false);
  const [isProfile, setIsProfile] = useState(false);

  const dispatch = useDispatch();
  const projects = useSelector((state) => state.user.projects);
  const selectedProject = useSelector((state) => state.user.selectedProject.id);
  const { theme, toggleTheme } = useTheme();
  const { sidebarOpen, setSidebarOpen } = useSidebar();

  // Strict palette
  const bgColor = theme === "dark" ? "#191922" : BG_OFFWHITE;
  const cardColor = theme === "dark" ? "#23232c" : "#fff";
  const borderColor = ORANGE;
  const textColor = theme === "dark" ? "#fff" : "#222";
  const iconColor = ORANGE;

  const rolee = localStorage.getItem("ROLE");
  const allowuser =
    rolee === "Manager" || rolee === "Super Admin" || rolee === "Admin";
  const navigate = useNavigate();

  const handleProject = (e) => {
    dispatch(setSelectedProject(e.target.value));
  };

  const handleSettingsClick = () => {
    if (rolee && rolee.toLowerCase() === "super admin") {
      navigate("/user-management-setup");
    } else if (rolee === "Manager") {
      navigate("/user");
    } else {
      navigate("/setup");
    }
  };

  return (
    <>
      <nav
        className="fixed top-0 right-0 z-[200] w-full flex items-center justify-between px-4 py-2 border-b"
        style={{
          left: sidebarOpen ? SIDEBAR_WIDTH : 0,
          background: cardColor,
          borderBottom: `2px solid ${borderColor}`,
          color: textColor,
          height: 64,
          minHeight: 64,
          transition: "left 0.35s cubic-bezier(.6,-0.17,.22,1.08), background 0.3s",
        }}
      >
        {/* Hamburger */}
        <button
          onClick={() => setSidebarOpen((open) => !open)}
          className="mr-4 md:mr-8 rounded-lg shadow-lg flex items-center justify-center"
          style={{
            background: "#fff",
            border: `2px solid ${borderColor}`,
            width: 42,
            height: 42,
            color: iconColor,
            transition: "background 0.2s",
            outline: "none",
            marginRight: 28,
          }}
          aria-label="Toggle sidebar"
        >
          <svg width="26" height="26" viewBox="0 0 22 22" fill="none">
            <rect y="3" width="22" height="3" rx="1.5" fill={iconColor} />
            <rect y="9" width="22" height="3" rx="1.5" fill={iconColor} />
            <rect y="15" width="22" height="3" rx="1.5" fill={iconColor} />
          </svg>
        </button>

        {/* Logo & Home */}
        <div className="flex items-center space-x-8">
          <span className="text-lg flex items-center space-x-2 font-bold">
            <h2 style={{ color: iconColor }}>🔗 Konstruct</h2>
          </span>
          <NavLink
            to="/config"
            className={({ isActive }) =>
              `font-medium ${isActive ? "" : ""}`
            }
            style={({ isActive }) => ({
              color: isActive ? iconColor : textColor,
              textDecoration: isActive ? "underline" : "none",
            })}
          >
            Home
          </NavLink>
        </div>

        {/* Nav & actions */}
        <ul className="hidden md:flex justify-end items-center gap-5 py-2 uppercase text-sm">
          
          <NavLink
            to="/analytics"
            className={({ isActive }) =>
              `font-medium flex items-center gap-1`
            }
            style={({ isActive }) => ({
              color: isActive ? iconColor : textColor,
              textDecoration: isActive ? "underline" : "none",
            })}
            title="Analytics Dashboard"
          >
            📊 Analytics
          </NavLink>
          {allowuser && (
            <button
              onClick={handleSettingsClick}
              style={{
                color: iconColor,
                background: "transparent",
                border: "none",
                fontSize: 20,
              }}
              title="Settings"
            >
              <IoSettingsOutline />
            </button>
          )}
          <button
            onClick={() => setIsProfile(true)}
            style={{
              color: iconColor,
              background: "transparent",
              border: "none",
              fontSize: 20,
            }}
            title="Profile"
          >
            <FaRegCircleUser />
          </button>
          <button
            onClick={toggleTheme}
            className="rounded-full p-2 transition-colors"
            style={{
              background: theme === "dark" ? bgColor : cardColor,
              border: `1px solid ${borderColor}`,
              color: iconColor,
            }}
            title="Toggle Theme"
          >
            {theme === "dark" ? (
              <FaSun style={{ color: ORANGE }} />
            ) : (
              <FaMoon style={{ color: iconColor }} />
            )}
          </button>
        </ul>
      </nav>
      {/* Mobile spacing (avoid content under header) */}
      <div className="block md:hidden" style={{ height: 64 }} />
      {/* Profile and Notification drawers */}
      {isProfile && <Profile onClose={() => setIsProfile(false)} />}
      {isNotification && (
        <Notification onClose={() => setIsNotification(false)} />
      )}
    </>
  );
}

export default Header;
