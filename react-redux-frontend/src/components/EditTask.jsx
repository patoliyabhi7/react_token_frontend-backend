import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Grid,
  Typography,
  Box,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { getTaskById, updateTask } from "../apiServices";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useParams } from "react-router-dom";

function EditTask() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      status: "",
      priority: "",
      deadline: "",
    },
  });

  useEffect(() => {
    const fetchTaskData = async () => {
      try {
        const taskData = await dispatch(getTaskById(id));
        const { title, description, status, priority, deadline } =
          taskData.response.task;
        console.log(priority, status);
        reset({
          title,
          description,
          status,
          priority,
          deadline: new Date(deadline).toISOString().split("T")[0],
        });
      } catch (error) {
        console.error("Failed to fetch task data", error);
        toast.error("Failed to load task data");
      }
    };

    fetchTaskData();
  }, [id, reset]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await dispatch(updateTask({ id, ...data })); // Ensure the task ID is included
      reset();
      toast.success("Task updated successfully!");
      navigate("/all-task");
    } catch (error) {
      toast.error("Update task failed");
      console.error("Update task failed", error);
    } finally {
      setLoading(false);
    }
  };

  const validateFutureDate = (value) => {
    const currentDate = new Date().toISOString().split("T")[0];
    return value >= currentDate || "Please select a future date";
  };

  return (
    <Box
      sx={{
        maxWidth: 600,
        margin: "auto",
        padding: 4,
        boxShadow: 3,
        borderRadius: 2,
      }}
    >
      <Typography
        variant="overline"
        gutterBottom
        sx={{ display: "block", fontSize: "1.5rem" }}
      >
        EDIT Task
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Title"
              name="title"
              {...register("title", {
                required: "Title is required",
                minLength: {
                  value: 3,
                  message: "Title must be at least 3 characters",
                },
              })}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              error={!!errors.title}
              helperText={errors.title ? errors.title.message : ""}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              {...register("description", {
                required: "Description is required",
                minLength: {
                  value: 5,
                  message: "Description must be at least 5 characters",
                },
              })}
              variant="outlined"
              multiline
              InputLabelProps={{ shrink: true }}
              rows={4}
              error={!!errors.description}
              helperText={errors.description ? errors.description.message : ""}
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel id="status-label">Status</InputLabel>
              <Controller
                name="status"
                control={control}
                defaultValue=""
                rules={{ required: "Status is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    labelId="status-label"
                    id="status-select"
                    label="Status"
                    error={!!errors.status}
                  >
                    <MenuItem value="in_progress">In Progress</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                  </Select>
                )}
              />
              {errors.status && (
                <Typography color="error">{errors.status.message}</Typography>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel id="priority-label">Priority</InputLabel>
              <Controller
                name="priority"
                control={control}
                defaultValue=""
                rules={{ required: "Priority is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    labelId="priority-label"
                    id="priority-select"
                    label="Priority"
                    error={!!errors.priority}
                  >
                    <MenuItem value="high">High</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="low">Low</MenuItem>
                  </Select>
                )}
              />
              {errors.priority && (
                <Typography color="error">{errors.priority.message}</Typography>
              )}
            </FormControl>
          </Grid>
          {/* <TextField
              select
              fullWidth
              label="Priority"
              name="priority"
              {...register("priority", { required: "Priority is required" })}
              variant="outlined"
              error={!!errors.priority}
              helperText={errors.priority ? errors.priority.message : ""}
            >
              <MenuItem value="high">High</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="low">Low</MenuItem>
            </TextField> */}
          {/* </Grid> */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              variant="outlined"
              type="date"
              name="deadline"
              label="Deadline"
              {...register("deadline", {
                required: "Deadline is required",
                validate: validateFutureDate,
              })}
              InputLabelProps={{ shrink: true }}
              error={!!errors.deadline}
              helperText={errors.deadline ? errors.deadline.message : ""}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
            >
              {loading ? "Updating..." : "UPDATE TASK"}
            </Button>
          </Grid>
        </Grid>
      </form>
      <ToastContainer />
    </Box>
  );
}

export default EditTask;
