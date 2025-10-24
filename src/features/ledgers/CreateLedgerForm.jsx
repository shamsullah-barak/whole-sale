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
import { createLedgerAsync } from "../../store/slices/ledger.slice";
import { toast } from "react-toastify";
import Model from "../../components/Model";

const CreateLedgerForm = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const handleChange = (field) => (event) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Ledger name is required");
      return;
    }

    try {
      setLoading(true);

      await dispatch(createLedgerAsync(formData)).unwrap();
      toast.success("Ledger created successfully");

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
    <Model
      open={open}
      handleClose={handleClose}
      submit="submit"
      cancel="cancel"
      loading={loading}
      disabled={loading}
      handleSubmit={handleSubmit}
    >
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              label="Ledger Name"
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
        {/* <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleClose} disabled={loading} color="inherit">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} />}
          >
            {loading ? "Creating..." : "Create Ledger"}
          </Button>
        </DialogActions> */}
      </form>
    </Model>
  );
};

export default CreateLedgerForm;
