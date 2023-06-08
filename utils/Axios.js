import axios from "axios";

// Create an instance of axios with custom configuration
const Axios = axios.create({
  baseURL: "https://dhcourse-server.vercel.app/api/v1", // Set the base URL for your API
  timeout: 5000, // Set the request timeout in milliseconds
  headers: {
    "Content-Type": "application/json", // Set the default content type
  },
});

export default Axios;
