import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Chip from "@mui/material/Chip";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import MenuOpenRoundedIcon from "@mui/icons-material/MenuOpenRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";

function getPageMeta(pathname) {
  if (pathname.startsWith("/packages/add")) {
    return {
      title: "Add Package",
      subtitle: "Create and publish a new travel experience",
    };
  }
  if (pathname.startsWith("/packages")) {
    return {
      title: "Packages",
      subtitle: "Manage premium travel packages and offers",
    };
  }
  if (pathname.startsWith("/locations/add")) {
    return {
      title: "Add Location",
      subtitle: "Create a new destination in your platform",
    };
  }
  if (pathname.startsWith("/locations")) {
    return {
      title: "Locations",
      subtitle: "Manage destination coverage across your business",
    };
  }
  if (pathname.startsWith("/hotels/add")) {
    return {
      title: "Add Hotel",
      subtitle: "Create a new premium hotel listing",
    };
  }
  if (pathname.startsWith("/hotels")) {
    return {
      title: "Hotels",
      subtitle: "Manage hotel inventory and availability",
    };
  }
  if (pathname.startsWith("/users/add")) {
    return {
      title: "Add User",
      subtitle: "Create a new admin or customer account",
    };
  }
  if (pathname.startsWith("/users")) {
    return {
      title: "Users",
      subtitle: "Manage customer and admin accounts",
    };
  }
  if (pathname.startsWith("/bookings")) {
    return {
      title: "Bookings",
      subtitle: "Track reservations, payments and travel schedules",
    };
  }
  if (pathname.startsWith("/profile")) {
    return {
      title: "My Profile",
      subtitle: "View and manage your admin profile",
    };
  }
  if (pathname.startsWith("/settings")) {
    return {
      title: "Settings",
      subtitle: "Customize workspace and preferences",
    };
  }

  return {
    title: "Dashboard",
    subtitle: "Monitor business performance and operations",
  };
}

function getAdminInitials(name = "") {
  const parts = name.trim().split(" ").filter(Boolean);
  if (!parts.length) return "A";
  if (parts.length === 1) return parts[0][0]?.toUpperCase() || "A";
  return `${parts[0][0] || ""}${parts[1][0] || ""}`.toUpperCase();
}

