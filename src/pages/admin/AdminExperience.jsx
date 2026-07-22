import React, { useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { useData } from '../../contexts/DataContext';
import { Plus, Pencil, Trash2 } from 'lucide-react';

const EMPTY = { role: '', org: '', dateLabel: '', description: '', order: 0 };

export default function AdminExperience() {
  const { experience, addExperience, updateExperience, deleteExperience } = useData();
  const [editing, setEditing] = useState(null); // null = list, {} = form
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const notify = (msg, ok = true) => { setToast({ msg, ok }); setTimeout(() => setToast(null), 2600); };
  const openNew = () => { setForm({ ...EMPTY, order: experience.length }); setEditing({}); };
  const openEdit = (item) => { setForm({ ...EMPTY, ...item }); setEditing(item); };
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  async function save() {
    if (!form.role || !form.org) return notify('Role and organization are required.', false);
    setSaving(true);
    const payload = { ...form, order: Number(form.order) || 0 };
    const res = editing?.id ? await updateExperience(editing.id, payload) : await addExperience(payload);
    setSaving(false);
    if (res.success) { notify('Saved.'); setEditing(null); } else notify(res.error || 'Save failed.', false);
  }
  async function remove(id) {
    if (!window.confirm('Delete this role?')) return;
    const res = await deleteExperience(id);
    notify(res.success ? 'Deleted.' : 'Delete failed.', res.success);
  }

  return (
    <AdminLayout
      title="Experience"
      subtitle="The resume timeline shown on your landing page, top to bottom."
      action={!editing && <button className="a-btn primary" onClick={openNew}><Plus size={18} /> Add role</button>}
    >
      {toast && <div className={`toast ${toast.ok ? 'ok' : 'err'}`}>{toast.msg}</div>}

      {editing ? (
        <div className="a-form">
          <h2>{editing.id ? 'Edit role' : 'New role'}</h2>
          <div className="field-row">
            <div className="field"><label>Role / title</label><input value={form.role} onChange={set('role')} placeholder="Editor-in-Chief" /></div>
            <div className="field"><label>Organization</label><input value={form.org} onChange={set('org')} placeholder="The Campus Ledger" /></div>
          </div>
          <div className="field-row">
            <div className="field"><label>Date label</label><input value={form.dateLabel} onChange={set('dateLabel')} placeholder="2025 — Present" /></div>
            <div className="field"><label>Order</label><input type="number" value={form.order} onChange={set('order')} /><div className="hint">Lower shows first.</div></div>
          </div>
          <div className="field"><label>Description</label><textarea value={form.description} onChange={set('description')} placeholder="What you did and the impact." /></div>
          <div className="form-actions">
            <button className="a-btn primary" onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save role'}</button>
            <button className="a-btn ghost" onClick={() => setEditing(null)}>Cancel</button>
          </div>
        </div>
      ) : experience.length ? (
        <div className="a-list">
          {experience.map((item) => (
            <div className="a-card" key={item.id}>
              <div className="a-card-body">
                <div className="meta">{item.dateLabel}</div>
                <h3>{item.role}</h3>
                <p>{item.org}</p>
              </div>
              <div className="a-card-actions">
                <button className="icon-btn edit" onClick={() => openEdit(item)}><Pencil size={16} /></button>
                <button className="icon-btn del" onClick={() => remove(item.id)}><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="a-empty"><h3>No roles yet</h3><p>Add your first position to build the timeline.</p></div>
      )}
    </AdminLayout>
  );
}
