import Pusher from 'pusher-js'

const pusher = new Pusher('your-app-key', {
  cluster: 'your-app-cluster',
  forceTLS: true,
})

export default pusher
