import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { message } from 'antd';
import { baseUrl } from '../../config/apiConfig'

/**
 * API 响应数据格式
 */
export interface ApiResponse<T = any> {
  success: boolean;
  code: number;
  message: string;
  data: T;
}

/**
 * 创建 axios 实例
 */
const instance: AxiosInstance = axios.create({
  baseURL: baseUrl, // 基础 URL，可根据环境配置
  timeout: 1000 * 60 * 5, // 请求超时时间
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * 请求拦截器
 * - 添加 token
 * - 设置请求头
 */
instance.interceptors.request.use(
  (config) => {
    // 从本地存储获取 token
    const token = sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    console.error('请求错误:', error);
    return Promise.reject(error);
  }
);

/**
 * 响应拦截器
 * - 统一处理错误
 * - 统一响应格式
 */
instance.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const res = response.data;
    // 如果响应码不是 200，视为错误
    if (res.code !== 200) {
      message.error(res.message || '请求失败');
      // return Promise.reject(new Error(res.message || '请求失败'));
    }

    return response;
  },
  (error: AxiosError) => {
    console.error('响应错误:', error);

    // 处理网络错误
    if (!error.response) {
      message.error('网络错误，请检查网络连接');
      return Promise.reject(error);
    }

    // 处理 HTTP 错误
    const status = error.response.status;
    switch (status) {
      case 401:
        message.error('未授权，请重新登录');
        // 可以在这里添加跳转到登录页的逻辑
        break;
      case 403:
        message.error('令牌失效，或服务器未启动');
        break;
      case 404:
        message.error('请求的资源不存在');
        break;
      case 500:
        message.error('服务器内部错误');
        break;
      default:
        message.error(`请求失败 (${status})`);
    }

    return Promise.reject(error);
  }
);

/**
 * 封装请求方法，添加泛型支持
 */
const request = {
  /**
   * GET 请求
   * @param url 请求地址
   * @param config 请求配置
   * @returns Promise<ApiResponse<T>>
   */
  get: async <T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    const response = await instance.get<ApiResponse<T>>(url, config);
    return response.data;
  },

  /**
   * POST 请求
   * @param url 请求地址
   * @param data 请求数据
   * @param config 请求配置
   * @returns Promise<ApiResponse<T>>
   */
  post: async <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    const response = await instance.post<ApiResponse<T>>(url, data, config);
    return response.data;
  },

  /**
   * PUT 请求
   * @param url 请求地址
   * @param data 请求数据
   * @param config 请求配置
   * @returns Promise<ApiResponse<T>>
   */
  put: async <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    const response = await instance.put<ApiResponse<T>>(url, data, config);
    return response.data;
  },

  /**
   * DELETE 请求
   * @param url 请求地址
   * @param config 请求配置
   * @returns Promise<ApiResponse<T>>
   */
  delete: async <T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    const response = await instance.delete<ApiResponse<T>>(url, config);
    return response.data;
  },

  /**
   * 原始 axios 实例
   */
  instance,
};

export default request;
