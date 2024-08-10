import axios from "axios";
import {jwtDecode} from 'jwt-decode';
import dayjs from "dayjs";
import { BASE_URL } from "../../utils/config";

const baseUrl = `${BASE_URL}/api/v1`;


const createAxiosInstance = () => {
    const instance = axios.create({
        baseURL: baseUrl,
    });

    instance.interceptors.request.use(async req => {
        const token = JSON.parse(localStorage.getItem('access'));
        const refresh_token = JSON.parse(localStorage.getItem('refresh'));

        if (token) {
            const user = jwtDecode(token);
            const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;   

            if (!isExpired) {
                req.headers.Authorization = `Bearer ${token}`;
            } else {
                try {
                    const response = await axios.post(`${baseUrl}/auth/token/refresh/`, { refresh: refresh_token });
                    localStorage.setItem('access', JSON.stringify(response.data.access));
                    req.headers.Authorization = `Bearer ${response.data.access}`;
                } catch (error) {
                    localStorage.removeItem('access');
                    localStorage.removeItem('refresh');
                    localStorage.removeItem('user');
                }
            }
        }
        if (req.data instanceof FormData) {
            console.log("form-dataaaaaaaaaaaaaaaaaa")
            req.headers['Content-Type'] = 'multipart/form-data';
        } else {
            req.headers['Content-Type'] = 'application/json';
            console.log("jsonssssssssss")
        }

        return req;
    }, error => {
        return Promise.reject(error);
    });

    return instance;
};

const axiosInstance = createAxiosInstance();

export default axiosInstance;
