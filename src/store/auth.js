import ApiService from "@/services/api.service";
import JwtService from "@/services/jwt.service";

// action types
export const LOGIN = "login";
export const LOGOUT = "logout";
export const VERIFY_AUTH = "verifyAuth";

// mutation types
export const PURGE_AUTH = "logOut";
export const SET_AUTH = "setAuthUser";
export const SET_ERROR = "setError";

const state = {
  errors: null,
  user: null,
  isAuthenticated: !!JwtService.getToken()
};

const getters = {
  currentUser(state) {
    return state.user;
  },
  isAuthenticated(state) {
    return state.isAuthenticated;
  }
};

const actions = {
  [LOGIN](context, form) {
    return new Promise((resolve, reject) => {
      form
        .post("/user/login")
        .then(response => {
          context.commit(SET_AUTH, response.data.data);
          resolve(response);
        })
        .catch(error => {
          context.commit(SET_ERROR, error);
          reject(error);
        });
    });
  },
  [VERIFY_AUTH](context) {
    return new Promise((resolve, reject) => {
      ApiService.get("user")
        .then(response => {
          context.commit(SET_AUTH, response.data.data);
        })
        .catch(error => {
          context.commit(SET_ERROR, error);
          reject(error);
        });
    });
  },
  [LOGOUT](context) {
    return new Promise((resolve, reject) => {
      ApiService.post("user/logout")
        .then(response => {
          context.commit(PURGE_AUTH);
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
};

const mutations = {
  [SET_ERROR](state, error) {
    state.errors = error;
  },
  [SET_AUTH](state, data) {
    state.isAuthenticated = true;
    state.user = data.user;
    state.errors = {};

    if (data.token) {
      JwtService.saveToken(data.token);
    }
  },
  [PURGE_AUTH](state) {
    state.isAuthenticated = false;
    state.user = null;
    state.errors = null;
    JwtService.destroyToken();
  }
};

export default {
  state,
  actions,
  mutations,
  getters
};
