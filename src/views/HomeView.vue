<template>
  <div class="container-fluid">
    <div class="text-center">
      <img alt="Vue logo" src="../assets/logo.png" width="100px">
    </div>

    <div class="mt-4">
      <div class="row">
        <div class="col-md-4">
          <AssetDisplay />
        </div>
        <div class="col-md-8">
          <LoginForm v-if="!isAuthenticated" />

          <ChatScreen v-else />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LoginForm from '@/components/LoginForm';
import ChatScreen from '@/components/ChatScreen';
import AssetDisplay from '@/components/AssetDisplay';
import { mapGetters } from 'vuex';
import { VERIFY_AUTH, PURGE_AUTH } from '@/store/auth';

export default {
  name: 'HomeView',
  components: {
    LoginForm,
    ChatScreen,
    AssetDisplay
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
