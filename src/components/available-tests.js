import React, { useState, useEffect } from "react"; 
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import TwitterIcon from "@mui/icons-material/Twitter";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import { useNavigate } from "react-router-dom";
import logo from "../assets/Image20210206041010-1024x518.png";

const AvailableTests = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [notification, setNotification] = useState("");
  const [availableTests, setAvailableTests] = useState([]);
  const navigate = useNavigate();
  const [totalTests, setTotalTests] = useState(0);
  const [upcomingTests, setUpcomingTests] = useState(0);
  const [overallPerformance, setOverallPerformance] = useState(0);

  useEffect(() => { 
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("user_token");
        const response = await fetch("http://localhost:8000/api/dashboard-overview/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setTotalTests(data.total_tests);
        setUpcomingTests(data.upcoming_tests);
        setOverallPerformance(data.overall_performance);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };
  
    fetchDashboardData();
  }, []);
  
  useEffect(() => {
    const fetchTests = async () => {
      try {
        const token = localStorage.getItem("user_token");
        const response = await fetch("http://localhost:8000/api/available-tests/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setAvailableTests(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching tests:", error);
        setNotification("Failed to load tests.");
      }
    };

    fetchTests();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredTests = availableTests.filter((test) =>
    test.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    test.subject?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="fixed" sx={{ backgroundColor: "#003366" }}>
        <Toolbar>
          <IconButton color="inherit" onClick={toggleSidebar} edge="start" sx={{ marginRight: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Vdart Dashboard
          </Typography>
          <Button color="inherit" onClick={() => navigate("/")}>Home</Button>
          <Button color="inherit" onClick={() => navigate("/userprofile")}>User  Profile</Button>
          <Button color="inherit" onClick={() => navigate("/testlist")}>Test List</Button>
          <Button color="inherit" onClick={() => navigate("/usersetting")}>Settings</Button>
          <Button color="inherit" onClick={() => navigate("/logout")}>Logout</Button>
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={isSidebarOpen} onClose={toggleSidebar}>
        <Box sx={{ width: 250, textAlign: "center", padding: "16px" }}>
          {isSidebarOpen && (
            <img
              src={logo}
              alt="Logo"
              style={{
                maxWidth: "100%",
                height: "auto",
                marginBottom: "16px",
                borderRadius: "8px",
              }}
            />
          )}
          <List>
            <ListItem button onClick={() => navigate('/user-dashboard')}>
              <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem button onClick={() => navigate('/available-tests')}>
              <ListItemText primary="Available Tests" />
            </ListItem>
            <ListItem button onClick={() => navigate('/attempted-tests')}>
              <ListItemText primary="Attempted Tests" />
            </ListItem>
            <ListItem button onClick={() => navigate('/performancehistory')}>
              <ListItemText primary="Performance History" />
            </ListItem>
            <ListItem button onClick={() => navigate('/leaderboard')}>
              <ListItemText primary="Leaderboard" />
            </ListItem>
            <ListItem button onClick={() => navigate('/usersetting')}>
              <ListItemText primary="Settings" />
            </ListItem>
            <ListItem button onClick={() => navigate('/logout')}>
              <ListItemText primary="Logout" />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      <Box
  sx={{
    position: "fixed", // Fixed position
    top: "64px", // Start below the AppBar
    left: 0, // Align to the left
    right: 0, // Align to the right
    bottom: 0, // Align to the bottom
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    overflowY: "auto", // Allow scrolling if content overflows
  }}
>

        <Typography variant="h4" sx={{ textAlign: "center", mb: 3, color: "primary.main" }}>
          Available Tests
        </Typography>

        {/* Search & Filter */}
        <input 
          type="text" 
          placeholder="🔎 Search by test name or subject..." 
          value={searchTerm} 
          onChange={handleSearch} 
          style={styles.searchBox} 
        />

        <div style={styles.widgetContainer}>
          <div style={styles.widget}>📊 Total Tests Available: {totalTests}</div>
          <div style={styles.widget}>📈 Overall Performance: {overallPerformance}% Accuracy</div>
          <div style={styles.widget}>⏳ Upcoming Tests: {upcomingTests} Scheduled</div>
        </div>

        {/* Available Tests Table */}
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Test Name</th>
              <th style={styles.th}>Subject</th>
              <th style={styles.th}>Duration</th>
              <th style={styles.th}>Questions</th>
              <th style={styles.th}>Difficulty</th>
              <th style={styles.th}>Description</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTests.map((test, index) => (
              <tr key={index}>
                <td style={styles.td}>{test.name || "N/A"}</td>
                <td style={styles.td}>{test.subject || "N/A"}</td>
                <td style={styles.td}>{test.duration || "N/A"}</td>
                <td style={styles.td}>{test.questions || "N/A"}</td>
                <td style={styles.td}>{test.difficulty || "N/A"}</td>
                <td style={styles.td}>{test.description || "N/A"}</td>
                <td style={styles.td}>
                  <button 
                    style={styles.button} 
                    onClick={() => navigate('/attempt-test')}
                  >
                    Start Test
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Box>

      {/* Notification Snackbar */}
      <Snackbar open={notification !== ""} autoHideDuration={3000} onClose={() => setNotification("")}>
        <Alert onClose={() => setNotification("")} severity="info">{notification}</Alert>
      </Snackbar>

      {/* Footer */}
      <Box
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: "#003366",
            color: "white",
            padding: "16px",
            textAlign: "center",
          }}
        >
          <Typography variant="body2" sx={{ color: "white", marginBottom: "2px" }}>
            © {new Date().getFullYear()} Vdart Online Test Platform. All rights reserved.
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center", gap: "16px", marginTop: "2px" }}>
            <IconButton color="inherit" onClick={() => window.open("https://twitter.com", "_blank")}><TwitterIcon /></IconButton>
            <IconButton color="inherit" onClick={() => window.open("https://facebook.com", "_blank")}><FacebookIcon /></IconButton>
            <IconButton color="inherit" onClick={() => window.open("https://instagram.com", "_blank")}><InstagramIcon /></IconButton>
          </Box>
      </Box>
    </Box>
  );
};

const styles = {
  container: { padding: "20px", fontFamily: "Arial, sans-serif", flex: 1, marginTop: "64px" }, // Added flex: 1 and marginTop
  heading: { textAlign: "center", marginBottom: "20px", color: "#003366" },
  table: { width: "100%", borderCollapse: "collapse", marginBottom: "20px", backgroundColor: "#ffffff", color: "#003366", borderRadius: "8px", overflow: "hidden", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" },
  th: { background: "#003366", padding: "12px", border: "1px solid #ddd", color: "white", textAlign: "center" },
  td: { padding: "12px", border: "1px solid #ddd", textAlign: "center", backgroundColor: "#ffffff", color: "#333", boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.1)" },
  widgetContainer: { display: "flex", justifyContent: "space-around", marginBottom: "20px" },
  widget: { padding: "10px", background: "#003366", borderRadius: "5px", textAlign: "center", width: "30%", color: "#fff", fontWeight: "bold", border: "1px solid #ddd" },
  searchBox: { width: "30%", padding: "10px", marginBottom: "20px", borderRadius: "5px", border: "1px solid #ccc" },
  button: { padding: "5px 10px", background: "#007bff", color: "#fff", border: "none", cursor: "pointer", fontWeight: "bold", borderRadius: "5px", margin: "5px" },
};

export default AvailableTests;