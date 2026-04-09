import { useEffect, useState } from "react";
import {
  Button,
  TextField,
  MenuItem,
  Switch,
  FormControlLabel,
  IconButton,
  Avatar,
} from "@mui/material";
import CloudUploadRoundedIcon from "@mui/icons-material/CloudUploadRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";

export default function AddUserPage({ onSubmit, loading = false, onBack }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    contact: "",
    role: "user",
    isActive: true,
    isVerified: false,
  });

  const [newImage, setNewImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");

  useEffect(() => {
    return () => {
      if (previewImage?.startsWith("blob:")) {
        try {
          URL.revokeObjectURL(previewImage);
        } catch {}
      }
    };
  }, [previewImage]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
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

    setNewImage(file);
    setPreviewImage(URL.createObjectURL(file));
    e.target.value = "";
  };

  const removePreviewImage = () => {
    if (previewImage?.startsWith("blob:")) {
      try {
        URL.revokeObjectURL(previewImage);
      } catch {}
    }

    setNewImage(null);
    setPreviewImage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = new FormData();
    payload.append("name", form.name.trim());
    payload.append("email", form.email.trim());
    payload.append("password", form.password.trim());
    payload.append("contact", form.contact.trim());
    payload.append("role", form.role);
    payload.append("isActive", form.isActive);
    payload.append("isVerified", form.isVerified);

    if (newImage) {
      payload.append("image", newImage);
    }

    await onSubmit(payload);
  };

  return (
    <div className="container-fluid px-0">
      <div
        className="rounded-4 overflow-hidden"
        style={{
          border: "1px solid #e2e8f0",
          background: "#ffffff",
          boxShadow: "0 20px 60px rgba(15, 23, 42, 0.08)",
        }}
      >
        <div
          style={{
            background:
              "linear-gradient(135deg, #0f172a 0%, #1e293b 45%, #2563eb 100%)",
            padding: "24px 28px",
          }}
        >
          <div className="d-flex flex-wrap align-items-start justify-content-between gap-3">
            <div className="d-flex align-items-start gap-3">
              {onBack ? (
                <IconButton
                  onClick={onBack}
                  sx={{
                    color: "#fff",
                    background: "rgba(255,255,255,0.10)",
                    mt: "2px",
                    "&:hover": {
                      background: "rgba(255,255,255,0.18)",
                    },
                  }}
                >
                  <ArrowBackRoundedIcon />
                </IconButton>
              ) : null}

              <div>
                <div
                  className="text-white fw-bold"
                  style={{ fontSize: "28px" }}
                >
                  Add User
                </div>
                <div className="text-white-50 mt-1">
                  Create a new premium user account
                </div>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-4 p-md-5">
            <div className="row g-4">
              <div className="col-12 col-xl-8">
                <div
                  className="rounded-4 p-4 h-100"
                  style={{
                    background: "#ffffff",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <div className="fw-bold text-dark mb-3 fs-5">
                    User Information
                  </div>

                  <div className="row g-3">
                    <div className="col-12">
                      <TextField
                        fullWidth
                        label="Full Name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-md-6">
                      <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-md-6">
                      <TextField
                        fullWidth
                        label="Contact"
                        name="contact"
                        value={form.contact}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-md-6">
                      <TextField
                        fullWidth
                        type="password"
                        label="Password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-md-6">
                      <TextField
                        select
                        fullWidth
                        label="Role"
                        name="role"
                        value={form.role}
                        onChange={handleChange}
                      >
                        <MenuItem value="user">User</MenuItem>
                        <MenuItem value="admin">Admin</MenuItem>
                      </TextField>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12 col-xl-4">
                <div className="d-flex flex-column gap-4">
                  <div
                    className="rounded-4 p-4"
                    style={{
                      background: "#ffffff",
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    <div className="fw-bold text-dark mb-3 fs-5">
                      User Settings
                    </div>

                    <div className="d-flex flex-column gap-2">
                      <FormControlLabel
                        control={
                          <Switch
                            checked={form.isActive}
                            onChange={(e) =>
                              setForm((prev) => ({
                                ...prev,
                                isActive: e.target.checked,
                              }))
                            }
                          />
                        }
                        label="Active Status"
                      />

                      <FormControlLabel
                        control={
                          <Switch
                            checked={form.isVerified}
                            onChange={(e) =>
                              setForm((prev) => ({
                                ...prev,
                                isVerified: e.target.checked,
                              }))
                            }
                          />
                        }
                        label="Verified Status"
                      />
                    </div>
                  </div>

                  <div
                    className="rounded-4 p-4"
                    style={{
                      background: "#ffffff",
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    <div className="fw-bold text-dark mb-3 fs-5">
                      Profile Image
                    </div>

                    <div
                      className="rounded-4 p-3"
                      style={{
                        background: "#f8fafc",
                        border: "1px dashed #cbd5e1",
                      }}
                    >
                      <div className="d-flex flex-wrap align-items-start gap-3 mb-3">
                        {previewImage ? (
                          <div
                            className="position-relative"
                            style={{ width: 96, height: 96 }}
                          >
                            <Avatar
                              src={previewImage}
                              variant="rounded"
                              sx={{
                                width: 96,
                                height: 96,
                                borderRadius: "18px",
                                border: "2px solid #2563eb",
                              }}
                            />

                            <IconButton
                              size="small"
                              onClick={removePreviewImage}
                              sx={{
                                position: "absolute",
                                top: -8,
                                right: -8,
                                background: "#fff",
                                boxShadow: "0 8px 20px rgba(15,23,42,0.18)",
                                "&:hover": {
                                  background: "#fff1f2",
                                  color: "#e11d48",
                                },
                              }}
                            >
                              <DeleteOutlineRoundedIcon fontSize="small" />
                            </IconButton>
                          </div>
                        ) : (
                          <div className="text-muted small">
                            No image selected
                          </div>
                        )}
                      </div>

                      <label
                        htmlFor="add-user-image"
                        className="d-inline-flex align-items-center gap-2 px-3 py-2 rounded-3"
                        style={{
                          cursor: "pointer",
                          background: "#eff6ff",
                          color: "#2563eb",
                          fontWeight: 600,
                        }}
                      >
                        <CloudUploadRoundedIcon fontSize="small" />
                        Upload Image
                      </label>

                      <input
                        id="add-user-image"
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleImageUpload}
                      />

                      <div className="text-muted small mt-2">
                        Upload a profile image for the user.
                      </div>
                    </div>
                  </div>

                  <div
                    className="rounded-4 p-4"
                    style={{
                      background: "#ffffff",
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    <div className="d-flex flex-wrap gap-3">
                      <Button
                        variant="outlined"
                        onClick={onBack}
                        sx={{
                          borderRadius: "12px",
                          textTransform: "none",
                          px: 3,
                        }}
                      >
                        Back
                      </Button>

                      <Button
                        type="submit"
                        variant="contained"
                        disabled={loading}
                        sx={{
                          borderRadius: "12px",
                          textTransform: "none",
                          px: 3,
                          fontWeight: 700,
                          minWidth: "160px",
                        }}
                      >
                        {loading ? "Creating..." : "Create User"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
