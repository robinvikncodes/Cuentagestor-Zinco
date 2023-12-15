import axios from "axios";
import { organization } from "../zincoApi";
import { BaseUrl } from "../../globalVariable";

const createAssets = async function (body) {
  const formData = new FormData();
  formData.append("organization", organization);
  formData.append("address", JSON.stringify(body.address));
  formData.append("asset_details", JSON.stringify(body.asset_details));
  formData.append("asset_name", body.asset_name);
  formData.append("asset_type", body.asset_type);
  formData.append("date", body.date);
  formData.append("id", body.id);
  formData.append("total_share", body.total_share);
  formData.append("total_value", body.total_value);

  body.images &&
  body.images.forEach((file) => {
    formData.append("images", file);
  });

  const { data } = await axios.post("v1/assets/create-asset/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

const updateAssets = async function (body) {
  const formData = new FormData();

  formData.append("organization", organization);
  formData.append("address", JSON.stringify(body.address));
  formData.append("asset_details", JSON.stringify(body.asset_details));
  formData.append("asset_name", body.asset_name);
  formData.append("asset_type", body.asset_type);
  formData.append("date", body.date);
  formData.append("id", body.id);
  formData.append("total_share", body.total_share);
  formData.append("total_value", body.total_value);

  body.images &&
  body.images.forEach((file) => {
    formData.append("images", file);
  });

  const { data } = await axios.post("v1/assets/update-asset/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
};

const deleteAssets = async function (body) {
  const { data } = await axios.post("v1/assets/delete-asset/", {
    organization,
    ...body,
  });
  return data;
};

const detailAssets = async function (body) {
  const { data } = await axios.post("v1/assets/details-asset/", {
    organization,
    ...body,
  });
  return data;
};

const viewAssets = async function (body) {
  const { data } = await axios.post("v1/assets/view-asset/", {
    organization,
    ...body,
  });
  return data;
};

const listAssets = async function (body) {
  const { data } = await axios.post("v1/assets/list-asset/", {
    organization,
    ...body,
  });
  return data;
};

const addStock = async function (body) {
  const { data } = await axios.post("v1/assets/add-stock/", {
    organization,
    ...body,
  });
  return data;
};

const editStock = async function (body) {
  const { data } = await axios.post("v1/assets/edit-stock/", {
    organization,
    ...body,
  });
  return data;
};

const deleteStock = async function (body) {
  const { data } = await axios.post("v1/assets/delete-stock/", {
    organization,
    ...body,
  });
  return data;
};

const addProperty = async function (body) {
  const { data } = await axios.post("v1/assets/add-property/", {
    organization,
    ...body,
  });
  return data;
};

const editProperty = async function (body) {
  const { data } = await axios.post("v1/assets/edit-property/", {
    organization,
    ...body,
  });
  return data;
};

const deleteProperty = async function (body) {
  const { data } = await axios.post("v1/assets/delete-property/", {
    organization,
    ...body,
  });
  return data;
};

const addDocument = async function (body) {
  let formData = new FormData()
  formData.append("organization", organization)
  formData.append("documents", body.documents)
  formData.append("asset_master_id", body.asset_master_id)
  
  const { data } = await axios.post(
    "v1/assets/add-document/",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return data;
};

const deleteDocument = async function(body) {
  const { data } = await axios.post("v1/assets/delete-document/", {
    organization,
    ...body,
  });
  return data;
};

export {
  createAssets,
  updateAssets,
  deleteAssets,
  detailAssets,
  viewAssets,
  listAssets,
  addStock,
  addProperty,
  addDocument,
  editStock,
  deleteStock,
  deleteProperty,
  deleteDocument,
  editProperty
};
