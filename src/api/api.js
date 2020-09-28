import axios from 'axios'

const instance = axios.create({
  baseURL: 'https://z7pcbqgvrk.execute-api.us-east-1.amazonaws.com/red',
  headers: {
    'x-api-key': process.env.REACT_APP_AMPLIFY_API_KEY
  }
})

console.log(process.env.REACT_APP_AMPLIFY_API_KEY)

export default {
  updateTransactionMetadata: (transactionId, metadata) => instance.post(
    '/update_transaction_metadata',
    { id: transactionId, metadata }
  ),
  getCalendar: (listingId) => instance.get(`/get_calendar/${listingId}`),
  addEventToCalendar: (params) => instance.put('/add_calendar_event', params)
}
