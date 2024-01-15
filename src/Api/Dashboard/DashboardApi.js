import axios from "axios";
import { organization } from "../zincoApi";
import { LogoutFun } from "../../globalFunctions";

const dashboardDetails = async function (body) {
  try {
    const { data } = await axios.post("v1/dashboard/details-dashboard/", {
      organization,
    });
    return data;
  } catch (error) {
    LogoutFun()
    return error;
  }
};

export { dashboardDetails };
