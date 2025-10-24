import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  Box,
  Stack,
} from "@mui/material";
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  AccountBalance as AccountBalanceIcon,
} from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { deleteSubLedgerAsync } from "../../../store/slices/subLedger.slice";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const SubLedgerItem = ({ subLedger, onEdit }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { ledgerId } = useParams();
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    onEdit(subLedger);
    handleMenuClose();
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this subLedger?")) {
      try {
        setDeleting(true);
        await dispatch(deleteSubLedgerAsync(subLedger._id)).unwrap();
        toast.success("SubLedger deleted successfully");
      } catch (error) {
        toast.error(error.message || "Failed to delete subLedger");
      } finally {
        setDeleting(false);
        handleMenuClose();
      }
    }
  };

  const handleViewTransactions = () => {
    navigate(`/ledgers/${ledgerId}/${subLedger._id}`);
  };

  return (
    <Card
      sx={{
        cursor: "pointer",
        transition: "all 0.2s ease-in-out",
        border: "1px solid",

        borderColor: "divider",
        borderRadius: 2,
      }}
      onClick={handleViewTransactions}
    >
      <CardContent>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <AccountBalanceIcon color="primary" />
            <Box>
              <Typography variant="h6" component="h3" gutterBottom>
                {subLedger.name}
              </Typography>
              {subLedger.description && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  {subLedger.description}
                </Typography>
              )}
              <Stack direction="row" spacing={1}>
                <Chip
                  label="View Transactions"
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              </Stack>
            </Box>
          </Stack>

          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              handleMenuOpen(e);
            }}
            disabled={deleting}
          >
            <MoreVertIcon />
          </IconButton>
        </Stack>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          onClick={(e) => e.stopPropagation()}
        >
          <MenuItem onClick={handleEdit}>
            <EditIcon sx={{ mr: 1 }} />
            Edit
          </MenuItem>
          <MenuItem onClick={handleDelete} disabled={deleting}>
            <DeleteIcon sx={{ mr: 1 }} />
            {deleting ? "Deleting..." : "Delete"}
          </MenuItem>
        </Menu>
      </CardContent>
    </Card>
  );
};

export default SubLedgerItem;
