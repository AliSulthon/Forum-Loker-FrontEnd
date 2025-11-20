<template>
  <nav class="navbar">
    <h1>Forum Loker</h1>
    <ul>
      <li><router-link to="/communities">Communities</router-link></li>
    </ul>
  </nav>
</template>

<style>
.navbar {
  padding: 16px;
  background: #111;
  color: white;
  display: flex;
  justify-content: space-between;
}
a { color: white; text-decoration: none; margin-left: 20px; }
</style>
