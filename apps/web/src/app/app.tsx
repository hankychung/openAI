// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useEffect, useState } from 'react'
import { useMemoizedFn } from 'ahooks'
import { get, set } from 'idb-keyval'
import styles from './app.module.scss'

import { Button, Form, Input, Tag } from 'antd'
import { api } from './service'

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

export function App() {
  const [title, setTitle] = useState('')

  const [tags, setTags] = useState<string[]>([])

  const [tagsCount, setTagsCount] = useState<Record<string, number>>({})

  const [curTags, setCurTags] = useState<string[]>([])

  const [loading, setLoading] = useState(false)

  const getLocalDish = useMemoizedFn(async () => {
    const local = ((await get('dish')) || {}) as Record<string, any[]>

    return local
  })

  const initTags = useMemoizedFn(async () => {
    const tags: string[] = []

    const tagsCount: Record<string, number> = {}

    getLocalDish().then((dict) => {
      Object.values(dict).forEach((arr) => {
        arr.forEach((t) => {
          if (tagsCount[t]) {
            tagsCount[t] += 1
          } else {
            tagsCount[t] = 1
          }

          tags.push(t)
        })
      })

      setTags([...new Set(tags)])

      setTagsCount(tagsCount)
    })
  })

  useEffect(() => {
    initTags()
  }, [initTags])

  const getTags = async () => {
    const local = await getLocalDish()

    if (local[title]) {
      return
    }

    setLoading(true)

    api
      .createTags(title)
      .then(async (res) => {
        const info = JSON.parse(res.answer.replaceAll('\n', ''))

        delete info.dish

        info.isVegetarian = info.isVegetarian ? '素菜' : '荤菜'

        local[title] = Object.values(info).filter(Boolean)

        setTags([...new Set([...tags, ...local[title]])])

        setCurTags(local[title])

        local[title].forEach((t) => {
          if (tagsCount[t]) {
            tagsCount[t] += 1
          } else {
            tagsCount[t] = 1
          }
        })

        setTagsCount({ ...tagsCount })

        set('dish', local)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <div>
      <div className={styles.lft}>
        <Form.Item label="菜品">
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
                  {`${tag} (${tagsCount[tag]})`}
                </Tag>
              )
            })}
          </div>
          <Button
            className={styles.btn}
            type="primary"
            onClick={getTags}
            disabled={loading}
          >
            确认
          </Button>
        </Form.Item>

        <div>我的标签</div>
      </div>

      <div className={styles.rgt}>
        <div>标签库</div>
        <div>
          {tags.map((tag, index) => {
            return (
              <Tag color={colors[Math.min(index, colors.length - 1)]} key={tag}>
                {`${tag} (${tagsCount[tag]})`}
              </Tag>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default App
