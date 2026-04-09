import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const getDailySteps = async (token) => {
  try {
    const res = await axios.get(
      `${API_BASE_URL}/fitness/sync`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      }
    );

    return res.data;
  } catch (error) {
    console.error('Error fetching daily steps:', error.message);
    throw error;

    
  }
};