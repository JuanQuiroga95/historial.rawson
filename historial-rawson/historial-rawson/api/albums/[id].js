import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL, { ssl: 'require' });

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    if (req.method === 'DELETE') {
      await sql`DELETE FROM albums WHERE id = ${id}`;
      return res.status(200).json({ ok: true });
    }
    res.status(405).json({ error: 'Método no permitido.' });
  } catch (err) {
    console.error('DB Error:', err);
    res.status(500).json({ error: err.message });
  }
}
