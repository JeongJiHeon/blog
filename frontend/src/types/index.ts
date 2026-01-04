// Post types
export interface Post {
  id: number
  title_ko: string
  title_en: string | null
  title_zh: string | null
  content_ko: string
  content_en: string | null
  content_zh: string | null
  thumbnail_url: string | null
  is_public: boolean
  view_count: number
  created_at: string
  updated_at: string | null
}

export interface PostListItem {
  id: number
  title_ko: string
  title_en: string | null
  title_zh: string | null
  thumbnail_url: string | null
  is_public: boolean
  view_count: number
  created_at: string
}

export interface PostCreate {
  title_ko: string
  title_en?: string
  title_zh?: string
  content_ko: string
  content_en?: string
  content_zh?: string
  thumbnail_url?: string
  is_public?: boolean
}

export interface PostUpdate extends Partial<PostCreate> {}

// Contact types
export interface Contact {
  id: number
  name: string
  is_secret: boolean
  has_reply: boolean
  created_at: string
}

export interface ContactDetail {
  id: number
  name: string
  contact: string
  message: string
  is_secret: boolean
  admin_reply: string | null
  reply_is_public: boolean
  replied_at: string | null
  is_read: boolean
  created_at: string
}

export interface ContactCreate {
  name: string
  contact: string
  message: string
  is_secret?: boolean
  secret_password?: string
}

// Admin types
export interface Admin {
  id: number
  username: string
  created_at: string
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface AuthToken {
  access_token: string
  token_type: string
  admin: Admin
}

// Pagination types
export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
  total_pages: number
}

// Service types
export interface Service {
  id: number
  title_ko: string
  title_en: string | null
  title_zh: string | null
  description_ko: string
  description_en: string | null
  description_zh: string | null
  icon: string | null
  is_published: boolean
  is_featured: boolean
  order: number
  created_at: string
  updated_at: string | null
}

export interface ServiceListItem {
  id: number
  title_ko: string
  title_en: string | null
  title_zh: string | null
  description_ko: string
  description_en: string | null
  description_zh: string | null
  icon: string | null
  is_published: boolean
  is_featured: boolean
  order: number
}

export interface ServiceCreate {
  title_ko: string
  title_en?: string
  title_zh?: string
  description_ko: string
  description_en?: string
  description_zh?: string
  icon?: string
  is_published?: boolean
  is_featured?: boolean
  order?: number
}

export interface ServiceUpdate extends Partial<ServiceCreate> {}

// Home data types
export interface HomeData {
  featured_services: ServiceListItem[]
  latest_posts: PostListItem[]
}

// Dashboard types
export interface DashboardStats {
  total_posts: number
  public_posts: number
  total_contacts: number
  unread_contacts: number
  unreplied_contacts: number
  total_services: number
  published_services: number
  featured_services: number
}

export interface DashboardData {
  stats: DashboardStats
  recent_posts: PostListItem[]
  recent_contacts: ContactDetail[]
}
