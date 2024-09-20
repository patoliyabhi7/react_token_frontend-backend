import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Box, Typography, Avatar, Card, CardContent, Grid, Button, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Divider from '@mui/material/Divider';

function Profile() {
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });


  const handleEditProfile = () => {
    navigate('/edit-profile');
  };

  const handleChangePassword = () => {
    setShowPasswordForm(!showPasswordForm);
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords({
      ...passwords,
      [name]: value
    });
  };
  const handleSubmitPasswordChange = () => {
    // Implement password change logic here
    console.log('Password change submitted:', passwords);
    // Reset form and hide it
    setPasswords({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setShowPasswordForm(false);
  };

  return (
    <>
    <Box sx={{ mt: 5, display: 'flex', justifyContent: 'center' }}>
      <Card sx={{ maxWidth: 600, width: '100%', p: 3, boxShadow: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Avatar sx={{ width: 80, height: 80, mr: 3 }}>
              {user?.name?.charAt(0)}
            </Avatar>
            <Typography variant="h4" component="div">
              {user ? `Welcome, ${user.name}` : "Welcome to Your Profile"}
            </Typography>
          </Box>
          {user ? (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="h6" color="textSecondary">
                  Name:
                </Typography>
                <Typography variant="body1">{user.name}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="h6" color="textSecondary">
                  Email:
                </Typography>
                <Typography variant="body1">{user.email}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="h6" color="textSecondary">
                  Username:
                </Typography>
                <Typography variant="body1">{user.username}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="h6" color="textSecondary">
                  Gender:
                </Typography>
                <Typography variant="body1">{user.gender}</Typography>
              </Grid>
            </Grid>
          ) : (
            <Typography variant="h6" color="error">
              Error fetching user data or No user data available.
            </Typography>
          )}
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
            <Button variant="contained" color="primary" onClick={handleEditProfile}>
              Edit Profile
            </Button>
            <Button variant="outlined" color="secondary" onClick={handleChangePassword}>
              Change Password
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
    <Box sx={{ mt: 5, display: 'flex', justifyContent: 'center' }}>
    {showPasswordForm && (
          <>
          <Box sx={{ maxWidth: 600, width: '100%', p: 3, boxShadow: 3 }}>
              
              <Typography variant="h6" gutterBottom>
                Change Password
              </Typography>
              <TextField
                label="Current Password"
                type="password"
                fullWidth
                margin="normal"
                name="currentPassword"
                value={passwords.currentPassword}
                onChange={handlePasswordChange}
              />
              <TextField
                label="New Password"
                type="password"
                fullWidth
                margin="normal"
                name="newPassword"
                value={passwords.newPassword}
                onChange={handlePasswordChange}
              />
              <TextField
                label="Confirm New Password"
                type="password"
                fullWidth
                margin="normal"
                name="confirmPassword"
                value={passwords.confirmPassword}
                onChange={handlePasswordChange}
              />
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                onClick={handleSubmitPasswordChange}
              >
                Submit
              </Button>
            </Box>
            </>
          )}
    </Box>
    </>
  );
}

export default Profile;