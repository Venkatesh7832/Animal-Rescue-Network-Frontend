import API from './api'

export const rescueService = {
  async getAll(page = 0, size = 12) {
    const res = await API.get('/rescues', { params: { page, size } })
    return res.data
  },

  async getById(id) {
    const res = await API.get(`/rescues/${id}`)
    return res.data
  },

  async search(filters = {}, page = 0, size = 12) {
    const res = await API.get('/rescues/search', {
      params: { ...filters, page, size },
    })
    return res.data
  },

  async getMyPosts() {
    const res = await API.get('/rescues/my-posts')
    return res.data
  },

  async create(data) {
    const res = await API.post('/rescues', data)
    return res.data
  },

  async update(id, data) {
    const res = await API.put(`/rescues/${id}`, data)
    return res.data
  },

  async updateStatus(id, status) {
    const res = await API.patch(`/rescues/${id}/status`, { status })
    return res.data
  },

  async delete(id) {
    const res = await API.delete(`/rescues/${id}`)
    return res.data
  },

  async uploadImage(file) {
    const form = new FormData()
    form.append('file', file)
    const res = await API.post('/upload', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data
  },

  // Volunteer actions
  async claimRescue(rescuePostId, notes = '') {
    const res = await API.post(`/volunteers/claim/${rescuePostId}`, { notes })
    return res.data
  },

  async getMyClaims() {
    const res = await API.get('/volunteers/my-claims')
    return res.data
  },

  async updateClaimStatus(claimId, status) {
    const res = await API.patch(`/volunteers/claim/${claimId}/status`, { status })
    return res.data
  },

  async cancelClaim(claimId) {
    const res = await API.delete(`/volunteers/claim/${claimId}`)
    return res.data
  },

  async getClaimsForPost(rescuePostId) {
    const res = await API.get(`/volunteers/post/${rescuePostId}`)
    return res.data
  },
}
