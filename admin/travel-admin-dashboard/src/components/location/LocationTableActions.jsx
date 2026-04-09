import { IconButton, Tooltip } from "@mui/material";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";

export default function LocationTableActions({
  row,
  onView,
  onEdit,
  onDelete,
}) {
  return (
    <div className="d-flex align-items-center gap-1">
      <Tooltip title="View">
        <IconButton
          size="small"
          onClick={() => onView(row)}
          sx={{
            background: "#eff6ff",
            color: "#2563eb",
            "&:hover": {
              background: "#dbeafe",
            },
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
            background: "#f8fafc",
            color: "#0f172a",
            "&:hover": {
              background: "#e2e8f0",
            },
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
            "&:hover": {
              background: "#ffe4e6",
            },
          }}
        >
          <DeleteRoundedIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </div>
  );
}
