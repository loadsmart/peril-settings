jest.mock("danger", () => jest.fn())
import * as danger from "danger"
const dm = danger as any

import commentDocPreviewLink from "../commentDocPreviewLink"

beforeEach(() => {
  dm.message = jest.fn()
})

it("comment the doc preview link", () => {
  dm.danger = {
    github: {
      pr: {
        head: {
          ref: "my_branch",
        },
      },
      thisPR: { repo: "my_repo" },
    },
  }

  commentDocPreviewLink()
  expect(dm.message).toHaveBeenCalledWith(
    "Deploy preview available at https://docs.loadsmart.io/my_repo/my_branch/index.html"
  )
})
