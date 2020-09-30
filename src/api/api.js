import axios from 'axios'

const instance = axios.create({
  baseURL: 'https://api.coworksurf.world/red',
  headers: {
    'x-api-key': process.env.REACT_APP_AMPLIFY_API_KEY
  }
})

export default {
  updateTransactionMetadata: (transactionId, metadata) => instance.post(
    '/update_transaction_metadata',
    { id: transactionId, metadata }
  ),
  getCalendar: (listingId) => instance.get(`/get_calendar/${listingId}`),
  addEventToCalendar: (params) => instance.put('/add_calendar_event', params),
  deleteCalendarEvent: (eventId) => instance.delete(`/delete_calendar_event/${eventId}`),
  updateCalendarEvent: (params) => instance.post('/update_calendar_event', params),
}
