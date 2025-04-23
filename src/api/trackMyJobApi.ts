import axios, { InternalAxiosRequestConfig } from "axios";
import { getEnvVariables } from "../helpers/getEnvVariables";

const { api_URL } = getEnvVariables();

const trackMyJobApi = axios.create({
  baseURL: api_URL,
});

// Configurar interceptores
trackMyJobApi.interceptors.request.use( config => {
  const token = localStorage.getItem('token') || '';
  

  if (!config.headers) {
    config.headers = {};
  }

  config.headers['x-token'] = token;

  return config;
});

export default trackMyJobApi;