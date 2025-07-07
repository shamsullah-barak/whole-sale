import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Box } from '@mui/material';

function renderStatus(status) {
  const colors = {
    active: 'success',
    inactive: 'default',
    Online: 'success',
    Offline: 'default',
  };

  return <Chip label={status} color={colors[status]} size="small" />;
}

function renderActions(params, onEdit, onDelete, onView) {
  return (
    <Box sx={{ display: 'flex', gap: 1 }}>
      <Tooltip title="View">
        <IconButton size="small" onClick={() => onView && onView(params.row)} color="primary">
          <VisibilityIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Edit">
        <IconButton size="small" onClick={() => onEdit && onEdit(params.row)} color="primary">
          <EditIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Delete">
        <IconButton size="small" onClick={() => onDelete && onDelete(params.row)} color="error">
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value || 0);
}

export function renderAvatar(params) {
  if (params.value == null) {
    return '';
  }

  return (
    <Avatar
      sx={{
        backgroundColor: params.value.color,
        width: '24px',
        height: '24px',
        fontSize: '0.85rem',
      }}
    >
      {params.value.name.toUpperCase().substring(0, 1)}
    </Avatar>
  );
}

// Create columns function that accepts action handlers
export const createProductColumns = (onEdit, onDelete, onView, getUnitName) => [
  {
    field: 'name',
    headerName: 'Product Name',
    flex: 1.5,
    minWidth: 200,
    sortable: true,
  },
  {
    field: 'sku',
    headerName: 'SKU',
    headerAlign: 'center',
    align: 'center',
    flex: 1,
    minWidth: 120,
    sortable: true,
  },
  {
    field: 'status',
    headerName: 'Status',
    flex: 0.8,
    minWidth: 100,
    renderCell: (params) => renderStatus(params.value),
    sortable: true,
  },
  {
    field: 'currentStock',
    headerName: 'Current Stock',
    headerAlign: 'center',
    align: 'center',
    flex: 1,
    minWidth: 120,
    type: 'number',
    sortable: true,
  },
  {
    field: 'mainStockLevel',
    headerName: 'Min Stock Level',
    headerAlign: 'center',
    align: 'center',
    flex: 1,
    minWidth: 130,
    type: 'number',
    sortable: true,
  },
  {
    field: 'purchasedPrice',
    headerName: 'Purchase Price',
    headerAlign: 'center',
    align: 'center',
    flex: 1,
    minWidth: 130,
    type: 'number',
    renderCell: (params) => formatCurrency(params.value),
    sortable: true,
  },
  {
    field: 'salePrice',
    headerName: 'Sale Price',
    headerAlign: 'center',
    align: 'center',
    flex: 1,
    minWidth: 120,
    type: 'number',
    renderCell: (params) => formatCurrency(params.value),
    sortable: true,
  },
  {
    field: 'unit',
    headerName: 'Unit',
    headerAlign: 'center',
    align: 'center',
    flex: 0.8,
    minWidth: 80,
    sortable: true,
    renderCell: (params) => (getUnitName ? getUnitName(params.value) : params.value),
  },
  {
    field: 'actions',
    headerName: 'Actions',
    flex: 1,
    minWidth: 150,
    sortable: false,
    filterable: false,
    renderCell: (params) => renderActions(params, onEdit, onDelete, onView),
  },
];

// Default columns for backward compatibility
export const columns = createProductColumns();
