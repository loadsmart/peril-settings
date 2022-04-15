import { danger, warn } from "danger"

const hasJiraID = () => {
  const pr = danger.github.pr
  const pattern = /^\w{2,4}-\d+/g
  const found = pattern.test(pr.title)

  if (!found) {
    warn(
      "The title of this PR does not contain a JIRA ID. Please consider including one so that this work is linked to the correct JIRA ticket. Expected format: ABC-123"
    )
  }
}

export default hasJiraID
