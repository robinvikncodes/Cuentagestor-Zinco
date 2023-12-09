import axios from "axios";
import { organization } from "../zincoApi";

const createLoans = async function (body) {
  const { data } = await axios.post("v1/loans/create-loans/", {
    organization,
    ...body,
  });
  return data;
};

const updateLoans = async function (body) {
  const { data } = await axios.post("v1/loans/update-loans/", {
    organization,
    ...body,
  });
  return data;
};

const deleteLoans = async function (body) {
  const { data } = await axios.post("v1/loans/delete-loans/", {
    organization,
    ...body,
  });
  return data;
};

const listLoans = async function (body) {
  const { data } = await axios.post("v1/loans/list-loans/", {
    organization,
    ...body,
  });
  return data;
};

const viewLoans = async function (body) {
  const { data } = await axios.post("v1/loans/view-loans/", {
    organization,
    ...body,
  });
  return data;
};

const detailLoans = async function (body) {
  const { data } = await axios.post("v1/loans/detail-loans/", {
    organization,
    ...body,
  });
  return data;
};

export {
    createLoans,
    updateLoans,
    deleteLoans,
    listLoans,
    viewLoans,
    detailLoans
}