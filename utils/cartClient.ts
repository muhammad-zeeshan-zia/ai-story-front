const serverBaseUrl = process.env.NEXT_PUBLIC_BACKEND_SERVER_URL;

function authHeaders(token: string) {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function createCartItem(token: string, payload: any) {
  const res = await fetch(`${serverBaseUrl}/user/cart`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Failed to create cart item");
  return data?.response?.data;
}

export async function getMyCart(token: string) {
  const res = await fetch(`${serverBaseUrl}/user/cart`, {
    method: "GET",
    headers: authHeaders(token),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Failed to get cart");
  return data?.response?.data;
}
