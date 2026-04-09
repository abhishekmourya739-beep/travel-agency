import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
} from "@mui/material";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

export default function ConfirmModal({
  open,
  onClose,
  onConfirm,
  loading = false,
  title = "Confirm Action",
  message = "Are you sure?",
  confirmText = "Confirm",
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      PaperProps={{
        sx: {
          borderRadius: "24px",
          overflow: "hidden",
        },
      }}
    >
      <div
        style={{
          padding: "18px 22px",
          position: "relative",
          background: "linear-gradient(135deg, #fff1f2, #ffffff)",
          borderBottom: "1px solid #ffe4e6",
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
          }}
        >
          <CloseRoundedIcon />
        </IconButton>

        <div className="d-flex align-items-center gap-3 pe-5">
          <div
            className="d-flex align-items-center justify-content-center"
            style={{
              width: 52,
              height: 52,
              borderRadius: "16px",
              background: "#fff1f2",
              color: "#e11d48",
            }}
          >
            <WarningAmberRoundedIcon />
          </div>

          <div>
            <div className="fw-bold fs-5 text-dark">{title}</div>
            <div className="text-muted small">
              Please review this action carefully.
            </div>
          </div>
        </div>
      </div>

      <DialogContent sx={{ px: 3, py: 3 }}>
        <div className="text-muted" style={{ lineHeight: 1.7 }}>
          {message}
        </div>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
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
          onClick={onConfirm}
          variant="contained"
          color="error"
          disabled={loading}
          sx={{
            borderRadius: "12px",
            textTransform: "none",
            px: 2.5,
            fontWeight: 700,
          }}
        >
          {loading ? "Deleting..." : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
