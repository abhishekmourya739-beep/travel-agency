import { useEffect, useMemo, useState } from "react";
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
import { getAllHotels } from "../../services/hotel";

export default function AddPackagePage({ onSubmit, loading = false, onBack }) {
  const [locations, setLocations] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [dropdownLoading, setDropdownLoading] = useState(true);

  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    hotel: "",
    price: "",
    duration: "",
    tripType: "",
    isActive: true,
    isFeatured: false,
    itinerary: [{ day: 1, title: "", description: "" }],
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

  const handleItineraryChange = (index, field, value) => {
    setForm((prev) => ({
      ...prev,
      itinerary: prev.itinerary.map((item, i) =>
        i === index ? { ...item, [field]: value } : item,
      ),
    }));
  };

  const addItineraryDay = () => {
    setForm((prev) => ({
      ...prev,
      itinerary: [
        ...prev.itinerary,
        {
          day: prev.itinerary.length + 1,
          title: "",
          description: "",
        },
      ],
    }));
  };

  const removeItineraryDay = (index) => {
    setForm((prev) => {
      const updated = prev.itinerary
        .filter((_, i) => i !== index)
        .map((item, i) => ({
          ...item,
          day: i + 1,
        }));

      return {
        ...prev,
        itinerary: updated.length
          ? updated
          : [{ day: 1, title: "", description: "" }],
      };
    });
  };

  useEffect(() => {
    const loadDropdowns = async () => {
      try {
        setDropdownLoading(true);

        const [locationsRes, hotelsRes] = await Promise.all([
          getAllLocations(),
          getAllHotels(),
        ]);

        const safeLocations = getSafeArrayFromResponse(
          locationsRes,
          "locations",
        );
        const safeHotels = getSafeArrayFromResponse(hotelsRes, "hotels");

        setLocations(safeLocations);
        setHotels(safeHotels);
      } catch (err) {
        console.error("Failed to load dropdown data", err);
        setLocations([]);
        setHotels([]);
      } finally {
        setDropdownLoading(false);
      }
    };

    loadDropdowns();
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

  const filteredHotels = useMemo(() => {
    if (!form.location || !Array.isArray(hotels)) return [];

    return hotels.filter((hotel) => {
      const hotelLocationId = hotel?.location?._id || hotel?.location || "";
      return String(hotelLocationId) === String(form.location);
    });
  }, [hotels, form.location]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "location") {
      setForm((prev) => ({
        ...prev,
        location: value,
        hotel: "",
      }));
      return;
    }

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

    const payload = new FormData();
    payload.append("title", form.title.trim());
    payload.append("description", form.description.trim());
    payload.append("location", form.location);
    payload.append("hotel", form.hotel);
    payload.append("price", Number(form.price));
    payload.append("duration", Number(form.duration));
    payload.append("tripType", form.tripType);
    payload.append("isActive", form.isActive);
    payload.append("isFeatured", form.isFeatured);

    payload.append(
      "itinerary",
      JSON.stringify(
        form.itinerary.map((item, index) => ({
          day: index + 1,
          title: item.title.trim(),
          description: item.description.trim(),
        })),
      ),
    );

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
                  Add Package
                </div>
                <div className="text-white-50 mt-1">
                  Create a new premium travel package
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
                      Package Information
                    </div>

                    <div className="row g-3">
                      <div className="col-12">
                        <TextField
                          fullWidth
                          label="Package Title"
                          name="title"
                          value={form.title}
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
                          label="Hotel"
                          name="hotel"
                          value={form.hotel}
                          onChange={handleChange}
                          disabled={!form.location}
                          helperText={
                            form.location
                              ? filteredHotels.length
                                ? "Showing hotels for selected location"
                                : "No hotels available for this location"
                              : "Please select location first"
                          }
                        >
                          {Array.isArray(filteredHotels) &&
                            filteredHotels.map((hotel) => (
                              <MenuItem
                                key={hotel._id}
                                value={String(hotel._id)}
                              >
                                {hotel.name}
                              </MenuItem>
                            ))}
                        </TextField>
                      </div>

                      <div className="col-md-4">
                        <TextField
                          fullWidth
                          type="number"
                          label="Price"
                          name="price"
                          value={form.price}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="col-md-4">
                        <TextField
                          fullWidth
                          type="number"
                          label="Duration (Days)"
                          name="duration"
                          value={form.duration}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="col-md-4">
                        <TextField
                          select
                          fullWidth
                          label="Trip Type"
                          name="tripType"
                          value={form.tripType}
                          onChange={handleChange}
                        >
                          <MenuItem value="adventure">Adventure</MenuItem>
                          <MenuItem value="relaxation">Relaxation</MenuItem>
                          <MenuItem value="cultural">Cultural</MenuItem>
                          <MenuItem value="family">Family</MenuItem>
                          <MenuItem value="romantic">Romantic</MenuItem>
                        </TextField>
                      </div>

                      <div className="col-12">
                        <div
                          className="rounded-4 p-4 mt-2"
                          style={{
                            background: "#f8fafc",
                            border: "1px solid #e2e8f0",
                          }}
                        >
                          <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-3">
                            <div>
                              <div className="fw-bold text-dark fs-5">
                                Package Itinerary
                              </div>
                              <div className="text-muted small">
                                Add day-wise plan for this package
                              </div>
                            </div>

                            <Button
                              type="button"
                              variant="outlined"
                              onClick={addItineraryDay}
                              sx={{
                                borderRadius: "12px",
                                textTransform: "none",
                                fontWeight: 700,
                              }}
                            >
                              Add Day
                            </Button>
                          </div>

                          <div className="d-flex flex-column gap-3">
                            {form.itinerary.map((item, index) => (
                              <div
                                key={index}
                                className="rounded-4 p-3"
                                style={{
                                  background: "#ffffff",
                                  border: "1px solid #e2e8f0",
                                }}
                              >
                                <div className="d-flex align-items-center justify-content-between mb-3">
                                  <div className="fw-semibold text-dark">
                                    Day {index + 1}
                                  </div>

                                  {form.itinerary.length > 1 ? (
                                    <Button
                                      type="button"
                                      color="error"
                                      onClick={() => removeItineraryDay(index)}
                                      sx={{
                                        textTransform: "none",
                                        borderRadius: "10px",
                                      }}
                                    >
                                      Remove
                                    </Button>
                                  ) : null}
                                </div>

                                <div className="row g-3">
                                  <div className="col-12">
                                    <TextField
                                      fullWidth
                                      label={`Day ${index + 1} Title`}
                                      value={item.title}
                                      onChange={(e) =>
                                        handleItineraryChange(
                                          index,
                                          "title",
                                          e.target.value,
                                        )
                                      }
                                      placeholder="Arrival in Jaipur / Fort Tour / Leisure Day"
                                    />
                                  </div>

                                  <div className="col-12">
                                    <TextField
                                      fullWidth
                                      multiline
                                      minRows={3}
                                      label={`Day ${index + 1} Description`}
                                      value={item.description}
                                      onChange={(e) =>
                                        handleItineraryChange(
                                          index,
                                          "description",
                                          e.target.value,
                                        )
                                      }
                                      placeholder="Describe what happens on this day"
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
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
                        Package Settings
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
                              checked={form.isFeatured}
                              onChange={(e) =>
                                setForm((prev) => ({
                                  ...prev,
                                  isFeatured: e.target.checked,
                                }))
                              }
                            />
                          }
                          label="Featured Package"
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
                        Package Images
                      </div>

                      <div
                        className="rounded-4 p-3"
                        style={{
                          background: "#f8fafc",
                          border: "1px dashed #cbd5e1",
                        }}
                      >
                        <label
                          htmlFor="add-package-images"
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
                          id="add-package-images"
                          type="file"
                          hidden
                          multiple
                          accept="image/*"
                          onChange={handleImageUpload}
                        />

                        <div className="text-muted small mt-2">
                          Upload multiple images. The first image can become the
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
                            minWidth: "180px",
                          }}
                        >
                          {loading ? "Creating..." : "Create Package"}
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
