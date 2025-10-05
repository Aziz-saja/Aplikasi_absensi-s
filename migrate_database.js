
const db = require('./db');

async function migrateDatabase() {
    let connection;
    try {
        // Dapatkan koneksi dari pool
        connection = await db.getConnection();
        console.log('Berhasil terhubung ke database.');

        // Hapus tabel lama jika ada (opsional, untuk memastikan skema bersih)
        console.log('Menghapus tabel `absensi` dan `siswa` lama (jika ada)...');
        await connection.execute('DROP TABLE IF EXISTS absensi');
        await connection.execute('DROP TABLE IF EXISTS siswa');
        console.log('Tabel lama berhasil dihapus.');

        // 1. Buat tabel `siswa`
        console.log('Membuat tabel `siswa`...');
        await connection.execute(`
            CREATE TABLE siswa (
                nis VARCHAR(20) PRIMARY KEY,
                nama VARCHAR(100) NOT NULL,
                kelas VARCHAR(50) NOT NULL,
                tempat_pkl VARCHAR(100)
            )
        `);
        console.log('Tabel `siswa` berhasil dibuat.');

        // 2. Isi tabel `siswa` dengan data contoh
        console.log('Menambahkan data contoh ke tabel `siswa`...');
        const siswaData = [
            ['12345', 'Budi Santoso', 'XII TKJ 1', 'PT. Maju Jaya'],
            ['67890', 'Ani Lestari', 'XII RPL 2', 'Dinas Kominfo'],
            ['11223', 'Citra Dewi', 'XII MM 1', 'Studio Kreatif'],
        ];
        await connection.query(
            'INSERT INTO siswa (nis, nama, kelas, tempat_pkl) VALUES ?',
            [siswaData]
        );
        console.log('Data contoh berhasil ditambahkan ke tabel `siswa`.');

        // 3. Buat tabel `absensi` baru
        console.log('Membuat tabel `absensi` baru...');
        await connection.execute(`
            CREATE TABLE absensi (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nis VARCHAR(20) NOT NULL,
                tanggal DATE NOT NULL,
                jam_masuk TIME,
                jam_pulang TIME,
                status_kehadiran ENUM('Hadir', 'Izin', 'Sakit') NOT NULL,
                keterangan TEXT,
                FOREIGN KEY (nis) REFERENCES siswa(nis) ON DELETE CASCADE
            )
        `);
        console.log('Tabel `absensi` baru berhasil dibuat.');

        console.log('\nMigrasi database selesai dengan sukses!');
        console.log('Struktur database Anda sekarang sudah sesuai dengan kode aplikasi.');

    } catch (error) {
        console.error('Terjadi error selama migrasi database:', error);
    } finally {
        // Kembalikan koneksi ke pool
        if (connection) {
            console.log('Menutup koneksi database.');
            connection.release();
        }
        // Tutup pool koneksi agar proses bisa berhenti
        db.end();
    }
}

// Jalankan fungsi migrasi
migrateDatabase();