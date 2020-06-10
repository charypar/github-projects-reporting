const { getIssueEvents } = require("./src/index.js");

const API_KEY = process.env.API_KEY;
const OWNER = "redbadger";
const REPO = "valloop";

function format(value) {
  if (Array.isArray(value)) {
    return value.join("|");
  } else {
    return (value && value.toString()) || "";
  }
}

function printLn(values) {
  return values.map((v) => `"${v.replace(/"/g, '\\"')}"`).join(",") + "\n";
}

getIssueEvents(API_KEY, OWNER, REPO).then((events) => {
  const keys = Object.keys(events[0]);

  process.stdout.write(printLn(keys));

  events.forEach((event) => {
    const values = keys.map((key) => format(event[key]));
    process.stdout.write(printLn(values));
  });
});
