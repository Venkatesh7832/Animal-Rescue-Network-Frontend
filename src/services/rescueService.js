import api from './api'

export const rescueService = {
  async getAll(page = 0, size = 12) {
    const res = await api.get('/rescues', { params: { page, size } })
    return res.data
  },

  async getById(id) {
    const res = await api.get(`/rescues/${id}`)
    return res.data
  },

  async search(filters = {}, page = 0, size = 12) {
    const res = await api.get('/rescues/search', {
      params: { ...filters, page, size },
    })
    return res.data
  },

  async getMyPosts() {
    const res = await api.get('/rescues/my-posts')
    return res.data
  },

  async create(data) {
    const res = await api.post('/rescues', data)
    return res.data
  },

  async update(id, data) {
    const res = await api.put(`/rescues/${id}`, data)
    return res.data
  },

  async updateStatus(id, status) {
    const res = await api.patch(`/rescues/${id}/status`, { status })
    return res.data
  },

  async delete(id) {
    const res = await api.delete(`/rescues/${id}`)
    return res.data
  },

  async uploadImage(file) {
    const form = new FormData()
    form.append('file', file)
    const res = await api.post('/upload', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data
  },

  // Volunteer actions
  async claimRescue(rescuePostId, notes = '') {
    const res = await api.post(`/volunteers/claim/${rescuePostId}`, { notes })
    return res.data
  },

  async getMyClaims() {
    const res = await api.get('/volunteers/my-claims')
    return res.data
  },

  async updateClaimStatus(claimId, status) {
    const res = await api.patch(`/volunteers/claim/${claimId}/status`, { status })
    return res.data
  },

  async cancelClaim(claimId) {
    const res = await api.delete(`/volunteers/claim/${claimId}`)
    return res.data
  },

  async getClaimsForPost(rescuePostId) {
    const res = await api.get(`/volunteers/post/${rescuePostId}`)
    return res.data
  },
}
