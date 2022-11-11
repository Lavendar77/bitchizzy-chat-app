<template>
  <div>
    <h5 class="card-title">List of currencies and their NGN rates</h5>

    <ol class="list-group list-group-numbered">
      <li
        class="list-group-item d-flex justify-content-between align-items-start"
        v-for="currency in currencies"
        :key="currency.id"
      >
        <div class="ms-2 me-auto">
          <div class="fw-bold">{{ currency.name }}</div>
          <span>NGN {{ currency.exchange_rate_for_ngn + currency.custom_rate }}</span><br>
          <small class="text-muted">{{ currency.updated_at | moment('calendar') }}</small>
        </div>
        <span class="badge bg-primary rounded-pill">
          {{ currency.code }}
        </span>
      </li>
    </ol>
  </div>
</template>

<script>
import { GET_CURRENCIES, UPDATE_CURRENCY } from '@/store/currency';
import { mapGetters } from 'vuex';

export default {
  name: 'CurrencyDisplay',
  computed: {
    ...mapGetters({
      currencies: 'currencies',
    })
  },
  methods: {
    fetchCurrencies() {
      this.$store.dispatch(
        GET_CURRENCIES,
        'fields[currencies]=id,code,name,exchange_rate_for_ngn,custom_rate,updated_at&do_not_paginate=1'
      )
        .then(() => {
          this.openWebsocketConnection();
        })
        .catch(error => {
          alert(error.response?.message || 'Something went wrong during currencies fetch');
        })
    },
    openWebsocketConnection() {
      // eslint-disable-next-line
      Echo.channel('currency')
        .listen('.currency.updated', (e) => {
          this.$store.commit(UPDATE_CURRENCY, e);
        });
    },
  },
  mounted() {
    this.fetchCurrencies();
  },
}
</script>