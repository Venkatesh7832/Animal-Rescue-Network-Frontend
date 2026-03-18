import API from './api'

export const donationService = {
  async donate(data) {
    const res = await API.post('/donations', data)
    return res.data
  },

  async getMyDonations() {
    const res = await API.get('/donations/my-donations')
    return res.data
  },

  async getMyTotal() {
    const res = await API.get('/donations/my-total')
    return res.data
  },

  async getDonationsForPost(rescuePostId) {
    const res = await API.get(`/donations/post/${rescuePostId}`)
    return res.data
  },

  async getTotalForPost(rescuePostId) {
    const res = await API.get(`/donations/post/${rescuePostId}/total`)
    return res.data
  },
}
