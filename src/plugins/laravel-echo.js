import JwtService from '@/services/jwt.service';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

window.Echo = new Echo({
  broadcaster: 'pusher',
  key: process.env.VUE_APP_PUSHER_APP_KEY,
  cluster: process.env.VUE_APP_PUSHER_APP_CLUSTER,
  wsHost: window.location.hostname,
  wsPort: process.env.VUE_APP_WEBSOCKET_PORT,
  forceTLS: process.env.VUE_APP_WEBSOCKET_TLS === 'true',
  enabledTransports: ['ws', 'wss'],
  disableStats: true,
  authEndpoint: `${process.env.VUE_APP_API_URL}/broadcasting/auth`,
  bearerToken: JwtService.getToken(),
});
