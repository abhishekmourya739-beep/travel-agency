import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Switch,
  FormControlLabel,
  IconButton,
  Avatar,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import CloudUploadRoundedIcon from "@mui/icons-material/CloudUploadRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";

export default function PremiumUserEditModal({
  open,
  onClose,
  data,
  onSubmit,
  loading,
}) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    contact: "",
    password: "",
    role: "user",
    isActive: true,
    isVerified: false,
  });

  const [newImage, setNewImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");

  useEffect(() => {
    if (!data || !open) return;

    setForm({
      name: data?.name || "",
      email: data?.email || "",
      contact: data?.contact || "",
      password: "",
      role: data?.role || "user",
      isActive: data?.isActive ?? true,
      isVerified: data?.isVerified ?? false,
    });

    setNewImage(null);
    setPreviewImage(data?.image?.url || "");
  }, [data, open]);

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
    payload.append("contact", form.contact.trim());
    payload.append("role", form.role);
    payload.append("isActive", form.isActive);
    payload.append("isVerified", form.isVerified);

    if (form.password.trim()) {
      payload.append("password", form.password.trim());
    }

    if (newImage) {
      payload.append("image", newImage);
    }

    await onSubmit(payload);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          borderRadius: "24px",
          height: "90vh",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        },
      }}
    >
      <div
        style={{
          background:
            "linear-gradient(135deg, #0f172a 0%, #1e293b 45%, #2563eb 100%)",
          padding: "20px 24px",
          position: "relative",
          flexShrink: 0,
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            color: "#fff",
            background: "rgba(255,255,255,0.10)",
            "&:hover": {
              background: "rgba(255,255,255,0.18)",
            },
          }}
        >
          <CloseRoundedIcon />
        </IconButton>

        <div className="pe-5">
          <div className="text-white fw-bold fs-4">Edit User</div>
          <div className="text-white-50 mt-1">
            Update user details, password and profile image
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          minHeight: 0,
        }}
      >
        <DialogContent
          sx={{
            flex: 1,
            minHeight: 0,
            overflowY: "auto",
            p: 4,
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "#cbd5e1",
              borderRadius: "999px",
            },
            "&::-webkit-scrollbar-track": {
              background: "#f8fafc",
            },
          }}
        >
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
                label="New Password"
                name="password"
                value={form.password}
                onChange={handleChange}
                helperText="Leave empty if you do not want to change password"
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

            <div className="col-md-6">
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
            </div>

            <div className="col-md-6">
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

            <div className="col-12">
              <div
                className="rounded-4 p-3"
                style={{
                  background: "#f8fafc",
                  border: "1px dashed #cbd5e1",
                }}
              >
                <div className="fw-semibold text-dark mb-2">Profile Image</div>

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
                    <div className="text-muted small">No image selected</div>
                  )}
                </div>

                <label
                  htmlFor="user-image"
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
                  id="user-image"
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
          </div>
        </DialogContent>

        <DialogActions
          sx={{
            px: 4,
            py: 3,
            borderTop: "1px solid #e2e8f0",
            background: "#fff",
            flexShrink: 0,
          }}
        >
          <Button
            onClick={onClose}
            variant="outlined"
            sx={{
              borderRadius: "12px",
              textTransform: "none",
              px: 2.5,
            }}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              borderRadius: "12px",
              textTransform: "none",
              px: 2.5,
              fontWeight: 700,
            }}
          >
            {loading ? "Updating..." : "Update User"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
