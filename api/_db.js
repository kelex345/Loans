
import { kv } from '@vercel/kv';

export async function saveApplication(data) {
  const id = app:${Date.now()}:${Math.random().toString(36).slice(2, 8)};
  await kv.set(id, data);
  await kv.lpush('applications:index', id);
  return id;
}

export async function getAllApplications() {
  const ids = await kv.lrange('applications:index', 0, -1);
  if (!ids.length) return [];
  const apps = await Promise.all(ids.map((id) => kv.get(id)));
  return apps.filter(Boolean);
}
