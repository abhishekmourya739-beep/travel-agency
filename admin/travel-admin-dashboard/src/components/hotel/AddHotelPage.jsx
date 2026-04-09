import { useEffect, useState } from "react";
import {
  Button,
  TextField,
  MenuItem,
  Switch,
  FormControlLabel,
  IconButton,
  Avatar,
  CircularProgress,
} from "@mui/material";
import CloudUploadRoundedIcon from "@mui/icons-material/CloudUploadRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";

import { getAllLocations } from "../../services/location";

export default function AddHotelPage({ onSubmit, loading = false, onBack }) {
  const [locations, setLocations] = useState([]);
  const [dropdownLoading, setDropdownLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    location: "",
    description: "",
    rating: "",
    pricePerNight: "",
    roomsAvailable: "",
    hotelType: "",
    amenitiesText: "",
    isActive: true,
  });

  const [newImages, setNewImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  const getSafeArrayFromResponse = (response, type) => {
    const payload = response?.data;

    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.[type])) return payload[type];
    if (Array.isArray(payload?.data)) return payload.data;
    if (Array.isArray(payload?.data?.[type])) return payload.data[type];

    return [];
  };

  useEffect(() => {
    const loadLocations = async () => {
      try {
        setDropdownLoading(true);
        const locationsRes = await getAllLocations();
        const safeLocations = getSafeArrayFromResponse(
          locationsRes,
          "locations",
        );
        setLocations(safeLocations);
      } catch (err) {
        console.error("Failed to load locations", err);
        setLocations([]);
      } finally {
        setDropdownLoading(false);
      }
    };

    loadLocations();
  }, []);

  useEffect(() => {
    return () => {
      previewImages.forEach((img) => {
        try {
          URL.revokeObjectURL(img.url);
        } catch {}
      });
    };
  }, [previewImages]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setNewImages((prev) => [...prev, ...files]);
    setPreviewImages((prev) => [
      ...prev,
      ...files.map((file) => ({
        file,
        url: URL.createObjectURL(file),
      })),
    ]);

    e.target.value = "";
  };

  const removePreviewImage = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));

    setPreviewImages((prev) => {
      const target = prev[index];
      if (target?.url) {
        try {
          URL.revokeObjectURL(target.url);
        } catch {}
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const amenities = form.amenitiesText
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    const payload = new FormData();
    payload.append("name", form.name.trim());
    payload.append("location", form.location);
    payload.append("description", form.description.trim());
    payload.append("rating", Number(form.rating));
    payload.append("pricePerNight", Number(form.pricePerNight));
    payload.append("roomsAvailable", Number(form.roomsAvailable));
    payload.append("hotelType", form.hotelType);
    payload.append("isActive", form.isActive);
    payload.append("amenities", JSON.stringify(amenities));

    newImages.forEach((file) => {
      payload.append("images", file);
    });

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
                  Add Hotel
                </div>
                <div className="text-white-50 mt-1">
                  Create a new premium hotel
                </div>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-4 p-md-5">
            {dropdownLoading ? (
              <div
                className="d-flex align-items-center justify-content-center"
                style={{ minHeight: "250px" }}
              >
                <CircularProgress />
              </div>
            ) : (
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
                      Hotel Information
                    </div>

                    <div className="row g-3">
                      <div className="col-12">
                        <TextField
                          fullWidth
                          label="Hotel Name"
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="col-md-6">
                        <TextField
                          select
                          fullWidth
                          label="Location"
                          name="location"
                          value={form.location}
                          onChange={handleChange}
                        >
                          {Array.isArray(locations) &&
                            locations.map((loc) => (
                              <MenuItem key={loc._id} value={String(loc._id)}>
                                {loc.name}
                              </MenuItem>
                            ))}
                        </TextField>
                      </div>

                      <div className="col-md-6">
                        <TextField
                          select
                          fullWidth
                          label="Hotel Type"
                          name="hotelType"
                          value={form.hotelType}
                          onChange={handleChange}
                        >
                          <MenuItem value="luxury">Luxury</MenuItem>
                          <MenuItem value="resort">Resort</MenuItem>
                          <MenuItem value="boutique">Boutique</MenuItem>
                          <MenuItem value="budget">Budget</MenuItem>
                          <MenuItem value="business">Business</MenuItem>
                        </TextField>
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

                      <div className="col-md-4">
                        <TextField
                          fullWidth
                          type="number"
                          label="Rating"
                          name="rating"
                          value={form.rating}
                          onChange={handleChange}
                          inputProps={{ min: 0, max: 5, step: 0.1 }}
                        />
                      </div>

                      <div className="col-md-4">
                        <TextField
                          fullWidth
                          type="number"
                          label="Price Per Night"
                          name="pricePerNight"
                          value={form.pricePerNight}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="col-md-4">
                        <TextField
                          fullWidth
                          type="number"
                          label="Rooms Available"
                          name="roomsAvailable"
                          value={form.roomsAvailable}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="col-12">
                        <TextField
                          fullWidth
                          multiline
                          minRows={4}
                          label="Amenities"
                          name="amenitiesText"
                          value={form.amenitiesText}
                          onChange={handleChange}
                          placeholder="WiFi, Pool, Spa, Breakfast, Parking"
                          helperText="Enter amenities separated by commas"
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
                        Hotel Settings
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
                        Hotel Images
                      </div>

                      <div
                        className="rounded-4 p-3"
                        style={{
                          background: "#f8fafc",
                          border: "1px dashed #cbd5e1",
                        }}
                      >
                        <label
                          htmlFor="add-hotel-images"
                          className="d-inline-flex align-items-center gap-2 px-3 py-2 rounded-3"
                          style={{
                            cursor: "pointer",
                            background: "#eff6ff",
                            color: "#2563eb",
                            fontWeight: 600,
                          }}
                        >
                          <CloudUploadRoundedIcon fontSize="small" />
                          Upload Images
                        </label>

                        <input
                          id="add-hotel-images"
                          type="file"
                          hidden
                          multiple
                          accept="image/*"
                          onChange={handleImageUpload}
                        />

                        <div className="text-muted small mt-2">
                          Upload multiple images. The first image becomes the
                          thumbnail based on backend logic.
                        </div>

                        {previewImages.length > 0 ? (
                          <div className="mt-3">
                            <div className="fw-semibold text-dark mb-2">
                              Image Preview
                            </div>

                            <div className="d-flex flex-wrap gap-3">
                              {previewImages.map((img, index) => (
                                <div
                                  key={`${img.url}-${index}`}
                                  className="position-relative"
                                  style={{ width: 84, height: 84 }}
                                >
                                  <Avatar
                                    src={img.url}
                                    variant="rounded"
                                    sx={{
                                      width: 84,
                                      height: 84,
                                      borderRadius: "16px",
                                      border:
                                        index === 0
                                          ? "2px solid #2563eb"
                                          : "1px solid #e2e8f0",
                                    }}
                                  />

                                  <IconButton
                                    size="small"
                                    onClick={() => removePreviewImage(index)}
                                    sx={{
                                      position: "absolute",
                                      top: -8,
                                      right: -8,
                                      background: "#fff",
                                      boxShadow:
                                        "0 8px 20px rgba(15,23,42,0.18)",
                                      "&:hover": {
                                        background: "#fff1f2",
                                        color: "#e11d48",
                                      },
                                    }}
                                  >
                                    <DeleteOutlineRoundedIcon fontSize="small" />
                                  </IconButton>

                                  {index === 0 ? (
                                    <div
                                      className="position-absolute px-2 py-1"
                                      style={{
                                        left: 6,
                                        bottom: 6,
                                        borderRadius: "999px",
                                        fontSize: "10px",
                                        fontWeight: 700,
                                        background: "rgba(37,99,235,0.92)",
                                        color: "#fff",
                                      }}
                                    >
                                      Thumbnail
                                    </div>
                                  ) : null}
                                </div>
                              ))}
                            </div>
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
                            minWidth: "160px",
                          }}
                        >
                          {loading ? "Creating..." : "Create Hotel"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
