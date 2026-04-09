import { useEffect, useState } from "react";
import { Button, TextField, IconButton, Avatar } from "@mui/material";
import CloudUploadRoundedIcon from "@mui/icons-material/CloudUploadRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";

export default function AddLocationPage({ onSubmit, loading = false, onBack }) {
  const [form, setForm] = useState({
    name: "",
    country: "",
    description: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState("");

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

    setImageFile(file);
    setPreviewImage(URL.createObjectURL(file));
    e.target.value = "";
  };

  const removeSelectedImage = () => {
    if (previewImage && previewImage.startsWith("blob:")) {
      try {
        URL.revokeObjectURL(previewImage);
      } catch {}
    }

    setImageFile(null);
    setPreviewImage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = new FormData();
    payload.append("name", form.name.trim());
    payload.append("country", form.country.trim());
    payload.append("description", form.description.trim());

    if (imageFile) {
      payload.append("image", imageFile);
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
                  Add Location
                </div>
                <div className="text-white-50 mt-1">
                  Create a new premium destination
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
                    Location Information
                  </div>

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
                      Location Image
                    </div>

                    <div
                      className="rounded-4 p-3"
                      style={{
                        background: "#f8fafc",
                        border: "1px dashed #cbd5e1",
                      }}
                    >
                      <label
                        htmlFor="add-location-image"
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
                        id="add-location-image"
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleImageUpload}
                      />

                      <div className="text-muted small mt-2">
                        Upload a premium image for this location.
                      </div>

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
                          minWidth: "180px",
                        }}
                      >
                        {loading ? "Creating..." : "Create Location"}
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
