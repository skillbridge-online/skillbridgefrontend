import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography, List, ListItem, Button } from "@mui/material";

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";
      const response = await axios.get(`${apiUrl}/api/admin-notifications/`);
      setNotifications(response.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";
      await axios.post(`${apiUrl}/api/admin-notifications/`);
      setNotifications([]);
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };

  return (
    <Box sx={{ padding: "16px", maxWidth: "400px", margin: "0 auto" }}>
      <Typography variant="h6">Admin Notifications</Typography>
      <List>
        {notifications.map((notification, index) => (
          <ListItem key={index}>{notification.message}</ListItem>
        ))}
      </List>
      {notifications.length > 0 && (
        <Button variant="contained" color="primary" onClick={markAsRead}>
          Mark All as Read
        </Button>
      )}
    </Box>
  );
};

export default AdminNotifications;
