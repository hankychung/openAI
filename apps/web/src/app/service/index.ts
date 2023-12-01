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
          query: `根据我输入的菜品，${name}，只以json语法输出，和flavor，meatIngredient（没有则返回null），vegetableIngredient（没有则返回null），cuisine，isVegetarian的信息`,
          inputs: {},
          user: 'HAN',
          conversation_id: ''
        }
      })
    ).data
  }

  async initChat() {
    return (
      await http<MyData>({
        url: 'https://api.dify.ai/v1/chat-messages',
        method: 'post',
        data: {
          query: `告诉我菜品库有哪些菜品`,
          inputs: {},
          user: 'HAN',
          conversation_id: '815e054a-4af9-49ba-a464-b61c5c3714c2'
        }
      })
    ).data
  }

  async add() {
    return (
      await http<MyData>({
        url: 'https://api.dify.ai/v1/chat-messages',
        method: 'post',
        data: {
          query: `添加东坡肉进入菜品库，菜品库必须保持菜品的唯一性，如果有重复的，去重`,
          inputs: {},
          user: 'HAN',
          conversation_id: '815e054a-4af9-49ba-a464-b61c5c3714c2'
        }
      })
    ).data
  }

  async advice() {
    return (
      await http<MyData>({
        url: 'https://api.dify.ai/v1/chat-messages',
        method: 'post',
        data: {
          query: `我喜欢吃麻辣的，牛肉的菜品，从我的菜品库推荐五个菜品给我，并根据我的喜好加上权重`,
          inputs: {},
          user: 'HAN',
          conversation_id: '815e054a-4af9-49ba-a464-b61c5c3714c2'
        }
      })
    ).data
  }
}

export const api = new Api()
