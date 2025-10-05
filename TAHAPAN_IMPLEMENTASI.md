# Tahapan Implementasi Aplikasi Absensi

Dokumen ini menguraikan langkah-langkah teknis yang perlu dilakukan untuk mengimplementasikan backend dan menghubungkannya dengan frontend yang sudah ada.

## Fase 1: Persiapan Lingkungan Backend

**Tujuan:** Menyiapkan proyek Node.js dan menginstal semua dependensi yang dibutuhkan.

1.  **Inisialisasi Proyek Node.js:**
    -   Buka terminal di direktori proyek (`d:\absensi siswa pkl`).
    -   Jalankan perintah: `npm init -y`
    -   Ini akan membuat file `package.json` secara otomatis.

2.  **Instalasi Dependensi:**
    -   Jalankan perintah berikut untuk menginstal Express (untuk server), SQLite3 (untuk database), dan Nodemon (untuk auto-restart server saat development):
        ```bash
        npm install express sqlite3
        npm install nodemon --save-dev
        ```

3.  **Konfigurasi `package.json`:**
    -   Buka file `package.json`.
    -   Tambahkan script `start` untuk menjalankan server dengan Nodemon. Ini akan memudahkan proses development.
        ```json
        "scripts": {
          "start": "nodemon server.js"
        }
        ```

## Fase 2: Pembuatan Server dan Database

**Tujuan:** Membuat server web dasar dan menyiapkan file database beserta tabelnya.

1.  **Buat File Server:**
    -   Buat file baru di direktori utama dengan nama `server.js`.

2.  **Inisialisasi Database dan Tabel:**
    -   Di dalam `server.js`, tulis kode untuk:
        -   Mengimpor modul `sqlite3`.
        -   Membuat atau terhubung ke file database bernama `absensi.db`.
        -   Menjalankan query SQL `CREATE TABLE IF NOT EXISTS` untuk membuat tabel `absensi` sesuai dengan desain yang telah dibuat di `DESAIN_DATABASE.md`.

3.  **Buat Server Express:**
    -   Masih di `server.js`, tulis kode untuk:
        -   Mengimpor modul `express`.
        -   Membuat instance aplikasi Express.
        -   Menambahkan middleware `express.json()` untuk bisa membaca data JSON dari request body.
        -   Menambahkan middleware untuk menyajikan file statis (HTML, CSS, JS) dari direktori proyek.
        -   Menjalankan server pada port tertentu (misalnya, port 3000).

## Fase 3: Pembuatan API Endpoint

**Tujuan:** Membuat "jembatan" agar frontend bisa mengirim data ke backend.

1.  **Buat Endpoint `POST /api/absensi`:**
    -   Di `server.js`, buat sebuah route handler untuk `POST` request ke `/api/absensi`.
    -   Di dalam handler ini:
        -   Ambil data (nama, nis, kelas, dll.) dari `req.body`.
        -   Lakukan validasi sederhana untuk memastikan data tidak kosong.
        -   Buat query SQL `INSERT INTO` untuk memasukkan data yang diterima ke dalam tabel `absensi`.
        -   Sertakan juga tanggal dan waktu saat ini.
        -   Kirim respons kembali ke frontend dalam format JSON (misalnya, `{ success: true, message: 'Absensi berhasil disimpan.' }`).

## Fase 4: Integrasi Frontend dengan Backend

**Tujuan:** Mengubah frontend agar mengirimkan data ke server, bukan lagi menampilkan `alert()`.

1.  **Modifikasi `script.js`:**
    -   Buka file `script.js`.
    -   Di dalam event listener untuk `submit` form, hapus `alert()` yang ada.
    -   Gunakan `fetch()` API JavaScript untuk mengirim `POST` request ke `/api/absensi`.
    -   Sertakan data formulir dalam `body` request dalam format JSON.
    -   Tangani respons dari server:
        -   Jika respons sukses, tampilkan pesan konfirmasi kepada pengguna (bisa dengan mengubah elemen di halaman atau dengan `alert` yang lebih informatif).
        -   Jika gagal, tampilkan pesan error.
    -   Panggil `form.reset()` setelah data berhasil dikirim.

## Fase 5: Pengujian End-to-End

**Tujuan:** Memastikan seluruh alur aplikasi berjalan dengan baik.

1.  **Jalankan Server:**
    -   Buka terminal dan jalankan perintah: `npm start`.

2.  **Buka Aplikasi di Browser:**
    -   Buka browser dan akses `http://localhost:3000`.

3.  **Lakukan Pengujian:**
    -   Isi formulir absensi dan klik "Kirim Absensi".
    -   Periksa apakah Anda menerima pesan sukses.
    -   (Opsional) Gunakan tool seperti "DB Browser for SQLite" untuk membuka file `absensi.db` dan pastikan data baru telah tersimpan dengan benar di dalam tabel.