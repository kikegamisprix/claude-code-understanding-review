export async function fetchUser(userId: string): Promise<{ name: string; email: string }> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const res = await fetch(`https://api.example.com/users/${userId}`, {
      signal: controller.signal,
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }

    return await res.json();
  } finally {
    clearTimeout(timeout);
  }
}
