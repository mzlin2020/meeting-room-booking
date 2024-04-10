import { message } from "antd";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3005/",
  timeout: 3000,
});

axiosInstance.interceptors.request.use(function (config) {
  const accessToken = localStorage.getItem("access_token");

  if (accessToken) {
    config.headers.authorization = "Bearer " + accessToken;
  }

  console.log("token", localStorage.getItem("access_token"));

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    let { data, config } = error.response;

    if (data.code === 401 && !config.url.includes("/user/admin/refresh")) {
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
    } else {
      return error.response;
    }
  }
);

export async function login(username: string, password: string) {
  return await axiosInstance.post("/user/admin/login", {
    username,
    password,
  });
}

async function refreshToken() {
  const res = await axiosInstance.get("/user/admin/refresh", {
    params: {
      refreshToken: localStorage.getItem("refresh_token"),
    },
  });
  localStorage.setItem("access_token", res.data.data.access_token);
  localStorage.setItem("refresh_token", res.data.data.refresh_token);
  return res;
}

export async function userSearch(
  username: string,
  nickname: string,
  email: string,
  pageNo: number,
  pageSize: number
) {
  return await axiosInstance.get("/user/list", {
    params: {
      username,
      nickname,
      email,
      pageNo,
      pageSize,
    },
  });
}

export async function freeze(id: number) {
  return await axiosInstance.get("/user/freeze", {
    params: {
      id,
    },
  });
}