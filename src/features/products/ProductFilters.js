import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  TextField,
  MenuItem,
  Button,
  Grid,
  Paper,
  Typography,
  Chip,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import FilterListIcon from '@mui/icons-material/FilterList';
import { 
  fetchProductsAsync, 
  fetchCompaniesAsync, 
  fetchCategoriesAsync,
  setFilters 
} from '../../store/slices/product.slice';
import { 
  selectProducts, 
  selectCompanies, 
  selectCategories,
  selectProductsFilters 
} from '../../store/selectors/product.selector';

const ProductFilters = () => {
  const dispatch = useDispatch();
  const products = useSelector(selectProducts);
  const companies = useSelector(selectCompanies);
  const categories = useSelector(selectCategories);
  const currentFilters = useSelector(selectProductsFilters);

  const [localFilters, setLocalFilters] = useState({
    name: '',
    status: '',
    companyId: '',
    categoryId: '',
    minStock: '',
    maxStock: '',
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    dispatch(fetchCompaniesAsync());
    dispatch(fetchCategoriesAsync());
  }, [dispatch]);

  useEffect(() => {
    setLocalFilters(currentFilters);
  }, [currentFilters]);

  const handleFilterChange = (field, value) => {
    setLocalFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const applyFilters = () => {
    // Remove empty filters
    const cleanFilters = Object.entries(localFilters).reduce((acc, [key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {});

    dispatch(setFilters(cleanFilters));
    dispatch(fetchProductsAsync({ 
      page: 1, 
      limit: products.limitPerPage, 
      filters: cleanFilters 
    }));
  };

  const clearFilters = () => {
    const emptyFilters = {
      name: '',
      status: '',
      companyId: '',
      categoryId: '',
      minStock: '',
      maxStock: '',
    };
    setLocalFilters(emptyFilters);
    dispatch(setFilters({}));
    dispatch(fetchProductsAsync({ 
      page: 1, 
      limit: products.limitPerPage, 
      filters: {} 
    }));
  };

  const hasActiveFilters = Object.values(localFilters).some(value => value !== '');

  const getActiveFilterChips = () => {
    const chips = [];
    
    if (localFilters.name) {
      chips.push({ label: `Name: ${localFilters.name}`, key: 'name' });
    }
    if (localFilters.status) {
      chips.push({ label: `Status: ${localFilters.status}`, key: 'status' });
    }
    if (localFilters.companyId) {
      const company = companies.find(c => c.id === localFilters.companyId);
      chips.push({ label: `Company: ${company?.name || localFilters.companyId}`, key: 'companyId' });
    }
    if (localFilters.categoryId) {
      const category = categories.find(c => c.id === localFilters.categoryId);
      chips.push({ label: `Category: ${category?.name || localFilters.categoryId}`, key: 'categoryId' });
    }
    if (localFilters.minStock) {
      chips.push({ label: `Min Stock: ${localFilters.minStock}`, key: 'minStock' });
    }
    if (localFilters.maxStock) {
      chips.push({ label: `Max Stock: ${localFilters.maxStock}`, key: 'maxStock' });
    }

    return chips;
  };

  const removeFilter = (filterKey) => {
    handleFilterChange(filterKey, '');
  };

  return (
    <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <FilterListIcon sx={{ mr: 1 }} />
        <Typography variant="h6">Filters</Typography>
        <Button
          size="small"
          onClick={() => setShowAdvanced(!showAdvanced)}
          sx={{ ml: 'auto' }}
        >
          {showAdvanced ? 'Simple' : 'Advanced'} Filters
        </Button>
      </Box>

      <Grid container spacing={2} alignItems="center">
        {/* Search by name */}
        <Grid xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            size="small"
            label="Search Products"
            value={localFilters.name}
            onChange={(e) => handleFilterChange('name', e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        {/* Status filter */}
        <Grid xs={12} sm={6} md={2}>
          <TextField
            fullWidth
            size="small"
            select
            label="Status"
            value={localFilters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </TextField>
        </Grid>

        {showAdvanced && (
          <>
            {/* Company filter */}
            <Grid xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                size="small"
                select
                label="Company"
                value={localFilters.companyId}
                onChange={(e) => handleFilterChange('companyId', e.target.value)}
              >
                <MenuItem value="">All Companies</MenuItem>
                {companies.map((company) => (
                  <MenuItem key={company.id} value={company.id}>
                    {company.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Category filter */}
            <Grid xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                size="small"
                select
                label="Category"
                value={localFilters.categoryId}
                onChange={(e) => handleFilterChange('categoryId', e.target.value)}
              >
                <MenuItem value="">All Categories</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Stock range filters */}
            <Grid xs={12} sm={6} md={2}>
              <TextField
                fullWidth
                size="small"
                type="number"
                label="Min Stock"
                value={localFilters.minStock}
                onChange={(e) => handleFilterChange('minStock', e.target.value)}
              />
            </Grid>

            <Grid xs={12} sm={6} md={2}>
              <TextField
                fullWidth
                size="small"
                type="number"
                label="Max Stock"
                value={localFilters.maxStock}
                onChange={(e) => handleFilterChange('maxStock', e.target.value)}
              />
            </Grid>
          </>
        )}

        {/* Action buttons */}
        <Grid xs={12} sm={6} md={showAdvanced ? 2 : 3}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="contained"
              size="small"
              onClick={applyFilters}
              fullWidth
            >
              Apply
            </Button>
            {hasActiveFilters && (
              <Button
                variant="outlined"
                size="small"
                onClick={clearFilters}
                startIcon={<ClearIcon />}
              >
                Clear
              </Button>
            )}
          </Box>
        </Grid>
      </Grid>

      {/* Active filter chips */}
      {hasActiveFilters && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Active Filters:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {getActiveFilterChips().map((chip) => (
              <Chip
                key={chip.key}
                label={chip.label}
                size="small"
                onDelete={() => removeFilter(chip.key)}
                color="primary"
                variant="outlined"
              />
            ))}
          </Box>
        </Box>
      )}
    </Paper>
  );
};

export default ProductFilters;
