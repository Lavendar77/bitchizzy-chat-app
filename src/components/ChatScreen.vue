<template>
  <div class="container" v-if="user">
    <div class="row row-cols-2">
      <div class="col">
        <h3 class="text-center">Welcome back {{ `${user.first_name} ${user.last_name}` }}</h3>

        <form @submit.stop.prevent="openChat" class="mt-4">
          <div class="mb-3">
            <label for="peer_to_peer_id" class="form-label">Peer-to-peer ID</label>
            <input type="text" class="form-control" id="peer_to_peer_id" v-model="modelForm.peer_to_peer_id" required>
          </div>

          <div class="mb-3">
            <label for="peer_to_peer_type" class="form-label">Peer-to-peer Type</label>
            <select v-model="modelForm.peer_to_peer_type" id="peer_to_peer_type" class="form-select" required>
              <option value="">Select a type</option>
              <option value="sale">Sale</option>
              <option value="purchase">Purchase</option>
            </select>
          </div>

          <button type="submit" class="btn btn-primary" :disabled="modelForm.busy">Submit</button>
        </form>
      </div>
      <div class="col">
        <div class="card border-primary">
          <div class="card-header bg-white border-primary">
            Chat
          </div>
          <div class="card-body" ref="chatBox">
            <div v-for="message in messages.data" :key="message.id" class="border-bottom mb-2">
              <div class="mb-3">
                <h6 class="card-title">{{ message.sender }}</h6>
                <small class="text-muted">{{ message.created_at }}</small>
              </div>
              <p class="card-text">{{ message.message }}</p>
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
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { Form } from '@/plugins/vform'
import ApiService from '@/services/api.service'

export default {
  name: "ChatScreen",
  data() {
    return {
      modelForm: {
        peer_to_peer_id: "9768044d-7211-43ab-912e-b4bf07ff316d",
        peer_to_peer_type: "sale",
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

      ApiService
        .get(`user/peer-to-peer/${this.modelForm.peer_to_peer_type}s/${this.modelForm.peer_to_peer_id}/messages`)
        .then((response) => {
          this.startChat = true;
          this.messages = response.data.data.messages;
        })
        .catch((error) => {
          alert(error.response.data.message);
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
          this.newMessageForm.clear();
        })
        .catch((error) => {
          alert(error.response.data.message);
        })
    }
  }
}
</script>

<style scoped>
.card .card-body {
  max-height: 480px;
  overflow-y: auto;
}
</style>