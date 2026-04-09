import { useEffect, useMemo, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";

import TravelExploreRoundedIcon from "@mui/icons-material/TravelExploreRounded";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import BookOnlineRoundedIcon from "@mui/icons-material/BookOnlineRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import ApartmentRoundedIcon from "@mui/icons-material/ApartmentRounded";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import ExpandLessRoundedIcon from "@mui/icons-material/ExpandLessRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";

export default function Sidebar({
  isSidebarOpen,
  isMobileOpen,
  onCloseMobile,
}) {
  const { pathname } = useLocation();

  const sidebarWidth = isSidebarOpen ? 292 : 92;

  const navSections = useMemo(
    () => [
      {
        key: "dashboard",
        type: "single",
        title: "Dashboard",
        icon: <DashboardRoundedIcon />,
        link: "/dashboard",
      },
      {
        key: "packages",
        type: "group",
        title: "Packages",
        icon: <Inventory2RoundedIcon />,
        children: [
          { title: "Package List", link: "/packages" },
          { title: "Add Package", link: "/packages/add" },
        ],
      },
      {
        key: "bookings",
        type: "single",
        title: "Bookings",
        icon: <BookOnlineRoundedIcon />,
        link: "/bookings",
      },
      {
        key: "locations",
        type: "group",
        title: "Locations",
        icon: <PlaceRoundedIcon />,
        children: [
          { title: "Location List", link: "/locations" },
          { title: "Add Location", link: "/locations/add" },
        ],
      },
      {
        key: "hotels",
        type: "group",
        title: "Hotels",
        icon: <ApartmentRoundedIcon />,
        children: [
          { title: "Hotel List", link: "/hotels" },
          { title: "Add Hotel", link: "/hotels/add" },
        ],
      },
      {
        key: "users",
        type: "group",
        title: "Users",
        icon: <GroupRoundedIcon />,
        children: [
          { title: "User List", link: "/users" },
          { title: "Add User", link: "/users/add" },
        ],
      },
    ],
    [],
  );

  const getMenuFromPathname = (currentPath) => {
    if (currentPath === "/packages" || currentPath === "/packages/add") {
      return "packages";
    }
    if (currentPath === "/locations" || currentPath === "/locations/add") {
      return "locations";
    }
    if (currentPath === "/hotels" || currentPath === "/hotels/add") {
      return "hotels";
    }
    if (currentPath === "/users" || currentPath === "/users/add") {
      return "users";
    }
    return "";
  };

  const [openMenu, setOpenMenu] = useState(getMenuFromPathname(pathname));

  useEffect(() => {
    setOpenMenu(getMenuFromPathname(pathname));
  }, [pathname]);

  const toggleMenu = (key) => {
    setOpenMenu((prev) => (prev === key ? "" : key));
  };

  const isGroupActive = (children = []) =>
    children.some((child) => pathname === child.link);

  const isDesktop =
    typeof window !== "undefined" ? window.innerWidth >= 992 : true;

  const linkBaseStyle = {
    textDecoration: "none",
    borderRadius: "18px",
    transition: "all 0.28s ease",
  };

  return (
    <>
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="d-lg-none"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(2,6,23,0.62)",
            backdropFilter: "blur(6px)",
            zIndex: 1040,
          }}
        />
      )}

      <aside
        style={{
          width: sidebarWidth,
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          zIndex: 1050,
          transform: isDesktop
            ? "translateX(0)"
            : isMobileOpen
              ? "translateX(0)"
              : "translateX(-100%)",
          transition: "all 0.34s ease",
          background:
            "radial-gradient(circle at top, rgba(59,130,246,0.18) 0%, rgba(59,130,246,0) 28%), linear-gradient(180deg, #020617 0%, #081120 28%, #0b1324 58%, #111827 100%)",
          borderRight: "1px solid rgba(255,255,255,0.07)",
          boxShadow: "22px 0 60px rgba(2,6,23,0.42)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          className="position-absolute"
          style={{
            top: -80,
            right: -50,
            width: 180,
            height: 180,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.04)",
            filter: "blur(6px)",
            pointerEvents: "none",
          }}
        />
        <div
          className="position-absolute"
          style={{
            bottom: 140,
            left: -60,
            width: 160,
            height: 160,
            borderRadius: "50%",
            background: "rgba(59,130,246,0.05)",
            filter: "blur(8px)",
            pointerEvents: "none",
          }}
        />

        <div
          className="d-flex align-items-center justify-content-between px-3 px-md-4 position-relative"
          style={{
            height: "82px",
            minHeight: "82px",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0))",
            flexShrink: 0,
          }}
        >
          <div className="d-flex align-items-center gap-3">
            <div
              className="d-flex align-items-center justify-content-center position-relative"
              style={{
                width: 48,
                height: 48,
                borderRadius: 18,
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.14), rgba(59,130,246,0.22))",
                color: "#ffffff",
                border: "1px solid rgba(255,255,255,0.10)",
                boxShadow: "0 12px 30px rgba(15,23,42,0.30)",
                flexShrink: 0,
              }}
            >
              <TravelExploreRoundedIcon />
            </div>

            {isSidebarOpen && (
              <div style={{ minWidth: 0 }}>
                <div
                  className="fw-bold text-white"
                  style={{
                    fontSize: "17px",
                    letterSpacing: "0.2px",
                  }}
                >
                  Travel Operations
                </div>
                <small
                  style={{
                    color: "rgba(255,255,255,0.58)",
                    letterSpacing: "0.3px",
                  }}
                >
                  Admin workspace
                </small>
              </div>
            )}
          </div>

          <div className="d-lg-none">
            <IconButton
              onClick={onCloseMobile}
              sx={{
                color: "#fff",
                background: "rgba(255,255,255,0.06)",
                "&:hover": {
                  background: "rgba(255,255,255,0.12)",
                },
              }}
            >
              <CloseRoundedIcon />
            </IconButton>
          </div>
        </div>

        <div
          className="sidebar-scroll px-2 px-md-3 py-3"
          style={{
            flex: 1,
            minHeight: 0,
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          <style>
            {`
              .sidebar-scroll::-webkit-scrollbar {
                width: 8px;
              }

              .sidebar-scroll::-webkit-scrollbar-track {
                background: transparent;
              }

              .sidebar-scroll::-webkit-scrollbar-thumb {
                background: linear-gradient(180deg, rgba(148,163,184,0.35), rgba(59,130,246,0.35));
                border-radius: 999px;
              }

              .sidebar-scroll::-webkit-scrollbar-thumb:hover {
                background: linear-gradient(180deg, rgba(148,163,184,0.55), rgba(59,130,246,0.55));
              }
            `}
          </style>

          <div className="d-flex flex-column gap-2">
            {navSections.map((section) => {
              if (section.type === "single") {
                const active = pathname === section.link;

                return (
                  <NavLink
                    key={section.key}
                    to={section.link}
                    onClick={onCloseMobile}
                    style={{
                      ...linkBaseStyle,
                      position: "relative",
                      background: active
                        ? "linear-gradient(135deg, rgba(255,255,255,0.96), rgba(226,232,240,0.96))"
                        : "rgba(255,255,255,0.02)",
                      color: active ? "#0f172a" : "rgba(255,255,255,0.88)",
                      border: active
                        ? "1px solid rgba(255,255,255,0.10)"
                        : "1px solid rgba(255,255,255,0.04)",
                      boxShadow: active
                        ? "0 16px 32px rgba(255,255,255,0.08)"
                        : "none",
                      backdropFilter: "blur(10px)",
                    }}
                    className="px-3 py-3 d-flex align-items-center gap-3"
                  >
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 22,
                        minWidth: 22,
                      }}
                    >
                      {section.icon}
                    </span>

                    {isSidebarOpen && (
                      <span className="fw-semibold">{section.title}</span>
                    )}
                  </NavLink>
                );
              }

              const groupActive = isGroupActive(section.children);
              const expanded = openMenu === section.key;

              return (
                <div key={section.key}>
                  <button
                    type="button"
                    onClick={() => toggleMenu(section.key)}
                    className="w-100 border-0 px-3 py-3 d-flex align-items-center justify-content-between"
                    style={{
                      ...linkBaseStyle,
                      background:
                        groupActive || expanded
                          ? "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(59,130,246,0.08))"
                          : "rgba(255,255,255,0.02)",
                      color: "#fff",
                      border:
                        groupActive || expanded
                          ? "1px solid rgba(255,255,255,0.09)"
                          : "1px solid rgba(255,255,255,0.04)",
                      boxShadow:
                        groupActive || expanded
                          ? "0 12px 26px rgba(15,23,42,0.16)"
                          : "none",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    <div className="d-flex align-items-center gap-3">
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: 22,
                          minWidth: 22,
                          color:
                            groupActive || expanded
                              ? "#ffffff"
                              : "rgba(255,255,255,0.88)",
                        }}
                      >
                        {section.icon}
                      </span>

                      {isSidebarOpen && (
                        <span className="fw-semibold">{section.title}</span>
                      )}
                    </div>

                    {isSidebarOpen &&
                      (expanded ? (
                        <ExpandLessRoundedIcon fontSize="small" />
                      ) : (
                        <ExpandMoreRoundedIcon fontSize="small" />
                      ))}
                  </button>

                  {isSidebarOpen && (
                    <Collapse in={expanded} timeout={260}>
                      <div
                        className="mt-2 d-flex flex-column gap-2"
                        style={{ paddingLeft: "10px" }}
                      >
                        {section.children.map((child) => {
                          const active = pathname === child.link;

                          return (
                            <NavLink
                              key={child.link}
                              to={child.link}
                              onClick={onCloseMobile}
                              style={{
                                ...linkBaseStyle,
                                padding: "12px 14px 12px 16px",
                                marginLeft: "18px",
                                fontSize: "14px",
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                                background: active
                                  ? "linear-gradient(135deg, rgba(59,130,246,0.22), rgba(99,102,241,0.22))"
                                  : "transparent",
                                color: active
                                  ? "#ffffff"
                                  : "rgba(255,255,255,0.70)",
                                border: active
                                  ? "1px solid rgba(255,255,255,0.08)"
                                  : "1px solid transparent",
                              }}
                            >
                              <KeyboardArrowRightRoundedIcon
                                sx={{
                                  fontSize: 18,
                                  opacity: active ? 1 : 0.65,
                                }}
                              />
                              <span>{child.title}</span>
                            </NavLink>
                          );
                        })}
                      </div>
                    </Collapse>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div
          className="px-3 py-3"
          style={{
            borderTop: "1px solid rgba(255,255,255,0.07)",
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))",
            flexShrink: 0,
          }}
        >
          {isSidebarOpen ? (
            <div
              className="p-3"
              style={{
                borderRadius: "20px",
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(59,130,246,0.08))",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 16px 34px rgba(2,6,23,0.24)",
              }}
            >
              <div className="d-flex align-items-start gap-3">
                <div
                  className="d-flex align-items-center justify-content-center"
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 14,
                    background: "rgba(255,255,255,0.10)",
                    color: "#fff",
                    flexShrink: 0,
                  }}
                >
                  <AutoAwesomeRoundedIcon fontSize="small" />
                </div>

                <div>
                  <div className="text-white fw-semibold">
                    Business Overview
                  </div>
                  <small style={{ color: "rgba(255,255,255,0.66)" }}>
                    Monitor packages, hotels, users and bookings from one place
                  </small>
                </div>
              </div>
            </div>
          ) : (
            <div className="d-flex justify-content-center">
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 14,
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(59,130,246,0.14))",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
                className="d-flex align-items-center justify-content-center text-white"
              >
                <TravelExploreRoundedIcon fontSize="small" />
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
