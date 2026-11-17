import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Home, Search, Plus, Bell, UserRound, Camera, MapPin, CalendarDays,
  ChevronRight, Check, Package, SlidersHorizontal, ArrowLeft, ImagePlus
} from 'lucide-react';
import './styles.css';

const initialItems = [
  { id: 1, name: 'Kunci Mobil',  category: 'Elektronik', place: 'Gedung A, Lantai 1', date: '17 Okt 2026', image: 'keys',       status: 'Ditemukan' },
  { id: 2, name: 'Botol Minum',  category: 'Aksesoris',  place: 'Area Parkir',        date: '16 Okt 2026', image: 'bottle',     status: 'Ditemukan' },
  { id: 3, name: 'Dompet Hitam', category: 'Aksesoris',  place: 'Perpustakaan',       date: '15 Okt 2026', image: 'wallet',     status: 'Ditemukan' },
  { id: 4, name: 'Headset',      category: 'Elektronik', place: 'Ruang Kelas B',      date: '14 Okt 2026', image: 'headphones', status: 'Ditemukan' },
];

const initialNotifications = [
  {
    id: 1,
    title: 'Selamat datang di Laporin!',
    body: 'Mulai laporkan atau temukan barang hilang di sekitarmu.',
    page: null,
  },
];

function App() {
  const [page, setPage]           = useState('home');
  const [prevPage, setPrevPage]   = useState('home');
  const [items, setItems]         = useState(initialItems);
  const [selected, setSelected]   = useState(initialItems[0]);
  const [notifs, setNotifs]       = useState(initialNotifications);
  const [filter, setFilter]       = useState('Semua');
  const [query, setQuery]         = useState('');
  const [report, setReport]       = useState({
    name: '', category: 'Elektronik', place: '', date: '', description: '', type: 'Temuan',
  });
  const [claimForm, setClaimForm] = useState({ name: '', proof: '' });
  const [claimErrors, setClaimErrors] = useState({});
  const [toast, setToast]         = useState('');

  const go = (p) => {
    setPrevPage(page);
    setPage(p);
    window.scrollTo(0, 0);
  };

  const notify = (m) => {
    if (!m) return;
    setToast(m);
    setTimeout(() => setToast(''), 2400);
  };

  const submitReport = (e) => {
    e.preventDefault();
    const item = {
      id: Date.now(),
      ...report,
      image: 'new',
      status: 'Menunggu verifikasi',
    };
    setItems(prev => [item, ...prev]);
    setSelected(item);
    setNotifs(prev => [
      {
        id: Date.now(),
        title: 'Laporan berhasil dikirim',
        body: `Laporan untuk "${item.name}" sudah dikirim dan akan segera diproses.`,
        page: 'report-success',
      },
      ...prev,
    ]);
    go('report-success');
  };

  const openItem = (item, from) => {
    setSelected(item);
    setPrevPage(from || page);
    setPage('detail');
    window.scrollTo(0, 0);
  };

  const submitClaim = () => {
    const errors = {};
    if (!claimForm.name.trim())  errors.name  = 'Nama lengkap wajib diisi';
    if (!claimForm.proof.trim()) errors.proof = 'Bukti kepemilikan wajib diisi';
    if (Object.keys(errors).length) {
      setClaimErrors(errors);
      return;
    }
    setClaimErrors({});
    setNotifs(prev => [
      {
        id: Date.now(),
        title: 'Klaim berhasil dikirim',
        body: `Klaim untuk "${selected.name}" sudah diterima. Petugas akan menghubungi kamu.`,
        page: 'home',
      },
      ...prev,
    ]);
    go('claim-success');
  };

  const filtered = items.filter(
    i => (filter === 'Semua' || i.category === filter) &&
         i.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="app-shell">
      <div className="phone">
        <header className="topbar">
          <div className="brand" onClick={() => go('home')}>
            <span className="brand-mark">Q</span> Laporin
          </div>
          <button className="icon-btn" onClick={() => go('notifications')} aria-label="Notifikasi">
            <Bell size={18} />
            {notifs.length > 0 && <i />}
          </button>
        </header>

        <main>
          {/* HOME */}
          {page === 'home' && (
            <>
              <section className="greeting">
                <p className="muted">Selamat datang 👋</p>
                <h1>Halo, user!</h1>
                <p className="muted">Temukan atau laporkan barang di sekitarmu.</p>
              </section>

              <button className="searchbar" onClick={() => go('search')}>
                <Search size={16} /> Cari barang hilang...
              </button>

              <div className="quick-actions">
                <button onClick={() => { setReport({ ...report, type: 'Kehilangan' }); go('report'); }}>
                  <span className="action-icon"><Search /></span>
                  <b>Lost Item</b>
                  <small>Lapor Barang Hilang</small>
                </button>
                <button onClick={() => { setReport({ ...report, type: 'Temuan' }); go('report'); }}>
                  <span className="action-icon pale"><Package /></span>
                  <b>Found Item</b>
                  <small>Lapor Barang Temuan</small>
                </button>
              </div>

              <div className="section-head">
                <h2>Kategori</h2>
                <button onClick={() => go('search')}>Lihat Semua</button>
              </div>
              <div className="categories">
                {['Elektronik', 'Aksesoris', 'Dokumen', 'Lainnya'].map((c, i) => (
                  <button onClick={() => { setFilter(c); go('search'); }} key={c}>
                    <span>{['▣', '◉', '▤', '···'][i]}</span>{c}
                  </button>
                ))}
              </div>

              <div className="section-head">
                <h2>Barang Terbaru</h2>
                <button onClick={() => go('search')}>Lihat Semua</button>
              </div>
              <div className="item-list">
                {items.slice(0, 3).map(i => (
                  <ItemCard key={i.id} item={i} onClick={() => openItem(i, 'home')} />
                ))}
              </div>
            </>
          )}

          {/* SEARCH */}
          {page === 'search' && (
            <>
              <PageTitle title="Cari Barang" back={() => go('home')} />
              <p className="muted">Temukan barang yang hilang atau ditemukan.</p>
              <div className="searchbar">
                <Search size={16} />
                <input
                  placeholder="Cari nama barang..."
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                />
              </div>
              <div className="filter-row">
                <SlidersHorizontal size={15} />
                {['Semua', 'Elektronik', 'Aksesoris', 'Dokumen'].map(f => (
                  <button
                    className={filter === f ? 'active' : ''}
                    onClick={() => setFilter(f)}
                    key={f}
                  >{f}</button>
                ))}
              </div>
              <div className="item-list">
                {filtered.map(i => (
                  <ItemCard key={i.id} item={i} onClick={() => openItem(i, 'search')} />
                ))}
              </div>
              {!filtered.length && <Empty text="Barang tidak ditemukan" />}
            </>
          )}

          {/* REPORT */}
          {page === 'report' && (
            <>
              <PageTitle title="Laporkan Barang" back={() => go('home')} />
              <form className="form" onSubmit={submitReport}>
                <div className="upload-box">
                  <Camera size={24} />
                  <b>Unggah Foto Barang</b>
                  <small>Tambahkan foto agar barang mudah dikenali</small>
                  <label className="upload-button">
                    <ImagePlus size={15} /> Pilih Foto
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => {
                        const file = e.target.files[0];
                        if (file) notify(`Foto dipilih: ${file.name}`);
                      }}
                    />
                  </label>
                </div>

                <label>
                  Nama Barang
                  <input
                    required
                    value={report.name}
                    onChange={e => setReport({ ...report, name: e.target.value })}
                    placeholder="Contoh: Kunci Mobil"
                  />
                </label>

                <label>
                  Kategori
                  <select value={report.category} onChange={e => setReport({ ...report, category: e.target.value })}>
                    <option>Elektronik</option>
                    <option>Aksesoris</option>
                    <option>Dokumen</option>
                    <option>Lainnya</option>
                  </select>
                </label>

                <label>
                  Lokasi {report.type === 'Temuan' ? 'Ditemukan' : 'Terakhir Terlihat'}
                  <div className="input-icon">
                    <MapPin size={16} />
                    <input
                      required
                      value={report.place}
                      onChange={e => setReport({ ...report, place: e.target.value })}
                      placeholder="Contoh: Gedung A, Lantai 1"
                    />
                  </div>
                </label>

                <label>
                  Tanggal Kejadian
                  <div className="input-icon">
                    <CalendarDays size={16} />
                    <input
                      required
                      type="date"
                      value={report.date}
                      onChange={e => setReport({ ...report, date: e.target.value })}
                    />
                  </div>
                </label>

                <label>
                  Deskripsi
                  <textarea
                    value={report.description}
                    onChange={e => setReport({ ...report, description: e.target.value })}
                    placeholder="Jelaskan ciri-ciri barang..."
                  />
                </label>

                <button className="primary full" type="submit">
                  Kirim Laporan <ChevronRight size={17} />
                </button>
              </form>
            </>
          )}

          {/* REPORT SUCCESS */}
          {page === 'report-success' && (
            <Success
              title="Laporan Berhasil!"
              desc="Terima kasih sudah membantu. Laporan barang kamu berhasil dikirim dan akan segera diproses."
              button="Kembali ke Beranda"
              onClick={() => go('home')}
            />
          )}

          {/* DETAIL */}
          {page === 'detail' && (
            <>
              <PageTitle title="Preview Laporan" back={() => go(prevPage)} />
              <ItemPhoto type={selected.image} />
              <span className="tag">{selected.status}</span>
              <h2 className="detail-title">{selected.name}</h2>
              <p className="muted">{selected.category}</p>
              <div className="detail-info">
                <Info label="Lokasi Terakhir Terlihat" value={selected.place} />
                <Info label="Tanggal Kejadian" value={selected.date} />
                <Info
                  label="Deskripsi"
                  value={selected.description || 'Barang ditemukan dan sedang menunggu proses verifikasi.'}
                />
              </div>
              <button className="primary full" onClick={() => { setClaimForm({ name: '', proof: '' }); setClaimErrors({}); go('claim'); }}>
                Klaim Barang
              </button>
              <button className="secondary full" onClick={() => go(prevPage)}>
                Kembali
              </button>
            </>
          )}

          {/* CLAIM */}
          {page === 'claim' && (
            <>
              <PageTitle title="Klaim Barang" back={() => go('detail')} />
              <div className="claim-card">
                <Package size={32} />
                <h2>{selected.name}</h2>
                <p className="muted">Pastikan barang ini benar milikmu sebelum mengirim klaim.</p>
              </div>

              <label className="standalone">
                Nama Lengkap
                <input
                  value={claimForm.name}
                  onChange={e => setClaimForm({ ...claimForm, name: e.target.value })}
                  placeholder="Masukkan nama lengkap"
                />
                {claimErrors.name && <span className="field-error">{claimErrors.name}</span>}
              </label>

              <label className="standalone">
                Bukti Kepemilikan
                <textarea
                  value={claimForm.proof}
                  onChange={e => setClaimForm({ ...claimForm, proof: e.target.value })}
                  placeholder="Jelaskan ciri khusus atau bukti kepemilikan..."
                />
                {claimErrors.proof && <span className="field-error">{claimErrors.proof}</span>}
              </label>

              <button className="primary full" onClick={submitClaim}>Kirim Klaim</button>
            </>
          )}

          {/* CLAIM SUCCESS */}
          {page === 'claim-success' && (
            <Success
              title="Barangnya Cocok!"
              desc="Klaim kamu berhasil dikirim. Petugas akan menghubungi kamu untuk proses selanjutnya."
              button="Lihat Status Laporan"
              onClick={() => go('home')}
            />
          )}

          {/* NOTIFICATIONS */}
          {page === 'notifications' && (
            <>
              <PageTitle title="Notifikasi" back={() => go('home')} />
              {notifs.length === 0 && <Empty text="Tidak ada notifikasi saat ini" />}
              {notifs.map(n => (
                <div className="notice" key={n.id}>
                  <span className="notice-check"><Check /></span>
                  <div>
                    <b>{n.title}</b>
                    <p>{n.body}</p>
                    {n.page && (
                      <button onClick={() => go(n.page)}>
                        Lihat Detail <ChevronRight size={14} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </>
          )}

          {/* PROFILE */}
          {page === 'profile' && (
            <>
              <PageTitle title="Profil Saya" back={() => go('home')} />
              <div className="profile">
                <div className="avatar">U</div>
                <h2>User</h2>
                <p className="muted">Pengguna Laporin</p>
              </div>
              <button className="secondary full" onClick={() => notify('Pengaturan profil belum tersedia')}>
                Pengaturan Profil
              </button>
              <button className="secondary full" onClick={() => go('home')}>
                Kembali ke Beranda
              </button>
            </>
          )}
        </main>

        <nav className="bottom-nav">
          <button className={page === 'home' ? 'selected' : ''} onClick={() => go('home')}>
            <Home /><span>Home</span>
          </button>
          <button className={['search', 'detail', 'claim'].includes(page) ? 'selected' : ''} onClick={() => go('search')}>
            <Search /><span>Cari</span>
          </button>
          <button className="add" onClick={() => go('report')}><Plus /></button>
          <button className={page === 'notifications' ? 'selected' : ''} onClick={() => go('notifications')}>
            <Bell /><span>Notifikasi</span>
          </button>
          <button className={page === 'profile' ? 'selected' : ''} onClick={() => go('profile')}>
            <UserRound /><span>Profil</span>
          </button>
        </nav>

        {toast && <div className="toast">{toast}</div>}
      </div>
    </div>
  );
}

function PageTitle({ title, back }) {
  return (
    <div className="page-title">
      <button className="back" onClick={back}><ArrowLeft size={19} /></button>
      <h2>{title}</h2>
    </div>
  );
}

function ItemPhoto({ type }) {
  const emoji = { keys: '🔑', bottle: '🧴', wallet: '👛', headphones: '🎧' };
  return <div className={'item-photo ' + (type || 'keys')}>{emoji[type] || '📦'}</div>;
}

function ItemCard({ item, onClick }) {
  return (
    <button className="item-card" onClick={onClick}>
      <ItemPhoto type={item.image} />
      <span className="item-copy">
        <b>{item.name}</b>
        <small>{item.place}</small>
        <small>{item.date}</small>
      </span>
      <span className="mini-tag">{item.status === 'Ditemukan' ? 'Tersedia' : 'Baru'}</span>
      <ChevronRight size={16} />
    </button>
  );
}

function Info({ label, value }) {
  return (
    <div className="info">
      <small>{label}</small>
      <p>{value || '-'}</p>
    </div>
  );
}

function Empty({ text }) {
  return (
    <div className="empty">
      <Package size={28} /><p>{text}</p>
    </div>
  );
}

function Success({ title, desc, button, onClick }) {
  return (
    <div className="success">
      <div className="success-icon"><Check size={42} /></div>
      <h1>{title}</h1>
      <p>{desc}</p>
      <button className="primary full" onClick={onClick}>{button}</button>
      <div className="success-art">✦　　✧　　✦</div>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
