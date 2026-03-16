import api from './api'

export const authService = {
  async register(data) {
    const res = await api.post('/auth/register', data)
    return res.data
  },

  async login(username, password) {
    const res = await api.post('/auth/login', { username, password })
    return res.data
  },

  logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },

  getStoredUser() {
    try {
      const user = localStorage.getItem('user')
      return user ? JSON.parse(user) : null
    } catch {
      return null
    }
  },

  storeSession(data) {
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify({
      id: data.id,
      username: data.username,
      email: data.email,
      role: data.role,
    }))
  },
}