export default function Topbar({ isSidebarOpen, onToggleSidebar }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const profileMenuOpen = Boolean(profileAnchorEl);

  const adminUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("adminUser")) || null;
    } catch {
      return null;
    }
  }, []);

  const pageMeta = useMemo(() => getPageMeta(pathname), [pathname]);

  const profileImage =
    adminUser?.image?.url ||
    adminUser?.avatar?.url ||
    adminUser?.profileImage?.url ||
    adminUser?.image ||
    "";

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminRefreshToken");
    localStorage.removeItem("adminUser");
    navigate("/");
  };

  const handleOpenProfileMenu = (event) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleCloseProfileMenu = () => {
    setProfileAnchorEl(null);
  };

  const handleGoToProfile = () => {
    handleCloseProfileMenu();
    navigate("/profile");
  };

  const handleGoToSettings = () => {
    handleCloseProfileMenu();
    navigate("/settings");
  };

  const handleLogoutFromMenu = () => {
    handleCloseProfileMenu();
    handleLogout();
  };

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1030,
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.82) 0%, rgba(248,250,252,0.88) 100%)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(15,23,42,0.07)",
        boxShadow: "0 10px 34px rgba(15,23,42,0.05)",
      }}
    >
      <div className="container-fluid px-3 px-md-4 py-3">
        <div className="d-flex align-items-center justify-content-between gap-3 flex-wrap">
          <div className="d-flex align-items-center gap-3 flex-grow-1 min-w-0">
            <Tooltip
              title={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            >
              <IconButton
                onClick={onToggleSidebar}
                sx={{
                  width: 50,
                  height: 50,
                  border: "1px solid rgba(15,23,42,0.08)",
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.96), rgba(248,250,252,0.96))",
                  boxShadow: "0 14px 30px rgba(15,23,42,0.08)",
                  color: "#0f172a",
                  "&:hover": {
                    background: "linear-gradient(135deg, #ffffff, #f8fafc)",
                    boxShadow: "0 16px 34px rgba(15,23,42,0.12)",
                  },
                }}
              >
                {isSidebarOpen ? <MenuOpenRoundedIcon /> : <MenuRoundedIcon />}
              </IconButton>
            </Tooltip>

            <div
              className="d-flex align-items-center gap-3 flex-grow-1"
              style={{ minWidth: 0 }}
            >
              <div
                className="d-none d-md-flex flex-column"
                style={{ minWidth: 0 }}
              >
                <div className="d-flex align-items-center gap-2 flex-wrap mb-1">
                  <Chip
                    icon={<WorkspacePremiumRoundedIcon />}
                    label="Operations Console"
                    size="small"
                    sx={{
                      height: 28,
                      borderRadius: "999px",
                      fontWeight: 700,
                      background:
                        "linear-gradient(135deg, rgba(15,23,42,0.92), rgba(30,41,59,0.92))",
                      color: "#fff",
                      border: "1px solid rgba(255,255,255,0.08)",
                      "& .MuiChip-icon": {
                        color: "#f8fafc",
                      },
                    }}
                  />

                  <Chip
                    icon={<WbSunnyOutlinedIcon />}
                    label="Live Workspace"
                    size="small"
                    sx={{
                      height: 28,
                      borderRadius: "999px",
                      fontWeight: 700,
                      background: "#ffffff",
                      color: "#475569",
                      border: "1px solid rgba(15,23,42,0.08)",
                      "& .MuiChip-icon": {
                        color: "#f59e0b",
                      },
                    }}
                  />
                </div>

                <h4
                  className="mb-0 fw-bold text-dark"
                  style={{
                    lineHeight: 1.1,
                    letterSpacing: "-0.02em",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {pageMeta.title}
                </h4>

                <small
                  className="text-muted"
                  style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: "520px",
                  }}
                >
                  {pageMeta.subtitle}
                </small>
              </div>

              <div className="d-block d-md-none" style={{ minWidth: 0 }}>
                <div
                  className="fw-bold text-dark"
                  style={{
                    fontSize: "16px",
                    lineHeight: 1.1,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: "150px",
                  }}
                >
                  {pageMeta.title}
                </div>
              </div>
            </div>
          </div>

          <div className="d-flex align-items-center gap-2 ms-auto">
            <button
              type="button"
              onClick={handleOpenProfileMenu}
              className="border-0 d-flex align-items-center gap-3 px-2 px-md-3 py-2"
              style={{
                borderRadius: "22px",
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.96), rgba(248,250,252,0.94))",
                border: "1px solid rgba(15,23,42,0.08)",
                boxShadow:
                  "0 16px 38px rgba(15,23,42,0.08), inset 0 1px 0 rgba(255,255,255,0.65)",
                cursor: "pointer",
              }}
            >
              <div
                className="position-relative"
                style={{
                  padding: "3px",
                  borderRadius: "999px",
                  background:
                    "linear-gradient(135deg, rgba(59,130,246,0.9), rgba(15,23,42,0.9))",
                  boxShadow: "0 10px 24px rgba(37,99,235,0.18)",
                }}
              >
                <Avatar
                  src={profileImage}
                  alt={adminUser?.name || "Admin User"}
                  sx={{
                    width: 46,
                    height: 46,
                    border: "2px solid rgba(255,255,255,0.92)",
                    background: !profileImage
                      ? "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)"
                      : undefined,
                    fontWeight: 800,
                  }}
                >
                  {!profileImage
                    ? getAdminInitials(adminUser?.name || "Admin User")
                    : null}
                </Avatar>

                <div
                  style={{
                    position: "absolute",
                    right: 2,
                    bottom: 2,
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    background: "#22c55e",
                    border: "2px solid #fff",
                    boxShadow: "0 0 0 2px rgba(34,197,94,0.18)",
                  }}
                />
              </div>

              <div
                className="d-none d-md-block text-start"
                style={{ minWidth: 0, maxWidth: 240 }}
              >
                <div className="d-flex align-items-center gap-2">
                  <div
                    className="fw-bold text-dark"
                    style={{
                      lineHeight: 1.1,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                    title={adminUser?.name || "Admin User"}
                  >
                    {adminUser?.name || "Admin User"}
                  </div>

                  <KeyboardArrowDownRoundedIcon
                    sx={{
                      fontSize: 18,
                      color: "#64748b",
                      transform: profileMenuOpen
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                      transition: "transform 0.25s ease",
                    }}
                  />
                </div>

                <div
                  className="text-muted"
                  style={{
                    fontSize: "12.5px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                  title={adminUser?.email || "admin@example.com"}
                >
                  {adminUser?.email || "admin@example.com"}
                </div>
              </div>
            </button>

            <Menu
              anchorEl={profileAnchorEl}
              open={profileMenuOpen}
              onClose={handleCloseProfileMenu}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: "visible",
                  mt: 1.4,
                  minWidth: 280,
                  borderRadius: "20px",
                  border: "1px solid rgba(15,23,42,0.08)",
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(248,250,252,0.98))",
                  backdropFilter: "blur(16px)",
                  boxShadow:
                    "0 20px 50px rgba(15,23,42,0.12), inset 0 1px 0 rgba(255,255,255,0.7)",
                  "&:before": {
                    content: '""',
                    display: "block",
                    position: "absolute",
                    top: 0,
                    right: 24,
                    width: 12,
                    height: 12,
                    bgcolor: "#ffffff",
                    transform: "translateY(-50%) rotate(45deg)",
                    borderLeft: "1px solid rgba(15,23,42,0.06)",
                    borderTop: "1px solid rgba(15,23,42,0.06)",
                    zIndex: 0,
                  },
                },
              }}
            >
              <div className="px-3 pt-3 pb-2">
                <div
                  className="d-flex align-items-center gap-3 p-3"
                  style={{
                    borderRadius: "18px",
                    background:
                      "linear-gradient(135deg, rgba(15,23,42,0.96), rgba(30,41,59,0.96))",
                    boxShadow: "0 14px 30px rgba(15,23,42,0.16)",
                  }}
                >
                  <Avatar
                    src={profileImage}
                    alt={adminUser?.name || "Admin User"}
                    sx={{
                      width: 52,
                      height: 52,
                      border: "2px solid rgba(255,255,255,0.85)",
                      background: !profileImage
                        ? "linear-gradient(135deg, #2563eb 0%, #0f172a 100%)"
                        : undefined,
                      fontWeight: 800,
                    }}
                  >
                    {!profileImage
                      ? getAdminInitials(adminUser?.name || "Admin User")
                      : null}
                  </Avatar>

                  <div style={{ minWidth: 0 }}>
                    <div
                      className="fw-bold text-white"
                      style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {adminUser?.name || "Admin User"}
                    </div>
                    <div
                      style={{
                        fontSize: "12.5px",
                        color: "rgba(255,255,255,0.68)",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {adminUser?.email || "admin@example.com"}
                    </div>
                  </div>
                </div>
              </div>

              <Divider sx={{ my: 1 }} />

              <MenuItem
                onClick={handleGoToProfile}
                sx={{
                  mx: 1,
                  my: 0.5,
                  borderRadius: "14px",
                  minHeight: 48,
                }}
              >
                <ListItemIcon>
                  <PersonRoundedIcon
                    sx={{ color: "#2563eb" }}
                    fontSize="small"
                  />
                </ListItemIcon>
                <ListItemText
                  primary="My Profile"
                  secondary="View personal details"
                  primaryTypographyProps={{ fontWeight: 700 }}
                  secondaryTypographyProps={{ fontSize: 12 }}
                />
              </MenuItem>

              <MenuItem
                onClick={handleGoToSettings}
                sx={{
                  mx: 1,
                  my: 0.5,
                  borderRadius: "14px",
                  minHeight: 48,
                }}
              >
                <ListItemIcon>
                  <SettingsRoundedIcon
                    sx={{ color: "#0f172a" }}
                    fontSize="small"
                  />
                </ListItemIcon>
                <ListItemText
                  primary="Settings"
                  secondary="Manage workspace preferences"
                  primaryTypographyProps={{ fontWeight: 700 }}
                  secondaryTypographyProps={{ fontSize: 12 }}
                />
              </MenuItem>

              <Divider sx={{ my: 1 }} />

              <MenuItem
                onClick={handleLogoutFromMenu}
                sx={{
                  mx: 1,
                  mt: 0.5,
                  mb: 1,
                  borderRadius: "14px",
                  minHeight: 48,
                  color: "#e11d48",
                  "&:hover": {
                    background: "#fff1f2",
                  },
                }}
              >
                <ListItemIcon>
                  <LogoutRoundedIcon
                    sx={{ color: "#e11d48" }}
                    fontSize="small"
                  />
                </ListItemIcon>
                <ListItemText
                  primary="Logout"
                  secondary="Sign out from admin workspace"
                  primaryTypographyProps={{ fontWeight: 700 }}
                  secondaryTypographyProps={{ fontSize: 12, color: "#94a3b8" }}
                />
              </MenuItem>
            </Menu>
          </div>
        </div>
      </div>
    </header>
  );
}
