document.addEventListener('DOMContentLoaded', () => {
    const historyTableBody = document.getElementById('historyTableBody');
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    const resetFilterBtn = document.getElementById('resetFilterBtn');

    let allData = [];
    let currentFilteredData = []; // Menyimpan data yang sedang ditampilkan

    const populatePklFilter = (data) => {
        const pklLocations = [...new Set(data.map(item => item.tempat_pkl).filter(Boolean))];
        pklLocations.sort();
        pklFilter.innerHTML = '<option value="">Semua Tempat PKL</option>'; // Reset
        pklLocations.forEach(location => {
            const option = document.createElement('option');
            option.value = location;
            option.textContent = location;
            pklFilter.appendChild(option);
        });
    };

    const fetchData = async () => {
        try {
            loadingIndicator.style.display = 'block';
            historyTableBody.innerHTML = '';

            const response = await fetch('/api/absensi');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            allData = await response.json();
            // Konversi tanggal dari string YYYY-MM-DD ke objek Date untuk perbandingan
            allData.forEach(item => {
                item.tanggalObj = new Date(item.tanggal);
            });

            populatePklFilter(allData);
            applyFilters(); // Terapkan filter awal (tampilkan semua)
        } catch (error) {
            console.error('Error fetching data:', error);
            historyTableBody.innerHTML = `<tr><td colspan="9" class="text-center">Gagal memuat data. Silakan coba lagi nanti.</td></tr>`;
        } finally {
            loadingIndicator.style.display = 'none';
        }
    };

    const renderData = (data) => {
        currentFilteredData = data; // Simpan data yang difilter
        historyTableBody.innerHTML = '';
        if (data.length === 0) {
            historyTableBody.innerHTML = `<tr><td colspan="9" class="text-center">Tidak ada data yang cocok dengan filter Anda.</td></tr>`;
            return;
        }

        data.forEach(item => {
            const row = document.createElement('tr');
            // Format tanggal dan waktu tetap menggunakan data asli untuk tampilan
            const jamMasukDisplay = item.jam_masuk ? new Date(`${item.tanggal}T${item.jam_masuk}`).toLocaleString('id-ID') : '-';
            const jamPulangDisplay = item.jam_pulang ? new Date(`${item.tanggal}T${item.jam_pulang}`).toLocaleString('id-ID') : '-';

            row.innerHTML = `
                <td>${item.id}</td>
                <td>${item.nis || '-'}</td>
                <td>${item.nama || '-'}</td>
                <td>${item.kelas || '-'}</td>
                <td>${item.tempat_pkl || '-'}</td>
                <td>${jamMasukDisplay}</td>
                <td>${jamPulangDisplay}</td>
                <td>${item.status_kehadiran || '-'}</td>
                <td>${item.keterangan || '-'}</td>
            `;
            historyTableBody.appendChild(row);
        });
    };

    const applyFilters = () => {
        const searchTerm = (searchInput.value || '').toLowerCase();
        const selectedPkl = pklFilter.value;
        const startDate = startDateInput.value ? new Date(startDateInput.value) : null;
        const endDate = endDateInput.value ? new Date(endDateInput.value) : null;

        // Set waktu ke awal hari untuk startDate dan akhir hari untuk endDate
        if (startDate) startDate.setHours(0, 0, 0, 0);
        if (endDate) endDate.setHours(23, 59, 59, 999);

        const filteredData = allData.filter(item => {
            const nama = (item.nama || '').toLowerCase();
            const nis = (item.nis || '').toString().toLowerCase();
            const tempatPkl = (item.tempat_pkl || '');
            const itemDate = item.tanggalObj;

            const matchesSearch = nama.includes(searchTerm) || nis.includes(searchTerm);
            const matchesPkl = !selectedPkl || tempatPkl === selectedPkl;
            const matchesDate = (!startDate || itemDate >= startDate) && (!endDate || itemDate <= endDate);

            return matchesSearch && matchesPkl && matchesDate;
        });

        renderData(filteredData);
    };

    const resetFilters = () => {
        searchInput.value = '';
        pklFilter.value = '';
        startDateInput.value = '';
        endDateInput.value = '';
        applyFilters();
    };

    const exportToCsv = () => {
        const headers = ['ID', 'NIS', 'Nama', 'Kelas', 'Tempat PKL', 'Tanggal', 'Waktu Masuk', 'Waktu Pulang', 'Status', 'Keterangan'];
        const rows = currentFilteredData.map(item => [
            item.id,
            item.nis,
            item.nama,
            item.kelas,
            item.tempat_pkl,
            item.tanggal ? new Date(item.tanggal).toLocaleDateString('id-ID') : '-',
            item.jam_masuk || '-',
            item.jam_pulang || '-',
            item.status_kehadiran,
            item.keterangan || ''
        ].map(val => `"${String(val).replace(/"/g, '""' )}"`)); // Escape double quotes

        const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'riwayat_absensi.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (searchInput) {
        searchInput.addEventListener('input', applyFilters);
    }

    if (pklFilter) {
        pklFilter.addEventListener('change', applyFilters);
    }

    if (startDateInput) {
        startDateInput.addEventListener('change', applyFilters);
    }

    if (endDateInput) {
        endDateInput.addEventListener('change', applyFilters);
    }

    if (resetFilterBtn) {
        resetFilterBtn.addEventListener('click', resetFilters);
    }

    if (exportBtn) {
        exportBtn.addEventListener('click', exportToCsv);
    }

    // Initial data fetch
    fetchData();
});