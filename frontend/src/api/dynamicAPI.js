import axios from 'axios'
import { config } from '../utils/customLocalStorage'

const dynamicAPI = async (method, url, obj = {}) => {
  try {
    switch (method) {
      case 'get':
        return await axios
          .get(`http://localhost:5001${url}`, config())
          .then((res) => res.data)

      case 'post':
        return await axios
          .post(`http://localhost:5001${url}`, obj, config())
          .then((res) => res.data)

      case 'put':
        return await axios
          .put(`http://localhost:5001${url}`, obj, config())
          .then((res) => res.data)

      case 'delete':
        return await axios
          .delete(`http://localhost:5001${url}`, config())
          .then((res) => res.data)
    }
  }  catch (error) {
  if (error.response) {
    throw error.response.data.error || 'Something went wrong'
  }

  if (error.request) {
    throw new Error('Unable to connect to the server')
  }

  throw new Error(error.message || 'Something went wrong')
}
}

export default dynamicAPI
