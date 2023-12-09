import axios from "axios";

const listReminder = async function (body) {
  const { data } = await axios.post("v1/reminders/list-reminders/");
  return data;
};

export { listReminder };
