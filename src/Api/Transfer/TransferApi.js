import axios from "axios";
import { organization } from "../zincoApi";

const createTransfer = async function (body) {
  const { data } = await axios.post("v1/transfer/create-transfer/", {
    organization,
    ...body,
  });
  return data;
};

const updateTransfer = async function (body) {
  const { data } = await axios.post("v1/transfer/update-transfer/", {
    organization,
    ...body,
  });
  return data;
};

const deleteTransfer = async function (body) {
  const { data } = await axios.post("v1/transfer/delete-transfer/", {
    organization,
    ...body,
  });
  return data;
};

const detailsTransfer = async function (body) {
  const { data } = await axios.post("v1/transfer/details-transfer/", {
    organization,
    ...body,
  });
  return data;
};

const listTransfer = async function (body) {
  const { data } = await axios.post("v1/transfer/list-transfer/", {
    organization,
    ...body,
  });
  return data;
};

export {
  createTransfer,
  updateTransfer,
  deleteTransfer,
  detailsTransfer,
  listTransfer,
};
