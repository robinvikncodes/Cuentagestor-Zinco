import axios from "axios";
import { organization } from "../zincoApi"; 

const financeList = async function (body) {
  const { data } = await axios.post("v1/finance/list-finance/", {
    organization,
    ...body
  });
  return data;
};

const listFinanceTransaction = async function (body) {
  const { data } = await axios.post("v1/finance/list-finance-transaction/", {
    organization,
    ...body
  });
  return data;
};

const detailFinance = async function (body) {
  const { data } = await axios.post("v1/finance/details-finance/", {
    organization,
    ...body
  });
  return data;
};

const listAccountFinance = async function (body) {
  const { data } = await axios.post("v1/finance/list-account-finance/", {
    organization,
    ...body
  });
  return data;
};

const createListTransaction = async function(body) {
  const { data } = await axios.post("v1/finance/create-finance/", {
    organization,
    ...body
  });
  return data;
}

const updateListTransaction = async function(body) {
  const { data } = await axios.post("v1/finance/update-finance/", {
    organization,
    ...body
  });
  return data;
}

const deleteTransaction = async function(body) {
  const { data } = await axios.post("v1/finance/delete-finance/", {
    organization,
    ...body
  });
  return data;
}

export { financeList, listFinanceTransaction, detailFinance, listAccountFinance, createListTransaction, updateListTransaction, deleteTransaction };