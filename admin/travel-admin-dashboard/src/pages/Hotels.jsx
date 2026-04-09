import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Chip,
  TextField,
  InputAdornment,
  Button,
  Avatar,
  Tooltip,
  Rating,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import CurrencyRupeeRoundedIcon from "@mui/icons-material/CurrencyRupeeRounded";
import MeetingRoomRoundedIcon from "@mui/icons-material/MeetingRoomRounded";
import ApartmentRoundedIcon from "@mui/icons-material/ApartmentRounded";

import AdminLayout from "../layouts/AdminLayout";
import { getAllHotels, updateHotel, deleteHotel } from "../services/hotel";
import PremiumHotelViewModal from "../components/hotel/PremiumHotelViewModal";
import PremiumHotelEditModal from "../components/hotel/PremiumHotelEditModal";
import ConfirmModal from "../components/common/ConfirmModal";
import HotelTableActions from "../components/hotel/HotelTableActions";
import { getApiErrorMessage } from "../utils/handleApiError";
import { successMessages } from "../utils/successMessages";
import { showError, showSuccess } from "../utils/ShowToast";

export default function Hotels() {
  const navigate = useNavigate();

  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const fetchHotels = useCallback(async () => {
    try {
      const res = await getAllHotels();
      setHotels(res?.data?.hotels || res?.data || []);
    } catch (err) {
      const message = getApiErrorMessage(err, "Failed to load hotels");
      setError(message);
      showError(message);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        await fetchHotels();
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [fetchHotels]);

  const handleView = (row) => {
    setSelectedRow(row);
    setViewOpen(true);
  };

  const handleEdit = (row) => {
    setSelectedRow(row);
    setEditOpen(true);
  };

  const handleDelete = (row) => {
    setSelectedRow(row);
    setDeleteOpen(true);
  };

  const handleUpdateHotel = async (formData) => {
    try {
      setActionLoading(true);
      setError("");

      await updateHotel(selectedRow?._id, formData);

      showSuccess(successMessages.hotelUpdated || "Hotel updated successfully");
      setEditOpen(false);
      setSelectedRow(null);
      await fetchHotels();
    } catch (err) {
      console.error("Failed to update hotel", err);

      const message = getApiErrorMessage(err, "Failed to update hotel");
      setError(message);
      showError(message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      setActionLoading(true);
      setError("");

      await deleteHotel(selectedRow?._id);

      showSuccess(successMessages.hotelDeleted || "Hotel deleted successfully");
      setDeleteOpen(false);
      setSelectedRow(null);
      await fetchHotels();
    } catch (err) {
      console.error("Failed to delete hotel", err);

      const message = getApiErrorMessage(err, "Failed to delete hotel");
      setError(message);
      showError(message);
    } finally {
      setActionLoading(false);
    }
  };

  const filteredRows = useMemo(() => {
    const q = search.toLowerCase().trim();

    return hotels.filter((hotel) => {
      return (
        hotel?.name?.toLowerCase().includes(q) ||
        hotel?.hotelType?.toLowerCase().includes(q) ||
        hotel?.location?.name?.toLowerCase().includes(q) ||
        hotel?.location?.country?.toLowerCase().includes(q)
      );
    });
  }, [hotels, search]);

  const columns = [
    {
      field: "name",
      headerName: "Hotel",
      flex: 1.7,
      minWidth: 320,
      renderCell: (params) => {
        const thumb =
          params.row?.thumbnail?.url || params.row?.images?.[0]?.url || "";

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
                title={params.row?.name || ""}
              >
                {params.row?.name || "-"}
              </div>

              <div
                className="text-muted"
                style={{
                  fontSize: "12px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  textTransform: "capitalize",
                }}
                title={params.row?.hotelType || ""}
              >
                {params.row?.hotelType || "No type"}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      field: "location",
      headerName: "Location",
      flex: 1,
      minWidth: 180,
      renderCell: (params) => (
        <div className="d-flex align-items-center gap-2">
          <PlaceRoundedIcon sx={{ fontSize: 18, color: "#64748b" }} />
          <span>
            {params.row?.location?.name
              ? `${params.row.location.name}${params.row.location.country ? `, ${params.row.location.country}` : ""}`
              : "-"}
          </span>
        </div>
      ),
    },
    {
      field: "rating",
      headerName: "Rating",
      flex: 0.9,
      minWidth: 140,
      renderCell: (params) => (
        <div className="d-flex align-items-center gap-2">
          <Rating
            value={Number(params.row?.rating || 0)}
            precision={0.1}
            readOnly
            size="small"
          />
          <span className="fw-semibold text-dark">
            {params.row?.rating || 0}
          </span>
        </div>
      ),
    },
    {
      field: "pricePerNight",
      headerName: "Price/Night",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <div className="d-flex align-items-center gap-2">
          <CurrencyRupeeRoundedIcon sx={{ fontSize: 18, color: "#64748b" }} />
          <span className="fw-semibold text-dark">
            {Number(params.row?.pricePerNight || 0).toLocaleString("en-IN")}
          </span>
        </div>
      ),
    },
    {
      field: "roomsAvailable",
      headerName: "Rooms",
      flex: 0.8,
      minWidth: 120,
      renderCell: (params) => (
        <div className="d-flex align-items-center gap-2">
          <MeetingRoomRoundedIcon sx={{ fontSize: 18, color: "#64748b" }} />
          <span>{params.row?.roomsAvailable ?? "-"}</span>
        </div>
      ),
    },
    {
      field: "hotelType",
      headerName: "Type",
      flex: 0.9,
      minWidth: 130,
      renderCell: (params) => {
        const value = params.row?.hotelType || "-";
        return (
          <Chip
            label={value}
            size="small"
            sx={{
              textTransform: "capitalize",
              fontWeight: 600,
              background: "#eff6ff",
              color: "#2563eb",
              border: "1px solid #dbeafe",
            }}
          />
        );
      },
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.9,
      minWidth: 130,
      sortable: false,
      renderCell: (params) =>
        params.row?.isActive ? (
          <Chip
            label="Active"
            size="small"
            sx={{
              fontWeight: 700,
              background: "#ecfdf5",
              color: "#059669",
              border: "1px solid #d1fae5",
            }}
          />
        ) : (
          <Chip
            label="Inactive"
            size="small"
            sx={{
              fontWeight: 700,
              background: "#f8fafc",
              color: "#64748b",
              border: "1px solid #e2e8f0",
            }}
          />
        ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      minWidth: 180,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <HotelTableActions
          row={params.row}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
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
                <ApartmentRoundedIcon fontSize="small" />
                Premium Hotel Management
              </div>
              <h2 className="fw-bold text-white mb-2">Hotels</h2>
              <p className="mb-0 text-white-50">
                Manage hotel inventory with premium actions, rich previews and
                quick updates.
              </p>
            </div>

            <Button
              variant="contained"
              startIcon={<AddRoundedIcon />}
              onClick={() => navigate("/hotels/add")}
              sx={{
                alignSelf: "flex-start",
                borderRadius: "14px",
                px: 2.5,
                py: 1.2,
                textTransform: "none",
                fontWeight: 700,
                background: "#fff",
                color: "#0f172a",
                "&:hover": {
                  background: "#f8fafc",
                },
              }}
            >
              Add Hotel
            </Button>
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
              <h5 className="fw-bold mb-1">All Hotels</h5>
              <p className="text-muted mb-0">
                Showing the most useful hotel information.
              </p>
            </div>

            <Box sx={{ width: { xs: "100%", md: 360 } }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search by hotel, type, location or country"
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

      <PremiumHotelViewModal
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        data={selectedRow}
      />

      <PremiumHotelEditModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        data={selectedRow}
        onSubmit={handleUpdateHotel}
        loading={actionLoading}
      />

      <ConfirmModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        loading={actionLoading}
        title="Delete Hotel"
        message={`Are you sure you want to delete "${
          selectedRow?.name || "this hotel"
        }"? This action cannot be undone.`}
        confirmText="Delete Hotel"
      />
    </AdminLayout>
  );
}
