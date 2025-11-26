// stores/auth.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  // State
  const token = ref(null)
  const user = ref(null)

  // Getters
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const userName = computed(() => user.value?.name || '')
  const userEmail = computed(() => user.value?.email || '')

  // Actions
  function loadFromStorage() {
    // Cek localStorage dulu, lalu sessionStorage
    const storedToken = localStorage.getItem('auth_token') || 
                        sessionStorage.getItem('auth_token')
    const storedUser = localStorage.getItem('user_info') || 
                       sessionStorage.getItem('user_info')

    if (storedToken) {
      token.value = storedToken
    }

    if (storedUser) {
      try {
        user.value = JSON.parse(storedUser)
      } catch (err) {
        console.error('Failed to parse user info:', err)
        user.value = null
      }
    }

    console.log('Auth loaded from storage:', {
      hasToken: !!token.value,
      user: user.value?.name
    })
  }

  function setAuth(authToken, userData, remember = false) {
    const storage = remember ? localStorage : sessionStorage

    // Save to storage
    storage.setItem('auth_token', authToken)
    storage.setItem('user_info', JSON.stringify(userData))

    token.value = authToken
    user.value = userData

    console.log('Auth set:', {
      user: userData.name,
      remember,
      storage: remember ? 'localStorage' : 'sessionStorage'
    })
  }

  function logout() {
    // Clear storage
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_info')
    sessionStorage.removeItem('auth_token')
    sessionStorage.removeItem('user_info')

    // Clear state
    token.value = null
    user.value = null

    console.log('Auth cleared (logged out)')
  }

  function updateUser(userData) {
    user.value = userData
    
    // Update di storage juga
    const storage = localStorage.getItem('auth_token') 
      ? localStorage 
      : sessionStorage
    
    storage.setItem('user_info', JSON.stringify(userData))
  }

  // Initialize: Load dari storage saat store pertama kali dibuat
  loadFromStorage()

  return {
    // State
    token,
    user,
    
    // Getters
    isAuthenticated,
    userName,
    userEmail,
    
    // Actions
    loadFromStorage,
    setAuth,
    logout,
    updateUser
  }
})