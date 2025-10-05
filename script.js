document.addEventListener('DOMContentLoaded', () => {
    // Kontainer utama
    const actionChoiceContainer = document.getElementById('action-choice');
    const masukFormContainer = document.getElementById('masuk-form-container');
    const pulangFormContainer = document.getElementById('pulang-form-container');

    // Tombol utama
    const showMasukFormBtn = document.getElementById('show-masuk-form-btn');
    const showPulangFormBtn = document.getElementById('show-pulang-form-btn');

    // Forms
    const attendanceForm = document.getElementById('attendance-form');
    const pulangForm = document.getElementById('pulang-form');

    // Tombol "Kembali"
    const backButtons = document.querySelectorAll('.back-btn');

    // Fungsi untuk kembali ke menu utama
    const goBack = () => {
        masukFormContainer.style.display = 'none';
        pulangFormContainer.style.display = 'none';
        actionChoiceContainer.style.display = 'block';
        attendanceForm.reset();
        pulangForm.reset();
    };

    // Event listener untuk tombol "Absen Masuk"
    showMasukFormBtn.addEventListener('click', () => {
        actionChoiceContainer.style.display = 'none';
        masukFormContainer.style.display = 'block';
    });

    // Event listener untuk tombol "Absen Pulang"
    showPulangFormBtn.addEventListener('click', () => {
        actionChoiceContainer.style.display = 'none';
        pulangFormContainer.style.display = 'block';
    });

    // Event listener untuk semua tombol "Kembali"
    backButtons.forEach(button => {
        button.addEventListener('click', goBack);
    });

    // Event listener untuk form absensi MASUK
    attendanceForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(attendanceForm);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('/api/absensi', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            alert(result.message);
            if (response.ok) {
                goBack();
            }
        } catch (error) {
            console.error('Error saat mengirim absensi masuk:', error);
            alert('Gagal terhubung ke server.');
        }
    });

    // Event listener untuk form absensi PULANG
    pulangForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(pulangForm);
        const data = Object.fromEntries(formData.entries());

        if (!data.nis) {
            alert('NIS tidak boleh kosong.');
            return;
        }

        if (!confirm('Apakah Anda yakin ingin melakukan absensi pulang sekarang?')) {
            return;
        }

        try {
            const response = await fetch('/api/absensi/pulang', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nis: data.nis })
            });
            const result = await response.json();
            alert(result.message);
            if (response.ok) {
                goBack();
            }
        } catch (error) {
            console.error('Error saat absensi pulang:', error);
            alert('Gagal terhubung ke server.');
        }
    });
});