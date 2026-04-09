import { Dialog, DialogContent, IconButton, Avatar, Chip } from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import PublicRoundedIcon from "@mui/icons-material/PublicRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";

const DetailCard = ({ icon, label, value }) => (
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

        <div className="flex-grow-1">
          <div className="text-muted small mb-1">{label}</div>
          <div
            className="fw-semibold text-dark"
            style={{
              wordBreak: "break-word",
            }}
          >
            {value || "-"}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default function PremiumLocationViewModal({ open, onClose, data }) {
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
          <div className="text-white fw-bold fs-4">Location Details</div>
          <div className="text-white-50 mt-1">Premium destination overview</div>
        </div>
      </div>

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
                  src={data?.image?.url || ""}
                  variant="rounded"
                  sx={{
                    width: 92,
                    height: 92,
                    borderRadius: "20px",
                    border: "1px solid #e2e8f0",
                    flexShrink: 0,
                  }}
                />

                <div className="flex-grow-1 min-w-0">
                  <div
                    className="fw-bold text-dark fs-4"
                    style={{
                      wordBreak: "break-word",
                    }}
                  >
                    {data?.name || "-"}
                  </div>

                  <div
                    className="text-muted mt-1"
                    style={{
                      wordBreak: "break-word",
                    }}
                  >
                    {data?.country || "-"}
                  </div>

                  <div className="d-flex flex-wrap gap-2 mt-3">
                    <Chip
                      label={data?.isActive === false ? "Inactive" : "Active"}
                      size="small"
                      sx={{
                        fontWeight: 700,
                        background:
                          data?.isActive === false ? "#f8fafc" : "#ecfdf5",
                        color: data?.isActive === false ? "#64748b" : "#059669",
                        border:
                          data?.isActive === false
                            ? "1px solid #e2e8f0"
                            : "1px solid #d1fae5",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DetailCard
            icon={<PlaceRoundedIcon fontSize="small" />}
            label="Location Name"
            value={data?.name}
          />

          <DetailCard
            icon={<PublicRoundedIcon fontSize="small" />}
            label="Country"
            value={data?.country}
          />

          <div className="col-12">
            <div
              className="rounded-4 p-3"
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
                  <DescriptionRoundedIcon fontSize="small" />
                </div>

                <div className="flex-grow-1">
                  <div className="text-muted small mb-1">Description</div>
                  <div
                    className="fw-semibold text-dark"
                    style={{
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                    }}
                  >
                    {data?.description || "-"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
