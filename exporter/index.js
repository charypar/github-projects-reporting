const { fetch } = require("cross-fetch");
const {
  ApolloClient,
  InMemoryCache,
  gql,
  HttpLink,
} = require("@apollo/client");

const QUERY = gql`
  query getEvents(
    $owner: String!
    $repo: String!
    $eventTypes: [IssueTimelineItemsItemType!]
    $after: String
  ) {
    repository(owner: $owner, name: $repo) {
      id
      issues(
        first: 100
        orderBy: { field: CREATED_AT, direction: DESC }
        after: $after
      ) {
        pageInfo {
          hasNextPage
          endCursor
        }
        edges {
          node {
            number
            title
            labels(first: 50) {
              edges {
                node {
                  name
                }
              }
            }
            timelineItems(first: 100, itemTypes: $eventTypes) {
              edges {
                node {
                  __typename
                  ... on MovedColumnsInProjectEvent {
                    actor {
                      login
                    }
                    project {
                      databaseId
                    }
                    from_column: previousProjectColumnName
                    to_column: projectColumnName
                    date: createdAt
                  }
                  ... on AddedToProjectEvent {
                    actor {
                      login
                    }
                    project {
                      databaseId
                    }
                    to_column: projectColumnName
                    date: createdAt
                  }
                  ... on ConvertedNoteToIssueEvent {
                    actor {
                      login
                    }
                    project {
                      databaseId
                    }
                    to_column: projectColumnName
                    date: createdAt
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;
const EventTypeMap = {
  AddedToProjectEvent: "added_to_project",
  ConvertedNoteToIssueEvent: "converted_note_to_issue",
  MovedColumnsInProjectEvent: "moved_columns_in_project",
};

exports.getIssueEvents = function getIssueEvents(
  apiKey,
  owner,
  repo,
  eventTypes
) {
  const client = new ApolloClient({
    link: new HttpLink({
      uri: "https://api.github.com/graphql",
      fetch,
      headers: {
        authorization: `bearer ${apiKey}`,
        accept: "application/vnd.github.starfox-preview+json",
      },
    }),
    cache: new InMemoryCache(),
  });

  const nextPage = (previous) => ({
    data: {
      repository: { issues: issues },
    },
  }) => {
    const all = previous.concat(issues.edges.map((it) => it.node));

    if (issues.pageInfo.hasNextPage) {
      const after = issues.pageInfo.endCursor;

      return client
        .query({ query: QUERY, variables: { owner, repo, eventTypes, after } })
        .then(nextPage(all));
    } else {
      return all;
    }
  };

  return client
    .query({
      query: QUERY,
      variables: { owner, repo, eventTypes },
    })
    .then(nextPage([]))
    .then((issues) => {
      return issues
        .map((issue) => {
          return issue.timelineItems.edges
            .map(({ node: event }) => {
              return {
                issue: issue.number,
                title: issue.title,
                project_id: event.project.databaseId,
                labels: issue.labels.edges.map((label) => label.node.name),
                type: EventTypeMap[event.__typename],
                actor: event.actor.login,
                date: new Date(event.date),
                from_column: event.from_column,
                to_column: event.to_column,
              };
            })
            .sort((a, b) => b.date.getTime() - a.date.getTime()); // sort by date descending
        })
        .flat();
    });
};
