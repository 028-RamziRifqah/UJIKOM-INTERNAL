# 🎮 UJIKOM-TOPUP - Aplikasi Top Up Game

Aplikasi web untuk melakukan top up diamond/item game secara online. Dibangun dengan arsitektur fullstack menggunakan **React.js** (Frontend) dan **Express.js** (Backend) dengan database **MySQL**.

---

## 📋 Daftar Isi

- [Arsitektur Aplikasi](#arsitektur-aplikasi)
- [Struktur Modul](#struktur-modul)
- [Alur Frontend → Backend → Database](#alur-frontend--backend--database)
- [Implementasi Loading State & Error Handling](#implementasi-loading-state--error-handling)
- [API Endpoints (GET, POST, PUT, DELETE)](#api-endpoints-get-post-put-delete)
- [Cara Menjalankan Aplikasi](#cara-menjalankan-aplikasi)

---

## 🏗️ Arsitektur Aplikasi

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT (Browser)                        │
│                     React.js + Tailwind CSS                     │
└───────────────────────────────┬─────────────────────────────────┘
                                │ HTTP Request (Axios)
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND (Express.js)                       │
│              Routes → Controllers → Database Query              │
└───────────────────────────────┬─────────────────────────────────┘
                                │ SQL Query
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                       DATABASE (MySQL)                          │
│        users, products, game_categories, transactions, events   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📁 Struktur Modul

### Frontend (`FRONTEND-UJIKOM/`)

| Folder/File | Fungsi |
|-------------|--------|
| `src/pages/` | Halaman utama user (Home, Login, Register, GameDetail, History) |
| `src/admin/pages/` | Halaman admin (Categories, Products, Transactions, SalesReport, Events) |
| `src/components/` | Komponen reusable (Navbar, GameCard, Footer) |
| `src/services/api.js` | Konfigurasi Axios untuk komunikasi ke backend |
| `src/context/AuthContext.jsx` | Context untuk autentikasi user |

### Backend (`BACKEND-UJIKOM/`)

| Folder/File | Fungsi |
|-------------|--------|
| `src/controllers/` | Logic bisnis untuk setiap modul |
| `src/routes/` | Definisi endpoint API |
| `src/middleware/` | Middleware autentikasi & upload file |
| `src/config/db.js` | Konfigurasi koneksi database MySQL |
| `uploads/` | Penyimpanan file gambar produk/kategori |

### Deskripsi Controller

| Controller | Fungsi |
|------------|--------|
| `authController.js` | Register & login user dengan JWT token |
| `productController.js` | CRUD produk (diamond package) |
| `gameCategoryController.js` | CRUD kategori game |
| `transactionController.js` | Kelola transaksi & laporan penjualan |
| `eventController.js` | CRUD event/promo |

---

## 🔄 Alur Frontend → Backend → Database

### Contoh: User Melihat Daftar Game (Halaman Home)

```
1. User membuka halaman Home
           │
           ▼
2. React useEffect() dipanggil saat komponen mount
           │
           ▼
3. Frontend memanggil api.get("/categories")
   └── Axios mengirim HTTP GET ke http://localhost:3000/api/categories
           │
           ▼
4. Backend menerima request di gameCategoryRoutes.js
   └── router.get("/", getCategories)
           │
           ▼
5. Controller menjalankan query SQL
   └── SELECT * FROM game_categories ORDER BY id ASC
           │
           ▼
6. MySQL mengembalikan data kategori game
           │
           ▼
7. Controller mengirim response JSON
   └── res.json({ success: true, data: result })
           │
           ▼
8. Frontend menerima response & update state
   └── setGames(res.data.data)
           │
           ▼
9. React me-render ulang UI dengan data terbaru
```

### Contoh: User Melakukan Top Up (Halaman GameDetail)

```
1. User mengisi Game ID & memilih nominal diamond
           │
           ▼
2. User klik "Konfirmasi Top Up"
           │
           ▼
3. Frontend memanggil api.post("/transactions", { product_id, game_user_id })
   └── Axios mengirim HTTP POST dengan token di header
           │
           ▼
4. Backend menerima request di transactionRoutes.js
   └── router.post("/", authMiddleware, createTransaction)
           │
           ▼
5. Middleware verifikasi JWT token
   └── Jika valid, lanjut ke controller
           │
           ▼
6. Controller:
   a. Ambil harga produk: SELECT price FROM products WHERE id = ?
   b. Insert transaksi: INSERT INTO transactions (user_id, product_id, game_user_id, total_price) VALUES (?, ?, ?, ?)
           │
           ▼
7. Database menyimpan data transaksi dengan status "pending"
           │
           ▼
8. Backend mengirim response sukses
   └── res.json({ success: true, message: 'Transaksi berhasil dibuat', status: 'pending' })
           │
           ▼
9. Frontend menampilkan alert sukses ke user
```

---

## ⏳ Implementasi Loading State & Error Handling

### Loading State

Loading state digunakan untuk memberikan feedback visual saat data sedang diambil dari server.

**Contoh di `Home.jsx`:**

```jsx
// 1. Deklarasi state loading
const [loading, setLoading] = useState(true)

// 2. Fetch data & update loading
useEffect(() => {
  api.get("/categories").then(res => {
    setGames(res.data.data)
    setLoading(false)  // Set false setelah data diterima
  })
}, [])

// 3. Render kondisional berdasarkan loading
{loading ? (
  // Tampilkan skeleton/placeholder saat loading
  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="bg-navy-800 rounded-xl h-64 animate-pulse"></div>
    ))}
  </div>
) : (
  // Tampilkan data setelah loading selesai
  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
    {filteredGames.map(game => <GameCard game={game} />)}
  </div>
)}
```

### Error Handling

#### Frontend - Validasi & Alert

```jsx
// Validasi input sebelum submit (GameDetail.jsx)
const handleBuy = async () => {
  // Error: User belum login
  if (!user) {
    alert("Untuk melakukan pembelian harap login terlebih dahulu!")
    navigate("/login")
    return
  }

  // Error: Data tidak lengkap
  if (!gameUserId || !selected) {
    alert("Lengkapi data!")
    return
  }

  // Proses transaksi
  await api.post("/transactions", { product_id: selected.id, game_user_id: gameUserId })
  alert("Transaksi berhasil (status pending)")
}
```

#### Backend - Error Response

```javascript
// Validasi data (productController.js)
if (!category_id || !diamond_amount || !price || !image) {
  return res.status(400).json({ message: 'Data tidak lengkap' });
}

// Error database (transactionController.js)
db.query(sql, params, (err, result) => {
  if (err) {
    return res.status(500).json({ 
      message: 'Gagal mengambil data transaksi', 
      error: err 
    });
  }
  res.json({ success: true, data: result });
});

// Data tidak ditemukan (gameCategoryController.js)
if (result.length === 0) {
  return res.status(404).json({ message: 'Kategori game tidak ditemukan' });
}
```

#### Global Error Handler (Backend)

```javascript
// index.js - Menangkap error Multer & error lainnya
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: err.message });
  }
  if (err) {
    return res.status(400).json({ message: err.message });
  }
});
```

---

## 📡 API Endpoints (GET, POST, PUT, DELETE)

### Authentication (`/api/auth`)

| Method | Endpoint | Fungsi | Request Body | Response |
|--------|----------|--------|--------------|----------|
| `POST` | `/register` | Daftar user baru | `{ name, email, password }` | `{ message: "Register Berhasil" }` |
| `POST` | `/login` | Login user | `{ email, password }` | `{ message, token }` |

---

### Game Categories (`/api/categories`)

| Method | Endpoint | Fungsi | Request | Response |
|--------|----------|--------|---------|----------|
| `GET` | `/` | Ambil semua kategori | - | `{ success, data: [...] }` |
| `GET` | `/:id` | Ambil kategori by ID | - | `{ id, name, image }` |
| `GET` | `/:id/products` | Ambil kategori + produknya | - | `{ id, name, image, products: [...] }` |
| `POST` | `/` | Tambah kategori baru | FormData: `{ name, image }` | `{ success, message, categoryId }` |
| `PUT` | `/:id` | Update kategori | FormData: `{ name, image? }` | `{ success, message }` |
| `DELETE` | `/:id` | Hapus kategori | - | `{ success, message }` |

---

### Products (`/api/products`)

| Method | Endpoint | Fungsi | Request | Response |
|--------|----------|--------|---------|----------|
| `GET` | `/` | Ambil semua produk | - | `[{ id, category_id, diamond_amount, price, image, game_name }]` |
| `GET` | `/:id` | Ambil produk by ID | - | `{ id, category_id, diamond_amount, price, image }` |
| `POST` | `/` | Tambah produk baru | FormData: `{ category_id, diamond_amount, price, image }` | `{ message }` |
| `PUT` | `/:id` | Update produk | FormData: `{ category_id?, diamond_amount?, price?, image? }` | `{ message }` |
| `DELETE` | `/:id` | Hapus produk | - | `{ message }` |

**Catatan DELETE:** Produk tidak dapat dihapus jika sudah digunakan dalam transaksi.

---

### Transactions (`/api/transactions`)

| Method | Endpoint | Fungsi | Auth | Request | Response |
|--------|----------|--------|------|---------|----------|
| `GET` | `/all` | Ambil semua transaksi | Admin | - | `{ success, data: [...] }` |
| `GET` | `/history` | Ambil transaksi user | User | - | `{ success, data: [...] }` |
| `GET` | `/sales-report` | Laporan penjualan | Admin | Query: `?startDate&endDate` | `{ success, data: { summary, daily, monthly, yearly } }` |
| `POST` | `/` | Buat transaksi baru | User | `{ product_id, game_user_id }` | `{ success, message, status }` |
| `PUT` | `/:id/status` | Update status transaksi | Admin | `{ status }` | `{ success, message }` |

**Status Transaksi:** `pending`, `success`, `failed`

---

### Events (`/api/events`)

| Method | Endpoint | Fungsi | Request | Response |
|--------|----------|--------|---------|----------|
| `GET` | `/` | Ambil semua event | - | `{ success, data: [...] }` |
| `POST` | `/` | Tambah event baru | FormData: `{ title, description, image }` | `{ success, message }` |
| `PUT` | `/:id` | Update event | FormData: `{ title?, description?, image? }` | `{ success, message }` |
| `DELETE` | `/:id` | Hapus event | - | `{ success, message }` |

---

## 🚀 Cara Menjalankan Aplikasi

### Prasyarat

- Node.js v18+
- MySQL/MariaDB
- npm atau yarn

### 1. Setup Database

```sql
CREATE DATABASE ujikom_topup;
```

Import schema dan data dari file SQL yang disediakan.

### 2. Setup Backend

```bash
cd BACKEND-UJIKOM
npm install

# Buat file .env
# PORT=3000
# JWT_SECRET=your_secret_key
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=
# DB_NAME=ujikom_topup

npm start
```

Backend berjalan di: `http://localhost:3000`

### 3. Setup Frontend

```bash
cd FRONTEND-UJIKOM
npm install
npm run dev
```

Frontend berjalan di: `http://localhost:5173`

---

## 📝 Catatan Teknis

1. **Autentikasi**: Menggunakan JWT token yang disimpan di localStorage
2. **File Upload**: Gambar disimpan di folder `uploads/` backend
3. **Styling**: Menggunakan Tailwind CSS dengan custom dark theme
4. **State Management**: React Context untuk auth, useState untuk data lokal

---

## 👨‍💻 Teknologi yang Digunakan

| Layer | Teknologi |
|-------|-----------|
| Frontend | React.js, Vite, Tailwind CSS, Axios |
| Backend | Express.js, Node.js |
| Database | MySQL |
| Auth | JWT, bcryptjs |
| File Upload | Multer |

---

**© 2025 UJIKOM-TOPUP** - Dibuat untuk Ujikom Kompetensi
