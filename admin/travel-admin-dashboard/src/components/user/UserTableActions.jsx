import { IconButton, Tooltip } from "@mui/material";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";

export default function UserTableActions({ row, onView, onEdit, onDelete }) {
  return (
    <div className="d-flex align-items-center gap-1">
      <Tooltip title="View">
        <IconButton
          size="small"
          onClick={() => onView(row)}
          sx={{
            background: "#eff6ff",
            color: "#2563eb",
            "&:hover": { background: "#dbeafe" },
          }}
        >
          <VisibilityRoundedIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Tooltip title="Edit">
        <IconButton
          size="small"
          onClick={() => onEdit(row)}
          sx={{
            background: "#ecfeff",
            color: "#0891b2",
            "&:hover": { background: "#cffafe" },
          }}
        >
          <EditRoundedIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Tooltip title="Delete">
        <IconButton
          size="small"
          onClick={() => onDelete(row)}
          sx={{
            background: "#fff1f2",
            color: "#e11d48",
            "&:hover": { background: "#ffe4e6" },
          }}
        >
          <DeleteRoundedIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </div>
  );
}
