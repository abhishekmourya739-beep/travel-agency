import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Box,
  Chip,
  TextField,
  InputAdornment,
  Avatar,
  Tooltip,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import PaymentsRoundedIcon from "@mui/icons-material/PaymentsRounded";
import LuggageRoundedIcon from "@mui/icons-material/LuggageRounded";
import BookOnlineRoundedIcon from "@mui/icons-material/BookOnlineRounded";

import AdminLayout from "../layouts/AdminLayout";
import { getAllBookings, updateBooking } from "../services/booking";
import PremiumBookingViewModal from "../components/booking/PremiumBookingViewModal";
import PremiumBookingEditModal from "../components/booking/PremiumBookingEditModal";
import BookingTableActions from "../components/booking/BookingTableActions";
// import { showSuccess, showError } from "../utils/showToast";
import { getApiErrorMessage } from "../utils/handleApiError";
import { showError, showSuccess } from "../utils/ShowToast";

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

const getStatusChipStyles = (status) => {
  switch (status) {
    case "confirmed":
      return {
        background: "#ecfdf5",
        color: "#059669",
        border: "1px solid #d1fae5",
      };
    case "cancelled":
      return {
        background: "#fff1f2",
        color: "#e11d48",
        border: "1px solid #fecdd3",
      };
    case "completed":
      return {
        background: "#eff6ff",
        color: "#2563eb",
        border: "1px solid #dbeafe",
      };
    default:
      return {
        background: "#fff7ed",
        color: "#ea580c",
        border: "1px solid #fed7aa",
      };
  }
};

