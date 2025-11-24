<!-- <template>
    <div>
        <h1>Login</h1>
        <input v-model="email" placeholder="Email"/>
        <input v-model="password" type="password" placeholder="Password"/>
        <button @click="handleLogin">Login</button>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const authStore = useAuthStore();
const router = useRouter();

const handleLogin = async () => {
    try {
        await authStore.login({ email: email.value, password: password.value});
        alert('Login berhasil!!')
        router.push('/posts'); //redirect login
    } catch (err) {
        alert('login gagal!')
        console.error(err);
        
    }
};



</script> -->



<template>
  <div>
    <h2>Login</h2>

    <form @submit.prevent="login">
      <input v-model="email" placeholder="Email" />
      <input v-model="password" type="password" placeholder="Password" />
      <button type="submit">Login</button>
    </form>

    <p v-if="error" style="color:red">{{ error }}</p>
  </div>
</template>

<script>
import api from '../service/api';


export default {
  data() {
    return {
      email: "",
      password: "",
      error: null,
    };
  },
  methods: {
    async login() {
      this.error = null;
      try {
        const res = await api.post('/login', {
          email: this.email,
          password: this.password
        });

        localStorage.setItem('token', res.data.data.access_token);
        this.$router.push('/articles');
        
      } catch (err) {
        this.error = err.response.data.message || "Login gagal";
      }
    }
  }
};
</script>
