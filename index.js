#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const Octokit = require('@octokit/rest');
const Mustache = require('mustache');
const program = require('commander');
const pkg = require('./package.json');

/**
 * Command line configuration.
 */
program
  .version(pkg.version, '-v, --version')
  .usage('[options]')
  .option('-s, --state <state>', 'state of the issues to return (all|open|closed)', 'all')
  .option('-t, --gh-token <token>', 'GitHub access [token] for private repos')
  .option('-o, --repo-owner <owner>', 'Github repo [owner]')
  .option('-n, --repo-name <name>', 'Github repo [name]')
  .parse(process.argv);

/**
 * Enable authenticated requests, if applicable.
 */
const github = new Octokit({
  auth: program.ghToken ? `token ${program.ghToken}` : null,
});

/**
 * Reformat the Github response.
 *
 * @param {object}  issue  Issue.
 * @returns {object}
 */
const reformatResults = issue => ({
  title: issue.title,
  state: issue.state,
  url: issue.html_url,
  created: issue.created_at,
  milestone: issue.milestone ? issue.milestone.title : '',
  due_date: issue.milestone ? issue.milestone.due_on : '',
  assignee: issue.assignee ? issue.assignee.login : 'unassigned',
});

/**
 * Render template based on selection.
 *
 * @param {object}  issues  Issues.
 * @returns {object}
 */
const renderTemplate = (issues) => {
  const templatePath = path.join(__dirname, 'templates/csv.mustache');
  const template = fs.readFileSync(templatePath)
    .toString();
  const output = Mustache.render(template, { list: issues });

  return process.stdout.write(output);
};

/**
 * Fetch issues from Github, then render in specified template.
 */
github.paginate('GET /repos/:owner/:repo/issues', {
  owner: program.repoOwner,
  repo: program.repoName,
}, response => response.data.map(reformatResults))
  .then((issues) => {
    renderTemplate(issues);
  })
  .catch((err) => {
    console.error(err);
  });
