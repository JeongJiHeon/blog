import axios from 'axios'
import type {
  Post,
  PostListItem,
  PostCreate,
  PostUpdate,
  Contact,
  ContactDetail,
  ContactCreate,
  AuthToken,
  LoginCredentials,
  PaginatedResponse,
  DashboardData
} from '@/types'

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      // Optionally redirect to login
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthToken> => {
    const response = await api.post<AuthToken>('/auth/login', credentials)
    return response.data
  },

  getMe: async (): Promise<AuthToken['admin']> => {
    const response = await api.get<AuthToken['admin']>('/auth/me')
    return response.data
  },
}

// Posts API
export const postsApi = {
  getList: async (page = 1, limit = 9): Promise<PaginatedResponse<PostListItem>> => {
    const response = await api.get<PaginatedResponse<PostListItem>>('/posts', {
      params: { page, limit },
    })
    return response.data
  },

  getById: async (id: number): Promise<Post> => {
    const response = await api.get<Post>(`/posts/${id}`)
    return response.data
  },

  create: async (data: PostCreate): Promise<Post> => {
    const response = await api.post<Post>('/posts', data)
    return response.data
  },

  update: async (id: number, data: PostUpdate): Promise<Post> => {
    const response = await api.put<Post>(`/posts/${id}`, data)
    return response.data
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/posts/${id}`)
  },
}

// Contacts API
export const contactsApi = {
  getList: async (page = 1, limit = 10): Promise<PaginatedResponse<Contact>> => {
    const response = await api.get<PaginatedResponse<Contact>>('/contacts', {
      params: { page, limit },
    })
    return response.data
  },

  getById: async (id: number): Promise<ContactDetail> => {
    const response = await api.get<ContactDetail>(`/contacts/${id}`)
    return response.data
  },

  create: async (data: ContactCreate): Promise<Contact> => {
    const response = await api.post<Contact>('/contacts', data)
    return response.data
  },

  verifyPassword: async (id: number, password: string): Promise<ContactDetail> => {
    const response = await api.post<ContactDetail>(`/contacts/${id}/verify`, {
      password,
    })
    return response.data
  },
}

// Admin API
export const adminApi = {
  getDashboard: async (): Promise<DashboardData> => {
    const response = await api.get<DashboardData>('/admin/dashboard')
    return response.data
  },

  getAllPosts: async (page = 1, limit = 10): Promise<PaginatedResponse<PostListItem>> => {
    const response = await api.get<PaginatedResponse<PostListItem>>('/admin/posts', {
      params: { page, limit },
    })
    return response.data
  },

  getAllContacts: async (page = 1, limit = 10): Promise<PaginatedResponse<ContactDetail>> => {
    const response = await api.get<PaginatedResponse<ContactDetail>>('/admin/contacts', {
      params: { page, limit },
    })
    return response.data
  },

  getContact: async (id: number): Promise<ContactDetail> => {
    const response = await api.get<ContactDetail>(`/admin/contacts/${id}`)
    return response.data
  },

  replyToContact: async (
    id: number,
    reply: string,
    isPublic = true
  ): Promise<ContactDetail> => {
    const response = await api.put<ContactDetail>(`/admin/contacts/${id}/reply`, {
      admin_reply: reply,
      reply_is_public: isPublic,
    })
    return response.data
  },

  deleteContact: async (id: number): Promise<void> => {
    await api.delete(`/admin/contacts/${id}`)
  },
}

export default api
