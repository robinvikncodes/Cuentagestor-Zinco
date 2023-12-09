import axios from "axios";

const countryLists = async function () {
  const res = await axios.post("v1/country/list-default-country/");
  return res.data;
};

const createUser = async function (body) {
  const res = await axios.post("v1/users/user-signup/", body);
  return res.data;
};

const resendEmail = async function (body) {
  const res = await axios.post("v1/users/resend-email/", body);
  return res.data;
};

const userVerify = async function (body) {
  const res = await axios.post("v1/users/user-verify/", body);
  return res.data;
};

const userLogin = async function (body) {
  const res = await axios.post("v1/users/login/", body);
  return res.data;
};

const resetPassword = async function (body) {
    const res = await axios.post("v1/users/reset-password/", body);
    return res.data;
};

const resetPasswordOTP = async function (body) {
  const res = await axios.post("v1/users/reset-password-otp/", body);
  return res.data;
};

const deleteUserAccount = async function (body) {
  const res = await axios.post("v1/users/user-delete/", body);
  return res.data;
};

export {
  countryLists,
  createUser,
  userVerify,
  userLogin,
  resendEmail,
  resetPassword,
  resetPasswordOTP,
  deleteUserAccount
};
