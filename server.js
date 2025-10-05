const express = require('express');
const path = require('path');
const session = require('express-session');
const db = require('./db');
const adminRoutes = require('./adminRoutes');
const config = require('./config');

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Konfigurasi session
app.use(session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Atur ke true jika menggunakan HTTPS
}));

// Middleware untuk memeriksa status login
const requireLogin = (req, res, next) => {
    if (req.session && req.session.isAdmin) {
        return next();
    } else {
        res.redirect('/login.html');
    }
};

// Helper untuk error handling
const handleError = (res, err, customMessage = 'Terjadi kesalahan pada server.') => {
    console.error(err);
    res.status(500).json({ message: customMessage, error: err.message });
};

// Mengatur dependensi untuk rute admin
adminRoutes.setDependencies(db, handleError);

// --- Rute Autentikasi ---
app.post('/login', (req, res) => {
    const { password } = req.body;
    if (password === config.adminPassword) {
        req.session.isAdmin = true;
        res.redirect('/admin.html');
    } else {
        res.send('Password salah. <a href="/login.html">Coba lagi</a>');
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/admin.html');
        }
        res.clearCookie('connect.sid');
        res.redirect('/login.html');
    });
});

// --- Rute API Publik (Absensi) ---
// Didefinisikan sebelum rute API yang dilindungi
app.get('/api/absensi', async (req, res) => {
    try {
        const query = `
            SELECT a.id, s.nis, s.nama, s.kelas, s.tempat_pkl, a.status_kehadiran, a.keterangan, 
                   DATE_FORMAT(a.tanggal, '%Y-%m-%d') as tanggal, a.jam_masuk, a.jam_pulang
            FROM absensi a
            JOIN siswa s ON a.nis = s.nis
            ORDER BY a.tanggal DESC, a.jam_masuk DESC
        `;
        const [rows] = await db.execute(query);
        res.json(rows);
    } catch (err) {
        handleError(res, err, 'Gagal mengambil data absensi.');
    }
});

app.post('/api/absensi', async (req, res) => {
    try {
        const { nis, status_kehadiran, keterangan } = req.body;
        if (!nis || !status_kehadiran) {
            return res.status(400).json({ message: 'NIS dan Status Kehadiran wajib diisi.' });
        }
        const [siswa] = await db.execute('SELECT nis FROM siswa WHERE nis = ?', [nis]);
        if (siswa.length === 0) {
            return res.status(404).json({ message: `Siswa dengan NIS ${nis} tidak ditemukan.` });
        }
        const today = new Date().toISOString().slice(0, 10);
        if (status_kehadiran === 'Hadir') {
            const [existing] = await db.execute(
                'SELECT id FROM absensi WHERE nis = ? AND tanggal = ? AND status_kehadiran = \'Hadir\' AND jam_pulang IS NULL',
                [nis, today]
            );
            if (existing.length > 0) {
                return res.status(409).json({ message: 'Anda sudah tercatat hadir hari ini. Silakan lakukan absensi pulang.' });
            }
        }
        const keteranganUntukDb = (keterangan && keterangan.trim()) ? keterangan.trim() : null;
        const now = new Date();
        const jamMasuk = status_kehadiran === 'Hadir' ? now.toTimeString().slice(0, 8) : null;
        const query = `
            INSERT INTO absensi (nis, tanggal, jam_masuk, status_kehadiran, keterangan)
            VALUES (?, ?, ?, ?, ?)
        `;
        const [result] = await db.execute(query, [nis, today, jamMasuk, status_kehadiran, keteranganUntukDb]);
        res.status(201).json({ message: 'Absensi berhasil dikirim!', insertId: result.insertId });
    } catch (err) {
        handleError(res, err, 'Gagal menyimpan data absensi.');
    }
});

app.put('/api/absensi/pulang', async (req, res) => {
    try {
        const { nis } = req.body;
        if (!nis) {
            return res.status(400).json({ message: 'NIS wajib diisi.' });
        }
        const today = new Date().toISOString().slice(0, 10);
        const [absensiMasuk] = await db.execute(
            'SELECT id FROM absensi WHERE nis = ? AND tanggal = ? AND status_kehadiran = \'Hadir\' AND jam_pulang IS NULL',
            [nis, today]
        );
        if (absensiMasuk.length === 0) {
            return res.status(404).json({ message: 'Tidak ditemukan data absensi masuk untuk hari ini. Silakan absen masuk terlebih dahulu.' });
        }
        const jamPulang = new Date().toTimeString().slice(0, 8);
        const query = `UPDATE absensi SET jam_pulang = ? WHERE id = ?`;
        const [result] = await db.execute(query, [jamPulang, absensiMasuk[0].id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Gagal memperbarui data absensi pulang.' });
        }
        res.json({ message: 'Absensi pulang berhasil dicatat!' });
    } catch (err) {
        handleError(res, err, 'Gagal menyimpan absensi pulang.');
    }
});


// --- Rute Terlindungi (Admin) ---

// Lindungi rute API admin
app.use('/api', requireLogin, adminRoutes.router);

// Lindungi halaman admin.html
// HARUS didefinisikan SEBELUM app.use(express.static)
app.get('/admin.html', requireLogin, (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});


// --- Middleware untuk File Statis ---
// Harus diletakkan di akhir agar tidak menimpa rute lain
app.use(express.static(path.join(__dirname)));


app.listen(port, '0.0.0.0', () => {
    console.log(`Server berjalan di port ${port}`);
});