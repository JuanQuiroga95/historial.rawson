# Historial Escuela Guillermo Rawson

## Setup en Vercel + Neon

### 1. Crear la base de datos Neon
1. Ir a tu proyecto en [vercel.com](https://vercel.com)
2. Pestaña **Storage** → **Create Database** → elegir **Neon**
3. Seguir los pasos (región: us-east-1 o la más cercana)
4. Vercel agrega automáticamente las variables de entorno `POSTGRES_URL`, etc.

### 2. Subir el proyecto
```bash
git add .
git commit -m "Migrar a Neon DB"
git push
```

### 3. La tabla se crea sola
La primera vez que se cargue la app, la función `/api/albums` crea la tabla `albums` automáticamente. No hace falta correr ninguna migración manual.

---

## Estructura del proyecto
```
/
├── index.html          # Frontend completo
├── package.json        # Dependencia: @vercel/postgres
├── vercel.json         # Configuración de rutas
└── api/
    └── albums/
        ├── index.js    # GET /api/albums, POST /api/albums
        └── [id].js     # DELETE /api/albums/:id
```

## Credenciales de administrador
- Usuario: `guillermo.rawson`
- Contraseña: `rawson2026`
