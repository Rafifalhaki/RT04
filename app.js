/**
 * ==============================================================================
 * APLIKASI UTAMA PORTAL DIGITAL RT (app.js)
 * ==============================================================================
 * Logika interaktif:
 * - Render data dari data.js ke antarmuka (DOM)
 * - Transparansi Kas: Filter bulan, pencarian transaksi, kalkulasi real-time & Chart.js
 * - Export data kas ke file CSV untuk Excel
 * - Papan Pengumuman: Filter kategori & modal pop-up detail
 * - Jadwal Ronda: Pemilihan tab otomatis sesuai hari ini & fitur cari nama warga
 * - Form Aspirasi: Validasi & format pesan instan ke WhatsApp Ketua RT
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // Pastikan data.js berhasil dimuat
  if (!window.RT_DATA) {
    console.error("Gagal memuat RT_DATA dari data.js");
    return;
  }

  const data = window.RT_DATA;
  let chartInstance = null;

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
  // 1. INISIALISASI IDENTITAS & HERO
  // ----------------------------------------------------------------------------
  const initIdentityAndHero = () => {
    const { info, statistik } = data;

    // Title & Meta
    document.title = `Portal Resmi ${info.namaRT} / ${info.namaRW} Kelurahan ${info.kelurahan}`;

    // Topbar
    const topbarInfo = document.getElementById('topbar-info');
    if (topbarInfo) {
      topbarInfo.textContent = `Portal Resmi ${info.namaRT} / ${info.namaRW} Kelurahan ${info.kelurahan}, ${info.kota}`;
    }

    const topbarWaLink = document.getElementById('topbar-wa-link');
    if (topbarWaLink && info.linkGrupWargaWA) {
      topbarWaLink.href = info.linkGrupWargaWA;
    }

    // Navigation Brand
    const navTitle = document.getElementById('nav-rt-title');
    const navSub = document.getElementById('nav-rt-sub');
    if (navTitle) navTitle.textContent = `${info.namaRT} / ${info.namaRW}`;
    if (navSub) navSub.textContent = `Kel. ${info.kelurahan}, ${info.kecamatan}`;

    // Hero Section
    const heroTitle = document.getElementById('hero-title');
    const heroDesc = document.getElementById('hero-desc');
    const heroPill = document.getElementById('hero-pill');

    if (heroTitle) {
      heroTitle.innerHTML = `Portal Informasi Digital <br><span class="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">${info.namaRT} / ${info.namaRW}</span> ${info.kelurahan}`;
    }
    if (heroDesc) heroDesc.textContent = info.deskripsi;
    if (heroPill) heroPill.textContent = info.slogan;

    // Quick Stats
    const statKK = document.getElementById('stat-kk');
    const statWarga = document.getElementById('stat-warga');
    const statWargaSub = document.getElementById('stat-warga-sub');
    const statAgendaJudul = document.getElementById('stat-agenda-judul');
    const statAgendaTgl = document.getElementById('stat-agenda-tgl');

    if (statKK) statKK.textContent = statistik.totalKK;
    if (statWarga) statWarga.textContent = statistik.totalWarga;
    if (statWargaSub) statWargaSub.textContent = `${statistik.totalPria} Pria • ${statistik.totalWanita} Wanita`;
    if (statAgendaJudul) statAgendaJudul.textContent = statistik.agendaTerdekat;
    if (statAgendaTgl) statAgendaTgl.textContent = `${statistik.agendaTanggal} • ${statistik.agendaWaktu}`;

    // Footer Info
    const footerTitle = document.getElementById('footer-rt-title');
    const footerSub = document.getElementById('footer-rt-sub');
    const footerDesc = document.getElementById('footer-rt-desc');
    const footerAlamat = document.getElementById('footer-alamat');
    const footerJam = document.getElementById('footer-jam');
    const footerEmail = document.getElementById('footer-email');
    const footerCopy = document.getElementById('footer-copy-name');
    const footerWaBtn = document.getElementById('footer-wa-btn');
    const footerMapsBtn = document.getElementById('footer-maps-btn');
    const floatingWa = document.getElementById('floating-wa-btn');

    if (footerTitle) footerTitle.textContent = `${info.namaRT} / ${info.namaRW}`;
    if (footerSub) footerSub.textContent = `Kel. ${info.kelurahan}, Kec. ${info.kecamatan}, ${info.kota}`;
    if (footerDesc) footerDesc.textContent = info.deskripsi;
    if (footerAlamat) footerAlamat.textContent = info.alamatSekretariat;
    if (footerJam) footerJam.textContent = info.jamPelayanan;
    if (footerEmail) footerEmail.textContent = info.email;
    if (footerCopy) footerCopy.textContent = `${info.namaRT} / ${info.namaRW} Kelurahan ${info.kelurahan}`;
    if (footerWaBtn && info.linkGrupWargaWA) footerWaBtn.href = info.linkGrupWargaWA;
    if (footerMapsBtn && info.linkGoogleMaps) footerMapsBtn.href = info.linkGoogleMaps;
    if (floatingWa) floatingWa.href = `https://wa.me/${info.noWhatsAppLaporan}?text=${encodeURIComponent('Halo Pengurus RT, saya warga ingin menanyakan informasi lingkungan.')}`;

    const copyrightYear = document.getElementById('copyright-year');
    if (copyrightYear) copyrightYear.textContent = new Date().getFullYear();
  };

  // ----------------------------------------------------------------------------
  // 2. PROFIL, VISI MISI & PENGURUS RT
  // ----------------------------------------------------------------------------
  const initProfilAndPengurus = () => {
    const { visiMisi, pengurus } = data;

    // Visi
    const visiEl = document.getElementById('profil-visi');
    if (visiEl) visiEl.textContent = `"${visiMisi.visi}"`;

    // Misi List
    const misiListEl = document.getElementById('profil-misi-list');
    if (misiListEl) {
      misiListEl.innerHTML = visiMisi.misi.map((m, idx) => `
        <li class="flex items-start gap-3">
          <span class="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
            ${idx + 1}
          </span>
          <p class="text-sm text-slate-700 leading-relaxed">${m}</p>
        </li>
      `).join('');
    }

    // Nilai Kerukunan Grid
    const nilaiGridEl = document.getElementById('profil-nilai-grid');
    if (nilaiGridEl && visiMisi.nilai) {
      nilaiGridEl.innerHTML = visiMisi.nilai.map(n => `
        <div class="card-soft p-5 rounded-2xl flex flex-col items-center text-center">
          <div class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
            <i data-lucide="${n.icon || 'star'}" class="w-6 h-6"></i>
          </div>
          <h4 class="font-bold text-slate-900 text-sm mb-1">${n.judul}</h4>
          <p class="text-xs text-slate-500 leading-relaxed">${n.deskripsi}</p>
        </div>
      `).join('');
    }

    // Pengurus Grid
    const pengurusGrid = document.getElementById('pengurus-grid');
    if (pengurusGrid) {
      pengurusGrid.innerHTML = pengurus.map(p => {
        const waText = encodeURIComponent(`Halo ${p.nama} (${p.jabatan}), perkenalkan saya warga RT 05 ingin berkonsultasi.`);
        return `
          <div class="card-soft p-5 rounded-2xl flex flex-col justify-between group">
            <div>
              <div class="flex items-center gap-4 mb-4">
                <img src="${p.foto}" alt="${p.nama}" class="w-16 h-16 rounded-2xl object-cover border-2 border-slate-100 shadow-sm shrink-0" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(p.nama)}&background=059669&color=fff'">
                <div>
                  <span class="inline-block px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-700 mb-1 border border-emerald-100">
                    ${p.jabatan}
                  </span>
                  <h4 class="font-bold text-slate-900 text-sm sm:text-base leading-snug">${p.nama}</h4>
                  <span class="text-[11px] text-slate-400">Masa Bakti: ${p.periode}</span>
                </div>
              </div>
              <p class="text-xs text-slate-600 mb-4 bg-slate-50/80 p-3 rounded-xl border border-slate-100 leading-relaxed">
                ${p.tugasUtama}
              </p>
            </div>
            
            <a href="https://wa.me/${p.whatsapp}?text=${waText}" target="_blank" rel="noopener" class="w-full inline-flex items-center justify-center gap-2 py-2 px-3 bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white rounded-xl text-xs font-semibold transition-all group-hover:shadow-sm">
              <i data-lucide="message-circle" class="w-4 h-4"></i> Hubungi via WhatsApp
            </a>
          </div>
        `;
      }).join('');
    }
  };

  // ----------------------------------------------------------------------------
  // 3. TRANSPARANSI KAS RT & CHART.JS
  // ----------------------------------------------------------------------------
  const initTransparansiKas = () => {
    const { keuangan } = data;
    const filterSelect = document.getElementById('kas-filter-bulan');
    const searchInput = document.getElementById('kas-search-input');
    const tableBody = document.getElementById('kas-table-body');
    const emptyState = document.getElementById('kas-empty-state');
    const countInfo = document.getElementById('kas-count-info');
    const btnExport = document.getElementById('btn-export-csv');

    // Populate filter dropdown from transactions
    if (filterSelect) {
      const months = Array.from(new Set(keuangan.transaksi.map(t => t.bulan))).sort().reverse();
      filterSelect.innerHTML = `<option value="all">Semua Periode</option>` +
        months.map(m => {
          const [year, month] = m.split('-');
          const monthName = new Date(year, parseInt(month) - 1, 1).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
          return `<option value="${m}">${monthName}</option>`;
        }).join('');
      
      // Default to the latest month
      if (months.length > 0) {
        filterSelect.value = months[0];
      }
    }

    // Render Table & Metrics
    const renderKas = () => {
      const selectedMonth = filterSelect ? filterSelect.value : 'all';
      const searchQuery = (searchInput ? searchInput.value : '').toLowerCase().trim();

      // Filter transactions
      const filtered = keuangan.transaksi.filter(trx => {
        const matchMonth = (selectedMonth === 'all') || (trx.bulan === selectedMonth);
        const matchSearch = trx.keterangan.toLowerCase().includes(searchQuery) ||
                            trx.kategori.toLowerCase().includes(searchQuery) ||
                            trx.id.toLowerCase().includes(searchQuery);
        return matchMonth && matchSearch;
      });

      // Calculate totals for currently selected period
      const periodTransactions = keuangan.transaksi.filter(trx => {
        return (selectedMonth === 'all') || (trx.bulan === selectedMonth);
      });

      const totalMasuk = periodTransactions
        .filter(t => t.jenis === 'masuk')
        .reduce((sum, t) => sum + t.nominal, 0);

      const totalKeluar = periodTransactions
        .filter(t => t.jenis === 'keluar')
        .reduce((sum, t) => sum + t.nominal, 0);

      // Total balance calculated from all transactions up to current data
      const allMasuk = keuangan.transaksi
        .filter(t => t.jenis === 'masuk')
        .reduce((sum, t) => sum + t.nominal, 0);

      const allKeluar = keuangan.transaksi
        .filter(t => t.jenis === 'keluar')
        .reduce((sum, t) => sum + t.nominal, 0);

      const totalSaldoAkumulasi = (keuangan.saldoAwalTahun || 0) + allMasuk - allKeluar;

      // Update Summary Cards
      const sumMasukEl = document.getElementById('kas-sum-masuk');
      const sumKeluarEl = document.getElementById('kas-sum-keluar');
      const sumSaldoEl = document.getElementById('kas-sum-saldo');
      const heroSaldoEl = document.getElementById('stat-saldo');

      if (sumMasukEl) sumMasukEl.textContent = formatRupiah(totalMasuk);
      if (sumKeluarEl) sumKeluarEl.textContent = formatRupiah(totalKeluar);
      if (sumSaldoEl) sumSaldoEl.textContent = formatRupiah(totalSaldoAkumulasi);
      if (heroSaldoEl) heroSaldoEl.textContent = formatRupiah(totalSaldoAkumulasi);

      // Render Rows
      if (filtered.length === 0) {
        if (tableBody) tableBody.innerHTML = '';
        if (emptyState) emptyState.classList.remove('hidden');
        if (countInfo) countInfo.textContent = '0 transaksi ditemukan';
      } else {
        if (emptyState) emptyState.classList.add('hidden');
        if (tableBody) {
          tableBody.innerHTML = filtered.map(t => {
            const isMasuk = t.jenis === 'masuk';
            const badgeClass = isMasuk
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-rose-50 text-rose-700 border border-rose-200';
            const nominalFormatted = `${isMasuk ? '+' : '-'} ${formatRupiah(t.nominal)}`;
            const nominalColor = isMasuk ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold';

            return `
              <tr class="hover:bg-slate-50/70 transition-colors">
                <td class="py-3 px-4 sm:px-3 text-slate-500 whitespace-nowrap">${t.tanggal}</td>
                <td class="py-3 px-3">
                  <div class="font-medium text-slate-800">${t.keterangan}</div>
                  <span class="text-[10px] text-slate-400 sm:hidden block mt-0.5">${t.kategori}</span>
                </td>
                <td class="py-3 px-3 hidden sm:table-cell">
                  <span class="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600">
                    ${t.kategori}
                  </span>
                </td>
                <td class="py-3 px-3 text-right whitespace-nowrap ${nominalColor}">
                  ${nominalFormatted}
                </td>
                <td class="py-3 px-4 sm:px-3 text-center whitespace-nowrap">
                  <span class="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded ${badgeClass}">
                    <i data-lucide="${isMasuk ? 'arrow-down-left' : 'arrow-up-right'}" class="w-3 h-3"></i>
                    ${t.bukti || (isMasuk ? 'Iuran' : 'Nota')}
                  </span>
                </td>
              </tr>
            `;
          }).join('');
        }
        if (countInfo) countInfo.textContent = `Menampilkan ${filtered.length} transaksi`;
      }

      refreshIcons();
    };

    // Event Listeners for Kas Filter
    if (filterSelect) filterSelect.addEventListener('change', renderKas);
    if (searchInput) searchInput.addEventListener('input', renderKas);

    // Export to CSV Function
    if (btnExport) {
      btnExport.addEventListener('click', () => {
        const rows = [
          ['ID Transaksi', 'Tanggal', 'Bulan', 'Keterangan', 'Kategori', 'Jenis', 'Nominal (Rp)', 'Bukti']
        ];
        keuangan.transaksi.forEach(t => {
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
        link.setAttribute('download', `laporan-kas-rt-${data.info.namaRT.replace(/\s+/g, '')}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    }

    // Initialize Chart.js
    const initChart = () => {
      const ctx = document.getElementById('kasChart');
      if (!ctx || !window.Chart) return;

      const chartData = keuangan.grafikBulanan || {
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
              label: 'Pemasukan',
              data: chartData.pemasukan,
              backgroundColor: '#10b981',
              borderRadius: 6,
              barPercentage: 0.7,
              categoryPercentage: 0.6
            },
            {
              label: 'Pengeluaran',
              data: chartData.pengeluaran,
              backgroundColor: '#f43f5e',
              borderRadius: 6,
              barPercentage: 0.7,
              categoryPercentage: 0.6
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
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
              grid: {
                display: false
              },
              ticks: {
                font: {
                  family: "'Plus Jakarta Sans', sans-serif",
                  size: 11
                }
              }
            },
            y: {
              grid: {
                color: '#f1f5f9'
              },
              ticks: {
                callback: function(val) {
                  return 'Rp ' + (val / 1000000).toFixed(1) + ' jt';
                },
                font: {
                  family: "'Plus Jakarta Sans', sans-serif",
                  size: 10
                }
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
  // 4. PAPAN PENGUMUMAN & MODAL POPUP
  // ----------------------------------------------------------------------------
  const initPengumuman = () => {
    const { pengumuman, info } = data;
    const grid = document.getElementById('pengumuman-grid');
    const filterBtns = document.querySelectorAll('#pengumuman-filter-btns .filter-btn');

    // Modal elements
    const modal = document.getElementById('pengumuman-modal');
    const modalImg = document.getElementById('modal-img');
    const modalCategory = document.getElementById('modal-category');
    const modalDate = document.getElementById('modal-date');
    const modalTime = document.getElementById('modal-time');
    const modalTitle = document.getElementById('modal-title');
    const modalLocation = document.getElementById('modal-location');
    const modalBody = document.getElementById('modal-body-text');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalCloseBtnBottom = document.getElementById('modal-close-btn-bottom');
    const modalShareWa = document.getElementById('modal-share-wa');

    const openModal = (item) => {
      if (!modal) return;
      modalImg.src = item.gambar || 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=800&auto=format&fit=crop&q=80';
      modalCategory.textContent = item.kategori;
      modalDate.textContent = item.tanggal;
      modalTime.textContent = item.waktu || 'Fleksibel';
      modalTitle.textContent = item.judul;
      modalLocation.textContent = item.lokasi || 'Lingkungan RT';
      
      // Parse markdown-style line breaks and bold
      const formattedBody = (item.isiLengkap || item.ringkasan)
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n\n/g, '</p><p class="mt-3">')
        .replace(/\n/g, '<br>');
      
      modalBody.innerHTML = `<p>${formattedBody}</p>`;

      // WhatsApp Share link
      const shareText = encodeURIComponent(`📢 *PENGUMUMAN ${info.namaRT} / ${info.namaRW}*\n\n*${item.judul}*\n📅 Tanggal: ${item.tanggal}\n📍 Lokasi: ${item.lokasi}\n\n${item.ringkasan}\n\nInformasi selengkapnya di website portal RT.`);
      modalShareWa.href = `https://wa.me/?text=${shareText}`;

      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      refreshIcons();
    };

    const closeModal = () => {
      if (!modal) return;
      modal.classList.remove('active');
      document.body.style.overflow = '';
    };

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    if (modalCloseBtnBottom) modalCloseBtnBottom.addEventListener('click', closeModal);
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
      });
    }

    // Filter & Render
    const renderPengumuman = (category = 'all') => {
      const filtered = category === 'all'
        ? pengumuman
        : pengumuman.filter(p => p.kategori.toLowerCase().includes(category.toLowerCase()));

      if (!grid) return;

      grid.innerHTML = filtered.map(item => `
        <div class="card-soft rounded-2xl overflow-hidden flex flex-col justify-between group cursor-pointer" data-id="${item.id}">
          <div>
            <div class="relative h-44 overflow-hidden bg-slate-100">
              <img src="${item.gambar}" alt="${item.judul}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" onerror="this.src='https://images.unsplash.com/photo-1577495508048-b635879837f1?w=800&auto=format&fit=crop&q=80'">
              <span class="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-white/95 text-emerald-800 shadow-xs">
                ${item.kategori}
              </span>
              ${item.prioritas === 'Penting' ? `
                <span class="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-600 text-white shadow-xs">
                  PENTING
                </span>
              ` : ''}
            </div>
            
            <div class="p-5">
              <div class="flex items-center gap-2 text-[11px] text-slate-400 mb-2 font-medium">
                <i data-lucide="calendar" class="w-3.5 h-3.5 text-emerald-600"></i>
                <span>${item.tanggal}</span>
              </div>
              <h3 class="font-bold text-slate-900 text-base mb-2 group-hover:text-emerald-700 transition-colors line-clamp-2">
                ${item.judul}
              </h3>
              <p class="text-xs text-slate-500 line-clamp-3 leading-relaxed mb-4">
                ${item.ringkasan}
              </p>
            </div>
          </div>

          <div class="px-5 pb-5 pt-0">
            <button type="button" class="btn-detail-pengumuman w-full py-2 px-3 bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors border border-slate-200 group-hover:border-emerald-200">
              Baca Selengkapnya <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
            </button>
          </div>
        </div>
      `).join('');

      // Add click listeners to cards
      grid.querySelectorAll('[data-id]').forEach(card => {
        card.addEventListener('click', () => {
          const id = card.getAttribute('data-id');
          const found = pengumuman.find(p => p.id === id);
          if (found) openModal(found);
        });
      });

      refreshIcons();
    };

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => {
          b.classList.remove('active', 'bg-emerald-600', 'text-white');
          b.classList.add('bg-slate-100', 'text-slate-600');
        });
        btn.classList.add('active', 'bg-emerald-600', 'text-white');
        btn.classList.remove('bg-slate-100', 'text-slate-600');

        renderPengumuman(btn.getAttribute('data-cat'));
      });
    });

    renderPengumuman('all');
  };

  // ----------------------------------------------------------------------------
  // 5. JADWAL RONDA & KONTAK DARURAT
  // ----------------------------------------------------------------------------
  const initRondaAndDarurat = () => {
    const { jadwalRonda, kontakDarurat } = data;
    const tabContainer = document.getElementById('ronda-day-tabs');
    const activeDetail = document.getElementById('ronda-active-detail');
    const searchInput = document.getElementById('ronda-search-input');
    const searchResults = document.getElementById('ronda-search-results');
    const daruratGrid = document.getElementById('darurat-grid');

    const jamEl = document.getElementById('ronda-jam');
    const posEl = document.getElementById('ronda-pos');
    if (jamEl) jamEl.textContent = jadwalRonda.jamOperasional;
    if (posEl) posEl.textContent = jadwalRonda.posUtama;

    // Detect today
    const currentDay = getIndonesianDayName();
    let selectedDay = jadwalRonda.harian.some(d => d.hari.toLowerCase() === currentDay.toLowerCase())
      ? currentDay
      : "Senin";

    const renderActiveDayDetail = (dayName) => {
      const schedule = jadwalRonda.harian.find(d => d.hari.toLowerCase() === dayName.toLowerCase()) || jadwalRonda.harian[0];
      if (!activeDetail) return;

      const isToday = schedule.hari.toLowerCase() === currentDay.toLowerCase();

      activeDetail.innerHTML = `
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-200">
          <div>
            <div class="flex items-center gap-2">
              <h4 class="text-lg font-bold text-slate-900">Jadwal Ronda Malam: ${schedule.hari}</h4>
              ${isToday ? `
                <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-600 text-white shadow-xs">
                  <span class="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span> Hari Ini
                </span>
              ` : ''}
            </div>
            <p class="text-xs text-slate-500 mt-0.5">Koordinator: <strong class="text-slate-800">${schedule.koordinator}</strong> (${schedule.kontakKoordinator})</p>
          </div>
          
          <a href="https://wa.me/${schedule.kontakKoordinator.replace(/^0/, '62')}?text=${encodeURIComponent(`Halo Koordinator Ronda ${schedule.hari}, saya ingin konfirmasi kehadiran siskamling.`)}" target="_blank" rel="noopener" class="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white hover:bg-emerald-50 text-emerald-700 rounded-xl text-xs font-semibold border border-slate-200 shadow-xs transition-colors">
            <i data-lucide="phone" class="w-3.5 h-3.5"></i> Hubungi Koordinator
          </a>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          ${schedule.anggota.map((nama, idx) => `
            <div class="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
              <div class="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0">
                ${idx + 1}
              </div>
              <div class="overflow-hidden">
                <span class="text-xs font-semibold text-slate-800 block truncate">${nama}</span>
                <span class="text-[10px] text-slate-400">Petugas Siskamling</span>
              </div>
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
          <button type="button" data-day="${d.hari}" class="tab-day-btn px-4 py-2 rounded-xl text-xs font-bold border transition-all shrink-0 flex items-center gap-1.5 ${
            isActive
              ? 'active'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }">
            ${d.hari}
            ${isToday ? '<span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>' : ''}
          </button>
        `;
      }).join('');

      tabContainer.querySelectorAll('.tab-day-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          selectedDay = btn.getAttribute('data-day');
          renderTabs();
          renderActiveDayDetail(selectedDay);
        });
      });
    };

    renderTabs();
    renderActiveDayDetail(selectedDay);

    // Search resident name in Ronda
    if (searchInput && searchResults) {
      searchInput.addEventListener('input', () => {
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
            <div class="font-bold mb-1 flex items-center gap-1.5">
              <i data-lucide="check-circle" class="w-4 h-4 text-emerald-600"></i> Ditemukan di ${matches.length} jadwal ronda:
            </div>
            <ul class="space-y-1 list-disc list-inside">
              ${matches.map(m => `
                <li><strong>${m.nama}</strong> bertugas pada hari <strong>${m.hari}</strong> (Koordinator: ${m.koordinator})</li>
              `).join('')}
            </ul>
          `;
          refreshIcons();
        } else {
          searchResults.classList.remove('hidden');
          searchResults.innerHTML = `
            <div class="text-rose-700 flex items-center gap-1.5">
              <i data-lucide="alert-circle" class="w-4 h-4"></i> Nama "<strong>${query}</strong>" belum ditemukan di daftar siskamling aktif. Silakan hubungi Koordinator Keamanan.
            </div>
          `;
          refreshIcons();
        }
      });
    }

    // Render Emergency Contacts Grid
    if (daruratGrid) {
      daruratGrid.innerHTML = kontakDarurat.map(k => {
        const hasWa = k.whatsapp && k.whatsapp.length > 0;
        return `
          <div class="card-soft p-5 rounded-2xl flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between mb-3">
                <span class="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                  ${k.kategori}
                </span>
                <div class="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                  <i data-lucide="${k.icon || 'phone'}" class="w-4 h-4"></i>
                </div>
              </div>
              <h4 class="font-bold text-slate-900 text-sm mb-1">${k.nama}</h4>
              <p class="text-xs text-slate-500 mb-4">${k.deskripsi}</p>
            </div>

            <div class="pt-3 border-t border-slate-100 space-y-2">
              <a href="tel:${k.telepon}" class="w-full inline-flex items-center justify-center gap-2 py-2 px-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors">
                <i data-lucide="phone-call" class="w-3.5 h-3.5"></i> Telp: ${k.telepon}
              </a>
              ${hasWa ? `
                <a href="https://wa.me/${k.whatsapp}?text=${encodeURIComponent('Halo, kondisi darurat lingkungan RT 05 mohon bantuan.')}" target="_blank" rel="noopener" class="w-full inline-flex items-center justify-center gap-1.5 py-1.5 px-3 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 rounded-xl text-xs font-medium transition-colors">
                  <i data-lucide="message-circle" class="w-3.5 h-3.5 text-emerald-600"></i> Chat WhatsApp
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
  // 6. LAYANAN SURAT & FORM ASPIRASI (WHATSAPP API)
  // ----------------------------------------------------------------------------
  const initLayananAndForm = () => {
    const { layananSurat, info } = data;
    const accordionContainer = document.getElementById('surat-accordion');
    const formPengaduan = document.getElementById('form-pengaduan');

    // Render Surat Accordion
    if (accordionContainer) {
      accordionContainer.innerHTML = layananSurat.map((surat, index) => {
        const isFirst = index === 0;
        return `
          <div class="border border-slate-200 rounded-2xl overflow-hidden bg-white">
            <button type="button" class="accordion-toggle w-full px-5 py-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <i data-lucide="file-text" class="w-4 h-4"></i>
                </div>
                <div>
                  <h4 class="font-bold text-slate-900 text-xs sm:text-sm leading-snug">${surat.judul}</h4>
                  <span class="text-[11px] text-slate-400">${surat.prosesWaktu} • Biaya: ${surat.biaya}</span>
                </div>
              </div>
              <i data-lucide="chevron-down" class="accordion-chevron w-4 h-4 text-slate-400 shrink-0 ${isFirst ? 'rotated' : ''}"></i>
            </button>
            
            <div class="accordion-content ${isFirst ? 'expanded' : ''}">
              <div class="p-5 pt-0 border-t border-slate-100 bg-slate-50/50 text-xs text-slate-600 space-y-3">
                <p class="italic text-slate-500">${surat.keperluan}</p>
                <div class="font-semibold text-slate-700">Persyaratan yang wajib disiapkan:</div>
                <ul class="space-y-1.5 list-none">
                  ${surat.syarat.map(s => `
                    <li class="flex items-start gap-2">
                      <i data-lucide="check" class="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5"></i>
                      <span>${s}</span>
                    </li>
                  `).join('')}
                </ul>
                <div class="pt-2 flex items-center justify-between">
                  <span class="text-[11px] text-emerald-700 font-medium">Bisa dikonfirmasi via WhatsApp</span>
                  <a href="https://wa.me/${info.noWhatsAppLaporan}?text=${encodeURIComponent(`Halo Pengurus RT, saya ingin mengajukan ${surat.judul}. Persyaratan sudah saya siapkan.`)}" target="_blank" rel="noopener" class="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-800 font-bold text-xs">
                    Ajukan Sekarang <i data-lucide="arrow-right" class="w-3 h-3"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        `;
      }).join('');

      // Accordion Event Listeners
      accordionContainer.querySelectorAll('.accordion-toggle').forEach(btn => {
        btn.addEventListener('click', () => {
          const content = btn.nextElementSibling;
          const chevron = btn.querySelector('.accordion-chevron');
          const isExpanded = content.classList.contains('expanded');

          // Close all
          accordionContainer.querySelectorAll('.accordion-content').forEach(c => c.classList.remove('expanded'));
          accordionContainer.querySelectorAll('.accordion-chevron').forEach(ch => ch.classList.remove('rotated'));

          if (!isExpanded) {
            content.classList.add('expanded');
            chevron.classList.add('rotated');
          }
        });
      });

      refreshIcons();
    }

    // Form Pengaduan Warga Submission
    if (formPengaduan) {
      formPengaduan.addEventListener('submit', (e) => {
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
        const tglStr = now.toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        });
        const jamStr = now.toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit'
        });

        // Format Pesan WhatsApp
        const waMessage = 
`*PENGADUAN / ASPIRASI WARGA RT*
------------------------------------------------
👤 *Nama Lengkap:* ${nama}
🏠 *Alamat/Rumah:* ${alamat}
📞 *Kontak Pelapor:* ${wa}
🏷️ *Kategori:* ${kategori}
📅 *Waktu Lapor:* ${tglStr}, ${jamStr} WIB

📝 *Rincian Laporan:*
${pesan}

------------------------------------------------
_Laporan dikirim otomatis melalui Portal Digital Warga_`;

        const encodedWa = encodeURIComponent(waMessage);
        const waUrl = `https://wa.me/${info.noWhatsAppLaporan}?text=${encodedWa}`;

        // Buka WhatsApp di tab baru
        window.open(waUrl, '_blank');

        // Reset form & pesan apresiasi
        formPengaduan.reset();
        alert('Terima kasih! Pesan pengaduan Anda telah terformat dan diarahkan ke WhatsApp Pengurus RT.');
      });
    }
  };

  // ----------------------------------------------------------------------------
  // 7. MOBILE HAMBURGER MENU & SCROLL BEHAVIOR
  // ----------------------------------------------------------------------------
  const initMobileMenu = () => {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');

    if (menuBtn && mobileMenu) {
      menuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
      });

      mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
          mobileMenu.classList.add('hidden');
        });
      });
    }
  };

  // ----------------------------------------------------------------------------
  // BOOTSTRAP ALL MODULES
  // ----------------------------------------------------------------------------
  initIdentityAndHero();
  initProfilAndPengurus();
  initTransparansiKas();
  initPengumuman();
  initRondaAndDarurat();
  initLayananAndForm();
  initMobileMenu();

  // Initial Lucide icon generation
  refreshIcons();
});
