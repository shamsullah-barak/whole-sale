import moment from "moment";

function formatDate(createdAt) {
  const date = moment(createdAt);
  const now = moment();

  if (date.isSame(now, "day")) {
    return "Today";
  } else if (date.isSame(now.clone().subtract(1, "day"), "day")) {
    return "Yesterday";
  } else if (date.isAfter(now.clone().subtract(7, "days"))) {
    return date.format("dddd");
  } else {
    return date.format("YYYY-MM-DD HH:mm");
  }
}

export default formatDate;
