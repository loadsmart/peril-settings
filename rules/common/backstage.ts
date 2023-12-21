import { danger, fail } from "danger"
import axios from "axios"
import { validate } from "@roadiehq/roadie-backstage-entity-validator"

const backstage = async () => {
  const pr = danger.github.pr
  const utils = danger.github.utils
  const schemaPath = "./schemas/backstage.annotations.json"
  const schemaURL = ""

  const isOpen = pr.state === "open"

  if (!isOpen) {
    return
  }

  const filePath = "catalog-info.yaml"
  const fileContent = await utils.fileContents(filePath, `${pr.head.user.login}/${pr.head.repo.name}`, pr.head.sha)

  if (fileContent) {
    try {
      await validate(fileContent, true, schemaPath)
    } catch (e) {
      fail(`The 'catalog-info.yaml' file is not valid for Backstage. Error details:\n\n\`\`\`\n${e}\n\`\`\``)
    }
  } else {
    fail(`'${filePath}' file doesn't exist.`)
  }
}

export default backstage
