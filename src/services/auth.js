import api from "./api"

export async function loginUser(email, password) {
  try {
    const response = await api.post('/login', {
      email,
      password,
    })

    return response.data
  } catch (error) {
    throw error
  }
}

export async function getProfile() {
  try {
    const response = await api.get('/profile')
    return response.data
  } catch (error) {
    throw error
  }
}

export async function updateProfile(data) {
  try {
    const response = await api.put('/profile', data)
    return response.data
  } catch (error) {
    throw error
  }
}

export async function updatePassword(data) {
  try {
    const response = await api.put('/profile/password', data)
    return response.data
  } catch (error) {
    throw error
  }
}

export async function updatePhoto(formData) {
  try {
    const response = await api.post('/profile/photo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  } catch (error) {
    throw error
  }
}

export async function deletePhoto() {
  try {
    const response = await api.delete('/profile/photo')
    return response.data
  } catch (error) {
    throw error
  }
}
