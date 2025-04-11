import React, { useState } from "react";
import axios from "axios";

const AuthPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLogin, setIsLogin] = useState(true);
    const [message, setMessage] = useState("");

    const handleAuth = async () => {
        try {
            const endpoint = isLogin ? "http://localhost:8000/api/login/" : "http://localhost:8000/api/register/";
            const response = await axios.post(endpoint, { email, password });
            
            localStorage.setItem("user_token", response.data.user_token);
            setMessage(response.data.message);
        } catch (error) {
            setMessage(error.response?.data?.error || "An error occurred");
        }
    };

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h2>{isLogin ? "Login" : "Register"}</h2>
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} /><br /><br />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} /><br /><br />
            <button onClick={handleAuth}>{isLogin ? "Login" : "Register"}</button>
            <p style={{ color: "green" }}>{message}</p>
            <p onClick={() => setIsLogin(!isLogin)} style={{ cursor: "pointer", color: "blue" }}>
                {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
            </p>
        </div>
    );
};

export default AuthPage;
