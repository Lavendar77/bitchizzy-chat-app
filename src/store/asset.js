import ApiService from "@/services/api.service";

// action types
export const GET_ASSETS = "getAssets";

// mutation types
export const SET_ASSETS = "setAssets";
export const SET_ASSET_CURRENT_RATE = "setAssetCurrentRate";

const state = {
  errors: null,
  assets: null,
};

const getters = {
  assets(state) {
    return state.assets;
  },
};

const actions = {
  [GET_ASSETS](context, query) {
    return new Promise((resolve, reject) => {
      ApiService
        .get(`/assets?${query}`)
        .then(response => {
          context.commit(SET_ASSETS, response.data.data.assets);
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
};

const mutations = {
  [SET_ASSETS](state, assets) {
    state.assets = assets;
  },
  [SET_ASSET_CURRENT_RATE](state, { asset, rate, updated_at }) {
    let assetIndex = state.assets.findIndex((i) => i.code == asset);

    if (assetIndex === -1) {
      return;
    }

    state.assets[assetIndex].current_rate.price = rate;
    state.assets[assetIndex].current_rate.last_updated_at = updated_at;
  }
};

export default {
  state,
  actions,
  mutations,
  getters
};
