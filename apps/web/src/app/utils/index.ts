import { get } from 'idb-keyval'

const defautUser = 'Han'

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

const getLocalUserTags = async () =>
  ((await get('userTag')) || {}) as Record<string, { [k: string]: number }>

const getLocalDish = async () =>
  ((await get('dish')) || {}) as Record<string, string[]>

const advice = async () => {
  const userTags = (await getLocalUserTags())[defautUser]

  // const topTags = Object.entries(userTags).sort((a, b) => b[1] - a[1])

  const adviceDishes: { [k: string]: number } = {}

  const allDish = await getLocalDish()

  Object.entries(allDish).forEach(([k, v]) => {
    adviceDishes[k] = v.reduce((pre, cur) => {
      return pre + (userTags[cur] || 0)
    }, 0)
  })

  console.log('advice', adviceDishes)

  return Object.entries(adviceDishes)
    .filter(([_, v]) => v > 0)
    .sort((a, b) => b[1] - a[1])
    .map(([k, v]) => `${k} ⋅ ${v}`)
}

export { recordUserTags, getLocalUserTags, getLocalDish, advice, defautUser }
