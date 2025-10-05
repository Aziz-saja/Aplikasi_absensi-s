const mysql = require('mysql2');
require('dotenv').config();

// Opsi koneksi default untuk lingkungan lokal
const localConnectionOptions = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'absensi_db',
  timezone: '+07:00',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Gunakan DATABASE_URL dari environment variable jika ada (untuk Render)
// Jika tidak, gunakan opsi koneksi lokal
const connectionConfig = process.env.DATABASE_URL ? { uri: process.env.DATABASE_URL } : localConnectionOptions;

// Tambahkan opsi SSL khusus untuk produksi jika menggunakan DATABASE_URL
if (connectionConfig.uri) {
  connectionConfig.ssl = {
    // Render mungkin memerlukan ini untuk menolak koneksi yang tidak terenkripsi
    rejectUnauthorized: true 
  };
}

// Buat pool koneksi
const dbConnection = mysql.createPool(connectionConfig);

// Ekspor koneksi agar bisa digunakan di file lain
module.exports = dbConnection.promise();