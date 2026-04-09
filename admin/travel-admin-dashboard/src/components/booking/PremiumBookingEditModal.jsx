import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  IconButton,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

export default function PremiumBookingEditModal({
  open,
  onClose,
  data,
  onSubmit,
  loading,
}) {
  const [form, setForm] = useState({
    bookingStatus: "",
    paymentStatus: "",
    paymentMethod: "",
  });

  useEffect(() => {
    if (!data || !open) return;

    setForm({
      bookingStatus: data?.bookingStatus || "",
      paymentStatus: data?.paymentStatus || "",
      paymentMethod: data?.paymentMethod || "",
    });
  }, [data, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit(form);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
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
          <div className="text-white fw-bold fs-4">Update Booking</div>
          <div className="text-white-50 mt-1">
            Change booking and payment related status
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ p: 4 }}>
          <div className="row g-3">
            <div className="col-12">
              <TextField
                fullWidth
                label="Booking ID"
                value={data?.bookingId || ""}
                disabled
              />
            </div>

            <div className="col-12">
              <TextField
                select
                fullWidth
                label="Booking Status"
                name="bookingStatus"
                value={form.bookingStatus}
                onChange={handleChange}
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="confirmed">Confirmed</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
              </TextField>
            </div>

            <div className="col-12">
              <TextField
                select
                fullWidth
                label="Payment Status"
                name="paymentStatus"
                value={form.paymentStatus}
                onChange={handleChange}
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="paid">Paid</MenuItem>
                <MenuItem value="failed">Failed</MenuItem>
                <MenuItem value="refunded">Refunded</MenuItem>
              </TextField>
            </div>

            <div className="col-12">
              <TextField
                select
                fullWidth
                label="Payment Method"
                name="paymentMethod"
                value={form.paymentMethod}
                onChange={handleChange}
              >
                <MenuItem value="upi">UPI</MenuItem>
                <MenuItem value="card">Card</MenuItem>
                <MenuItem value="netbanking">Net Banking</MenuItem>
                <MenuItem value="wallet">Wallet</MenuItem>
                <MenuItem value="cash">Cash</MenuItem>
              </TextField>
            </div>
          </div>
        </DialogContent>

        <DialogActions
          sx={{
            px: 4,
            py: 3,
            borderTop: "1px solid #e2e8f0",
            background: "#fff",
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
            {loading ? "Updating..." : "Update Booking"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
