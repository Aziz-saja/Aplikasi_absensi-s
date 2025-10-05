const express = require('express');
const router = express.Router();

// Variabel untuk menampung dependensi dari server.js
let db, handleError;

/**
 * Mengatur dependensi (koneksi database dan error handler) yang diterima dari server.js
 * @param {object} database - Koneksi database promise-based dari mysql2
 * @param {function} errorHandler - Fungsi untuk menangani error
 */
function setDependencies(database, errorHandler) {
    db = database;
    handleError = errorHandler;
}

// Endpoint untuk mengambil semua siswa
router.get('/siswa', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM siswa ORDER BY nama');
        res.json(rows);
    } catch (err) {
        handleError(res, err, 'Gagal mengambil data siswa.');
    }
});

// Endpoint untuk mengambil satu siswa berdasarkan NIS
router.get('/siswa/:nis', async (req, res) => {
    try {
        const { nis } = req.params;
        const [rows] = await db.execute('SELECT * FROM siswa WHERE nis = ?', [nis]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Siswa tidak ditemukan.' });
        }
        res.json(rows[0]);
    } catch (err) {
        handleError(res, err, 'Gagal mengambil data siswa.');
    }
});

// Endpoint untuk menambah siswa baru
router.post('/siswa', async (req, res) => {
    try {
        const { nis, nama, kelas, tempat_pkl } = req.body;
        if (!nis || !nama || !kelas || !tempat_pkl) {
            return res.status(400).json({ message: 'Semua field harus diisi.' });
        }
        const [result] = await db.execute(
            'INSERT INTO siswa (nis, nama, kelas, tempat_pkl) VALUES (?, ?, ?, ?)',
            [nis, nama, kelas, tempat_pkl]
        );
        res.status(201).json({ message: 'Siswa berhasil ditambahkan.', id: result.insertId });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            res.status(409).json({ message: 'NIS sudah terdaftar.' });
        } else {
            handleError(res, err, 'Gagal menambah siswa.');
        }
    }
});

// Endpoint untuk mengupdate data siswa
router.put('/siswa/:nis', async (req, res) => {
    try {
        const { nis: nisLama } = req.params;
        const { nis, nama, kelas, tempat_pkl } = req.body;

        if (!nis || !nama || !kelas || !tempat_pkl) {
            return res.status(400).json({ message: 'Semua field harus diisi.' });
        }

        const [result] = await db.execute(
            'UPDATE siswa SET nis = ?, nama = ?, kelas = ?, tempat_pkl = ? WHERE nis = ?',
            [nis, nama, kelas, tempat_pkl, nisLama]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Siswa tidak ditemukan.' });
        }
        res.json({ message: 'Data siswa berhasil diperbarui.' });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            res.status(409).json({ message: 'NIS baru sudah digunakan oleh siswa lain.' });
        } else {
            handleError(res, err, 'Gagal mengupdate data siswa.');
        }
    }
});

// Endpoint untuk menghapus siswa
router.delete('/siswa/:nis', async (req, res) => {
    try {
        const { nis } = req.params;
        const [result] = await db.execute('DELETE FROM siswa WHERE nis = ?', [nis]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Siswa tidak ditemukan.' });
        }
        res.json({ message: 'Siswa berhasil dihapus.' });
    } catch (err) {
        handleError(res, err, 'Gagal menghapus siswa.');
    }
});

module.exports = { router, setDependencies };