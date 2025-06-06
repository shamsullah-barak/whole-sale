import React, { useEffect } from 'react';
import Grid from '@mui/material/Grid2';
import MainDashboard from '../../theme/main/MainDashboard';
import CustomizedDataGrid from '../../components/CustomizedDataGrid';
import ProductFilters from './ProductFilters';
import { Button, Box, Typography } from '@mui/material';
import { NavLink } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';

const Products = () => {
  return (
    <MainDashboard title="Products">
      <Box sx={{ width: '100%' }}>
        {/* Header with title and add button */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
          }}
        >
          <Typography variant="h4" component="h1">
            Product Management
          </Typography>
          <NavLink to="/products/add" style={{ textDecoration: 'none' }}>
            <Button variant="contained" startIcon={<AddIcon />} size="large">
              New Product
            </Button>
          </NavLink>
        </Box>

        {/* Filters */}
        <ProductFilters />

        {/* Data Grid */}
        <Box sx={{ width: '100%', mt: 2 }}>
          <CustomizedDataGrid />
        </Box>
      </Box>
    </MainDashboard>
  );
};

export default Products;
