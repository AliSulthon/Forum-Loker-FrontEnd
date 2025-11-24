<template>
  <div class="register">
    <h2>Register Akun</h2>
    
    <form @submit.prevent="register">
      <input v-model="form.username" placeholder="Username" />
      <input v-model="form.fullname" placeholder="Nama Lengkap" />
      <input v-model="form.email" type="email" placeholder="Email" />
      <input v-model="form.email" type="bio" placeholder="Bio" />
      <input v-model="form.email" type="contact" placeholder="Kontak" />
      <input v-model="form.password" type="password" placeholder="Password" />
      <input v-model="form.password_confirmation" type="password" placeholder="Konfirmasi Password" />

      <button type="submit">Register</button>
    </form>

    <p v-if="error" style="color:red">{{ error }}</p>
    <p v-if="success" style="color:green">{{ success }}</p>
  </div>
</template>

<script>
import api from '../service/api';

export default {
  data() {
    return {
      form: {
        username: "",
        fullname: "",
        email: "",
        bio: "",
        contact: "",
        password: "",
        password_confirmation: "",
      },
      error: null,
      success: null,
    };
  },
  methods: {
    async register() {
      this.error = null;
      try {
        const res = await api.post('/register', this.form);
        this.success = res.data.message;
        this.$router.push('/login');
      } catch (err) {
        this.error = err.response.data.errors || "Terjadi kesalahan";
      }
    }
  }
};
</script>
