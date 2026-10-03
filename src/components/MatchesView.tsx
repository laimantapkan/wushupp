import React, { useState } from 'react';
import { MatchSchedule, MatchStatus, Discipline } from '../types';
import { Calendar, Swords, Activity, MapPin, Clock, Plus, Edit2, Trash2, CheckCircle2 } from 'lucide-react';

interface MatchesViewProps {
  matches: MatchSchedule[];
  onUpdateMatchStatus: (matchId: string, status: MatchStatus) => void;
  onAddMatch: (match: MatchSchedule) => void;
  onDeleteMatch: (matchId: string) => void;
}

export const MatchesView: React.FC<MatchesViewProps> = ({
  matches,
  onUpdateMatchStatus,
  onAddMatch,
  onDeleteMatch,
}) => {
  const [filterDiscipline, setFilterDiscipline] = useState<Discipline | 'ALL'>('ALL');
  const [filterStatus, setFilterStatus] = useState<MatchStatus | 'ALL'>('ALL');

  // New Match Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [athleteName, setAthleteName] = useState('');
  const [discipline, setDiscipline] = useState<Discipline>('Sanda');
  const [matchCategory, setMatchCategory] = useState('');
  const [matchNumber, setMatchNumber] = useState('');
  const [date, setDate] = useState('2026-07-15');
  const [time, setTime] = useState('09:00');
  const [venue, setVenue] = useState('GOR Graha Wushu Arena A');
  const [status, setStatus] = useState<MatchStatus>('Belum bertanding');
  const [notes, setNotes] = useState('');

  // Sanda Extra
  const [opponent, setOpponent] = useState('');
  const [round, setRound] = useState('Babak Penyisihan');

  // Taolu Extra
  const [taoluNumber, setTaoluNumber] = useState('');
  const [orderIndex, setOrderIndex] = useState(1);
  const [weapon, setWeapon] = useState('');

  const filteredMatches = matches.filter((m) => {
    const matchDisc = filterDiscipline === 'ALL' || m.discipline === filterDiscipline;
    const matchStat = filterStatus === 'ALL' || m.status === filterStatus;
    return matchDisc && matchStat;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!athleteName.trim()) return;

    const newMatch: MatchSchedule = {
      id: `mtc-${Date.now()}`,
      athleteId: `atl-${Date.now()}`,
      athleteName,
      discipline,
      matchCategory,
      matchNumber,
      date,
      time,
      venue,
      status,
      notes,
      sandaExtra:
        discipline === 'Sanda'
          ? {
              weighInTime: `${date} 06:30`,
              weighInResult: 'Lolos Timbang',
              opponent,
              round,
            }
          : undefined,
      taoluExtra:
        discipline === 'Taolu'
          ? {
              taoluNumber,
              orderIndex,
              weapon,
            }
          : undefined,
    };

    onAddMatch(newMatch);
    setIsModalOpen(false);
  };

  const getStatusBadge = (st: MatchStatus) => {
    switch (st) {
      case 'Sedang bertanding':
        return <span className="px-2.5 py-1 text-xs font-black bg-red-600 text-white rounded-full animate-pulse">🔥 SEDANG BERTANDING</span>;
      case 'Persiapan':
        return <span className="px-2.5 py-1 text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full">⏳ PERSIAPAN</span>;
      case 'Selesai':
        return <span className="px-2.5 py-1 text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full">✓ SELESAI</span>;
      default:
        return <span className="px-2.5 py-1 text-xs font-bold bg-slate-800 text-slate-300 rounded-full">⏱ BELUM BERTANDING</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="w-6 h-6 text-red-500" />
            <h2 className="text-xl font-extrabold text-white">Jadwal Pertandingan Wushu Porprov</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Pantau jam, arena venue, lawan tanding Sanda, dan urutan tampil Taolu.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl text-xs font-bold shadow-lg transition"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Jadwal Match</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
        <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setFilterDiscipline('ALL')}
            className={`px-3 py-1 rounded-md font-bold transition ${
              filterDiscipline === 'ALL' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Semua Cabang
          </button>
          <button
            onClick={() => setFilterDiscipline('Sanda')}
            className={`px-3 py-1 rounded-md font-bold transition flex items-center gap-1 ${
              filterDiscipline === 'Sanda' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Swords className="w-3.5 h-3.5" />
            <span>Sanda</span>
          </button>
          <button
            onClick={() => setFilterDiscipline('Taolu')}
            className={`px-3 py-1 rounded-md font-bold transition flex items-center gap-1 ${
              filterDiscipline === 'Taolu' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Taolu</span>
          </button>
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
          className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-lg px-3 py-2 font-semibold"
        >
          <option value="ALL">Semua Status Match</option>
          <option value="Belum bertanding">Belum Bertanding</option>
          <option value="Persiapan">Persiapan Call Room</option>
          <option value="Sedang bertanding">Sedang Bertanding</option>
          <option value="Selesai">Selesai</option>
        </select>
      </div>

      {/* Match Cards List */}
      <div className="space-y-4">
        {filteredMatches.map((m) => {
          const isSanda = m.discipline === 'Sanda';
          return (
            <div
              key={m.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-lg transition"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
                <div className="flex items-center gap-3">
                  <span
                    className={`p-2.5 rounded-xl ${
                      isSanda ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'
                    }`}
                  >
                    {isSanda ? <Swords className="w-6 h-6" /> : <Activity className="w-6 h-6" />}
                  </span>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-red-400 uppercase">{m.matchNumber}</span>
                      <span className="text-slate-600">•</span>
                      <span className="text-xs font-bold text-slate-300">{m.matchCategory}</span>
                    </div>
                    <h3 className="text-lg font-extrabold text-white mt-0.5">{m.athleteName}</h3>
                  </div>
                </div>

                {/* Status Selector */}
                <div className="flex items-center gap-3">
                  {getStatusBadge(m.status)}

                  <select
                    value={m.status}
                    onChange={(e) => onUpdateMatchStatus(m.id, e.target.value as MatchStatus)}
                    className="bg-slate-950 border border-slate-800 text-xs text-white rounded-lg px-2.5 py-1.5 font-semibold focus:outline-none focus:border-red-500"
                  >
                    <option value="Belum bertanding">Belum Bertanding</option>
                    <option value="Persiapan">Persiapan Call Room</option>
                    <option value="Sedang bertanding">Sedang Bertanding</option>
                    <option value="Selesai">Selesai</option>
                  </select>
                </div>
              </div>

              {/* Match Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-xs">
                <div className="flex items-center gap-2 text-slate-300">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>
                    Tanggal: <strong>{m.date}</strong> ({m.time} WIB)
                  </span>
                </div>

                <div className="flex items-center gap-2 text-slate-300">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span>{m.venue}</span>
                </div>

                {isSanda ? (
                  <div className="text-slate-300 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-amber-400 font-bold block mb-0.5">Sanda Detail:</span>
                    <div>Lawan: <strong>{m.sandaExtra?.opponent || '-'}</strong></div>
                    <div>Babak: {m.sandaExtra?.round || 'Penyisihan'}</div>
                  </div>
                ) : (
                  <div className="text-slate-300 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-blue-400 font-bold block mb-0.5">Taolu Detail:</span>
                    <div>Urutan Tampil: <strong>#{m.taoluExtra?.orderIndex || 1}</strong></div>
                    <div>Senjata: {m.taoluExtra?.weapon || 'Tangan Kosong'}</div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Match Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-6 shadow-2xl max-h-[85vh] overflow-y-auto">
            <h3 className="text-base font-extrabold text-white mb-4">Tambah Jadwal Pertandingan Baru</h3>

            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Cabang</label>
                  <select
                    value={discipline}
                    onChange={(e) => setDiscipline(e.target.value as Discipline)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                  >
                    <option value="Sanda">Sanda</option>
                    <option value="Taolu">Taolu</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Nama Atlet *</label>
                  <input
                    type="text"
                    required
                    value={athleteName}
                    onChange={(e) => setAthleteName(e.target.value)}
                    placeholder="Nama atlet..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Kategori / Nomor *</label>
                <input
                  type="text"
                  required
                  value={matchCategory}
                  onChange={(e) => setMatchCategory(e.target.value)}
                  placeholder="mis. Sanda Senior Putra 56 kg"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Nomor Partai</label>
                  <input
                    type="text"
                    value={matchNumber}
                    onChange={(e) => setMatchNumber(e.target.value)}
                    placeholder="PARTAI 05"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Tanggal</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Jam</label>
                  <input
                    type="text"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="09:00"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Venue / GOR</label>
                <input
                  type="text"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>

              {discipline === 'Sanda' ? (
                <div className="p-3 bg-amber-950/20 border border-amber-500/30 rounded-xl space-y-2">
                  <label className="block text-xs font-bold text-amber-400">Lawan Tanding (Kontingen Lawan)</label>
                  <input
                    type="text"
                    value={opponent}
                    onChange={(e) => setOpponent(e.target.value)}
                    placeholder="Kontingen Kab. Sidoarjo"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white"
                  />
                </div>
              ) : (
                <div className="p-3 bg-blue-950/20 border border-blue-500/30 rounded-xl space-y-2">
                  <label className="block text-xs font-bold text-blue-400">Urutan Tampil Taolu</label>
                  <input
                    type="number"
                    value={orderIndex}
                    onChange={(e) => setOrderIndex(parseInt(e.target.value) || 1)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white"
                  />
                </div>
              )}

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs text-slate-400 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-lg shadow"
                >
                  Simpan Jadwal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
