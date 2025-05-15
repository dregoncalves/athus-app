// src/api/axios.ts
import axios from "axios";

const api = axios.create({
  baseURL: "http://felipemariano.com.br:8080/ProjetoAthus",
});

export default api;
