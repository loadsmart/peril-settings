jest.mock("danger", () => jest.fn())
import * as danger from "danger"
const dm = danger as any

import backstage from "../backstage"

beforeEach(() => {
  dm.danger = {}
  dm.fail = jest.fn()
})

it("fails when metadata.name is absent", async () => {
  const yamlContent = `---
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  description: Foo project
  annotations:
    github.com/project-slug: loadsmart/foo
    circleci.com/project-slug: github/loadsmart/foo
    opslevel.com/tier: tier_1
  labels:
    loadsmart.com/product: internal-product
  tags:
    - go
spec:
  type: service
  lifecycle: production
  owner: developer-productivity
`

  dm.danger.github = {
    utils: {
      fileContents: () => Promise.resolve(yamlContent),
    },
    pr: {
      head: { user: { login: "danger" }, repo: { name: "peril-settings" } },
      state: "open",
    },
  }
  dm.danger.git = {
    modified_files: ["catalog-info.yaml"],
    created_files: [],
  }

  await backstage()

  expect(dm.fail).toHaveBeenCalledWith(
    `The 'catalog-info.yaml' file is not valid for Backstage. Error details:\n\n\`\`\`\nError: Error: metadata.name must have a value\n\`\`\``
  )
})

it("fails when spec.owner is absent", async () => {
  const yamlContent = `---
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: foo
  description: Foo project
  annotations:
    github.com/project-slug: loadsmart/foo
    circleci.com/project-slug: github/loadsmart/foo
    opslevel.com/tier: tier_1
  labels:
    loadsmart.com/product: internal-product
  tags:
    - go
spec:
  type: service
  lifecycle: production
`

  dm.danger.github = {
    utils: {
      fileContents: () => Promise.resolve(yamlContent),
    },
    pr: {
      head: { user: { login: "danger" }, repo: { name: "peril-settings" } },
      state: "open",
    },
  }
  dm.danger.git = {
    modified_files: ["catalog-info.yaml"],
    created_files: [],
  }

  await backstage()

  expect(dm.fail).toHaveBeenCalledWith(
    `The 'catalog-info.yaml' file is not valid for Backstage. Error details:\n\n\`\`\`\nError: TypeError: /spec must have required property 'owner' - missingProperty: owner\n\`\`\``
  )
})

it("fails when catalog-info.yaml does not exist", async () => {
  dm.danger.github = {
    utils: {
      fileContents: () => Promise.resolve(),
    },
    pr: {
      head: { user: { login: "danger" }, repo: { name: "peril-settings" } },
      state: "open",
    },
  }
  dm.danger.git = {
    modified_files: [],
    created_files: [],
  }

  await backstage()

  expect(dm.fail).toHaveBeenCalledWith(`'catalog-info.yaml' file doesn't exist.`)
})
