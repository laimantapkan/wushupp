import React, { useState } from 'react';
import { ChecklistItem, ConditionStatus } from '../types';
import { CheckSquare, Plus, Edit3, Search, CheckCircle2, XCircle } from 'lucide-react';

interface ChecklistsViewProps {
  checklists: ChecklistItem[];
  onToggleItem: (id: string, isChecked: boolean) => void;
  onUpdateItem: (item: ChecklistItem) => void;
  onAddItem: (item: Omit<ChecklistItem, 'id' | 'updatedAt'>) => void;
}

export const ChecklistsView: React.FC<ChecklistsViewProps> = ({
  checklists,
  onToggleItem,
  onUpdateItem,
  onAddItem,
}) => {
  const [activeCategory, setActiveCategory] = useState<
    'atlet' | 'pelatih' | 'manajemen_admin' | 'manajemen_gear'
  >('atlet');

  const [atletSubTab, setAtletSubTab] = useState<'umum' | 'sanda' | 'taolu'>('umum');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingItem, setEditingItem] = useState<ChecklistItem | null>(null);

  // New Item Modal State
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newIsChecked, setNewIsChecked] = useState(false);
  const [newQuantity, setNewQuantity] = useState(1);
  const [newCondition, setNewCondition] = useState<ConditionStatus>('Bagus');
  const [newNote, setNewNote] = useState('');

  // Category Filter
  const getCategoryCode = () => {
    if (activeCategory === 'atlet') return atletSubTab;
    return activeCategory;
  };

  const currentCategoryCode = getCategoryCode();

  const filteredItems = checklists.filter((item) => {
    const matchesCat = item.category === currentCategoryCode;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleAddNewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddItem({
      category: currentCategoryCode as any,
      title: newTitle,
      isChecked: newIsChecked,
      quantity: newQuantity,
      condition: newCondition,
      note: newNote,
    });

    setNewTitle('');
    setNewIsChecked(false);
    setNewQuantity(1);
    setNewCondition('Bagus');
    setNewNote('');
    setIsAddingNew(false);
  };

  const handleUpdateItemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    onUpdateItem(editingItem);
    setEditingItem(null);
  };

  // Metrics for category
  const totalCatItems = filteredItems.length;
  const completedCatItems = filteredItems.filter((i) => i.isChecked).length;
  const catPercent = totalCatItems > 0 ? Math.round((completedCatItems / totalCatItems) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-red-500" />
            <h2 className="text-xl font-extrabold text-white">Checklist Perlengkapan & Dokumen Kontingen</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Centang dan pantau kondisi barang secara real-time untuk Atlet, Pelatih, dan Manajemen.
          </p>
        </div>

        <button
          onClick={() => setIsAddingNew(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl text-xs font-bold shadow-lg hover:from-red-500 hover:to-red-600 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Item Checklist</span>
        </button>
      </div>

      {/* Primary Category Selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
        <button
          onClick={() => setActiveCategory('atlet')}
          className={`py-3 px-4 rounded-xl text-xs font-extrabold transition flex flex-col items-center justify-center gap-1 ${
            activeCategory === 'atlet'
              ? 'bg-red-600 text-white shadow-lg'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <span>👤 Checklist Atlet</span>
        </button>

        <button
          onClick={() => setActiveCategory('pelatih')}
          className={`py-3 px-4 rounded-xl text-xs font-extrabold transition flex flex-col items-center justify-center gap-1 ${
            activeCategory === 'pelatih'
              ? 'bg-purple-600 text-white shadow-lg'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <span>👨‍🏫 Checklist Pelatih</span>
        </button>

        <button
          onClick={() => setActiveCategory('manajemen_admin')}
          className={`py-3 px-4 rounded-xl text-xs font-extrabold transition flex flex-col items-center justify-center gap-1 ${
            activeCategory === 'manajemen_admin'
              ? 'bg-blue-600 text-white shadow-lg'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <span>📋 Manajemen: Administrasi</span>
        </button>

        <button
          onClick={() => setActiveCategory('manajemen_gear')}
          className={`py-3 px-4 rounded-xl text-xs font-extrabold transition flex flex-col items-center justify-center gap-1 ${
            activeCategory === 'manajemen_gear'
              ? 'bg-emerald-600 text-white shadow-lg'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <span>📦 Manajemen: Perlengkapan</span>
        </button>
      </div>

      {/* Atlet Sub-tabs if activeCategory === 'atlet' */}
      {activeCategory === 'atlet' && (
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wide mr-2">Kategori Atlet:</span>
          <button
            onClick={() => setAtletSubTab('umum')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              atletSubTab === 'umum'
                ? 'bg-slate-800 text-white border border-slate-700'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Checklist Umum (Identitas & Personal)
          </button>

          <button
            onClick={() => setAtletSubTab('sanda')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              atletSubTab === 'sanda'
                ? 'bg-amber-600/30 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🥊 Khusus Sanda (Gloves, Protector, Mouthguard, Wrap)
          </button>

          <button
            onClick={() => setAtletSubTab('taolu')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              atletSubTab === 'taolu'
                ? 'bg-blue-600/30 text-blue-300 border border-blue-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🤸 Khusus Taolu (Kostum, Senjata & Audio Track)
          </button>
        </div>
      )}

      {/* Progress & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 p-4 rounded-xl border border-slate-800">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="text-xs font-bold text-slate-300">
            Progress Kategori: <span className="text-red-400 text-sm font-extrabold">{catPercent}%</span>
          </div>
          <div className="w-32 bg-slate-950 rounded-full h-2.5 border border-slate-800 overflow-hidden">
            <div
              className="bg-red-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${catPercent}%` }}
            />
          </div>
          <span className="text-xs text-slate-400">
            ({completedCatItems}/{totalCatItems} Selesai)
          </span>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Cari item..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-red-500"
          />
        </div>
      </div>

      {/* Checklist Items Table / List */}
      <div className="space-y-2">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border transition gap-3 ${
              item.isChecked
                ? 'bg-slate-900/40 border-slate-800/80'
                : 'bg-slate-900 border-slate-700/80 shadow-md'
            }`}
          >
            {/* Left: Checkbox & Title */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={item.isChecked}
                onChange={(e) => onToggleItem(item.id, e.target.checked)}
                className="mt-0.5 w-5 h-5 rounded text-red-600 bg-slate-950 border-slate-700 focus:ring-red-500 cursor-pointer"
              />

              <div>
                <span
                  className={`text-sm font-bold block ${
                    item.isChecked ? 'line-through text-slate-400' : 'text-white'
                  }`}
                >
                  {item.title}
                </span>

                {item.note && (
                  <p className="text-xs text-amber-400 mt-0.5 italic">
                    Catatan: {item.note}
                  </p>
                )}
              </div>
            </div>

            {/* Right: Status "Sudah / Belum", Quantity, Condition & Edit */}
            <div className="flex items-center gap-2 sm:gap-3 self-end sm:self-center">
              {/* Status Badge: Sudah vs Belum */}
              <button
                onClick={() => onToggleItem(item.id, !item.isChecked)}
                className={`text-[11px] font-extrabold px-3 py-1 rounded-md border flex items-center gap-1 transition ${
                  item.isChecked
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                    : 'bg-red-500/20 text-red-400 border-red-500/40'
                }`}
              >
                {item.isChecked ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Sudah</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-3.5 h-3.5 text-red-400" />
                    <span>Belum</span>
                  </>
                )}
              </button>

              <span className="text-xs font-semibold text-slate-400 bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800">
                Jumlah: <strong className="text-white">{item.quantity}</strong>
              </span>

              <span
                className={`text-[11px] font-bold px-2.5 py-1 rounded-md border ${
                  item.condition === 'Bagus'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : item.condition === 'Perlu Diperbaiki'
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    : 'bg-red-500/10 text-red-400 border-red-500/30'
                }`}
              >
                {item.condition}
              </span>

              <button
                onClick={() => setEditingItem(item)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
                title="Edit Item"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Item Modal */}
      {isAddingNew && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <h3 className="text-base font-extrabold text-white mb-4">
              Tambah Item Checklist ({currentCategoryCode.toUpperCase()})
            </h3>

            <form onSubmit={handleAddNewSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nama Perlengkapan / Barang *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="mis. Handwrap Merah 5 Meter"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>

              {/* Status Selector: Sudah vs Belum */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Status Checklist
                </label>
                <select
                  value={newIsChecked ? 'Sudah' : 'Belum'}
                  onChange={(e) => setNewIsChecked(e.target.value === 'Sudah')}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-bold"
                >
                  <option value="Sudah">🟢 Sudah (Selesai/Lengkap)</option>
                  <option value="Belum">🔴 Belum (Belum Di-check)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Jumlah Barang
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={newQuantity}
                    onChange={(e) => setNewQuantity(parseInt(e.target.value) || 1)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Kondisi Barang
                  </label>
                  <select
                    value={newCondition}
                    onChange={(e) => setNewCondition(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-bold"
                  >
                    <option value="Bagus">🟢 Bagus</option>
                    <option value="Perlu Diperbaiki">🟡 Perlu Diperbaiki</option>
                    <option value="Rusak/Kurang">🔴 Rusak / Kurang</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Catatan Tambahan
                </label>
                <textarea
                  rows={2}
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Tambahkan instruksi atau detail..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="px-4 py-2 text-xs text-slate-400 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-lg shadow"
                >
                  Simpan Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Item Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <h3 className="text-base font-extrabold text-white mb-4">Edit Item Checklist</h3>

            <form onSubmit={handleUpdateItemSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nama Item</label>
                <input
                  type="text"
                  required
                  value={editingItem.title}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>

              {/* Status Selector: Sudah vs Belum */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Status Checklist (Sudah / Belum)
                </label>
                <select
                  value={editingItem.isChecked ? 'Sudah' : 'Belum'}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, isChecked: e.target.value === 'Sudah' })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-bold"
                >
                  <option value="Sudah">🟢 Sudah (Selesai/Lengkap)</option>
                  <option value="Belum">🔴 Belum (Belum Di-check)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Jumlah</label>
                  <input
                    type="number"
                    min={1}
                    value={editingItem.quantity}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, quantity: parseInt(e.target.value) || 1 })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Kondisi</label>
                  <select
                    value={editingItem.condition}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, condition: e.target.value as any })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-bold"
                  >
                    <option value="Bagus">🟢 Bagus</option>
                    <option value="Perlu Diperbaiki">🟡 Perlu Diperbaiki</option>
                    <option value="Rusak/Kurang">🔴 Rusak / Kurang</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Catatan</label>
                <textarea
                  rows={2}
                  value={editingItem.note || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, note: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 text-xs text-slate-400 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-lg shadow"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
