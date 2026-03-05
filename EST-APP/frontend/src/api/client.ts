const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

export class ApiError extends Error {
  status: number;
  body: any;
  constructor(status: number, body: any) {
    super(body?.message ?? "API Error");
    this.status = status;
    this.body = body;
  }
}

export async function apiFetch<T>(
  path: string,
  opts: RequestInit & { token?: string } = {}
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(opts.headers as any)
  };

  if (opts.token) headers.Authorization = `Bearer ${opts.token}`;

  const res = await fetch(`${API_URL}${path}`, {
    ...opts,
    headers
  });

  const contentType = res.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");
  const body = isJson ? await res.json().catch(() => null) : await res.text().catch(() => null);

  if (!res.ok) throw new ApiError(res.status, body);
  return body as T;
}

export function apiUrl(path: string) {
  return `${API_URL}${path}`;
}