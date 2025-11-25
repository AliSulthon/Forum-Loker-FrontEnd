import axios from "axios"

const API = "http://localhost:8000/api"

export async function loginUser(email, password) {
  try {
    const response = await axios.post(`${API}/login`, {
      email,
      password,
    })

    return response.data
  } catch (error) {
    throw error
  }
}
