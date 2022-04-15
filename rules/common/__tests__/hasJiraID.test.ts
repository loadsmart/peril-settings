jest.mock("danger", () => jest.fn())
import * as danger from "danger"
const dm = danger as any

import hasJiraID from "../hasJiraID"

const errorMessage =
  "The title of this PR does not contain a JIRA ID. Please consider including one so that this work is linked to the correct JIRA ticket. Expected format: ABC-123"

beforeEach(() => {
  dm.warn = jest.fn()
})

it("warns when PR title has no JIRA ID", () => {
  dm.danger = { github: { pr: { title: "My awesome PR title" } } }

  hasJiraID()
  expect(dm.warn).toHaveBeenLastCalledWith(errorMessage)
})

describe("warns if PR title has jira id in the wrong format", () => {
  it("[ABC-1234] ...", () => {
    dm.danger = { github: { pr: { title: "[ABC-1234] My awesome PR title" } } }
    hasJiraID()
    expect(dm.warn).toHaveBeenLastCalledWith(errorMessage)
  })

  it("... (ABC-123)", () => {
    dm.danger = { github: { pr: { title: "Awesome PR (ABC-123)" } } }
    hasJiraID()
    expect(dm.warn).toHaveBeenLastCalledWith(errorMessage)
  })
})

describe("does not warn if title does have a JIRA ID in the correct format", () => {
  it("ABC-123 ...", () => {
    dm.danger = { github: { pr: { title: "ABC-123 - My awesome PR title" } } }
    hasJiraID()
    expect(dm.warn).not.toHaveBeenCalled()
  })

  it("AB-123 ...", () => {
    dm.danger = { github: { pr: { title: "AB-123 - My awesome PR title" } } }
    hasJiraID()
    expect(dm.warn).not.toHaveBeenCalled()
  })
})
