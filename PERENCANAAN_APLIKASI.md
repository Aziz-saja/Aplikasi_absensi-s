# Perencanaan Aplikasi Absensi Siswa PKL

Dokumen ini menguraikan rencana teknis untuk pengembangan aplikasi Absensi Siswa PKL. Tujuannya adalah untuk menjadi panduan selama proses coding.

## 1. Ringkasan Proyek

Aplikasi ini adalah sistem absensi berbasis web yang dirancang untuk memudahkan siswa PKL dalam melaporkan kehadiran mereka setiap hari. Aplikasi ini juga akan memiliki fitur untuk admin (guru/pembimbing) untuk memantau dan merekapitulasi data absensi.

## 2. Teknologi yang Akan Digunakan

Untuk membangun aplikasi yang modern, responsif, dan skalabel, berikut adalah tumpukan teknologi yang diusulkan:

-   **Frontend (Sisi Klien):**
    -   **HTML5:** Untuk struktur konten aplikasi.
    -   **CSS3:** Untuk styling dan tampilan visual. Akan digunakan pendekatan modern seperti Flexbox dan Grid untuk layout.
    -   **JavaScript (ES6+):** Untuk membuat halaman menjadi interaktif, melakukan validasi form, dan berkomunikasi dengan backend.

-   **Backend (Sisi Server):**
    -   **Node.js:** Sebagai lingkungan runtime JavaScript di sisi server.
    -   **Express.js:** Kerangka kerja (framework) untuk Node.js yang akan digunakan untuk membangun API (Application Programming Interface) dengan cepat dan terstruktur. API ini akan menangani permintaan seperti pengiriman data absensi dan pengambilan data rekapitulasi.

-   **Database:**
    -   **MySQL:** Sistem manajemen database relasional yang akan digunakan untuk menyimpan semua data aplikasi. MySQL dipilih karena bersifat robust, populer, dan mampu menangani skala yang lebih besar di masa depan.

-   **Tools Pendukung:**
    -   **Nodemon:** Untuk me-restart server secara otomatis selama pengembangan backend.
    -   **Git & GitHub:** Untuk kontrol versi dan manajemen kode.

## 3. Fitur Aplikasi

Fitur akan dibagi menjadi dua peran utama: **Siswa** dan **Admin**.

### Fitur untuk Siswa:
1.  **Formulir Absensi (Menu Utama):**
    -   Input Nama Siswa, NIS, Kelas, dan Tempat PKL.
    -   Pilihan status: "Hadir" atau "Izin/Sakit".
    -   Tombol untuk mengirim data.
    -   Validasi input untuk memastikan semua data terisi.

### Fitur untuk Admin (Pengembangan Lanjutan):
1.  **Sistem Login:**
    -   Halaman login khusus untuk admin.
2.  **Dashboard:**
    -   Menampilkan ringkasan cepat data absensi hari ini.
    -   Grafik sederhana (misalnya, persentase kehadiran).
3.  **Manajemen Data Absensi (Menu Rekapitulasi):**
    -   Menampilkan seluruh data absensi dalam bentuk tabel.
    -   Fitur pencarian berdasarkan nama, NIS, atau tanggal.
    -   Fitur filter berdasarkan kelas, tempat PKL, atau status kehadiran.
4.  **Ekspor Data:**
    -   Fitur untuk mengunduh data absensi dalam format CSV atau Excel.

## 4. Struktur Menu dan Navigasi Aplikasi

-   `/` atau `/index.html`: Halaman utama yang berisi formulir absensi untuk siswa.
-   `/login`: Halaman login untuk admin.
-   `/admin/dashboard`: Halaman dashboard admin setelah berhasil login.
-   `/admin/rekap`: Halaman untuk melihat dan mengelola semua data absensi.

## 5. Alur Kerja Pengembangan (Langkah-langkah Coding)

1.  **Fase 1: Frontend Statis (Selesai)**
    -   Membuat struktur halaman dengan HTML.
    -   Memberikan gaya modern dengan CSS.

2.  **Fase 2: Backend dan Database Awal**
    -   Inisialisasi proyek Node.js (`npm init`).
    -   Install Express.js dan mysql.
    -   Membuat server Express sederhana.
    -   Merancang skema database untuk tabel `absensi`.
    -   Membuat endpoint API `POST /api/absensi` untuk menerima dan menyimpan data dari formulir.

3.  **Fase 3: Integrasi Frontend dan Backend**
    -   Mengubah `script.js` di frontend.
    -   Menggunakan `fetch()` API di JavaScript untuk mengirim data formulir ke endpoint backend yang telah dibuat.
    -   Menampilkan pesan sukses atau gagal dari server kepada pengguna, menggantikan `alert()` yang ada saat ini.

4.  **Fase 4: Pengembangan Fitur Admin**
    -   Membangun halaman dan rute untuk login dan dashboard.
    -   Membuat endpoint API `GET /api/absensi` untuk mengambil data rekapitulasi.
    -   Menampilkan data di halaman rekapitulasi admin.
    -   Mengimplementasikan fitur pencarian, filter, dan ekspor.