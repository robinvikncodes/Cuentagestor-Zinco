import axios from "axios";
import { organization } from "../zincoApi";

// axios.defaults.headers.post['Content-Type'] = 'multipart/form-data';

const createContact = async function (body) {
  const formData = new FormData()
  for(const name in body) {
    formData.append(name, body[name]);
  }
  formData.append("organization", organization);
  const { data } = await axios.post(
    "v1/contacts/create-contact/",
      // organization,
      // ...body,
      formData
    ,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return data;
};

const detailsContact = async function (body) {
  const { data } = await axios.post("v1/contacts/details-contact/", {
    organization,
    ...body,
  });
  return data;
};

const updateContact = async function (body) {
  const formData = new FormData()
  for(const name in body) {
    formData.append(name, body[name]);
  }
  formData.append("organization", organization);
  const { data } = await axios.post(
    "v1/contacts/update-contact/",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return data;
};

const deleteContact = async function (body) {
  const { data } = await axios.post("v1/contacts/delete-contact/", {
    organization,
    ...body,
  });
  return data;
};

const listContact = async function (body) {
  const { data } = await axios.post("v1/contacts/list-contact/", {
    organization,
    ...body,
  });
  return data;
};

export {
  createContact,
  detailsContact,
  updateContact,
  deleteContact,
  listContact,
};
