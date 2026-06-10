const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export async function api(endpoint, options = {}) {
  const url = API_URL ? `${API_URL}${endpoint}` : endpoint;
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export default API_URL;
