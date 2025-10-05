require('dotenv').config(); // Memuat variabel dari file .env

module.exports = {
    adminPassword: process.env.ADMIN_PASSWORD || 'ini_admin39', // Ganti dengan kata sandi yang kuat di lingkungan produksi
    sessionSecret: process.env.SESSION_SECRET || 'secret-key-super-rahasia' // Ganti dengan kunci rahasia yang kompleks
};