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
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremium";

import AdminLayout from "../layouts/AdminLayout";
import {
  getAllPackages,
  updatePackage,
  deletePackage,
} from "../services/package";
import PremiumPackageViewModal from "../components/package/PremiumPackageViewModal";
import PremiumPackageEditModal from "../components/package/PremiumPackageEditModal";
import ConfirmModal from "../components/common/ConfirmModal";
import PackageTableActions from "../components/package/PackageTableActions";
import { getApiErrorMessage } from "../utils/handleApiError";
import { successMessages } from "../utils/successMessages";
import { showError, showSuccess } from "../utils/ShowToast";

export default function Packages() {
  const navigate = useNavigate();

  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const fetchPackages = useCallback(async () => {
    try {
      const res = await getAllPackages();
      setPackages(res?.data?.packages || res?.data || []);
    } catch (err) {
      const message = getApiErrorMessage(err, "Failed to load packages");
      setError(message);
      showError(message);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        await fetchPackages();
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [fetchPackages]);

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

  const handleUpdatePackage = async (formData) => {
    try {
      setActionLoading(true);
      setError("");

      await updatePackage(selectedRow?._id, formData);

      showSuccess(successMessages.packageUpdated);
      setEditOpen(false);
      setSelectedRow(null);
      await fetchPackages();
    } catch (err) {
      console.error("Failed to update package", err);

      const message = getApiErrorMessage(err, "Failed to update package");
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

      await deletePackage(selectedRow?._id);

      showSuccess(successMessages.packageDeleted);
      setDeleteOpen(false);
      setSelectedRow(null);
      await fetchPackages();
    } catch (err) {
      console.error("Failed to delete package", err);

      const message = getApiErrorMessage(err, "Failed to delete package");
      setError(message);
      showError(message);
    } finally {
      setActionLoading(false);
    }
  };

  const filteredRows = useMemo(() => {
    const q = search.toLowerCase().trim();

    return packages.filter((pkg) => {
      return (
        pkg?.title?.toLowerCase().includes(q) ||
        pkg?.tripType?.toLowerCase().includes(q) ||
        pkg?.location?.name?.toLowerCase().includes(q) ||
        pkg?.hotel?.name?.toLowerCase().includes(q)
      );
    });
  }, [packages, search]);

  const columns = [
    {
      field: "title",
      headerName: "Package",
      flex: 1.7,
      minWidth: 300,
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
                title={params.row?.title || ""}
              >
                {params.row?.title || "-"}
              </div>

              <div
                className="text-muted"
                style={{
                  fontSize: "12px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
                title={params.row?.hotel?.name || ""}
              >
                {params.row?.hotel?.name || "No hotel selected"}
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
      minWidth: 150,
      renderCell: (params) => (
        <div className="d-flex align-items-center gap-2">
          <PlaceRoundedIcon sx={{ fontSize: 18, color: "#64748b" }} />
          <span>{params.row?.location?.name || "-"}</span>
        </div>
      ),
    },
    {
      field: "price",
      headerName: "Price",
      flex: 0.9,
      minWidth: 120,
      renderCell: (params) => (
        <span className="fw-semibold text-dark">
          ₹ {Number(params.row?.price || 0).toLocaleString("en-IN")}
        </span>
      ),
    },
    {
      field: "duration",
      headerName: "Duration",
      flex: 0.9,
      minWidth: 120,
      renderCell: (params) => (
        <div className="d-flex align-items-center gap-2">
          <AccessTimeRoundedIcon sx={{ fontSize: 18, color: "#64748b" }} />
          <span>
            {params.row?.duration ? `${params.row.duration} Days` : "-"}
          </span>
        </div>
      ),
    },
    {
      field: "tripType",
      headerName: "Trip Type",
      flex: 0.9,
      minWidth: 130,
      renderCell: (params) => {
        const value = params.row?.tripType || "-";
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
      flex: 1,
      minWidth: 170,
      sortable: false,
      renderCell: (params) => (
        <div className="d-flex align-items-center gap-2 flex-wrap">
          {params.row?.isActive ? (
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
          )}

          {params.row?.isFeatured ? (
            <Tooltip title="Featured package">
              <Chip
                icon={<WorkspacePremiumRoundedIcon />}
                label="Featured"
                size="small"
                sx={{
                  fontWeight: 700,
                  background: "#fff7ed",
                  color: "#ea580c",
                  border: "1px solid #fed7aa",
                }}
              />
            </Tooltip>
          ) : null}
        </div>
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
        <PackageTableActions
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
                <WorkspacePremiumRoundedIcon fontSize="small" />
                Premium Package Management
              </div>
              <h2 className="fw-bold text-white mb-2">Packages</h2>
              <p className="mb-0 text-white-50">
                Manage travel packages with premium actions, rich previews and
                quick updates.
              </p>
            </div>

            <Button
              variant="contained"
              startIcon={<AddRoundedIcon />}
              onClick={() => navigate("/packages/add")}
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
              Add Package
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
              <h5 className="fw-bold mb-1">All Packages</h5>
              <p className="text-muted mb-0">
                Showing only the most useful package information.
              </p>
            </div>

            <Box sx={{ width: { xs: "100%", md: 360 } }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search by title, trip type, location or hotel"
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

      <PremiumPackageViewModal
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        data={selectedRow}
      />

      <PremiumPackageEditModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        data={selectedRow}
        onSubmit={handleUpdatePackage}
        loading={actionLoading}
      />

      <ConfirmModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        loading={actionLoading}
        title="Delete Package"
        message={`Are you sure you want to delete "${
          selectedRow?.title || "this package"
        }"? This action cannot be undone.`}
        confirmText="Delete Package"
      />
    </AdminLayout>
  );
}
