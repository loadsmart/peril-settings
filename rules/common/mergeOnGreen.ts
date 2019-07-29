import { danger } from "danger"
import { Status } from "github-webhook-event-types"
import { LabelLabel } from "github-webhook-event-types/source/Label"

const mergeOnGreen = async (status: Status) => {
  const api = danger.github.api

  if (status.state !== "success") {
    return console.info(
      `Not a successful state for merging (note that you can define state in the settings.json) - got ${status.state}`
    )
  }

  // Check to see if all other statuses on the same commit are also green. E.g. is this the last green.
  const owner = status.repository.owner.login
  const repo = status.repository.name
  const allGreen = await api.repos.getCombinedStatusForRef({ owner, repo, ref: status.commit.sha })
  if (allGreen.data.state !== "success") {
    return console.info("Not all statuses are green for merging.")
  }

  // See https://github.com/maintainers/early-access-feedback/issues/114 for more context on getting a PR from a SHA
  const repoString = status.repository.full_name
  const searchResponse = await api.search.issues({ q: `${status.commit.sha} type:pr is:open repo:${repoString}` })

  // https://developer.github.com/v3/search/#search-issues
  const prsWithCommit = searchResponse.data.items.map((i: any) => i.number) as number[]
  for (const number of prsWithCommit) {
    // Get the PR labels
    const issue = await api.issues.get({ owner, repo, number })

    // Get the PR combined status
    const mergeLabel = issue.data.labels.find((l: LabelLabel) => l.name === "merge-on-green")
    if (!mergeLabel) {
      return console.info("PR does not have merge-on-green")
    }

    // Merge the PR
    try {
      await api.pullRequests.merge({ owner, repo, number, commit_title: "Merged by Peril" })
      console.log(`Merged Pull Request ${number}`)
    } catch (e) {
      console.error("Error merging PR:")
      console.error(e)
    }
  }
}

export default mergeOnGreen
