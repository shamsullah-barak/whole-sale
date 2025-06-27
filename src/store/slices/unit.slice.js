import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchUnits } from '../actions/unit.actions';
import axios from 'axios';

const initialState = {
  units: [],
  loading: false,
  error: null,
};

export const fetchUnitsAsync = createAsyncThunk('units/fetchUnits', async (companyId, { rejectWithValue }) => {
  try {
    const units = await fetchUnits(companyId);
    console.log(units);
    return units;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch units');
  }
});

export const createUnitAsync = createAsyncThunk('units/createUnit', async (unitData, { rejectWithValue }) => {
  try {
    const response = await axios.post('http://localhost:5000/api/units', unitData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to create unit');
  }
});

export const deleteUnitAsync = createAsyncThunk('units/deleteUnit', async (unitId, { rejectWithValue }) => {
  try {
    await axios.delete(`http://localhost:5000/api/units/${unitId}`);
    return unitId;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to delete unit');
  }
});

export const updateUnitAsync = createAsyncThunk('units/updateUnit', async ({ unitId, unitData }, { rejectWithValue }) => {
  try {
    const response = await axios.patch(`http://localhost:5000/api/units/${unitId}`, unitData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to update unit');
  }
});

export const getUnitByIdAsync = createAsyncThunk('units/getUnitById', async (unitId, { rejectWithValue }) => {
  try {
    const response = await axios.get(`http://localhost:5000/api/units/${unitId}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch unit');
  }
});

const unitSlice = createSlice({
  name: 'units',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUnitsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUnitsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.units = action.payload.results || action.payload.data || [];
      })
      .addCase(fetchUnitsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createUnitAsync.fulfilled, (state, action) => {
        state.units.unshift(action.payload);
        state.error = null;
      })
      .addCase(createUnitAsync.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(deleteUnitAsync.fulfilled, (state, action) => {
        state.units = state.units.filter((unit) => unit.id !== action.payload && unit._id !== action.payload);
        state.error = null;
      })
      .addCase(deleteUnitAsync.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateUnitAsync.fulfilled, (state, action) => {
        const idx = state.units.findIndex((unit) => unit.id === action.payload.id || unit._id === action.payload._id);
        if (idx !== -1) {
          state.units[idx] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateUnitAsync.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(getUnitByIdAsync.fulfilled, (state, action) => {
        const idx = state.units.findIndex((unit) => unit.id === action.payload.id || unit._id === action.payload._id);
        if (idx === -1) {
          state.units.push(action.payload);
        } else {
          state.units[idx] = action.payload;
        }
        state.error = null;
      })
      .addCase(getUnitByIdAsync.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default unitSlice.reducer;
