import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Chip,
  TextField,
  InputAdornment,
  Button,
  Avatar,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import PublicRoundedIcon from "@mui/icons-material/PublicRounded";
import TravelExploreRoundedIcon from "@mui/icons-material/TravelExploreRounded";

import AdminLayout from "../layouts/AdminLayout";
import {
  getAllLocations,
  updateLocation,
  deleteLocation,
} from "../services/location";
import PremiumLocationViewModal from "../components/location/PremiumLocationViewModal";
import PremiumLocationEditModal from "../components/location/PremiumLocationEditModal";
import ConfirmModal from "../components/common/ConfirmModal";
import LocationTableActions from "../components/location/LocationTableActions";
import { getApiErrorMessage } from "../utils/handleApiError";
import { successMessages } from "../utils/successMessages";
import { showError, showSuccess } from "../utils/ShowToast";

export default function Locations() {
  const navigate = useNavigate();

  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const fetchLocations = useCallback(async () => {
    try {
      const res = await getAllLocations();
      const data = res?.data?.data || res?.data?.locations || res?.data || [];
      setLocations(data);
    } catch (err) {
      const message = getApiErrorMessage(err, "Failed to load locations");
      setError(message);
      showError(message);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        await fetchLocations();
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [fetchLocations]);

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

  const handleUpdateLocation = async (formData) => {
    try {
      setActionLoading(true);
      setError("");

      await updateLocation(selectedRow?._id, formData);

      showSuccess(successMessages.locationUpdated);
      setEditOpen(false);
      setSelectedRow(null);
      await fetchLocations();
    } catch (err) {
      console.error("Failed to update location", err);

      const message = getApiErrorMessage(err, "Failed to update location");
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

      await deleteLocation(selectedRow?._id);

      showSuccess(successMessages.locationDeleted);
      setDeleteOpen(false);
      setSelectedRow(null);
      await fetchLocations();
    } catch (err) {
      console.error("Failed to delete location", err);

      const message = getApiErrorMessage(err, "Failed to delete location");
      setError(message);
      showError(message);
    } finally {
      setActionLoading(false);
    }
  };

  const filteredRows = useMemo(() => {
    const q = search.toLowerCase().trim();

    return locations.filter((location) => {
      return (
        location?.name?.toLowerCase().includes(q) ||
        location?.country?.toLowerCase().includes(q) ||
        location?.description?.toLowerCase().includes(q)
      );
    });
  }, [locations, search]);

  const columns = [
    {
      field: "name",
      headerName: "Location",
      flex: 1.5,
      minWidth: 280,
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
          <Avatar
            src={params.row?.image?.url || ""}
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
              }}
              title={params.row?.country || ""}
            >
              {params.row?.country || "-"}
            </div>
          </div>
        </div>
      ),
    },
    {
      field: "country",
      headerName: "Country",
      flex: 1,
      minWidth: 180,
      renderCell: (params) => (
        <div className="d-flex align-items-center gap-2">
          <PublicRoundedIcon sx={{ fontSize: 18, color: "#64748b" }} />
          <span>{params.row?.country || "-"}</span>
        </div>
      ),
    },
    {
      field: "description",
      headerName: "Description",
      flex: 1.8,
      minWidth: 320,
      renderCell: (params) => (
        <div
          style={{
            fontSize: "13px",
            color: "#475569",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            width: "100%",
          }}
          title={params.row?.description || ""}
        >
          {params.row?.description || "-"}
        </div>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.8,
      minWidth: 120,
      sortable: false,
      renderCell: (params) => (
        <Chip
          label={params.row?.isActive === false ? "Inactive" : "Active"}
          size="small"
          sx={{
            fontWeight: 700,
            background: params.row?.isActive === false ? "#f8fafc" : "#ecfdf5",
            color: params.row?.isActive === false ? "#64748b" : "#059669",
            border:
              params.row?.isActive === false
                ? "1px solid #e2e8f0"
                : "1px solid #d1fae5",
          }}
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      minWidth: 170,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <LocationTableActions
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
                <TravelExploreRoundedIcon fontSize="small" />
                Premium Destination Management
              </div>
              <h2 className="fw-bold text-white mb-2">Locations</h2>
              <p className="mb-0 text-white-50">
                Manage destination data, visuals and premium updates.
              </p>
            </div>

            <Button
              variant="contained"
              startIcon={<AddRoundedIcon />}
              onClick={() => navigate("/locations/add")}
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
              Add Location
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
              <h5 className="fw-bold mb-1">All Locations</h5>
              <p className="text-muted mb-0">
                View and manage all travel destinations.
              </p>
            </div>

            <Box sx={{ width: { xs: "100%", md: 360 } }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search by name, country or description"
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

      <PremiumLocationViewModal
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        data={selectedRow}
      />

      <PremiumLocationEditModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        data={selectedRow}
        onSubmit={handleUpdateLocation}
        loading={actionLoading}
      />

      <ConfirmModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        loading={actionLoading}
        title="Delete Location"
        message={`Are you sure you want to delete "${
          selectedRow?.name || "this location"
        }"? This action will deactivate the location.`}
        confirmText="Delete Location"
      />
    </AdminLayout>
  );
}
