<template>
  <div>
    <h5>List of assets and their NGN rates</h5>

    <ol class="list-group list-group-numbered">
      <li
        class="list-group-item d-flex justify-content-between align-items-start"
        v-for="asset in assets"
        :key="asset.id"
      >
        <div class="ms-2 me-auto">
          <div class="fw-bold">{{ asset.name }}</div>
          <span>NGN {{ asset.current_rate?.price }}</span><br>
          <small class="text-muted">{{ asset.current_rate?.last_updated_at | moment('calendar') }}</small>
        </div>
        <span class="badge bg-primary rounded-pill">
          {{ asset.code }}
        </span>
      </li>
    </ol>
  </div>
</template>

<script>
import { GET_ASSETS, SET_ASSET_CURRENT_RATE } from '@/store/asset';
import { mapGetters } from 'vuex';

export default {
  name: 'AssetDisplay',
  computed: {
    ...mapGetters({
      assets: 'assets',
    })
  },
  methods: {
    fetchAssets() {
      this.$store.dispatch(GET_ASSETS, 'show_current_rate=1')
        .then(() => {
          this.openWebsocketConnection();
        })
        .catch(error => {
          alert(error.response?.message || 'Something went wrong during asset fetch');
        })
    },
    openWebsocketConnection() {
      // eslint-disable-next-line
      Echo.channel('local-asset-conversion')
        .listen('.local-asset-conversion.updated', (e) => {
          this.$store.commit(SET_ASSET_CURRENT_RATE, e);
        });
    },
  },
  mounted() {
    this.fetchAssets();
  },
}
</script>