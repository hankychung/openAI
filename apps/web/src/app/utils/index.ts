import { get, set } from 'idb-keyval'

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

const setLocalInfo = () => {
  set('userTag', {
    Han: {
      辣味: 1,
      牛肉: 1,
      川菜: 2,
      荤菜: 4,
      麻辣: 1,
      鲜味: 1,
      中式: 1,
      咸香: 1,
      腊肉: 1,
      湖南菜: 1
    }
  })

  set('dish', {
    水煮牛肉: ['辣味', '牛肉', '川菜', '荤菜'],
    水煮鱼: ['麻辣', '川菜', '荤菜'],
    尖椒炒香干: ['素菜'],
    荷芹炒肾片: ['鲜香', '肾片', '荷芹', '中华美食', '荤菜'],
    姜葱蒸鱼块: ['鲜味', '中式', '荤菜'],
    香干炒湖南腊肉: ['咸香', '腊肉', '湖南菜', '荤菜']
  })
}

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

export {
  recordUserTags,
  getLocalUserTags,
  getLocalDish,
  advice,
  defautUser,
  setLocalInfo
}
