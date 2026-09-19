
import { getAllApplications } from './_db.js';

export default async function handler(req, res) {
  const token = req.query.token;
  if (!process.env.ADMIN_TOKEN || token !== process.env.ADMIN_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const entries = await getAllApplications();
    return res.status(200).json({ count: entries.length, entries });
  } catch (err) {
    console.error('entries error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
