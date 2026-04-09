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

import { getAllLocations } from "../../services/location";

export default function PremiumHotelEditModal({
  open,
  onClose,
  data,
  onSubmit,
  loading,
}) {
  const [locations, setLocations] = useState([]);
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
  const [existingImages, setExistingImages] = useState([]);

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
        const res = await getAllLocations();
        const safeLocations = getSafeArrayFromResponse(res, "locations");
        setLocations(safeLocations);
      } catch (err) {
        console.error("Failed to load locations", err);
        setLocations([]);
      }
    };

    if (open) {
      loadLocations();
    }
  }, [open]);

  useEffect(() => {
    if (!data || !open) return;

    setForm({
      name: data?.name || "",
      location: String(data?.location?._id || data?.location || ""),
      description: data?.description || "",
      rating: data?.rating || "",
      pricePerNight: data?.pricePerNight || "",
      roomsAvailable: data?.roomsAvailable || "",
      hotelType: data?.hotelType || "",
      amenitiesText: Array.isArray(data?.amenities)
        ? data.amenities.join(", ")
        : "",
      isActive: data?.isActive ?? true,
    });

    setNewImages([]);
    setPreviewImages([]);

    const uniqueExistingImages = [
      data?.thumbnail?.url
        ? {
            url: data.thumbnail.url,
            public_id: data.thumbnail.public_id || "",
            isThumbnail: true,
          }
        : null,
      ...(data?.images || []).map((img) => ({
        url: img?.url,
        public_id: img?.public_id || "",
        isThumbnail: false,
      })),
    ]
      .filter((item) => item?.url)
      .filter(
        (item, index, arr) =>
          index === arr.findIndex((x) => x.url === item.url),
      );

    setExistingImages(uniqueExistingImages);
  }, [data, open]);

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

  const removeExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
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

    existingImages.forEach((img) => {
      payload.append("existingImages", JSON.stringify(img));
    });

    newImages.forEach((file) => {
      payload.append("images", file);
    });

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
          <div className="text-white fw-bold fs-4">Edit Hotel</div>
          <div className="text-white-50 mt-1">
            Update hotel details, visibility and images
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
                minRows={4}
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
                minRows={3}
                label="Amenities"
                name="amenitiesText"
                value={form.amenitiesText}
                onChange={handleChange}
                placeholder="WiFi, Pool, Spa, Breakfast, Parking"
                helperText="Enter amenities separated by commas"
              />
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

            <div className="col-12">
              <div
                className="rounded-4 p-3"
                style={{
                  background: "#f8fafc",
                  border: "1px dashed #cbd5e1",
                }}
              >
                <div className="fw-semibold text-dark mb-2">Current Images</div>

                <div className="d-flex flex-wrap gap-3 mb-3">
                  {existingImages.length ? (
                    existingImages.map((img, index) => (
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
                            border: img.isThumbnail
                              ? "2px solid #2563eb"
                              : "1px solid #e2e8f0",
                          }}
                        />
                        <IconButton
                          size="small"
                          onClick={() => removeExistingImage(index)}
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

                        {img.isThumbnail ? (
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
                    ))
                  ) : (
                    <div className="text-muted small">No existing images</div>
                  )}
                </div>

                <label
                  htmlFor="hotel-images"
                  className="d-inline-flex align-items-center gap-2 px-3 py-2 rounded-3"
                  style={{
                    cursor: "pointer",
                    background: "#eff6ff",
                    color: "#2563eb",
                    fontWeight: 600,
                  }}
                >
                  <CloudUploadRoundedIcon fontSize="small" />
                  Add More Images
                </label>

                <input
                  id="hotel-images"
                  type="file"
                  hidden
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                />

                <div className="text-muted small mt-2">
                  You can remove old images and add new ones. The first final
                  image will be used as thumbnail.
                </div>

                {previewImages.length > 0 ? (
                  <div className="mt-3">
                    <div className="fw-semibold text-dark mb-2">
                      New Image Preview
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
                      ))}
                    </div>
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
            {loading ? "Updating..." : "Update Hotel"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
