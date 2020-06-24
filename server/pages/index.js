function HomePage() {
  return (
    <div>
      <h1>Github Projects Export</h1>
      <p>Export changes to cards on a GitHub project board to CSV! 🤓</p>
      <h2>What</h2>
      <p>
        This service will give you a CSV export of statistics from a Github
        Project board. You can use this in a spreadsheet to calculate various
        delivery statistics, e.g. a Cumulative Flow Diagram. This is meant to be
        used with Google Sheets' and others' <code>IMPORTDATA</code> function to
        fetch straight into a spreadsheet.
      </p>
      <h2>Getting started</h2>
      <p>You will need:</p>
      <ul>
        <li>A github repository with issues and project boards</li>
        <li>
          A{" "}
          <a href="https://help.github.com/en/github/authenticating-to-github/creating-a-personal-access-token-for-the-command-line">
            personal access token
          </a>{" "}
          which can read the issues in the repository (the "repo" permission).
        </li>
        <li>A google spreadsheets</li>
      </ul>
      <p>
        For the <code>IMPORTDATA</code> function, you need a URL of the
        following shape
      </p>
      <pre>
        https://github-projects-reporting.vercel.app/api/[owner]/[repo]?token=[your-token]
      </pre>
    </div>
  );
}

export default HomePage;
