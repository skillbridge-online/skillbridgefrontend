import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, IconButton, Typography, Button, Box, Drawer, List, ListItem, ListItemText } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import TwitterIcon from "@mui/icons-material/Twitter";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import { useNavigate } from "react-router-dom";
import logo from "../assets/Image20210206041010-1024x518.png";
import { useTheme } from "@mui/material/styles"; // Import useTheme
import Select from "react-select";
// Table Components
export const Table = ({ children }) => <table className="w-full border-collapse">{children}</table>;
export const TableHeader = ({ children }) => <thead className="bg-gray-200">{children}</thead>;
export const TableBody = ({ children }) => <tbody>{children}</tbody>;
export const TableRow = ({ children }) => <tr className="border-b">{children}</tr>;
export const TableHead = ({ children }) => <th className="p-2 text-left">{children}</th>;
export const TableCell = ({ children }) => <td className="p-2">{children}</td>;

// Badge Component
export const Badge = ({ children }) => (
    <span className="bg-blue-500 text-white px-2 py-1 text-xs rounded-full">
        {children}
    </span>
);

const Leaderboards = () => {
    const theme = useTheme(); // Get the theme
    const [users, setUsers] = useState([]);
    const [sortOption, setSortOption] = useState("rank");
    const [selectedBadge, setSelectedBadge] = useState(null);
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();

    const token = localStorage.getItem("user_token");

    useEffect(() => {
        const fetchLeaderboardData = async () => {
            try {
                const response = await fetch("http://127.0.0.1:8000/api/leaderboard/", {
                    method: "GET",
                    headers: {
                        "Authorization": `Token ${token}`,
                        "Content-Type": "application/json",
                    },
                });
    
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
    
                const data = await response.json();
                setUsers(data); // Assuming data is an array of users
            } catch (err) {
                console.error("Error fetching leaderboard:", err);
            }
        };
    
        fetchLeaderboardData();
    }, [token]);

    const sortedUsers = [...users].sort((a, b) => {
        if (sortOption === "rank") return a.rank - b.rank;
        if (sortOption === "score") return b.score - a.score;
        return 0;
    });

    const filteredUsers = selectedBadge && selectedBadge.value !== "All"
        ? sortedUsers.filter(user => user.badges && user.badges.includes(selectedBadge.value))
        : sortedUsers;

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: theme.palette.background.default }}>
            <AppBar position="fixed" sx={{ backgroundColor: "#003366" }}>
                <Toolbar>
                    <IconButton color="inherit" onClick={toggleSidebar} edge="start" sx={{ marginRight: 2 }}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Vdart Online Test Platform
                    </Typography>
                    <Button color="inherit" onClick={() => navigate("/")}>Home</Button>
                    <Button color="inherit" onClick={() => navigate("/aboutus")}>About Us</Button>
                    <Button color="inherit" onClick={() => navigate("/contact")}>Contact Us</Button>
                    <Button color="inherit" onClick={() => navigate("/register")}>Sign Up</Button>
                    <Button color="inherit" onClick={() => navigate("/login")}>Login</Button>
                </Toolbar>
            </AppBar>

            <Drawer open={isSidebarOpen} onClose={toggleSidebar}>
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
                    position: "fixed",
                    top: "64px", // Adjust based on your navbar height
                    bottom: "80px", // Adjust based on your footer height
                    left: 0,
                    right: 0,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "20px",
                }}
            >
                <Box
                    sx={{
                        width: "90%",
                        maxWidth: "1200px",
                        backgroundColor: theme.palette.background.paper,
                        padding: "20px",
                        borderRadius: "12px",
                        boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)",
                        overflow: "hidden",
                        height: "calc(100vh - 144px)",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <Typography variant="h4" className="title">🏆 Leaderboard </Typography>

                    <div className="sort-filter">
                        <div className="filter-container">
                            <Select
                                options={[
                                    { value: "All", label: "All Badges" },
                                    { value: "Gold", label: "🏆 Gold Badge" },
                                    { value: "Silver", label: "🥈 Silver Badge" },
                                ]}
                                className="input-field"
                                placeholder="🎖 Filter by badges"
                                onChange={setSelectedBadge}
                            />
                        </div>

                        <div className="sort-container">
                            <select
                                value={sortOption}
                                onChange={(e) => setSortOption(e.target.value)}
                                className="input-field"
                            >
                                <option value="rank">🔢 Sort by Rank</option>
                                <option value="score">📊 Sort by Score</option>
                            </select>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-blue-800 text-white text-lg">
                                    <TableHead className="p-4">📋 Test Name</TableHead>
                                    <TableHead className="p-4">🏅 Rank</TableHead>
                                    <TableHead className="p-4">📊 Score</TableHead>
                                    <TableHead className="p-4">🎖 Badges</TableHead>
                                </TableRow>
                            </TableHeader>
                           
                            <TableBody>
    {filteredUsers && filteredUsers.length > 0 ? (
        filteredUsers.map((user) => (
            <TableRow key={user.username} className="bg-blue-900 text-white hover:bg-blue-800 transition duration-200">
            <TableCell className="p-4 text-xl font-bold">{user.username}</TableCell>
            <TableCell className="p-4 text-xl font-bold">{user.rank}</TableCell>
            <TableCell className="p-4 text-lg font-medium">{user.total_score ? user.total_score.toFixed(2) : "N/A"}</TableCell>
            <TableCell className="p-4 flex gap-2 justify-center">
                {user.badges && user.badges.length > 0 ? user.badges.map((badge, index) => (
                    <Badge key={index} className="badge">
                        {badge}
                    </Badge>
                )) : "No Badges"}
                </TableCell>
            </TableRow>
        ))
    ) : (
        <TableRow>
            <TableCell colSpan={4}>No users found.</TableCell>
        </TableRow>
    )}
</TableBody>
                        </Table>
                    </div>
                </Box>
            </Box>

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
                <Typography variant="body2">© 2025 Vdart Test Platform. All Rights Reserved.</Typography>
                <Box sx={{ display: "flex", justifyContent: "center", marginTop: "8px" }}>
                    <IconButton color="inherit"><TwitterIcon /></IconButton>
                    <IconButton color="inherit"><FacebookIcon /></IconButton>
                    <IconButton color="inherit"><InstagramIcon /></IconButton>
                </Box>
            </Box>

            <style jsx>{`
                .full-screen {
                    display: flex;
                    flex-direction: column;
                    height: 100vh; /* Full height */
                }

                .content-container {
                    flex: 1; /* Take up remaining space */
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 20px;
                }

                .content-box {
                    border-radius: 12px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    padding: 30px;
                    width: 100%;
                    max-width: 1200px;
                    text-align: center;
                    transition: transform 0.3s ease;
                }

                .title {
                    font-size: 2rem; /* Adjusted font size to medium */
                    color: #003366;
                    font-weight: 700;
                    margin-bottom: 20px;
                    letter-spacing: 1px;
                    text-transform: uppercase;
                }

                .sort-filter {
                    display: flex;
                    justify-content: space-between; /* Aligns items to the left and right */
                    margin-bottom: 30px;
                    flex-wrap: wrap;
                }

                .filter-container, .sort-container {
                    flex: 1; /* Allow both containers to grow equally */
                    display: flex;
                    justify-content: flex-start; /* Align filter to the left */
                }

                .sort-container {
                    justify-content: flex-end; /* Align sort to the right */
                }

                .input-field {
                    padding: 12px 20px;
                    border-radius: 8px;
                    border: 2px solid #00796b;
                    outline: none;
                    font-size: 1rem; /* Adjusted font size to medium */
                    width: 250 px;
                    transition: all 0.3s ease;
                }

                .input-field:focus {
                    border-color: #004d40;
                    box-shadow: 0 0 5px rgba(0, 121, 107, 0.7);
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                    text-align: left;
                }

                th, td {
                    padding: 12px;
                    border-bottom: 2px solid #F3F4F6;
                }

                th {
                    background-color: #003366; /* Dark blue header background color */
                    color: #ffffff; /* Header text color */
                    font-weight: bold;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                td {
                    background-color: #f9fafb;
                }

                td a {
                    color: #00796b;
                    font-weight: 600;
                    text-decoration: none;
                    transition: color 0.3s ease;
                }

                td a:hover {
                    color: #004d40;
                }

                tr:hover {
                    background-color: #e0f2f1;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .badge {
                    display: inline-block;
                    background-color: #fbbf24;
                    color: white;
                    padding: 6px 12px;
                    border-radius: 12px;
                    font-size: 0.875rem;
                    font-weight: bold;
                    margin: 2px;
                    text-transform: capitalize;
                }
            `}</style>
        </Box>
    );
};

export default Leaderboards;