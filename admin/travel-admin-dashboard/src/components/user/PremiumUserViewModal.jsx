import {
  Dialog,
  DialogContent,
  IconButton,
  Chip,
  Avatar,
  Box,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import BadgeRoundedIcon from "@mui/icons-material/BadgeRounded";
import EventRoundedIcon from "@mui/icons-material/EventRounded";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";

export default function PremiumUserViewModal({ open, onClose, data }) {
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
            {data?.name || "User Details"}
          </div>
          <div className="text-white-50 mt-1">
            Premium user details overview
          </div>
        </div>
      </div>

      <DialogContent sx={{ p: 0 }}>
        <div className="p-4 p-md-5">
          <div className="row g-4">
            <div className="col-lg-4">
              <div
                className="rounded-4 p-4 text-center h-100"
                style={{
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                }}
              >
                <Avatar
                  src={data?.image?.url || ""}
                  alt={data?.name || "User"}
                  sx={{
                    width: 120,
                    height: 120,
                    margin: "0 auto",
                    mb: 2,
                    boxShadow: "0 12px 30px rgba(15,23,42,0.12)",
                  }}
                />

                <div className="fw-bold text-dark fs-5">
                  {data?.name || "-"}
                </div>
                <div className="text-muted mt-1">{data?.email || "-"}</div>

                <div className="d-flex flex-wrap justify-content-center gap-2 mt-3">
                  <Chip
                    label={data?.isActive ? "Active" : "Inactive"}
                    sx={{
                      fontWeight: 700,
                      background: data?.isActive ? "#ecfdf5" : "#f8fafc",
                      color: data?.isActive ? "#059669" : "#64748b",
                    }}
                  />

                  <Chip
                    label={data?.role || "user"}
                    sx={{
                      textTransform: "capitalize",
                      fontWeight: 700,
                      background: "#eff6ff",
                      color: "#2563eb",
                    }}
                  />

                  <Chip
                    label={data?.isVerified ? "Verified" : "Not Verified"}
                    sx={{
                      fontWeight: 700,
                      background: data?.isVerified ? "#ecfeff" : "#fff7ed",
                      color: data?.isVerified ? "#0891b2" : "#ea580c",
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="col-lg-8">
              <div className="d-flex flex-column gap-3 mb-4">
                <InfoItem
                  icon={<PersonRoundedIcon />}
                  label="Full Name"
                  value={data?.name || "-"}
                />
                <InfoItem
                  icon={<EmailRoundedIcon />}
                  label="Email"
                  value={data?.email || "-"}
                />
                <InfoItem
                  icon={<PhoneRoundedIcon />}
                  label="Contact"
                  value={data?.contact || "-"}
                />
                <InfoItem
                  icon={<BadgeRoundedIcon />}
                  label="Role"
                  value={data?.role || "user"}
                />
                <InfoItem
                  icon={<VerifiedRoundedIcon />}
                  label="Verification Status"
                  value={data?.isVerified ? "Verified" : "Not Verified"}
                />
                <InfoItem
                  icon={<EventRoundedIcon />}
                  label="Created At"
                  value={
                    data?.createdAt
                      ? new Date(data.createdAt).toLocaleString("en-IN")
                      : "-"
                  }
                />
              </div>

              <Box
                sx={{
                  p: 2.5,
                  borderRadius: "18px",
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                }}
              >
                <div className="fw-bold text-dark mb-2">Profile Summary</div>
                <div className="text-muted" style={{ lineHeight: 1.7 }}>
                  This user account belongs to{" "}
                  <span className="fw-semibold text-dark">
                    {data?.name || "this user"}
                  </span>
                  , with role{" "}
                  <span className="fw-semibold text-dark text-capitalize">
                    {data?.role || "user"}
                  </span>
                  . Current account status is{" "}
                  <span className="fw-semibold text-dark">
                    {data?.isActive ? "Active" : "Inactive"}
                  </span>{" "}
                  and verification status is{" "}
                  <span className="fw-semibold text-dark">
                    {data?.isVerified ? "Verified" : "Not Verified"}
                  </span>
                  .
                </div>
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
      <div style={{ minWidth: 0 }}>
        <div className="small text-muted">{label}</div>
        <div
          className="fw-semibold text-dark"
          style={{
            wordBreak: "break-word",
          }}
        >
          {value}
        </div>
      </div>
    </div>
  );
}
