
[14:37, 19/09/2026] Carlimax🇰🇪🇺🇸: mport { kv } from '@vercel/kv';

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
[14:39, 19/09/2026] Carlimax🇰🇪🇺🇸: import { saveApplication } from './_db.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, phone, amount, term, monthly } = req.body;

    if (!name || !email || !amount || !term) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    if (amount < 500 || amount > 50000) {
      return res.status(400).json({ error: 'Amount out of range' });
    }
    if (term < 6 || term > 60) {
      return res.status(400).json({ error: 'Term out of range' });
    }

    const entry = {
      name: String(name).slice(0, 100),
      email: String(email).slice(0, 150),
      phone: phone ? String(phone).slice(0, 30) : null,
      amount: Number(amount),
      term: Number(term),
      monthly: Number(monthly),
      apr: 4.5,
      created_at: new Date().toISOString(),
    };

    const id = await saveApplication(entry);

    return res.status(201).json({ success: true, id });
  } catch (err) {
    console.error('apply error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
