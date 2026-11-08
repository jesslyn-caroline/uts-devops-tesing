# Image dasar: Node.js 22 versi Alpine Linux (ukurannya kecil)
FROM node:22-alpine

# Semua perintah berikutnya dijalankan di folder /app di dalam container
WORKDIR /app

# Mode production dan port bawaan 5001 (sama dengan compose.yml); bisa ditimpa dari compose
ENV NODE_ENV=production PORT=5001

# Salin daftar paket lebih dulu agar langkah npm ci bisa memakai cache
COPY package*.json ./

# Pasang paket production saja (tanpa nodemon), lalu bersihkan cache npm
RUN npm ci --omit=dev && npm cache clean --force

# Salin kode aplikasi
COPY index.js ./

# Jalankan sebagai user biasa "node", bukan root, demi keamanan
USER node

# Dokumentasi: aplikasi mendengarkan di port 5001
EXPOSE 5001

# Cek kesehatan tiap 15 detik ke /api/health di port yang sedang dipakai; 3 kali gagal = unhealthy
HEALTHCHECK --interval=15s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -q -O /dev/null "http://127.0.0.1:${PORT}/api/health" || exit 1

# Perintah saat container dinyalakan
CMD ["node", "index.js"]