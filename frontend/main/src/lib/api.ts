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

// 插件相关类型和API
export interface PluginData {
  slug: string;
  category: string;
  apiPath: string;
  order: number;
  title: string;
  description: string;
  h1: string;
  icon: string;
  faq: Array<{ question: string; answer: string }>;
  schema: {
    upload: {
      multiple: boolean;
      maxFiles: number;
      types: string[];
      maxSize: number;
    };
    options: Array<{
      name: string;
      type: string;
      label: string;
      placeholder?: string;
      min?: number;
      max?: number;
      default?: any;
      choices?: Array<{ value: string; label: string }>;
    }>;
    submitText: string;
    outputType: string;
  };
}

export interface PluginsResponse {
  success: boolean;
  data: {
    plugins: PluginData[];
    categories: Record<string, PluginData[]>;
  };
}

export async function fetchPlugins(lang: string = 'en'): Promise<PluginsResponse> {
  const response = await api.get(`/api/plugins?lang=${lang}`);
  return response.data;
}

export async function fetchPlugin(slug: string, lang: string = 'en'): Promise<{ success: boolean; data: PluginData }> {
  const response = await api.get(`/api/plugins/${slug}?lang=${lang}`);
  return response.data;
}

export async function submitToolRequest(
  apiPath: string,
  formData: FormData
): Promise<Blob> {
  const response = await api.post(apiPath, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    responseType: 'blob'
  });
  return response.data;
}
