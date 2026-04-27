import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL, { ssl: 'require' });

export default async function handler(req, res) {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS albums (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        year TEXT NOT NULL,
        description TEXT,
        photos JSONB DEFAULT '[]',
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;

    if (req.method === 'GET') {
      const rows = await sql`
        SELECT id, title, year, description, photos, created_at
        FROM albums
        ORDER BY year DESC, created_at DESC
      `;
      return res.status(200).json(rows);
    }

    if (req.method === 'POST') {
      const { title, year, description, photos } = req.body;
      if (!title || !year) {
        return res.status(400).json({ error: 'Título y año son requeridos.' });
      }
      const rows = await sql`
        INSERT INTO albums (title, year, description, photos)
        VALUES (${title}, ${year}, ${description || ''}, ${JSON.stringify(photos || [])})
        RETURNING *
      `;
      return res.status(201).json(rows[0]);
    }

    res.status(405).json({ error: 'Método no permitido.' });

  } catch (err) {
    console.error('DB Error:', err);
    res.status(500).json({ error: err.message });
  }
}
