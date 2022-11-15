import ApiService from '@/services/api.service';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

window.Echo = new Echo({
  broadcaster: 'pusher',
  key: process.env.VUE_APP_PUSHER_APP_KEY,
  cluster: process.env.VUE_APP_PUSHER_APP_CLUSTER,
  wsHost: process.env.VUE_APP_WEBSOCKET_HOST,
  wsPort: process.env.VUE_APP_WEBSOCKET_PORT,
  wssPort: process.env.VUE_APP_WEBSOCKET_PORT,
  // wsPath: process.env.VUE_APP_WEBSOCKET_TLS === 'true' ? '/pusher' : '',
  forceTLS: process.env.VUE_APP_WEBSOCKET_TLS === 'true',
  enabledTransports: ['ws', 'wss'],
  disableStats: true,
  encrypted: true,
  authorizer: (channel) => {
    return {
      authorize: (socketId, callback) => {
        ApiService.post('/broadcasting/auth', {
          socket_id: socketId,
          channel_name: channel.name
        })
        .then(response => {
          callback(null, response.data);
        })
        .catch(error => {
          callback(error);
        });
      }
    };
  },
});
