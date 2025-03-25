// import axios from 'axios'

// const api = axios.create({
//   baseURL: 'http://localhost:8000/api',
//   withCredentials: true,
// })

// export default api

import axios from 'axios'

const API = import.meta.env.VITE_APP_API_URL
const api = axios.create({
  baseURL: API,
  withCredentials: true,
})

export default api
