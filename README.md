# Issue Reporter

[![Build Status](https://travis-ci.org/millerrs/issue-reporter.svg?branch=master)](https://travis-ci.org/millerrs/issue-reporter)

A tool for creating reports on Github issues.

## Usage

```bash
Usage: issue-reporter [options]

Options:
  -v, --version             output the version number
  -s, --state <state>       state of the issues to return (all|open|closed) (default: "all")
  -t, --gh-token <token>    GitHub access [token] for private repos
  -o, --repo-owner <owner>  Github repo [owner]
  -n, --repo-name <name>    Github repo [name]
  -h, --help                output usage information

```

### Example

```bash
issue-reporter --repo-name rest.js --repo-owner octokit
```
