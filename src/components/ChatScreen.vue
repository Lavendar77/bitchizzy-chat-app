<template>
  <div class="container" v-if="user">
    <button class="btn btn-sm btn-danger" @click="logout">Logout</button>

    <div class="mb-3">
      <div class="text-center">
        <h5>Welcome back {{ `${user.first_name} ${user.last_name}` }}</h5>
        <p class="small text-muted">Enter the P2P ID and choose either it's a sale or purchase!</p>
      </div>

      <form @submit.stop.prevent="openChat" class="">
        <div class="input-group">
          <input type="text" class="form-control" placeholder="Peer-to-Peer ID" id="peer_to_peer_id" v-model="modelForm.peer_to_peer_id" required>

          <select v-model="modelForm.peer_to_peer_type" id="peer_to_peer_type" class="form-select" required>
            <option value="">Select a type</option>
            <option value="sale">Sale</option>
            <option value="purchase">Purchase</option>
          </select>

          <button type="submit" class="btn btn-primary" :disabled="modelForm.busy">Submit</button>
        </div>
      </form>
    </div>

    <div class="card border-primary mb-5">
      <div class="card-header bg-primary text-white border-primary">
        Chat
      </div>
      <div class="card-body" ref="chatBox">
        <div v-if="messages && messages.data && messages.data.length < 1" class="text-center text-secondary">
          No chat messages yet!
        </div>

        <div
          v-for="message in messages.data"
          :key="message.id"
          class="mb-2 p-2 rounded"
          :class="{
            'bg-dark': message.sender == 'owner',
            'border': message.sender == 'dealer',
          }"
        >
          <div class="mb-3">
            <h6 class="card-title" :class="message.sender == 'owner' ? 'text-white' : 'text-dark'">{{ message.sender }}</h6>
            <small class="" :class="message.sender == 'owner' ? 'text-white' : 'text-dark'">{{ message.created_at | moment('calendar') }}</small>
          </div>
          <p class="card-text" :class="message.sender == 'owner' ? 'text-white' : 'text-dark'">{{ message.message }}</p>
        </div>
      </div>

      <div class="card-footer bg-white border-primary">
        <form @submit.stop.prevent="sendMessage">
          <div class="input-group">
            <input type="text" class="form-control form-control-sm" placeholder="Enter a message" v-model="newMessageForm.message" required>
            <button type="submit" class="btn btn-sm btn-primary" :disabled="newMessageForm.busy">Send</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { Form } from '@/plugins/vform'
import ApiService from '@/services/api.service'
import { LOGOUT } from '@/store/auth'

export default {
  name: "ChatScreen",
  data() {
    return {
      modelForm: {
        peer_to_peer_id: "",
        peer_to_peer_type: "",
        busy: false
      },
      startChat: false,
      messages: [],
      newMessageForm: new Form({
        message: '',
      })
    }
  },
  watch: {
    messages() {
      this.scrollToEndOfChat();
    }
  },
  computed: {
    ...mapGetters({
      user: "currentUser",
    })
  },
  methods: {
    openChat() {
      this.modelForm.busy = true;
      this.newMessageForm.reset();

      ApiService
        .get(`user/peer-to-peer/${this.modelForm.peer_to_peer_type}s/${this.modelForm.peer_to_peer_id}/messages`)
        .then((response) => {
          this.startChat = true;
          this.messages = response.data.data.messages;

          this.openWebsocketConnection();
        })
        .catch((error) => {
          alert(error.response?.data?.message || error.response.statusText);
        })
        .finally(() => {
          this.modelForm.busy = false;
        })
    },
    scrollToEndOfChat() {
      let chatBox = this.$refs.chatBox;

      setTimeout(() => {
        chatBox.scrollTop = chatBox.scrollHeight;
      }, 500);
    },
    sendMessage() {
      this.newMessageForm
        .post(`user/peer-to-peer/${this.modelForm.peer_to_peer_type}s/${this.modelForm.peer_to_peer_id}/messages`)
        .then(() => {
          this.newMessageForm.reset();
        })
        .catch((error) => {
          alert(error.response.data.message);
        })
    },
    openWebsocketConnection() {
      // eslint-disable-next-line
      Echo.private(`peer-to-peer-message.${this.modelForm.peer_to_peer_type}.${this.modelForm.peer_to_peer_id}`)
        .listen('.peer-to-peer-message.created', (e) => {
          this.messages.data.push(e);

          this.scrollToEndOfChat();
        });
    },
    logout() {
      this.$store.dispatch(LOGOUT)
        .then(() => {
          alert('Logged out successfully')
        })
        .catch((error) => {
          console.error(error);
        })
    }
  }
}
</script>

<style scoped>
.card .card-body {
  min-height: 100px;
  max-height: 480px;
  overflow-y: auto;
}
</style>