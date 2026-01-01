import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Suspense } from 'react'

// Layouts
import { Layout } from '@/components/layout/Layout'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { ProtectedRoute } from '@/components/common/ProtectedRoute'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'

// Public Pages
import { HomePage } from '@/pages/public/HomePage'
import { PostsPage } from '@/pages/public/PostsPage'
import { PostDetailPage } from '@/pages/public/PostDetailPage'
import { ContactPage } from '@/pages/public/ContactPage'
import { ContactDetailPage } from '@/pages/public/ContactDetailPage'
import { AboutPage } from '@/pages/public/AboutPage'

// Admin Pages
import { LoginPage } from '@/pages/admin/LoginPage'
import { DashboardPage } from '@/pages/admin/DashboardPage'
import { PostsManagePage } from '@/pages/admin/PostsManagePage'
import { PostEditPage } from '@/pages/admin/PostEditPage'
import { ContactsManagePage } from '@/pages/admin/ContactsManagePage'

// Contexts
import { AuthProvider } from '@/contexts/AuthContext'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense
          fallback={
            <div className="min-h-screen flex items-center justify-center">
              <LoadingSpinner size="lg" />
            </div>
          }
        >
          <Routes>
            {/* Public Routes */}
            <Route
              path="/"
              element={
                <Layout>
                  <HomePage />
                </Layout>
              }
            />
            <Route
              path="/posts"
              element={
                <Layout>
                  <PostsPage />
                </Layout>
              }
            />
            <Route
              path="/posts/:id"
              element={
                <Layout>
                  <PostDetailPage />
                </Layout>
              }
            />
            <Route
              path="/contact"
              element={
                <Layout>
                  <ContactPage />
                </Layout>
              }
            />
            <Route
              path="/contact/:id"
              element={
                <Layout>
                  <ContactDetailPage />
                </Layout>
              }
            />
            <Route
              path="/about"
              element={
                <Layout>
                  <AboutPage />
                </Layout>
              }
            />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<LoginPage />} />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <DashboardPage />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/posts"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <PostsManagePage />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/posts/new"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <PostEditPage />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/posts/:id/edit"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <PostEditPage />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/contacts"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <ContactsManagePage />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
