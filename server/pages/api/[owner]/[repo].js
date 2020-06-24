import { getIssueEvents } from "../../../../exporter/src/index";
import { formatFile } from "../../../../exporter/src/csv";

const EVENT_TYPES = [
  "converted_note_to_issue",
  "added_to_project",
  "moved_columns_in_project",
];

export default (req, res) => {
  const { owner, repo, token } = req.query;

  if (token && token.toString() != "") {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Cache-Control", "s-maxage=300"); // 5 minutes

    return getIssueEvents(token, owner, repo, EVENT_TYPES).then((events) => {
      formatFile(events, (line) => {
        res.write(line);
      });

      res.end();
    });
  }

  res.statusCode = 401;
  res.setHeader("Content-Type", "text/plain");
  res.end("Please provide a Github authorization token in the query string");
};
