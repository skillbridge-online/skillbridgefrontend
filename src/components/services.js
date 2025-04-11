import axios from "axios";

const API = axios.create({
  baseURL: "https://onlineplatform.onrender.com",
});

export default API;
