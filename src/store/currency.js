import ApiService from "@/services/api.service";

// action types
export const GET_CURRENCIES = "getCurrencies";

// mutation types
export const SET_CURRENCIES = "setCurrencies";
export const UPDATE_CURRENCY = "updateCurrency";

const state = {
  currencies: null,
};

const getters = {
  currencies(state) {
    return state.currencies;
  },
};

const actions = {
  [GET_CURRENCIES](context, query = null) {
    return new Promise((resolve, reject) => {
      ApiService
        .get(`/currencies?${query}`)
        .then(response => {
          context.commit(SET_CURRENCIES, response.data.data.currencies);
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
};

const mutations = {
  [SET_CURRENCIES](state, currencies) {
    state.currencies = currencies;
  },
  [UPDATE_CURRENCY](state, newCurrency) {
    let currencyIndex = state.currencies.findIndex((currency) => currency.id == newCurrency.id);

    if (currencyIndex === -1) {
      return;
    }

    Object.keys(state.currencies[currencyIndex]).forEach(key => {
      state.currencies[currencyIndex][key] = newCurrency[key];
    });
  }
};

export default {
  state,
  actions,
  mutations,
  getters
};
