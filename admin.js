document.addEventListener('DOMContentLoaded', () => {
    const formSiswa = document.getElementById('form-siswa');
    const tabelSiswaBody = document.getElementById('tabel-siswa-body');
    const loading = document.getElementById('loading');
    const btnBatal = document.getElementById('btn-batal');
    const formTitle = document.getElementById('form-title');
    const nisLamaInput = document.getElementById('nis-lama');

    const nisInput = document.getElementById('nis');
    const namaInput = document.getElementById('nama');
    const kelasInput = document.getElementById('kelas');
    const tempatPklInput = document.getElementById('tempat_pkl');

    let isEditMode = false;

    // Fungsi untuk mengambil dan menampilkan data siswa
    const fetchSiswa = async () => {
        loading.classList.remove('d-none');
        tabelSiswaBody.innerHTML = '';
        try {
            const response = await fetch('/api/siswa');
            const data = await response.json();

            if (data.length === 0) {
                tabelSiswaBody.innerHTML = '<tr><td colspan="5" class="text-center">Tidak ada data siswa.</td></tr>';
            } else {
                data.forEach(siswa => {
                    const row = `
                        <tr>
                            <td>${siswa.nis}</td>
                            <td>${siswa.nama}</td>
                            <td>${siswa.kelas}</td>
                            <td>${siswa.tempat_pkl}</td>
                            <td>
                                <button class="btn btn-sm btn-warning btn-edit" data-nis="${siswa.nis}">Edit</button>
                                <button class="btn btn-sm btn-danger btn-hapus" data-nis="${siswa.nis}">Hapus</button>
                            </td>
                        </tr>
                    `;
                    tabelSiswaBody.innerHTML += row;
                });
            }
        } catch (error) {
            console.error('Error fetching siswa:', error);
            tabelSiswaBody.innerHTML = '<tr><td colspan="5" class="text-center">Gagal memuat data.</td></tr>';
        } finally {
            loading.classList.add('d-none');
        }
    };

    // Fungsi untuk mereset form
    const resetForm = () => {
        formSiswa.reset();
        isEditMode = false;
        nisLamaInput.value = '';
        nisInput.readOnly = false;
        formTitle.textContent = 'Tambah Siswa Baru';
        btnBatal.classList.add('d-none');
    };

    // Event listener untuk form submit (tambah/edit)
    formSiswa.addEventListener('submit', async (e) => {
        e.preventDefault();
        const nis = nisInput.value;
        const nama = namaInput.value;
        const kelas = kelasInput.value;
        const tempat_pkl = tempatPklInput.value;

        const url = isEditMode ? `/api/siswa/${nisLamaInput.value}` : '/api/siswa';
        const method = isEditMode ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ nis, nama, kelas, tempat_pkl })
            });

            const result = await response.json();

            if (response.ok) {
                alert(result.message);
                resetForm();
                fetchSiswa();
            } else {
                alert(`Error: ${result.message}`);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Terjadi kesalahan pada server.');
        }
    });

    // Event listener untuk tombol batal
    btnBatal.addEventListener('click', () => {
        resetForm();
    });

    // Event delegation untuk tombol edit dan hapus
    tabelSiswaBody.addEventListener('click', async (e) => {
        const target = e.target;
        const nis = target.dataset.nis;

        // Tombol Edit
        if (target.classList.contains('btn-edit')) {
            try {
                const response = await fetch(`/api/siswa/${nis}`);
                const siswa = await response.json();

                nisInput.value = siswa.nis;
                namaInput.value = siswa.nama;
                kelasInput.value = siswa.kelas;
                tempatPklInput.value = siswa.tempat_pkl;

                isEditMode = true;
                nisLamaInput.value = siswa.nis;
                nisInput.readOnly = true; // NIS tidak bisa diubah saat edit
                formTitle.textContent = 'Edit Data Siswa';
                btnBatal.classList.remove('d-none');
                window.scrollTo(0, 0); // Scroll ke atas untuk melihat form
            } catch (error) {
                console.error('Error fetching siswa for edit:', error);
                alert('Gagal mengambil data siswa untuk diedit.');
            }
        }

        // Tombol Hapus
        if (target.classList.contains('btn-hapus')) {
            if (confirm(`Apakah Anda yakin ingin menghapus siswa dengan NIS ${nis}?`)) {
                try {
                    const response = await fetch(`/api/siswa/${nis}`, {
                        method: 'DELETE'
                    });
                    const result = await response.json();

                    if (response.ok) {
                        alert(result.message);
                        fetchSiswa();
                    } else {
                        alert(`Error: ${result.message}`);
                    }
                } catch (error) {
                    console.error('Error deleting siswa:', error);
                    alert('Terjadi kesalahan pada server.');
                }
            }
        }
    });

    // Muat data siswa saat halaman pertama kali dimuat
    fetchSiswa();
});