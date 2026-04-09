import { useEffect, useMemo, useState } from "react";
import {
  Avatar,
  Button,
  Chip,
  TextField,
  IconButton,
  Divider,
  CircularProgress,
} from "@mui/material";
import AdminLayout from "../layouts/AdminLayout";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import BadgeRoundedIcon from "@mui/icons-material/BadgeRounded";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded";
import PhotoCameraRoundedIcon from "@mui/icons-material/PhotoCameraRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";

import {
  getMyProfile,
  updateMyProfile,
  changeMyPassword,
} from "../services/profile";
import { getApiErrorMessage } from "../utils/handleApiError";
import { showError, showSuccess } from "../utils/ShowToast";

function getAdminInitials(name = "") {
  const parts = name.trim().split(" ").filter(Boolean);
  if (!parts.length) return "A";
  if (parts.length === 1) return parts[0][0]?.toUpperCase() || "A";
  return `${parts[0][0] || ""}${parts[1][0] || ""}`.toUpperCase();
}

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);

  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    contact: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");

  const [profileSaving, setProfileSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);

  const profileImage = useMemo(() => {
    return (
      previewImage ||
      profile?.image?.url ||
      profile?.avatar?.url ||
      profile?.profileImage?.url ||
      profile?.image ||
      ""
    );
  }, [previewImage, profile]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setPageLoading(true);

        const res = await getMyProfile();
        const user = res?.data || null;

        setProfile(user);
        setProfileForm({
          name: user?.name || "",
          email: user?.email || "",
          contact: user?.contact || "",
        });

        const storedAdmin = localStorage.getItem("adminUser");
        if (storedAdmin) {
          localStorage.setItem("adminUser", JSON.stringify(user));
        }
      } catch (err) {
        showError(getApiErrorMessage(err, "Failed to load profile"));
      } finally {
        setPageLoading(false);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    return () => {
      if (previewImage?.startsWith("blob:")) {
        try {
          URL.revokeObjectURL(previewImage);
        } catch {}
      }
    };
  }, [previewImage]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (previewImage?.startsWith("blob:")) {
      try {
        URL.revokeObjectURL(previewImage);
      } catch {}
    }

    setSelectedImage(file);
    setPreviewImage(URL.createObjectURL(file));
    e.target.value = "";
  };

  const removeSelectedImage = () => {
    if (previewImage?.startsWith("blob:")) {
      try {
        URL.revokeObjectURL(previewImage);
      } catch {}
    }

    setSelectedImage(null);
    setPreviewImage("");
  };

  const handleSaveProfile = async () => {
    try {
      setProfileSaving(true);

      const payload = new FormData();
      payload.append("name", profileForm.name.trim());
      payload.append("email", profileForm.email.trim());
      payload.append("contact", profileForm.contact.trim());

      if (selectedImage) {
        payload.append("image", selectedImage);
      }

      const res = await updateMyProfile(payload);
      const updatedUser = res?.data;

      setProfile(updatedUser);
      setProfileForm({
        name: updatedUser?.name || "",
        email: updatedUser?.email || "",
        contact: updatedUser?.contact || "",
      });

      localStorage.setItem("adminUser", JSON.stringify(updatedUser));

      setSelectedImage(null);

      if (previewImage?.startsWith("blob:")) {
        try {
          URL.revokeObjectURL(previewImage);
        } catch {}
      }
      setPreviewImage("");

      showSuccess(res?.message || "Profile updated successfully");
    } catch (err) {
      showError(getApiErrorMessage(err, "Failed to update profile"));
    } finally {
      setProfileSaving(false);
    }
  };

  const handleUpdatePassword = async () => {
    try {
      setPasswordSaving(true);

      const payload = {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
        confirmPassword: passwordForm.confirmPassword,
      };

      const res = await changeMyPassword(payload);

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      showSuccess(res?.message || "Password changed successfully");
    } catch (err) {
      showError(getApiErrorMessage(err, "Failed to change password"));
    } finally {
      setPasswordSaving(false);
    }
  };

  if (pageLoading) {
    return (
      <AdminLayout>
        <div
          className="d-flex align-items-center justify-content-center"
          style={{ minHeight: "70vh" }}
        >
          <CircularProgress />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="container-fluid px-0">
        <div
          className="rounded-4 p-4 p-md-5 mb-4 position-relative overflow-hidden"
          style={{
            background:
              "radial-gradient(circle at top right, rgba(59,130,246,0.18), transparent 28%), linear-gradient(135deg, #020617 0%, #0f172a 40%, #1e293b 100%)",
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

          <div className="position-relative row g-4 align-items-center">
            <div className="col-lg-8">
              <div
                className="d-inline-flex align-items-center gap-2 px-3 py-2 rounded-pill mb-3"
                style={{
                  background: "rgba(255,255,255,0.10)",
                  color: "#fff",
                  fontSize: 14,
                }}
              >
                <WorkspacePremiumRoundedIcon fontSize="small" />
                Executive Profile
              </div>

              <h2 className="fw-bold text-white mb-2">My Profile</h2>
              <p className="mb-0 text-white-50">
                Manage your admin identity, account information and security
                settings from one premium workspace.
              </p>
            </div>

            <div className="col-lg-4">
              <div className="d-flex justify-content-lg-end">
                <div
                  className="p-3 p-md-4"
                  style={{
                    minWidth: "280px",
                    borderRadius: "24px",
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.10)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <div className="d-flex align-items-center gap-3">
                    <Avatar
                      src={profileImage}
                      sx={{
                        width: 68,
                        height: 68,
                        border: "3px solid rgba(255,255,255,0.88)",
                        background: !profileImage
                          ? "linear-gradient(135deg, #2563eb, #0f172a)"
                          : undefined,
                        fontWeight: 800,
                        fontSize: "22px",
                      }}
                    >
                      {!profileImage
                        ? getAdminInitials(profile?.name || "Admin User")
                        : null}
                    </Avatar>

                    <div style={{ minWidth: 0 }}>
                      <div
                        className="fw-bold text-white"
                        style={{
                          fontSize: "18px",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {profile?.name || "Admin User"}
                      </div>
                      <div
                        className="text-white-50"
                        style={{
                          fontSize: "13px",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {profile?.email || "admin@example.com"}
                      </div>
                      <div className="mt-2 d-flex flex-wrap gap-2">
                        <Chip
                          label={profile?.role || "admin"}
                          size="small"
                          sx={{
                            textTransform: "capitalize",
                            fontWeight: 700,
                            background: "#ffffff",
                            color: "#0f172a",
                          }}
                        />
                        <Chip
                          label={profile?.isVerified ? "Verified" : "Active"}
                          size="small"
                          sx={{
                            fontWeight: 700,
                            background: "#dcfce7",
                            color: "#15803d",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
                  <h5 className="fw-bold mb-1">Profile Card</h5>
                  <p className="text-muted mb-0 small">
                    Premium identity overview
                  </p>
                </div>

                <IconButton
                  sx={{
                    background: "#eff6ff",
                    color: "#2563eb",
                    "&:hover": { background: "#dbeafe" },
                  }}
                >
                  <EditRoundedIcon fontSize="small" />
                </IconButton>
              </div>

              <div className="text-center">
                <div
                  className="position-relative d-inline-block mb-3"
                  style={{ padding: 5, borderRadius: "999px" }}
                >
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: "999px",
                      background:
                        "linear-gradient(135deg, rgba(59,130,246,1), rgba(15,23,42,1))",
                    }}
                  />
                  <Avatar
                    src={profileImage}
                    sx={{
                      position: "relative",
                      width: 118,
                      height: 118,
                      border: "4px solid #fff",
                      background: !profileImage
                        ? "linear-gradient(135deg, #0f172a, #1e293b)"
                        : undefined,
                      fontWeight: 800,
                      fontSize: "32px",
                    }}
                  >
                    {!profileImage
                      ? getAdminInitials(profile?.name || "Admin User")
                      : null}
                  </Avatar>
                </div>

                <h4 className="fw-bold text-dark mb-1">
                  {profile?.name || "Admin User"}
                </h4>
                <p className="text-muted mb-3">
                  {profile?.email || "admin@example.com"}
                </p>

                <div className="d-flex justify-content-center flex-wrap gap-2">
                  <label
                    htmlFor="profile-image-upload"
                    className="d-inline-flex align-items-center gap-2 px-3 py-2 rounded-3"
                    style={{
                      cursor: "pointer",
                      background: "#eff6ff",
                      color: "#2563eb",
                      fontWeight: 700,
                    }}
                  >
                    <PhotoCameraRoundedIcon fontSize="small" />
                    Change Photo
                  </label>

                  <input
                    id="profile-image-upload"
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleImageUpload}
                  />

                  {selectedImage ? (
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteOutlineRoundedIcon />}
                      onClick={removeSelectedImage}
                      sx={{
                        borderRadius: "14px",
                        textTransform: "none",
                        fontWeight: 700,
                      }}
                    >
                      Remove
                    </Button>
                  ) : null}
                </div>
              </div>

              <Divider sx={{ my: 3 }} />

              <div className="d-flex flex-column gap-3">
                <InfoCard
                  icon={<EmailRoundedIcon />}
                  label="Email Address"
                  value={profile?.email || "-"}
                />
                <InfoCard
                  icon={<PhoneRoundedIcon />}
                  label="Contact Number"
                  value={profile?.contact || "-"}
                />
                <InfoCard
                  icon={<BadgeRoundedIcon />}
                  label="Role"
                  value={profile?.role || "admin"}
                />
                <InfoCard
                  icon={<VerifiedRoundedIcon />}
                  label="Status"
                  value={profile?.isVerified ? "Verified" : "Active"}
                />
                <InfoCard
                  icon={<CalendarMonthRoundedIcon />}
                  label="Member Since"
                  value={
                    profile?.createdAt
                      ? new Date(profile.createdAt).toLocaleDateString("en-IN")
                      : "-"
                  }
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
                    <h5 className="fw-bold mb-1">Personal Information</h5>
                    <p className="text-muted mb-0 small">
                      Keep your account information updated
                    </p>
                  </div>

                  <Chip
                    label="Primary Details"
                    sx={{
                      fontWeight: 700,
                      background: "#eff6ff",
                      color: "#2563eb",
                    }}
                  />
                </div>

                <div className="row g-3">
                  <div className="col-md-6">
                    <TextField
                      fullWidth
                      label="Full Name"
                      name="name"
                      value={profileForm.name}
                      onChange={handleProfileChange}
                    />
                  </div>

                  <div className="col-md-6">
                    <TextField
                      fullWidth
                      label="Email Address"
                      name="email"
                      value={profileForm.email}
                      onChange={handleProfileChange}
                    />
                  </div>

                  <div className="col-md-6">
                    <TextField
                      fullWidth
                      label="Contact Number"
                      name="contact"
                      value={profileForm.contact}
                      onChange={handleProfileChange}
                    />
                  </div>

                  <div className="col-md-6">
                    <TextField
                      fullWidth
                      label="Role"
                      value={profile?.role || "admin"}
                      disabled
                    />
                  </div>
                </div>

                <div className="mt-4 d-flex flex-wrap gap-3">
                  <Button
                    variant="contained"
                    startIcon={<SaveRoundedIcon />}
                    onClick={handleSaveProfile}
                    disabled={profileSaving}
                    sx={{
                      borderRadius: "14px",
                      textTransform: "none",
                      px: 3,
                      py: 1.2,
                      fontWeight: 700,
                    }}
                  >
                    {profileSaving ? "Saving..." : "Save Changes"}
                  </Button>

                  <Button
                    variant="outlined"
                    onClick={() =>
                      setProfileForm({
                        name: profile?.name || "",
                        email: profile?.email || "",
                        contact: profile?.contact || "",
                      })
                    }
                    sx={{
                      borderRadius: "14px",
                      textTransform: "none",
                      px: 3,
                      py: 1.2,
                      fontWeight: 700,
                    }}
                  >
                    Reset
                  </Button>
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
                    <h5 className="fw-bold mb-1">Security</h5>
                    <p className="text-muted mb-0 small">
                      Update your password for stronger account protection
                    </p>
                  </div>

                  <Chip
                    icon={<LockRoundedIcon />}
                    label="Secure Access"
                    sx={{
                      fontWeight: 700,
                      background: "#f8fafc",
                      color: "#0f172a",
                    }}
                  />
                </div>

                <div className="row g-3">
                  <div className="col-md-4">
                    <TextField
                      fullWidth
                      type="password"
                      label="Current Password"
                      name="currentPassword"
                      value={passwordForm.currentPassword}
                      onChange={handlePasswordChange}
                    />
                  </div>

                  <div className="col-md-4">
                    <TextField
                      fullWidth
                      type="password"
                      label="New Password"
                      name="newPassword"
                      value={passwordForm.newPassword}
                      onChange={handlePasswordChange}
                    />
                  </div>

                  <div className="col-md-4">
                    <TextField
                      fullWidth
                      type="password"
                      label="Confirm Password"
                      name="confirmPassword"
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordChange}
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <Button
                    variant="contained"
                    color="inherit"
                    startIcon={<LockRoundedIcon />}
                    onClick={handleUpdatePassword}
                    disabled={passwordSaving}
                    sx={{
                      borderRadius: "14px",
                      textTransform: "none",
                      px: 3,
                      py: 1.2,
                      fontWeight: 700,
                      background: "#0f172a",
                      color: "#fff",
                      "&:hover": {
                        background: "#111827",
                      },
                    }}
                  >
                    {passwordSaving ? "Updating..." : "Update Password"}
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

function InfoCard({ icon, label, value }) {
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
          width: 44,
          height: 44,
          borderRadius: 14,
          background: "#eff6ff",
          color: "#2563eb",
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div style={{ minWidth: 0 }}>
        <div className="small text-muted">{label}</div>
        <div
          className="fw-semibold text-dark"
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
          title={value}
        >
          {value}
        </div>
      </div>
    </div>
  );
}
