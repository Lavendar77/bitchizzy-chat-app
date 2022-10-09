import Vue from "vue";
import ApiService from "@/services/api.service";
import {
  HasError,
  AlertError,
  AlertErrors,
  AlertSuccess
} from "vform/src/components/bootstrap5";
import Form from "vform";

Vue.component(HasError.name, HasError);
Vue.component(AlertError.name, AlertError);
Vue.component(AlertErrors.name, AlertErrors);
Vue.component(AlertSuccess.name, AlertSuccess);

Form.prototype.submit = function submit(method, url, config = {}) {
  this.startProcessing();

  const data = method === "get" ? { params: this.data() } : this.data();

  return new Promise((resolve, reject) => {
    ApiService.request({
      url: this.route(url),
      method,
      data,
      ...config
    })
      .then(response => {
        this.finishProcessing();

        resolve(response);
      })
      .catch(error => {
        this.busy = false;

        if (error.response) {
          this.errors.set(this.extractErrors(error.response));
        }

        reject(error);
      });
  });
};

// Form = (...params) => new Form(...params);

export { Form };
