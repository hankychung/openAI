// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useState } from 'react'
import { get, set } from 'idb-keyval'
import styles from './app.module.scss'

import { Button, Form, Input } from 'antd'
import { api } from './service'

export function App() {
  const [title, setTitle] = useState('')

  const getTags = async () => {
    const local = ((await get('dish')) || {}) as any

    if (local[title]) {
      return
    }

    api.createTags(title).then(async (res) => {
      const info = JSON.parse(res.answer.replaceAll('\n', ''))

      delete info.dish

      info.isVegetarian = info.isVegetarian ? '素菜' : '荤菜'

      local[title] = Object.values(info).filter(Boolean)

      set('dish', local)
    })
  }

  return (
    <>
      <div className={styles.lft}>
        <Form.Item label="菜品">
          <Input
            value={title}
            onChange={(e) => {
              setTitle(e.target.value)
            }}
          />
          <Button className={styles.btn} type="primary" onClick={getTags}>
            确认
          </Button>
        </Form.Item>
      </div>

      <div>
        <div>喜好</div>
      </div>
    </>
  )
}

export default App
