import { useEffect, useState } from "react";
import {
  Switch,
  FormControlLabel,
  Button,
  Chip,
  Slider,
  MenuItem,
  TextField,
  Divider,
} from "@mui/material";
import AdminLayout from "../layouts/AdminLayout";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import PaletteRoundedIcon from "@mui/icons-material/PaletteRounded";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import LanguageRoundedIcon from "@mui/icons-material/LanguageRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import { showSuccess } from "../utils/ShowToast";

const DEFAULT_SETTINGS = {
  emailNotifications: true,
  bookingAlerts: true,
  userAlerts: false,
  darkCards: true,
  compactSidebar: false,
  autoRefresh: true,
  sessionTimeout: 30,
  language: "english",
  currency: "INR",
};

export default function Settings() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("adminSettings");
      if (saved) {
        setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(saved) });
      }
    } catch {}
  }, []);

  const handleSwitch = (name) => (e) => {
    setSettings((prev) => ({
      ...prev,
      [name]: e.target.checked,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSlider = (_, value) => {
    setSettings((prev) => ({
      ...prev,
      sessionTimeout: value,
    }));
  };

  const handleSaveSettings = () => {
    localStorage.setItem("adminSettings", JSON.stringify(settings));
    showSuccess("Settings saved successfully");
  };

  const handleResetDefaults = () => {
    setSettings(DEFAULT_SETTINGS);
    localStorage.setItem("adminSettings", JSON.stringify(DEFAULT_SETTINGS));
    showSuccess("Settings reset to default");
  };

  return (
    <AdminLayout>
      <div className="container-fluid px-0">
        <div
          className="rounded-4 p-4 p-md-5 mb-4 position-relative overflow-hidden"
          style={{
            background:
              "radial-gradient(circle at top right, rgba(96,165,250,0.18), transparent 26%), linear-gradient(135deg, #020617 0%, #0f172a 45%, #1e293b 100%)",
            boxShadow: "0 24px 60px rgba(15,23,42,0.22)",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -60,
              right: -30,
              width: 200,
              height: 200,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.05)",
              filter: "blur(10px)",
            }}
          />

          <div className="position-relative">
            <div
              className="d-inline-flex align-items-center gap-2 px-3 py-2 rounded-pill mb-3"
              style={{
                background: "rgba(255,255,255,0.10)",
                color: "#fff",
                fontSize: 14,
              }}
            >
              <SettingsRoundedIcon fontSize="small" />
              Workspace Preferences
            </div>

            <h2 className="fw-bold text-white mb-2">Settings</h2>
            <p className="mb-0 text-white-50">
              Customize your admin workspace, notifications, interface behavior
              and experience controls.
            </p>
          </div>
        </div>

        <div className="row g-4">
          <div className="col-xl-4">
            <div
              className="rounded-4 p-4 h-100"
              style={{
                background: "#ffffff",
                border: "1px solid rgba(15,23,42,0.06)",
                boxShadow: "0 18px 38px rgba(15,23,42,0.06)",
              }}
            >
              <div className="d-flex align-items-center justify-content-between mb-4">
                <div>
                  <h5 className="fw-bold mb-1">Workspace Overview</h5>
                  <p className="text-muted mb-0 small">
                    Premium environment controls
                  </p>
                </div>

                <Chip
                  icon={<TuneRoundedIcon />}
                  label="Active"
                  sx={{
                    fontWeight: 700,
                    background: "#dcfce7",
                    color: "#15803d",
                  }}
                />
              </div>

              <div className="d-flex flex-column gap-3">
                <MiniSettingCard
                  icon={<PaletteRoundedIcon />}
                  title="Interface Style"
                  subtitle="Luxury admin visual controls"
                />
                <MiniSettingCard
                  icon={<NotificationsRoundedIcon />}
                  title="Alerts & Updates"
                  subtitle="Email and booking preferences"
                />
                <MiniSettingCard
                  icon={<SecurityRoundedIcon />}
                  title="Security"
                  subtitle="Session and access preferences"
                />
                <MiniSettingCard
                  icon={<LanguageRoundedIcon />}
                  title="Localization"
                  subtitle="Language and currency setup"
                />
              </div>
            </div>
          </div>

          <div className="col-xl-8">
            <div className="d-flex flex-column gap-4">
              <div
                className="rounded-4 p-4"
                style={{
                  background: "#ffffff",
                  border: "1px solid rgba(15,23,42,0.06)",
                  boxShadow: "0 18px 38px rgba(15,23,42,0.06)",
                }}
              >
                <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
                  <div>
                    <h5 className="fw-bold mb-1">Appearance</h5>
                    <p className="text-muted mb-0 small">
                      Fine-tune layout and visual experience
                    </p>
                  </div>

                  <Chip
                    label="UI Controls"
                    sx={{
                      fontWeight: 700,
                      background: "#eff6ff",
                      color: "#2563eb",
                    }}
                  />
                </div>

                <div className="row g-3">
                  <div className="col-md-6">
                    <SettingToggle
                      label="Use luxury dark cards"
                      checked={settings.darkCards}
                      onChange={handleSwitch("darkCards")}
                    />
                  </div>

                  <div className="col-md-6">
                    <SettingToggle
                      label="Compact sidebar mode"
                      checked={settings.compactSidebar}
                      onChange={handleSwitch("compactSidebar")}
                    />
                  </div>
                </div>
              </div>

              <div
                className="rounded-4 p-4"
                style={{
                  background: "#ffffff",
                  border: "1px solid rgba(15,23,42,0.06)",
                  boxShadow: "0 18px 38px rgba(15,23,42,0.06)",
                }}
              >
                <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
                  <div>
                    <h5 className="fw-bold mb-1">Notifications</h5>
                    <p className="text-muted mb-0 small">
                      Choose which alerts matter most
                    </p>
                  </div>

                  <Chip
                    label="Alerts"
                    sx={{
                      fontWeight: 700,
                      background: "#fff7ed",
                      color: "#ea580c",
                    }}
                  />
                </div>

                <div className="row g-3">
                  <div className="col-md-6">
                    <SettingToggle
                      label="Email notifications"
                      checked={settings.emailNotifications}
                      onChange={handleSwitch("emailNotifications")}
                    />
                  </div>

                  <div className="col-md-6">
                    <SettingToggle
                      label="Booking activity alerts"
                      checked={settings.bookingAlerts}
                      onChange={handleSwitch("bookingAlerts")}
                    />
                  </div>

                  <div className="col-md-6">
                    <SettingToggle
                      label="User management alerts"
                      checked={settings.userAlerts}
                      onChange={handleSwitch("userAlerts")}
                    />
                  </div>

                  <div className="col-md-6">
                    <SettingToggle
                      label="Auto refresh dashboard"
                      checked={settings.autoRefresh}
                      onChange={handleSwitch("autoRefresh")}
                    />
                  </div>
                </div>
              </div>

              <div
                className="rounded-4 p-4"
                style={{
                  background: "#ffffff",
                  border: "1px solid rgba(15,23,42,0.06)",
                  boxShadow: "0 18px 38px rgba(15,23,42,0.06)",
                }}
              >
                <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
                  <div>
                    <h5 className="fw-bold mb-1">System Preferences</h5>
                    <p className="text-muted mb-0 small">
                      Configure session behavior and localization
                    </p>
                  </div>

                  <Chip
                    label="Advanced"
                    sx={{
                      fontWeight: 700,
                      background: "#f8fafc",
                      color: "#0f172a",
                    }}
                  />
                </div>

                <div className="row g-4">
                  <div className="col-md-6">
                    <TextField
                      select
                      fullWidth
                      label="Language"
                      name="language"
                      value={settings.language}
                      onChange={handleChange}
                    >
                      <MenuItem value="english">English</MenuItem>
                      <MenuItem value="hindi">Hindi</MenuItem>
                    </TextField>
                  </div>

                  <div className="col-md-6">
                    <TextField
                      select
                      fullWidth
                      label="Currency"
                      name="currency"
                      value={settings.currency}
                      onChange={handleChange}
                    >
                      <MenuItem value="INR">INR</MenuItem>
                      <MenuItem value="USD">USD</MenuItem>
                      <MenuItem value="EUR">EUR</MenuItem>
                    </TextField>
                  </div>

                  <div className="col-12">
                    <div
                      className="rounded-4 p-4"
                      style={{
                        background: "#f8fafc",
                        border: "1px solid #e2e8f0",
                      }}
                    >
                      <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-3">
                        <div>
                          <div className="fw-bold text-dark">
                            Session Timeout
                          </div>
                          <div className="text-muted small">
                            Automatically sign out after inactivity
                          </div>
                        </div>

                        <Chip
                          label={`${settings.sessionTimeout} Minutes`}
                          sx={{
                            fontWeight: 700,
                            background: "#eff6ff",
                            color: "#2563eb",
                          }}
                        />
                      </div>

                      <Slider
                        value={settings.sessionTimeout}
                        onChange={handleSlider}
                        min={5}
                        max={120}
                        step={5}
                        valueLabelDisplay="auto"
                      />
                    </div>
                  </div>
                </div>

                <Divider sx={{ my: 4 }} />

                <div className="d-flex flex-wrap gap-3">
                  <Button
                    variant="contained"
                    startIcon={<SaveRoundedIcon />}
                    onClick={handleSaveSettings}
                    sx={{
                      borderRadius: "14px",
                      textTransform: "none",
                      px: 3,
                      py: 1.2,
                      fontWeight: 700,
                    }}
                  >
                    Save Settings
                  </Button>

                  <Button
                    variant="outlined"
                    onClick={handleResetDefaults}
                    sx={{
                      borderRadius: "14px",
                      textTransform: "none",
                      px: 3,
                      py: 1.2,
                      fontWeight: 700,
                    }}
                  >
                    Reset Defaults
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

function SettingToggle({ label, checked, onChange }) {
  return (
    <div
      className="rounded-4 p-3 h-100 d-flex align-items-center justify-content-between gap-3"
      style={{
        background: "#f8fafc",
        border: "1px solid #e2e8f0",
      }}
    >
      <div className="fw-semibold text-dark">{label}</div>
      <FormControlLabel
        control={<Switch checked={checked} onChange={onChange} />}
        label=""
        sx={{ m: 0 }}
      />
    </div>
  );
}

function MiniSettingCard({ icon, title, subtitle }) {
  return (
    <div
      className="d-flex align-items-center gap-3 rounded-4 p-3"
      style={{
        background: "#f8fafc",
        border: "1px solid #e2e8f0",
      }}
    >
      <div
        className="d-flex align-items-center justify-content-center"
        style={{
          width: 46,
          height: 46,
          borderRadius: 14,
          background: "#eff6ff",
          color: "#2563eb",
          flexShrink: 0,
        }}
      >
        {icon}
      </div>

      <div>
        <div className="fw-semibold text-dark">{title}</div>
        <div className="text-muted small">{subtitle}</div>
      </div>
    </div>
  );
}
