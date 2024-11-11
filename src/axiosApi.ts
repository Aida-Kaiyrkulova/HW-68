import axios from "axios";

const axiosApi = axios.create({
  baseURL:
    "https://todo-list-f29bf-default-rtdb.europe-west1.firebasedatabase.app/",
});

export default axiosApi;
