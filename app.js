/**
 * ==============================================================================
 * APLIKASI UTAMA PORTAL DIGITAL RT 04 (app.js)
 * ==============================================================================
 * Desain: Civic Editorial & Fungsional (Tanpa AI-slop / gradien berlebihan)
 * Fitur:
 * 1. User Biasa (Warga): Akses langsung tanpa login (Read-Only).
 * 2. Admin Pengurus: Login dengan username & password (admin / adminrt04).
 * 3. Sistem CRUD Lengkap:
 *    - Transaksi Kas RT (Create, Read, Update, Delete)
 *    - Papan Pengumuman & Agenda (Create, Read, Update, Delete)
 *    - Jadwal Siskamling / Ronda (Update anggota & koordinator)
 * 4. LocalStorage Persistence: Perubahan admin langsung aktif di browser.
 * 5. Sinkronisasi data.js: Ekspor/unduh 1-klik untuk di-push ke GitHub Pages.
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  if (!window.RT_DATA) {
    console.error("Gagal memuat RT_DATA dari data.js");
    return;
  }

  // ----------------------------------------------------------------------------
  // STATE MANAGEMENT & LOCAL STORAGE PERSISTENCE
  // ----------------------------------------------------------------------------
  const STORAGE_KEY = 'RT04_DATA_OVERRIDE';
  const AUTH_KEY = 'RT04_ADMIN_AUTH';

  const loadData = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return Object.assign({}, window.RT_DATA, parsed);
      }
    } catch (e) {
      console.warn("Gagal membaca LocalStorage, menggunakan data bawaan data.js", e);
    }
    return JSON.parse(JSON.stringify(window.RT_DATA));
  };

  let currentData = loadData();
  let chartInstance = null;

  const saveData = (newData) => {
    currentData = newData;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentData));
    } catch (e) {
      console.error("Gagal menyimpan ke LocalStorage", e);
    }
    renderAll();
  };

  const resetData = () => {
    if (confirm("Kembalikan seluruh data ke konfigurasi awal data.js? Perubahan lokal akan dihapus.")) {
      localStorage.removeItem(STORAGE_KEY);
      currentData = JSON.parse(JSON.stringify(window.RT_DATA));
      renderAll();
      showToast("Data dikembalikan ke konfigurasi awal.", "info");
    }
  };

  // ----------------------------------------------------------------------------
  // AUTHENTICATION STATE (WARGA BIASA VS ADMIN)
  // ----------------------------------------------------------------------------
  const isAdminLoggedIn = () => {
    return sessionStorage.getItem(AUTH_KEY) === 'true';
  };

  const setAdminAuth = (isLoggedIn) => {
    if (isLoggedIn) {
      sessionStorage.setItem(AUTH_KEY, 'true');
    } else {
      sessionStorage.removeItem(AUTH_KEY);
    }
    updateAuthUI();
    renderAll();
  };

  const updateAuthUI = () => {
    const isAuth = isAdminLoggedIn();
    const btnOpenLogin = document.getElementById('btn-open-login');
    const topbarAdminPill = document.getElementById('topbar-admin-pill');
    const adminToolbar = document.getElementById('admin-toolbar');
    const mobileLoginText = document.getElementById('mobile-login-text');
    const adminOnlyEls = document.querySelectorAll('.admin-only');

    if (btnOpenLogin) {
      btnOpenLogin.classList.toggle('hidden', isAuth);
    }

    if (topbarAdminPill) {
      topbarAdminPill.classList.toggle('hidden', !isAuth);
      topbarAdminPill.classList.toggle('inline-flex', isAuth);
    }

    if (adminToolbar) {
      adminToolbar.classList.toggle('hidden', !isAuth);
    }

    if (mobileLoginText) {
      mobileLoginText.textContent = isAuth ? 'Keluar Mode Pengurus' : 'Login Pengurus RT';
    }

    adminOnlyEls.forEach(el => {
      el.classList.toggle('hidden', !isAuth);
    });

    refreshIcons();
  };

  // ----------------------------------------------------------------------------
  // TOAST NOTIFICATIONS
  // ----------------------------------------------------------------------------
  const showToast = (message, type = 'success') => {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    const bgColor = type === 'success' ? 'bg-slate-900 border-emerald-600' : type === 'danger' ? 'bg-rose-950 border-rose-600' : 'bg-slate-900 border-slate-700';

    toast.className = `flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-white text-xs font-semibold shadow-lg border ${bgColor} transition-all duration-200 transform translate-y-1 opacity-0 pointer-events-auto max-w-sm`;
    toast.innerHTML = `
      <i data-lucide="${type === 'success' ? 'check' : type === 'danger' ? 'alert-circle' : 'info'}" class="w-4 h-4 shrink-0 text-white"></i>
      <span class="flex-1 leading-snug">${message}</span>
    `;

    container.appendChild(toast);
    refreshIcons();

    setTimeout(() => {
      toast.classList.remove('translate-y-1', 'opacity-0');
    }, 10);

    setTimeout(() => {
      toast.classList.add('opacity-0', 'translate-x-3');
      setTimeout(() => toast.remove(), 250);
    }, 3200);
  };

  // ----------------------------------------------------------------------------
  // HELPER UTILITIES
  // ----------------------------------------------------------------------------
  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(number);
  };

  const getIndonesianDayName = (date = new Date()) => {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    return days[date.getDay()];
  };

  const refreshIcons = () => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  };

  // ----------------------------------------------------------------------------
  // 1. IDENTITAS & STATISTIK RESMI
  // ----------------------------------------------------------------------------
  const initIdentityAndHero = () => {
    const { info, statistik } = currentData;

    document.title = `Portal Resmi ${info.namaRT} / ${info.namaRW} Kelurahan ${info.kelurahan}`;

    const topbarInfo = document.getElementById('topbar-info');
    if (topbarInfo) {
      topbarInfo.textContent = `Rukun Tetangga 04 • Rukun Warga 03 • Kelurahan ${info.kelurahan} • ${info.kota}`;
    }

    const topbarWaLink = document.getElementById('topbar-wa-link');
    if (topbarWaLink && info.linkGrupWargaWA) {
      topbarWaLink.href = info.linkGrupWargaWA;
    }

    const navTitle = document.getElementById('nav-rt-title');
    const navSub = document.getElementById('nav-rt-sub');
    if (navTitle) navTitle.textContent = `${info.namaRT} / ${info.namaRW}`;
    if (navSub) navSub.textContent = `Kelurahan ${info.kelurahan}, Kecamatan ${info.kecamatan}, ${info.kota} ${info.kodePos || ''}`;

    const heroTitle = document.getElementById('hero-title');
    const heroDesc = document.getElementById('hero-desc');
    const heroPill = document.getElementById('hero-pill');

    if (heroTitle) {
      heroTitle.textContent = `Pusat Informasi & Pelayanan Digital Warga ${info.namaRT} Sukamaju`;
    }
    if (heroDesc) heroDesc.textContent = info.deskripsi;
    if (heroPill) heroPill.textContent = `Portal Resmi Lingkungan ${info.namaRT} / ${info.namaRW}`;

    const statKK = document.getElementById('stat-kk');
    const statWarga = document.getElementById('stat-warga');
    const statWargaSub = document.getElementById('stat-warga-sub');
    const statAgendaJudul = document.getElementById('stat-agenda-judul');
    const statAgendaTgl = document.getElementById('stat-agenda-tgl');

    if (statKK) statKK.textContent = statistik.totalKK;
    if (statWarga) statWarga.textContent = statistik.totalWarga;
    if (statWargaSub) statWargaSub.textContent = `${statistik.totalPria} Pria • ${statistik.totalWanita} Wanita`;
    if (statAgendaJudul) statAgendaJudul.textContent = statistik.agendaTerdekat;
    if (statAgendaTgl) statAgendaTgl.textContent = `${statistik.agendaTanggal} (${statistik.agendaWaktu || 'Pagi'})`;

    const footerTitle = document.getElementById('footer-rt-title');
    const footerSub = document.getElementById('footer-rt-sub');
    const footerDesc = document.getElementById('footer-rt-desc');
    const footerAlamat = document.getElementById('footer-alamat');
    const footerJam = document.getElementById('footer-jam');
    const footerEmail = document.getElementById('footer-email');
    const footerCopy = document.getElementById('footer-copy-name');
    const footerWaBtn = document.getElementById('footer-wa-btn');
    const footerMapsBtn = document.getElementById('footer-maps-btn');

    if (footerTitle) footerTitle.textContent = `${info.namaRT} / ${info.namaRW}`;
    if (footerSub) footerSub.textContent = `Kel. ${info.kelurahan}, Kec. ${info.kecamatan}, ${info.kota}`;
    if (footerDesc) footerDesc.textContent = info.deskripsi;
    if (footerAlamat) footerAlamat.textContent = info.alamatSekretariat;
    if (footerJam) footerJam.textContent = info.jamPelayanan;
    if (footerEmail) footerEmail.textContent = info.email;
    if (footerCopy) footerCopy.textContent = `Rukun Tetangga 04 / RW 03 Kelurahan ${info.kelurahan}`;
    if (footerWaBtn && info.linkGrupWargaWA) footerWaBtn.href = info.linkGrupWargaWA;
    if (footerMapsBtn && info.linkGoogleMaps) footerMapsBtn.href = info.linkGoogleMaps;

    const copyrightYear = document.getElementById('copyright-year');
    if (copyrightYear) copyrightYear.textContent = new Date().getFullYear();
  };

  // ----------------------------------------------------------------------------
  // 2. PROFIL & STRUKTUR PENGURUS
  // ----------------------------------------------------------------------------
  const initProfilAndPengurus = () => {
    const { visiMisi, pengurus } = currentData;

    const visiEl = document.getElementById('profil-visi');
    if (visiEl) visiEl.textContent = `"${visiMisi.visi}"`;

    const misiListEl = document.getElementById('profil-misi-list');
    if (misiListEl) {
      misiListEl.innerHTML = visiMisi.misi.map((m, idx) => `
        <li class="flex items-start gap-2.5">
          <span class="w-5 h-5 rounded bg-slate-100 text-slate-800 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5 border border-slate-200">
            ${idx + 1}
          </span>
          <p class="text-xs sm:text-sm text-slate-700 leading-relaxed">${m}</p>
        </li>
      `).join('');
    }

    const pengurusGrid = document.getElementById('pengurus-grid');
    if (pengurusGrid) {
      pengurusGrid.innerHTML = pengurus.map(p => {
        const waText = encodeURIComponent(`Halo ${p.nama} (${p.jabatan}), perkenalkan saya warga RT 04.`);
        return `
          <div class="civic-card p-5 flex flex-col justify-between">
            <div>
              <div class="flex items-start justify-between gap-3 mb-3">
                <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200">
                  ${p.jabatan}
                </span>
                <span class="text-[10px] font-mono text-slate-400">${p.periode}</span>
              </div>
              <h4 class="font-bold text-slate-900 text-sm mb-1">${p.nama}</h4>
              <p class="text-xs text-slate-600 mb-4 leading-relaxed bg-slate-50 p-2.5 rounded border border-slate-100">
                ${p.tugasUtama}
              </p>
            </div>
            
            <a href="https://wa.me/${p.whatsapp}?text=${waText}" target="_blank" rel="noopener" class="w-full inline-flex items-center justify-center gap-2 py-2 px-3 bg-white hover:bg-slate-900 text-slate-700 hover:text-white rounded-md text-xs font-semibold border border-slate-300 transition-colors">
              <i data-lucide="message-square" class="w-3.5 h-3.5"></i> Hubungi via WhatsApp
            </a>
          </div>
        `;
      }).join('');
    }
  };

  // ----------------------------------------------------------------------------
  // 3. TRANSPARANSI BUKU KAS UMUM & CHART.JS
  // ----------------------------------------------------------------------------
  const initTransparansiKas = () => {
    const { keuangan } = currentData;
    const filterSelect = document.getElementById('kas-filter-bulan');
    const searchInput = document.getElementById('kas-search-input');
    const tableBody = document.getElementById('kas-table-body');
    const emptyState = document.getElementById('kas-empty-state');
    const countInfo = document.getElementById('kas-count-info');
    const btnExport = document.getElementById('btn-export-csv');
    const btnTambahKas = document.getElementById('btn-tambah-kas');
    const toolbarBtnTambahKas = document.getElementById('toolbar-btn-tambah-kas');
    const modalKasForm = document.getElementById('modal-kas-form');
    const modalKasClose = document.getElementById('modal-kas-close');
    const btnCancelKas = document.getElementById('btn-cancel-kas');
    const formTrxKas = document.getElementById('form-trx-kas');

    if (filterSelect) {
      const prevVal = filterSelect.value;
      const months = Array.from(new Set(keuangan.transaksi.map(t => t.bulan))).sort().reverse();
      filterSelect.innerHTML = `<option value="all">Semua Periode</option>` +
        months.map(m => {
          const [year, month] = m.split('-');
          const monthName = new Date(year, parseInt(month) - 1, 1).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
          return `<option value="${m}">${monthName}</option>`;
        }).join('');
      
      if (prevVal && (months.includes(prevVal) || prevVal === 'all')) {
        filterSelect.value = prevVal;
      } else if (months.length > 0) {
        filterSelect.value = months[0];
      }
    }

    const renderKas = () => {
      const isAuth = isAdminLoggedIn();
      const selectedMonth = filterSelect ? filterSelect.value : 'all';
      const searchQuery = (searchInput ? searchInput.value : '').toLowerCase().trim();

      const filtered = keuangan.transaksi.filter(trx => {
        const matchMonth = (selectedMonth === 'all') || (trx.bulan === selectedMonth);
        const matchSearch = trx.keterangan.toLowerCase().includes(searchQuery) ||
                            trx.kategori.toLowerCase().includes(searchQuery) ||
                            trx.id.toLowerCase().includes(searchQuery);
        return matchMonth && matchSearch;
      });

      const periodTransactions = keuangan.transaksi.filter(trx => {
        return (selectedMonth === 'all') || (trx.bulan === selectedMonth);
      });

      const totalMasuk = periodTransactions
        .filter(t => t.jenis === 'masuk')
        .reduce((sum, t) => sum + t.nominal, 0);

      const totalKeluar = periodTransactions
        .filter(t => t.jenis === 'keluar')
        .reduce((sum, t) => sum + t.nominal, 0);

      const allMasuk = keuangan.transaksi
        .filter(t => t.jenis === 'masuk')
        .reduce((sum, t) => sum + t.nominal, 0);

      const allKeluar = keuangan.transaksi
        .filter(t => t.jenis === 'keluar')
        .reduce((sum, t) => sum + t.nominal, 0);

      const totalSaldoAkumulasi = (keuangan.saldoAwalTahun || 0) + allMasuk - allKeluar;

      const sumMasukEl = document.getElementById('kas-sum-masuk');
      const sumKeluarEl = document.getElementById('kas-sum-keluar');
      const sumSaldoEl = document.getElementById('kas-sum-saldo');
      const heroSaldoEl = document.getElementById('stat-saldo');

      if (sumMasukEl) sumMasukEl.textContent = formatRupiah(totalMasuk);
      if (sumKeluarEl) sumKeluarEl.textContent = formatRupiah(totalKeluar);
      if (sumSaldoEl) sumSaldoEl.textContent = formatRupiah(totalSaldoAkumulasi);
      if (heroSaldoEl) heroSaldoEl.textContent = formatRupiah(totalSaldoAkumulasi);

      if (filtered.length === 0) {
        if (tableBody) tableBody.innerHTML = '';
        if (emptyState) emptyState.classList.remove('hidden');
        if (countInfo) countInfo.textContent = '0 transaksi ditemukan';
      } else {
        if (emptyState) emptyState.classList.add('hidden');
        if (tableBody) {
          tableBody.innerHTML = filtered.map(t => {
            const isMasuk = t.jenis === 'masuk';
            const nominalColor = isMasuk ? 'text-emerald-800' : 'text-slate-800';
            const nominalPrefix = isMasuk ? '+' : '-';

            return `
              <tr class="hover:bg-slate-50/80 transition-colors">
                <td class="py-2.5 px-3 text-slate-500 whitespace-nowrap font-mono text-[11px]">${t.tanggal}</td>
                <td class="py-2.5 px-3">
                  <div class="font-semibold text-slate-900">${t.keterangan}</div>
                  <span class="text-[10px] text-slate-500 sm:hidden block">${t.kategori}</span>
                </td>
                <td class="py-2.5 px-3 hidden sm:table-cell text-slate-600">
                  <span class="inline-block px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-slate-700 font-medium">
                    ${t.kategori}
                  </span>
                </td>
                <td class="py-2.5 px-3 text-right whitespace-nowrap font-mono font-bold ${nominalColor}">
                  ${nominalPrefix} ${formatRupiah(t.nominal)}
                </td>
                <td class="py-2.5 px-3 text-center whitespace-nowrap">
                  <span class="text-[10px] text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                    ${t.bukti || (isMasuk ? 'Kwitansi' : 'Nota')}
                  </span>
                </td>
                ${isAuth ? `
                  <td class="py-2.5 px-2 text-center whitespace-nowrap">
                    <div class="flex items-center justify-center gap-1">
                      <button type="button" data-edit-kas="${t.id}" class="p-1 rounded hover:bg-slate-200 text-slate-700" title="Edit">
                        <i data-lucide="edit-2" class="w-3.5 h-3.5"></i>
                      </button>
                      <button type="button" data-delete-kas="${t.id}" class="p-1 rounded hover:bg-rose-100 text-rose-700" title="Hapus">
                        <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                      </button>
                    </div>
                  </td>
                ` : ''}
              </tr>
            `;
          }).join('');
        }
        if (countInfo) countInfo.textContent = `Menampilkan ${filtered.length} transaksi`;
      }

      if (isAuth && tableBody) {
        tableBody.querySelectorAll('[data-edit-kas]').forEach(btn => {
          btn.onclick = (e) => {
            e.stopPropagation();
            openKasModal(btn.getAttribute('data-edit-kas'));
          };
        });

        tableBody.querySelectorAll('[data-delete-kas]').forEach(btn => {
          btn.onclick = (e) => {
            e.stopPropagation();
            deleteKasTrx(btn.getAttribute('data-delete-kas'));
          };
        });
      }

      refreshIcons();
    };

    const openKasModal = (trxId = null) => {
      if (!modalKasForm) return;
      const modalTitle = document.getElementById('modal-kas-title');
      const editIdInput = document.getElementById('kas-edit-id');
      const tglInput = document.getElementById('kas-input-tgl');
      const katInput = document.getElementById('kas-input-kategori');
      const nominalInput = document.getElementById('kas-input-nominal');
      const ketInput = document.getElementById('kas-input-ket');
      const buktiInput = document.getElementById('kas-input-bukti');
      const jenisRadios = document.querySelectorAll('input[name="kas-jenis"]');

      if (trxId) {
        const trx = currentData.keuangan.transaksi.find(t => t.id === trxId);
        if (!trx) return;
        modalTitle.textContent = 'Edit Transaksi Kas';
        editIdInput.value = trx.id;
        tglInput.value = trx.tanggal;
        katInput.value = trx.kategori;
        nominalInput.value = trx.nominal;
        ketInput.value = trx.keterangan;
        buktiInput.value = trx.bukti || '';
        jenisRadios.forEach(r => {
          r.checked = (r.value === trx.jenis);
        });
      } else {
        modalTitle.textContent = 'Catat Transaksi Kas';
        editIdInput.value = '';
        tglInput.value = new Date().toISOString().split('T')[0];
        katInput.value = 'Iuran Warga';
        nominalInput.value = '';
        ketInput.value = '';
        buktiInput.value = 'Kwitansi';
        jenisRadios[0].checked = true;
      }

      modalKasForm.classList.add('active');
      document.body.style.overflow = 'hidden';
      refreshIcons();
    };

    const closeKasModal = () => {
      if (!modalKasForm) return;
      modalKasForm.classList.remove('active');
      document.body.style.overflow = '';
    };

    const deleteKasTrx = (trxId) => {
      const trx = currentData.keuangan.transaksi.find(t => t.id === trxId);
      if (!trx) return;
      if (confirm(`Hapus transaksi "${trx.keterangan}" (${formatRupiah(trx.nominal)})?`)) {
        currentData.keuangan.transaksi = currentData.keuangan.transaksi.filter(t => t.id !== trxId);
        saveData(currentData);
        showToast("Transaksi kas dihapus.", "danger");
      }
    };

    if (formTrxKas) {
      formTrxKas.onsubmit = (e) => {
        e.preventDefault();
        const editId = document.getElementById('kas-edit-id').value;
        const tanggal = document.getElementById('kas-input-tgl').value;
        const kategori = document.getElementById('kas-input-kategori').value;
        const nominal = parseInt(document.getElementById('kas-input-nominal').value, 10);
        const keterangan = document.getElementById('kas-input-ket').value.trim();
        const bukti = document.getElementById('kas-input-bukti').value.trim();
        const jenis = document.querySelector('input[name="kas-jenis"]:checked').value;
        const bulan = tanggal.substring(0, 7);

        if (!tanggal || isNaN(nominal) || nominal <= 0 || !keterangan) {
          alert("Mohon isi seluruh data transaksi dengan lengkap.");
          return;
        }

        if (editId) {
          const index = currentData.keuangan.transaksi.findIndex(t => t.id === editId);
          if (index !== -1) {
            currentData.keuangan.transaksi[index] = {
              id: editId,
              tanggal,
              bulan,
              keterangan,
              kategori,
              jenis,
              nominal,
              bukti
            };
            showToast("Transaksi berhasil diperbarui.");
          }
        } else {
          const newId = `TRX-${Date.now().toString().slice(-4)}`;
          currentData.keuangan.transaksi.unshift({
            id: newId,
            tanggal,
            bulan,
            keterangan,
            kategori,
            jenis,
            nominal,
            bukti
          });
          showToast("Transaksi baru berhasil dicatat.");
        }

        closeKasModal();
        saveData(currentData);
      };
    }

    if (btnTambahKas) btnTambahKas.onclick = () => openKasModal();
    if (toolbarBtnTambahKas) toolbarBtnTambahKas.onclick = () => openKasModal();
    if (modalKasClose) modalKasClose.onclick = closeKasModal;
    if (btnCancelKas) btnCancelKas.onclick = closeKasModal;

    if (filterSelect) filterSelect.onchange = renderKas;
    if (searchInput) searchInput.oninput = renderKas;

    if (btnExport) {
      btnExport.onclick = () => {
        const rows = [
          ['ID Transaksi', 'Tanggal', 'Bulan', 'Keterangan', 'Kategori', 'Jenis', 'Nominal (Rp)', 'Bukti']
        ];
        currentData.keuangan.transaksi.forEach(t => {
          rows.push([
            t.id,
            t.tanggal,
            t.bulan,
            `"${t.keterangan.replace(/"/g, '""')}"`,
            `"${t.kategori}"`,
            t.jenis,
            t.nominal,
            `"${t.bukti || ''}"`
          ]);
        });

        const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.join(',')).join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `buku-kas-rt04-${currentData.info.namaRT.replace(/\s+/g, '')}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };
    }

    // Chart.js - Subdued & Grounded Theme
    const initChart = () => {
      const ctx = document.getElementById('kasChart');
      if (!ctx || !window.Chart) return;

      const chartData = currentData.keuangan.grafikBulanan || {
        labels: ["Juni", "Juli", "Agustus", "September", "Oktober", "November"],
        pemasukan: [3200000, 3450000, 4800000, 3300000, 3600000, 4150000],
        pengeluaran: [2100000, 2400000, 3950000, 2200000, 2550000, 2180000]
      };

      if (chartInstance) {
        chartInstance.destroy();
      }

      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: chartData.labels,
          datasets: [
            {
              label: 'Penerimaan',
              data: chartData.pemasukan,
              backgroundColor: '#0f172a', /* Charcoal / Dark Slate */
              borderRadius: 3,
              barPercentage: 0.65,
              categoryPercentage: 0.6
            },
            {
              label: 'Pengeluaran',
              data: chartData.pengeluaran,
              backgroundColor: '#94a3b8', /* Muted Slate */
              borderRadius: 3,
              barPercentage: 0.65,
              categoryPercentage: 0.6
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return ` ${context.dataset.label}: ${formatRupiah(context.parsed.y)}`;
                }
              }
            }
          },
          scales: {
            x: {
              grid: { display: false },
              ticks: { font: { family: "'Plus Jakarta Sans', sans-serif", size: 11 } }
            },
            y: {
              grid: { color: '#f1f5f9' },
              ticks: {
                callback: function(val) {
                  return 'Rp ' + (val / 1000000).toFixed(1) + ' jt';
                },
                font: { family: "'JetBrains Mono', monospace", size: 10 }
              }
            }
          }
        }
      });
    };

    renderKas();
    initChart();
  };

  // ----------------------------------------------------------------------------
  // 4. PAPAN PENGUMUMAN (EDITORIAL STYLE)
  // ----------------------------------------------------------------------------
  const initPengumuman = () => {
    const { pengumuman, info } = currentData;
    const isAuth = isAdminLoggedIn();
    const grid = document.getElementById('pengumuman-grid');
    const filterBtns = document.querySelectorAll('#pengumuman-filter-btns .filter-btn');
    const btnTambahPengumuman = document.getElementById('btn-tambah-pengumuman');
    const toolbarBtnTambahPengumuman = document.getElementById('toolbar-btn-tambah-pengumuman');
    const modalForm = document.getElementById('modal-pengumuman-form');
    const modalFormClose = document.getElementById('modal-pengumuman-close');
    const btnCancelPengumuman = document.getElementById('btn-cancel-pengumuman');
    const formCrudPengumuman = document.getElementById('form-crud-pengumuman');

    // Detail Modal Elements
    const modalDetail = document.getElementById('pengumuman-modal');
    const modalCategory = document.getElementById('modal-category');
    const modalDate = document.getElementById('modal-date');
    const modalTitle = document.getElementById('modal-title');
    const modalLocation = document.getElementById('modal-location');
    const modalBody = document.getElementById('modal-body-text');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalCloseBtnBottom = document.getElementById('modal-close-btn-bottom');
    const modalShareWa = document.getElementById('modal-share-wa');

    const openDetailModal = (item) => {
      if (!modalDetail) return;
      modalCategory.textContent = item.kategori;
      modalDate.textContent = item.tanggal;
      modalTitle.textContent = item.judul;
      modalLocation.textContent = item.lokasi || 'Lingkungan RT 04';
      
      const formattedBody = (item.isiLengkap || item.ringkasan)
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n\n/g, '</p><p class="mt-2.5">')
        .replace(/\n/g, '<br>');
      
      modalBody.innerHTML = `<p>${formattedBody}</p>`;

      const shareText = encodeURIComponent(`Warta Warga ${info.namaRT} / ${info.namaRW}\n\n*${item.judul}*\nTanggal: ${item.tanggal}\nLokasi: ${item.lokasi || 'Lingkungan RT'}\n\n${item.ringkasan}\n\nInformasi lengkap: https://rafifalhaki.github.io/RT04/`);
      modalShareWa.href = `https://wa.me/?text=${shareText}`;

      modalDetail.classList.add('active');
      document.body.style.overflow = 'hidden';
      refreshIcons();
    };

    const closeDetailModal = () => {
      if (!modalDetail) return;
      modalDetail.classList.remove('active');
      document.body.style.overflow = '';
    };

    if (modalCloseBtn) modalCloseBtn.onclick = closeDetailModal;
    if (modalCloseBtnBottom) modalCloseBtnBottom.onclick = closeDetailModal;
    if (modalDetail) {
      modalDetail.onclick = (e) => {
        if (e.target === modalDetail) closeDetailModal();
      };
    }

    const openFormModal = (pengId = null) => {
      if (!modalForm) return;
      const title = document.getElementById('modal-pengumuman-title');
      const editIdInput = document.getElementById('pengumuman-edit-id');
      const judulInput = document.getElementById('peng-input-judul');
      const katInput = document.getElementById('peng-input-kategori');
      const prioritasInput = document.getElementById('peng-input-prioritas');
      const tglInput = document.getElementById('peng-input-tanggal');
      const waktuInput = document.getElementById('peng-input-waktu');
      const lokasiInput = document.getElementById('peng-input-lokasi');
      const ringkasanInput = document.getElementById('peng-input-ringkasan');
      const lengkapInput = document.getElementById('peng-input-lengkap');

      if (pengId) {
        const item = currentData.pengumuman.find(p => p.id === pengId);
        if (!item) return;
        title.textContent = 'Edit Pengumuman';
        editIdInput.value = item.id;
        judulInput.value = item.judul;
        katInput.value = item.kategori;
        prioritasInput.value = item.prioritas || 'Rutin';
        tglInput.value = item.tanggal;
        waktuInput.value = item.waktu || '';
        lokasiInput.value = item.lokasi || '';
        ringkasanInput.value = item.ringkasan || '';
        lengkapInput.value = item.isiLengkap || '';
      } else {
        title.textContent = 'Buat Pengumuman Baru';
        editIdInput.value = '';
        judulInput.value = '';
        katInput.value = 'Kegiatan Warga';
        prioritasInput.value = 'Rutin';
        tglInput.value = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
        waktuInput.value = '08.00 WIB - Selesai';
        lokasiInput.value = 'Balai Warga RT 04';
        ringkasanInput.value = '';
        lengkapInput.value = '';
      }

      modalForm.classList.add('active');
      document.body.style.overflow = 'hidden';
      refreshIcons();
    };

    const closeFormModal = () => {
      if (!modalForm) return;
      modalForm.classList.remove('active');
      document.body.style.overflow = '';
    };

    if (btnTambahPengumuman) btnTambahPengumuman.onclick = () => openFormModal();
    if (toolbarBtnTambahPengumuman) toolbarBtnTambahPengumuman.onclick = () => openFormModal();
    if (modalFormClose) modalFormClose.onclick = closeFormModal;
    if (btnCancelPengumuman) btnCancelPengumuman.onclick = closeFormModal;

    const deletePengumuman = (pengId) => {
      const item = currentData.pengumuman.find(p => p.id === pengId);
      if (!item) return;
      if (confirm(`Hapus pengumuman "${item.judul}"?`)) {
        currentData.pengumuman = currentData.pengumuman.filter(p => p.id !== pengId);
        saveData(currentData);
        showToast("Pengumuman dihapus.", "danger");
      }
    };

    if (formCrudPengumuman) {
      formCrudPengumuman.onsubmit = (e) => {
        e.preventDefault();
        const editId = document.getElementById('pengumuman-edit-id').value;
        const judul = document.getElementById('peng-input-judul').value.trim();
        const kategori = document.getElementById('peng-input-kategori').value;
        const prioritas = document.getElementById('peng-input-prioritas').value;
        const tanggal = document.getElementById('peng-input-tanggal').value.trim();
        const waktu = document.getElementById('peng-input-waktu').value.trim();
        const lokasi = document.getElementById('peng-input-lokasi').value.trim();
        const ringkasan = document.getElementById('peng-input-ringkasan').value.trim();
        const isiLengkap = document.getElementById('peng-input-lengkap').value.trim();

        if (!judul || !tanggal || !ringkasan) {
          alert("Mohon lengkapi judul, tanggal, dan ringkasan pengumuman.");
          return;
        }

        if (editId) {
          const index = currentData.pengumuman.findIndex(p => p.id === editId);
          if (index !== -1) {
            currentData.pengumuman[index] = {
              ...currentData.pengumuman[index],
              judul,
              kategori,
              prioritas,
              tanggal,
              waktu,
              lokasi,
              ringkasan,
              isiLengkap
            };
            showToast("Pengumuman berhasil diperbarui.");
          }
        } else {
          const newId = `PG-${Date.now().toString().slice(-4)}`;
          currentData.pengumuman.unshift({
            id: newId,
            judul,
            kategori,
            prioritas,
            tanggal,
            waktu,
            lokasi,
            ringkasan,
            isiLengkap
          });
          showToast("Pengumuman baru berhasil diterbitkan.");
        }

        closeFormModal();
        saveData(currentData);
      };
    }

    const renderPengumuman = (category = 'all') => {
      const filtered = category === 'all'
        ? currentData.pengumuman
        : currentData.pengumuman.filter(p => p.kategori.toLowerCase().includes(category.toLowerCase()));

      if (!grid) return;

      grid.innerHTML = filtered.map(item => `
        <div class="civic-card p-5 flex flex-col justify-between group cursor-pointer" data-id="${item.id}">
          <div>
            <div class="flex items-center justify-between gap-2 mb-2">
              <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200">
                ${item.kategori}
              </span>
              <span class="text-[10px] font-mono text-slate-500">${item.tanggal}</span>
            </div>
            
            <h3 class="font-bold text-slate-900 text-sm leading-snug mb-2 group-hover:text-slate-700 transition-colors">
              ${item.judul}
            </h3>
            
            <p class="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
              ${item.ringkasan}
            </p>
          </div>

          <div class="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span class="font-semibold text-slate-800 group-hover:underline inline-flex items-center gap-1">
              Baca Warta <i data-lucide="arrow-right" class="w-3 h-3"></i>
            </span>
            ${isAuth ? `
              <div class="flex items-center gap-1">
                <button type="button" data-edit-peng="${item.id}" class="p-1 rounded hover:bg-slate-200 text-slate-700" title="Edit">
                  <i data-lucide="edit-2" class="w-3.5 h-3.5"></i>
                </button>
                <button type="button" data-delete-peng="${item.id}" class="p-1 rounded hover:bg-rose-100 text-rose-700" title="Hapus">
                  <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                </button>
              </div>
            ` : ''}
          </div>
        </div>
      `).join('');

      grid.querySelectorAll('[data-id]').forEach(card => {
        card.onclick = (e) => {
          if (e.target.closest('[data-edit-peng]') || e.target.closest('[data-delete-peng]')) return;
          const id = card.getAttribute('data-id');
          const found = currentData.pengumuman.find(p => p.id === id);
          if (found) openDetailModal(found);
        };
      });

      if (isAuth) {
        grid.querySelectorAll('[data-edit-peng]').forEach(btn => {
          btn.onclick = (e) => {
            e.stopPropagation();
            openFormModal(btn.getAttribute('data-edit-peng'));
          };
        });

        grid.querySelectorAll('[data-delete-peng]').forEach(btn => {
          btn.onclick = (e) => {
            e.stopPropagation();
            deletePengumuman(btn.getAttribute('data-delete-peng'));
          };
        });
      }

      refreshIcons();
    };

    filterBtns.forEach(btn => {
      btn.onclick = () => {
        filterBtns.forEach(b => {
          b.classList.remove('active', 'bg-slate-900', 'text-white');
          b.classList.add('bg-slate-100', 'text-slate-600');
        });
        btn.classList.add('active', 'bg-slate-900', 'text-white');
        btn.classList.remove('bg-slate-100', 'text-slate-600');

        renderPengumuman(btn.getAttribute('data-cat'));
      };
    });

    renderPengumuman('all');
  };

  // ----------------------------------------------------------------------------
  // 5. JADWAL SISKAMLING & KONTAK DARURAT
  // ----------------------------------------------------------------------------
  const initRondaAndDarurat = () => {
    const { jadwalRonda, kontakDarurat } = currentData;
    const tabContainer = document.getElementById('ronda-day-tabs');
    const activeDetail = document.getElementById('ronda-active-detail');
    const searchInput = document.getElementById('ronda-search-input');
    const searchResults = document.getElementById('ronda-search-results');
    const daruratGrid = document.getElementById('darurat-grid');
    const btnEditRonda = document.getElementById('btn-edit-ronda');
    const modalRondaForm = document.getElementById('modal-ronda-form');
    const modalRondaClose = document.getElementById('modal-ronda-close');
    const btnCancelRonda = document.getElementById('btn-cancel-ronda');
    const formCrudRonda = document.getElementById('form-crud-ronda');
    const rondaSelectHari = document.getElementById('ronda-select-hari');
    const rondaInputKoor = document.getElementById('ronda-input-koor');
    const rondaInputKontak = document.getElementById('ronda-input-kontak');
    const rondaInputAnggota = document.getElementById('ronda-input-anggota');

    const jamEl = document.getElementById('ronda-jam');
    if (jamEl) jamEl.textContent = jadwalRonda.jamOperasional;

    const currentDay = getIndonesianDayName();
    let selectedDay = jadwalRonda.harian.some(d => d.hari.toLowerCase() === currentDay.toLowerCase())
      ? currentDay
      : "Senin";

    const renderActiveDayDetail = (dayName) => {
      const schedule = jadwalRonda.harian.find(d => d.hari.toLowerCase() === dayName.toLowerCase()) || jadwalRonda.harian[0];
      if (!activeDetail) return;

      const isToday = schedule.hari.toLowerCase() === currentDay.toLowerCase();

      activeDetail.innerHTML = `
        <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 mb-4 gap-2">
          <div>
            <div class="flex items-center gap-2">
              <h4 class="text-sm font-bold text-slate-900 uppercase tracking-wider">Regu Jaga: Hari ${schedule.hari}</h4>
              ${isToday ? `
                <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-900 text-white uppercase">
                  Dinas Malam Ini
                </span>
              ` : ''}
            </div>
            <p class="text-xs text-slate-600 mt-0.5">Koordinator: <strong class="text-slate-900">${schedule.koordinator}</strong> (${schedule.kontakKoordinator})</p>
          </div>
          
          <a href="https://wa.me/${schedule.kontakKoordinator.replace(/^0/, '62')}?text=${encodeURIComponent(`Halo Koordinator Ronda ${schedule.hari}, saya ingin konfirmasi jadwal ronda malam.`)}" target="_blank" rel="noopener" class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded text-xs font-semibold transition-colors">
            <i data-lucide="phone" class="w-3.5 h-3.5"></i> Hubungi Koordinator
          </a>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
          ${schedule.anggota.map((nama, idx) => `
            <div class="flex items-center gap-2.5 p-2.5 bg-slate-50 rounded border border-slate-200 text-xs">
              <span class="w-5 h-5 rounded bg-white text-slate-700 font-mono font-bold text-[10px] flex items-center justify-center shrink-0 border border-slate-200">
                ${idx + 1}
              </span>
              <span class="font-medium text-slate-800 truncate">${nama}</span>
            </div>
          `).join('')}
        </div>
      `;

      refreshIcons();
    };

    const renderTabs = () => {
      if (!tabContainer) return;
      tabContainer.innerHTML = jadwalRonda.harian.map(d => {
        const isActive = d.hari.toLowerCase() === selectedDay.toLowerCase();
        const isToday = d.hari.toLowerCase() === currentDay.toLowerCase();

        return `
          <button type="button" data-day="${d.hari}" class="tab-day-btn px-3 py-1.5 rounded text-xs font-bold border transition-colors shrink-0 flex items-center gap-1.5 ${
            isActive
              ? 'active'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }">
            ${d.hari}
            ${isToday ? '<span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>' : ''}
          </button>
        `;
      }).join('');

      tabContainer.querySelectorAll('.tab-day-btn').forEach(btn => {
        btn.onclick = () => {
          selectedDay = btn.getAttribute('data-day');
          renderTabs();
          renderActiveDayDetail(selectedDay);
        };
      });
    };

    renderTabs();
    renderActiveDayDetail(selectedDay);

    const populateRondaForm = (dayName) => {
      const schedule = currentData.jadwalRonda.harian.find(d => d.hari.toLowerCase() === dayName.toLowerCase());
      if (!schedule) return;
      rondaSelectHari.value = schedule.hari;
      rondaInputKoor.value = schedule.koordinator;
      rondaInputKontak.value = schedule.kontakKoordinator;
      rondaInputAnggota.value = schedule.anggota.join('\n');
    };

    const openRondaModal = () => {
      if (!modalRondaForm) return;
      populateRondaForm(selectedDay);
      modalRondaForm.classList.add('active');
      document.body.style.overflow = 'hidden';
      refreshIcons();
    };

    const closeRondaModal = () => {
      if (!modalRondaForm) return;
      modalRondaForm.classList.remove('active');
      document.body.style.overflow = '';
    };

    if (btnEditRonda) btnEditRonda.onclick = openRondaModal;
    if (modalRondaClose) modalRondaClose.onclick = closeRondaModal;
    if (btnCancelRonda) btnCancelRonda.onclick = closeRondaModal;

    if (rondaSelectHari) {
      rondaSelectHari.onchange = () => {
        populateRondaForm(rondaSelectHari.value);
      };
    }

    if (formCrudRonda) {
      formCrudRonda.onsubmit = (e) => {
        e.preventDefault();
        const hari = rondaSelectHari.value;
        const koordinator = rondaInputKoor.value.trim();
        const kontakKoordinator = rondaInputKontak.value.trim();
        const anggota = rondaInputAnggota.value.split('\n').map(a => a.trim()).filter(a => a.length > 0);

        if (!koordinator || anggota.length === 0) {
          alert("Mohon isi nama koordinator dan minimal 1 nama anggota.");
          return;
        }

        const index = currentData.jadwalRonda.harian.findIndex(d => d.hari.toLowerCase() === hari.toLowerCase());
        if (index !== -1) {
          currentData.jadwalRonda.harian[index] = {
            ...currentData.jadwalRonda.harian[index],
            koordinator,
            kontakKoordinator,
            anggota
          };
          saveData(currentData);
          showToast(`Jadwal hari ${hari} diperbarui.`);
        }

        closeRondaModal();
      };
    }

    if (searchInput && searchResults) {
      searchInput.oninput = () => {
        const query = searchInput.value.toLowerCase().trim();
        if (!query || query.length < 2) {
          searchResults.classList.add('hidden');
          searchResults.innerHTML = '';
          return;
        }

        const matches = [];
        jadwalRonda.harian.forEach(d => {
          d.anggota.forEach(nama => {
            if (nama.toLowerCase().includes(query)) {
              matches.push({ hari: d.hari, nama, koordinator: d.koordinator });
            }
          });
        });

        if (matches.length > 0) {
          searchResults.classList.remove('hidden');
          searchResults.innerHTML = `
            <div class="font-bold mb-1">Ditemukan di ${matches.length} jadwal jaga siskamling:</div>
            <ul class="space-y-1 list-disc list-inside">
              ${matches.map(m => `
                <li><strong>${m.nama}</strong>: Hari <strong>${m.hari}</strong> (Koordinator: ${m.koordinator})</li>
              `).join('')}
            </ul>
          `;
        } else {
          searchResults.classList.remove('hidden');
          searchResults.innerHTML = `
            <div class="text-rose-700">Nama "<strong>${query}</strong>" belum ditemukan di daftar jaga aktif. Hubungi Koordinator Kamtibmas.</div>
          `;
        }
      };
    }

    // Emergency Contacts Grid
    if (daruratGrid) {
      daruratGrid.innerHTML = kontakDarurat.map(k => {
        const hasWa = k.whatsapp && k.whatsapp.length > 0;
        return `
          <div class="civic-card p-4 flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between gap-2 mb-2">
                <span class="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                  ${k.kategori}
                </span>
                <i data-lucide="phone-call" class="w-3.5 h-3.5 text-slate-400"></i>
              </div>
              <h4 class="font-bold text-slate-900 text-xs sm:text-sm mb-1">${k.nama}</h4>
              <p class="text-[11px] text-slate-500 mb-3">${k.deskripsi}</p>
            </div>

            <div class="pt-2.5 border-t border-slate-100 space-y-1.5">
              <a href="tel:${k.telepon}" class="w-full inline-flex items-center justify-center gap-1.5 py-1.5 px-2 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-mono font-bold transition-colors">
                Hubungi: ${k.telepon}
              </a>
              ${hasWa ? `
                <a href="https://wa.me/${k.whatsapp}?text=${encodeURIComponent('Halo, kondisi darurat lingkungan RT 04 mohon bantuan.')}" target="_blank" rel="noopener" class="w-full inline-flex items-center justify-center gap-1 py-1 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-medium transition-colors">
                  <i data-lucide="message-square" class="w-3 h-3 text-slate-500"></i> Chat WhatsApp
                </a>
              ` : ''}
            </div>
          </div>
        `;
      }).join('');
      refreshIcons();
    }
  };

  // ----------------------------------------------------------------------------
  // 6. LAYANAN SURAT & FORM ASPIRASI
  // ----------------------------------------------------------------------------
  const initLayananAndForm = () => {
    const { layananSurat, info } = currentData;
    const accordionContainer = document.getElementById('surat-accordion');
    const formPengaduan = document.getElementById('form-pengaduan');

    if (accordionContainer) {
      accordionContainer.innerHTML = layananSurat.map((surat, index) => {
        const isFirst = index === 0;
        return `
          <div class="civic-card overflow-hidden">
            <button type="button" class="accordion-toggle w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors">
              <div>
                <h4 class="font-bold text-slate-900 text-xs sm:text-sm">${surat.judul}</h4>
                <span class="text-[11px] text-slate-500">${surat.prosesWaktu} • Biaya: ${surat.biaya}</span>
              </div>
              <i data-lucide="chevron-down" class="accordion-chevron w-4 h-4 text-slate-400 shrink-0 ${isFirst ? 'rotated' : ''}"></i>
            </button>
            
            <div class="accordion-content ${isFirst ? 'expanded' : ''}">
              <div class="p-4 pt-0 border-t border-slate-100 text-xs text-slate-600 space-y-2.5 bg-slate-50/50">
                <p class="text-slate-500 italic">${surat.keperluan}</p>
                <div class="font-semibold text-slate-800">Persyaratan berkas:</div>
                <ul class="space-y-1 list-disc list-inside">
                  ${surat.syarat.map(s => `<li>${s}</li>`).join('')}
                </ul>
                <div class="pt-2 flex items-center justify-between text-[11px]">
                  <span class="text-slate-500">Pelayanan Balai RT 04</span>
                  <a href="https://wa.me/${info.noWhatsAppLaporan}?text=${encodeURIComponent(`Halo Pengurus RT, saya ingin mengajukan ${surat.judul}. Persyaratan sudah saya siapkan.`)}" target="_blank" rel="noopener" class="font-bold text-slate-900 hover:underline">
                    Hubungi Pengurus →
                  </a>
                </div>
              </div>
            </div>
          </div>
        `;
      }).join('');

      accordionContainer.querySelectorAll('.accordion-toggle').forEach(btn => {
        btn.onclick = () => {
          const content = btn.nextElementSibling;
          const chevron = btn.querySelector('.accordion-chevron');
          const isExpanded = content.classList.contains('expanded');

          accordionContainer.querySelectorAll('.accordion-content').forEach(c => c.classList.remove('expanded'));
          accordionContainer.querySelectorAll('.accordion-chevron').forEach(ch => ch.classList.remove('rotated'));

          if (!isExpanded) {
            content.classList.add('expanded');
            chevron.classList.add('rotated');
          }
        };
      });

      refreshIcons();
    }

    if (formPengaduan) {
      formPengaduan.onsubmit = (e) => {
        e.preventDefault();

        const nama = document.getElementById('lapor-nama').value.trim();
        const alamat = document.getElementById('lapor-alamat').value.trim();
        const wa = document.getElementById('lapor-wa').value.trim();
        const kategori = document.getElementById('lapor-kategori').value;
        const pesan = document.getElementById('lapor-pesan').value.trim();

        if (!nama || !alamat || !pesan || !kategori) {
          alert('Mohon lengkapi seluruh kolom formulir pengaduan.');
          return;
        }

        const now = new Date();
        const tglStr = now.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
        const jamStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

        const waMessage = 
`*PENGADUAN / ASPIRASI WARGA RT 04*
------------------------------------------------
Nama: ${nama}
Alamat: ${alamat}
Kontak: ${wa}
Kategori: ${kategori}
Waktu: ${tglStr}, ${jamStr} WIB

Rincian Laporan:
${pesan}
------------------------------------------------
Dikirim melalui Portal Warga RT 04 Sukamaju`;

        const encodedWa = encodeURIComponent(waMessage);
        const waUrl = `https://wa.me/${info.noWhatsAppLaporan}?text=${encodedWa}`;

        window.open(waUrl, '_blank');
        formPengaduan.reset();
        showToast('Pesan telah diformat dan diarahkan ke WhatsApp Pengurus RT.');
      };
    }
  };

  // ----------------------------------------------------------------------------
  // 7. MODAL LOGIN & SINKRONISASI
  // ----------------------------------------------------------------------------
  const initAuthAndSyncModals = () => {
    const modalLogin = document.getElementById('modal-login');
    const btnOpenLogin = document.getElementById('btn-open-login');
    const mobileBtnLogin = document.getElementById('mobile-btn-login');
    const modalLoginClose = document.getElementById('modal-login-close');
    const btnCancelLogin = document.getElementById('btn-cancel-login');
    const formAdminLogin = document.getElementById('form-admin-login');
    const loginErrorMsg = document.getElementById('login-error-msg');
    const btnTopbarLogout = document.getElementById('btn-topbar-logout');
    const toolbarBtnLogout = document.getElementById('toolbar-btn-logout');
    const toolbarBtnResetData = document.getElementById('toolbar-btn-reset-data');

    const openLoginModal = () => {
      if (isAdminLoggedIn()) {
        if (confirm("Keluar dari Mode Pengurus RT?")) {
          setAdminAuth(false);
          showToast("Berhasil keluar dari mode pengurus.", "info");
        }
        return;
      }
      if (!modalLogin) return;
      if (loginErrorMsg) loginErrorMsg.classList.add('hidden');
      document.getElementById('admin-username').value = '';
      document.getElementById('admin-password').value = '';
      modalLogin.classList.add('active');
      document.body.style.overflow = 'hidden';
      refreshIcons();
    };

    const closeLoginModal = () => {
      if (!modalLogin) return;
      modalLogin.classList.remove('active');
      document.body.style.overflow = '';
    };

    if (btnOpenLogin) btnOpenLogin.onclick = openLoginModal;
    if (mobileBtnLogin) mobileBtnLogin.onclick = openLoginModal;
    if (modalLoginClose) modalLoginClose.onclick = closeLoginModal;
    if (btnCancelLogin) btnCancelLogin.onclick = closeLoginModal;

    const handleLogout = () => {
      setAdminAuth(false);
      showToast("Kembali ke mode warga biasa (read-only).", "info");
    };

    if (btnTopbarLogout) btnTopbarLogout.onclick = handleLogout;
    if (toolbarBtnLogout) toolbarBtnLogout.onclick = handleLogout;
    if (toolbarBtnResetData) toolbarBtnResetData.onclick = resetData;

    if (formAdminLogin) {
      formAdminLogin.onsubmit = (e) => {
        e.preventDefault();
        const usn = document.getElementById('admin-username').value.trim();
        const pw = document.getElementById('admin-password').value;
        const validUsn = (currentData.auth && currentData.auth.adminUsername) || 'admin';
        const validPw = (currentData.auth && currentData.auth.adminPassword) || 'adminrt04';

        if (usn === validUsn && pw === validPw) {
          setAdminAuth(true);
          closeLoginModal();
          showToast("Mode Pengurus RT Aktif (Fitur CRUD Siap Digunakan).");
        } else {
          if (loginErrorMsg) loginErrorMsg.classList.remove('hidden');
        }
      };
    }

    const modalSync = document.getElementById('modal-sync-data');
    const modalSyncClose = document.getElementById('modal-sync-close');
    const toolbarBtnSyncData = document.getElementById('toolbar-btn-sync-data');
    const syncCodePreview = document.getElementById('sync-code-preview');
    const btnCopyDataJs = document.getElementById('btn-copy-data-js');
    const btnDownloadDataJs = document.getElementById('btn-download-data-js');

    const generateDataJsString = () => {
      return `/**
 * ==============================================================================
 * DATA KONFIGURASI PORTAL DIGITAL RT 04
 * ==============================================================================
 * Diperbarui dari Panel Pengurus RT: ${new Date().toLocaleString('id-ID')}
 * ==============================================================================
 */

window.RT_DATA = ${JSON.stringify(currentData, null, 2)};
`;
    };

    const openSyncModal = () => {
      if (!modalSync) return;
      if (syncCodePreview) syncCodePreview.value = generateDataJsString();
      modalSync.classList.add('active');
      document.body.style.overflow = 'hidden';
      refreshIcons();
    };

    const closeSyncModal = () => {
      if (!modalSync) return;
      modalSync.classList.remove('active');
      document.body.style.overflow = '';
    };

    if (toolbarBtnSyncData) toolbarBtnSyncData.onclick = openSyncModal;
    if (modalSyncClose) modalSyncClose.onclick = closeSyncModal;

    if (btnCopyDataJs) {
      btnCopyDataJs.onclick = () => {
        const codeStr = generateDataJsString();
        navigator.clipboard.writeText(codeStr).then(() => {
          showToast("Kode data.js disalin ke clipboard.");
        }).catch(() => {
          syncCodePreview.select();
          document.execCommand('copy');
          showToast("Kode data.js disalin.");
        });
      };
    }

    if (btnDownloadDataJs) {
      btnDownloadDataJs.onclick = () => {
        const codeStr = generateDataJsString();
        const blob = new Blob([codeStr], { type: 'text/javascript;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'data.js';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast("File data.js berhasil diunduh.");
      };
    }
  };

  // ----------------------------------------------------------------------------
  // 8. MENU MOBILE
  // ----------------------------------------------------------------------------
  const initMobileMenu = () => {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');

    if (menuBtn && mobileMenu) {
      menuBtn.onclick = () => {
        mobileMenu.classList.toggle('hidden');
      };

      mobileLinks.forEach(link => {
        link.onclick = () => {
          mobileMenu.classList.add('hidden');
        };
      });
    }
  };

  // ----------------------------------------------------------------------------
  // BOOTSTRAP
  // ----------------------------------------------------------------------------
  const renderAll = () => {
    initIdentityAndHero();
    initProfilAndPengurus();
    initTransparansiKas();
    initPengumuman();
    initRondaAndDarurat();
    initLayananAndForm();
    updateAuthUI();
    refreshIcons();
  };

  renderAll();
  initAuthAndSyncModals();
  initMobileMenu();
});
