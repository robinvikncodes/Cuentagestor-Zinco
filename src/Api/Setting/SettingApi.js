import axios from "axios";
import { organization } from "../zincoApi";

const detailSettings = async function (body) {
  const { data } = await axios.post("v1/settings/details-settings/", {
    organization,
    ...body,
  });
  return data;
};

const ChangeSettings = async function (body) {
  let formData = new FormData();
  for (const item in body) {
    formData.append(item, body[item]);
  }
  const { data } = await axios.post("v1/settings/change-settings/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export { detailSettings, ChangeSettings };
