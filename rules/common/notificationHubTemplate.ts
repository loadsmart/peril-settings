import { danger, warn } from "danger"

// PRs changing Notification Hub templates should have reminders to update the template on the Notification Hub Adm,in
const notificationHubTemplate = async () => {
  const isOpen = danger.github.pr.state === "open"

  if (isOpen) {
    const files = [...danger.git.modified_files, ...danger.git.created_files]
    const templates_re = /(templates\/.*)/

    const hasTemplateChanges = files.find(file => templates_re.test(file))

    if (hasTemplateChanges) {
      warn(
        `It looks like code was changed within a template. If the template was for Notification Hub, make sure to update the template in the Admin after merging`
      )
    }
  }
}

export default notificationHubTemplate
