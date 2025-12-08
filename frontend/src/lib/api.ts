import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface FeedbackData {
  name?: string;
  email: string;
  subject?: string;
  message: string;
  tool_name?: string;
}

export const submitFeedback = async (data: FeedbackData) => {
  const response = await api.post('/api/feedback', data);
  return response.data;
};
