"use server";

const API_URL = process.env.BACKEND_APP_URL;

export async function getCustomers() {
  const res = await fetch(`${API_URL}/customer`, { cache: "no-store" });
  return res.json();
}

export async function createCustomer(data: { name: string }) {
  const res = await fetch(`${API_URL}/customer`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateCustomer(id: number, data: { name: string }) {
  const res = await fetch(`${API_URL}/customer/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteCustomer(id: number) {
  const res = await fetch(`${API_URL}/customer/${id}`, { 
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
  });

  if (!res.ok) {
    // Read JSON error from Laravel
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to delete customer");
  }

  // Return JSON object to ensure plain JS object
  return res.json().catch(() => ({ message: "Customer deleted" }));

}