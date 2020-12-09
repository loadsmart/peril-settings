import { danger, message } from "danger"

// Comment the Deploy Preview Link
const commentDocPreviewLink = () => {
  const repo = danger.github.repository.name
  const branch = danger.github.pr.head.ref
  message(`Deploy preview available at https://docs.loadsmart.io/${repo}/${branch}/index.html`)
}

export default commentDocPreviewLink
