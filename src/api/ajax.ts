import axios, {AxiosInstance, AxiosRequestConfig, AxiosResponse} from 'axios';
import qs from 'qs'

import {showMessage} from "./status";
import {message} from 'antd';
import {storageUtils} from "../utils/storageUtils";
import {useNavigate} from "react-router-dom";


// 返回res.data的interface
export interface IResponse {
    code: number | string;
    data: any;
    msg: string;
    total: number
}

export const axiosInstance: AxiosInstance = axios.create({
    baseURL: "interview/",
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
    },
});

// axios实例拦截响应
axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
        // if (response.headers.authorization) {
        //     localStorage.setItem('app_token', response.headers.authorization);
        // } else {
        //     if (response.data && response.data.token) {
        //         localStorage.setItem('app_token', response.data.token);
        //     }
        // }

        if (response.status === 200) {
            return response;
        } else {
            showMessage(response.status);
            if (response.status === 401) {
                storageUtils.logout()
                window.location.href = "/salvo/login";
            }
            return response;
        }
    },
    // 请求失败
    (error: any) => {
        const {response} = error;
        if (response) {
            // 请求已发出，但是不在2xx的范围
            showMessage(response.status);
            if (response.status === 401) {
                storageUtils.logout()
                window.location.href = "/salvo/login";
            }
            return Promise.reject(response.data);
        } else {
            message.error('网络连接异常,请稍后再试!');
        }
    }
);

// axios实例拦截请求
axiosInstance.interceptors.request.use(
    (config: AxiosRequestConfig) => {
        const token = storageUtils.getToken()
        if (token) {
            // @ts-ignore
            config.headers.Authorization = `Bearer ${token}`
        }

        return config;
    },
    (error: any) => {
        return Promise.reject(error);
    }
)



