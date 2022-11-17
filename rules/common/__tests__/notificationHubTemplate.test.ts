jest.mock("danger", () => jest.fn())
import * as danger from "danger"
const dm = danger as any

import notificationHubTemplate from "../notificationHubTemplate"

beforeEach(() => {
  dm.danger = {}
  dm.warn = jest.fn()
})

it("warns when template code was created", async () => {
  dm.danger.github = {
    pr: {
      head: { user: { login: "danger" }, repo: { name: "rfp-backend" } },
      state: "open",
    },
  }
  dm.danger.git = {
    modified_files: ["src/new_file.py"],
    created_files: ["templates/invite_email.html"],
  }
  await notificationHubTemplate()
  expect(dm.warn).toHaveBeenCalledWith(
    `It looks like code was changed within a template. If the template was for Notification Hub, make sure to persist the template change in the Notification Hub Admin after merging!`
  )
})

it("warns when template code was changed", async () => {
  dm.danger.github = {
    pr: {
      head: { user: { login: "danger" }, repo: { name: "rfp-backend" } },
      state: "open",
    },
  }
  dm.danger.git = {
    modified_files: ["templates/invite_email.html"],
    created_files: ["src/new_file.py"],
  }
  await notificationHubTemplate()
  expect(dm.warn).toHaveBeenCalledWith(
    `It looks like code was changed within a template. If the template was for Notification Hub, make sure to persist the template change in the Notification Hub Admin after merging!`
  )
})

it("does not warn when template code was not created/changed", async () => {
  dm.danger.github = {
    pr: {
      head: { user: { login: "danger" }, repo: { name: "rfp-backend" } },
      state: "open",
    },
  }
  dm.danger.git = {
    modified_files: ["src/new_file.py"],
    created_files: ["src/new_file.py"],
  }
  await notificationHubTemplate()
  expect(dm.warn).not.toHaveBeenCalled()
})

it("does not warn when PR is not open", async () => {
  dm.danger.github = {
    pr: {
      head: { user: { login: "danger" }, repo: { name: "rfp-backend" } },
      state: "closed",
    },
  }
  dm.danger.git = {
    modified_files: ["templates/invite_email.html"],
    created_files: ["templates/invite_email.html"],
  }
  await notificationHubTemplate()
  expect(dm.warn).not.toHaveBeenCalled()
})
