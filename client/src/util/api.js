import axios from 'axios'
import Cookies from 'js-cookie'

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  withCredentials: true,
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error(error)

    if (error.response && error.response.status === 401) {
      Cookies.remove('dcims')
      sessionStorage.clear()

      const currentUrl = window.location.pathname
      if (currentUrl !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  },
)

export default api
