# CMS Blog API

CMS sederhana untuk blog dengan fitur:
- Manajemen User
- Manajemen Artikel
- Tracking Page View
- Sistem Autentikasi

## **Persyaratan**
- Node.js v16+
- MongoDB
- Docker (opsional)

## **Instalasi**
1. Clone repo:
   ```bash
   git clone https://github.com/sudrajad02/CMS-Blog
   cd cms-blog
   ```

2. Install dependencies:
   ```bash
   npm install
   ```
   or
   ```bash
   pnpm install
   ```

3. Copy file `.env` dari `.env.sample` kemudian edit dengan sesuai kebutuhan:

4. Jalankan:
   ```bash
   npm run dev
   ```

## **Dokumentasi API**
Import file `CMS_BLOG.postman_collection.json`

## **Docker**
1. Build image:
   ```bash
   docker build -t cms-blog .
   ```

2. Jalankan container:
   ```bash
   docker run -p 3000:3000 --env-file .env cms-blog
   ```

## **Endpoint Utama**
| Method | Endpoint           | Deskripsi                |
|--------|--------------------|--------------------------|
| POST   | /auth/login        | Login user               |
| POST   | /users             | Daftar user              |
| GET    | /articles          | Daftar artikel published |
| POST   | /page-view         | Track page view          |