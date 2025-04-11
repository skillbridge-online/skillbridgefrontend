import React, { useState, useEffect, useRef } from 'react';
import { FaUser , FaUpload, FaEdit, FaEnvelope, FaLock, FaBook, FaPhone, FaGraduationCap, FaTrophy } from 'react-icons/fa';
import { AppBar, Toolbar, Typography, Button, IconButton, Drawer, Box, List, ListItem, ListItemText } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import TwitterIcon from "@mui/icons-material/Twitter";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import logo from "../assets/Image20210206041010-1024x518.png";
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import axios from 'axios';

// API Service
const API_URL = 'http://127.0.0.1:8000/api'; // Replace with your actual backend URL

const fetchUsers = async () => {
  const userToken = localStorage.getItem("user_token"); // Retrieve the user token from local storage
  const response = await axios.get(`${API_URL}/profile/`, {
    headers: {
      "Authorization": `Token ${userToken}`, // Include the token in the header
    },
  });
  return response.data;
};

const fetchCourses = async () => {
  const userToken = localStorage.getItem("user_token"); // Retrieve the user token from local storage
  const response = await axios.get(`${API_URL}/courses/`, {
    headers: {
      "Authorization": `Token ${userToken}`, // Include the token in the header
    },
  });
  return response.data;
};

const fetchEvaluationScores = async () => {
  const userToken = localStorage.getItem("user_token"); // Retrieve the user token from local storage
  const response = await axios.get(`${API_URL}/evaluation-scores/`, {
    headers: {
      "Authorization": `Token ${userToken}`, // Include the token in the header
    },
  });
  return response.data;
};

