<template>
  <div>
    <h5 class="card-title">Login</h5>

    <alert-error :form="form" :message="form.errors.error"></alert-error>

    <form @submit.stop.prevent="login" @keydown="form.onKeydown($event)">
      <div class="mb-3">
        <label for="exampleInputEmail1" class="form-label">Email address</label>
        <input type="email" class="form-control" :class="{ 'is-invalid': form.errors.has('email') }" id="exampleInputEmail1" aria-describedby="emailHelp" v-model="form.email" required>
        <has-error :form="form" field="email"></has-error>
      </div>

      <div class="mb-3">
        <label for="exampleInputPassword1" class="form-label">Password</label>
        <input type="password" class="form-control" :class="{ 'is-invalid': form.errors.has('password') }" id="exampleInputPassword1" v-model="form.password" required>
        <has-error :form="form" field="password"></has-error>
      </div>

      <button type="submit" class="btn btn-primary" :disabled="form.busy">Submit</button>
    </form>
  </div>
</template>

<script>
import { Form } from '@/plugins/vform';
import { LOGIN } from "@/store/auth";

export default {
  name: 'LoginForm',
  data() {
    return {
      form: new Form({
        email: "",
        password: ""
      })
    }
  },
  methods: {
    login() {
      this.$store.dispatch(LOGIN, this.form).then(() => {
        alert('Login successful');
      }).catch(error => {
        console.error(error);
      });
    }
  }
}
</script>
