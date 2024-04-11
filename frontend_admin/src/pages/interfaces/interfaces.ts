import { message } from "antd";
import axios from "axios";
import { UserInfo } from "../InfoModify/InfoModify";
import { UpdatePassword } from "../PasswordModify/PasswordModify";
import { CreateMeetingRoom } from "../MeetingRoomManage/CreateMeetingRoomModal";
import { UpdateMeetingRoom } from "../MeetingRoomManage/UpdateMeetingRoom";

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
    let { data, config } = error.response || {};

    if (
      data &&
      data.code === 401 &&
      !config.url.includes("/user/admin/refresh")
    ) {
      const res = await refreshToken();

      if (res?.status === 200) {
        config.headers.authorization = "Bearer " + res.data.data.access_token;
        return axios(config);
      } else {
        message.error(res?.data || "未知错误");

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

// 冻结用户
export async function freeze(id: number) {
  return await axiosInstance.get("/user/freeze", {
    params: {
      id,
    },
  });
}

// 获取用户信息
export async function getUserInfo() {
  return await axiosInstance.get("/user/info");
}

// 更新用户信息
export async function updateInfo(data: UserInfo) {
  return await axiosInstance.post("/user/admin/update", data);
}

// 获取验证码
export async function updateUserInfoCaptcha() {
  return await axiosInstance.get("/user/update/captcha");
}

// 密码更新验证码
export async function updatePasswordCaptcha(email: string) {
  return await axiosInstance.get("/user/update_password/captcha", {
    params: {
      address: email,
    },
  });
}

// 密码更新
export async function updatePassword(data: UpdatePassword) {
  return await axiosInstance.post("/user/admin/update_password", data);
}

// 获取会议室列表
export async function meetingRoomList(
  name: string,
  capacity: number,
  equipment: string,
  pageNo: number,
  pageSize: number
) {
  return await axiosInstance.get("/meeting-room/list", {
    params: {
      name,
      capacity,
      equipment,
      pageNo,
      pageSize,
    },
  });
}

// 删除会议室
export async function deleteMeetingRoom(id: number) {
  return await axiosInstance.delete("/meeting-room/" + id);
}

// 添加会议室
export async function createMeetingRoom(meetingRoom: CreateMeetingRoom) {
  return await axiosInstance.post("/meeting-room/create", meetingRoom);
}

// 更新会议室信息
export async function updateMeetingRoom(meetingRoom: UpdateMeetingRoom) {
  return await axiosInstance.post("/meeting-room/update", meetingRoom);
}

// 查找会议室
export async function findMeetingRoom(id: number) {
  return await axiosInstance.get("/meeting-room/" + id);
}
