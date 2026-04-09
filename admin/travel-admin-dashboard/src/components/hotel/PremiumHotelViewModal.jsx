import {
  Dialog,
  DialogContent,
  IconButton,
  Chip,
  Avatar,
  Box,
  Rating,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import CurrencyRupeeRoundedIcon from "@mui/icons-material/CurrencyRupeeRounded";
import MeetingRoomRoundedIcon from "@mui/icons-material/MeetingRoomRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import ApartmentRoundedIcon from "@mui/icons-material/ApartmentRounded";

export default function PremiumHotelViewModal({ open, onClose, data }) {
  const gallery = [
    data?.thumbnail?.url,
    ...(data?.images || []).map((img) => img?.url),
  ]
    .filter(Boolean)
    .filter((img, index, arr) => index === arr.indexOf(img));

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          borderRadius: "24px",
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
          <div className="text-white fw-bold fs-4">
            {data?.name || "Hotel Details"}
          </div>
          <div className="text-white-50 mt-1">
            Premium hotel details overview
          </div>
        </div>
      </div>

      <DialogContent sx={{ p: 0 }}>
        <div className="p-4 p-md-5">
          <div className="row g-4">
            <div className="col-lg-7">
              <div
                className="rounded-4 overflow-hidden mb-3"
                style={{ height: 320, background: "#f8fafc" }}
              >
                {gallery[0] ? (
                  <img
                    src={gallery[0]}
                    alt={data?.name || "Hotel"}
                    className="w-100 h-100"
                    style={{ objectFit: "cover" }}
                  />
                ) : (
                  <div className="w-100 h-100 d-flex align-items-center justify-content-center text-muted">
                    No image
                  </div>
                )}
              </div>

              <div className="d-flex flex-wrap gap-2">
                {gallery.slice(0, 6).map((img, index) => (
                  <Avatar
                    key={index}
                    src={img}
                    variant="rounded"
                    sx={{
                      width: 72,
                      height: 72,
                      borderRadius: "14px",
                      boxShadow: "0 8px 20px rgba(15,23,42,0.08)",
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="col-lg-5">
              <div className="d-flex flex-wrap gap-2 mb-3">
                <Chip
                  label={data?.isActive ? "Active" : "Inactive"}
                  sx={{
                    fontWeight: 700,
                    background: data?.isActive ? "#ecfdf5" : "#f8fafc",
                    color: data?.isActive ? "#059669" : "#64748b",
                  }}
                />
                <Chip
                  label={data?.hotelType || "-"}
                  sx={{
                    textTransform: "capitalize",
                    fontWeight: 700,
                    background: "#eff6ff",
                    color: "#2563eb",
                  }}
                />
              </div>

              <div className="d-flex flex-column gap-3 mb-4">
                <InfoItem
                  icon={<PlaceRoundedIcon />}
                  label="Location"
                  value={
                    data?.location
                      ? `${data.location.name}${data.location.country ? `, ${data.location.country}` : ""}`
                      : "-"
                  }
                />
                <InfoItem
                  icon={<CurrencyRupeeRoundedIcon />}
                  label="Price Per Night"
                  value={`₹ ${Number(data?.pricePerNight || 0).toLocaleString("en-IN")}`}
                />
                <InfoItem
                  icon={<MeetingRoomRoundedIcon />}
                  label="Rooms Available"
                  value={data?.roomsAvailable ?? "-"}
                />
                <InfoItem
                  icon={<ApartmentRoundedIcon />}
                  label="Hotel Type"
                  value={data?.hotelType || "-"}
                />
              </div>

              <Box
                sx={{
                  p: 2.5,
                  borderRadius: "18px",
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  mb: 3,
                }}
              >
                <div className="fw-bold text-dark mb-2 d-flex align-items-center gap-2">
                  <StarRoundedIcon sx={{ color: "#f59e0b" }} />
                  Rating
                </div>

                <div className="d-flex align-items-center gap-2">
                  <Rating
                    value={Number(data?.rating || 0)}
                    precision={0.1}
                    readOnly
                  />
                  <span className="fw-semibold text-dark">
                    {data?.rating || 0}
                  </span>
                </div>
              </Box>

              <Box
                sx={{
                  p: 2.5,
                  borderRadius: "18px",
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  mb: 3,
                }}
              >
                <div className="fw-bold text-dark mb-2">Description</div>
                <div className="text-muted" style={{ lineHeight: 1.7 }}>
                  {data?.description || "No description available"}
                </div>
              </Box>

              <Box
                sx={{
                  p: 2.5,
                  borderRadius: "18px",
                  background: "#ffffff",
                  border: "1px solid #e2e8f0",
                }}
              >
                <div className="fw-bold text-dark mb-3">Amenities</div>

                {Array.isArray(data?.amenities) && data.amenities.length > 0 ? (
                  <div className="d-flex flex-wrap gap-2">
                    {data.amenities.map((item, index) => (
                      <Chip
                        key={`${item}-${index}`}
                        label={item}
                        size="small"
                        sx={{
                          fontWeight: 600,
                          background: "#f8fafc",
                          color: "#334155",
                          border: "1px solid #e2e8f0",
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-muted small">No amenities available</div>
                )}
              </Box>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function InfoItem({ icon, label, value }) {
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
        }}
      >
        {icon}
      </div>
      <div>
        <div className="small text-muted">{label}</div>
        <div className="fw-semibold text-dark">{value}</div>
      </div>
    </div>
  );
}
