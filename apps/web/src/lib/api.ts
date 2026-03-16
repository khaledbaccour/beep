const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003/api/v1';

interface ApiResponse<T> {
  data: T;
}

interface AuthResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: 'CLIENT' | 'EXPERT' | 'ADMIN';
    avatarUrl: string | null;
  };
}

export async function registerUser(body: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'CLIENT' | 'EXPERT';
  phone?: string;
}): Promise<ApiResponse<AuthResponse>> {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Registration failed' }));
    throw new Error(err.message || `Error ${res.status}`);
  }
  return res.json();
}

export async function loginUser(body: {
  email: string;
  password: string;
}): Promise<ApiResponse<AuthResponse>> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Login failed' }));
    throw new Error(err.message || `Error ${res.status}`);
  }
  return res.json();
}
