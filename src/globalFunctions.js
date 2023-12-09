// import XLSX from 'xlsx';
// import { useSelector } from "react-redux";
import * as XLSX from "xlsx";
import { store } from "./app/store";

const LogoutFun = function () {
  localStorage.removeItem("UserCredentials");
  localStorage.removeItem("isUserActivate");
  window.location.reload();
};

const ExportExcel = function (data, filename) {
  // Convert a binary string to an array buffer
  //   console.log(data);

  let newData = data.map((item) =>
    item.data.map((i) => ({
      Date: item.date,
      Particular: i.voucher_type,
      Amount: i.amount,
      Notes: i.description,
    }))
  );

  newData = newData.flat();

  const s2ab = (s) => {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
    return buf;
  };

  // Convert the data to a worksheet
  const worksheet = XLSX.utils.json_to_sheet(newData);

  // Create a new workbook and append the worksheet to it
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  // Write the workbook to a binary string
  const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "binary" });

  // Create a blob and download the file
  const blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename + ".xlsx";
  a.click();
};

const AmountFormater = function (num) {
  // if (typeof num !== "number" ) {
  const state = store.getState();
  const { rounding, currency } = state.setting.settingDetails;
  // console.log(rounding, currency, "how are you");
  let returnValue = parseFloat(num).toFixed(rounding);
  if (typeof returnValue === "number") {
    if (currency === 1) {
      returnValue = returnValue.replace(/(\d+)(\d{2})$/, function (_, a, b) {
        return a.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "," + b;
      });
    } else {
      returnValue = returnValue
        .toString()
        .replace(/(\d)(?=(\d{2})+(?!\d))/g, "$1,");
    }
  }

  if (returnValue !== "NaN") {
    return returnValue;
  }
  // }
  return 0;
};

export { ExportExcel, AmountFormater, LogoutFun };
