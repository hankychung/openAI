import axios from 'axios'

const http = axios.create({
  headers: {
    Authorization: 'Bearer app-YG60LIFkjtZzM1A8AFAIpQsN'
  }
})

interface MyData {
  event: string
  task_id: string
  id: string
  answer: string
  metadata: object
  created_at: number
  conversation_id: string
}

class Api {
  async createTags(name: string) {
    return (
      await http<MyData>({
        url: 'https://api.dify.ai/v1/chat-messages',
        method: 'post',
        data: {
          query: `根据我输入的菜品，${name}，以json文件输出，和flavor，meatIngredient（没有则返回null），vegetableIngredient（没有则返回null），cuisine，isVegetarian的信息`,
          inputs: {},
          user: 'HAN',
          conversation_id: '0034df42-8a6c-4ba7-8f28-c6f2f26c8c3b'
        }
      })
    ).data
  }
}

export const api = new Api()
