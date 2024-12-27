import axios from 'axios'
const service = axios.create()
export {
    service as axios
}
//export const url_head = 'http://localhost:8080'
export const url_head = 'http://127.0.0.1:5000'