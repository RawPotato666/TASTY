import axios from "axios";

// prek Caddy-ja gre /api -> tasty-api:5000
const API_BASE_URL = "http://tastyweb.duckdns.org/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
});

// ------------------ helper za slike ------------------

export function resolveImageUrl(url) {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return url; // backend vrača npr. "/images/xxx.jpg" -> to je ok
}

// ------------------ recepti ------------------

export async function fetchRecepti() {
  const res = await api.get("/Recepti");
  return res.data;
}

export async function fetchRecept(id) {
  const res = await api.get(`/Recepti/${id}`);
  return res.data;
}

export async function createRecept(payload) {
  const res = await api.post("/Recepti", payload);
  return res.data;
}

export async function uploadReceptImage(receptId, file, { opis, jeNaslovna }) {
  const formData = new FormData();
  formData.append("file", file);
  if (opis) formData.append("opis", opis);
  formData.append("jeNaslovna", jeNaslovna ? "true" : "false");

  const res = await api.post(`/Recepti/${receptId}/slike`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

// ------------------ meta ------------------

export async function fetchKategorije() {
  const res = await api.get("/Kategorije");
  return res.data;
}

export async function fetchOznake() {
  const res = await api.get("/Oznake");
  return res.data;
}

export async function fetchSestavine() {
  const res = await api.get("/Sestavine");
  return res.data;
}

// ------------------ uporabniki/auth ------------------

export async function fetchUporabniki() {
  const res = await api.get("/Uporabniki");
  return res.data;
}

export async function registerUser({ ime, email, geslo }) {
  const res = await api.post("/Uporabniki", {
    ime,
    email,
    geslo,
  });
  return res.data;
}

export async function loginUser({ email, geslo }) {
  // **točno to** endpoint, ki ti dela v Swaggerju
  const res = await api.post("/Auth/login", {
    email,
    geslo,
  });
  return res.data;
}
