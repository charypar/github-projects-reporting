const { getIssueEvents } = require("./index.js");
const { formatFile } = require("./csv.js");

const API_KEY = process.env.API_KEY;
const OWNER = "redbadger";
const REPO = "valloop";
const EVENT_TYPES = [
  "converted_note_to_issue",
  "added_to_project",
  "moved_columns_in_project",
];

getIssueEvents(API_KEY, OWNER, REPO, EVENT_TYPES).then((events) => {
  formatFile(events, (line) => {
    process.stdout.write(line);
  });
});
