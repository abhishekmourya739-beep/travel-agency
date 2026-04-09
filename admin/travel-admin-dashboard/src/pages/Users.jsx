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
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";

import AdminLayout from "../layouts/AdminLayout";
import { getAllUsers, updateUser, deleteUser } from "../services/user";
import PremiumUserViewModal from "../components/user/PremiumUserViewModal";
import PremiumUserEditModal from "../components/user/PremiumUserEditModal";
import ConfirmModal from "../components/common/ConfirmModal";
import UserTableActions from "../components/user/UserTableActions";
import { getApiErrorMessage } from "../utils/handleApiError";
import { successMessages } from "../utils/successMessages";
import { showError, showSuccess } from "../utils/ShowToast";

export default function Users() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await getAllUsers();
      setUsers(res?.data?.users || res?.data || []);
    } catch (err) {
      const message = getApiErrorMessage(err, "Failed to load users");
      setError(message);
      showError(message);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        await fetchUsers();
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [fetchUsers]);

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

  const handleUpdateUser = async (formData) => {
    try {
      setActionLoading(true);
      setError("");

      await updateUser(selectedRow?._id, formData);

      showSuccess(successMessages.userUpdated || "User updated successfully");
      setEditOpen(false);
      setSelectedRow(null);
      await fetchUsers();
    } catch (err) {
      console.error("Failed to update user", err);

      const message = getApiErrorMessage(err, "Failed to update user");
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

      await deleteUser(selectedRow?._id);

      showSuccess(successMessages.userDeleted || "User deleted successfully");
      setDeleteOpen(false);
      setSelectedRow(null);
      await fetchUsers();
    } catch (err) {
      console.error("Failed to delete user", err);

      const message = getApiErrorMessage(err, "Failed to delete user");
      setError(message);
      showError(message);
    } finally {
      setActionLoading(false);
    }
  };

  const filteredRows = useMemo(() => {
    const q = search.toLowerCase().trim();

    return users.filter((user) => {
      return (
        user?.name?.toLowerCase().includes(q) ||
        user?.email?.toLowerCase().includes(q) ||
        user?.contact?.toLowerCase().includes(q) ||
        user?.role?.toLowerCase().includes(q)
      );
    });
  }, [users, search]);

  const columns = [
    {
      field: "name",
      headerName: "User",
      flex: 1.6,
      minWidth: 280,
      renderCell: (params) => {
        const image = params.row?.image?.url || "";

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
              src={image}
              sx={{
                width: 52,
                height: 52,
                flexShrink: 0,
                boxShadow: "0 8px 20px rgba(15,23,42,0.10)",
              }}
            >
              {(params.row?.name || "U").charAt(0).toUpperCase()}
            </Avatar>

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
                title={params.row?.email || ""}
              >
                {params.row?.email || "-"}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      field: "contact",
      headerName: "Contact",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <div className="d-flex align-items-center gap-2">
          <PhoneRoundedIcon sx={{ fontSize: 18, color: "#64748b" }} />
          <span>{params.row?.contact || "-"}</span>
        </div>
      ),
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1.3,
      minWidth: 220,
      renderCell: (params) => (
        <div
          className="d-flex align-items-center gap-2"
          style={{ minWidth: 0 }}
        >
          <EmailRoundedIcon sx={{ fontSize: 18, color: "#64748b" }} />
          <span
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
            title={params.row?.email || ""}
          >
            {params.row?.email || "-"}
          </span>
        </div>
      ),
    },
    {
      field: "role",
      headerName: "Role",
      flex: 0.8,
      minWidth: 120,
      renderCell: (params) => (
        <Chip
          label={params.row?.role || "user"}
          size="small"
          sx={{
            textTransform: "capitalize",
            fontWeight: 600,
            background: "#eff6ff",
            color: "#2563eb",
            border: "1px solid #dbeafe",
          }}
        />
      ),
    },
    {
      field: "verification",
      headerName: "Verification",
      flex: 1,
      minWidth: 150,
      sortable: false,
      renderCell: (params) =>
        params.row?.isVerified ? (
          <Chip
            icon={<VerifiedRoundedIcon />}
            label="Verified"
            size="small"
            sx={{
              fontWeight: 700,
              background: "#ecfeff",
              color: "#0891b2",
              border: "1px solid #bae6fd",
            }}
          />
        ) : (
          <Chip
            label="Not Verified"
            size="small"
            sx={{
              fontWeight: 700,
              background: "#fff7ed",
              color: "#ea580c",
              border: "1px solid #fed7aa",
            }}
          />
        ),
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
        <UserTableActions
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
                <PersonRoundedIcon fontSize="small" />
                Premium User Management
              </div>
              <h2 className="fw-bold text-white mb-2">Users</h2>
              <p className="mb-0 text-white-50">
                Manage user accounts with premium actions, quick previews and
                fast updates.
              </p>
            </div>

            <Button
              variant="contained"
              startIcon={<AddRoundedIcon />}
              onClick={() => navigate("/users/add")}
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
              Add User
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
              <h5 className="fw-bold mb-1">All Users</h5>
              <p className="text-muted mb-0">
                Showing the most useful user information.
              </p>
            </div>

            <Box sx={{ width: { xs: "100%", md: 360 } }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search by name, email, contact or role"
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

      <PremiumUserViewModal
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        data={selectedRow}
      />

      <PremiumUserEditModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        data={selectedRow}
        onSubmit={handleUpdateUser}
        loading={actionLoading}
      />

      <ConfirmModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        loading={actionLoading}
        title="Delete User"
        message={`Are you sure you want to delete "${
          selectedRow?.name || "this user"
        }"? This action cannot be undone.`}
        confirmText="Delete User"
      />
    </AdminLayout>
  );
}
