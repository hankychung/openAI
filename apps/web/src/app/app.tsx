// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useEffect, useMemo, useState } from 'react'
import { useMemoizedFn } from 'ahooks'
import { set } from 'idb-keyval'
import styles from './app.module.scss'

import { Button, Form, Input, Tag } from 'antd'
import { api } from './service'
import {
  getLocalUserTags,
  recordUserTags,
  getLocalDish,
  defautUser,
  advice,
  setLocalInfo
} from './utils'

const colors = [
  'magenta',
  'red',
  'volcano',
  'orange',
  'gold',
  'lime',
  'green',
  'cyan',
  'blue',
  'geekblue',
  'purple'
]

type IUserTagDict = Record<string, { [k: string]: number }>

export function App() {
  const [title, setTitle] = useState('')

  const [meal, setMeal] = useState('')

  const [tags, setTags] = useState<string[]>([])

  const [userTag, setUserTag] = useState<IUserTagDict>({})

  const [adviceDishes, setAdviceDished] = useState<string[]>([])

  const recordTags = useMemoizedFn((dict: IUserTagDict) => {
    setUserTag({ ...dict })

    set('userTag', dict)
  })

  const [curTags, setCurTags] = useState<string[]>([])

  const [loading, setLoading] = useState(false)

  const initTags = useMemoizedFn(async () => {
    const tags: string[] = []

    getLocalDish().then((dict) => {
      Object.values(dict).forEach((arr) => {
        tags.push(...arr)
      })

      setTags([...new Set(tags)])
    })

    setUserTag(await getLocalUserTags())
  })

  useEffect(() => {
    initTags()
  }, [initTags])

  const getTags = async (type: 'dish' | 'meal') => {
    const local = await getLocalDish()

    const m = type === 'meal' ? meal : title

    if (local[m]) {
      // do nothing
    } else {
      setLoading(true)

      await api
        .createTags(m)
        .then(async (res) => {
          const info = JSON.parse(res.answer.replaceAll('\n', ''))

          delete info.dish

          info.isVegetarian = info.isVegetarian ? '素菜' : '荤菜'

          local[m] = []

          Object.values(info)
            .filter(Boolean)
            .forEach((v) => {
              // 菜名不进入标签
              if (v === m) return

              if (Array.isArray(v)) {
                local[m].push(...v)
                return
              }

              console.log('vvv', v)

              local[m].push(...(v as string).split('、'))
            })

          setTags([...new Set([...tags, ...local[m]])])

          setCurTags(local[m])

          set('dish', local)
        })
        .finally(() => {
          setLoading(false)
        })
    }

    if (type === 'meal') {
      // 更新用户标签
      const curUserTagDict = recordUserTags({
        tags: [...local[m], '#' + meal],
        userDict: userTag[defautUser] || {}
      })

      recordTags({
        ...userTag,
        [defautUser]: curUserTagDict
      })
    }
  }

  const userTagsArr = useMemo(
    () =>
      Object.entries(userTag[defautUser] || {})
        .sort((a, b) => b[1] - a[1])
        .map((i) => {
          return `${i[0]} ⋅ ${i[1]}`
        }),
    [userTag]
  )

  return (
    <div className={styles.app}>
      <div className={styles.lft}>
        <Button onClick={setLocalInfo}>预设菜品与用户标签</Button>

        <Form.Item label="商家录入菜品">
          <Input
            value={title}
            onChange={(e) => {
              setCurTags([])
              setTitle(e.target.value)
            }}
            disabled={loading}
          />
          <div>
            {curTags.map((tag, index) => {
              return (
                <Tag
                  color={colors[Math.min(index, colors.length - 1)]}
                  key={tag}
                >
                  {`${tag}`}
                </Tag>
              )
            })}
          </div>
          <Button
            className={styles.btn}
            type="primary"
            onClick={() => {
              getTags('dish')
            }}
            disabled={loading}
          >
            确认
          </Button>
        </Form.Item>

        <Form.Item label="用户吃过的菜品">
          <Input
            value={meal}
            onChange={(e) => {
              setCurTags([])
              setMeal(e.target.value)
            }}
            disabled={loading}
          />
          <div>
            {curTags.map((tag, index) => {
              return (
                <Tag
                  color={colors[Math.min(index, colors.length - 1)]}
                  key={tag}
                >
                  {`${tag}`}
                </Tag>
              )
            })}
          </div>
          <Button
            className={styles.btn}
            type="primary"
            onClick={() => {
              getTags('meal')
            }}
            disabled={loading}
          >
            确认
          </Button>
        </Form.Item>

        <Button
          onClick={() => {
            advice().then((res) => {
              setAdviceDished(res)
            })
          }}
        >
          推荐菜品
        </Button>
        <div>
          {adviceDishes.map((tag, index) => {
            return (
              <Tag color={colors[Math.min(index, colors.length - 1)]} key={tag}>
                {`${tag}`}
              </Tag>
            )
          })}
        </div>
      </div>

      <div className={styles.rgt}>
        {/* <div className={styles.block}>
          <div>标签库</div>
          <div>
            {tags.map((tag, index) => {
              return (
                <Tag
                  color={colors[Math.min(index, colors.length - 1)]}
                  key={tag}
                >
                  {`${tag}`}
                </Tag>
              )
            })}
          </div>
        </div> */}

        <div className={styles.block}>
          <span>用户标签： </span>
          {userTagsArr.map((tag, index) => {
            return (
              <Tag color={colors[Math.min(index, colors.length - 1)]} key={tag}>
                {`${tag}`}
              </Tag>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default App
