import axios from "axios";
import { BaseUrl } from "../globalVariable";
const userData = JSON.parse(localStorage.getItem("UserCredentials"));

// axios.defaults.baseURL = 'https://www.api.zinco.co.in/api/';
axios.defaults.baseURL = BaseUrl + "/api/";
axios.defaults.headers.post["Content-Type"] = "application/json";
if (userData) {
  axios.defaults.headers.common["Authorization"] = "Bearer " + userData.access_token;
  axios.defaults.transformRequest = [
    (data, headers) => {
      if (headers["Content-Type"] === "multipart/form-data") {
        data.append("country_id", userData.country_details.id);
        return data;
      } else {
        data.country_id = userData.country_details.id;
        return JSON.stringify(data);
      }
    },
  ];
}

export const organization = userData && userData.organization;
