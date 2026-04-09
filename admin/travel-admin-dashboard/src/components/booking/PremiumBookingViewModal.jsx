import {
  Dialog,
  DialogContent,
  IconButton,
  Avatar,
  Chip,
  Divider,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import PaymentsRoundedIcon from "@mui/icons-material/PaymentsRounded";
import ConfirmationNumberRoundedIcon from "@mui/icons-material/ConfirmationNumberRounded";
import LuggageRoundedIcon from "@mui/icons-material/LuggageRounded";

const formatDate = (value) => {
  if (!value) return "-";
  try {
    return new Date(value).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return value;
  }
};

const DetailItem = ({ icon, label, value }) => (
  <div className="col-md-6">
    <div
      className="rounded-4 p-3 h-100"
      style={{
        background: "#f8fafc",
        border: "1px solid #e2e8f0",
      }}
    >
      <div className="d-flex align-items-start gap-3">
        <div
          className="d-flex align-items-center justify-content-center"
          style={{
            width: 42,
            height: 42,
            borderRadius: 14,
            background: "#eff6ff",
            color: "#2563eb",
            flexShrink: 0,
          }}
        >
          {icon}
        </div>

        <div>
          <div className="text-muted small mb-1">{label}</div>
          <div className="fw-semibold text-dark">{value || "-"}</div>
        </div>
      </div>
    </div>
  </div>
);

export default function PremiumBookingViewModal({ open, onClose, data }) {
  const packageThumb =
    data?.travelPackage?.thumbnail?.url ||
    data?.travelPackage?.images?.[0]?.url ||
    "";

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
          <div className="text-white fw-bold fs-4">Booking Details</div>
          <div className="text-white-50 mt-1">
            Complete booking information and package overview
          </div>
        </div>
      </div>

      <DialogContent sx={{ p: 4 }}>
        <div className="row g-4">
          <div className="col-12">
            <div
              className="rounded-4 p-4"
              style={{
                background: "#fff",
                border: "1px solid #e2e8f0",
              }}
            >
              <div className="d-flex flex-column flex-md-row align-items-md-center gap-3">
                <Avatar
                  src={packageThumb}
                  variant="rounded"
                  sx={{
                    width: 84,
                    height: 84,
                    borderRadius: "20px",
                    border: "1px solid #e2e8f0",
                  }}
                />

                <div className="flex-grow-1">
                  <div className="fw-bold text-dark fs-5">
                    {data?.travelPackage?.title || "Package"}
                  </div>
                  <div className="text-muted mt-1">
                    {data?.travelPackage?.tripType || "-"} •{" "}
                    {data?.travelPackage?.duration
                      ? `${data.travelPackage.duration} Days`
                      : "-"}
                  </div>

                  <div className="d-flex flex-wrap gap-2 mt-3">
                    <Chip
                      label={data?.bookingStatus || "-"}
                      size="small"
                      sx={{
                        textTransform: "capitalize",
                        fontWeight: 700,
                        background: "#eff6ff",
                        color: "#2563eb",
                      }}
                    />
                    <Chip
                      label={data?.paymentStatus || "-"}
                      size="small"
                      sx={{
                        textTransform: "capitalize",
                        fontWeight: 700,
                        background: "#ecfdf5",
                        color: "#059669",
                      }}
                    />
                    <Chip
                      label={data?.paymentMethod || "-"}
                      size="small"
                      sx={{
                        textTransform: "uppercase",
                        fontWeight: 700,
                        background: "#fff7ed",
                        color: "#ea580c",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12">
            <Divider sx={{ my: 1 }} />
          </div>

          <div className="col-12">
            <div className="fw-bold text-dark fs-5 mb-3">
              Booking Information
            </div>
          </div>

          <DetailItem
            icon={<ConfirmationNumberRoundedIcon fontSize="small" />}
            label="Booking ID"
            value={data?.bookingId}
          />
          <DetailItem
            icon={<CalendarMonthRoundedIcon fontSize="small" />}
            label="Travel Date"
            value={formatDate(data?.travelDate)}
          />
          <DetailItem
            icon={<LuggageRoundedIcon fontSize="small" />}
            label="Number of People"
            value={data?.numberOfPeople}
          />
          <DetailItem
            icon={<PaymentsRoundedIcon fontSize="small" />}
            label="Total Price"
            value={`₹ ${Number(data?.totalPrice || 0).toLocaleString("en-IN")}`}
          />

          <div className="col-12 mt-2">
            <div className="fw-bold text-dark fs-5 mb-3">User Information</div>
          </div>

          <DetailItem
            icon={<PersonRoundedIcon fontSize="small" />}
            label="User Name"
            value={data?.user?.name}
          />
          <DetailItem
            icon={<EmailRoundedIcon fontSize="small" />}
            label="Email"
            value={data?.user?.email}
          />
          <DetailItem
            icon={<PhoneRoundedIcon fontSize="small" />}
            label="Contact"
            value={data?.user?.contact}
          />
          <DetailItem
            icon={<LuggageRoundedIcon fontSize="small" />}
            label="Payment Method"
            value={data?.paymentMethod?.toUpperCase()}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
