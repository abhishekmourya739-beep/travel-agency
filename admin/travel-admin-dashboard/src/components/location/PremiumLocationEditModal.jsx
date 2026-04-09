import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
  Avatar,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import CloudUploadRoundedIcon from "@mui/icons-material/CloudUploadRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";

export default function PremiumLocationEditModal({
  open,
  onClose,
  data,
  onSubmit,
  loading,
}) {
  const [form, setForm] = useState({
    name: "",
    country: "",
    description: "",
  });

  const [newImage, setNewImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");

  useEffect(() => {
    if (!open || !data) return;

    setForm({
      name: data?.name || "",
      country: data?.country || "",
      description: data?.description || "",
    });

    setNewImage(null);
    setPreviewImage(data?.image?.url || "");
  }, [open, data]);

  useEffect(() => {
    return () => {
      if (previewImage && previewImage.startsWith("blob:")) {
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

    if (previewImage && previewImage.startsWith("blob:")) {
      try {
        URL.revokeObjectURL(previewImage);
      } catch {}
    }

    const objectUrl = URL.createObjectURL(file);
    setNewImage(file);
    setPreviewImage(objectUrl);
    e.target.value = "";
  };

  const removeSelectedImage = () => {
    if (previewImage && previewImage.startsWith("blob:")) {
      try {
        URL.revokeObjectURL(previewImage);
      } catch {}
    }

    setNewImage(null);
    setPreviewImage(data?.image?.url || "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = new FormData();
    payload.append("name", form.name.trim());
    payload.append("country", form.country.trim());
    payload.append("description", form.description.trim());

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
      scroll="paper"
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
          <div className="text-white fw-bold fs-4">Update Location</div>
          <div className="text-white-50 mt-1">
            Edit destination details and image
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
            p: 4,
            flex: 1,
            minHeight: 0,
            overflowY: "auto",
            overflowX: "hidden",
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
                label="Location Name"
                name="name"
                value={form.name}
                onChange={handleChange}
              />
            </div>

            <div className="col-12">
              <TextField
                fullWidth
                label="Country"
                name="country"
                value={form.country}
                onChange={handleChange}
              />
            </div>

            <div className="col-12">
              <TextField
                fullWidth
                multiline
                minRows={5}
                label="Description"
                name="description"
                value={form.description}
                onChange={handleChange}
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
                <div className="fw-semibold text-dark mb-2">Location Image</div>

                <label
                  htmlFor="edit-location-image"
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
                  id="edit-location-image"
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageUpload}
                />

                {previewImage ? (
                  <div
                    className="mt-3 position-relative"
                    style={{ width: 110 }}
                  >
                    <Avatar
                      src={previewImage}
                      variant="rounded"
                      sx={{
                        width: 110,
                        height: 110,
                        borderRadius: "18px",
                        border: "1px solid #e2e8f0",
                      }}
                    />

                    <IconButton
                      size="small"
                      onClick={removeSelectedImage}
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
                ) : null}
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
            {loading ? "Updating..." : "Update Location"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
