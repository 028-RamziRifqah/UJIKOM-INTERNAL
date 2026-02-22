# Platform Top Up Game (UJIKOM)

Proyek ini adalah platform top-up game yang dikembangkan menggunakan **React** di sisi Frontend, **Node.js (Express)** di sisi Backend, dan **MySQL** sebagai Database.

## Fungsi Modul
 
Aplikasi ini dibagi menjadi dua modul utama:

1.  **Modul Pengguna (User)**:
    *   **Browsing Game**: Mencari dan melihat daftar game yang tersedia untuk di top-up.
    *   **Top Up**: Melakukan transaksi pembelian mata uang digital game (Diamond) dengan memasukkan User ID Game.
    *   **History Transaksi**: Melihat riwayat transaksi yang pernah dilakukan (mengecek status sukses/pending/gagal).
    *   **Autentikasi**: Fitur Login dan Register untuk menyimpan data transaksi pengguna.

2.  **Modul Admin**:
    *   **Manajemen Produk & Kategori**: Menambah, mengubah, dan menghapus data game (Kategori) serta paket Diamond (Produk).
    *   **Monitor Transaksi**: Melihat semua transaksi masuk dan memperbarui statusnya (Approve/Reject).
    *   **Laporan Penjualan**: Melihat ringkasan penjualan yang telah terjadi.

## Alur Arsitektur

Platform ini menggunakan pola arsitektur Client-Server

1.  **Frontend**: Menangani antarmuka pengguna, menerima input, dan menampilkan data secara reaktif.
2.  **Backend**: Menerima request dari frontend, melakukan logika bisnis, validasi, dan autentikasi JWT.
3.  **Database**: Menyimpan data relasional seperti user, kategori game, produk, dan log transaksi.

## Loading State & Error Handling

Implementasi pengalaman pengguna yang responsif dipastikan melalui:

### 1. Loading State
Setiap kali aplikasi melakukan pengambilan data (fetching) dari API, aplikasi menggunakan state `loading` untuk memberikan umpan balik visual kepada pengguna.
- **Contoh**: Di halaman Home, saat data kategori game dimuat, ditampilkan skeleton card atau indikator loading sebelum data muncul.
- **Implementasi**: Menggunakan `useState(true)` di awal `useEffect` dan mengesetnya menjadi `false` setelah data diterima.

### 2. Error Handling
- **Frontend**: Menggunakan blok `try-catch` pada fungsi asinkron (async/await) atau `.catch()` pada promise untuk menangkap kegagalan koneksi atau response error dari server. Pesan error ditampilkan melalui `alert` atau komponen khusus.
- **Backend**: Menggunakan middleware error global di Express (pada `index.js`) untuk menangkap semua error yang terjadi di controller dan mengirimkan response JSON yang seragam (misal: status 400).

## Implementasi CRUD (API Operations)
Sistem ini mengimplementasikan operasi CRUD melalui metode HTTP standar sebagai berikut:
-GET
Digunakan untuk membaca atau mengambil data.
Contoh endpoint: /api/categories
Berfungsi untuk mengambil data daftar game dari database.

-POST
Digunakan untuk membuat atau menambahkan data baru.
Contoh endpoint: /api/transactions
Berfungsi untuk mengirim data pembelian baru atau melakukan proses Register dan Login. 

-PUT
Digunakan untuk memperbarui data yang sudah ada.
Contoh endpoint: /api/transactions/:id/status
Berfungsi agar admin dapat memperbarui status transaksi, misalnya dari pending menjadi sukses.

-DELETE
Digunakan untuk menghapus data.
Contoh endpoint: /api/products/:id
Berfungsi untuk menghapus paket Diamond atau kategori game dari dashboard admin.

## Cara Instalasi & Jalankan

### 1. Prasyarat
- **Node.js**: Versi terbaru (LTS direkomendasikan).
- **MySQL**: Aktif (XAMPP atau MySQL Server).

### 2. Setup Database
Buat database bernama `be_ujikom` dan jalankan query berikut untuk membuat tabel:

```sql
CREATE DATABASE be_ujikom;
USE be_ujikom;

-- Tabel Users
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200),
  email VARCHAR(200) UNIQUE,
  password VARCHAR(255),
  role ENUM('admin', 'user') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel Kategori Game
CREATE TABLE game_categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  image VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

-- Tabel Produk (Paket Diamond)
CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category_id INT NOT NULL,
  diamond_amount INT NOT NULL,
  price INT NOT NULL,
  image VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES game_categories(id)
);

-- Tabel Acara
CREATE TABLE events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category_id INT NOT NULL,
  name VARCHAR(200),
  image VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES game_categories(id)
);

-- Membuat admin di tabel users
INSERT INTO users (name, email, password, ROLE)
VALUES (
  'Admin',
  'admin@topup.com',
  '$2b$10$zwBzP6hvEx42HFJjpJWdMeW0Qb0fHfShP3Qcf8Sii85QOg5F5JTj2',(didapatkan dengan cara menjalankan node hash.js di folder BACKEND-UJIKOM)
  'admin'
);

-- Tabel Transaksi
CREATE TABLE transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  game_user_id VARCHAR(200) NOT NULL,
  status ENUM('pending', 'success', 'failed') DEFAULT 'pending',
  total_price INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

```

### 3. Setup Backend
1. Masuk ke direktori backend:
   ```bash
   cd BACKEND-UJIKOM
   ```
2. Install dependency:
   ```bash
   npm install
   ```
3. Konfigurasi file `.env` (pastikan sesuai dengan kredensial database Anda).
4. Buat folder `uploads` jika belum ada:
   ```bash
   mkdir uploads
   ```
5. Jalankan server:
   ```bash
   npm run dev
   ```

### 4. Setup Frontend
1. Masuk ke direktori frontend:
   ```bash
   cd FRONTEND-UJIKOM
   ```
2. Install dependency:
   ```bash
   npm install
   ```
3. Jalankan aplikasi:
   ```bash
   npm run dev
   ```
4. Buka browser di alamat yang diberikan oleh Vite (biasanya `http://localhost:5173`).
