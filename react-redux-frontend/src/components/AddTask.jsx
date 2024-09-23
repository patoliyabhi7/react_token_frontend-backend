import React from 'react';
import { TextField, Button, MenuItem, Grid, Typography, Box } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { addTask } from '../apiServices';

function AddTask() {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      status: 'in_progress', // Default value
      priority: 'medium',    // Default value
      deadline: '',
    },
  });

  const onSubmit = async (data) => {
    try {
      dispatch(addTask(data));
    } catch (error) {
      console.error('Add task failed', error);
    }
  };

  const checkDate = (e) => {
    const currentDate = new Date().toISOString().split('T')[0];
    if (e.target.value < currentDate) {
      error('Please select a future date');
      e.target.value = '';
    }
  };

  return (
    <Box sx={{ maxWidth: 600, margin: 'auto', padding: 4, boxShadow: 3, borderRadius: 2 }}>
      <Typography variant="overline" gutterBottom sx={{ display: 'block', fontSize: '1.5rem' }}>
        Add Task
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Title"
              name="title"
              {...register('title', { required: 'Title is required', minLength: { value: 3, message: 'Title must be at least 3 characters' } })}
              variant="outlined"
              error={!!errors.title}
              helperText={errors.title ? errors.title.message : ''}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              {...register('description', { required: 'Description is required', minLength: { value: 5, message: 'Description must be at least 5 characters' } })}
              variant="outlined"
              multiline
              rows={4}
              error={!!errors.description}
              helperText={errors.description ? errors.description.message : ''}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              select
              fullWidth
              label="Status"
              name="status"
              defaultValue="in_progress" // Ensure default value
              {...register('status', { required: 'Status is required' })}
              variant="outlined"
              error={!!errors.status}
              helperText={errors.status ? errors.status.message : ''}
            >
              <MenuItem value="in_progress">In Progress</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={6}>
            <TextField
              select
              fullWidth
              label="Priority"
              name="priority"
              defaultValue="medium" // Ensure default value
              {...register('priority', { required: 'Priority is required' })}
              variant="outlined"
              error={!!errors.priority}
              helperText={errors.priority ? errors.priority.message : ''}
            >
              <MenuItem value="high">High</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="low">Low</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              variant="outlined"
              type="date"
              name="deadline"
              label="Deadline"
              {...register('deadline', { required: 'Deadline is required' })}
              InputLabelProps={{ shrink: true }}
              onChange={checkDate}
              error={!!errors.deadline}
              helperText={errors.deadline ? errors.deadline.message : ''}
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              ADD TASK
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
}

export default AddTask;