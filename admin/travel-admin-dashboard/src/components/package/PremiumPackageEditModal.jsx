import { useEffect, useMemo, useState } from "react";
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
import { getAllHotels } from "../../services/hotel";

export default function PremiumPackageEditModal({
  open,
  onClose,
  data,
  onSubmit,
  loading,
}) {
  const [locations, setLocations] = useState([]);
  const [hotels, setHotels] = useState([]);

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
  const [existingImages, setExistingImages] = useState([]);

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
        ...(prev.itinerary || []),
        {
          day: (prev.itinerary?.length || 0) + 1,
          title: "",
          description: "",
        },
      ],
    }));
  };

  const removeItineraryDay = (index) => {
    setForm((prev) => {
      const updated = (prev.itinerary || [])
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
      }
    };

    if (open) {
      loadDropdowns();
    }
  }, [open]);

  useEffect(() => {
    if (!data || !open) return;

    const selectedLocationId = data?.location?._id || data?.location || "";
    const selectedHotelId = data?.hotel?._id || data?.hotel || "";

    setForm({
      title: data?.title || "",
      description: data?.description || "",
      location: String(selectedLocationId),
      hotel: String(selectedHotelId),
      price: data?.price || "",
      duration: data?.duration || "",
      tripType: data?.tripType || "",
      isActive: data?.isActive ?? true,
      isFeatured: data?.isFeatured ?? false,
      itinerary:
        Array.isArray(data?.itinerary) && data.itinerary.length
          ? data.itinerary.map((item, index) => ({
              day: item?.day || index + 1,
              title: item?.title || "",
              description: item?.description || "",
            }))
          : [{ day: 1, title: "", description: "" }],
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

  const filteredHotels = useMemo(() => {
    if (!form.location || !Array.isArray(hotels)) return [];

    return hotels.filter((hotel) => {
      const hotelLocationId = hotel?.location?._id || hotel?.location || "";
      return String(hotelLocationId) === String(form.location);
    });
  }, [hotels, form.location]);

  useEffect(() => {
    if (!open) return;
    if (!form.location) return;
    if (!Array.isArray(hotels) || !hotels.length) return;
    if (!form.hotel) return;

    const selectedHotelStillValid = hotels.some((hotel) => {
      const hotelId = hotel?._id || "";
      const hotelLocationId = hotel?.location?._id || hotel?.location || "";

      return (
        String(hotelId) === String(form.hotel) &&
        String(hotelLocationId) === String(form.location)
      );
    });

    if (!selectedHotelStillValid) {
      setForm((prev) => ({
        ...prev,
        hotel: "",
      }));
    }
  }, [open, hotels, form.location, form.hotel]);

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

  const removeExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
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
        (form.itinerary || []).map((item, index) => ({
          day: index + 1,
          title: item.title.trim(),
          description: item.description.trim(),
        })),
      ),
    );

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
          <div className="text-white fw-bold fs-4">Edit Package</div>
          <div className="text-white-50 mt-1">
            Update package details, visibility and images
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
                minRows={4}
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
                    <MenuItem key={hotel._id} value={String(hotel._id)}>
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
                className="rounded-4 p-4"
                style={{
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                }}
              >
                <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-3">
                  <div>
                    <div className="fw-bold text-dark fs-6">
                      Package Itinerary
                    </div>
                    <div className="text-muted small">
                      Update day-wise plan for this package
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
                  {(form.itinerary || []).map((item, index) => (
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

                        {(form.itinerary || []).length > 1 ? (
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
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
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
                  htmlFor="package-images"
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
                  id="package-images"
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
            {loading ? "Updating..." : "Update Package"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
