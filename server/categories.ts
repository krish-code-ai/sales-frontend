"use server";

const API_URL = process.env.BACKEND_APP_URL;

export async function getCategories() {
  const res = await fetch(`${API_URL}/categories`, { cache: "no-store" });
  return res.json();
}

export async function createCategory(data: { name: string }) {
  const res = await fetch(`${API_URL}/categories`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateCategory(id: number, data: { name: string }) {
  const res = await fetch(`${API_URL}/categories/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteCategory(id: number) {
  return fetch(`${API_URL}/categories/${id}`, {
    method: "DELETE",
  });
}