const Profile = () => {
  const [userData, setUserData] = useState({});
  const [courses, setCourses] = useState([]);
  const [topScores, setTopScores] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [image, setImage] = useState(null);
  const [croppedImageUrl, setCroppedImageUrl] = useState(null);
  const [crop, setCrop] = useState({ aspect: 1, unit: '%', width: 50, height: 50 });
  const [isEditing, setIsEditing] = useState(false);
  const [isCropping, setIsCropping] = useState(false);
  const imageRef = useRef(null);

  // Fetch data from the backend when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const users = await fetchUsers();
        const coursesData = await fetchCourses();
        const evaluationScores = await fetchEvaluationScores();

        // Assuming you want the first user for demonstration
        if (users.length > 0) {
          setUserData(users[0]);
        }
        setCourses(coursesData);
        setTopScores(evaluationScores);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        setCroppedImageUrl(null);
        setIsCropping(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropChange = (newCrop) => {
    setCrop(newCrop);
  };

  const handleCropComplete = (newCrop) => {
    if (imageRef.current && newCrop.width && newCrop.height) {
      getCroppedImg(imageRef.current, newCrop, 'croppedImage.jpeg').then((url) => {
        setCroppedImageUrl(url);
      });
    }
  };

  const getCroppedImg = (image, crop, fileName) => {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Canvas is empty'));
          return;
        }
        blob.name = fileName;
        resolve(window.URL.createObjectURL(blob));
      }, 'image/jpeg');
    });
  };

  const handleSaveProfilePicture = () => {
    if (croppedImageUrl) {
      setImage(croppedImageUrl);
      setIsCropping(false);
      setCroppedImageUrl(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Profile Saved:', { userData, image });
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleLogout = () => {
    console.log('User  logged out');
    // Add logout logic here (e.g., clear session, redirect to login page)
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const Header = () => {
    return (
      <AppBar position="fixed" sx={{ backgroundColor: "#003366", padding: "4px 8px" }}>
        <Toolbar sx={{ padding: "0" }}>
          <IconButton color="inherit" edge="start" sx={{ marginRight: 2 }} onClick={toggleSidebar}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, fontSize: "1rem" }}>
            Vdart Online Test Platform
          </Typography>
          <Button color="inherit" onClick={() => console.log("Navigate to Home")}>Home</Button>
          <Button color="inherit" onClick={() => console.log("Navigate to User Profile")}>User  Profile</Button>
          <Button color="inherit" onClick={() => console.log("Navigate to Test List")}>Test List</Button>
          <Button color="inherit" onClick={() => console.log("Navigate to Settings")}>Settings</Button>
          <Button color="inherit" onClick={handleLogout}>Logout</Button>
        </Toolbar>
      </AppBar>
    );
  };

  return (
    <div className="profile-container">
      <Header />

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
            <ListItem button onClick={() => console.log("Navigate to Dashboard")}>
              <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem button onClick={() => console.log("Navigate to Available Tests")}>
              <ListItemText primary="Available Tests" />
            </ListItem>
            <ListItem button onClick={() => console.log("Navigate to Attempted Tests")}>
              <ListItemText primary="Attempted Tests" />
            </ListItem>
            <ListItem button onClick={() => console.log("Navigate to Performance History")}>
              <ListItemText primary="Performance History" />
            </ListItem>
            <ListItem button onClick={() => console.log("Navigate to Leaderboard")}>
              <ListItemText primary="Leaderboard" />
            </ListItem>
            <ListItem button onClick={() => console.log("Navigate to Settings")}>
              <ListItemText primary="Settings" />
            </ListItem>
            <ListItem button onClick={handleLogout}>
              <ListItemText primary="Logout" />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      <style>
        {`
          .profile-container {
            display: flex;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f9f9f9;
            min-height: 130vh;
            min-width: 150vh;
          }

          .profile-content {
            flex: 1;
            padding: 30px;
            background-color: white;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            margin: 20px;
            border-radius: 10px;
          }

          .profile-content h1 {
            font-size: 24px;
            margin-bottom: 20px;
            color: #2c3e50;
          }

          .image-upload {
            text-align: center;
            margin-bottom: 20px;
          }

          .profile-pic {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            object-fit: cover;
            border: 4px solid #003366;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s ease;
          }

          .profile-pic:hover {
            transform: scale(1.1);
          }

          .upload-button {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            background-color: #003366;
            color: white;
            padding: 10px 15px;
            border-radius: 25px;
            cursor: pointer;
            font-size: 14px;
            margin-top: 5px;
            transition: background-color 0.3s ease, transform 0.3s ease;
          }

          .upload-button:hover {
            background-color: rgb(11, 13, 107);
            transform: translateY(-2px);
          }

          .form-group {
            margin-bottom: 20px;
            flex-direction: column;
            justify-content: center;
            position: relative;
          }

          .form-group label {
            display: block;
            font-size: 16px;
            color:rgb(0, 37, 73);
            margin-bottom: 8px;
          }

          .form-group input {
            width: 200%; /* Set width to 100% of the parent */
            max-width: 400px; /* Optional: Set a max width for larger screens */
            padding: 15px 15px 15px 40px;
            border: 2px solid #e0e0e0;
            border-radius: 10px;
            font-size: 18px;
            color: #333;
            background-color: rgb(250, 248, 248);
            transition: border-color 0.3s ease, box-shadow 0.3s ease;
          }

          .form-group input:focus {
            border-color: #003366;
            box-shadow: 0 0 8px rgb(8, 31, 75);
            outline: none;
          }

          .form-group small {
            display: block;
            margin-top: 5px;
            font-size: 12px;
            color: #777;
          }

          .form-group .icon {
            position: absolute;
            left: 10px;
            top: 60%;
            transform: translateY(-50%);
            color: #003366;
          }

          .save-button {
            width: 100%;
            background-color: #003366;
            color: white;
            padding: 15px;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 100;
            cursor: pointer;
            transition: background-color 0.3s ease, transform 0.3s ease;
          }

          .save-button:hover {
            background-color: #003366;
            transform: translateY(-1px);
          }

          .edit-button {
            background-color: #3498db;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: background-color 0.3s ease, transform 0.3s ease;
            margin-bottom: 20px;
          }

          .edit-button:hover {
            background-color: #2980b9;
            transform: translateY(-2px);
          }

          .two-column-layout {
            display: flex;
            gap: 20px;
            margin-top: 20px;
          }

          .column {
            flex: 1;
            display: flex;
            flex-direction: column; /* Ensure children stack vertically */
          }

          .column:first-child {
            max-width: 50%;
          }

          .column:last-child {
            max-width: 50%;
          }

          .courses-section, .top-scores-section {
            margin-top: 1px;
          }

          .courses-list, .top-scores-list {
            display: flex;
            flex-direction: column; /* Stack cards vertically */
            gap: 15px;
          }

          .course-card, .score-card {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            border: 1px solid #e0e0e0;
            width: 95%; /* Full width */
            height: 82%;
            box-shadow: 0 2px 5px rgba(192, 33, 33, 0.1);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            display: flex;
            align-items: center;
            gap: 10px;
          }

          .course-card:hover, .score-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 4px 15px rgba(88, 53, 53, 0.2);
          }

          .detail-card {
            background-color: #f8f9fa;
            padding: 40px;
            border-radius: 8px;
            border: 1px solid #e0e0e0;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 15px;
          }

          .footer {
            text-align: center;
            padding: 2px 0;
            background-color: #003366;
            color: #fff;
            position: relative;
            bottom: 0;
            width: 100%;
          }

          .footer .social-icons {
            display: flex;
            justify-content: center;
            margin-top: 8px;
          }

          .footer .social-icons .icon-button {
            color: inherit;
          }
        `}
      </style>

      <div className="profile-content">
        <h1>Profile</h1>
        {!isEditing && (
          <button className="edit-button" onClick={handleEdit}>
            <FaEdit /> Edit Profile
          </button>
        )}
        <div className="image-upload">
          {image ? (
            <img src={image} alt="Profile" className="profile-pic" />
          ) : (
            <FaUser  size={80} />
          )}
          {isEditing && (
            <label htmlFor="upload-image" className="upload-button">
              <FaUpload /> Upload Image
            </label>
          )}
          <input
            type="file"
            id="upload-image"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: 'none' }}
          />
        </div>

        {isCropping && image && (
          <div style={{ position: 'relative', width: '300px', height: '300px' }}>
            <ReactCrop
              src={image}
              crop={crop}
              onChange={handleCropChange}
              onComplete={handleCropComplete}
            >
              <img ref={imageRef} src={image} alt="Upload" style={{ maxWidth: '100%', maxHeight: '100%' }} />
            </ReactCrop>
            {croppedImageUrl && (
              <div style={{ marginTop: '10px' }}>
                <img src={croppedImageUrl} alt="Cropped" style={{ width: '100px', height: '100px' }} />
                <button onClick={handleSaveProfilePicture} className="save-button">Save Cropped Image</button>
              </div>
            )}
          </div>
        )}

        {isEditing ? (
          <div className="two-column-layout">
            <div className="column">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Full Name</label>
                  <div className="icon">
                    <FaUser  />
                  </div>
                  <input
                    type="text"
                    value={userData.full_name || ''}
                    onChange={(e) => setUserData({ ...userData, fullName: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Phone</label>
                  <div className="icon">
                    <FaPhone />
                  </div>
                  <input
                    type="text"
                    value={userData.phone || ''}
                    onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                    required
                  />
                  <small>We collect this in case of emergencies.</small>
                </div>

                <div className="form-group">
                  <label>Email Address</label>
                  <div className="icon">
                    <FaEnvelope />
                  </div>
                  <input
                    type="email"
                    value={userData.email || ''}
                    onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Password</label>
                  <div className="icon">
                    <FaLock />
                  </div>
                  <input
                    type="password"
                    value={userData.password || ''}
                    onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                    required
                  />
                </div>

                <button type="submit" className="save-button">Save Profile</button>
              </form>
            </div>
          </div>
        ) : (
          <div className="two-column-layout">
            <div className="column">
              <div className="detail-card">
                <FaUser  /> <strong>Full Name:</strong> {userData.full_name || "N/A"}
              </div>
              <div className="detail-card">
                <FaPhone /> <strong>Phone:</strong> {userData.phone || "N/A"}
              </div>
              <div className="detail-card">
                <FaEnvelope /> <strong>Email:</strong> {userData.email || "N/A"}
              </div>
              <div className="detail-card">
                <FaLock /> <strong>Password:</strong> ********
              </div>
            </div>

            <div className="column">
              <div className="top-scores-section">
                <div className="score-card">
                  <h2><FaTrophy /> Top Scores</h2>
                  <div className="top-scores-list" style={{ marginTop: '20px' }}>
                    {topScores.map((score, index) => (
                      <div key={index} className="score-card">
                        <FaBook /> {score.testName}: {score.score}%
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="courses-section">
                <div className="course-card">
                  <h2><FaGraduationCap /> My Courses</h2>
                  <div className="courses-list">
                    {courses.map((course, index) => (
                      <div key={index} className="course-card">
                        <FaBook /> {course.name} {/* Assuming course has a name property */}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Box sx={{ backgroundColor: "#003366", position: "fixed", bottom: 0, left: 0, right: 0, color: "white", padding: "2px", textAlign: "center" }}>
        <Typography variant="body2" sx={{ color: "white", marginBottom: "8px" }}>
          © {new Date().getFullYear()} Vdart Online Test Platform. All rights reserved.
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center", gap: "16px", marginTop: "8px" }}>
          <IconButton color="inherit" onClick={() => window.open("https://twitter.com", "_blank")}><TwitterIcon /></IconButton>
          <IconButton color="inherit" onClick={() => window.open("https://facebook.com", "_blank")}><FacebookIcon /></IconButton>
          <IconButton color="inherit" onClick={() => window.open("https://instagram.com", "_blank")}><InstagramIcon /></IconButton>
        </Box>
      </Box>
    </div>
  );
};

export default Profile;