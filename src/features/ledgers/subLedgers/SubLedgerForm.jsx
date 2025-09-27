import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { createSubLedgerAsync, updateSubLedgerAsync } from "../../../store/slices/subLedger.slice";
import { toast } from "react-toastify";

const SubLedgerForm = ({ open, onClose, subLedger = null, isEdit = false }) => {
  const dispatch = useDispatch();
  const { ledgerId } = useParams();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: subLedger?.name || "",
    description: subLedger?.description || "",
  });

  const handleChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error("SubLedger name is required");
      return;
    }

    try {
      setLoading(true);
      
      if (isEdit && subLedger) {
        await dispatch(updateSubLedgerAsync({
          subLedgerId: subLedger._id,
          subLedgerData: formData
        })).unwrap();
        toast.success("SubLedger updated successfully");
      } else {
        await dispatch(createSubLedgerAsync({
          ledgerId,
          subLedgerData: formData
        })).unwrap();
        toast.success("SubLedger created successfully");
      }
      
      onClose();
      setFormData({ name: "", description: "" });
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
      setFormData({ name: "", description: "" });
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {isEdit ? "Edit SubLedger" : "Create New SubLedger"}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              label="SubLedger Name"
              name="name"
              value={formData.name}
              onChange={handleChange("name")}
              fullWidth
              required
              disabled={loading}
              size="small"
            />
            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange("description")}
              fullWidth
              multiline
              rows={3}
              disabled={loading}
              size="small"
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={handleClose} 
            disabled={loading}
            color="inherit"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} />}
          >
            {loading ? "Saving..." : isEdit ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default SubLedgerForm;

