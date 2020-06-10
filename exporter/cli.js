const { getIssueEvents } = require("./src/index.js");

const API_KEY = process.env.API_KEY;
const OWNER = "redbadger";
const REPO = "valloop";
const EVENT_TYPES = [
  "converted_note_to_issue",
  "added_to_project",
  "moved_columns_in_project",
];

function format(value) {
  if (value instanceof Date) {
    return `${value.getFullYear()}/${
      value.getMonth() + 1
    }/${value.getDate()} ${value.getHours()}:${value
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
  }

  if (Array.isArray(value)) {
    return value.join("|");
  } else {
    return (value && value.toString()) || "";
  }
}

function printLn(values) {
  return values.map((v) => `"${v.replace(/"/g, '\\"')}"`).join(",") + "\n";
}

getIssueEvents(API_KEY, OWNER, REPO, EVENT_TYPES).then((events) => {
  const keys = Object.keys(events[0]);

  process.stdout.write(printLn(keys));

  events.forEach((event) => {
    const values = keys.map((key) => format(event[key]));
    process.stdout.write(printLn(values));
  });
});
