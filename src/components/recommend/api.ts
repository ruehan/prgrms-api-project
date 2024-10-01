import axios from 'axios'
import { Performance } from './page'

const API_BASE_URL = 'https://ruehan-kopis.org'

const api = axios.create({
  baseURL: API_BASE_URL,
})

export const getToken = async (): Promise<string> => {
  const response = await api.post<{ token: string }>('/token')
  return response.data.token
}

export const getPopularByGenre = async (): Promise<Performance[]> => {
  const response = await api.get<Performance[]>('/popular-by-genre')
  return response.data
}

export const getRecommendByGenre = async (token: string): Promise<Performance[]> => {
  const response = await api.get<Performance[]>('/recommended-shows', {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

export const getUserPicks = async (token: string): Promise<Performance[]> => {
  const response = await api.get<Performance[]>('/user-picks', {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

export const saveUserGenres = async (token: string, genres: string[]): Promise<void> => {
  console.log('saveUserGenres')
  try {
    await api.post(
      '/user-picks',
      { performance_ids: genres },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
  } catch (error) {
    console.error('Error saving user genres:', error)
    throw error
  }
}
