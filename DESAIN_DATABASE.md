# Desain Database Aplikasi Absensi

Dokumen ini merinci desain database yang akan digunakan untuk aplikasi absensi siswa PKL. Database ini dirancang untuk menjadi sederhana namun cukup untuk kebutuhan aplikasi di tahap awal.

## 1. Pilihan Sistem Database

-   **Sistem:** SQLite
-   **Alasan:**
    -   **Sederhana:** Tidak memerlukan server database terpisah, karena database disimpan dalam satu file (misalnya, `absensi.db`).
    -   **Cepat untuk Setup:** Sangat mudah diintegrasikan dengan Node.js tanpa perlu konfigurasi yang rumit.
    -   **Cukup untuk Proyek Awal:** Mampu menangani volume data yang diperkirakan untuk skala proyek ini.

## 2. Desain Tabel

Untuk tahap awal, kita hanya memerlukan satu tabel utama untuk menyimpan semua data absensi yang dikirim melalui formulir.

### Tabel: `absensi`

Tabel ini akan menjadi pusat penyimpanan data. Setiap kali seorang siswa mengisi formulir, satu baris (record) baru akan ditambahkan ke tabel ini.

| Nama Kolom        | Tipe Data         | Keterangan                                                                 |
| ----------------- | ----------------- | -------------------------------------------------------------------------- |
| `id`              | `INTEGER`         | **Primary Key**. Nomor unik untuk setiap entri absensi. Akan dibuat otomatis. |
| `nama`            | `TEXT`            | Nama lengkap siswa. Tidak boleh kosong (`NOT NULL`).                       |
| `nis`             | `TEXT`            | Nomor Induk Siswa. Tidak boleh kosong (`NOT NULL`).                        |
| `kelas`           | `TEXT`            | Kelas siswa. Tidak boleh kosong (`NOT NULL`).                              |
| `tempat_pkl`      | `TEXT`            | Lokasi PKL siswa. Tidak boleh kosong (`NOT NULL`).                         |
| `status`          | `TEXT`            | Status kehadiran. Hanya boleh berisi 'Hadir' atau 'Izin/Sakit'.            |
| `tanggal_absensi` | `DATETIME`        | Waktu dan tanggal saat absensi dikirim. Akan diisi otomatis oleh sistem.   |

### Contoh Data dalam Tabel `absensi`:

| id  | nama          | nis       | kelas      | tempat_pkl      | status      | tanggal_absensi         |
| --- | ------------- | --------- | ---------- | --------------- | ----------- | ----------------------- |
| 1   | Budi Santoso  | '12345'   | 'XII TKJ 1'| 'PT. Maju Jaya' | 'Hadir'     | '2023-10-27 08:00:15'   |
| 2   | Ani Lestari   | '67890'   | 'XII RPL 2'| 'Dinas Kominfo' | 'Izin/Sakit'| '2023-10-27 08:05:30'   |

## 3. Potensi Pengembangan di Masa Depan

Jika aplikasi berkembang, desain database ini dapat diperluas. Beberapa kemungkinan pengembangan:

-   **Tabel `siswa`:** Membuat tabel terpisah untuk data siswa (NIS, Nama, Kelas) untuk menghindari redundansi data. Tabel `absensi` kemudian hanya akan menyimpan `id_siswa` sebagai referensi (Foreign Key).
-   **Tabel `admin`:** Tabel untuk menyimpan data login para pembimbing atau guru.
-   **Tabel `lokasi_pkl`:** Tabel untuk mengelola daftar tempat PKL yang bekerja sama dengan sekolah.