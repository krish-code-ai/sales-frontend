"use server";

const API_URL = process.env.BACKEND_APP_URL;

export const getOrders = async (
  page: number = 1,
  limit: number = 10,
  search: string = "",
  category?: string,
  source?: string,
  geo?: string,
  fromDate?: string,
  toDate?: string
) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    search,
  });

  if (category) params.append("category", category);
  if (source) params.append("source", source);
  if (geo) params.append("geo", geo);
  if (fromDate) params.append("from_date", fromDate);
  if (toDate) params.append("to_date", toDate);

  const response = await fetch(`${API_URL}/orders?${params.toString()}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch orders");
  }

  return response.json();
};

export const getLocations = async () => {
  const response = await fetch(`${API_URL}/locations`, { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Failed to fetch locations");
  }
  return response.json();
}