import axios from "axios";
import accessToken from "./jwt-token-access/accessToken";

//pass new generated access token here
const token = accessToken;

export const API_URL2 = process.env.REACT_APP_DEFAULTAUTH === 'dev'
  ? "http://localhost:8080"
  : "https://myec2lorion.zapto.org";

//process.env.REACT_APP_DEFAULTAUTH == 'prod'
//const API_URL = process.env.API_URL ;
const axiosApi = axios.create({
  baseURL: API_URL2,
});

const axiosApiFile = axios.create({
  baseURL: API_URL2,
  headers: {
    'Content-Type': 'multipart/form-data'
  },
});
const obj = JSON.parse(localStorage.getItem("authUser"));


axiosApi.defaults.headers.common["Authorization"] = obj?.token;
axiosApiFile.defaults.headers.common["Authorization"] = obj?.token;

export function setAuthToken(token) {
  console.log(token)
  axiosApi.defaults.headers.common["Authorization"] = token;
}

export function setAuthTokenFile(token) {
  console.log(token)
  axiosApiFile.defaults.headers.common["Authorization"] = token;
}


axiosApi.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

axiosApiFile.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export async function get(url, config = {}) {
  return await axiosApi
    .get(url, { ...config })
    .then((response) => response.data)
    .catch(err => {
           
      throw err;
    });
}

export async function post(url, data, config = {}) {
  return axiosApi
    .post(url, { ...data }, { ...config })
    .then((response) => response.data);
}

export async function postFile(url,data) {
  return axiosApiFile
    .post(url, { ...data })
    .then((response) => response.data);
}

export async function put(url, data, config = {}) {
  return axiosApi
    .put(url, { ...data }, { ...config })
    .then((response) => response.data);
}

export async function del(url, config = {}) {
  return await axiosApi
    .delete(url, { ...config })
    .then((response) => response.data);
}
