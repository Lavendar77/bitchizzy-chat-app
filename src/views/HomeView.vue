<template>
  <div class="container-fluid">
    <div class="text-center">
      <img alt="Vue logo" src="../assets/logo.png" width="100px">
    </div>

    <div class="mt-4">
      <ul class="nav nav-tabs" id="myTab" role="tablist">
        <li class="nav-item" role="presentation">
          <button class="nav-link active" id="asset-tab" data-bs-toggle="tab" data-bs-target="#asset" type="button" role="tab" aria-controls="asset" aria-selected="true">Assets</button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="nav-link" id="currency-tab" data-bs-toggle="tab" data-bs-target="#currency" type="button" role="tab" aria-controls="currency" aria-selected="false">Currencies</button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="nav-link" id="chat-tab" data-bs-toggle="tab" data-bs-target="#chat" type="button" role="tab" aria-controls="chat" aria-selected="false">Chat</button>
        </li>
      </ul>

      <div class="tab-content" id="myTabContent">
        <div class="tab-pane fade show active" id="asset" role="tabpanel" aria-labelledby="asset-tab">
          <div class="card">
            <div class="card-body">
              <AssetDisplay />
            </div>
          </div>
        </div>
        <div class="tab-pane fade" id="currency" role="tabpanel" aria-labelledby="currency-tab">
          <div class="card">
            <div class="card-body">
              <CurrencyDisplay />
            </div>
          </div>
        </div>
        <div class="tab-pane fade" id="chat" role="tabpanel" aria-labelledby="chat-tab">
          <div class="card">
            <div class="card-body">
              <LoginForm v-if="!isAuthenticated" />

              <ChatScreen v-else />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LoginForm from '@/components/LoginForm';
import ChatScreen from '@/components/ChatScreen';
import AssetDisplay from '@/components/AssetDisplay';
import CurrencyDisplay from '@/components/CurrencyDisplay';
import { mapGetters } from 'vuex';
import { VERIFY_AUTH, PURGE_AUTH } from '@/store/auth';

export default {
  name: 'HomeView',
  components: {
    LoginForm,
    ChatScreen,
    AssetDisplay,
    CurrencyDisplay,
  },
  computed: {
    ...mapGetters({
      isAuthenticated: 'isAuthenticated',
      user: 'currentUser',
    })
  },
  created() {
    if (this.isAuthenticated) {
      if (!this.user) {
        this.$store.dispatch(VERIFY_AUTH)
          .catch((error) => {
            if (error.response.status == 401) {
              this.$store.commit(PURGE_AUTH)
            }
          });
      }
    }
  }
}
</script>
