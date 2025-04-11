import React, { useState, useEffect } from "react";
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import {
  Box, AppBar, Toolbar,
  Typography,
  Button,
  Table, Drawer,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow, ListItem, ListItemText, List,
  Paper,
  Modal,
  IconButton,
  Container,
} from '@mui/material';
import { jsPDF } from 'jspdf';
import { CSVLink } from 'react-csv';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import logo from '../assets/Image20210206041010-1024x518.png';

// Replace with your actual API base URL
const API_BASE_URL = 'http://127.0.0.1:8000/api'; // For local development

const UserResponsesAnalytics = () => {
  const [testSummary, setTestSummary] = useState([]);
  const [completedTests, setCompletedTests] = useState([]);
  const [userResponses, setUserResponses] = useState([]);
  const [selectedUser , setSelectedUser ] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const TOKEN = localStorage.getItem('user_token'); // Get the token here
    
      if (!TOKEN) {
        setError('No access token found. Please log in.');
        navigate('/login'); // Redirect to login if no token
        return;
      }
    
      try {
        // Fetch Test Summary
        const response = await fetch(`${API_BASE_URL}/test-summary/`, {
          method: 'GET',
          headers: {
            'Authorization': `Token ${TOKEN}`,
            'Content-Type': 'application/json',
          },
        });
    
        if (!response.ok) {
          throw new Error('Failed to fetch test summary');
        }
    
        const data = await response.json();
        console.log('Test Summary Data:', data); // Log the test summary data
        setTestSummary(data);
    
        // Fetch Completed Tests
        const testsResponse = await fetch(`${API_BASE_URL}/completed-tests/`, {
          method: 'GET',
          headers: {
            'Authorization': `Token ${TOKEN}`,
            'Content-Type': 'application/json',
          },
        });
    
        if (!testsResponse.ok) {
          throw new Error('Failed to fetch completed tests');
        }
    
        const testsData = await testsResponse.json();
        console.log('Completed Tests Data:', testsData); // Log the completed tests data
        setCompletedTests(Array.isArray(testsData) ? testsData : []);
    
        // Fetch User Responses
        const responsesResponse = await fetch(`${API_BASE_URL}/user-responses/`, {
          method: 'GET',
          headers: {
            'Authorization': `Token ${TOKEN}`,
            'Content-Type': 'application/json',
          },
        });
    
        if (!responsesResponse.ok) {
          throw new Error('Failed to fetch user responses');
        }
    
        const responsesData = await responsesResponse.json();
        console.log('User  Responses Data:', responsesData); // Log the user responses data
        setUserResponses(Array.isArray(responsesData) ? responsesData : []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  // Export to PDF
  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text('Test Analytics Report', 10, 10);
    
    if (testSummary.length > 0) {
      testSummary.forEach((test, index) => {
        doc.text(`Test Title: ${test.title || 'N/A'}`, 10, 20 + (index * 10));
        doc.text(`Average Score: ${test.average_score || 'N/A'}%`, 10, 30 + (index * 10));
        doc.text(`Total Users: ${test.total_users || 'N/A'}`, 10, 40 + (index * 10));
        doc.text(`Median Score : ${test.median_score || 'N/A'}`, 10, 50 + (index * 10));
        doc.text(`Pass Rate: ${test.pass_rate || 'N/A'}%`, 10, 60 + (index * 10));
        doc.text(`Total Attempts: ${test.total_attempts || 'N/A'}`, 10, 70 + (index * 10));
      });
    } else {
      doc.text('Test Summary not available', 10, 20);
    }

    doc.text('User  Responses:', 10, 90);
    let yOffset = 100;

    if (Array.isArray(userResponses) && userResponses.length > 0) {
      userResponses.forEach((user, index) => {
        doc.text(`${index + 1}. ${user.name || 'N/A'} (${user.email || 'N/A'}) - Score: ${user.score || 'N/A'}, Time Taken: ${user.time_taken || 'N/A'}`, 10, yOffset);
        yOffset += 10;
      });
    } else {
      doc.text('No user responses available.', 10, yOffset);
    }

    doc.save('TestAnalyticsReport.pdf');
  };

  // Close user response modal
  const handleCloseModal = () => setSelectedUser (null);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box sx={{ backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <Drawer open={isSidebarOpen} onClose={toggleSidebar}>
        <Box sx={{ width: 220, textAlign: "center", padding: "12px" }}>
          {isSidebarOpen && (
            <img
              src={logo}
              alt="Logo"
              style={{
                maxWidth: "80%",
                height: "auto",
                marginBottom: "12px",
                borderRadius: "8px",
              }}
            />
          )}
          <List>
            <ListItem button onClick={() => navigate("/admin-dashboard")}>
              <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem button onClick={() => navigate("/testcreation")}>
              <ListItemText primary="Test Creation" />
            </ListItem>
            <ListItem button onClick={() => navigate('/questioncreation')}>
                          <ListItemText primary="Question Creation" />
                        </ListItem>
            <ListItem button onClick={() => navigate("/manage-tests")}>
              <ListItemText primary="Manage Tests" />
            </ListItem>
            <ListItem button onClick={() => navigate("/userresponse")}>
              <ListItemText primary="Test Analytics" />
            </ListItem>
            <ListItem button onClick={() => navigate("/announcement")}>
              <ListItemText primary="Announcements" />
            </ListItem>
            <ListItem button onClick={() => navigate("/adminsetting")}>
              <ListItemText primary="Settings" />
            </ListItem>
            <ListItem button onClick={() => navigate('/logout')}>
              <ListItemText primary="Logout" />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Header */}
      <AppBar position="fixed" sx={{ backgroundColor: "#003366", padding: "6px 16px" }}>
        <Toolbar>
          <IconButton color="inherit" onClick={toggleSidebar} edge="start" sx={{ marginRight: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, fontSize: "1rem" }}>
            Vdart Online Test Platform
          </Typography>
          <Button color="inherit" onClick={() => navigate("/")}>Home</Button>
          <Button color="inherit" onClick={() => navigate("/admin-profile")}>Admin profile</Button>
          <Button color="inherit" onClick={() => navigate("/manage-tests")}>Test list</Button>
          <Button color="inherit" onClick={() => navigate("/adminsettings")}>Settings</Button>
          <Button color="inherit" onClick={() => navigate("/logout")}>Logout</Button>
        </Toolbar>
      </AppBar>
      <br/><br/><br/><br/><br/>
      <Container>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#003366' }}>
          User Responses & Analytics
        </Typography>

        {/* Highest Scores and Completed Test Details Table */}
        <Box mt={4} sx={{ boxShadow: 3 }}>
          <Typography variant="h5 " gutterBottom sx={{ fontWeight: 'bold', color: '#003366' }}>
            Highest Scores and Completed Test Details
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ backgroundColor: '#003366' }}>
                <TableRow>
                  <TableCell sx={{ color: 'white' }}>Name</TableCell>
                  <TableCell sx={{ color: 'white' }}>Email</TableCell>
                  <TableCell sx={{ color: 'white' }}>Test Title</TableCell>
                  <TableCell sx={{ color: 'white' }}>Highest Score</TableCell>
                  <TableCell sx={{ color: 'white' }}>Time Taken</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.isArray(completedTests) && completedTests.length > 0 ? (
                  completedTests.map((test, index) => (
                    <TableRow key={index} sx={{ '&:nth-of-type(odd)': { backgroundColor: '#f5f5f5' } }}>
                      <TableCell>{test.user_name}</TableCell>
                      <TableCell>{test.user_email}</TableCell>
                      <TableCell>{test.title}</TableCell>
                      <TableCell>{test.highest_score}</TableCell>
                      <TableCell>{test.time_taken}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">No completed tests available.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* Test Summary Section as a Table */}
        <Box mt={4} sx={{ boxShadow: 3, p: 3 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold", color: "#003366" }}>
            Test Summary
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ backgroundColor: "#003366" }}>
                <TableRow>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>Test Title</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>Average Score</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>Median Score</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>Pass Rate</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>Total Users</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>Total Attempts</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
              {testSummary.length > 0 ? (
                testSummary.map((test) => (
                  <TableRow key={test.id}>
                    <TableCell>{test.title}</TableCell>
                    <TableCell>{test.average_score}%</TableCell>
                    <TableCell>{test.median_score}%</TableCell>
                    <TableCell>{test.pass_rate}%</TableCell>
                    <TableCell>{test.total_users}</TableCell>
                    <TableCell>{test.total_attempts}</TableCell>
                    <TableCell>
                      <Typography
                        sx={{
                          fontWeight: "bold",
                          color: test.pass_rate > 80 ? "#2E8B57" : test.pass_rate > 60 ? "#DAA520" : "#CD5C5C",
                        }}
                      >
                        {test.pass_rate > 80 ? "Excellent" : test.pass_rate > 60 ? "Moderate" : "Needs Improvement"}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">No test summary available.</TableCell>
                </TableRow>
              )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* Test Summary with Question Details */}
        <Box mt={4} sx={{ boxShadow: 3, p: 3, backgroundColor: "white", borderRadius: 2 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold", color: "#003366" }}>
            Test Summary - Question Breakdown
          </Typography>

          {/* Data Table */}
          <Box mt={3}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead sx={{ backgroundColor: "#003366" }}>
                  <TableRow>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>Test Name</TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>Question</TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>Correct</TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>Incorrect</TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>Attempts</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {userResponses.map((response, index) => (
                    <TableRow key={index} sx={{ "&:nth-of-type(odd)": { backgroundColor: "#f5f5f5" } }}>
                      <TableCell>{response.test_name}</TableCell>
                      <TableCell>{response.question}</TableCell>
                      <TableCell>{response.correct ? 'Yes' : 'No'}</TableCell>
                      <TableCell>{response.incorrect ? 'Yes' : 'No'}</TableCell>
                      <TableCell>{response.attempts}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>

        <div>
          {/* Export Buttons */}
          <Box mt={4} display="flex" gap={2} justifyContent="center">
            <Button variant="contained" color="primary" onClick={handleExportPDF} sx={{ fontWeight: 'bold' }}>
              Export to PDF
            </Button>
            <CSVLink data={userResponses} filename="User _Responses.csv" style={{ textDecoration: 'none' }}>
              < Button variant="contained" color="secondary" sx={{ fontWeight: 'bold' }}>
                Export to CSV
              </Button>
            </CSVLink>
          </Box>
          <br/><br/><br/><br/><br/><br/>
        </div>

        {/* User Response Modal */}
        <Modal open={!!selectedUser } onClose={handleCloseModal}>
          <Box sx={{ p: 4, bgcolor: 'background.paper', maxWidth: '500px', margin: '50px auto', borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#003366' }}>
              User Response Details
            </Typography>
            {selectedUser  && (
              <>
                <Typography>Name: {selectedUser.name}</Typography>
                <Typography>Email: {selectedUser.email}</Typography>
                <Typography>Score: {selectedUser.score}</Typography>
                <Typography>Time Taken: {selectedUser.time_taken}</Typography>
                <Typography variant="h6" mt={2} gutterBottom sx={{ fontWeight: 'bold', color: '#003366' }}>
                  Question Responses:
                </Typography>
                <ul>
                  {selectedUser.responses.map((response, index) => (
                    <li key={index}>{`Q${index + 1}: ${response}`}</li>
                  ))}
                </ul>
              </>
            )}
          </Box>
        </Modal>
      </Container>

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

export default UserResponsesAnalytics;