// import XLSX from 'xlsx';
// import { useSelector } from "react-redux";
import * as XLSX from "xlsx";
import { store } from "./app/store";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const returnVoucherType = function (type) {
  switch (type) {
    case "LEX":
    case "LIC":
    case "LON":
      return "Loan";
    case "EX":
    case "AEX":
      return "Expenses";
    case "IC":
    case "AIC":
      return "Income";
    case "TEX":
    case "TIC":
      return "Transfer";
    default:
      return "type";
  }
};

const LogoutFun = function () {
  localStorage.removeItem("UserCredentials");
  localStorage.removeItem("isUserActivate");
  window.location.reload();
};

const ExportExcel = function (data, filename) {
  // Convert a binary string to an array buffer

  let newData = data.map((item) =>
    item.data.map((i) => ({
      Date: item.date,
      Particular: returnVoucherType(i.voucher_type),
      Amount: AmountFormater(i.amount),
      Notes: i.description,
    }))
  );

  newData = newData.flat();

  // Calculate the total amount
  const totalAmount = newData.reduce((total, item) => total + parseFloat(item.Amount), 0);

  // Add the total amount to the data
  newData.push({
    Date: "Total",
    Particular: "",
    Amount: AmountFormater(totalAmount),
    Notes: "",
  });

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

const ExportPDF = function (data, filename) {

  let newData = data.map((item) =>
    item.data.map((i) => ({
      Date: item.date,
      Particular: returnVoucherType(i.voucher_type),
      Amount: AmountFormater(i.amount),
      Notes: i.description,
    }))
  );

  newData = newData.flat();

  // Create a new jsPDF instance
  const doc = new jsPDF();

  // Calculate the total amount
  const totalAmount = newData.reduce((total, item) => total + parseFloat(item.Amount), 0);

  // Add the total amount to the data
  newData.push({ Date: 'Total', Particular: '', Amount: AmountFormater(totalAmount), Notes: '' });

  // Add a title
  const title = filename + " Report";
  const fontSize = 18;
  doc.setFontSize(fontSize);

  // Get width of page and position the title in the center
  const pageWidth = doc.internal.pageSize.getWidth();
  const titleWidth =
    (doc.getStringUnitWidth(title) * fontSize) / doc.internal.scaleFactor;
  const titleX = (pageWidth - titleWidth) / 2;

  doc.text(title, titleX, 15);

  // Use the autoTable plugin to create a table from the data
  doc.autoTable({
    startY: 20, // start below the title
    head: [Object.keys(newData[0])],
    body: newData.map(Object.values),
  });

  // Save the PDF
  doc.save(filename + ".pdf");
};

const AmountFormater = function (num) {
  
  if (num === undefined || num === null || num === "" || isNaN(num)) {
    return num;
  }
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

  if (typeof returnValue === "string") {
    return returnValue;
  }
  // }
  return 0;
};

export { ExportExcel, ExportPDF, AmountFormater, LogoutFun };
