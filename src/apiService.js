import axios from 'axios';
import Cookies from 'js-cookie'; // Import js-cookie to manage cookies

const API_URL = 'http://127.0.0.1:8000/api/test-attempts/';

// Helper function to get auth headers dynamically
const getAuthHeaders = () => {
    const token = localStorage.getItem('user_token'); // Retrieve token from localStorage
    const csrfToken = Cookies.get('csrftoken'); // Get CSRF token from cookies

    let headers = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Token ${token}`;
    }
    if (csrfToken) {
        headers['X-CSRFToken'] = csrfToken;
    }

    return headers;
};

// Ensure CSRF token is set before making API requests
export const getCSRFToken = async () => {
    try {
        await axios.get("http://127.0.0.1:8000/api/csrf/", { withCredentials: true });
        console.log("CSRF token set successfully.");
    } catch (error) {
        console.error("Failed to fetch CSRF token:", error);
    }
};

// Call getCSRFToken() before making API requests
export const startTest = async (testId) => {
    try {
        await getCSRFToken();  // Ensure CSRF token is set

        const response = await axios.post(
            API_URL,
            { test_id: testId },
            {
                headers: getAuthHeaders(),
                withCredentials: true, // Allow cookies for CSRF
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error starting test:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const submitAnswers = async (attemptId, answers) => {
    try {
        const response = await axios.put(
            `${API_URL}${attemptId}/`,
            { answers },
            {
                headers: getAuthHeaders(),
                withCredentials: true, // Allow cookies for CSRF
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error submitting answers:', error.response ? error.response.data : error.message);
        throw error;
    }
};

// Fetch test attempt details request
export const fetchTestAttemptDetails = async (attemptId) => {
    try {
        const response = await axios.get(
            `${API_URL}${attemptId}/`,
            {
                headers: getAuthHeaders(),
                withCredentials: true, // Allow cookies for CSRF
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching test attempt details:', error.response ? error.response.data : error.message);
        throw error;
    }
};
