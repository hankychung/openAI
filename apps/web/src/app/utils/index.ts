const recordUserTags = ({
  tags,
  userDict
}: {
  tags: string[]
  userDict: { [k: string]: number }
}) => {
  tags.forEach((tag) => {
    userDict[tag] = (userDict[tag] || 0) + 1
  })

  return {
    ...userDict
  }
}

export { recordUserTags }
