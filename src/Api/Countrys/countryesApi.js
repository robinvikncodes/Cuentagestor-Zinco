import axios from "axios";
import { organization } from "../zincoApi";

const allCountryLists = async function () {
  const res = await axios.post("v1/country/list-default-country/");
  return res.data;
};

const userCountryList = async function (body) {
  const res = await axios.post("v1/country/list-country/", {
    organization,
    ...body
  });
  return res.data;
};

const defaultCountry = async function (body) {
  const res = await axios.post("v1/country/default-country/", {
    organization,
    ...body
  });
  return res.data;
};

const createCountry = async function (body) {
  const res = await axios.post("v1/country/create-country/", {
    organization,
    ...body
  });
  return res.data;
};

export { userCountryList, allCountryLists, defaultCountry, createCountry };
