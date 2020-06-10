const { Octokit } = require("@octokit/rest");

exports.getIssueEvents = function getIssueEvents(apiKey, owner, repo) {
  // TODO add throttling https://github.com/octokit/plugin-throttling.js
  const octokit = new Octokit({
    auth: apiKey,
    userAgent: "charypar/github-issues-reporting v0",
    previews: ["starfox"],
    timeZone: "Europe/London",
    log: {
      debug: () => {},
      info: () => {},
      warn: console.warn,
      error: console.error,
    },
  });

  return octokit
    .paginate("GET /repos/:owner/:repo/issues", { owner, repo }, (response) => {
      return response.data.map((issue) => {
        const number = issue.number;

        return octokit.paginate(
          "GET /repos/:owner/:repo/issues/:number/events",
          { owner, repo, number },
          (response) =>
            response.data
              .filter((event) => event.project_card)
              .map((event) => ({
                issue: number,
                title: issue.title,
                label_ids: issue.labels.map((label) => label.id),
                labels: issue.labels.map((label) => label.name),
                type: event.event,
                actor: event.actor.login,
                date: event.created_at,
                from_column:
                  event.project_card && event.project_card.previous_column_name,
                to_column: event.project_card && event.project_card.column_name,
              }))
        );
      });
    })
    .then((resp) => Promise.all(resp).then((issues) => issues.flat()));
};
