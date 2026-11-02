# Remediations of Security Review Findings

Review date and time: 2026-10-28T11:52:45Z (UTC)

## Remediations

### Remediation of Finding 1: Script injection via PR file names in `pull_request_target` workflow

- [ ] This remediation implements the security review's recommendation for this finding.
- [x] This remediation addresses the finding in a way that differs from the security review's recommendation.

Remediation commits:
- [cb053d6](https://github.com/reach2saksham/PictoPy-Website/commit/cb053d64301ad6695c3ed00491ab58badb1634ce)

Description: The changed file names, the issue number and coderabbit-approval's label_was_present now reach github-script through env: and are read with process.env, so they are never parsed as script source. The EXTERNAL_LABELLER_TOKEN step was not moved into a separate job.

## Non-remediated findings

None.
