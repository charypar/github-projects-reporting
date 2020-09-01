const { getIssueEvents } = require("./index.js");
const { formatFile } = require("./csv.js");

const API_KEY = process.env.API_KEY;
const OWNER = process.env.REPO_OWNER;
const REPO = process.env.REPO_NAME;

const EVENT_TYPES = [
  "ADDED_TO_PROJECT_EVENT",
  "MOVED_COLUMNS_IN_PROJECT_EVENT",
  "CONVERTED_NOTE_TO_ISSUE_EVENT",
];

getIssueEvents(API_KEY, OWNER, REPO, EVENT_TYPES).then((events) => {
  formatFile(events, (line) => {
    process.stdout.write(line);
  });
});
