import axios, { type AxiosInstance } from 'axios';

export const customAxiosInstance: AxiosInstance = axios.create({
    withCredentials: true,
});
