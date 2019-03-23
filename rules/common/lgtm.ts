import { danger } from "danger"
import { IssueComment } from "github-webhook-event-types"

const lgtm = async (issueComment: IssueComment) => {
  console.info("Starting rule to post lgtm giphy")

  const issue = issueComment.issue
  const comment = issueComment.comment
  const api = danger.github.api

  // Only look at PR issue comments, this isn't in the type system
  if (!(issue as any).pull_request) {
    console.error("Not a Pull Request")
    return
  }

  // Don't do any work unless we have to
  const match = comment.body.toLowerCase().includes("lgtm")
  if (!match) {
    console.error("Did not find any of the phrases in the comment: ", comment.body.toLocaleLowerCase())
    return
  }

  const owner = issueComment.repository.owner.login
  const repo = issueComment.repository.name
  const gif = "![lgtm](https://media.giphy.com/media/3osxYdek8wYWCOLgT6/giphy.gif)"

  await api.pullRequests.createComment({
    body: gif,
    number: issue.number,
    owner: owner,
    repo: repo,
  })
}

export default lgtm