const getPaymentChipStyles = (status) => {
  switch (status) {
    case "paid":
      return {
        background: "#ecfdf5",
        color: "#059669",
        border: "1px solid #d1fae5",
      };
    case "failed":
      return {
        background: "#fff1f2",
        color: "#e11d48",
        border: "1px solid #fecdd3",
      };
    case "refunded":
      return {
        background: "#f5f3ff",
        color: "#7c3aed",
        border: "1px solid #ddd6fe",
      };
    default:
      return {
        background: "#f8fafc",
        color: "#64748b",
        border: "1px solid #e2e8f0",
      };
  }
};

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const fetchBookings = useCallback(async () => {
    try {
      const res = await getAllBookings();
      setBookings(res?.data?.data || res?.data?.bookings || res?.data || []);
    } catch (err) {
      const message = getApiErrorMessage(err, "Failed to load bookings");
      setError(message);
      showError(message);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        await fetchBookings();
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [fetchBookings]);

  const handleView = (row) => {
    setSelectedRow(row);
    setViewOpen(true);
  };

  const handleEdit = (row) => {
    setSelectedRow(row);
    setEditOpen(true);
  };

  const handleUpdateBooking = async (payload) => {
    try {
      setActionLoading(true);
      setError("");

      await updateBooking(selectedRow?.bookingId, payload);

      showSuccess("Booking updated successfully");
      setEditOpen(false);
      setSelectedRow(null);
      await fetchBookings();
    } catch (err) {
      console.error("Failed to update booking", err);
      const message = getApiErrorMessage(err, "Failed to update booking");
      setError(message);
      showError(message);
    } finally {
      setActionLoading(false);
    }
  };

  const filteredRows = useMemo(() => {
    const q = search.toLowerCase().trim();

    return bookings.filter((booking) => {
      return (
        booking?.bookingId?.toLowerCase().includes(q) ||
        booking?.user?.name?.toLowerCase().includes(q) ||
        booking?.user?.email?.toLowerCase().includes(q) ||
        booking?.travelPackage?.title?.toLowerCase().includes(q) ||
        booking?.bookingStatus?.toLowerCase().includes(q) ||
        booking?.paymentStatus?.toLowerCase().includes(q)
      );
    });
  }, [bookings, search]);

  const columns = [
    {
      field: "booking",
      headerName: "Booking",
      flex: 1.8,
      minWidth: 320,
      sortable: false,
      renderCell: (params) => {
        const thumb = params.row?.travelPackage?.thumbnail?.url || "";

        return (
          <div
            className="d-flex align-items-center gap-3 w-100"
            style={{
              minWidth: 0,
              height: "100%",
              overflow: "hidden",
              padding: "10px 0",
            }}
          >
            <Avatar
              src={thumb}
              variant="rounded"
              sx={{
                width: 52,
                height: 52,
                borderRadius: "14px",
                flexShrink: 0,
                boxShadow: "0 8px 20px rgba(15,23,42,0.10)",
              }}
            />

            <div
              style={{
                minWidth: 0,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: "4px",
                lineHeight: 1.2,
              }}
            >
              <div
                className="fw-semibold text-dark"
                style={{
                  fontSize: "14px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
                title={params.row?.bookingId || ""}
              >
                {params.row?.bookingId || "-"}
              </div>

              <div
                className="text-muted"
                style={{
                  fontSize: "12px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
                title={params.row?.travelPackage?.title || ""}
              >
                {params.row?.travelPackage?.title || "No package"}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      field: "user",
      headerName: "User",
      flex: 1.2,
      minWidth: 240,
      sortable: false,
      renderCell: (params) => (
        <div
          className="d-flex align-items-center gap-3 w-100"
          style={{
            minWidth: 0,
            height: "100%",
            overflow: "hidden",
            padding: "10px 0",
          }}
        >
          <div
            className="d-flex align-items-center justify-content-center"
            style={{
              width: 40,
              height: 40,
              borderRadius: "12px",
              background: "#f8fafc",
              color: "#64748b",
              flexShrink: 0,
              border: "1px solid #e2e8f0",
            }}
          >
            <PersonRoundedIcon sx={{ fontSize: 18 }} />
          </div>

          <div
            style={{
              minWidth: 0,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: "4px",
              lineHeight: 1.2,
            }}
          >
            <div
              className="fw-semibold text-dark"
              style={{
                fontSize: "14px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
              title={params.row?.user?.name || ""}
            >
              {params.row?.user?.name || "-"}
            </div>

            <div
              className="text-muted"
              style={{
                fontSize: "12px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
              title={params.row?.user?.email || ""}
            >
              {params.row?.user?.email || "-"}
            </div>
          </div>
        </div>
      ),
    },
    {
      field: "travelDate",
      headerName: "Travel Date",
      flex: 0.9,
      minWidth: 140,
      renderCell: (params) => (
        <div className="d-flex align-items-center gap-2">
          <CalendarMonthRoundedIcon sx={{ fontSize: 18, color: "#64748b" }} />
          <span>{formatDate(params.row?.travelDate)}</span>
        </div>
      ),
    },
    {
      field: "people",
      headerName: "People",
      flex: 0.7,
      minWidth: 100,
      sortable: false,
      renderCell: (params) => (
        <div className="d-flex align-items-center gap-2">
          <LuggageRoundedIcon sx={{ fontSize: 18, color: "#64748b" }} />
          <span>{params.row?.numberOfPeople || "-"}</span>
        </div>
      ),
    },
    {
      field: "totalPrice",
      headerName: "Total",
      flex: 0.9,
      minWidth: 130,
      renderCell: (params) => (
        <div className="d-flex align-items-center gap-2">
          <PaymentsRoundedIcon sx={{ fontSize: 18, color: "#64748b" }} />
          <span className="fw-semibold text-dark">
            ₹ {Number(params.row?.totalPrice || 0).toLocaleString("en-IN")}
          </span>
        </div>
      ),
    },
    {
      field: "bookingStatus",
      headerName: "Booking Status",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <Chip
          label={params.row?.bookingStatus || "-"}
          size="small"
          sx={{
            textTransform: "capitalize",
            fontWeight: 700,
            ...getStatusChipStyles(params.row?.bookingStatus),
          }}
        />
      ),
    },
    {
      field: "paymentStatus",
      headerName: "Payment Status",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <Chip
          label={params.row?.paymentStatus || "-"}
          size="small"
          sx={{
            textTransform: "capitalize",
            fontWeight: 700,
            ...getPaymentChipStyles(params.row?.paymentStatus),
          }}
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.9,
      minWidth: 130,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <BookingTableActions
          row={params.row}
          onView={handleView}
          onEdit={handleEdit}
        />
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="container-fluid px-0">
        <div
          className="rounded-4 p-4 p-md-5 mb-4 position-relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, #0f172a 0%, #1e293b 45%, #2563eb 100%)",
            boxShadow: "0 20px 50px rgba(15,23,42,0.18)",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-40px",
              right: "-50px",
              width: 180,
              height: 180,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.08)",
            }}
          />
          <div className="position-relative d-flex flex-column flex-lg-row justify-content-between gap-4 align-items-lg-center">
            <div>
              <div
                className="d-inline-flex align-items-center gap-2 px-3 py-2 rounded-pill mb-3"
                style={{
                  background: "rgba(255,255,255,0.10)",
                  color: "#fff",
                  fontSize: 14,
                }}
              >
                <BookOnlineRoundedIcon fontSize="small" />
                Premium Booking Management
              </div>
              <h2 className="fw-bold text-white mb-2">Bookings</h2>
              <p className="mb-0 text-white-50">
                View and update customer bookings with premium admin controls.
              </p>
            </div>
          </div>
        </div>

        <div
          className="rounded-4 p-3 p-md-4 mb-4"
          style={{
            background: "#fff",
            border: "1px solid rgba(15,23,42,0.06)",
            boxShadow: "0 14px 34px rgba(15,23,42,0.06)",
          }}
        >
          <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-3">
            <div>
              <h5 className="fw-bold mb-1">All Bookings</h5>
              <p className="text-muted mb-0">
                Manage booking status and payment updates.
              </p>
            </div>

            <Box sx={{ width: { xs: "100%", md: 360 } }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search by booking ID, user, package or status"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchRoundedIcon sx={{ color: "#64748b" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "14px",
                    background: "#f8fafc",
                  },
                }}
              />
            </Box>
          </div>

          {error ? (
            <div className="alert alert-danger rounded-4 mb-0">{error}</div>
          ) : (
            <Box sx={{ width: "100%" }}>
              <DataGrid
                rows={filteredRows}
                columns={columns}
                getRowId={(row) => row._id}
                loading={loading}
                autoHeight
                pageSizeOptions={[5, 10, 20]}
                initialState={{
                  pagination: {
                    paginationModel: { pageSize: 10, page: 0 },
                  },
                }}
                disableRowSelectionOnClick
                rowHeight={78}
                sx={{
                  border: 0,
                  "& .MuiDataGrid-columnHeaders": {
                    background: "#f8fafc",
                    borderRadius: "14px",
                    fontWeight: 700,
                  },
                  "& .MuiDataGrid-columnHeaderTitle": {
                    fontWeight: 700,
                    color: "#0f172a",
                  },
                  "& .MuiDataGrid-cell": {
                    borderColor: "rgba(15,23,42,0.06)",
                    display: "flex",
                    alignItems: "center",
                    overflow: "hidden",
                  },
                  "& .MuiDataGrid-row": {
                    maxHeight: "78px !important",
                    minHeight: "78px !important",
                  },
                  "& .MuiDataGrid-cellContent": {
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  },
                  "& .MuiDataGrid-row:hover": {
                    backgroundColor: "#f8fbff",
                  },
                  "& .MuiDataGrid-footerContainer": {
                    borderTop: "1px solid rgba(15,23,42,0.06)",
                  },
                }}
              />
            </Box>
          )}
        </div>
      </div>

      <PremiumBookingViewModal
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        data={selectedRow}
      />

      <PremiumBookingEditModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        data={selectedRow}
        onSubmit={handleUpdateBooking}
        loading={actionLoading}
      />
    </AdminLayout>
  );
}
