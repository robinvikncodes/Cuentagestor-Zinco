import axios from "axios";
import { organization } from "../zincoApi";

const userRoles = async function (body) {
  const { data } = await axios.post("v1/organizations/user-roles/", {
    organization,
    ...body,
  });
  return data;
};

const listUserType = async function (body) {
  const { data } = await axios.post("v1/organizations/list-user-type/", {
    organization,
    ...body,
  });
  return data;
};

const listUser = async function (payload) {
  let url = "v1/organizations/list-users/";
  if (payload.method === "get") {
    url = `v1/organizations/list-users/${organization}/`;
  }
  const { data } = await axios({
    method: payload.method,
    headers: {
      "Content-Type": "application/json",
    },
    url,
    data: {
      organization,
      ...payload.data,
    },
  });
  return data;
};

const listOrginization = async function (payload) {
  let url = "v1/organizations/list-organizations/";
  // if (payload.method === "get") {
  //   url = `v1/organizations/list-users/${organization}/`;
  // }
  const { data } = await axios({
    method: payload.method,
    headers: {
      "Content-Type": "application/json",
    },
    url,
    data: {
      organization,
      ...payload.data,
    },
  });
  return data;
};


export { userRoles, listUserType, listUser, listOrginization };