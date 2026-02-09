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

Sistem ini mengimplementasikan operasi CRUD melalui metode HTTP standar:

| Metode | Fungsi Utama | Contoh Endpoint | Deskripsi |
| :--- | :--- | :--- | :--- |
| **GET** | Read Data | `/api/categories` | Mengambil data daftar game dari database. |
| **POST** | Create Data | `/api/transactions` | Mengirim data pembelian baru atau melakukan Register/Login. |
| **PUT** | Update Data | `/api/transactions/:id/status` | Admin memperbarui status transaksi (misal: dari pending ke sukses). |
| **DELETE** | Delete Data | `/api/products/:id` | Menghapus paket Diamond atau kategori game dari dashboard admin. |

---

