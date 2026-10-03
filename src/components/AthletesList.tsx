import React, { useState } from 'react';
import { Athlete, Discipline, ChecklistItem } from '../types';
import { AthleteModal } from './AthleteModal';
import {
  Users,
  Search,
  Plus,
  Swords,
  Activity,
  Edit2,
  Trash2,
  Eye,
  X,
  PhoneCall
} from 'lucide-react';

interface AthletesListProps {
  athletes: Athlete[];
  checklists: ChecklistItem[];
  onSaveAthlete: (athlete: Athlete) => void;
  onDeleteAthlete: (id: string) => void;
  filterDiscipline?: Discipline | 'ALL';
  onNavigateToChecklist?: (athleteId: string) => void;
}

export const AthletesList: React.FC<AthletesListProps> = ({
  athletes,
  checklists,
  onSaveAthlete,
  onDeleteAthlete,
  filterDiscipline = 'ALL',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDiscipline, setSelectedDiscipline] = useState<Discipline | 'ALL'>(filterDiscipline);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('table');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAthlete, setEditingAthlete] = useState<Athlete | null>(null);
  const [viewingAthlete, setViewingAthlete] = useState<Athlete | null>(null);

  // Filter Logic
  const filteredAthletes = athletes.filter((a) => {
    const matchesSearch =
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.nik.includes(searchQuery) ||
      (a.noKK && a.noKK.includes(searchQuery)) ||
      (a.fatherName && a.fatherName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (a.motherName && a.motherName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      a.matchCategory.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDiscipline =
      selectedDiscipline === 'ALL' || a.discipline === selectedDiscipline;

    return matchesSearch && matchesDiscipline;
  });

  const handleEdit = (athlete: Athlete) => {
    setEditingAthlete(athlete);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingAthlete(null);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-5 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-6 h-6 text-red-500" />
            <h2 className="text-xl font-extrabold text-white">Data Atlet Kontingen Wushu Padang Pariaman</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Data resmi {athletes.length} atlet PORPROV XVI SUMBAR lengkap dengan Data Orang Tua (Ayah & Ibu).
          </p>
        </div>

        <button
          onClick={handleCreate}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-xl font-bold text-xs shadow-lg transition"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Atlet Baru</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama, NIK, KK, atau nama orang tua..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
          />
        </div>

        {/* Filter Buttons & View Mode Toggle */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setSelectedDiscipline('ALL')}
              className={`px-3 py-1 rounded-md font-bold transition ${
                selectedDiscipline === 'ALL'
                  ? 'bg-red-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Semua ({athletes.length})
            </button>
            <button
              onClick={() => setSelectedDiscipline('Sanda')}
              className={`px-3 py-1 rounded-md font-bold transition flex items-center gap-1 ${
                selectedDiscipline === 'Sanda'
                  ? 'bg-amber-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Swords className="w-3.5 h-3.5" />
              <span>Sanda ({athletes.filter((a) => a.discipline === 'Sanda').length})</span>
            </button>
            <button
              onClick={() => setSelectedDiscipline('Taolu')}
              className={`px-3 py-1 rounded-md font-bold transition flex items-center gap-1 ${
                selectedDiscipline === 'Taolu'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Taolu ({athletes.filter((a) => a.discipline === 'Taolu').length})</span>
            </button>
          </div>

          <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1 rounded-md font-bold transition ${
                viewMode === 'table' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              📊 Tabel
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1 rounded-md font-bold transition ${
                viewMode === 'cards' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              🎴 Kartu
            </button>
          </div>
        </div>
      </div>

      {/* Table View (Matching Spreadsheet Gambar 1 & Gambar 2) */}
      {viewMode === 'table' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
                <tr>
                  <th className="p-3">#</th>
                  <th className="p-3">Nama Lengkap</th>
                  <th className="p-3">L/P</th>
                  <th className="p-3">Kelas / Nomor Pertandingan</th>
                  <th className="p-3">Nama Ayah & HP</th>
                  <th className="p-3">Nama Ibu & HP</th>
                  <th className="p-3">NIK & KK</th>
                  <th className="p-3">TB / BB</th>
                  <th className="p-3">Ukuran Baju/Sepatu</th>
                  <th className="p-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredAthletes.map((a, idx) => (
                  <tr key={a.id} className="hover:bg-slate-800/50 transition">
                    <td className="p-3 text-slate-500 font-mono">{idx + 1}</td>
                    <td className="p-3 font-bold text-white whitespace-nowrap">{a.name}</td>
                    <td className="p-3 font-bold text-slate-400">{a.gender === 'Laki-laki' ? 'L' : 'P'}</td>
                    <td className="p-3 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          a.discipline === 'Sanda'
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-blue-500/20 text-blue-300'
                        }`}
                      >
                        {a.matchCategory}
                      </span>
                    </td>
                    {/* Ayah & HP Ayah */}
                    <td className="p-3 whitespace-nowrap">
                      <div className="font-bold text-slate-200">{a.fatherName || '-'}</div>
                      <div className="text-[11px] text-amber-400 font-mono">{a.fatherPhone || '-'}</div>
                    </td>
                    {/* Ibu & HP Ibu */}
                    <td className="p-3 whitespace-nowrap">
                      <div className="font-bold text-slate-200">{a.motherName || '-'}</div>
                      <div className="text-[11px] text-emerald-400 font-mono">{a.motherPhone || '-'}</div>
                    </td>
                    <td className="p-3 font-mono text-[11px] whitespace-nowrap">
                      <div>NIK: {a.nik}</div>
                      <div className="text-slate-500">KK: {a.noKK || '-'}</div>
                    </td>
                    <td className="p-3 whitespace-nowrap font-bold">
                      {a.height ? `${a.height} cm` : '-'} /{' '}
                      <span className="text-amber-400">{a.weight > 0 ? `${a.weight} kg` : '-'}</span>
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      Baju: <strong className="text-white">{a.shirtSize || '-'}</strong>, Sepatu:{' '}
                      <strong className="text-white">{a.shoeSize || '-'}</strong>
                    </td>
                    <td className="p-3 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => setViewingAthlete(a)}
                          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition"
                          title="Lihat Detail"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleEdit(a)}
                          className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded transition"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Hapus atlet ${a.name}?`)) onDeleteAthlete(a.id);
                          }}
                          className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded transition"
                          title="Hapus"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Cards View */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAthletes.map((athlete) => {
            const isSanda = athlete.discipline === 'Sanda';
            return (
              <div
                key={athlete.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 flex flex-col justify-between shadow-lg transition relative overflow-hidden group"
              >
                <div
                  className={`absolute top-0 left-0 right-0 h-1 ${
                    isSanda ? 'bg-amber-500' : 'bg-blue-500'
                  }`}
                />

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`px-2.5 py-0.5 text-[10px] font-extrabold rounded-full flex items-center gap-1 ${
                        isSanda
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      }`}
                    >
                      {isSanda ? <Swords className="w-3 h-3" /> : <Activity className="w-3 h-3" />}
                      <span>{athlete.discipline.toUpperCase()}</span>
                    </span>

                    <span className="text-[11px] font-semibold text-slate-400">
                      {athlete.gender === 'Laki-laki' ? 'Laki-laki (L)' : 'Perempuan (P)'}
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-white group-hover:text-red-400 transition">
                    {athlete.name}
                  </h3>
                  <p className="text-xs font-semibold text-slate-300 mt-0.5">
                    {athlete.matchCategory}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1 font-mono">
                    NIK: {athlete.nik} | KK: {athlete.noKK || '-'}
                  </p>

                  <div className="mt-3 p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-300">
                      <span>Ayah:</span>
                      <span className="font-bold text-amber-400">
                        {athlete.fatherName || '-'} ({athlete.fatherPhone || '-'})
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Ibu:</span>
                      <span className="font-bold text-emerald-400">
                        {athlete.motherName || '-'} ({athlete.motherPhone || '-'})
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-300 pt-1 border-t border-slate-900">
                      <span>Seragam / Sepatu:</span>
                      <span className="font-bold text-slate-200">
                        Baju {athlete.shirtSize || '-'} / Sepatu {athlete.shoeSize || '-'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-800">
                  <button
                    onClick={() => setViewingAthlete(athlete)}
                    className="flex items-center gap-1 text-xs text-slate-400 hover:text-white font-semibold transition"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Detail</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(athlete)}
                      className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition"
                      title="Edit Atlet"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Apakah Anda yakin ingin menghapus data atlet ${athlete.name}?`)) {
                          onDeleteAthlete(athlete.id);
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition"
                      title="Hapus Atlet"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Form */}
      <AthleteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={onSaveAthlete}
        initialData={editingAthlete}
      />

      {/* Athlete Detail Drawer Modal */}
      {viewingAthlete && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
            <button
              onClick={() => setViewingAthlete(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-600/20 text-red-400 flex items-center justify-center font-bold text-lg border border-red-500/30">
                {viewingAthlete.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-white">{viewingAthlete.name}</h3>
                <p className="text-xs text-red-400 font-semibold">{viewingAthlete.matchCategory}</p>
              </div>
            </div>

            <div className="space-y-2 text-xs bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                <span className="text-slate-400">Ayah:</span>
                <span className="text-white font-bold">{viewingAthlete.fatherName || '-'} ({viewingAthlete.fatherPhone || '-'})</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                <span className="text-slate-400">Ibu:</span>
                <span className="text-white font-bold">{viewingAthlete.motherName || '-'} ({viewingAthlete.motherPhone || '-'})</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                <span className="text-slate-400">NIK:</span>
                <span className="text-white font-mono">{viewingAthlete.nik}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                <span className="text-slate-400">Nomor KK:</span>
                <span className="text-white font-mono">{viewingAthlete.noKK || '-'}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                <span className="text-slate-400">Tempat / Tgl Lahir:</span>
                <span className="text-white">{viewingAthlete.birthPlace}, {viewingAthlete.birthDate}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                <span className="text-slate-400">TB / BB / Gol Darah:</span>
                <span className="text-emerald-400 font-bold">{viewingAthlete.height || '-'} cm / {viewingAthlete.weight || '-'} kg / Gol {viewingAthlete.bloodType || '-'}</span>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setViewingAthlete(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold"
              >
                Tutup Detail
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
