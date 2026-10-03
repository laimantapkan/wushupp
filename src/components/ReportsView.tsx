import React, { useState } from 'react';
import { AppState } from '../types';
import { exportToExcel, exportToPDF } from '../utils/exportUtils';
import { BarChart3, FileSpreadsheet, FileText } from 'lucide-react';

interface ReportsViewProps {
  state: AppState;
}

export const ReportsView: React.FC<ReportsViewProps> = ({ state }) => {
  const [selectedReport, setSelectedReport] = useState<
    | 'kesiapan'
    | 'atlet'
    | 'pelatih'
    | 'official'
    | 'checklist_gear'
    | 'checklist_doc'
    | 'jadwal'
    | 'timbang'
    | 'keberangkatan'
  >('atlet');

  const reportTabs = [
    { id: 'kesiapan', title: '1. Kesiapan Kontingen' },
    { id: 'atlet', title: '2. Daftar Atlet (Gambar 2)' },
    { id: 'pelatih', title: '3. Daftar Pelatih' },
    { id: 'official', title: '4. Daftar Official' },
    { id: 'checklist_gear', title: '5. Checklist Perlengkapan' },
    { id: 'checklist_doc', title: '6. Checklist Dokumen' },
    { id: 'jadwal', title: '7. Jadwal Pertandingan' },
    { id: 'timbang', title: '8. Rekap Timbang Sanda' },
    { id: 'keberangkatan', title: '9. Checklist Keberangkatan' },
  ];

  const handleExportPDFClick = () => {
    switch (selectedReport) {
      case 'atlet': {
        const headers = ['Nama', 'L/P', 'Tempat/Tgl Lahir', 'Kategori', 'KK', 'NIK', 'TB', 'BB', 'Baju/Sepatu', 'HP'];
        const data = state.athletes.map((a) => [
          a.name,
          a.gender === 'Laki-laki' ? 'L' : 'P',
          a.birthPlace ? `${a.birthPlace}, ${a.birthDate || ''}` : '-',
          a.matchCategory,
          a.noKK || '-',
          a.nik,
          a.height ? `${a.height}cm` : '-',
          a.weight > 0 ? `${a.weight}kg` : '-',
          `${a.shirtSize || '-'}/${a.shoeSize || '-'}`,
          a.phone || '-',
        ]);
        exportToPDF(state, 'Daftar Atlet Kontingen Padang Pariaman', headers, data);
        break;
      }
      case 'pelatih': {
        const headers = ['Nama', 'Jabatan', 'Spesialisasi', 'Nomor HP', 'Catatan'];
        const data = state.coaches.map((c) => [c.name, c.roleTitle, c.specialization, c.phone || '-', c.notes]);
        exportToPDF(state, 'Daftar Pelatih Kontingen', headers, data);
        break;
      }
      case 'official': {
        const headers = ['Nama', 'Jabatan', 'Seksi', 'Nomor HP', 'Catatan'];
        const data = state.officials.map((o) => [o.name, o.roleTitle, o.section, o.phone || '-', o.notes]);
        exportToPDF(state, 'Daftar Official Kontingen', headers, data);
        break;
      }
      case 'timbang': {
        const headers = ['Tanggal & Jam', 'Nama Atlet', 'Kelas', 'Berat (kg)', 'Target (kg)', 'Status', 'Catatan'];
        const data = state.weighInLogs.map((w) => [
          `${w.date} ${w.time}`,
          w.athleteName,
          w.weightClass,
          w.weight,
          w.targetWeight,
          w.status.toUpperCase(),
          w.notes || '-',
        ]);
        exportToPDF(state, 'Rekap Penimbangan Sanda', headers, data);
        break;
      }
      case 'jadwal': {
        const headers = ['Nomor Partai', 'Nama Atlet', 'Cabang', 'Kategori', 'Tanggal & Jam', 'Venue', 'Status'];
        const data = state.matches.map((m) => [
          m.matchNumber,
          m.athleteName,
          m.discipline,
          m.matchCategory,
          `${m.date} ${m.time}`,
          m.venue,
          m.status,
        ]);
        exportToPDF(state, 'Jadwal Pertandingan Porprov', headers, data);
        break;
      }
      default: {
        const totalCl = state.checklists.length;
        const compCl = state.checklists.filter((c) => c.isChecked).length;
        const perc = totalCl > 0 ? Math.round((compCl / totalCl) * 100) : 0;

        const headers = ['Metrik Kontingen', 'Jumlah / Nilai', 'Keterangan'];
        const data = [
          ['Total Atlet', state.athletes.length, `${state.athletes.filter((a) => a.discipline === 'Sanda').length} Sanda, ${state.athletes.filter((a) => a.discipline === 'Taolu').length} Taolu`],
          ['Total Pelatih', state.coaches.length, 'Sanda, Taolu & Fisik'],
          ['Total Official', state.officials.length, 'Manajemen, Medis & Logistik'],
          ['Persentase Kesiapan', `${perc}%`, `${compCl} dari ${totalCl} checklist selesai`],
          ['Jumlah Match', state.matches.length, 'Jadwal Pertandingan Porprov'],
        ];
        exportToPDF(state, 'Laporan_Ringkasan_Kesiapan_Kontingen', headers, data);
        break;
      }
    }
  };

  const handleExportExcelClick = () => {
    exportToExcel(state, selectedReport);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-red-500" />
            <h2 className="text-xl font-extrabold text-white">Laporan Kesiapan Kontingen</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Unduh laporan resmi format PDF dan Excel untuk Sekretariat KONI & Panitia PORPROV XVI SUMBAR.
          </p>
        </div>

        {/* Action Export Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportPDFClick}
            className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs rounded-xl shadow-lg transition"
          >
            <FileText className="w-4 h-4" />
            <span>Export PDF</span>
          </button>

          <button
            onClick={handleExportExcelClick}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-lg transition"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export Excel</span>
          </button>
        </div>
      </div>

      {/* Report Selection Sub-tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 bg-slate-950 p-2 rounded-2xl border border-slate-800">
        {reportTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedReport(tab.id as any)}
            className={`py-2 px-3 text-xs font-bold rounded-xl transition text-left truncate ${
              selectedReport === tab.id
                ? 'bg-red-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            {tab.title}
          </button>
        ))}
      </div>

      {/* Preview Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="font-extrabold text-white text-base uppercase">
            Preview: {reportTabs.find((t) => t.id === selectedReport)?.title}
          </h3>
          <span className="text-xs text-slate-400">Total Record: {state.athletes.length} Atlet</span>
        </div>

        {/* Dynamic Table Preview */}
        <div className="overflow-x-auto">
          {selectedReport === 'atlet' && (
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px]">
                <tr>
                  <th className="p-2.5">#</th>
                  <th className="p-2.5">Nama</th>
                  <th className="p-2.5">L/P</th>
                  <th className="p-2.5">Tempat, Tgl Lahir</th>
                  <th className="p-2.5">Kelas/Nomor</th>
                  <th className="p-2.5">Baju/Sepatu</th>
                  <th className="p-2.5">KK</th>
                  <th className="p-2.5">NIK</th>
                  <th className="p-2.5">TB/BB</th>
                  <th className="p-2.5">Gol.Darah</th>
                  <th className="p-2.5">E-Mail</th>
                  <th className="p-2.5">HP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {state.athletes.map((a, i) => (
                  <tr key={a.id} className="hover:bg-slate-800/50">
                    <td className="p-2.5 font-mono text-slate-500">{i + 1}</td>
                    <td className="p-2.5 font-bold text-white whitespace-nowrap">{a.name}</td>
                    <td className="p-2.5">{a.gender === 'Laki-laki' ? 'L' : 'P'}</td>
                    <td className="p-2.5 whitespace-nowrap">{a.birthPlace}, {a.birthDate}</td>
                    <td className="p-2.5 font-semibold text-amber-400 whitespace-nowrap">{a.matchCategory}</td>
                    <td className="p-2.5 whitespace-nowrap">{a.shirtSize || '-'}/{a.shoeSize || '-'}</td>
                    <td className="p-2.5 font-mono text-slate-400">{a.noKK || '-'}</td>
                    <td className="p-2.5 font-mono text-slate-400">{a.nik}</td>
                    <td className="p-2.5 font-bold text-emerald-400">{a.height ? `${a.height}cm` : '-'} / {a.weight ? `${a.weight}kg` : '-'}</td>
                    <td className="p-2.5 text-center text-red-400 font-bold">{a.bloodType || '-'}</td>
                    <td className="p-2.5">{a.email || '-'}</td>
                    <td className="p-2.5 text-emerald-400 font-semibold">{a.phone || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {selectedReport === 'pelatih' && (
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px]">
                <tr>
                  <th className="p-3">Nama Pelatih</th>
                  <th className="p-3">Jabatan</th>
                  <th className="p-3">Spesialisasi</th>
                  <th className="p-3">Nomor HP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {state.coaches.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-800/50">
                    <td className="p-3 font-bold text-white">{c.name}</td>
                    <td className="p-3 text-red-400 font-semibold">{c.roleTitle}</td>
                    <td className="p-3">{c.specialization}</td>
                    <td className="p-3">{c.phone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {selectedReport === 'timbang' && (
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px]">
                <tr>
                  <th className="p-3">Waktu</th>
                  <th className="p-3">Nama Atlet</th>
                  <th className="p-3">Kelas</th>
                  <th className="p-3">Hasil Berat</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {state.weighInLogs.map((w) => (
                  <tr key={w.id} className="hover:bg-slate-800/50">
                    <td className="p-3 text-slate-400">{w.date} {w.time}</td>
                    <td className="p-3 font-bold text-white">{w.athleteName}</td>
                    <td className="p-3">{w.weightClass}</td>
                    <td className="p-3 font-bold text-amber-400">{w.weight} kg</td>
                    <td className="p-3 font-extrabold uppercase text-emerald-400">{w.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {selectedReport === 'kesiapan' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-400 font-bold block mb-1">Total Kontingen</span>
                <div className="text-xl font-extrabold text-white">
                  {state.athletes.length} Atlet, {state.coaches.length} Pelatih, {state.officials.length} Official
                </div>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-400 font-bold block mb-1">Status Kesiapan</span>
                <div className="text-xl font-extrabold text-emerald-400">
                  {Math.round((state.checklists.filter((c) => c.isChecked).length / state.checklists.length) * 100)}% Kesiapan
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
