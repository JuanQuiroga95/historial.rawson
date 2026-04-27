import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL, { ssl: 'require' });

async function ensureTable() {
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
}

// Normaliza una fila: asegura que photos sea siempre un array
function normalize(row) {
  let photos = row.photos;
  if (typeof photos === 'string') {
    try { photos = JSON.parse(photos); } catch { photos = []; }
  }
  if (!Array.isArray(photos)) photos = [];
  return { ...row, photos };
}

export default async function handler(req, res) {
  // CORS por las dudas
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    await ensureTable();

    if (req.method === 'GET') {
      const rows = await sql`
        SELECT id, title, year, description, photos, created_at
        FROM albums
        ORDER BY year DESC, created_at DESC
      `;
      return res.status(200).json(rows.map(normalize));
    }

    if (req.method === 'POST') {
      const { title, year, description, photos } = req.body;
      if (!title || !year) {
        return res.status(400).json({ error: 'Título y año son requeridos.' });
      }
      const photosJson = JSON.stringify(Array.isArray(photos) ? photos : []);
      const rows = await sql`
        INSERT INTO albums (title, year, description, photos)
        VALUES (${title}, ${year}, ${description || ''}, ${photosJson}::jsonb)
        RETURNING *
      `;
      return res.status(201).json(normalize(rows[0]));
    }

    res.status(405).json({ error: 'Método no permitido.' });

  } catch (err) {
    console.error('DB Error:', err);
    res.status(500).json({ error: err.message });
  }
}
