import axios from "axios";
import { RegisterUser } from "../page/register/Register";
import { UpdatePassword } from "../page/update_password/UpdatePassword";
import { UserInfo } from "../page/update_info/UpdateInfo";
import { message } from "antd";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3005/",
  timeout: 3000,
});

axiosInstance.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("access_token");
  if (accessToken) {
    config.headers.authorization = "Bearer " + accessToken;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    let { data, config } = error.response;

    if (data.code === 401 && !config.url.includes("/user/refresh")) {
      const res = await refreshToken();
      if (res.status === 200) {
        config.headers.authorization = "Bearer " + res.data.data.access_token;
        return axios(config);
      } else {
        message.error(res.data);

        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
      }

      return error.response;
    } else {
      return error.response;
    }
  }
);

// 登录
export async function login(username: string, password: string) {
  return await axiosInstance.post("/user/login", {
    username,
    password,
  });
}

// 注册验证码
export async function registerCaptcha(address: string) {
  return await axiosInstance.get("/user/register-captcha", {
    params: { address },
  });
}

// 注册
export async function register(registerUser: RegisterUser) {
  return await axiosInstance.post("/user/register", registerUser);
}

// 刷新token
async function refreshToken() {
  const res = await axiosInstance.get("/user/refresh", {
    params: {
      refreshToken: localStorage.getItem("refresh_token"),
    },
  });
  if (res.status === 200) {
    localStorage.setItem("access_token", res.data.data.access_token || "");
    localStorage.setItem("refresh_token", res.data.data.refresh_token || "");
  }

  return res;
}

// 修改密码验证码
export async function updatePasswordCaptcha(email: string) {
  return await axiosInstance.get("/user/update_password/captcha", {
    params: {
      address: email,
    },
  });
}

// 修改密码
export async function updatePassword(data: UpdatePassword) {
  return await axiosInstance.post("/user/update_password", data);
}

// 获取用户信息
export async function getUserInfo() {
  return await axiosInstance.get("/user/info");
}

// 更新用户信息
export async function updateInfo(data: UserInfo) {
  return await axiosInstance.post("/user/update", data);
}

// 更新用户信息验证码
export async function updateUserInfoCaptcha() {
  return await axiosInstance.get("/user/update/captcha");
}
