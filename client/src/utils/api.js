import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000';

export const sendContactForm = async (data) => {
  const response = await axios.post(`${API_BASE_URL}/contact`, data);
  return response.data;
};

export const getVideoFormats = async (url) => {
  const response = await axios.get(`${API_BASE_URL}/formats?url=${url}`);
  return response.data;
};

export const getVideoMetadata = async (url) => {
  const response = await axios.get(`${API_BASE_URL}/metainfo?url=${url}`);
  return response.data;
};

export const downloadVideo = async (url, itag) => {
  const response = await axios.get(`${API_BASE_URL}/watch?v=${url}&itag=${itag}`, {
    responseType: 'blob',
  });
  return response.data;
};
