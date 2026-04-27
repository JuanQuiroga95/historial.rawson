import { put } from '@vercel/blob';

export const config = {
  api: { bodyParser: false }
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido.' });
  }

  try {
    // El nombre del archivo viene en el header
    const filename = req.headers['x-filename'] || `foto-${Date.now()}.jpg`;

    // Subir el stream directamente a Blob
    const blob = await put(filename, req, {
      access: 'public',
      contentType: req.headers['content-type'] || 'image/jpeg',
    });

    return res.status(200).json({ url: blob.url });
  } catch (err) {
    console.error('Blob Error:', err);
    return res.status(500).json({ error: err.message });
  }
}
