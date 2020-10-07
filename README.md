# Github Projects Export

Export changes to cards on a GitHub project board to CSV! 🤓

## What

This service will give you a CSV export of statistics from a Github Project board. You can use this in a spreadsheet to calculate various delivery statistics, e.g. a Cumulative Flow Diagram. This is meant to be used with Google Sheets' and others' IMPORTDATA function to fetch straight into a spreadsheet.

## Getting started

You will need:

- A github repository with issues and project boards
- A [personal access token](https://help.github.com/en/github/authenticating-to-github/creating-a-personal-access-token-for-the-command-line) which can read the issues in the repository (the "repo" permission).
- A google spreadsheets

### Using the deployed app

1. For the IMPORTDATA function, you need a URL of the following shape:
   `https://github-projects-reporting.vercel.app/api/[owner]/[repo]?token=[your-token]`

2. Open up your spreadsheet and in A1 insert the function: `=IMPORTDATA(https://github-projects-reporting.vercel.app/api/[owner]/[repo]?token=[your-token])`
3. If successful, this will autopopulate the sheet. If unsuccessful, it will display `N/A` and will show an error. In this case, try...

## Using the CLI

1. Create and populate a `.env` file in the root of your local repository with the environment variables necessary to run the program, following the `.env.example`
2. Source this file in order to export the environment (e.g. `set -a && source .env && set +a`)
3. Execute the cli app, inserting the output into a local file (e.g. `node exporter/cli.js > output.csv`)
4. Open up your spreadsheet and import the data
